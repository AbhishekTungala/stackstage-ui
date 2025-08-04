import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Mock implementation - no OpenAI API key required

export async function registerRoutes(app: Express): Promise<Server> {
  // Infrastructure Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { content, analysisMode = 'comprehensive', cloudProvider, userRegion } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required for analysis" });
      }

      // Simulate analysis processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      const formattedResult = generateMockAnalysis(analysisMode, cloudProvider, content);

      // Store analysis result
      const analysisId = `analysis_${Date.now()}`;
      await storage.storeAnalysis(analysisId, {
        ...formattedResult,
        timestamp: new Date(),
        mode: analysisMode,
        provider: cloudProvider
      });

      res.json({ success: true, analysisId, result: formattedResult });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ 
        error: "Failed to analyze infrastructure", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI Assistant Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const assistantResponse = generateMockChatResponse(messages);

      res.json({ 
        success: true, 
        message: assistantResponse,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: "Failed to get AI response", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get Analysis Results
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json({ success: true, analysis });
    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ error: "Failed to retrieve analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function buildAnalysisPrompt(mode: string, provider?: string): string {
  const basePrompt = `You are an expert cloud infrastructure analyst. Analyze the provided infrastructure configuration and return a comprehensive assessment in JSON format.

Required JSON structure:
{
  "overallScore": number (0-100),
  "securityScore": number (0-100),
  "costScore": number (0-100),
  "performanceScore": number (0-100),
  "criticalIssues": [
    {
      "id": "unique-id",
      "type": "critical",
      "category": "security|cost|performance|compliance",
      "title": "Issue Title",
      "description": "Detailed description",
      "impact": "Business impact description",
      "severity": number (1-10),
      "resource": "affected resource name"
    }
  ],
  "warnings": [similar structure with type: "warning"],
  "recommendations": [
    {
      "id": "unique-id",
      "title": "Recommendation Title",
      "description": "Detailed description",
      "category": "security|cost|performance",
      "priority": "high|medium|low",
      "effort": "low|medium|high",
      "impact": "Expected impact description",
      "estimatedSavings": number (monthly USD),
      "implementation": ["step 1", "step 2", "step 3"]
    }
  ],
  "estimatedSavings": number (total monthly USD savings),
  "diagramCode": "mermaid diagram code representing the architecture with proper styling classes for issues",
  "summary": "executive summary of findings"
}`;

  const modeSpecific = {
    'security': ' Focus heavily on security vulnerabilities, compliance issues, and access controls.',
    'cost': ' Prioritize cost optimization opportunities, resource utilization, and spending efficiency.',
    'performance': ' Emphasize performance bottlenecks, scalability issues, and optimization opportunities.',
    'comprehensive': ' Provide balanced analysis across security, cost, and performance dimensions.'
  };

  const providerSpecific = provider ? ` Focus on ${provider} best practices and services.` : '';

  return basePrompt + (modeSpecific[mode as keyof typeof modeSpecific] || modeSpecific.comprehensive) + providerSpecific;
}

function generateMockAnalysis(mode: string, provider?: string, content?: string) {
  const scores = generateScoresBasedOnMode(mode);
  
  return {
    overallScore: scores.overall,
    securityScore: scores.security,
    costScore: scores.cost,
    performanceScore: scores.performance,
    criticalIssues: generateMockIssues('critical', provider),
    warnings: generateMockIssues('warning', provider),
    recommendations: generateMockRecommendations(provider),
    estimatedSavings: Math.floor(Math.random() * 5000) + 1000,
    diagramCode: generateMockDiagram(provider),
    summary: generateMockSummary(mode, provider, scores.overall)
  };
}

function generateScoresBasedOnMode(mode: string) {
  const base = {
    overall: 65 + Math.floor(Math.random() * 25),
    security: 70 + Math.floor(Math.random() * 20),
    cost: 60 + Math.floor(Math.random() * 30),
    performance: 75 + Math.floor(Math.random() * 20)
  };
  
  switch (mode) {
    case 'security':
      base.security -= 10;
      break;
    case 'cost':
      base.cost -= 15;
      break;
    case 'performance':
      base.performance -= 10;
      break;
  }
  
  base.overall = Math.floor((base.security + base.cost + base.performance) / 3);
  return base;
}

function generateMockIssues(type: 'critical' | 'warning', provider?: string) {
  const issues: any[] = [];
  const count = type === 'critical' ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 4) + 2;
  
  const templates = {
    security: [
      { title: 'Exposed Database', category: 'security', description: 'Database instance has public access enabled', severity: 9 },
      { title: 'Weak IAM Policies', category: 'security', description: 'Overly permissive IAM roles detected', severity: 7 },
      { title: 'Unencrypted Storage', category: 'security', description: 'S3 buckets without encryption', severity: 8 }
    ],
    cost: [
      { title: 'Oversized Instances', category: 'cost', description: 'EC2 instances are over-provisioned', severity: 6 },
      { title: 'Unused Resources', category: 'cost', description: 'Idle load balancers detected', severity: 5 },
      { title: 'No Reserved Instances', category: 'cost', description: 'Missing cost optimization opportunities', severity: 4 }
    ],
    performance: [
      { title: 'Database Bottleneck', category: 'performance', description: 'High CPU utilization on RDS', severity: 7 },
      { title: 'No CDN', category: 'performance', description: 'Static assets served without CDN', severity: 5 },
      { title: 'Single AZ Deployment', category: 'performance', description: 'No redundancy across availability zones', severity: 6 }
    ]
  };
  
  for (let i = 0; i < count; i++) {
    const categoryTemplates = templates[Object.keys(templates)[Math.floor(Math.random() * 3)] as keyof typeof templates];
    const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
    
    issues.push({
      id: `${type}_${i + 1}`,
      type,
      category: template.category,
      title: template.title,
      description: template.description,
      impact: `This issue could lead to ${type === 'critical' ? 'significant' : 'moderate'} ${template.category} problems`,
      severity: template.severity,
      resource: `${provider || 'AWS'}-resource-${i + 1}`
    });
  }
  
  return issues;
}

