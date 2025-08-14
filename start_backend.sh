#!/bin/bash
echo "Starting StackStage FastAPI Backend..."

# Set environment variables
export PYTHONPATH="./backend:$PYTHONPATH"

# Change to backend directory
cd backend

echo "Environment variables set:"
echo "OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:+SET}"
echo "PYTHONPATH: $PYTHONPATH"

# Start the server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info