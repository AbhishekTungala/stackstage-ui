import { Router } from "express";
import { z } from "zod";
import { reportService } from "../services/reportService";
import { logger } from "../utils/logger";

const router = Router();

// PDF export request schema
const pdfExportSchema = z.object({
  analysisId: z.string().min(1, "Analysis ID is required"),
  includeCharts: z.boolean().default(true),
  includeDiagrams: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true),
  format: z.enum(['detailed', 'summary', 'executive']).default('detailed'),
  branding: z.object({
    companyName: z.string().optional(),
    logo: z.string().optional()
  }).optional()
});

// Markdown export request schema
const markdownExportSchema = z.object({
  analysisId: z.string().min(1, "Analysis ID is required"),
  template: z.enum(['github', 'gitlab', 'bitbucket', 'generic']).default('github'),
  includeCode: z.boolean().default(true)
});

// POST /api/export/pdf - Export full analysis report as PDF
router.post('/pdf', async (req, res) => {
  try {
    const validatedData = pdfExportSchema.parse(req.body);
    
    logger.info(`Generating PDF report for analysis: ${validatedData.analysisId}`);
    
    const pdfResult = await reportService.generatePDF(validatedData);
    
    res.json({
      success: true,
      data: {
        pdf: pdfResult.base64,
        filename: pdfResult.filename,
        size: pdfResult.size
      }
    });
  } catch (error) {
    logger.error('PDF export error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF report'
    });
  }
});

// POST /api/export/markdown - Export analysis as Markdown
router.post('/markdown', async (req, res) => {
  try {
    const validatedData = markdownExportSchema.parse(req.body);
    
    logger.info(`Generating Markdown report for analysis: ${validatedData.analysisId}`);
    
    const markdownResult = await reportService.generateMarkdown(validatedData);
    
    res.json({
      success: true,
      data: markdownResult
    });
  } catch (error) {
    logger.error('Markdown export error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate Markdown report'
    });
  }
});

// POST /api/export/email - Email report
router.post('/email', async (req, res) => {
  try {
    const { analysisId, emailAddress, format = 'pdf' } = req.body;
    
    if (!analysisId || !emailAddress) {
      return res.status(400).json({
        success: false,
        error: 'Analysis ID and email address are required'
      });
    }
    
    const result = await reportService.emailReport(analysisId, emailAddress, format);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Email export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to email report'
    });
  }
});

// POST /api/export/slack - Send report to Slack
router.post('/slack', async (req, res) => {
  try {
    const { analysisId, slackWebhook, channel } = req.body;
    
    if (!analysisId || !slackWebhook) {
      return res.status(400).json({
        success: false,
        error: 'Analysis ID and Slack webhook are required'
      });
    }
    
    const result = await reportService.sendToSlack(analysisId, slackWebhook, channel);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Slack export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send report to Slack'
    });
  }
});

export { router as exportRouter };