#!/usr/bin/env python3
"""
StackStage FastAPI Backend Server
Starts the production-grade FastAPI backend for StackStage
"""

import os
import sys
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    # Ensure we have the required API key
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ ERROR: OPENROUTER_API_KEY environment variable not found!")
        print("Please add your OpenRouter API key to Replit Secrets")
        sys.exit(1)
    
    print("🚀 Starting StackStage FastAPI Backend...")
    print(f"📍 Host: 0.0.0.0")
    print(f"🔌 Port: 8000")
    print(f"🔑 OpenRouter API Key: {'✅ Found' if api_key else '❌ Missing'}")
    print(f"🌐 Environment: {os.getenv('NODE_ENV', 'development')}")
    
    try:
        # Start the server
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()