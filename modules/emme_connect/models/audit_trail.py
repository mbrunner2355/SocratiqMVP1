"""
Emme Connect Audit Trail Models
GxP-compliant audit trail and TraceUnit models for regulatory compliance
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import uuid4
import hashlib
import json


class TraceUnit(BaseModel):
    """
    Immutable audit trail unit for GxP compliance
    
    TraceUnits provide blockchain-like immutability for regulatory compliance,
    ensuring complete audit trails for all MLR activities
    """
    trace_id: str = Field(default_factory=lambda: str(uuid4()))
    parent_trace_id: Optional[str] = None
    content_id: str = ""
    action_type: str = ""  # created, modified, reviewed, approved, rejected
    user_id: str = ""
    user_role: str = ""
    timestamp: datetime = Field(default_factory=datetime.now)
    
    # Immutable content hash
    content_hash: str = ""
    previous_hash: str = ""
    
    # Action details
    action_details: Dict[str, Any] = Field(default_factory=dict)
    regulatory_context: Dict[str, str] = Field(default_factory=dict)
    
    # GxP compliance metadata
    gxp_metadata: Dict[str, Any] = Field(default_factory=dict)
    digital_signature: Optional[str] = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if not self.content_hash:
            self.generate_content_hash()
    
    def generate_content_hash(self) -> str:
        """Generate SHA-256 hash of trace unit content"""
        content_string = json.dumps({
            "trace_id": self.trace_id,
            "content_id": self.content_id, 
            "action_type": self.action_type,
            "user_id": self.user_id,
            "timestamp": self.timestamp.isoformat(),
            "action_details": self.action_details,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        
        self.content_hash = hashlib.sha256(content_string.encode()).hexdigest()
        return self.content_hash
    
    def verify_integrity(self, previous_trace: Optional['TraceUnit'] = None) -> bool:
        """Verify trace unit integrity for audit compliance"""
        # Verify own hash
        expected_hash = self.generate_content_hash()
        if expected_hash != self.content_hash:
            return False
            
        # Verify chain integrity
        if previous_trace and self.previous_hash != previous_trace.content_hash:
            return False
            
        return True
    
    def create_digital_signature(self, private_key: str) -> str:
        """Create digital signature for regulatory compliance"""
        signature_data = f"{self.content_hash}:{self.timestamp.isoformat()}:{self.user_id}"
        # In production: use proper cryptographic signing (RSA, ECDSA)
        signature = hashlib.sha256(f"{signature_data}:{private_key}".encode()).hexdigest()
        self.digital_signature = signature
        return signature


class AuditEvent(BaseModel):
    """High-level audit event for regulatory tracking"""
    event_id: str = Field(default_factory=lambda: str(uuid4()))
    event_type: str  # mlr_submission, content_review, approval, rejection
    event_category: str  # workflow, compliance, security, data
    
    # Event context
    source_system: str = "emme_connect"
    source_module: str = ""
    
    # User and timing
    user_id: str
    user_role: str
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    
    # Event details
    description: str
    event_data: Dict[str, Any] = Field(default_factory=dict)
    
    # Related entities
    content_id: Optional[str] = None
    submission_id: Optional[str] = None
    workflow_stage: Optional[str] = None
    
    # Compliance information
    regulatory_impact: str = "low"  # low, medium, high, critical
    compliance_tags: List[str] = Field(default_factory=list)
    retention_years: int = 25  # Default regulatory retention
    
    # Technical metadata
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    api_endpoint: Optional[str] = None
    response_code: Optional[int] = None
    processing_time_ms: Optional[float] = None


class ComplianceRecord(BaseModel):
    """Compliance verification record for regulatory audits"""
    record_id: str = Field(default_factory=lambda: str(uuid4()))
    compliance_type: str  # gcp, gmp, glp, gdp, gvp
    
    # Associated entities
    content_id: str
    submission_id: Optional[str] = None
    
    # Compliance verification
    compliance_status: str  # compliant, non_compliant, needs_review
    verification_method: str  # automated, manual, hybrid
    verifier_id: str
    verification_timestamp: datetime = Field(default_factory=datetime.now)
    
    # Compliance details
    regulatory_requirements: List[str] = Field(default_factory=list)
    compliance_checks: Dict[str, bool] = Field(default_factory=dict)
    non_compliance_issues: List[str] = Field(default_factory=list)
    remediation_actions: List[str] = Field(default_factory=list)
    
    # Supporting documentation
    evidence_documents: List[str] = Field(default_factory=list)
    regulatory_citations: List[str] = Field(default_factory=list)
    
    # Validity and review
    valid_until: Optional[datetime] = None
    next_review_date: Optional[datetime] = None
    review_frequency_months: int = 12


class AuditTrail(BaseModel):
    """Complete audit trail for a content asset or submission"""
    trail_id: str = Field(default_factory=lambda: str(uuid4()))
    entity_id: str  # content_id or submission_id
    entity_type: str  # content_asset, mlr_submission
    
    # Trail metadata
    created_at: datetime = Field(default_factory=datetime.now)
    last_updated: datetime = Field(default_factory=datetime.now)
    
    # Audit components
    trace_units: List[TraceUnit] = Field(default_factory=list)
    audit_events: List[AuditEvent] = Field(default_factory=list)
    compliance_records: List[ComplianceRecord] = Field(default_factory=list)
    
    # Trail integrity
    is_sealed: bool = False  # Sealed trails cannot be modified
    seal_timestamp: Optional[datetime] = None
    seal_signature: Optional[str] = None
    
    def add_trace_unit(self, trace_unit: TraceUnit) -> None:
        """Add new trace unit to audit trail"""
        if self.is_sealed:
            raise ValueError("Cannot modify sealed audit trail")
        
        # Set previous hash for chain integrity
        if self.trace_units:
            trace_unit.previous_hash = self.trace_units[-1].content_hash
            trace_unit.generate_content_hash()
        
        self.trace_units.append(trace_unit)
        self.last_updated = datetime.now()
    
    def add_audit_event(self, event: AuditEvent) -> None:
        """Add audit event to trail"""
        if self.is_sealed:
            raise ValueError("Cannot modify sealed audit trail")
        
        self.audit_events.append(event)
        self.last_updated = datetime.now()
    
    def add_compliance_record(self, record: ComplianceRecord) -> None:
        """Add compliance record to trail"""
        if self.is_sealed:
            raise ValueError("Cannot modify sealed audit trail")
        
        self.compliance_records.append(record)
        self.last_updated = datetime.now()
    
    def verify_chain_integrity(self) -> bool:
        """Verify integrity of complete trace unit chain"""
        for i, trace_unit in enumerate(self.trace_units):
            previous_trace = self.trace_units[i-1] if i > 0 else None
            if not trace_unit.verify_integrity(previous_trace):
                return False
        return True
    
    def seal_trail(self, seal_key: str) -> str:
        """Seal audit trail to prevent modifications"""
        if self.is_sealed:
            raise ValueError("Audit trail already sealed")
        
        # Create seal signature
        seal_data = {
            "trail_id": self.trail_id,
            "entity_id": self.entity_id,
            "trace_unit_count": len(self.trace_units),
            "event_count": len(self.audit_events),
            "last_trace_hash": self.trace_units[-1].content_hash if self.trace_units else "",
            "seal_timestamp": datetime.now().isoformat()
        }
        
        seal_string = json.dumps(seal_data, sort_keys=True)
        seal_signature = hashlib.sha256(f"{seal_string}:{seal_key}".encode()).hexdigest()
        
        self.is_sealed = True
        self.seal_timestamp = datetime.now()
        self.seal_signature = seal_signature
        
        return seal_signature
    
    def get_trail_summary(self) -> Dict[str, Any]:
        """Get summary of audit trail"""
        return {
            "trail_id": self.trail_id,
            "entity_id": self.entity_id,
            "entity_type": self.entity_type,
            "created_at": self.created_at.isoformat(),
            "last_updated": self.last_updated.isoformat(),
            "trace_unit_count": len(self.trace_units),
            "audit_event_count": len(self.audit_events),
            "compliance_record_count": len(self.compliance_records),
            "is_sealed": self.is_sealed,
            "chain_integrity": self.verify_chain_integrity(),
            "retention_period_years": max([r.record_id for r in self.compliance_records] + [25])
        }


# Factory functions for creating audit trail components
def create_trace_unit(
    content_id: str,
    action_type: str, 
    user_id: str,
    user_role: str,
    action_details: Dict[str, Any] = None,
    regulatory_context: Dict[str, str] = None
) -> TraceUnit:
    """Factory function to create a new TraceUnit"""
    return TraceUnit(
        content_id=content_id,
        action_type=action_type,
        user_id=user_id,
        user_role=user_role,
        action_details=action_details or {},
        regulatory_context=regulatory_context or {}
    )


def create_audit_event(
    event_type: str,
    user_id: str,
    user_role: str,
    description: str,
    event_data: Dict[str, Any] = None,
    content_id: str = None,
    submission_id: str = None,
    regulatory_impact: str = "low"
) -> AuditEvent:
    """Factory function to create a new AuditEvent"""
    return AuditEvent(
        event_type=event_type,
        user_id=user_id,
        user_role=user_role,
        description=description,
        event_data=event_data or {},
        content_id=content_id,
        submission_id=submission_id,
        regulatory_impact=regulatory_impact,
        event_category="workflow"
    )


def create_compliance_record(
    compliance_type: str,
    content_id: str,
    verifier_id: str,
    compliance_status: str = "compliant",
    regulatory_requirements: List[str] = None
) -> ComplianceRecord:
    """Factory function to create a new ComplianceRecord"""
    return ComplianceRecord(
        compliance_type=compliance_type,
        content_id=content_id,
        verifier_id=verifier_id,
        compliance_status=compliance_status,
        regulatory_requirements=regulatory_requirements or [],
        verification_method="automated"
    )