function generateMockRecommendations(provider?: string) {
  return [
    {
      id: 'rec_1',
      title: 'Implement Multi-AZ Deployment',
      description: 'Deploy resources across multiple availability zones for better resilience',
      category: 'performance',
      priority: 'high',
      effort: 'medium',
      impact: 'Improved availability and disaster recovery capabilities',
      estimatedSavings: 0,
      implementation: ['Configure auto-scaling groups', 'Update load balancer settings', 'Test failover procedures']
    },
    {
      id: 'rec_2', 
      title: 'Enable Cost Optimization',
      description: 'Implement reserved instances and right-sizing recommendations',
      category: 'cost',
      priority: 'high',
      effort: 'low',
      impact: 'Reduce monthly infrastructure costs by 20-30%',
      estimatedSavings: Math.floor(Math.random() * 2000) + 500,
      implementation: ['Analyze usage patterns', 'Purchase reserved instances', 'Implement auto-scaling policies']
    },
    {
      id: 'rec_3',
      title: 'Enhance Security Posture',
      description: 'Implement comprehensive security monitoring and access controls',
      category: 'security',
      priority: 'medium',
      effort: 'high',
      impact: 'Significantly improved security compliance and threat detection',
      estimatedSavings: 0,
      implementation: ['Enable CloudTrail logging', 'Configure VPC Flow Logs', 'Implement IAM best practices']
    }
  ];
}

function generateMockDiagram(provider?: string) {
  return `graph TB
    subgraph "Cloud Infrastructure - ${provider || 'AWS'}"
        LB[Load Balancer]
        WEB1[Web Server 1]
        WEB2[Web Server 2]
        DB[(Database)]
        CACHE[Redis Cache]
        
        LB --> WEB1
        LB --> WEB2
        WEB1 --> DB
        WEB2 --> DB
        WEB1 --> CACHE
        WEB2 --> CACHE
    end
    
    classDef warning fill:#fff3cd,stroke:#856404
    classDef critical fill:#f8d7da,stroke:#721c24
    
    class DB critical
    class CACHE warning`;
}

function generateMockSummary(mode: string, provider?: string, overallScore?: number) {
  const grade = (overallScore || 65) >= 80 ? 'excellent' : (overallScore || 65) >= 60 ? 'good' : 'needs improvement';
  
  return `Infrastructure analysis completed for ${provider || 'AWS'} environment. 
  Overall architecture shows ${grade} implementation with ${overallScore || 65}/100 score. 
  ${mode === 'security' ? 'Security-focused analysis reveals several areas for improvement in access controls and data protection.' : ''}
  ${mode === 'cost' ? 'Cost optimization analysis identifies significant potential savings through rightsizing and reserved instances.' : ''}
  ${mode === 'performance' ? 'Performance review shows opportunities for latency reduction and scalability improvements.' : ''}
  Key recommendations include multi-AZ deployment, enhanced monitoring, and cost optimization strategies.`;
}

function generateMockChatResponse(messages: any[]) {
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage?.content || '';
  
  const responses = [
    `Based on your question about "${userMessage.substring(0, 50)}...", I'd recommend implementing a multi-layered approach. Here are the key steps:

1. **Assessment Phase**: Start by analyzing your current infrastructure using tools like AWS Config or CloudFormation drift detection.

2. **Security Implementation**: Implement least-privilege IAM policies and enable comprehensive logging with CloudTrail.

3. **Performance Optimization**: Consider implementing auto-scaling groups and Application Load Balancers for better distribution.

4. **Cost Management**: Use AWS Cost Explorer to identify optimization opportunities and consider Reserved Instances for predictable workloads.

Would you like me to elaborate on any of these areas or help you with specific implementation details?`,

    `Great question! For ${userMessage.toLowerCase().includes('security') ? 'security' : userMessage.toLowerCase().includes('cost') ? 'cost optimization' : 'infrastructure'} best practices, here's what I recommend:

**Immediate Actions:**
- Enable multi-factor authentication across all admin accounts
- Implement network segmentation with VPCs and security groups
- Set up automated backup and disaster recovery procedures

**Medium-term Goals:**
- Establish Infrastructure as Code using Terraform or CloudFormation
- Implement comprehensive monitoring with CloudWatch and custom metrics
- Create automated compliance reporting and alerting

**Long-term Strategy:**
- Consider containerization with EKS or ECS for better scalability
- Implement blue-green deployment strategies
- Establish cost governance policies and budget alerts

The key is to prioritize based on your current risk profile and business requirements. What's your primary concern right now?`,

    `Excellent point about infrastructure optimization. Here's a comprehensive approach:

**Architecture Review:**
- Assess current resource utilization and identify bottlenecks
- Evaluate data flow patterns and API dependencies
- Review security boundaries and access patterns

**Implementation Strategy:**
\`\`\`yaml
# Example Terraform configuration
resource "aws_autoscaling_group" "web_asg" {
  name               = "web-servers"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.web.arn]
  health_check_type   = "ELB"
  
  min_size         = 2
  max_size         = 10
  desired_capacity = 3
}
\`\`\`

**Monitoring Setup:**
- CloudWatch dashboards for real-time visibility
- Custom metrics for business-specific KPIs
- Automated alerting with SNS and Lambda integration

This approach typically reduces operational overhead by 40-60% while improving reliability. Would you like me to dive deeper into any specific area?`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
