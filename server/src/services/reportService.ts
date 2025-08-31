import PDFDocument from "pdfkit";
import { logger } from "../utils/logger";

interface PDFExportOptions {
  analysisId: string;
  includeCharts: boolean;
  includeDiagrams: boolean;
  includeRecommendations: boolean;
  format: 'detailed' | 'summary' | 'executive';
  branding?: {
    companyName?: string;
    logo?: string;
  };
}

interface MarkdownExportOptions {
  analysisId: string;
  template: 'github' | 'gitlab' | 'bitbucket' | 'generic';
  includeCode: boolean;
}

class ReportService {
  async generatePDF(options: PDFExportOptions) {
    try {
      logger.info(`Generating PDF report for analysis: ${options.analysisId}`);

      // Get analysis data (would fetch from storage in production)
      const analysisData = await this.getAnalysisData(options.analysisId);
      
      // Create PDF document
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4'
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      
      const pdfPromise = new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
      });

      // Add content to PDF
      await this.addPDFContent(doc, analysisData, options);
      
      doc.end();
      
      const pdfBuffer = await pdfPromise;
      const base64 = pdfBuffer.toString('base64');

      return {
        base64,
        filename: `StackStage_Analysis_Report_${options.analysisId}.pdf`,
        size: pdfBuffer.length
      };

    } catch (error) {
      logger.error('PDF generation error:', error);
      throw error;
    }
  }

  async generateMarkdown(options: MarkdownExportOptions) {
    try {
      logger.info(`Generating Markdown report for analysis: ${options.analysisId}`);

      const analysisData = await this.getAnalysisData(options.analysisId);
      const markdown = this.buildMarkdownContent(analysisData, options);

      return {
        content: markdown,
        filename: `StackStage_Analysis_${options.analysisId}.md`,
        template: options.template
      };

    } catch (error) {
      logger.error('Markdown generation error:', error);
      throw error;
    }
  }

  async emailReport(analysisId: string, emailAddress: string, format: string) {
    try {
      logger.info(`Emailing ${format} report to: ${emailAddress}`);

      // Generate report
      let reportData;
      if (format === 'pdf') {
        reportData = await this.generatePDF({
          analysisId,
          includeCharts: true,
          includeDiagrams: true,
          includeRecommendations: true,
          format: 'detailed'
        });
      } else {
        reportData = await this.generateMarkdown({
          analysisId,
          template: 'generic',
          includeCode: true
        });
      }

      // In production, this would use an email service like SendGrid
      return {
        sent: true,
        recipient: emailAddress,
        format,
        message: 'Report sent successfully (mock implementation)'
      };

    } catch (error) {
      logger.error('Email report error:', error);
      throw error;
    }
  }

  async sendToSlack(analysisId: string, slackWebhook: string, channel?: string) {
    try {
      logger.info(`Sending report to Slack channel: ${channel || 'default'}`);

      const analysisData = await this.getAnalysisData(analysisId);
      
      const slackMessage = {
        text: `📊 StackStage Analysis Report`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🚀 StackStage Analysis Complete"
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Overall Score:* ${analysisData.score}/100`
              },
              {
                type: "mrkdwn",
                text: `*Analysis ID:* ${analysisId}`
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Key Issues:*\n${analysisData.issues.slice(0, 3).map((issue: string) => `• ${issue}`).join('\n')}`
            }
          }
        ]
      };

      // In production, this would make an actual HTTP request to Slack
      return {
        sent: true,
        webhook: slackWebhook.substring(0, 20) + '...',
        channel: channel || 'default',
        message: 'Report sent to Slack successfully (mock implementation)'
      };

    } catch (error) {
      logger.error('Slack send error:', error);
      throw error;
    }
  }

  private async getAnalysisData(analysisId: string) {
    // Mock analysis data - in production, this would fetch from storage
    return {
      id: analysisId,
      score: 78,
      timestamp: new Date(),
      categories: {
        security: 72,
        reliability: 80,
        scalability: 85,
        performance: 75,
        cost: 70
      },
      issues: [
        "No multi-AZ configuration detected",
        "Missing monitoring and alerting setup",
        "IAM policies could be more restrictive"
      ],
      recommendations: [
        "Implement multi-AZ deployment for high availability",
        "Add comprehensive monitoring and alerting",
        "Review and tighten IAM policies"
      ],
      architecture: "Web application with database",
      cloudProvider: "AWS"
    };
  }

  private async addPDFContent(doc: typeof PDFDocument.prototype, analysisData: any, options: PDFExportOptions) {
    // Header
    doc.fontSize(24).fillColor('#1e3a8a').text('StackStage', 50, 50);
    doc.fontSize(14).fillColor('#6b7280').text('Cloud Architecture Analysis Report', 50, 80);
    
    if (options.branding?.companyName) {
      doc.fontSize(12).fillColor('#374151').text(`Prepared for: ${options.branding.companyName}`, 50, 110);
    }

    // Executive Summary
    doc.fontSize(16).fillColor('#1f2937').text('Executive Summary', 50, 150);
    doc.fontSize(12).fillColor('#374151').text(`Overall Score: ${analysisData.score}/100`, 50, 180);
    doc.text(`Analysis Date: ${analysisData.timestamp.toLocaleDateString()}`, 50, 200);

    // Categories
    if (options.includeCharts) {
      doc.fontSize(14).fillColor('#1f2937').text('Category Scores', 50, 240);
      let y = 260;
      
      Object.entries(analysisData.categories).forEach(([category, score]) => {
        doc.fontSize(10).fillColor('#374151').text(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${score}/100`, 50, y);
        y += 20;
      });
    }

    // Issues and Recommendations
    if (options.includeRecommendations) {
      doc.fontSize(14).fillColor('#1f2937').text('Critical Issues', 50, 400);
      let y = 420;
      
      analysisData.issues.forEach((issue: string, index: number) => {
        doc.fontSize(10).fillColor('#374151').text(`${index + 1}. ${issue}`, 50, y);
        y += 20;
      });

      doc.fontSize(14).fillColor('#1f2937').text('Recommendations', 50, y + 20);
      y += 40;
      
      analysisData.recommendations.forEach((rec: string, index: number) => {
        doc.fontSize(10).fillColor('#374151').text(`${index + 1}. ${rec}`, 50, y);
        y += 20;
      });
    }

    // Footer
    doc.fontSize(8).fillColor('#6b7280').text(
      `Generated by StackStage - ${new Date().toLocaleDateString()}`,
      50, 
      doc.page.height - 50
    );
  }

  private buildMarkdownContent(analysisData: any, options: MarkdownExportOptions): string {
    const template = options.template;
    
    let markdown = `# StackStage Cloud Architecture Analysis Report\n\n`;
    
    if (template === 'github') {
      markdown += `> **Generated by StackStage** - ${new Date().toLocaleDateString()}\n\n`;
    }

    markdown += `## Executive Summary\n\n`;
    markdown += `- **Overall Score:** ${analysisData.score}/100\n`;
    markdown += `- **Analysis Date:** ${analysisData.timestamp.toLocaleDateString()}\n`;
    markdown += `- **Cloud Provider:** ${analysisData.cloudProvider}\n\n`;

    markdown += `## Category Scores\n\n`;
    Object.entries(analysisData.categories).forEach(([category, score]) => {
      markdown += `- **${category.charAt(0).toUpperCase() + category.slice(1)}:** ${score}/100\n`;
    });

    markdown += `\n## Critical Issues\n\n`;
    analysisData.issues.forEach((issue: string, index: number) => {
      markdown += `${index + 1}. ${issue}\n`;
    });

    markdown += `\n## Recommendations\n\n`;
    analysisData.recommendations.forEach((rec: string, index: number) => {
      markdown += `${index + 1}. ${rec}\n`;
    });

    if (template === 'github') {
      markdown += `\n---\n*Report generated by [StackStage](https://stackstage.dev)*\n`;
    }

    return markdown;
  }
}

export const reportService = new ReportService();