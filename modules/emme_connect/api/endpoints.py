"""
Emme Connect API Endpoints
FastAPI routes for MLR workflow automation and pharmaceutical compliance
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Request, Depends
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional, Any
import logging

from ..models.content import (
    MLRSubmissionRequest, MLRSubmissionResponse, MLRStatusResponse,
    ContentAsset, ContentMetadata, ContentType, TherapeuticArea
)
from ..models.audit_trail import AuditEvent, ComplianceRecord
from ..services.mlr_workflow import mlr_workflow_service
from ..services.socratiq_integration import SocratIQIntegration
from ..services.content_analyzer import ContentAnalyzer
from ..services.audit_service import AuditService
from ..config import emme_config

logger = logging.getLogger(__name__)
router = APIRouter()

# Dependency injection for services
async def get_mlr_service():
    return mlr_workflow_service

async def get_socratiq_integration():
    return SocratIQIntegration()

async def get_content_analyzer():
    return ContentAnalyzer()

async def get_audit_service():
    return AuditService()


@router.post("/mlr/submit", response_model=MLRSubmissionResponse)
async def submit_mlr_review(
    request: MLRSubmissionRequest,
    background_tasks: BackgroundTasks,
    mlr_service=Depends(get_mlr_service)
) -> MLRSubmissionResponse:
    """
    Submit pharmaceutical content for MLR (Medical Legal Regulatory) review
    
    This endpoint accepts pharmaceutical content submissions and initiates
    automated MLR workflow processing including AI analysis, compliance
    checking, and regulatory review coordination.
    
    Features:
    - Multi-language support (100+ languages)
    - AI-powered content classification and risk assessment
    - Integration with SocratIQ Transform and Mesh services
    - GxP-compliant audit trails (TraceUnits)
    - Automated compliance checking
    - Human reviewer assignment for high-risk content
    """
    try:
        logger.info(f"Received MLR submission request: {request.title}")
        
        # Validate submission request
        if len(request.content_assets) == 0:
            raise HTTPException(
                status_code=400,
                detail="Submission must contain at least one content asset"
            )
        
        # Submit for review
        response = await mlr_service.submit_for_review(request)
        
        logger.info(f"MLR submission {response.submission_id} created successfully")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing MLR submission: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process MLR submission: {str(e)}"
        )


@router.get("/mlr/status/{submission_id}", response_model=MLRStatusResponse)
async def get_mlr_status(
    submission_id: str,
    mlr_service=Depends(get_mlr_service)
) -> MLRStatusResponse:
    """
    Get current status of MLR submission
    
    Returns detailed status information including:
    - Overall submission progress
    - Individual content asset status
    - Review timeline and completion estimates
    - AI analysis results and human review assignments
    - Compliance metrics and audit trail summary
    """
    try:
        logger.info(f"Status request for MLR submission: {submission_id}")
        
        status = await mlr_service.get_submission_status(submission_id)
        
        if not status:
            raise HTTPException(
                status_code=404,
                detail=f"MLR submission {submission_id} not found"
            )
        
        return status
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving MLR status for {submission_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve status: {str(e)}"
        )


@router.get("/mlr/submissions")
async def list_mlr_submissions(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    mlr_service=Depends(get_mlr_service)
) -> Dict[str, Any]:
    """
    List MLR submissions with optional filtering
    
    Query parameters:
    - status: Filter by submission status (submitted, under_review, approved, etc.)
    - limit: Maximum number of results (default: 50)
    - offset: Number of results to skip (default: 0)
    """
    try:
        # Get all active submissions
        submissions = list(mlr_service.active_submissions.values())
        
        # Filter by status if provided
        if status:
            submissions = [s for s in submissions if s.overall_status.value == status]
        
        # Apply pagination
        total_count = len(submissions)
        paginated_submissions = submissions[offset:offset + limit]
        
        # Convert to summary format
        submission_summaries = [
            submission.get_submission_summary() 
            for submission in paginated_submissions
        ]
        
        return {
            "submissions": submission_summaries,
            "pagination": {
                "total_count": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": offset + limit < total_count
            },
            "filters_applied": {"status": status} if status else {}
        }
        
    except Exception as e:
        logger.error(f"Error listing MLR submissions: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list submissions: {str(e)}"
        )


@router.post("/content/analyze")
async def analyze_content(
    content_data: Dict[str, Any],
    content_analyzer=Depends(get_content_analyzer)
) -> Dict[str, Any]:
    """
    Analyze pharmaceutical content for regulatory compliance
    
    Performs comprehensive analysis including:
    - Content classification and risk assessment
    - Medical accuracy verification
    - Regulatory compliance checking
    - Multi-language content analysis
    - AI-powered insights and recommendations
    """
    try:
        logger.info("Received content analysis request")
        
        # Convert request data to ContentAsset
        asset = ContentAsset(**content_data)
        
        # Perform comprehensive analysis
        analysis_result = await content_analyzer.analyze_content(asset)
        
        return {
            "content_id": asset.content_id,
            "analysis_result": analysis_result,
            "analyzer_capabilities": content_analyzer.get_analysis_capabilities(),
            "supported_languages": len(content_analyzer.get_supported_languages()),
            "analysis_timestamp": "2025-08-11T12:58:00Z"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing content: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Content analysis failed: {str(e)}"
        )


@router.get("/content/classify")
async def classify_content(
    title: str,
    content_type: str,
    therapeutic_area: Optional[str] = None,
    medical_claims: List[str] = [],
    content_analyzer=Depends(get_content_analyzer)
) -> Dict[str, Any]:
    """
    Quick content classification for risk assessment
    
    Lightweight endpoint for rapid content classification without
    full analysis. Useful for preliminary risk assessment and
    reviewer assignment during content intake.
    """
    try:
        logger.info(f"Content classification request for: {title}")
        
        # Create minimal ContentAsset for classification
        metadata = ContentMetadata(
            title=title,
            therapeutic_area=TherapeuticArea(therapeutic_area) if therapeutic_area else None,
            medical_claims=medical_claims
        )
        
        asset = ContentAsset(
            title=title,
            content_type=ContentType(content_type),
            metadata=metadata
        )
        
        # Perform classification
        classification_result = await content_analyzer.classify_content(asset)
        
        return {
            "content_classification": classification_result,
            "content_id": asset.content_id,
            "classification_timestamp": "2025-08-11T12:58:00Z"
        }
        
    except Exception as e:
        logger.error(f"Error classifying content: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Content classification failed: {str(e)}"
        )


@router.get("/workflow/metrics")
async def get_workflow_metrics(
    mlr_service=Depends(get_mlr_service),
    audit_service=Depends(get_audit_service)
) -> Dict[str, Any]:
    """
    Get comprehensive MLR workflow performance metrics
    
    Returns metrics including:
    - Workflow performance and completion times
    - AI automation rates and accuracy
    - Audit trail and compliance statistics
    - Service health and configuration
    - Language support and processing capabilities
    """
    try:
        logger.info("Workflow metrics request")
        
        # Get metrics from all services
        workflow_metrics = mlr_service.get_workflow_metrics()
        audit_metrics = audit_service.get_audit_metrics()
        
        return {
            "workflow_metrics": workflow_metrics,
            "audit_metrics": audit_metrics,
            "service_info": {
                "service_name": "Emme Connect",
                "version": "1.0.0",
                "environment": emme_config.environment,
                "uptime": "Running",
                "capabilities": {
                    "mlr_automation": True,
                    "ai_powered_analysis": True,
                    "multi_language_support": f"{len(emme_config.all_supported_languages)} languages",
                    "gxp_compliance": True,
                    "socratiq_integration": True,
                    "audit_trails": True
                }
            },
            "metrics_timestamp": "2025-08-11T12:58:00Z"
        }
        
    except Exception as e:
        logger.error(f"Error retrieving workflow metrics: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve metrics: {str(e)}"
        )


@router.get("/audit/trail/{entity_id}")
async def get_audit_trail(
    entity_id: str,
    include_trace_units: bool = True,
    include_events: bool = True,
    include_compliance: bool = True,
    audit_service=Depends(get_audit_service)
) -> Dict[str, Any]:
    """
    Get GxP-compliant audit trail for an entity
    
    Returns comprehensive audit trail including:
    - Immutable trace units with digital signatures
    - Audit events and regulatory activities
    - Compliance records and verification status
    - Chain integrity verification results
    """
    try:
        logger.info(f"Audit trail request for entity: {entity_id}")
        
        # Get audit trail
        audit_trail = await audit_service.get_audit_trail(entity_id)
        
        if not audit_trail:
            raise HTTPException(
                status_code=404,
                detail=f"Audit trail not found for entity {entity_id}"
            )
        
        # Get compliance summary
        compliance_summary = await audit_service.get_compliance_summary(entity_id)
        
        # Verify trail integrity
        integrity_check = await audit_service.verify_trail_integrity(entity_id)
        
        response_data = {
            "entity_id": entity_id,
            "trail_summary": audit_trail.get_trail_summary(),
            "compliance_summary": compliance_summary,
            "integrity_verification": integrity_check
        }
        
        # Include detailed data based on query parameters
        if include_trace_units:
            response_data["trace_units"] = [
                {
                    "trace_id": tu.trace_id,
                    "action_type": tu.action_type,
                    "user_id": tu.user_id,
                    "timestamp": tu.timestamp.isoformat(),
                    "content_hash": tu.content_hash,
                    "digital_signature": tu.digital_signature
                }
                for tu in audit_trail.trace_units
            ]
        
        if include_events:
            response_data["audit_events"] = [
                {
                    "event_id": ae.event_id,
                    "event_type": ae.event_type,
                    "description": ae.description,
                    "timestamp": ae.timestamp.isoformat(),
                    "regulatory_impact": ae.regulatory_impact
                }
                for ae in audit_trail.audit_events
            ]
        
        if include_compliance:
            response_data["compliance_records"] = [
                {
                    "record_id": cr.record_id,
                    "compliance_type": cr.compliance_type,
                    "compliance_status": cr.compliance_status,
                    "verification_timestamp": cr.verification_timestamp.isoformat()
                }
                for cr in audit_trail.compliance_records
            ]
        
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving audit trail for {entity_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve audit trail: {str(e)}"
        )


@router.post("/audit/seal/{entity_id}")
async def seal_audit_trail(
    entity_id: str,
    seal_request: Dict[str, str] = {},
    audit_service=Depends(get_audit_service)
) -> Dict[str, Any]:
    """
    Seal audit trail for GxP compliance
    
    Seals the audit trail to prevent further modifications,
    ensuring regulatory compliance and data integrity.
    Required for pharmaceutical compliance submissions.
    """
    try:
        logger.info(f"Audit trail seal request for entity: {entity_id}")
        
        seal_key = seal_request.get("seal_key", "default_regulatory_seal")
        
        # Seal the audit trail
        seal_result = await audit_service.seal_audit_trail(entity_id, seal_key)
        
        if not seal_result.get("sealed", False):
            raise HTTPException(
                status_code=400,
                detail=f"Failed to seal audit trail: {seal_result.get('error', 'Unknown error')}"
            )
        
        return seal_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sealing audit trail for {entity_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to seal audit trail: {str(e)}"
        )


@router.get("/integration/socratiq/status")
async def get_socratiq_integration_status(
    socratiq=Depends(get_socratiq_integration)
) -> Dict[str, Any]:
    """
    Get status of SocratIQ service integrations
    
    Checks connectivity and health of:
    - SocratIQ Transform (NLP processing)
    - SocratIQ Mesh (Knowledge graph)
    """
    try:
        logger.info("SocratIQ integration status check")
        
        # Initialize and check services
        await socratiq.initialize()
        
        return {
            "integration_status": "operational",
            "services": {
                "transform_service": {
                    "available": socratiq.transform_available,
                    "url": emme_config.transform_service_url,
                    "capabilities": ["nlp_analysis", "entity_extraction", "sentiment_analysis"]
                },
                "mesh_service": {
                    "available": socratiq.mesh_available,
                    "url": emme_config.mesh_service_url,
                    "capabilities": ["knowledge_graph", "cross_references", "regulatory_context"]
                }
            },
            "check_timestamp": "2025-08-11T12:58:00Z"
        }
        
    except Exception as e:
        logger.error(f"Error checking SocratIQ integration status: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check integration status: {str(e)}"
        )


@router.get("/languages/supported")
async def get_supported_languages() -> Dict[str, Any]:
    """
    Get list of supported languages for health equity
    
    Returns comprehensive list of 100+ supported languages
    for pharmaceutical content processing and MLR review
    """
    try:
        return {
            "total_supported": len(emme_config.all_supported_languages),
            "primary_languages": emme_config.primary_languages,
            "extended_languages": emme_config.extended_languages,
            "health_equity_commitment": "Supporting 100+ languages to ensure equitable access to pharmaceutical information",
            "language_capabilities": {
                "content_analysis": True,
                "risk_assessment": True,
                "compliance_checking": True,
                "regulatory_review": True
            }
        }
        
    except Exception as e:
        logger.error(f"Error retrieving supported languages: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve language information: {str(e)}"
        )


@router.get("/config")
async def get_service_configuration() -> Dict[str, Any]:
    """
    Get Emme Connect service configuration
    
    Returns current service configuration including:
    - MLR workflow settings
    - AI model configuration
    - Compliance and audit settings
    - Integration endpoints
    - Performance parameters
    """
    try:
        return {
            "service_info": {
                "name": emme_config.app_name,
                "version": emme_config.version,
                "environment": emme_config.environment,
                "port": emme_config.port
            },
            "workflow_config": {
                "target_completion_hours": emme_config.target_completion_hours,
                "ai_confidence_threshold": emme_config.ai_review_confidence_threshold,
                "human_escalation_threshold": emme_config.human_escalation_threshold,
                "parallel_review_enabled": emme_config.enable_parallel_review,
                "max_concurrent_reviews": emme_config.max_concurrent_reviews
            },
            "ai_config": {
                "model_name": emme_config.ai_model_name,
                "temperature": emme_config.ai_temperature,
                "max_tokens": emme_config.ai_max_tokens
            },
            "compliance_config": {
                "gxp_compliance_enabled": True,
                "digital_signatures_required": emme_config.digital_signature_required,
                "retention_period_years": emme_config.retention_period_years,
                "audit_trail_immutability": emme_config.enable_blockchain_immutability
            },
            "integration_config": {
                "socratiq_base_url": emme_config.socratiq_base_url,
                "emme_engage_url": emme_config.emme_engage_url
            },
            "language_support": {
                "total_languages": len(emme_config.all_supported_languages),
                "health_equity_focus": True
            }
        }
        
    except Exception as e:
        logger.error(f"Error retrieving service configuration: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve configuration: {str(e)}"
        )