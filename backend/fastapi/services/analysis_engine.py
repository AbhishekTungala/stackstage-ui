import asyncio
import json
import os
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging
from .scoring import ScoringEngine

logger = logging.getLogger(__name__)

class AnalysisEngine:
    def __init__(self):
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.scoring_engine = ScoringEngine()
        self.analysis_cache = {}
        
    async def analyze(
        self,
        content: str,
        analysis_mode: str = "comprehensive",
        cloud_provider: str = "aws",
        region: str = "us-east-1",
        requirements: List[str] = None,
        file_content: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Perform comprehensive infrastructure analysis
        """
        try:
            analysis_id = f"analysis_{int(datetime.now().timestamp())}"
            
            logger.info(f"Starting {analysis_mode} analysis for {cloud_provider}")
            
            # Parse and validate content
            parsed_content = await self._parse_content(content, file_content)
            
            # Generate AI analysis
            ai_analysis = await self._generate_ai_analysis(
                parsed_content, analysis_mode, cloud_provider, requirements or []
            )
            
            # Calculate detailed scores
            scores = await self.scoring_engine.calculate_scores(
                architecture=parsed_content,
                cloud_provider=cloud_provider,
                requirements=requirements or []
            )
            
            # Extract issues and recommendations
            issues = await self._extract_issues(ai_analysis, parsed_content)
            recommendations = await self._generate_recommendations(ai_analysis, scores)
            
            # Determine verdict
            overall_score = scores.get("overall", 75)
            verdict = self._determine_verdict(overall_score)
            
            result = {
                "id": analysis_id,
                "score": overall_score,
                "categories": {
                    "security": scores.get("security", 70),
                    "reliability": scores.get("reliability", 75),
                    "scalability": scores.get("scalability", 80),
                    "performance": scores.get("performance", 75),
                    "cost": scores.get("cost", 70)
                },
                "verdict": verdict,
                "issues": issues,
                "recommendations": recommendations,
                "timestamp": self.get_timestamp(),
                "analysis_mode": analysis_mode,
                "cloud_provider": cloud_provider,
                "region": region,
                "detailed_analysis": ai_analysis
            }
            
            # Cache result
            self.analysis_cache[analysis_id] = result
            
            return result
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return await self._fallback_analysis(content, analysis_mode, cloud_provider)
    
    async def get_assistant_response(
        self,
        message: str,
        context: Optional[str] = None,
        persona: str = "architect",
        conversation_history: Optional[List[Dict[str, str]]] = None,
        analysis_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate contextual assistant response
        """
        try:
            # Build conversation context
            conversation_context = self._build_conversation_context(
                message, context, persona, conversation_history, analysis_context
            )
            
            # Generate AI response
            if self.openrouter_api_key:
                response = await self._call_openrouter_assistant(conversation_context, persona)
            else:
                response = self._generate_fallback_response(message, persona)
            
            # Generate dynamic suggestions
            suggestions = await self._generate_suggestions(message, context, analysis_context)
            
            return {
                "message": response,
                "suggestions": suggestions,
                "persona": persona,
                "context_used": bool(context or analysis_context)
            }
            
        except Exception as e:
            logger.error(f"Assistant response failed: {str(e)}")
            return self._generate_fallback_response(message, persona)
    
    async def compare_architectures(
        self, 
        arch1: str, 
        arch2: str, 
        comparison_type: str = "all"
    ) -> Dict[str, Any]:
        """
        Compare two architectures
        """
        try:
            # Analyze both architectures
            analysis1 = await self.analyze(arch1, "quick", "aws")
            analysis2 = await self.analyze(arch2, "quick", "aws")
            
            # Generate comparison
            comparison = {
                "architecture1": {
                    "score": analysis1["score"],
                    "strengths": analysis1["recommendations"][:2],
                    "weaknesses": analysis1["issues"][:2]
                },
                "architecture2": {
                    "score": analysis2["score"],
                    "strengths": analysis2["recommendations"][:2],
                    "weaknesses": analysis2["issues"][:2]
                },
                "winner": "architecture1" if analysis1["score"] > analysis2["score"] else "architecture2",
                "score_difference": abs(analysis1["score"] - analysis2["score"]),
                "detailed_comparison": await self._generate_detailed_comparison(
                    analysis1, analysis2, comparison_type
                )
            }
            
            return comparison
            
        except Exception as e:
            logger.error(f"Architecture comparison failed: {str(e)}")
            return {
                "error": "Comparison failed",
                "message": str(e)
            }
    
    async def _parse_content(self, content: str, file_content: Optional[str] = None) -> str:
        """
        Parse and normalize input content
        """
        if file_content:
            return file_content
        
        # Clean and normalize content
        cleaned_content = re.sub(r'\s+', ' ', content.strip())
        
        # Extract structured information if possible
        if 'terraform' in content.lower() or '.tf' in content.lower():
            return f"[TERRAFORM]\n{cleaned_content}"
        elif 'cloudformation' in content.lower() or 'aws::' in content:
            return f"[CLOUDFORMATION]\n{cleaned_content}"
        elif 'apiVersion' in content and 'kind:' in content:
            return f"[KUBERNETES]\n{cleaned_content}"
        else:
            return f"[ARCHITECTURE_DESCRIPTION]\n{cleaned_content}"
    
    async def _generate_ai_analysis(
        self, 
        content: str, 
        mode: str, 
        provider: str, 
        requirements: List[str]
    ) -> str:
        """
        Generate AI-powered analysis
        """
        if not self.openrouter_api_key:
            return self._generate_mock_analysis(content, mode, provider)
        
        try:
            prompt = self._build_analysis_prompt(content, mode, provider, requirements)
            return await self._call_openrouter(prompt)
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            return self._generate_mock_analysis(content, mode, provider)
    
    async def _call_openrouter(self, prompt: str) -> str:
        """
        Call OpenRouter API for AI analysis
        """
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openrouter_api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://stackstage.dev",
                    "X-Title": "StackStage"
                },
                json={
                    "model": "openai/gpt-4o-mini",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a senior cloud architect providing detailed infrastructure analysis."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            ) as response:
                data = await response.json()
                return data["choices"][0]["message"]["content"]
    
    async def _call_openrouter_assistant(self, context: str, persona: str) -> str:
        """
        Call OpenRouter for assistant responses
        """
        try:
            system_prompts = {
                "cto": "You are a CTO providing strategic technology insights and architectural guidance.",
                "devops": "You are a DevOps engineer focused on operational excellence and automation.",
                "architect": "You are a cloud architect providing technical design and best practices guidance.",
                "security": "You are a security architect focused on security best practices and compliance."
            }
            
            return await self._call_openrouter_with_system(
                context, 
                system_prompts.get(persona, system_prompts["architect"])
            )
        except Exception as e:
            logger.error(f"Assistant API call failed: {str(e)}")
            return self._generate_fallback_response(context, persona)
    
    async def _call_openrouter_with_system(self, prompt: str, system_prompt: str) -> str:
        """
        Call OpenRouter with custom system prompt
        """
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openrouter_api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://stackstage.dev",
                    "X-Title": "StackStage"
                },
                json={
                    "model": "openai/gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 1500
                }
            ) as response:
                data = await response.json()
                return data["choices"][0]["message"]["content"]
    
    def _build_analysis_prompt(
        self, 
        content: str, 
        mode: str, 
        provider: str, 
        requirements: List[str]
    ) -> str:
        """
        Build comprehensive analysis prompt
        """
        return f"""
        Analyze this {provider} cloud infrastructure for {mode} assessment:
        
        Infrastructure Content:
        {content}
        
        Analysis Requirements:
        {', '.join(requirements)}
        
        Please provide:
        1. Overall architecture assessment
        2. Security vulnerabilities and risks
        3. Scalability and performance considerations
        4. Cost optimization opportunities
        5. Reliability and availability concerns
        6. Specific technical recommendations
        
        Focus on actionable insights and specific improvements.
        """
    
    def _build_conversation_context(
        self,
        message: str,
        context: Optional[str],
        persona: str,
        history: Optional[List[Dict[str, str]]],
        analysis_context: Optional[Dict[str, Any]]
    ) -> str:
        """
        Build comprehensive conversation context
        """
        context_parts = [f"User message: {message}"]
        
        if context:
            context_parts.append(f"Additional context: {context}")
        
        if analysis_context:
            context_parts.append(f"Analysis context: {json.dumps(analysis_context, indent=2)}")
        
        if history:
            history_text = "\n".join([
                f"{msg['role']}: {msg['content']}" for msg in history[-5:]  # Last 5 messages
            ])
            context_parts.append(f"Recent conversation:\n{history_text}")
        
        return "\n\n".join(context_parts)
    
    async def _extract_issues(self, analysis: str, content: str) -> List[str]:
        """
        Extract critical issues from analysis
        """
        # Basic issue extraction logic
        issues = []
        
        if 'multi-az' not in content.lower() and 'availability zone' not in content.lower():
            issues.append("No multi-AZ configuration detected for high availability")
        
        if 'monitoring' not in content.lower() and 'cloudwatch' not in content.lower():
            issues.append("Missing monitoring and alerting setup")
        
        if 'iam' not in content.lower() and 'role' not in content.lower():
            issues.append("IAM policies and access controls not clearly defined")
        
        if 'backup' not in content.lower():
            issues.append("No backup strategy specified")
        
        if 'encryption' not in content.lower():
            issues.append("Encryption at rest and in transit not specified")
        
        # Add AI-extracted issues if available
        if 'issue' in analysis.lower() or 'problem' in analysis.lower():
            issues.append("Additional concerns identified in AI analysis")
        
        return issues[:5]  # Limit to top 5 issues
    
    async def _generate_recommendations(self, analysis: str, scores: Dict[str, int]) -> List[str]:
        """
        Generate actionable recommendations
        """
        recommendations = []
        
        # Score-based recommendations
        if scores.get("security", 70) < 75:
            recommendations.append("Implement comprehensive security policies and access controls")
        
        if scores.get("reliability", 70) < 75:
            recommendations.append("Add redundancy and failover mechanisms")
        
        if scores.get("cost", 70) < 75:
            recommendations.append("Optimize resource allocation and implement cost monitoring")
        
        if scores.get("performance", 70) < 75:
            recommendations.append("Review performance bottlenecks and scaling strategies")
        
        # Default recommendations
        recommendations.extend([
            "Implement infrastructure as code for consistency and version control",
            "Add comprehensive monitoring and alerting for all critical components",
            "Establish automated backup and disaster recovery procedures"
        ])
        
        return recommendations[:6]  # Limit to top 6 recommendations
    
    async def _generate_suggestions(
        self, 
        message: str, 
        context: Optional[str], 
        analysis_context: Optional[Dict[str, Any]]
    ) -> List[str]:
        """
        Generate contextual suggestions
        """
        base_suggestions = [
            "Review security best practices for cloud architecture",
            "Consider implementing infrastructure as code",
            "Evaluate multi-region deployment strategy",
            "Assess current monitoring and alerting setup"
        ]
        
        # Context-specific suggestions
        if analysis_context and analysis_context.get("currentScore", 0) < 70:
            base_suggestions.insert(0, "Focus on addressing critical security and reliability issues")
        
        if "cost" in message.lower():
            base_suggestions.insert(0, "Analyze cost optimization opportunities")
        
        if "security" in message.lower():
            base_suggestions.insert(0, "Conduct security vulnerability assessment")
        
        return base_suggestions[:4]
    
    async def _generate_detailed_comparison(
        self, 
        analysis1: Dict[str, Any], 
        analysis2: Dict[str, Any], 
        comparison_type: str
    ) -> Dict[str, Any]:
        """
        Generate detailed architecture comparison
        """
        return {
            "security_comparison": {
                "architecture1": analysis1["categories"]["security"],
                "architecture2": analysis2["categories"]["security"],
                "winner": "architecture1" if analysis1["categories"]["security"] > analysis2["categories"]["security"] else "architecture2"
            },
            "cost_comparison": {
                "architecture1": analysis1["categories"]["cost"],
                "architecture2": analysis2["categories"]["cost"],
                "winner": "architecture1" if analysis1["categories"]["cost"] > analysis2["categories"]["cost"] else "architecture2"
            },
            "performance_comparison": {
                "architecture1": analysis1["categories"]["performance"],
                "architecture2": analysis2["categories"]["performance"],
                "winner": "architecture1" if analysis1["categories"]["performance"] > analysis2["categories"]["performance"] else "architecture2"
            },
            "overall_recommendation": "Consider hybrid approach combining strengths of both architectures"
        }
    
    def _determine_verdict(self, score: int) -> str:
        """
        Determine verdict based on overall score
        """
        if score >= 90:
            return "Excellent architecture with minor optimizations needed"
        elif score >= 80:
            return "Good architecture with some improvements recommended"
        elif score >= 70:
            return "Decent architecture but needs significant improvements"
        elif score >= 60:
            return "Architecture needs substantial work to meet best practices"
        else:
            return "Architecture requires major redesign and improvements"
    
    def _generate_mock_analysis(self, content: str, mode: str, provider: str) -> str:
        """
        Generate mock analysis when AI is unavailable
        """
        return f"""
        Mock analysis for {provider} {mode} assessment:
        
        The infrastructure shows a standard {provider} setup with several areas for improvement.
        Key considerations include security hardening, cost optimization, and scalability planning.
        
        Recommendations focus on implementing best practices for cloud architecture design.
        """
    
    def _generate_fallback_response(self, message: str, persona: str) -> Dict[str, Any]:
        """
        Generate fallback response when AI is unavailable
        """
        responses = {
            "cto": "From a strategic perspective, this architecture decision impacts our long-term scalability and operational efficiency.",
            "devops": "For operational excellence, I recommend implementing automated monitoring, deployment pipelines, and infrastructure as code.",
            "architect": "The architectural pattern you're considering has trade-offs in complexity, maintainability, and performance that should be carefully evaluated.",
            "security": "From a security standpoint, we need to ensure proper access controls, encryption, and compliance measures are in place."
        }
        
        return {
            "message": responses.get(persona, responses["architect"]),
            "suggestions": [
                "Review industry best practices",
                "Consider scalability requirements",
                "Evaluate security implications",
                "Assess cost and operational impact"
            ],
            "persona": persona,
            "context_used": False
        }
    
    async def _fallback_analysis(self, content: str, mode: str, provider: str) -> Dict[str, Any]:
        """
        Generate fallback analysis when main analysis fails
        """
        analysis_id = f"fallback_{int(datetime.now().timestamp())}"
        
        return {
            "id": analysis_id,
            "score": 75,
            "categories": {
                "security": 70,
                "reliability": 75,
                "scalability": 80,
                "performance": 75,
                "cost": 70
            },
            "verdict": "Analysis completed with fallback method",
            "issues": [
                "Detailed analysis unavailable, using baseline assessment",
                "Recommend manual review of security configurations",
                "Consider implementing monitoring and alerting"
            ],
            "recommendations": [
                "Implement comprehensive monitoring and logging",
                "Review security best practices for cloud deployment",
                "Consider infrastructure as code for better management"
            ],
            "timestamp": self.get_timestamp(),
            "analysis_mode": mode,
            "cloud_provider": provider,
            "note": "Fallback analysis - limited AI capabilities"
        }
    
    def get_timestamp(self) -> str:
        """
        Get current timestamp in ISO format
        """
        return datetime.now().isoformat()