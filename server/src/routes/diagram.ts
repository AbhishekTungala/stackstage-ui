import { Router } from "express";
import { z } from "zod";
import { diagramService } from "../services/diagramService";
import { logger } from "../utils/logger";

const router = Router();

// Diagram generation request schema
const diagramRequestSchema = z.object({
  content: z.string().min(1, "Architecture content is required"),
  diagramType: z.enum(['architecture', 'resource-map', 'security', 'cost-flow']).default('architecture'),
  format: z.enum(['mermaid', 'svg', 'png']).default('mermaid'),
  theme: z.enum(['default', 'dark', 'neutral', 'forest']).default('default'),
  highlightRisks: z.boolean().default(true),
  includeMetrics: z.boolean().default(false)
});

// POST /api/diagram - Generate architecture diagram
router.post('/', async (req, res) => {
  try {
    const validatedData = diagramRequestSchema.parse(req.body);
    
    logger.info(`Generating ${validatedData.diagramType} diagram in ${validatedData.format} format`);
    
    const result = await diagramService.generateDiagram(validatedData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Diagram generation error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate diagram'
    });
  }
});

// POST /api/diagram/export - Export diagram with custom options
router.post('/export', async (req, res) => {
  try {
    const { mermaidCode, format, options } = req.body;
    
    if (!mermaidCode) {
      return res.status(400).json({
        success: false,
        error: 'Mermaid code is required'
      });
    }
    
    const result = await diagramService.exportDiagram(mermaidCode, format, options);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Diagram export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export diagram'
    });
  }
});

// GET /api/diagram/templates - Get diagram templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await diagramService.getTemplates();
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    logger.error('Template retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve templates'
    });
  }
});

export { router as diagramRouter };