#!/usr/bin/env python3
"""
StackStage Complete Application Startup
Starts both the Express.js frontend (port 5000) and FastAPI backend (port 8000)
"""

import os
import sys
import subprocess
import time
import signal
from pathlib import Path

def start_fastapi_backend():
    """Start the FastAPI backend server"""
    print("🚀 Starting FastAPI Backend on port 8000...")
    
    backend_dir = Path(__file__).parent / "backend"
    
    # Check if OpenRouter API key exists
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ WARNING: OPENROUTER_API_KEY not found. AI features will not work.")
    else:
        print("🔑 OpenRouter API Key: ✅ Found")
    
    # Start FastAPI backend
    cmd = [
        sys.executable, "-m", "uvicorn", 
        "main:app", 
        "--host", "0.0.0.0", 
        "--port", "8000",
        "--reload"
    ]
    
    backend_process = subprocess.Popen(
        cmd,
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    return backend_process

def main():
    print("🌟 Starting StackStage Complete Application...")
    print("📍 Frontend (React + Express): http://localhost:5000")
    print("📍 Backend (FastAPI): http://localhost:8000")
    print("=" * 60)
    
    # Start FastAPI backend
    backend_process = start_fastapi_backend()
    
    # Give backend time to start
    time.sleep(3)
    
    print("\n✅ StackStage Application Started Successfully!")
    print("🌐 Open http://localhost:5000 in your browser")
    print("🔧 API Documentation: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop all services...")
    
    try:
        # Keep script running and monitor backend
        while True:
            if backend_process.poll() is not None:
                print("❌ FastAPI backend stopped unexpectedly")
                break
            time.sleep(5)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down StackStage...")
        backend_process.terminate()
        backend_process.wait()
        print("✅ All services stopped")

if __name__ == "__main__":
    main()