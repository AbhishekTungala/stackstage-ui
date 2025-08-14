import os
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional, List
from openai import OpenAI

# Initialize OpenAI client - will use API key from environment
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_architecture(data) -> Dict[str, Any]:
    """Analyze cloud architecture using OpenAI GPT-4"""
    
    prompt = f"""
    You are a senior cloud architect expert. Analyze this cloud architecture and provide a comprehensive assessment:

    Architecture Description: {data.architecture_text}
    User Region: {data.user_region}

    Please analyze and provide:
    1. Overall architecture score (0-100)
    2. Critical issues and security vulnerabilities
    3. Performance optimization recommendations
    4. Cost optimization suggestions
    5. A Mermaid diagram of the optimized architecture
    6. Estimated monthly cost range

    Return your response in this JSON format:
    {{
        "score": <number>,
        "issues": ["issue1", "issue2", ...],
        "recommendations": ["rec1", "rec2", ...],
        "diagram": "graph TD; <mermaid syntax>",
        "cost_estimate": "$XXX-$XXX/month",
        "details": {{
            "security_grade": "A/B/C/D/F",
            "scalability_score": <number>,
            "reliability_score": <number>,
            "cost_efficiency": "Excellent/Good/Fair/Poor"
        }}
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert cloud architect with 15+ years of experience in AWS, Azure, and GCP. Provide detailed, actionable insights."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Parse the JSON response
        content = response.choices[0].message.content
        
        # Try to extract JSON from the response
        try:
            # Find JSON in the response
            if content:
                start_idx = content.find('{')
                end_idx = content.rfind('}') + 1
                json_str = content[start_idx:end_idx]
                analysis_data = json.loads(json_str)
            else:
                raise ValueError("Empty response")
        except:
            # Fallback if JSON parsing fails
            analysis_data = {
                "score": 75,
                "issues": ["Unable to parse detailed analysis"],
                "recommendations": ["Review architecture documentation"],
                "diagram": "graph TD; A[Application] --> B[Database]",
                "cost_estimate": "$200-$500/month",
                "details": {
                    "security_grade": "B",
                    "scalability_score": 75,
                    "reliability_score": 80,
                    "cost_efficiency": "Good"
                }
            }

        return {
            "score": analysis_data.get("score", 75),
            "issues": analysis_data.get("issues", []),
            "recommendations": analysis_data.get("recommendations", []),
            "diagram": analysis_data.get("diagram", "graph TD; A[App] --> B[DB]"),
            "estimated_cost": analysis_data.get("cost_estimate", "$300/month"),
            "analysis_id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "details": analysis_data.get("details", {})
        }
        
    except Exception as e:
        # Fallback response if API fails
        return {
            "score": 0,
            "issues": [f"Analysis failed: {str(e)}"],
            "recommendations": ["Please check API configuration and try again"],
            "diagram": "graph TD; Error[API Error] --> Check[Check Configuration]",
            "estimated_cost": "Unable to estimate",
            "analysis_id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "details": {"error": str(e)}
        }

async def assistant_chat(prompt: str, context: Optional[str] = None) -> Dict[str, Any]:
    """Handle chat assistant interactions"""
    
    system_message = """You are StackStage AI Assistant, an expert in cloud architecture, DevOps, and infrastructure optimization. 
    
    You help users with:
    - Cloud architecture design and review
    - Cost optimization strategies
    - Security best practices
    - Performance tuning
    - Migration planning
    - Infrastructure as Code
    
    Provide practical, actionable advice with specific recommendations."""
    
    messages = [{"role": "system", "content": system_message}]
    
    if context:
        messages.append({"role": "user", "content": f"Context: {context}"})
    
    messages.append({"role": "user", "content": prompt})
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.8,
            max_tokens=1500
        )
        
        content = response.choices[0].message.content or ""
        
        # Generate contextual suggestions based on the response
        suggestions = generate_suggestions(content, prompt)
        
        return {
            "response": content,
            "suggestions": suggestions,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "response": f"I apologize, but I'm currently unable to process your request. Please check if the API key is configured properly. Error: {str(e)}",
            "suggestions": ["Check API configuration", "Try again later", "Contact support"],
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