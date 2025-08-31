import { Router } from "express";
import { z } from "zod";
import { aiService } from "../services/aiService";
import { logger } from "../utils/logger";
import { isAuthenticated } from "./auth";
import { createRateLimiter } from "../middleware/rateLimiter";

const router = Router();

// Analysis request schema
const analyzeRequestSchema = z.object({
  content: z.string().min(1, "Content is required"),
  analysisMode: z.enum(['quick', 'comprehensive', 'security', 'cost']).default('comprehensive'),
  cloudProvider: z.enum(['aws', 'azure', 'gcp', 'multi-cloud']).default('aws'),
  userRegion: z.string().default('us-east-1'),
  regionalImpact: z.boolean().default(true),
  fileType: z.enum(['text', 'terraform', 'cloudformation', 'kubernetes']).default('text')
});

// Compare architectures request schema
const compareRequestSchema = z.object({
  architecture1: z.string().min(1),
  architecture2: z.string().min(1),
  comparisonType: z.enum(['security', 'cost', 'performance', 'all']).default('all')
});

// POST /api/analyze - Perform infrastructure analysis
router.post('/', createRateLimiter('analysis'), async (req, res) => {
  try {
    const validatedData = analyzeRequestSchema.parse(req.body);
    
    logger.info(`Starting ${validatedData.analysisMode} analysis for ${validatedData.cloudProvider}`);
    
    const result = await aiService.analyzeInfrastructure(validatedData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Analysis error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to analyze infrastructure'
    });
  }
});

// POST /api/analyze/compare - Compare two architectures
router.post('/compare', createRateLimiter('analysis'), async (req, res) => {
  try {
    const validatedData = compareRequestSchema.parse(req.body);
    
    logger.info(`Comparing architectures - type: ${validatedData.comparisonType}`);
    
    const result = await aiService.compareArchitectures(
      validatedData.architecture1,
      validatedData.architecture2,
      validatedData.comparisonType
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Comparison error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to compare architectures'
    });
  }
});

// GET /api/analyze/:id - Get analysis by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await aiService.getAnalysisById(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analysis'
    });
  }
});

export { router as analysisRouter };