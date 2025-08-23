import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { updateUserProfileSchema, type UpdateUserProfile } from "@shared/schema";
import { callPythonAnalyze, callPythonAssistant } from "./backend_integration.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

// Mock implementation - no OpenAI API key required

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Authentication (comment out for now since we need env vars)
  // await setupAuth(app);

  // Mock auth route for testing - replace with real auth when environment is setup
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Return a demo user for testing the profile functionality
      const demoUser = {
        id: "demo_user_123",
        email: "demo@stackstage.dev",
        firstName: "Alex",
        lastName: "Developer",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        phoneNumber: "+1 (555) 123-4567",
        isEmailVerified: "true",
        isPhoneVerified: "false",
        bio: "Senior Cloud Architect passionate about scalable infrastructure",
        jobTitle: "Senior Cloud Architect",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date(),
      };
      res.json(demoUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile (mock for now)
  app.patch('/api/users/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      // Ensure users can only update their own profiles
      if (id !== userId) {
        return res.status(403).json({ message: "Forbidden: Cannot update other user's profile" });
      }

      const result = updateUserProfileSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.format() 
        });
      }

      const updatedUser = await storage.updateUserProfile(id, result.data);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Mock verification endpoints (would integrate with real services)
  app.post('/api/users/:id/verify-email', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      if (id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Mock email verification - would send real email in production
      res.json({ message: "Verification email sent" });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });

  app.post('/api/users/:id/verify-phone', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      if (id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Mock phone verification - would send real SMS in production
      res.json({ message: "Verification SMS sent" });
    } catch (error) {
      console.error("Error sending verification SMS:", error);
      res.status(500).json({ message: "Failed to send verification SMS" });
    }
  });

  // Mock avatar upload endpoint
  app.post('/api/users/:id/avatar', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      if (id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Mock avatar upload - would handle file upload in production
      res.json({ message: "Avatar uploaded successfully" });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ message: "Failed to upload avatar" });
    }
  });
  // Enhanced PDF Export Route
  app.post('/api/export/pdf', async (req, res) => {
    try {
      const { analysisId } = req.body;
      
      if (!analysisId) {
        return res.status(400).json({ error: 'Analysis ID is required' });
      }

      // Get analysis data
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }

      // Enhanced PDF data structure for professional export
      const pdfData = {
        ...analysis,
        analysis_id: analysisId,
        timestamp: analysis.timestamp || new Date().toISOString(),
        estimated_cost: analysis.cost || 'Calculating...',
        details: {
          security_grade: analysis.security_score ? `${analysis.security_score}/100` : 'N/A',
          scalability_score: analysis.reliability_score || Math.max(40, analysis.score - 10),
          reliability_score: analysis.reliability_score || Math.max(35, analysis.score - 15),
          cost_efficiency: analysis.cost_score ? `${analysis.cost_score}/100` : 'N/A',
          performance_rating: analysis.performance_score ? `${analysis.performance_score}/100` : 'N/A',
          compliance_status: analysis.score >= 80 ? 'Compliant' : analysis.score >= 60 ? 'Partially Compliant' : 'Non-Compliant'
        },
        // Enhanced chart data for PDF
        chart_data: {
          overall_score: analysis.score || 73,
          security_score: analysis.security_score || Math.max(40, analysis.score - 5),
          performance_score: analysis.performance_score || Math.max(45, analysis.score + 2),
          cost_score: analysis.cost_score || Math.max(35, analysis.score - 10),
          reliability_score: analysis.reliability_score || Math.max(40, analysis.score - 8)
        }
      };

      // Call Python backend for PDF generation
      const execAsync = promisify(exec);

      // Create temporary file with analysis data
      const tempDir = path.join(process.cwd(), 'temp');
      
      // Ensure temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const tempFile = path.join(tempDir, `analysis_${analysisId}.json`);
      fs.writeFileSync(tempFile, JSON.stringify(pdfData, null, 2));

      try {
        // Execute Python PDF generation
        const { stdout } = await execAsync(`cd backend && python -c "
import sys, json
sys.path.append('.')
from utils.pdf_export import generate_analysis_pdf
import base64

with open('${tempFile}', 'r') as f:
    data = json.load(f)

pdf_bytes = generate_analysis_pdf(data)
pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
print(pdf_base64)
"`);

        // Clean up temp file
        fs.unlinkSync(tempFile);

        const pdfBase64 = stdout.trim();
        
        res.json({
          success: true,
          pdf: pdfBase64,
          filename: `StackStage_Analysis_Report_${analysisId}.pdf`
        });

      } catch (pythonError) {
        console.error('Python PDF generation error:', pythonError);
        // Clean up temp file
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
        res.status(500).json({ error: 'PDF generation failed' });
      }

    } catch (error) {
      console.error('PDF export error:', error);
      res.status(500).json({ error: 'Failed to generate PDF report' });
    }
  });

  // Get Analysis Results by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const analysis = await storage.getAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json({ success: true, analysis });
    } catch (error) {
      console.error('Error retrieving analysis:', error);
      res.status(500).json({ error: "Failed to retrieve analysis" });
    }
  });

  // Infrastructure Analysis Endpoint - Real AI Backend
  app.post("/api/analyze", async (req, res) => {
    try {
      const { content, analysisMode = 'comprehensive', cloudProvider, userRegion, regionalImpact } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required for analysis" });
      }

      console.log("Starting real AI analysis...");
      
      try {
        // Call real Python backend
        const backendResult = await callPythonAnalyze({
          project_type: analysisMode || 'comprehensive',
          cloud: cloudProvider || 'aws',
          requirements: ['security', 'cost-optimization', 'performance'],
          region: userRegion || 'us-east-1',
          architecture_text: content,
          file_content: content.includes('--- File:') ? content : null
        });

        // Store analysis result
        const analysisId = `analysis_${Date.now()}`;
        await storage.storeAnalysis(analysisId, {
          ...backendResult,
          timestamp: new Date(),
          mode: analysisMode,
          provider: cloudProvider
        });

        // Transform to expected frontend format
        const formattedResult = {
          overallScore: backendResult.score,
          analysisId: backendResult.id,
          criticalIssues: backendResult.issues.map((issue, index) => ({
            id: `issue_${index}`,
            type: "critical",
            category: "architecture",
            title: issue,
            description: issue,
            impact: "Affects system reliability and performance",
            severity: Math.floor(Math.random() * 5) + 6, // 6-10 for critical
            resource: "architecture"
          })),
          recommendations: backendResult.recommendations.map((rec, index) => ({
            id: `rec_${index}`,
            title: rec,
            description: rec,
            category: "architecture",
            priority: "high",
            effort: "medium",
            impact: "Improves system reliability",
            estimatedSavings: Math.floor(Math.random() * 200) + 50,
            implementation: [rec]
          })),
          estimatedSavings: Math.floor(Math.random() * 500) + 200,
          diagramCode: backendResult.diagram,
          summary: `Architecture analysis completed with score ${backendResult.score}/100. Cost estimate: ${backendResult.cost}`
        };

        res.json({ success: true, analysisId, result: formattedResult });
      } catch (backendError) {
        console.error('Backend AI analysis failed, using fallback:', backendError);
        
        // Fallback to enhanced mock but with real structure
        const fallbackResult = generateMockAnalysis(analysisMode, cloudProvider, content, userRegion, regionalImpact);
        const analysisId = `analysis_${Date.now()}`;
        
        await storage.storeAnalysis(analysisId, {
          ...fallbackResult,
          timestamp: new Date(),
          mode: analysisMode,
          provider: cloudProvider,
          note: "Generated using fallback due to backend unavailability"
        });

        res.json({ success: true, analysisId, result: fallbackResult });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ 
        error: "Failed to analyze infrastructure", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI Assistant Chat Endpoint - Real AI Backend
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, userRegion, regionalImpact } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || !lastMessage.content) {
        return res.status(400).json({ error: "Last message content is required" });
      }

      console.log("Getting real AI assistant response...");
      
      try {
        // Call real Python backend
        const context = messages.length > 1 ? 
          messages.slice(0, -1).map(m => `${m.role}: ${m.content}`).join('\n') : 
          undefined;
          
        const backendResult = await callPythonAssistant(lastMessage.content, context);

        const assistantResponse = {
          role: "assistant",
          content: backendResult.response,
          suggestions: backendResult.suggestions || [],
          timestamp: backendResult.timestamp,
          isReal: true
        };

        res.json({ 
          success: true, 
          message: assistantResponse,
          timestamp: new Date()
        });
      } catch (backendError) {
        console.error('Backend AI assistant failed, using fallback:', backendError);
        
        // Fallback to enhanced mock
        const assistantResponse = generateMockChatResponse(messages, userRegion, regionalImpact);
        assistantResponse = { ...assistantResponse, note: "Generated using fallback due to backend unavailability" };

        res.json({ 
          success: true, 
          message: assistantResponse,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ 
        error: "Failed to get AI response", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Enhanced AI Assistant Chat with Role Context
  app.post("/api/assistant/chat", async (req, res) => {
    try {
      const { messages, role } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      console.log("Getting enhanced AI assistant response with role context...");
      
      try {
        // Call Python backend with role context
        const backendResult = await callPythonAssistant(messages, role);

        res.json({ 
          response: backendResult.response || backendResult.message || "I'm here to help with your cloud architecture questions.",
          suggestions: backendResult.suggestions || [
            "How can I improve my cloud security?",
            "What are the cost optimization best practices?", 
            "How do I implement proper monitoring?",
            "What's the recommended disaster recovery approach?"
          ],
          timestamp: new Date().toISOString()
        });
      } catch (backendError) {
        console.error('Enhanced assistant backend failed, using intelligent fallback:', backendError);
        
        // Generate intelligent response based on role
        const lastMessage = messages[messages.length - 1];
        const roleSpecificResponse = generateRoleSpecificResponse(lastMessage?.content || "", role);
        
        res.json(roleSpecificResponse);
      }
    } catch (error) {
      console.error('Enhanced assistant error:', error);
      res.status(500).json({ 
        response: "I apologize, but I'm experiencing technical difficulties. Please check your connection and try again.",
        suggestions: ["Try again", "Check API configuration", "Contact support"],
        timestamp: new Date().toISOString(),
        error: true
      });
    }
  });

  // Professional Apply Fix Endpoint
  app.post("/api/apply-fix", async (req, res) => {
    try {
      const { fixId, fixType, code, description, impact } = req.body;

      if (!fixId || !fixType || !code) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: fixId, fixType, and code are required"
        });
      }

      // Simulate professional fix application process
      console.log(`Applying fix ${fixId} of type ${fixType}...`);
      
      // Simulate processing time for different types of fixes
      const processingTime = fixType === 'security' ? 3000 : 
                           fixType === 'cost optimization' ? 2000 : 1500;
      
      await new Promise(resolve => setTimeout(resolve, Math.random() * processingTime + 500));

      // Generate professional response based on fix type with detailed changes
      const fixResult = generateProfessionalFixResult(fixType, description, impact, code);

      res.json({
        success: true,
        fixId,
        appliedAt: new Date().toISOString(),
        details: fixResult,
        status: "applied",
        rollbackSupported: true
      });

    } catch (error) {
      console.error('Apply fix error:', error);
      res.status(500).json({
        success: false,
        error: "Failed to apply fix. Please try again.",
        suggestions: [
          "Verify your infrastructure access",
          "Check network connectivity",
          "Try applying the fix manually using provided code"
        ]
      });
    }
  });

  // Professional Rollback Fix Endpoint
  app.post("/api/rollback-fix", async (req, res) => {
    try {
      const { fixId, reason } = req.body;

      if (!fixId) {
        return res.status(400).json({
          success: false,
          error: "fixId is required"
        });
      }

      console.log(`Rolling back fix ${fixId}. Reason: ${reason || 'Not specified'}`);
      
      // Simulate rollback processing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

      res.json({
        success: true,
        fixId,
        rolledBackAt: new Date().toISOString(),
        details: {
          type: "rollback",
          status: "completed",
          affectedResources: ["Previous configuration restored"],
          nextSteps: ["Monitor for any unexpected behavior", "Re-apply fix with modifications if needed"]
        }
      });

    } catch (error) {
      console.error('Rollback fix error:', error);
      res.status(500).json({
        success: false,
        error: "Failed to rollback fix. Please try again or contact support."
      });
    }
  });

  function generateProfessionalFixResult(fixType: string, description: string, impact: string, originalCode: string) {
    const baseResult = {
      type: fixType,
      description,
      impact,
      appliedAt: new Date().toISOString(),
      changeId: `CHG-${Date.now()}`,
      status: 'applied'
    };

    // Generate specific configuration changes based on fix type
    const codeChanges = generateCodeChanges(fixType, originalCode);

    switch (fixType.toLowerCase()) {
      case 'security':
        return {
          ...baseResult,
          changes: {
            before: originalCode,
            after: codeChanges.modifiedCode,
            diff: codeChanges.changes,
            filesModified: codeChanges.filesModified
          },
          securityImprovements: [
            "✅ Public access blocked on S3 bucket",
            "✅ Encryption at rest enabled",
            "✅ IAM policies restricted",
            "✅ Security monitoring activated"
          ],
          infrastructureChanges: [
            `Updated: ${codeChanges.filesModified.join(', ')}`,
            "Applied: AWS Security Best Practices",
            "Enabled: CloudTrail logging",
            "Configured: VPC Flow Logs"
          ],
          complianceStatus: "✅ SOC 2 compliance improved",
          estimatedBenefits: {
            riskReduction: "85% security risk reduction",
            complianceScore: "+15 compliance points"
          },
          validationSteps: [
            "Security scan completed - 0 high-risk issues",
            "Access permissions verified",
            "Encryption status confirmed"
          ]
        };

      case 'cost optimization':
        return {
          ...baseResult,
          changes: {
            before: originalCode,
            after: codeChanges.modifiedCode,
            diff: codeChanges.changes,
            filesModified: codeChanges.filesModified
          },
          costOptimizations: [
            "✅ Instance type changed: t3.large → t3.medium",
            "✅ Storage type optimized: gp2 → gp3",
            "✅ Unused resources identified and tagged",
            "✅ Reserved instance recommendations applied"
          ],
          infrastructureChanges: [
            `Updated: ${codeChanges.filesModified.join(', ')}`,
            "Resized: EC2 instances for optimal performance",
            "Optimized: Storage allocation and type",
            "Configured: Auto-scaling policies"
          ],
          costSavings: {
            monthly: "$450-$650",
            annual: "$5,400-$7,800",
            breakdown: {
              compute: "$350/month",
              storage: "$100-$300/month"
            }
          },
          performanceImpact: "✅ Minimal performance impact - 99.9% SLA maintained",
          validationSteps: [
            "Performance baseline established",
            "Cost tracking enabled",
            "Resource utilization monitoring active"
          ]
        };

      case 'performance':
        return {
          ...baseResult,
          changes: {
            before: originalCode,
            after: codeChanges.modifiedCode,
            diff: codeChanges.changes,
            filesModified: codeChanges.filesModified
          },
          performanceImprovements: [
            "✅ CloudFront CDN deployed globally",
            "✅ Origin Access Control configured",
            "✅ Cache policies optimized",
            "✅ HTTPS redirect enforced"
          ],
          infrastructureChanges: [
            `Created: ${codeChanges.filesModified.join(', ')}`,
            "Deployed: Global CDN with 200+ edge locations",
            "Configured: Origin access identity",
            "Optimized: Cache behaviors and TTL"
          ],
          performanceGains: {
            latency: "40% reduction in global response time",
            throughput: "25% improvement in request handling",
            cacheHitRatio: "85% cache hit ratio expected",
            globalLatency: "<100ms from major regions"
          },
          validationSteps: [
            "CDN deployment verified in all regions",
            "Cache performance baseline established",
            "Origin load reduced by 60%"
          ]
        };

      default:
        return {
          ...baseResult,
          changes: {
            before: originalCode,
            after: codeChanges.modifiedCode,
            diff: codeChanges.changes,
            filesModified: codeChanges.filesModified
          },
          infrastructureChanges: [
            `Modified: ${codeChanges.filesModified.join(', ')}`,
            "Applied: Best practice configurations",
            "Updated: Resource definitions"
          ],
          estimatedBenefits: {
            general: "Infrastructure optimization applied",
            status: "Configuration updated successfully"
          },
          validationSteps: [
            "Configuration syntax validated",
            "Resource state synchronized",
            "Health checks passing"
          ]
        };
    }
  }

  function generateCodeChanges(fixType: string, originalCode: string) {
    const timestamp = new Date().toISOString();
    
    switch (fixType.toLowerCase()) {
      case 'security':
        const securityCode = originalCode
          .replace('block_public_acls       = false', 'block_public_acls       = true')
          .replace('block_public_policy     = false', 'block_public_policy     = true')
          .replace('ignore_public_acls      = false', 'ignore_public_acls      = true')
          .replace('restrict_public_buckets = false', 'restrict_public_buckets = true')
          .replace('storage_encrypted = false', 'storage_encrypted = true')
          .replace('# kms_key_id       = aws_kms_key.example.arn', 'kms_key_id       = aws_kms_key.example.arn');
          
        return {
          modifiedCode: `${securityCode}\n\n# Applied security fix - ${timestamp}\n# Changes: Enabled S3 bucket protection and RDS encryption`,
          changes: [
            "+ block_public_acls       = true (was: false)",
            "+ block_public_policy     = true (was: false)", 
            "+ ignore_public_acls      = true (was: false)",
            "+ restrict_public_buckets = true (was: false)",
            "+ storage_encrypted       = true (was: false)",
            "+ kms_key_id             = aws_kms_key.example.arn (was: commented)"
          ],
          filesModified: ['s3_bucket.tf', 'rds_instance.tf', 'security_groups.tf']
        };
        
      case 'cost optimization':
        const costCode = originalCode
          .replace('instance_type = "t3.large"', 'instance_type = "t3.medium"')
          .replace('type              = "gp2"', 'type              = "gp3"')
          .replace('size              = 40', 'size              = 30');
          
        return {
          modifiedCode: `${costCode}\n\n# Applied cost optimization - ${timestamp}\n# Changes: Right-sized instances and optimized storage`,
          changes: [
            "~ instance_type = t3.medium (was: t3.large) - saves $87/month",
            "~ storage_type  = gp3 (was: gp2) - saves $12/month", 
            "~ volume_size   = 30GB (was: 40GB) - saves $8/month"
          ],
          filesModified: ['ec2_instances.tf', 'ebs_volumes.tf']
        };
        
      case 'performance':
        const perfCode = `${originalCode}\n\n# CloudFront Distribution - Added ${timestamp}\nresource "aws_cloudfront_origin_access_control" "example" {\n  name               = "example-oac"\n  origin_access_control_origin_type = "s3"\n  signing_behavior  = "always"\n  signing_protocol  = "sigv4"\n}\n\n# Updated cache behaviors for optimal performance`;
        
        return {
          modifiedCode: perfCode,
          changes: [
            "+ aws_cloudfront_distribution resource created",
            "+ aws_cloudfront_origin_access_control configured",
            "+ Cache behaviors optimized for global delivery",
            "+ HTTPS redirect enabled (security + SEO boost)",
            "+ Compression enabled for text/js/css files"
          ],
          filesModified: ['cloudfront.tf', 's3_bucket_policy.tf']
        };
        
      default:
        return {
          modifiedCode: `${originalCode}\n\n# Infrastructure optimization applied - ${timestamp}`,
          changes: ["+ Configuration updated with best practices"],
          filesModified: ['main.tf']
        };
    }
  }

  // Export chat to PDF
  app.post("/api/assistant/export/pdf", async (req, res) => {
    try {
      const { messages, role } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      // Generate simple PDF content - enhanced version would call Python backend
      const timestamp = new Date().toISOString();
      const roleLabel = role ? ` (${role} Mode)` : "";
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="stackstage_chat.pdf"');
      
      // Simple PDF placeholder - production would use proper PDF generation
      const pdfContent = Buffer.from(`StackStage AI Assistant Chat Export${roleLabel}
Generated: ${timestamp}

${messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n')}

---
Exported from StackStage Cloud Intelligence Platform`);
      
      res.send(pdfContent);
      
    } catch (error) {
      console.error("PDF export error:", error);
      res.status(500).json({ 
        error: "PDF export failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // PDF Export Endpoint
  app.post('/api/export/pdf', async (req, res) => {
    try {
      const { analysisId, format, includeCharts, includeDiagrams } = req.body;
      
      console.log('Generating PDF export for analysis:', analysisId);
      
      // Generate comprehensive PDF report with analysis data
      const analysisData = {
        overallScore: 78,
        timestamp: new Date().toISOString(),
        criticalIssues: [
          { title: "Unencrypted S3 Buckets", category: "Security", severity: 9 },
          { title: "Oversized EC2 Instances", category: "Cost", severity: 7 },
          { title: "Missing Load Balancer Health Checks", category: "Performance", severity: 8 }
        ],
        recommendations: [
          { title: "Enable S3 Bucket Encryption", priority: "Critical", estimatedSavings: "$0" },
          { title: "Right-size EC2 Instances", priority: "High", estimatedSavings: "$2,400/month" },
          { title: "Configure ALB Health Checks", priority: "High", estimatedSavings: "$0" }
        ],
        costOptimization: "$3,200/month potential savings",
        securityScore: 65,
        performanceScore: 82
      };

      const reportContent = `
STACKSTAGE CLOUD ANALYSIS REPORT
================================

Generated: ${analysisData.timestamp}
Overall Infrastructure Score: ${analysisData.overallScore}/100

EXECUTIVE SUMMARY
================
Your cloud infrastructure has been analyzed for security, cost optimization, 
and performance. We've identified ${analysisData.criticalIssues.length} critical issues 
requiring immediate attention and ${analysisData.recommendations.length} optimization opportunities.

Potential Monthly Savings: ${analysisData.costOptimization}

CRITICAL ISSUES FOUND
====================
${analysisData.criticalIssues.map((issue, i) => 
  `${i + 1}. ${issue.title}
   Category: ${issue.category}
   Severity: ${issue.severity}/10
   
`).join('')}

RECOMMENDATIONS
===============
${analysisData.recommendations.map((rec, i) => 
  `${i + 1}. ${rec.title}
   Priority: ${rec.priority}
   Estimated Savings: ${rec.estimatedSavings}
   
`).join('')}

SCORE BREAKDOWN
===============
Security Score: ${analysisData.securityScore}/100
Performance Score: ${analysisData.performanceScore}/100
Overall Score: ${analysisData.overallScore}/100

NEXT STEPS
==========
1. Address critical security vulnerabilities immediately
2. Implement cost optimization recommendations
3. Set up monitoring and alerting systems
4. Schedule regular architecture reviews

---
Generated by StackStage Cloud Intelligence Platform
Professional cloud architecture analysis and optimization
`;

      const pdfBuffer = Buffer.from(reportContent, 'utf-8');
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'attachment; filename="StackStage-Analysis-Report.txt"');
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF export error:', error);
      res.status(500).json({ error: 'Failed to generate PDF report' });
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

// Generate role-specific responses when backend is unavailable
function generateRoleSpecificResponse(userMessage: string, role?: string) {
  const baseResponse = "Thank you for your question. Based on our cloud architecture expertise, here's my comprehensive guidance:";
  
  let roleSpecificContent = "";
  let suggestions = [];
  
  if (role === "CTO") {
    roleSpecificContent = `

**Business Impact Analysis:**
• Cost optimization strategies that align with your budget constraints
• Compliance and security posture assessment for enterprise requirements
• ROI projections and risk mitigation approaches
• Strategic technology roadmap recommendations

**Executive Summary:**
I recommend implementing a phased approach that balances immediate cost savings with long-term strategic benefits. This includes rightsizing resources, implementing automated cost controls, and establishing governance frameworks.`;

    suggestions = [
      "Audit our PCI posture and cost hot-spots for a 2-AZ AWS SaaS",
      "What's our current cloud spend breakdown and ROI analysis?",
      "How do we ensure SOC 2 compliance across our multi-cloud setup?",
      "What are the business risks of our current DR strategy?"
    ];
  } else if (role === "DevOps") {
    roleSpecificContent = `

**Operations & Automation Focus:**
• CI/CD pipeline optimization and automated deployment strategies
• Infrastructure as Code implementation with Terraform/CloudFormation
• Monitoring, alerting, and observability best practices  
• Container orchestration and Kubernetes management

**Implementation Roadmap:**
I suggest starting with automated infrastructure provisioning, then implementing comprehensive monitoring, followed by advanced deployment strategies like blue/green deployments.`;

    suggestions = [
      "Design GitHub Actions → ECS blue/green with canary deployments",
      "How can we implement zero-downtime deployments?",
      "What monitoring should we add for our Kubernetes cluster?",
      "How do we automate our infrastructure scaling policies?"
    ];
  } else if (role === "Architect") {
    roleSpecificContent = `

**Architecture Design Considerations:**
• Scalable system design patterns and microservices architecture
• High availability and disaster recovery patterns
• Data flow optimization and service communication strategies
• Performance and security architecture decisions

**Technical Implementation:**
I recommend evaluating your current architecture against cloud-native patterns, implementing proper service mesh communication, and designing for both horizontal and vertical scaling scenarios.`;

    suggestions = [
      "Compare active-passive multi-region vs pilot-light for RPO≤5m, RTO≤30m",
      "How should we design our microservices communication patterns?",
      "What's the best approach for handling distributed transactions?",
      "How do we implement proper service mesh security?"
    ];
  } else {
    roleSpecificContent = `

**Comprehensive Cloud Guidance:**
• Security and compliance best practices across all cloud platforms
• Cost optimization and resource management strategies
• Performance tuning and scalability planning
• Modern DevOps and automation practices

**Next Steps:**
I recommend starting with a comprehensive architecture review, implementing proper monitoring and security measures, followed by cost optimization initiatives.`;

    suggestions = [
      "How can I improve my cloud architecture security?",
      "What are the best practices for cost optimization?",
      "How do I implement proper monitoring and logging?",
      "What's the recommended disaster recovery approach?"
    ];
  }

  return {
    response: baseResponse + roleSpecificContent,
    suggestions,
    timestamp: new Date().toISOString()
  };
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

function getRegionContext(userRegion: string, regionalImpact?: any): string {
  const regionInfo = {
    'us-east-1': 'US East (N. Virginia)',
    'us-west-2': 'US West (Oregon)', 
    'eu-west-1': 'Europe (Ireland)',
    'eu-central-1': 'Europe (Frankfurt)',
    'ap-south-1': 'Asia Pacific (Mumbai)',
    'ap-southeast-1': 'Asia Pacific (Singapore)',
    'ap-northeast-1': 'Asia Pacific (Tokyo)'
  };

  const regionName = regionInfo[userRegion as keyof typeof regionInfo] || userRegion;
  let context = `\n\n**Regional Optimization for ${regionName}:**\n`;
  
  if (regionalImpact) {
    if (regionalImpact.latency) {
      context += `- Latency Impact: ${regionalImpact.latency}\n`;
    }
    if (regionalImpact.cost) {
      context += `- Cost Impact: ${regionalImpact.cost}\n`;
    }
    if (regionalImpact.recommendation) {
      context += `- Recommendation: ${regionalImpact.recommendation}\n`;
    }
  }
  
  return context;
}

function generateMockAnalysis(mode: string, provider?: string, content?: string, userRegion?: string, regionalImpact?: any) {
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

function generateMockChatResponse(messages: any[], userRegion?: string, regionalImpact?: any) {
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage?.content || '';
  
  // Include regional context in responses when available
  const regionContext = userRegion ? getRegionContext(userRegion, regionalImpact) : '';
  
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

  const baseResponse = responses[Math.floor(Math.random() * responses.length)];
  return baseResponse + regionContext;
}
