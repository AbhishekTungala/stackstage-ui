import { Router } from "express";
import { aiService } from "../services/aiService";
import { logger } from "../utils/logger";

const router = Router();

// AI Health Check endpoint
router.get("/test", async (req, res) => {
  try {
    logger.info("AI Health Check initiated");
    
    // Check environment configuration
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const isConfigured = !!openrouterKey;
    
    if (!isConfigured) {
      logger.warn("OpenRouter API key not configured");
      return res.json({
        success: false,
        status: "not_configured",
        message: "AI Service Error: Missing OpenRouter API Key. Please set OPENROUTER_API_KEY in .env file.",
        configuration: {
          openrouter_configured: false,
          base_url: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
          model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
        },
        timestamp: new Date().toISOString()
      });
    }

    // Test AI service with simple prompt
    const testRequest = {
      message: "Hello AI, can you confirm the AI assistant is working?",
      persona: 'architect' as const,
      context: "Health check test"
    };

    const response = await aiService.getAssistantResponse(testRequest);
    
    // Validate response structure
    if (response && response.message) {
      logger.info("AI Health Check successful");
      return res.json({
        success: true,
        status: "operational",
        message: "AI Service is fully functional and operational",
        test_response: response.message.substring(0, 100) + "...",
        configuration: {
          openrouter_configured: true,
          base_url: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
          model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
          max_tokens: process.env.OPENROUTER_MAX_TOKENS || "2000",
          temperature: process.env.OPENROUTER_TEMPERATURE || "0.7"
        },
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error("Invalid response structure from AI service");
    }

  } catch (error) {
    logger.error("AI Health Check failed:", error);
    
    return res.status(500).json({
      success: false,
      status: "error",
      message: `AI Service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      configuration: {
        openrouter_configured: !!process.env.OPENROUTER_API_KEY,
        base_url: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
      },
      timestamp: new Date().toISOString()
    });
  }
});

// AI Service Configuration endpoint
router.get("/config", async (req, res) => {
  try {
    const config = {
      configured: !!process.env.OPENROUTER_API_KEY,
      base_url: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      max_tokens: parseInt(process.env.OPENROUTER_MAX_TOKENS || "2000"),
      temperature: parseFloat(process.env.OPENROUTER_TEMPERATURE || "0.7"),
      features: {
        analysis: !!process.env.OPENROUTER_API_KEY,
        assistant: !!process.env.OPENROUTER_API_KEY,
        diagram_generation: true, // Available even without API key
        comparison: !!process.env.OPENROUTER_API_KEY
      }
    };

    res.json({
      success: true,
      configuration: config,
      status: config.configured ? "ready" : "needs_configuration",
      message: config.configured 
        ? "AI Service is properly configured"
        : "OpenRouter API key required for full AI functionality",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error("AI config check failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check AI configuration",
      timestamp: new Date().toISOString()
    });
  }
});

// Simple AI test with rate limiting
router.post("/simple-test", async (req, res) => {
  try {
    const { prompt = "Test prompt" } = req.body;
    
    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({
        success: false,
        message: "AI Service not configured - using mock response",
        response: "This is a mock response. Configure OPENROUTER_API_KEY to enable AI features.",
        configured: false,
        timestamp: new Date().toISOString()
      });
    }

    const testRequest = {
      message: prompt,
      persona: 'architect' as const
    };

    const response = await aiService.getAssistantResponse(testRequest);

    res.json({
      success: true,
      message: "AI test completed successfully",
      response: response,
      configured: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error("AI simple test failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
});

export default router;