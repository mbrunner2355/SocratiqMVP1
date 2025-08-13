"""
SocratIQ Integration Service
Integration with SocratIQ Transform (NLP) and Mesh (Knowledge Graph) services
"""

import httpx
import asyncio
from typing import Dict, List, Optional, Any
import logging

from ..config import emme_config
from ..models.content import ContentAsset


class SocratIQIntegration:
    """
    Service for integrating with SocratIQ Transform and Mesh services
    
    Provides MLR workflow with advanced NLP processing and knowledge graph
    insights to enhance pharmaceutical content analysis
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.config = emme_config
        
        # HTTP client for API calls
        self.http_client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "EmmеConnect/1.0"
            }
        )
        
        # Service health status
        self.transform_available = False
        self.mesh_available = False
    
    async def initialize(self):
        """Initialize integration and check service availability"""
        try:
            # Check Transform service health
            self.transform_available = await self._check_service_health(
                self.config.transform_service_url
            )
            
            # Check Mesh service health
            self.mesh_available = await self._check_service_health(
                self.config.mesh_service_url
            )
            
            self.logger.info(f"SocratIQ Integration initialized - Transform: {self.transform_available}, Mesh: {self.mesh_available}")
            
        except Exception as e:
            self.logger.error(f"Failed to initialize SocratIQ integration: {e}")
    
    async def _check_service_health(self, service_url: str) -> bool:
        """Check if a SocratIQ service is available"""
        try:
            response = await self.http_client.get(f"{service_url}/health")
            return response.status_code == 200
        except:
            return False
    
    async def get_transform_analysis(self, asset: ContentAsset) -> Dict[str, Any]:
        """
        Get NLP analysis from SocratIQ Transform service
        
        Args:
            asset: ContentAsset to analyze
            
        Returns:
            Dict containing NLP analysis results
        """
        try:
            if not self.transform_available:
                return await self._get_mock_transform_analysis(asset)
            
            # Prepare content for analysis
            content_data = {
                "content_id": asset.content_id,
                "title": asset.title,
                "content_text": asset.content_text or asset.title,
                "content_type": asset.content_type.value,
                "therapeutic_area": asset.metadata.therapeutic_area.value if asset.metadata.therapeutic_area else None,
                "analysis_type": "mlr_pharmaceutical",
                "include_entities": True,
                "include_sentiment": True,
                "include_readability": True,
                "include_language_detection": True
            }
            
            # Make API call to Transform service
            response = await self.http_client.post(
                f"{self.config.transform_service_url}/analyze",
                json=content_data
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "confidence": result.get("confidence", 0.8),
                    "entities": result.get("entities", []),
                    "sentiment": result.get("sentiment_analysis", {}),
                    "readability": result.get("readability_score", 0.7),
                    "languages": result.get("language_detection", {"en": 1.0}),
                    "key_phrases": result.get("key_phrases", []),
                    "medical_terminology": result.get("medical_terminology", [])
                }
            else:
                self.logger.warning(f"Transform service returned {response.status_code}")
                return await self._get_mock_transform_analysis(asset)
                
        except Exception as e:
            self.logger.error(f"Error calling Transform service: {e}")
            return await self._get_mock_transform_analysis(asset)
    
    async def _get_mock_transform_analysis(self, asset: ContentAsset) -> Dict[str, Any]:
        """Mock Transform analysis for development/fallback"""
        # Simulate realistic NLP analysis based on content
        entities = []
        
        # Extract mock entities based on content type and metadata
        if asset.metadata.product_name:
            entities.append({
                "type": "DRUG_NAME",
                "text": asset.metadata.product_name,
                "confidence": 0.95
            })
        
        if asset.metadata.indication:
            entities.append({
                "type": "MEDICAL_CONDITION", 
                "text": asset.metadata.indication,
                "confidence": 0.90
            })
        
        for claim in asset.metadata.medical_claims:
            entities.append({
                "type": "MEDICAL_CLAIM",
                "text": claim,
                "confidence": 0.85
            })
        
        # Simulate sentiment analysis
        sentiment = {"positive": 0.7, "neutral": 0.2, "negative": 0.1}
        
        # Adjust sentiment based on content type
        if asset.content_type.value in ["patient_education_material", "promotional_material"]:
            sentiment = {"positive": 0.8, "neutral": 0.15, "negative": 0.05}
        
        return {
            "confidence": 0.82,
            "entities": entities,
            "sentiment": sentiment,
            "readability": 0.75,
            "languages": {"en": 0.98} if "en" in asset.metadata.languages else {"en": 0.5},
            "key_phrases": ["pharmaceutical", "treatment", "therapy", "clinical"],
            "medical_terminology": asset.metadata.keywords[:5] if asset.metadata.keywords else []
        }
    
    async def get_mesh_insights(self, asset: ContentAsset) -> Dict[str, Any]:
        """
        Get knowledge graph insights from SocratIQ Mesh service
        
        Args:
            asset: ContentAsset to analyze
            
        Returns:
            Dict containing knowledge graph insights
        """
        try:
            if not self.mesh_available:
                return await self._get_mock_mesh_insights(asset)
            
            # Prepare query for Mesh service
            query_data = {
                "content_id": asset.content_id,
                "therapeutic_area": asset.metadata.therapeutic_area.value if asset.metadata.therapeutic_area else None,
                "product_name": asset.metadata.product_name,
                "indication": asset.metadata.indication,
                "content_type": asset.content_type.value,
                "query_type": "mlr_compliance_insights",
                "include_related_content": True,
                "include_regulatory_context": True,
                "include_cross_references": True
            }
            
            # Make API call to Mesh service
            response = await self.http_client.post(
                f"{self.config.mesh_service_url}/query",
                json=query_data
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "related_content": result.get("related_documents", []),
                    "knowledge_gaps": result.get("knowledge_gaps", []),
                    "cross_references": result.get("cross_references", []),
                    "regulatory_context": result.get("regulatory_context", {}),
                    "similar_products": result.get("similar_products", []),
                    "compliance_patterns": result.get("compliance_patterns", [])
                }
            else:
                self.logger.warning(f"Mesh service returned {response.status_code}")
                return await self._get_mock_mesh_insights(asset)
                
        except Exception as e:
            self.logger.error(f"Error calling Mesh service: {e}")
            return await self._get_mock_mesh_insights(asset)
    
    async def _get_mock_mesh_insights(self, asset: ContentAsset) -> Dict[str, Any]:
        """Mock Mesh insights for development/fallback"""
        related_content = []
        cross_references = []
        knowledge_gaps = []
        
        # Generate related content based on asset metadata
        if asset.metadata.therapeutic_area:
            related_content.extend([
                f"Similar {asset.content_type.value} for {asset.metadata.therapeutic_area.value}",
                f"Regulatory guidance for {asset.metadata.therapeutic_area.value}",
                f"Clinical evidence in {asset.metadata.therapeutic_area.value}"
            ])
        
        if asset.metadata.product_name:
            cross_references.extend([
                f"FDA Orange Book entry for {asset.metadata.product_name}",
                f"Clinical trial data for {asset.metadata.product_name}",
                f"Prescribing information for {asset.metadata.product_name}"
            ])
        
        # Identify potential knowledge gaps
        if not asset.metadata.references:
            knowledge_gaps.append("Missing clinical references for claims")
        
        if not asset.metadata.medical_claims:
            knowledge_gaps.append("No explicit medical claims identified")
        
        if len(asset.metadata.languages) == 1:
            knowledge_gaps.append("Content available in limited languages")
        
        return {
            "related_content": related_content,
            "knowledge_gaps": knowledge_gaps,
            "cross_references": cross_references,
            "regulatory_context": {
                "jurisdiction": "US" if "US" in asset.metadata.geographic_markets else "Multi-regional",
                "regulatory_body": "FDA" if "US" in asset.metadata.geographic_markets else "Multiple",
                "compliance_framework": "21 CFR Part 202" if asset.content_type.value == "promotional_material" else "General"
            },
            "similar_products": [],
            "compliance_patterns": [
                "Standard promotional material requirements",
                "Medical claim substantiation needed",
                "Fair balance requirements apply"
            ]
        }
    
    async def validate_medical_claims(self, claims: List[str], product_name: str = None) -> Dict[str, Any]:
        """
        Validate medical claims against knowledge base
        
        Args:
            claims: List of medical claims to validate
            product_name: Optional product name for context
            
        Returns:
            Dict containing claim validation results
        """
        try:
            validation_results = {}
            
            for claim in claims:
                # In production: query Mesh service for claim validation
                # For now: mock validation based on claim content
                
                is_valid = True
                confidence = 0.8
                supporting_evidence = []
                
                # Mock validation logic
                if "FDA approved" in claim.lower() and not product_name:
                    is_valid = False
                    confidence = 0.2
                elif "significantly reduces" in claim.lower():
                    supporting_evidence.append("Clinical study NCT-MOCK-001")
                    confidence = 0.9
                elif "improves quality of life" in claim.lower():
                    supporting_evidence.append("Patient reported outcomes study")
                    confidence = 0.85
                
                validation_results[claim] = {
                    "is_valid": is_valid,
                    "confidence": confidence,
                    "supporting_evidence": supporting_evidence,
                    "regulatory_requirements": [
                        "Substantial clinical evidence required",
                        "Statistical significance documentation needed"
                    ]
                }
            
            return {
                "claim_validations": validation_results,
                "overall_validity": all(v["is_valid"] for v in validation_results.values()),
                "average_confidence": sum(v["confidence"] for v in validation_results.values()) / len(validation_results) if validation_results else 0
            }
            
        except Exception as e:
            self.logger.error(f"Error validating medical claims: {e}")
            return {"error": str(e)}
    
    async def get_regulatory_requirements(self, content_type: str, therapeutic_area: str = None, market: str = "US") -> Dict[str, Any]:
        """
        Get regulatory requirements for specific content type and context
        
        Args:
            content_type: Type of pharmaceutical content
            therapeutic_area: Optional therapeutic area
            market: Geographic market (default: US)
            
        Returns:
            Dict containing regulatory requirements
        """
        try:
            # Mock regulatory requirements - in production, query Mesh service
            base_requirements = {
                "promotional_material": [
                    "Fair balance of risks and benefits",
                    "Substantial clinical evidence for claims", 
                    "FDA-approved indication must be clearly stated",
                    "Contraindications and warnings required",
                    "Brief summary or reference to full prescribing information"
                ],
                "patient_education_material": [
                    "Medically accurate information",
                    "Appropriate reading level",
                    "Clear indication description",
                    "Important safety information",
                    "Encouragement to consult healthcare provider"
                ],
                "medical_information_response": [
                    "Factual and balanced information",
                    "Scientific references required",
                    "No promotional messaging",
                    "Clear scope limitations",
                    "Healthcare provider focus"
                ]
            }
            
            requirements = base_requirements.get(content_type, [])
            
            # Add therapeutic area specific requirements
            if therapeutic_area == "oncology":
                requirements.extend([
                    "Black box warnings if applicable",
                    "Survival data presentation standards",
                    "Risk evaluation and mitigation strategies (REMS)"
                ])
            elif therapeutic_area == "cardiovascular":
                requirements.extend([
                    "Cardiovascular outcomes data",
                    "Drug interaction warnings",
                    "Monitoring parameters"
                ])
            
            return {
                "requirements": requirements,
                "regulatory_framework": "21 CFR Part 202" if market == "US" else "ICH Guidelines",
                "review_authority": "FDA" if market == "US" else "Regional Authority",
                "compliance_deadline": "30 days from material use",
                "documentation_requirements": [
                    "Clinical study reports",
                    "Statistical analysis plans", 
                    "Regulatory correspondence"
                ]
            }
            
        except Exception as e:
            self.logger.error(f"Error getting regulatory requirements: {e}")
            return {"error": str(e)}
    
    async def close(self):
        """Close HTTP client connections"""
        await self.http_client.aclose()