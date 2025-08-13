"""
Emme Connect Content Models
Data models for pharmaceutical MLR content and submissions
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime
from enum import Enum
from uuid import uuid4


class ContentType(str, Enum):
    """Types of pharmaceutical content for MLR review"""
    PROMOTIONAL_MATERIAL = "promotional_material"
    SCIENTIFIC_PUBLICATION = "scientific_publication" 
    MEDICAL_INFORMATION_RESPONSE = "medical_information_response"
    PATIENT_EDUCATION_MATERIAL = "patient_education_material"
    HEALTHCARE_PROVIDER_EDUCATION = "healthcare_provider_education"
    CONGRESS_PRESENTATION = "congress_presentation"
    DIGITAL_ADVERTISEMENT = "digital_advertisement"
    SOCIAL_MEDIA_CONTENT = "social_media_content"
    REGULATORY_SUBMISSION = "regulatory_submission"
    CLINICAL_STUDY_MATERIAL = "clinical_study_material"


class ReviewStatus(str, Enum):
    """MLR review status stages"""
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    AI_ANALYSIS_COMPLETE = "ai_analysis_complete"
    REGULATORY_REVIEW = "regulatory_review"
    MEDICAL_REVIEW = "medical_review"
    LEGAL_REVIEW = "legal_review"
    PENDING_REVISION = "pending_revision"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class RiskLevel(str, Enum):
    """Risk assessment levels for content"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    MINIMAL = "minimal"


class TherapeuticArea(str, Enum):
    """Therapeutic areas for content classification"""
    ONCOLOGY = "oncology"
    CARDIOVASCULAR = "cardiovascular"
    NEUROLOGY = "neurology"
    IMMUNOLOGY = "immunology"
    INFECTIOUS_DISEASES = "infectious_diseases"
    ENDOCRINOLOGY = "endocrinology"
    RESPIRATORY = "respiratory"
    GASTROENTEROLOGY = "gastroenterology"
    DERMATOLOGY = "dermatology"
    OPHTHALMOLOGY = "ophthalmology"
    RARE_DISEASES = "rare_diseases"
    VACCINES = "vaccines"


class ContentMetadata(BaseModel):
    """Comprehensive metadata for pharmaceutical content"""
    title: str
    description: Optional[str] = None
    therapeutic_area: Optional[TherapeuticArea] = None
    indication: Optional[str] = None
    product_name: Optional[str] = None
    brand_name: Optional[str] = None
    target_audience: List[str] = Field(default_factory=list)  # HCP, Patient, Payer
    geographic_markets: List[str] = Field(default_factory=list)  # US, EU, Global
    languages: List[str] = Field(default_factory=lambda: ["en"])
    regulatory_classification: Optional[str] = None
    medical_claims: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    references: List[str] = Field(default_factory=list)
    
    # Health equity considerations
    health_equity_considerations: Dict[str, Any] = Field(default_factory=dict)
    cultural_adaptations: List[str] = Field(default_factory=list)
    accessibility_features: List[str] = Field(default_factory=list)


class AIAnalysisResult(BaseModel):
    """Results from AI-powered content analysis"""
    confidence_score: float = Field(ge=0.0, le=1.0)
    risk_assessment: RiskLevel
    regulatory_flags: List[str] = Field(default_factory=list)
    medical_accuracy_score: float = Field(default=0.0, ge=0.0, le=1.0)
    claim_verification: Dict[str, bool] = Field(default_factory=dict)
    suggested_revisions: List[str] = Field(default_factory=list)
    compliance_issues: List[str] = Field(default_factory=list)
    
    # NLP insights from SocratIQ Transform
    entities_extracted: List[Dict[str, Any]] = Field(default_factory=list)
    sentiment_analysis: Dict[str, float] = Field(default_factory=dict)
    readability_score: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    language_detection: Dict[str, float] = Field(default_factory=dict)
    
    # Knowledge graph insights from SocratIQ Mesh
    related_content: List[str] = Field(default_factory=list)
    knowledge_gaps: List[str] = Field(default_factory=list)
    cross_references: List[str] = Field(default_factory=list)
    
    analysis_timestamp: datetime = Field(default_factory=datetime.now)
    model_version: str = "claude-sonnet-4-20250514"


