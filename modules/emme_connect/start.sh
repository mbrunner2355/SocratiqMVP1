#!/bin/bash

# Emme Connect MLR Workflow Service Startup Script

echo "Starting Emme Connect MLR Workflow Service..."

# Set environment variables
export EMME_CONNECT_ENV=${EMME_CONNECT_ENV:-development}
export EMME_CONNECT_PORT=${EMME_CONNECT_PORT:-8001}
export EMME_CONNECT_HOST=${EMME_CONNECT_HOST:-0.0.0.0}

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "Error: pip3 is required but not installed."
    exit 1
fi

# Install requirements if they don't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing/updating requirements..."
pip install -r requirements.txt

echo "Starting Emme Connect service on port ${EMME_CONNECT_PORT}..."

# Run the FastAPI application
python -m uvicorn modules.emme_connect.main:app \
    --host ${EMME_CONNECT_HOST} \
    --port ${EMME_CONNECT_PORT} \
    --reload \
    --log-level info \
    --access-log

echo "Emme Connect service stopped."