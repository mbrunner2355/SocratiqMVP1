"""
Audit Service
GxP-compliant audit trail management for regulatory compliance
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

from ..config import emme_config
from ..models.audit_trail import TraceUnit, AuditEvent, ComplianceRecord, AuditTrail


class AuditService:
    """
    GxP-compliant audit service for MLR workflow
    
    Manages immutable audit trails, trace units, and compliance records
    to ensure regulatory compliance and complete traceability of all
    pharmaceutical content review activities.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.config = emme_config
        
        # In-memory storage for development - in production use database
        self.audit_trails: Dict[str, AuditTrail] = {}
        self.sealed_trails: Dict[str, str] = {}  # trail_id -> seal_signature
        
        # Audit metrics
        self.audit_metrics = {
            "total_trails": 0,
            "total_trace_units": 0,
            "total_audit_events": 0,
            "sealed_trails": 0,
            "integrity_violations": 0
        }
    
    async def create_audit_trail(self, entity_id: str, entity_type: str) -> AuditTrail:
        """
        Create new audit trail for an entity
        
        Args:
            entity_id: ID of the entity (submission_id, content_id)
            entity_type: Type of entity (mlr_submission, content_asset)
            
        Returns:
            Created AuditTrail instance
        """
        try:
            audit_trail = AuditTrail(
                entity_id=entity_id,
                entity_type=entity_type
            )
            
            self.audit_trails[audit_trail.trail_id] = audit_trail
            self.audit_metrics["total_trails"] += 1
            
            self.logger.info(f"Created audit trail {audit_trail.trail_id} for {entity_type} {entity_id}")
            
            return audit_trail
            
        except Exception as e:
            self.logger.error(f"Failed to create audit trail for {entity_id}: {e}")
            raise
    
    async def store_audit_trail(self, audit_trail: AuditTrail) -> None:
        """Store audit trail"""
        try:
            self.audit_trails[audit_trail.trail_id] = audit_trail
            
            if audit_trail.trail_id not in [trail.trail_id for trail in self.audit_trails.values()]:
                self.audit_metrics["total_trails"] += 1
            
            self.logger.debug(f"Stored audit trail {audit_trail.trail_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to store audit trail {audit_trail.trail_id}: {e}")
            raise
    
    async def get_audit_trail(self, entity_id: str) -> Optional[AuditTrail]:
        """
        Get audit trail for an entity
        
        Args:
            entity_id: Entity ID to look up
            
        Returns:
            AuditTrail if found, None otherwise
        """
        try:
            for trail in self.audit_trails.values():
                if trail.entity_id == entity_id:
                    return trail
            return None
            
        except Exception as e:
            self.logger.error(f"Failed to retrieve audit trail for {entity_id}: {e}")
            return None
    
    async def add_trace_unit(self, entity_id: str, trace_unit: TraceUnit) -> None:
        """
        Add trace unit to entity's audit trail
        
        Args:
            entity_id: Entity ID
            trace_unit: TraceUnit to add
        """
        try:
            audit_trail = await self.get_audit_trail(entity_id)
            
            if not audit_trail:
                # Create new audit trail if it doesn't exist
                entity_type = "mlr_submission" if "submission" in trace_unit.action_type else "content_asset"
                audit_trail = await self.create_audit_trail(entity_id, entity_type)
            
            # Add trace unit to trail
            audit_trail.add_trace_unit(trace_unit)
            
            # Create digital signature for GxP compliance
            if self.config.digital_signature_required:
                trace_unit.create_digital_signature("audit_service_key")
            
            self.audit_metrics["total_trace_units"] += 1
            
            self.logger.debug(f"Added trace unit {trace_unit.trace_id} to audit trail for {entity_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to add trace unit to {entity_id}: {e}")
            raise
    
    async def add_audit_event(self, entity_id: str, audit_event: AuditEvent) -> None:
        """
        Add audit event to entity's audit trail
        
        Args:
            entity_id: Entity ID
            audit_event: AuditEvent to add
        """
        try:
            audit_trail = await self.get_audit_trail(entity_id)
            
            if not audit_trail:
                # Create new audit trail if it doesn't exist
                audit_trail = await self.create_audit_trail(entity_id, "mlr_submission")
            
            # Add audit event to trail
            audit_trail.add_audit_event(audit_event)
            
            self.audit_metrics["total_audit_events"] += 1
            
            self.logger.debug(f"Added audit event {audit_event.event_id} to audit trail for {entity_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to add audit event to {entity_id}: {e}")
            raise
    
    async def add_compliance_record(self, entity_id: str, compliance_record: ComplianceRecord) -> None:
        """
        Add compliance record to entity's audit trail
        
        Args:
            entity_id: Entity ID
            compliance_record: ComplianceRecord to add
        """
        try:
            audit_trail = await self.get_audit_trail(entity_id)
            
            if not audit_trail:
                audit_trail = await self.create_audit_trail(entity_id, "content_asset")
            
            # Add compliance record to trail
            audit_trail.add_compliance_record(compliance_record)
            
            self.logger.debug(f"Added compliance record {compliance_record.record_id} to audit trail for {entity_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to add compliance record to {entity_id}: {e}")
            raise
    
    async def verify_trail_integrity(self, entity_id: str) -> Dict[str, Any]:
        """
        Verify integrity of audit trail
        
        Args:
            entity_id: Entity ID to verify
            
        Returns:
            Dict containing verification results
        """
        try:
            audit_trail = await self.get_audit_trail(entity_id)
            
            if not audit_trail:
                return {
                    "entity_id": entity_id,
                    "integrity_verified": False,
                    "error": "Audit trail not found"
                }
            
            # Verify chain integrity
            chain_integrity = audit_trail.verify_chain_integrity()
            
            # Additional verification checks
            verification_results = {
                "entity_id": entity_id,
                "trail_id": audit_trail.trail_id,
                "integrity_verified": chain_integrity,
                "total_trace_units": len(audit_trail.trace_units),
                "total_audit_events": len(audit_trail.audit_events),
                "total_compliance_records": len(audit_trail.compliance_records),
                "is_sealed": audit_trail.is_sealed,
                "verification_timestamp": datetime.now().isoformat()
            }
            
            # Check for specific integrity issues
            integrity_issues = []
            
            # Verify trace unit chain
            for i, trace_unit in enumerate(audit_trail.trace_units):
                previous_trace = audit_trail.trace_units[i-1] if i > 0 else None
                if not trace_unit.verify_integrity(previous_trace):
                    integrity_issues.append(f"Trace unit {trace_unit.trace_id} failed integrity check")
                    self.audit_metrics["integrity_violations"] += 1
            
            # Verify digital signatures if required
            if self.config.digital_signature_required:
                for trace_unit in audit_trail.trace_units:
                    if not trace_unit.digital_signature:
                        integrity_issues.append(f"Trace unit {trace_unit.trace_id} missing digital signature")
            
            verification_results["integrity_issues"] = integrity_issues
            verification_results["integrity_verified"] = len(integrity_issues) == 0
            
            return verification_results
            
        except Exception as e:
            self.logger.error(f"Failed to verify trail integrity for {entity_id}: {e}")
            return {
                "entity_id": entity_id,
                "integrity_verified": False,
                "error": str(e)
            }
    
    async def seal_audit_trail(self, entity_id: str, seal_key: str = "default_seal_key") -> Dict[str, Any]:
        """
        Seal audit trail to prevent modifications (GxP compliance)
        
        Args:
            entity_id: Entity ID
            seal_key: Key for creating seal signature
            
        Returns:
            Dict containing seal results
        """
        try:
            audit_trail = await self.get_audit_trail(entity_id)
            
            if not audit_trail:
                return {
                    "entity_id": entity_id,
                    "sealed": False,
                    "error": "Audit trail not found"
                }
            
            if audit_trail.is_sealed:
                return {
                    "entity_id": entity_id,
                    "sealed": True,
                    "message": "Audit trail already sealed",
                    "seal_timestamp": audit_trail.seal_timestamp.isoformat() if audit_trail.seal_timestamp else None
                }
            
            # Verify integrity before sealing
            integrity_check = await self.verify_trail_integrity(entity_id)
            if not integrity_check["integrity_verified"]:
                return {
                    "entity_id": entity_id,
                    "sealed": False,
                    "error": "Cannot seal trail with integrity violations",
                    "integrity_issues": integrity_check.get("integrity_issues", [])
                }
            
            # Seal the trail
            seal_signature = audit_trail.seal_trail(seal_key)
            self.sealed_trails[audit_trail.trail_id] = seal_signature
            
            self.audit_metrics["sealed_trails"] += 1
            
            self.logger.info(f"Sealed audit trail {audit_trail.trail_id} for {entity_id}")
            
            return {
                "entity_id": entity_id,
                "trail_id": audit_trail.trail_id,
                "sealed": True,
                "seal_signature": seal_signature,
                "seal_timestamp": audit_trail.seal_timestamp.isoformat(),
                "retention_period_years": self.config.retention_period_years
            }
            
        except Exception as e:
            self.logger.error(f"Failed to seal audit trail for {entity_id}: {e}")
            return {
                "entity_id": entity_id,
                "sealed": False,
                "error": str(e)
            }
    
    async def get_compliance_summary(self, entity_id: str) -> Dict[str, Any]:
        """
        Get comprehensive compliance summary for an entity
        
        Args:
            entity_id: Entity ID
            
        Returns:
            Dict containing compliance summary
        """
        try:
            audit_trail = await self.get_audit_trail(entity_id)
            
            if not audit_trail:
                return {
                    "entity_id": entity_id,
                    "compliance_status": "unknown",
                    "error": "Audit trail not found"
                }
            
            # Analyze compliance records
            compliance_records = audit_trail.compliance_records
            total_records = len(compliance_records)
            compliant_records = len([r for r in compliance_records if r.compliance_status == "compliant"])
            
            # Calculate compliance percentage
            compliance_percentage = (compliant_records / total_records * 100) if total_records > 0 else 0
            
            # Determine overall compliance status
            if compliance_percentage >= 95:
                overall_status = "compliant"
            elif compliance_percentage >= 80:
                overall_status = "mostly_compliant"
            elif compliance_percentage >= 60:
                overall_status = "partially_compliant"
            else:
                overall_status = "non_compliant"
            
            # Get verification status
            integrity_check = await self.verify_trail_integrity(entity_id)
            
            return {
                "entity_id": entity_id,
                "entity_type": audit_trail.entity_type,
                "compliance_status": overall_status,
                "compliance_percentage": compliance_percentage,
                "total_compliance_records": total_records,
                "compliant_records": compliant_records,
                "trail_summary": audit_trail.get_trail_summary(),
                "integrity_verified": integrity_check["integrity_verified"],
                "is_sealed": audit_trail.is_sealed,
                "gxp_compliant": audit_trail.is_sealed and integrity_check["integrity_verified"],
                "retention_period_years": self.config.retention_period_years,
                "last_updated": audit_trail.last_updated.isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Failed to get compliance summary for {entity_id}: {e}")
            return {
                "entity_id": entity_id,
                "compliance_status": "error",
                "error": str(e)
            }
    
    def get_audit_metrics(self) -> Dict[str, Any]:
        """Get overall audit service metrics"""
        return {
            **self.audit_metrics,
            "active_trails": len(self.audit_trails),
            "configuration": {
                "retention_period_years": self.config.retention_period_years,
                "digital_signatures_required": self.config.digital_signature_required,
                "encryption_enabled": self.config.enable_encryption_at_rest,
                "blockchain_immutability": self.config.enable_blockchain_immutability
            },
            "service_health": "operational"
        }
    
    async def export_audit_trail(self, entity_id: str, export_format: str = "json") -> Optional[Dict[str, Any]]:
        """
        Export audit trail for regulatory submission
        
        Args:
            entity_id: Entity ID to export
            export_format: Export format (json, xml, pdf)
            
        Returns:
            Exported audit trail data
        """
        try:
            audit_trail = await self.get_audit_trail(entity_id)
            
            if not audit_trail:
                return None
            
            # Get compliance summary
            compliance_summary = await self.get_compliance_summary(entity_id)
            
            export_data = {
                "export_metadata": {
                    "entity_id": entity_id,
                    "export_format": export_format,
                    "export_timestamp": datetime.now().isoformat(),
                    "export_version": "1.0",
                    "regulatory_compliance": "21 CFR Part 11"
                },
                "trail_summary": audit_trail.get_trail_summary(),
                "compliance_summary": compliance_summary,
                "trace_units": [
                    {
                        "trace_id": tu.trace_id,
                        "content_id": tu.content_id,
                        "action_type": tu.action_type,
                        "user_id": tu.user_id,
                        "user_role": tu.user_role,
                        "timestamp": tu.timestamp.isoformat(),
                        "content_hash": tu.content_hash,
                        "digital_signature": tu.digital_signature,
                        "action_details": tu.action_details
                    }
                    for tu in audit_trail.trace_units
                ],
                "audit_events": [
                    {
                        "event_id": ae.event_id,
                        "event_type": ae.event_type,
                        "user_id": ae.user_id,
                        "user_role": ae.user_role,
                        "timestamp": ae.timestamp.isoformat(),
                        "description": ae.description,
                        "regulatory_impact": ae.regulatory_impact
                    }
                    for ae in audit_trail.audit_events
                ],
                "compliance_records": [
                    {
                        "record_id": cr.record_id,
                        "compliance_type": cr.compliance_type,
                        "compliance_status": cr.compliance_status,
                        "verifier_id": cr.verifier_id,
                        "verification_timestamp": cr.verification_timestamp.isoformat()
                    }
                    for cr in audit_trail.compliance_records
                ]
            }
            
            self.logger.info(f"Exported audit trail for {entity_id} in {export_format} format")
            
            return export_data
            
        except Exception as e:
            self.logger.error(f"Failed to export audit trail for {entity_id}: {e}")
            return None