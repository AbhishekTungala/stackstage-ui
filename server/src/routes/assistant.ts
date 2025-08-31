import { Router } from "express";
import { z } from "zod";
import { aiService } from "../services/aiService";
import { logger } from "../utils/logger";

const router = Router();

// Assistant request schema
const assistantRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  context: z.string().optional(),
  persona: z.enum(['cto', 'devops', 'architect', 'security']).default('architect'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
  analysisContext: z.object({
    analysisId: z.string().optional(),
    architecture: z.string().optional(),
    currentScore: z.number().optional()
  }).optional()
});

// POST /api/assistant - Conversational AI help
router.post('/', async (req, res) => {
  try {
    const validatedData = assistantRequestSchema.parse(req.body);
    
    logger.info(`Assistant request - persona: ${validatedData.persona}`);
    
    const response = await aiService.getAssistantResponse(validatedData);
    
    res.json({
      success: true,
      data: {
        message: response.message,
        suggestions: response.suggestions,
        persona: validatedData.persona,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Assistant error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to get assistant response'
    });
  }
});

// POST /api/assistant/suggestions - Generate context-aware suggestions
router.post('/suggestions', async (req, res) => {
  try {
    const { context, analysisId } = req.body;
    
    const suggestions = await aiService.generateSuggestions(context, analysisId);
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    logger.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions'
    });
  }
});

export { router as assistantRouter };