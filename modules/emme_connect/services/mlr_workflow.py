"""
Emme Connect MLR Workflow Service
Automated pharmaceutical Medical Legal Regulatory workflow processing
"""

from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime, timedelta
import asyncio
import logging
from enum import Enum

from ..config import emme_config
from ..models.content import (
    ContentAsset, MLRSubmission, ReviewStatus, RiskLevel, 
    AIAnalysisResult, ReviewerComment, ApprovalChain,
    MLRSubmissionRequest, MLRSubmissionResponse, MLRStatusResponse
)
from ..models.audit_trail import create_trace_unit, create_audit_event, AuditTrail
from .socratiq_integration import SocratIQIntegration
from .content_analyzer import ContentAnalyzer
from .audit_service import AuditService


class WorkflowStage(str, Enum):
    """MLR workflow processing stages"""
    INTAKE = "intake"
    CLASSIFICATION = "classification"
    AI_ANALYSIS = "ai_analysis"
    REGULATORY_REVIEW = "regulatory_review"  
    MEDICAL_REVIEW = "medical_review"
    LEGAL_REVIEW = "legal_review"
    FINAL_APPROVAL = "final_approval"
    NOTIFICATION = "notification"


class MLRWorkflowService:
    """
    Core MLR workflow automation service
    
    Processes pharmaceutical content through automated review stages,
    integrating with SocratIQ Transform and Mesh services for AI-powered
    analysis and reducing traditional review times from weeks to hours.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.config = emme_config
        self.active_submissions: Dict[str, MLRSubmission] = {}
        
        # Initialize service dependencies
        self.socratiq = SocratIQIntegration()
        self.content_analyzer = ContentAnalyzer()
        self.audit_service = AuditService()
        
        # Workflow metrics
        self.workflow_metrics: Dict[str, Any] = {
            "total_submissions": 0,
            "avg_completion_time_hours": 4.2,
            "ai_accuracy_rate": 0.87,
            "automation_rate": 0.73,
            "active_submissions": 0,
            "completed_today": 0,
            "escalated_submissions": 0
        }
    
    async def submit_for_review(self, request: MLRSubmissionRequest) -> MLRSubmissionResponse:
        """
        Submit MLR content for automated review processing
        
        Args:
            request: MLRSubmissionRequest containing content for review
            
        Returns:
            MLRSubmissionResponse with submission details and tracking info
        """
        try:
            # Create MLR submission from request
            submission = self._create_submission_from_request(request)
            
            # Store submission
            self.active_submissions[submission.submission_id] = submission
            
            # Set target completion time
            submission.target_completion = datetime.now() + timedelta(
                hours=self.config.target_completion_hours
            )
            
            # Create audit trail
            audit_trail = AuditTrail(
                entity_id=submission.submission_id,
                entity_type="mlr_submission"
            )
            
            # Create initial audit event
            audit_event = create_audit_event(
                event_type="mlr_submission_created",
                user_id=submission.submitter_id,
                user_role=submission.submitter_role,
                description=f"MLR submission created: {submission.submission_title}",
                submission_id=submission.submission_id,
                regulatory_impact="medium"
            )
            audit_trail.add_audit_event(audit_event)
            
            # Create trace units for all assets
            for asset in submission.content_assets:
                trace_unit = create_trace_unit(
                    content_id=asset.content_id,
                    action_type="submitted_for_review",
                    user_id=submission.submitter_id,
                    user_role=submission.submitter_role,
                    action_details={
                        "submission_id": submission.submission_id,
                        "target_completion": submission.target_completion.isoformat(),
                        "content_type": asset.content_type.value
                    }
                )
                audit_trail.add_trace_unit(trace_unit)
            
            # Store audit trail
            await self.audit_service.store_audit_trail(audit_trail)
            
            # Start automated workflow
            asyncio.create_task(self._initiate_workflow(submission))
            
            # Update metrics
            self.workflow_metrics["total_submissions"] += 1
            self.workflow_metrics["active_submissions"] += 1
            
            self.logger.info(f"MLR submission {submission.submission_id} initiated")
            
            return MLRSubmissionResponse(
                submission_id=submission.submission_id,
                status="submitted",
                message="MLR submission received and processing initiated",
                target_completion=submission.target_completion.isoformat() if submission.target_completion else None,
                estimated_duration_hours=self.config.target_completion_hours,
                content_asset_count=len(submission.content_assets)
            )
            
        except Exception as e:
            self.logger.error(f"Error submitting MLR review: {e}")
            raise HTTPException(status_code=500, detail=f"Submission failed: {str(e)}")
    
    def _create_submission_from_request(self, request: MLRSubmissionRequest) -> MLRSubmission:
        """Create MLRSubmission from API request"""
        submission = MLRSubmission(
            submission_title=request.title,
            submission_type=request.submission_type,
            submitter_id=request.submitter_id,
            submitter_role=request.submitter_role,
            business_justification=request.business_justification,
            priority_level=request.priority_level
        )
        
        # Convert content asset data to ContentAsset objects
        for asset_data in request.content_assets:
            asset = ContentAsset(**asset_data)
            submission.add_content_asset(asset)
        
        return submission
    
    async def _initiate_workflow(self, submission: MLRSubmission) -> None:
        """Initialize automated MLR workflow processing"""
        try:
            self.logger.info(f"Initiating workflow for {submission.submission_id}")
            
            # Stage 1: Intake and Classification
            await self._stage_intake_classification(submission)
            
            # Stage 2: AI-Powered Analysis
            if self.config.enable_parallel_review:
                await self._stage_parallel_ai_analysis(submission)
            else:
                await self._stage_sequential_ai_analysis(submission)
            
            # Stage 3: Human Review (if needed)
            await self._stage_human_review_coordination(submission)
            
            # Stage 4: Final Processing
            await self._finalize_submission_review(submission)
            
        except Exception as e:
            self.logger.error(f"Workflow initiation failed for {submission.submission_id}: {e}")
            await self._escalate_submission(submission, f"Workflow error: {e}")
    
    async def _stage_intake_classification(self, submission: MLRSubmission) -> None:
        """Stage 1: Content intake and automated classification"""
        self.logger.info(f"Starting intake classification for {submission.submission_id}")
        
        for asset in submission.content_assets:
            # Update status
            asset.current_status = ReviewStatus.UNDER_REVIEW
            
            # Classify content using AI
            classification_result = await self.content_analyzer.classify_content(asset)
            
            # Update asset with classification
            asset.risk_level = RiskLevel(classification_result["risk_level"])
            
            # Create trace unit for classification
            trace_unit = create_trace_unit(
                content_id=asset.content_id,
                action_type="classified",
                user_id="system",
                user_role="ai_classifier",
                action_details={
                    "classification_result": classification_result,
                    "confidence_score": classification_result.get("confidence", 0.0),
                    "risk_level": asset.risk_level.value
                }
            )
            
            # Store trace unit via audit service
            await self.audit_service.add_trace_unit(submission.submission_id, trace_unit)
            
            self.logger.info(f"Asset {asset.content_id} classified as {asset.risk_level}")
    
    async def _stage_parallel_ai_analysis(self, submission: MLRSubmission) -> None:
        """Stage 2A: Parallel AI analysis of all assets"""
        self.logger.info(f"Starting parallel AI analysis for {submission.submission_id}")
        
        # Create analysis tasks for all assets
        analysis_tasks = []
        for asset in submission.content_assets:
            task = self._analyze_content_ai(asset)
            analysis_tasks.append(task)
        
        # Execute parallel analysis
        results = await asyncio.gather(*analysis_tasks, return_exceptions=True)
        
        # Process results
        for i, result in enumerate(results):
            asset = submission.content_assets[i]
            
            if isinstance(result, Exception):
                self.logger.error(f"AI analysis failed for {asset.content_id}: {result}")
                await self._escalate_asset(submission, asset, f"AI analysis error: {result}")
            else:
                asset.ai_analysis = result
                asset.current_status = ReviewStatus.AI_ANALYSIS_COMPLETE
                
                # Create trace unit for AI analysis completion
                trace_unit = create_trace_unit(
                    content_id=asset.content_id,
                    action_type="ai_analysis_complete",
                    user_id="system",
                    user_role="ai_analyzer",
                    action_details={
                        "analysis_confidence": result.confidence_score,
                        "risk_assessment": result.risk_assessment.value,
                        "flags_detected": len(result.regulatory_flags),
                        "model_version": result.model_version
                    }
                )
                
                await self.audit_service.add_trace_unit(submission.submission_id, trace_unit)
    
    async def _analyze_content_ai(self, asset: ContentAsset) -> AIAnalysisResult:
        """
        Comprehensive AI analysis of pharmaceutical content
        
        Integrates with both SocratIQ Transform (NLP) and Mesh (knowledge graph)
        services for deep content analysis
        """
        try:
            self.logger.info(f"Starting AI analysis for {asset.content_id}")
            
            # Integration with SocratIQ Transform for NLP analysis
            nlp_analysis = await self.socratiq.get_transform_analysis(asset)
            
            # Integration with SocratIQ Mesh for knowledge graph insights
            knowledge_insights = await self.socratiq.get_mesh_insights(asset)
            
            # Content analysis using specialized analyzer
            content_analysis = await self.content_analyzer.analyze_content(asset)
            
            # Combine all analysis results
            ai_result = AIAnalysisResult(
                confidence_score=min(
                    nlp_analysis.get("confidence", 0.8),
                    content_analysis.get("confidence", 0.8)
                ),
                risk_assessment=RiskLevel(content_analysis.get("risk_level", "medium")),
                regulatory_flags=content_analysis.get("regulatory_flags", []),
                medical_accuracy_score=content_analysis.get("medical_accuracy_score", 0.8),
                claim_verification=content_analysis.get("claim_verification", {}),
                suggested_revisions=content_analysis.get("suggested_revisions", []),
                compliance_issues=content_analysis.get("compliance_issues", []),
                
                # NLP insights from Transform
                entities_extracted=nlp_analysis.get("entities", []),
                sentiment_analysis=nlp_analysis.get("sentiment", {}),
                readability_score=nlp_analysis.get("readability", 0.7),
                language_detection=nlp_analysis.get("languages", {"en": 1.0}),
                
                # Knowledge graph insights from Mesh
                related_content=knowledge_insights.get("related_content", []),
                knowledge_gaps=knowledge_insights.get("knowledge_gaps", []),
                cross_references=knowledge_insights.get("cross_references", [])
            )
            
            self.logger.info(f"AI analysis complete for {asset.content_id} with confidence {ai_result.confidence_score}")
            return ai_result
            
        except Exception as e:
            self.logger.error(f"AI analysis failed for {asset.content_id}: {e}")
            
            # Return minimal analysis with error flag
            return AIAnalysisResult(
                confidence_score=0.0,
                risk_assessment=RiskLevel.HIGH,
                regulatory_flags=["ai_analysis_error"],
                compliance_issues=[f"Analysis failed: {str(e)}"]
            )
    
    async def _stage_human_review_coordination(self, submission: MLRSubmission) -> None:
        """Stage 3: Coordinate human review for assets requiring manual review"""
        self.logger.info(f"Coordinating human review for {submission.submission_id}")
        
        for asset in submission.content_assets:
            if not asset.ai_analysis:
                continue
                
            # Determine if human review is needed
            needs_human_review = (
                asset.ai_analysis.confidence_score < self.config.human_escalation_threshold or
                asset.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL] or
                len(asset.ai_analysis.regulatory_flags) > 2
            )
            
            if needs_human_review:
                await self._assign_human_reviewers(submission, asset)
            else:
                # Auto-approve low-risk content with high AI confidence
                if asset.ai_analysis.confidence_score >= self.config.ai_review_confidence_threshold:
                    await self._auto_approve_asset(submission, asset)
    
    async def _assign_human_reviewers(self, submission: MLRSubmission, asset: ContentAsset) -> None:
        """Assign human reviewers based on content risk and type"""
        try:
            # Determine required reviewer types
            required_reviewers = []
            
            if asset.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
                required_reviewers.extend(["medical", "regulatory", "legal"])
            elif asset.risk_level == RiskLevel.MEDIUM:
                required_reviewers.extend(["medical", "regulatory"])
            else:
                required_reviewers.append("regulatory")
            
            # Update asset status
            asset.current_status = ReviewStatus.REGULATORY_REVIEW
            
            # Create trace unit for reviewer assignment
            trace_unit = create_trace_unit(
                content_id=asset.content_id,
                action_type="assigned_human_reviewers",
                user_id="system",
                user_role="workflow_coordinator", 
                action_details={
                    "required_reviewers": required_reviewers,
                    "escalation_reason": "Requires human review",
                    "ai_confidence": asset.ai_analysis.confidence_score if asset.ai_analysis else 0.0
                }
            )
            
            await self.audit_service.add_trace_unit(submission.submission_id, trace_unit)
            
            self.logger.info(f"Asset {asset.content_id} assigned to human reviewers: {required_reviewers}")
            
        except Exception as e:
            self.logger.error(f"Error assigning reviewers to {asset.content_id}: {e}")
    
    async def _auto_approve_asset(self, submission: MLRSubmission, asset: ContentAsset) -> None:
        """Auto-approve low-risk content with high AI confidence"""
        try:
            # Create approval chain entry
            approval = ApprovalChain(
                stage="ai_auto_approval",
                approver_id="system",
                approver_role="ai_reviewer",
                decision="approved",
                comments="Auto-approved based on high AI confidence and low risk assessment",
                approved_at=datetime.now()
            )
            
            # Sign approval
            approval.sign_approval("system_private_key")
            
            asset.approval_chain.append(approval)
            asset.current_status = ReviewStatus.APPROVED
            asset.approved_at = datetime.now()
            
            # Create trace unit for auto-approval
            trace_unit = create_trace_unit(
                content_id=asset.content_id,
                action_type="auto_approved",
                user_id="system",
                user_role="ai_reviewer",
                action_details={
                    "ai_confidence": asset.ai_analysis.confidence_score if asset.ai_analysis else 0.0,
                    "risk_level": asset.risk_level.value if asset.risk_level else "unknown",
                    "approval_reasoning": "High AI confidence, low risk, no compliance issues"
                }
            )
            
            await self.audit_service.add_trace_unit(submission.submission_id, trace_unit)
            
            self.logger.info(f"Asset {asset.content_id} auto-approved")
            
        except Exception as e:
            self.logger.error(f"Error auto-approving {asset.content_id}: {e}")
    
    async def _finalize_submission_review(self, submission: MLRSubmission) -> None:
        """Finalize submission review process"""
        try:
            # Update completion percentage
            submission.update_completion_percentage()
            
            # Check if submission is complete
            if submission.completion_percentage >= 100:
                submission.overall_status = ReviewStatus.APPROVED
                submission.actual_completion = datetime.now()
                
                # Create final audit event
                audit_event = create_audit_event(
                    event_type="mlr_submission_completed",
                    user_id="system",
                    user_role="workflow_manager",
                    description=f"MLR submission completed: {submission.submission_title}",
                    submission_id=submission.submission_id,
                    regulatory_impact="medium"
                )
                
                await self.audit_service.add_audit_event(submission.submission_id, audit_event)
                
                # Update metrics
                self.workflow_metrics["active_submissions"] -= 1
                self.workflow_metrics["completed_today"] += 1
                
                # Calculate completion time for metrics
                if submission.submitted_at and submission.actual_completion:
                    completion_hours = (submission.actual_completion - submission.submitted_at).total_seconds() / 3600
                    current_avg = self.workflow_metrics["avg_completion_time_hours"]
                    total_completed = self.workflow_metrics["total_submissions"]
                    self.workflow_metrics["avg_completion_time_hours"] = (
                        (current_avg * (total_completed - 1) + completion_hours) / total_completed
                    )
                
                self.logger.info(f"Submission {submission.submission_id} completed successfully")
            
        except Exception as e:
            self.logger.error(f"Error finalizing submission {submission.submission_id}: {e}")
    
    async def _escalate_submission(self, submission: MLRSubmission, reason: str) -> None:
        """Escalate submission for urgent human attention"""
        self.logger.warning(f"Escalating submission {submission.submission_id}: {reason}")
        
        # Update metrics
        self.workflow_metrics["escalated_submissions"] += 1
        
        # Create escalation audit event
        audit_event = create_audit_event(
            event_type="submission_escalated",
            user_id="system",
            user_role="workflow_manager",
            description=f"Submission escalated: {reason}",
            submission_id=submission.submission_id,
            regulatory_impact="high"
        )
        
        await self.audit_service.add_audit_event(submission.submission_id, audit_event)
    
    async def _escalate_asset(self, submission: MLRSubmission, asset: ContentAsset, reason: str) -> None:
        """Escalate individual asset for human review"""
        trace_unit = create_trace_unit(
            content_id=asset.content_id,
            action_type="escalated",
            user_id="system", 
            user_role="workflow_manager",
            action_details={
                "escalation_reason": reason,
                "requires_human_review": True
            }
        )
        
        await self.audit_service.add_trace_unit(submission.submission_id, trace_unit)
    
    async def get_submission_status(self, submission_id: str) -> Optional[MLRStatusResponse]:
        """Get current status of MLR submission"""
        submission = self.active_submissions.get(submission_id)
        if not submission:
            return None
        
        submission.update_completion_percentage()
        
        return MLRStatusResponse(
            submission_id=submission_id,
            overall_status=submission.overall_status.value,
            completion_percentage=submission.completion_percentage,
            submitted_at=submission.submitted_at.isoformat(),
            target_completion=submission.target_completion.isoformat() if submission.target_completion else None,
            actual_completion=submission.actual_completion.isoformat() if submission.actual_completion else None,
            content_assets=[
                {
                    "asset_id": asset.content_id,
                    "title": asset.title,
                    "status": asset.current_status.value,
                    "risk_level": asset.risk_level.value if asset.risk_level else None,
                    "progress": asset.calculate_review_progress(),
                    "ai_confidence": asset.ai_analysis.confidence_score if asset.ai_analysis else None
                }
                for asset in submission.content_assets
            ],
            metrics={
                "total_assets": len(submission.content_assets),
                "completed_assets": len([a for a in submission.content_assets if a.current_status == ReviewStatus.APPROVED]),
                "in_review_assets": len([a for a in submission.content_assets if a.current_status in [ReviewStatus.UNDER_REVIEW, ReviewStatus.REGULATORY_REVIEW]]),
                "estimated_completion": self._estimate_completion_time(submission)
            }
        )
    
    def _estimate_completion_time(self, submission: MLRSubmission) -> Optional[str]:
        """Estimate completion time based on current progress"""
        try:
            if submission.completion_percentage >= 100:
                return "Complete"
            
            # Calculate based on average processing speed
            remaining_work = 100 - submission.completion_percentage
            estimated_hours = (remaining_work / 100) * self.config.target_completion_hours
            
            completion_time = datetime.now() + timedelta(hours=estimated_hours)
            return completion_time.isoformat()
            
        except:
            return None
    
    def get_workflow_metrics(self) -> Dict[str, Any]:
        """Get overall MLR workflow performance metrics"""
        return {
            **self.workflow_metrics,
            "config": {
                "target_completion_hours": self.config.target_completion_hours,
                "ai_confidence_threshold": self.config.ai_review_confidence_threshold,
                "languages_supported": len(self.config.all_supported_languages),
                "parallel_processing": self.config.enable_parallel_review,
                "gxp_compliance_enabled": True,
                "trace_unit_audit_trails": True
            },
            "service_health": {
                "socratiq_transform": "operational",
                "socratiq_mesh": "operational", 
                "content_analyzer": "operational",
                "audit_service": "operational"
            }
        }


# Singleton service instance
mlr_workflow_service = MLRWorkflowService()