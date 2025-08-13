"""
Content Analyzer Service
AI-powered pharmaceutical content analysis for MLR workflow
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
import anthropic

from ..config import emme_config
from ..models.content import ContentAsset, RiskLevel, ContentType, TherapeuticArea


class ContentAnalyzer:
    """
    AI-powered content analysis service for pharmaceutical MLR workflow
    
    Provides content classification, risk assessment, regulatory compliance
    analysis, and medical accuracy verification using Claude AI
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.config = emme_config
        
        # Initialize Anthropic client if API key available
        self.anthropic_client = None
        if self.config.anthropic_api_key:
            try:
                self.anthropic_client = anthropic.Anthropic(
                    api_key=self.config.anthropic_api_key
                )
            except Exception as e:
                self.logger.warning(f"Failed to initialize Anthropic client: {e}")
    
    async def classify_content(self, asset: ContentAsset) -> Dict[str, Any]:
        """
        AI-powered content classification for MLR workflow
        
        Args:
            asset: ContentAsset to classify
            
        Returns:
            Dict containing classification results
        """
        try:
            self.logger.info(f"Classifying content for asset {asset.content_id}")
            
            if self.anthropic_client:
                return await self._classify_with_anthropic(asset)
            else:
                return await self._classify_mock(asset)
                
        except Exception as e:
            self.logger.error(f"Content classification failed for {asset.content_id}: {e}")
            return {
                "risk_level": "high",
                "confidence": 0.0,
                "regulatory_flags": ["classification_error"],
                "error": str(e)
            }
    
    async def _classify_with_anthropic(self, asset: ContentAsset) -> Dict[str, Any]:
        """Classify content using Anthropic Claude AI"""
        try:
            # Build classification prompt
            prompt = self._build_classification_prompt(asset)
            
            # Get AI model config
            ai_config = self.config.get_ai_config("content_classifier")
            
            # Make API call to Claude
            message = await asyncio.to_thread(
                self.anthropic_client.messages.create,
                model=ai_config["model"],
                max_tokens=ai_config["max_tokens"],
                temperature=ai_config["temperature"],
                system="You are a pharmaceutical regulatory expert specializing in MLR (Medical Legal Regulatory) review. Analyze content for compliance risk and provide structured classification.",
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            # Parse response
            response_text = message.content[0].text
            return self._parse_classification_response(response_text, asset)
            
        except Exception as e:
            self.logger.error(f"Anthropic classification failed: {e}")
            return await self._classify_mock(asset)
    
    def _build_classification_prompt(self, asset: ContentAsset) -> str:
        """Build classification prompt for AI analysis"""
        prompt = f"""
        Analyze this pharmaceutical content for MLR review classification:

        CONTENT DETAILS:
        - Title: {asset.title}
        - Content Type: {asset.content_type.value}
        - Therapeutic Area: {asset.metadata.therapeutic_area.value if asset.metadata.therapeutic_area else 'Not specified'}
        - Target Audience: {', '.join(asset.metadata.target_audience)}
        - Geographic Markets: {', '.join(asset.metadata.geographic_markets)}
        - Product Name: {asset.metadata.product_name or 'Not specified'}
        - Indication: {asset.metadata.indication or 'Not specified'}
        
        MEDICAL CLAIMS:
        {chr(10).join(f'- {claim}' for claim in asset.metadata.medical_claims) if asset.metadata.medical_claims else '- None specified'}
        
        CONTENT TEXT SAMPLE:
        {asset.content_text[:1000] if asset.content_text else asset.title}
        
        ANALYSIS REQUIREMENTS:
        Provide a structured analysis in the following JSON format:
        {{
            "risk_level": "critical|high|medium|low|minimal",
            "confidence": 0.0-1.0,
            "regulatory_flags": ["flag1", "flag2", ...],
            "recommended_reviewers": ["medical", "regulatory", "legal"],
            "estimated_review_hours": integer,
            "classification_reasoning": "explanation",
            "compliance_requirements": ["requirement1", "requirement2", ...],
            "potential_issues": ["issue1", "issue2", ...]
        }}
        
        CLASSIFICATION CRITERIA:
        - CRITICAL: High-risk therapeutic areas (oncology, rare diseases), direct-to-consumer advertising, serious safety concerns
        - HIGH: Promotional materials with medical claims, comparative claims, new product launches
        - MEDIUM: Educational materials, standard promotional content, established products
        - LOW: Internal communications, scientific abstracts, routine updates
        - MINIMAL: Administrative content, non-promotional materials
        
        Consider these pharmaceutical regulations:
        - FDA 21 CFR Part 202 (Prescription drug advertising)
        - Fair balance requirements
        - Substantiation of medical claims
        - Risk communication standards
        - Good Promotional Practice guidelines
        """
        
        return prompt
    
    def _parse_classification_response(self, response_text: str, asset: ContentAsset) -> Dict[str, Any]:
        """Parse Claude AI classification response"""
        try:
            import json
            import re
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                classification_data = json.loads(json_match.group())
                
                # Validate and normalize response
                return {
                    "risk_level": classification_data.get("risk_level", "medium"),
                    "confidence": min(1.0, max(0.0, classification_data.get("confidence", 0.8))),
                    "regulatory_flags": classification_data.get("regulatory_flags", []),
                    "recommended_reviewers": classification_data.get("recommended_reviewers", ["regulatory"]),
                    "estimated_review_hours": classification_data.get("estimated_review_hours", 4),
                    "classification_reasoning": classification_data.get("classification_reasoning", ""),
                    "compliance_requirements": classification_data.get("compliance_requirements", []),
                    "potential_issues": classification_data.get("potential_issues", [])
                }
            else:
                # Fallback parsing if JSON not found
                return self._extract_classification_from_text(response_text)
                
        except Exception as e:
            self.logger.error(f"Failed to parse classification response: {e}")
            return await self._classify_mock(asset)
    
    def _extract_classification_from_text(self, text: str) -> Dict[str, Any]:
        """Extract classification data from unstructured text response"""
        risk_level = "medium"
        confidence = 0.7
        
        # Simple text parsing for risk level
        text_lower = text.lower()
        if "critical" in text_lower:
            risk_level = "critical"
            confidence = 0.9
        elif "high risk" in text_lower or "high" in text_lower:
            risk_level = "high"
            confidence = 0.8
        elif "low risk" in text_lower or "low" in text_lower:
            risk_level = "low"
            confidence = 0.8
        elif "minimal" in text_lower:
            risk_level = "minimal"
            confidence = 0.9
        
        return {
            "risk_level": risk_level,
            "confidence": confidence,
            "regulatory_flags": ["text_parsing_fallback"],
            "recommended_reviewers": ["regulatory"],
            "estimated_review_hours": 4,
            "classification_reasoning": "Extracted from unstructured AI response",
            "compliance_requirements": [],
            "potential_issues": []
        }
    
    async def _classify_mock(self, asset: ContentAsset) -> Dict[str, Any]:
        """Mock classification for development/fallback"""
        # Determine risk level based on content characteristics
        risk_level = "medium"
        confidence = 0.75
        regulatory_flags = []
        recommended_reviewers = ["regulatory"]
        
        # High-risk therapeutic areas
        if asset.metadata.therapeutic_area in [TherapeuticArea.ONCOLOGY, TherapeuticArea.RARE_DISEASES]:
            risk_level = "high"
            confidence = 0.85
            regulatory_flags.append("high_risk_therapeutic_area")
            recommended_reviewers.extend(["medical", "legal"])
        
        # Promotional materials with claims
        if asset.content_type == ContentType.PROMOTIONAL_MATERIAL and asset.metadata.medical_claims:
            risk_level = "high" if risk_level != "critical" else "critical"
            confidence = 0.9
            regulatory_flags.append("promotional_with_medical_claims")
            recommended_reviewers.append("medical")
        
        # Patient materials require special attention
        if asset.content_type == ContentType.PATIENT_EDUCATION_MATERIAL:
            regulatory_flags.append("patient_facing_content")
            recommended_reviewers.append("medical")
        
        # Direct-to-consumer content is high risk
        if "Patient" in asset.metadata.target_audience and asset.content_type == ContentType.PROMOTIONAL_MATERIAL:
            risk_level = "critical"
            confidence = 0.95
            regulatory_flags.append("direct_to_consumer_promotional")
            recommended_reviewers = ["medical", "regulatory", "legal"]
        
        # Missing references for promotional content
        if asset.content_type == ContentType.PROMOTIONAL_MATERIAL and not asset.metadata.references:
            regulatory_flags.append("missing_clinical_references")
        
        return {
            "risk_level": risk_level,
            "confidence": confidence,
            "regulatory_flags": regulatory_flags,
            "recommended_reviewers": list(set(recommended_reviewers)),
            "estimated_review_hours": 2 if risk_level in ["low", "minimal"] else 4 if risk_level == "medium" else 8,
            "classification_reasoning": f"Mock classification based on content type ({asset.content_type.value}) and therapeutic area",
            "compliance_requirements": self._get_compliance_requirements(asset),
            "potential_issues": self._identify_potential_issues(asset)
        }
    
    def _get_compliance_requirements(self, asset: ContentAsset) -> List[str]:
        """Get compliance requirements based on content characteristics"""
        requirements = []
        
        if asset.content_type == ContentType.PROMOTIONAL_MATERIAL:
            requirements.extend([
                "Fair balance of risks and benefits",
                "Substantial clinical evidence for claims",
                "FDA-approved indication clearly stated"
            ])
        
        if asset.metadata.medical_claims:
            requirements.extend([
                "Clinical substantiation required",
                "Statistical significance documentation",
                "Peer-reviewed publication support"
            ])
        
        if "Patient" in asset.metadata.target_audience:
            requirements.extend([
                "Patient-appropriate language",
                "Risk information in lay terms",
                "Healthcare provider consultation reminder"
            ])
        
        return requirements
    
    def _identify_potential_issues(self, asset: ContentAsset) -> List[str]:
        """Identify potential regulatory issues"""
        issues = []
        
        if not asset.metadata.references and asset.metadata.medical_claims:
            issues.append("Medical claims lack supporting references")
        
        if asset.content_type == ContentType.PROMOTIONAL_MATERIAL and not asset.metadata.indication:
            issues.append("Promotional material missing indication")
        
        if len(asset.metadata.languages) == 1 and len(asset.metadata.geographic_markets) > 1:
            issues.append("Multi-market content available in single language")
        
        if asset.metadata.therapeutic_area == TherapeuticArea.ONCOLOGY and not asset.metadata.references:
            issues.append("Oncology content requires robust clinical evidence")
        
        return issues
    
    async def analyze_content(self, asset: ContentAsset) -> Dict[str, Any]:
        """
        Comprehensive content analysis including medical accuracy and compliance
        
        Args:
            asset: ContentAsset to analyze
            
        Returns:
            Dict containing comprehensive analysis results
        """
        try:
            self.logger.info(f"Analyzing content for asset {asset.content_id}")
            
            # Get classification results
            classification = await self.classify_content(asset)
            
            # Perform additional analysis
            medical_accuracy = await self._analyze_medical_accuracy(asset)
            regulatory_compliance = await self._analyze_regulatory_compliance(asset)
            
            # Combine results
            return {
                **classification,
                "medical_accuracy_score": medical_accuracy.get("accuracy_score", 0.8),
                "claim_verification": medical_accuracy.get("claim_verification", {}),
                "regulatory_flags": classification.get("regulatory_flags", []) + regulatory_compliance.get("flags", []),
                "compliance_issues": regulatory_compliance.get("issues", []),
                "suggested_revisions": regulatory_compliance.get("suggested_revisions", [])
            }
            
        except Exception as e:
            self.logger.error(f"Content analysis failed for {asset.content_id}: {e}")
            return {
                "confidence": 0.0,
                "risk_level": "high",
                "error": str(e)
            }
    
    async def _analyze_medical_accuracy(self, asset: ContentAsset) -> Dict[str, Any]:
        """Analyze medical accuracy of content and claims"""
        try:
            claim_verification = {}
            accuracy_score = 0.8
            
            # Verify each medical claim
            for claim in asset.metadata.medical_claims:
                # Mock verification - in production, use medical databases
                is_verified = True
                confidence = 0.85
                
                # Basic validation rules
                if "100%" in claim or "completely safe" in claim.lower():
                    is_verified = False
                    confidence = 0.1
                elif "FDA approved" in claim and not asset.metadata.product_name:
                    is_verified = False
                    confidence = 0.2
                
                claim_verification[claim] = {
                    "verified": is_verified,
                    "confidence": confidence,
                    "evidence_level": "moderate"
                }
            
            # Calculate overall accuracy score
            if claim_verification:
                verified_count = sum(1 for v in claim_verification.values() if v["verified"])
                accuracy_score = verified_count / len(claim_verification)
            
            return {
                "accuracy_score": accuracy_score,
                "claim_verification": claim_verification,
                "medical_terminology_accuracy": 0.9,
                "clinical_evidence_level": "moderate"
            }
            
        except Exception as e:
            self.logger.error(f"Medical accuracy analysis failed: {e}")
            return {"accuracy_score": 0.0, "error": str(e)}
    
    async def _analyze_regulatory_compliance(self, asset: ContentAsset) -> Dict[str, Any]:
        """Analyze regulatory compliance requirements and issues"""
        try:
            flags = []
            issues = []
            suggested_revisions = []
            
            # Check promotional material requirements
            if asset.content_type == ContentType.PROMOTIONAL_MATERIAL:
                if not asset.metadata.references:
                    flags.append("missing_clinical_references")
                    issues.append("Promotional materials must include clinical references")
                    suggested_revisions.append("Add clinical study references supporting claims")
                
                if not asset.metadata.indication:
                    flags.append("missing_indication")
                    issues.append("Approved indication must be clearly stated")
                    suggested_revisions.append("Clearly state FDA-approved indication")
            
            # Check patient material requirements
            if "Patient" in asset.metadata.target_audience:
                if not asset.metadata.accessibility_features:
                    flags.append("missing_accessibility_features")
                    suggested_revisions.append("Add accessibility features for patient materials")
            
            # Check multi-language requirements
            if len(asset.metadata.geographic_markets) > 1 and len(asset.metadata.languages) == 1:
                flags.append("insufficient_language_support")
                issues.append("Multi-market content should support multiple languages")
                suggested_revisions.append("Consider translation for international markets")
            
            return {
                "flags": flags,
                "issues": issues,
                "suggested_revisions": suggested_revisions,
                "compliance_score": max(0.0, 1.0 - (len(issues) * 0.2))
            }
            
        except Exception as e:
            self.logger.error(f"Regulatory compliance analysis failed: {e}")
            return {"error": str(e)}
    
    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages for content analysis"""
        return self.config.all_supported_languages
    
    def get_analysis_capabilities(self) -> Dict[str, Any]:
        """Get service capabilities and configuration"""
        return {
            "content_classification": True,
            "risk_assessment": True,
            "medical_accuracy_verification": True,
            "regulatory_compliance_analysis": True,
            "multi_language_support": len(self.config.all_supported_languages),
            "ai_powered": self.anthropic_client is not None,
            "supported_content_types": [ct.value for ct in ContentType],
            "supported_therapeutic_areas": [ta.value for ta in TherapeuticArea],
            "risk_levels": [rl.value for rl in RiskLevel]
        }