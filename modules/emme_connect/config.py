"""
Emme Connect Configuration
MLR Workflow Automation System Configuration
"""

from typing import Dict, List, Optional
from pydantic import BaseSettings, Field
from enum import Enum
import os


class MLRReviewType(str, Enum):
    """Types of MLR reviews supported by Emme Connect"""
    PROMOTIONAL = "promotional"
    MEDICAL_INFORMATION = "medical_information"
    EDUCATIONAL = "educational"
    REGULATORY_SUBMISSION = "regulatory_submission"
    CONGRESS_MATERIALS = "congress_materials"
    DIGITAL_CONTENT = "digital_content"
    PATIENT_MATERIALS = "patient_materials"


class ContentClassification(str, Enum):
    """Content classification levels for regulatory review"""
    HIGH_RISK = "high_risk"
    MEDIUM_RISK = "medium_risk"
    LOW_RISK = "low_risk"
    ROUTINE = "routine"


class GxPComplianceLevel(str, Enum):
    """Good Clinical/Manufacturing Practice compliance levels"""
    GCP = "gcp"  # Good Clinical Practice
    GMP = "gmp"  # Good Manufacturing Practice
    GLP = "glp"  # Good Laboratory Practice
    GDP = "gdp"  # Good Distribution Practice
    GVP = "gvp"  # Good Pharmacovigilance Practice


class EmmeConnectSettings(BaseSettings):
    """
    Main configuration class for Emme Connect MLR Workflow Automation
    
    This configuration supports:
    - Pharmaceutical MLR workflow automation
    - Multi-language health equity (100+ languages)
    - GxP-compliant audit trails (TraceUnits)
    - Integration with SocratIQ Transform & Mesh services
    - AI-powered content classification and review
    """
    
    # Core system settings
    app_name: str = "Emme Connect"
    version: str = "1.0.0"
    environment: str = Field(default="development", env="EMME_CONNECT_ENV")
    port: int = Field(default=8001, env="EMME_CONNECT_PORT")
    host: str = Field(default="0.0.0.0", env="EMME_CONNECT_HOST")
    
    # Database configuration
    database_url: str = Field(default="", env="DATABASE_URL")
    
    # Redis configuration for caching and queuing
    redis_url: str = Field(default="redis://localhost:6379", env="REDIS_URL")
    
    # SocratIQ service integration
    socratiq_base_url: str = Field(default="http://localhost:5000", env="SOCRATIQ_BASE_URL")
    transform_service_url: str = Field(default="http://localhost:5000/api/transform", env="TRANSFORM_SERVICE_URL")
    mesh_service_url: str = Field(default="http://localhost:5000/api/mesh", env="MESH_SERVICE_URL")
    
    # EMME Engage integration
    emme_engage_url: str = Field(default="http://localhost:5000", env="EMME_ENGAGE_URL")
    
    # AI/ML model configuration
    anthropic_api_key: str = Field(default="", env="ANTHROPIC_API_KEY")
    ai_model_name: str = "claude-sonnet-4-20250514"
    ai_temperature: float = 0.1
    ai_max_tokens: int = 4000
    
    # MLR workflow settings
    auto_classification_threshold: float = 0.85
    ai_review_confidence_threshold: float = 0.90
    human_escalation_threshold: float = 0.75
    target_completion_hours: int = 4  # 4 hours vs traditional weeks
    sla_completion_hours: int = 24    # 24-hour SLA
    escalation_hours: int = 2         # Escalate after 2 hours
    enable_parallel_review: bool = True
    max_concurrent_reviews: int = 50
    
    # Language support for health equity (100+ languages)
    primary_languages: List[str] = [
        "en", "es", "fr", "de", "it", "pt", "zh", "ja", "ko", "ar",
        "hi", "ru", "pl", "tr", "nl", "sv", "da", "no", "fi", "he"
    ]
    extended_languages: List[str] = [
        "th", "vi", "id", "ms", "tl", "sw", "am", "yo", "ig", "ha",
        "bn", "ur", "fa", "ta", "te", "ml", "kn", "gu", "pa", "or"
    ]
    total_supported_languages: int = 120
    
    # GxP compliance and audit trails
    enable_blockchain_immutability: bool = True
    trace_granularity: str = "action_level"  # action_level, document_level, session_level
    retention_period_years: int = 25  # Regulatory requirement
    encryption_standard: str = "AES-256"
    digital_signature_required: bool = True
    
    # Security settings
    enable_encryption_at_rest: bool = True
    enable_encryption_in_transit: bool = True
    require_digital_signatures: bool = True
    audit_log_immutability: bool = True
    access_control_model: str = "RBAC"  # Role-Based Access Control
    
    # Performance and scaling
    enable_caching: bool = True
    cache_ttl_hours: int = 24
    enable_async_processing: bool = True
    max_file_size_mb: int = 100
    batch_processing_size: int = 10
    
    # Logging configuration
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    @property
    def all_supported_languages(self) -> List[str]:
        """Get all supported languages"""
        return self.primary_languages + self.extended_languages
    
    @property
    def review_stages(self) -> List[str]:
        """MLR review workflow stages"""
        return [
            "intake_classification",
            "ai_content_analysis", 
            "regulatory_compliance_check",
            "medical_accuracy_review",
            "legal_risk_assessment",
            "final_approval"
        ]
    
    @property
    def required_trace_metadata(self) -> List[str]:
        """Required metadata for TraceUnit audit trails"""
        return [
            "user_id", "timestamp", "action_type", "content_hash",
            "regulatory_context", "approval_chain", "version_history"
        ]
    
    def get_ai_config(self, model_type: str = "default") -> Dict:
        """Get AI model configuration"""
        base_config = {
            "model": self.ai_model_name,
            "temperature": self.ai_temperature,
            "max_tokens": self.ai_max_tokens
        }
        
        # Specialized configurations for different review types
        specialized_configs = {
            "content_classifier": {**base_config, "temperature": 0.1, "max_tokens": 2000},
            "risk_assessor": {**base_config, "temperature": 0.2, "max_tokens": 3000},
            "regulatory_reviewer": {**base_config, "temperature": 0.1, "max_tokens": 4000},
            "medical_reviewer": {**base_config, "temperature": 0.15, "max_tokens": 3500}
        }
        
        return specialized_configs.get(model_type, base_config)
    
    def validate_config(self) -> bool:
        """Validate configuration settings"""
        try:
            # Validate thresholds
            assert 0.0 <= self.auto_classification_threshold <= 1.0
            assert 0.0 <= self.ai_review_confidence_threshold <= 1.0
            assert 0.0 <= self.human_escalation_threshold <= 1.0
            
            # Validate timing
            assert self.target_completion_hours > 0
            assert self.sla_completion_hours >= self.target_completion_hours
            
            # Validate language support
            assert len(self.all_supported_languages) >= 100
            
            # Validate compliance settings
            assert self.retention_period_years >= 20  # Regulatory minimum
            
            return True
            
        except AssertionError as e:
            raise ValueError(f"Invalid configuration: {e}")

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global configuration instance
emme_config = EmmeConnectSettings()

# Validate configuration on import
try:
    emme_config.validate_config()
except ValueError as e:
    print(f"Configuration validation failed: {e}")
    raise