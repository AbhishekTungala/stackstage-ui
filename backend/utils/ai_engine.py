import os
import json
import uuid
import requests
from datetime import datetime
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# OpenRouter configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

async def analyze_architecture(data) -> Dict[str, Any]:
    """Analyze cloud architecture using OpenRouter API"""
    
    prompt = f"""
    You are a senior cloud architect expert. Analyze this cloud architecture and provide a comprehensive assessment:

    Architecture Description: {data.architecture_text}
    User Region: {data.user_region}

    IMPORTANT: Return ONLY a valid JSON object with no additional text or markdown formatting. The response must be structured exactly as follows:

    {{
        "score": <number 0-100>,
        "issues": ["specific issue 1", "specific issue 2", "specific issue 3"],
        "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"],
        "diagram": "graph TD; A[Load Balancer] --> B[Web Servers]; B --> C[Database]; B --> D[Cache]",
        "cost_estimate": "$XXX-$XXX/month",
        "details": {{
            "security_grade": "A/B/C/D/F",
            "scalability_score": <number 0-100>,
            "reliability_score": <number 0-100>,
            "cost_efficiency": "Excellent/Good/Fair/Poor",
            "compliance_status": "Compliant/Non-compliant",
            "performance_rating": "High/Medium/Low"
        }}
    }}
    """

    try:
        if not OPENROUTER_API_KEY:
            raise ValueError("OpenRouter API key not configured")

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://stackstage.replit.dev",
            "X-Title": "StackStage Architecture Analysis",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-4o-mini",  # Cost-effective model
            "messages": [
                {
                    "role": "system", 
                    "content": "You are an expert cloud architect with 15+ years of experience in AWS, Azure, and GCP. Analyze architectures for security, performance, cost, and scalability. Always return valid JSON only."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }

        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"API request failed with status {response.status_code}: {response.text}")

        result = response.json()
        content = result['choices'][0]['message']['content'].strip()
        
        # Clean and parse JSON response
        try:
            # Remove any markdown formatting
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()
            
            analysis_data = json.loads(content)
            
        except json.JSONDecodeError as e:
            # If JSON parsing fails, create structured response
            analysis_data = {
                "score": 70,
                "issues": ["Complex architecture requires detailed review", "Consider scalability planning", "Review security configurations"],
                "recommendations": ["Implement monitoring and logging", "Add redundancy for critical components", "Optimize for cost efficiency"],
                "diagram": f"graph TD; A[User Request] --> B[{data.user_region} Load Balancer]; B --> C[Application Layer]; C --> D[Database]; C --> E[Cache Layer]",
                "cost_estimate": "$300-$800/month",
                "details": {
                    "security_grade": "B",
                    "scalability_score": 75,
                    "reliability_score": 80,
                    "cost_efficiency": "Good",
                    "compliance_status": "Needs Review",
                    "performance_rating": "Medium"
                }
            }

        return {
            "score": int(analysis_data.get("score", 70)),
            "issues": analysis_data.get("issues", []),
            "recommendations": analysis_data.get("recommendations", []),
            "diagram": analysis_data.get("diagram", "graph TD; A[Application] --> B[Database]"),
            "estimated_cost": analysis_data.get("cost_estimate", "$400/month"),
            "analysis_id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "details": analysis_data.get("details", {})
        }
        
    except Exception as e:
        # Professional error response
        return {
            "score": 0,
            "issues": [f"Analysis service temporarily unavailable: {str(e)}", "Please verify API configuration", "Try again in a few moments"],
            "recommendations": ["Check OpenRouter API key configuration", "Ensure stable internet connection", "Contact support if issue persists"],
            "diagram": "graph TD; Error[Analysis Failed] --> Config[Check API Config]; Config --> Retry[Try Again]",
            "estimated_cost": "Unable to estimate",
            "analysis_id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "details": {"error": str(e), "service": "OpenRouter API"}
        }

async def assistant_chat(prompt: str, context: Optional[str] = None) -> Dict[str, Any]:
    """Handle chat assistant interactions using OpenRouter"""
    
    system_message = """You are StackStage AI Assistant, an expert in cloud architecture, DevOps, and infrastructure optimization with 15+ years of experience.
    
    You specialize in:
    - Cloud architecture design and review (AWS, Azure, GCP)
    - Cost optimization strategies and FinOps
    - Security best practices and compliance
    - Performance tuning and scalability
    - Migration planning and strategy
    - Infrastructure as Code (Terraform, CloudFormation)
    - Kubernetes and container orchestration
    - CI/CD pipeline optimization
    
    Provide practical, actionable advice with specific recommendations. Be conversational but professional."""
    
    try:
        if not OPENROUTER_API_KEY:
            raise ValueError("OpenRouter API key not configured")

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://stackstage.replit.dev", 
            "X-Title": "StackStage AI Assistant",
            "Content-Type": "application/json"
        }

        messages = [{"role": "system", "content": system_message}]
        
        if context:
            messages.append({"role": "user", "content": f"Context: {context}"})
        
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "openai/gpt-4o-mini",
            "messages": messages,
            "temperature": 0.8,
            "max_tokens": 1500
        }

        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"API request failed with status {response.status_code}: {response.text}")

        result = response.json()
        content = result['choices'][0]['message']['content'] or ""
        
        # Generate contextual suggestions based on the response
        suggestions = generate_suggestions(content, prompt)
        
        return {
            "response": content,
            "suggestions": suggestions,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "response": f"I apologize, but I'm currently experiencing technical difficulties. This usually happens when the API key needs to be configured or there's a temporary service issue. Please check the OpenRouter API configuration and try again.",
            "suggestions": ["Check OpenRouter API key in Secrets", "Verify internet connectivity", "Try asking a different question"],
            "timestamp": datetime.now().isoformat()
        }

def generate_suggestions(response_content: str, original_prompt: str) -> List[str]:
    """Generate contextual suggestions based on AI response"""
    
    suggestions = []
    
    # Add suggestions based on content keywords
    if any(keyword in response_content.lower() for keyword in ['aws', 'amazon']):
        suggestions.append("Show me AWS pricing calculator")
        
    if any(keyword in response_content.lower() for keyword in ['security', 'vulnerability']):
        suggestions.append("Run a security audit analysis")
        
    if any(keyword in response_content.lower() for keyword in ['cost', 'expensive', 'pricing']):
        suggestions.append("Analyze cost optimization opportunities")
        
    if any(keyword in response_content.lower() for keyword in ['performance', 'latency', 'speed']):
        suggestions.append("Check performance optimization strategies")
        
    if any(keyword in response_content.lower() for keyword in ['database', 'db', 'storage']):
        suggestions.append("Review database architecture")
        
    # Default suggestions if none matched
    if not suggestions:
        suggestions = [
            "Analyze my current architecture",
            "Show me best practices",
            "Help with cost optimization"
        ]
    
    return suggestions[:3]  # Limit to 3 suggestions