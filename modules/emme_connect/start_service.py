#!/usr/bin/env python3
"""
Direct startup script for Emme Connect MLR Service
"""
import uvicorn
import asyncio
import logging
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting Emme Connect MLR Workflow Service on Port 8001")
    
    try:
        # Import the FastAPI app
        from simple_server import app
        
        # Start the server
        uvicorn.run(
            app,
            host="0.0.0.0", 
            port=8001,
            log_level="info",
            access_log=True
        )
    except Exception as e:
        logger.error(f"Failed to start Emme Connect service: {e}")
        sys.exit(1)