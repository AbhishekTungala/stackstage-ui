#!/usr/bin/env python3
"""Simple test to validate backend functionality without running the server"""

import sys
import os

# Add backend to path
sys.path.insert(0, 'backend')

async def test_backend_functionality():
    """Test backend functions directly"""
    
    print("Testing StackStage Backend Components...")
    
    # Test imports
    try:
        from utils.ai_engine import analyze_architecture, assistant_chat
        from models.schemas import AnalyzeRequest, AssistantRequest
        print("✓ All imports successful")
    except Exception as e:
        print(f"✗ Import error: {e}")
        return
    
    # Test analysis function
    try:
        test_data = AnalyzeRequest(
            architecture_text="A simple web application with load balancer, web servers, and MySQL database",
            user_region="us-east-1"
        )
        
        result = await analyze_architecture(test_data)
        print(f"✓ Analysis test: Score {result['score']}, {len(result['issues'])} issues, {len(result['recommendations'])} recommendations")
        
    except Exception as e:
        print(f"✗ Analysis test failed: {e}")
    
    # Test assistant function
    try:
        result = await assistant_chat("What are the best practices for AWS security?")
        print(f"✓ Assistant test: Response length {len(result['response'])} chars, {len(result['suggestions'])} suggestions")
        
    except Exception as e:
        print(f"✗ Assistant test failed: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_backend_functionality())