class ReviewerComment(BaseModel):
    """Individual reviewer comment/feedback"""
    reviewer_id: str
    reviewer_role: str  # medical, legal, regulatory
    comment_text: str
    section_reference: Optional[str] = None
    severity: str = Field(default="info")  # critical, major, minor, info
    status: str = Field(default="open")  # open, addressed, resolved
    created_at: datetime = Field(default_factory=datetime.now)
    resolved_at: Optional[datetime] = None


class ApprovalChain(BaseModel):
    """MLR approval chain tracking"""
    stage: str
    approver_id: str
    approver_role: str
    decision: str  # approved, rejected, needs_revision
    comments: str = ""
    approved_at: Optional[datetime] = None
    digital_signature: Optional[str] = None
    
    def sign_approval(self, private_key: str) -> str:
        """Create digital signature for GxP compliance"""
        import hashlib
        approval_data = f"{self.stage}:{self.approver_id}:{self.decision}:{self.approved_at}"
        # In production, use proper cryptographic signing
        signature = hashlib.sha256(f"{approval_data}:{private_key}".encode()).hexdigest()
        self.digital_signature = signature
        return signature


class ContentAsset(BaseModel):
    """
    Core content asset model for pharmaceutical materials
    
    Represents any piece of content that requires MLR review,
    with comprehensive metadata and audit trail support
    """
    # Core identification
    content_id: str = Field(default_factory=lambda: str(uuid4()))
    title: str = ""
    content_type: ContentType = ContentType.PROMOTIONAL_MATERIAL
    
    # Content data
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    file_format: Optional[str] = None
    content_text: Optional[str] = None
    content_html: Optional[str] = None
    
    # Metadata and classification
    metadata: ContentMetadata = Field(default_factory=ContentMetadata)
    
    # Review and compliance
    current_status: ReviewStatus = ReviewStatus.SUBMITTED
    risk_level: Optional[RiskLevel] = None
    
    # AI analysis results
    ai_analysis: Optional[AIAnalysisResult] = None
    
    # Human review
    reviewer_comments: List[ReviewerComment] = Field(default_factory=list)
    approval_chain: List[ApprovalChain] = Field(default_factory=list)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    review_deadline: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    
    # Version control
    version: str = "1.0"
    previous_version_id: Optional[str] = None
    
    def get_current_reviewers(self) -> List[str]:
        """Get list of current reviewers based on status"""
        status_reviewers = {
            ReviewStatus.REGULATORY_REVIEW: ["regulatory_reviewer"],
            ReviewStatus.MEDICAL_REVIEW: ["medical_reviewer"],  
            ReviewStatus.LEGAL_REVIEW: ["legal_reviewer"],
            ReviewStatus.UNDER_REVIEW: ["ai_reviewer", "content_reviewer"]
        }
        
        return status_reviewers.get(self.current_status, [])
    
    def calculate_review_progress(self) -> float:
        """Calculate review completion percentage"""
        status_weights = {
            ReviewStatus.SUBMITTED: 0,
            ReviewStatus.UNDER_REVIEW: 10,
            ReviewStatus.AI_ANALYSIS_COMPLETE: 25,
            ReviewStatus.REGULATORY_REVIEW: 50,
            ReviewStatus.MEDICAL_REVIEW: 70,
            ReviewStatus.LEGAL_REVIEW: 85,
            ReviewStatus.PENDING_REVISION: 90,
            ReviewStatus.APPROVED: 100,
            ReviewStatus.REJECTED: 100,
            ReviewStatus.EXPIRED: 0
        }
        
        return status_weights.get(self.current_status, 0)


