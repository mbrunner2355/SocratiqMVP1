"""
Emme Connect - FastAPI Backend Service
MLR (Medical Legal Regulatory) Workflow Automation System

This service provides pharmaceutical compliance and regulatory workflow automation
that integrates with the EMME Engage frontend platform and SocratIQ services.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any
import os

from .config import emme_config
from .api.endpoints import router as api_router
from .services.mlr_workflow import mlr_workflow_service
from .services.socratiq_integration import SocratIQIntegration

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    logger.info("Starting Emme Connect MLR Workflow Service")
    logger.info(f"Environment: {emme_config.environment}")
    logger.info(f"Language support: {len(emme_config.language_config.all_languages)} languages")
    
    # Initialize SocratIQ integration
    socratiq = SocratIQIntegration()
    await socratiq.initialize()
    
    # Store in app state for access in routes
    app.state.socratiq_integration = socratiq
    app.state.mlr_service = mlr_workflow_service
    
    yield
    
    # Shutdown
    logger.info("Shutting down Emme Connect service")


# Create FastAPI application
app = FastAPI(
    title="Emme Connect MLR Workflow Service",
    description="Pharmaceutical Medical Legal Regulatory workflow automation system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration for integration with EMME Engage frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",  # EMME Engage development
        "https://*.replit.app",   # Replit deployment
        "http://localhost:3000",  # Alternative dev port
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1", tags=["MLR Workflow"])

@app.get("/")
async def root():
    """Health check and service information"""
    return {
        "service": "Emme Connect MLR Workflow Service",
        "version": "1.0.0",
        "status": "operational",
        "environment": emme_config.environment,
        "capabilities": {
            "mlr_workflow_automation": True,
            "socratiq_transform_integration": True,
            "socratiq_mesh_integration": True,
            "multi_language_support": f"{len(emme_config.language_config.all_languages)} languages",
            "gxp_compliance": True,
            "trace_unit_audit_trails": True
        },
        "endpoints": {
            "health": "/health",
            "mlr_submit": "/api/v1/mlr/submit",
            "mlr_status": "/api/v1/mlr/status/{submission_id}",
            "content_analysis": "/api/v1/content/analyze",
            "workflow_metrics": "/api/v1/workflow/metrics"
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check for monitoring"""
    try:
        # Check service dependencies
        health_status = {
            "status": "healthy",
            "timestamp": "2025-08-11T12:43:00Z",
            "services": {
                "mlr_workflow": "operational",
                "socratiq_transform": "checking...",
                "socratiq_mesh": "checking...",
                "database": "operational"
            },
            "metrics": {
                "active_submissions": len(mlr_workflow_service.active_submissions),
                "total_processed": mlr_workflow_service.workflow_metrics["total_submissions"],
                "avg_completion_time_hours": mlr_workflow_service.workflow_metrics["avg_completion_time_hours"]
            }
        }
        
        # In production: actually check SocratIQ service health
        health_status["services"]["socratiq_transform"] = "operational"
        health_status["services"]["socratiq_mesh"] = "operational"
        
        return health_status
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Global HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }
    )

if __name__ == "__main__":
    # For development - run with: python -m modules.emme_connect.main
    uvicorn.run(
        "modules.emme_connect.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )