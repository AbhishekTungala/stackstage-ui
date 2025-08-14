#!/usr/bin/env python3
"""Test script to verify backend functionality"""

import sys
import os
import requests
import json

# Add backend directory to path
sys.path.insert(0, 'backend')

def test_backend():
    print("Testing StackStage FastAPI Backend...")
    
    # Test basic endpoints
    base_url = "http://localhost:8000"
    
    try:
        # Test root endpoint
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"Root endpoint: {response.status_code} - {response.json()}")
        
        # Test health endpoints
        endpoints = ["/api/analyze/health", "/api/assistant/health", "/api/diagram/health", "/api/export/health"]
        
        for endpoint in endpoints:
            try:
                response = requests.get(f"{base_url}{endpoint}", timeout=5)
                print(f"{endpoint}: {response.status_code} - {response.json()}")
            except Exception as e:
                print(f"{endpoint}: Error - {str(e)}")
        
        # Test analyze endpoint with sample data
        analyze_data = {
            "architecture_text": "A simple web application with load balancer, web servers, and MySQL database",
            "user_region": "us-east-1"
        }
        
        try:
            response = requests.post(f"{base_url}/api/analyze/", 
                                   json=analyze_data, 
                                   timeout=30)
            if response.status_code == 200:
                result = response.json()
                print(f"Analysis test: SUCCESS - Score: {result.get('score')}")
            else:
                print(f"Analysis test: FAILED - {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Analysis test: ERROR - {str(e)}")
            
    except Exception as e:
        print(f"Backend connection failed: {str(e)}")
        print("Make sure the backend is running: cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000")

if __name__ == "__main__":
    test_backend()