class MLRSubmission(BaseModel):
    """
    MLR submission containing multiple content assets
    
    Represents a complete MLR submission that may contain multiple
    related content assets requiring coordinated review
    """
    # Core identification
    submission_id: str = Field(default_factory=lambda: str(uuid4()))
    submission_title: str = ""
    submission_type: str = "standard"  # standard, expedited, emergency
    
    # Content assets in this submission
    content_assets: List[ContentAsset] = Field(default_factory=list)
    
    # Submission metadata
    submitter_id: str = ""
    submitter_role: str = ""
    business_justification: str = ""
    regulatory_deadline: Optional[datetime] = None
    priority_level: str = "normal"  # low, normal, high, critical
    
    # Review coordination
    lead_reviewer_id: Optional[str] = None
    review_team: List[str] = Field(default_factory=list)
    parallel_review_enabled: bool = True
    
    # Overall status
    overall_status: ReviewStatus = ReviewStatus.SUBMITTED
    completion_percentage: float = 0.0
    
    # Timing
    submitted_at: datetime = Field(default_factory=datetime.now)
    target_completion: Optional[datetime] = None
    actual_completion: Optional[datetime] = None
    
    # Batch processing results
    batch_analysis_results: Dict[str, Any] = Field(default_factory=dict)
    
    def add_content_asset(self, asset: ContentAsset) -> None:
        """Add content asset to submission"""
        self.content_assets.append(asset)
        self.update_completion_percentage()
    
    def update_completion_percentage(self) -> None:
        """Update overall completion percentage based on asset progress"""
        if not self.content_assets:
            self.completion_percentage = 0.0
            return
        
        total_progress = sum(asset.calculate_review_progress() for asset in self.content_assets)
        self.completion_percentage = total_progress / len(self.content_assets)
        
        # Update overall status based on progress
        if self.completion_percentage >= 100:
            self.overall_status = ReviewStatus.APPROVED
            self.actual_completion = datetime.now()
        elif self.completion_percentage >= 90:
            self.overall_status = ReviewStatus.PENDING_REVISION
        elif self.completion_percentage >= 50:
            self.overall_status = ReviewStatus.UNDER_REVIEW
    
    def get_submission_summary(self) -> Dict[str, Any]:
        """Generate comprehensive submission summary"""
        return {
            "submission_id": self.submission_id,
            "title": self.submission_title,
            "total_assets": len(self.content_assets),
            "completion_percentage": self.completion_percentage,
            "overall_status": self.overall_status.value,
            "submitted_at": self.submitted_at.isoformat(),
            "target_completion": self.target_completion.isoformat() if self.target_completion else None,
            "priority_level": self.priority_level,
            "content_types": list(set(asset.content_type.value for asset in self.content_assets)),
            "therapeutic_areas": list(set(asset.metadata.therapeutic_area.value 
                                        for asset in self.content_assets 
                                        if asset.metadata.therapeutic_area))
        }


# Request/Response models for API
class MLRSubmissionRequest(BaseModel):
    """Request model for MLR submission"""
    title: str = Field(..., min_length=1, max_length=200)
    submission_type: str = Field(default="standard")
    submitter_id: str = Field(..., min_length=1)
    submitter_role: str = Field(..., min_length=1)
    business_justification: str = Field(default="")
    priority_level: str = Field(default="normal")
    content_assets: List[Dict[str, Any]] = Field(..., min_items=1)
    
    @validator('priority_level')
    def validate_priority(cls, v):
        if v not in ["low", "normal", "high", "critical"]:
            raise ValueError("Priority must be one of: low, normal, high, critical")
        return v


class MLRSubmissionResponse(BaseModel):
    """Response model for MLR submission"""
    submission_id: str
    status: str
    message: str
    target_completion: Optional[str] = None
    estimated_duration_hours: int
    content_asset_count: int


class MLRStatusResponse(BaseModel):
    """Response model for MLR status check"""
    submission_id: str
    overall_status: str
    completion_percentage: float
    submitted_at: str
    target_completion: Optional[str] = None
    actual_completion: Optional[str] = None
    content_assets: List[Dict[str, Any]]
    metrics: Dict[str, Any]