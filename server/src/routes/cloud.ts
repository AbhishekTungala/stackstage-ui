import { Router } from "express";
import { cloudService } from "../services/cloudService";
import { logger } from "../utils/logger";

const router = Router();

// GET /api/cloud/aws/status - AWS resources status
router.get('/aws/status', async (req, res) => {
  try {
    logger.info('Fetching AWS cloud status');
    
    const awsStatus = await cloudService.getAWSStatus();
    
    res.json({
      success: true,
      provider: 'aws',
      data: awsStatus
    });
  } catch (error) {
    logger.error('AWS status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AWS status'
    });
  }
});

// GET /api/cloud/azure/status - Azure resources status
router.get('/azure/status', async (req, res) => {
  try {
    logger.info('Fetching Azure cloud status');
    
    const azureStatus = await cloudService.getAzureStatus();
    
    res.json({
      success: true,
      provider: 'azure',
      data: azureStatus
    });
  } catch (error) {
    logger.error('Azure status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Azure status'
    });
  }
});

// GET /api/cloud/gcp/status - GCP resources status
router.get('/gcp/status', async (req, res) => {
  try {
    logger.info('Fetching GCP cloud status');
    
    const gcpStatus = await cloudService.getGCPStatus();
    
    res.json({
      success: true,
      provider: 'gcp',
      data: gcpStatus
    });
  } catch (error) {
    logger.error('GCP status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GCP status'
    });
  }
});

// POST /api/cloud/connect - Connect cloud provider
router.post('/connect', async (req, res) => {
  try {
    const { provider, credentials } = req.body;
    
    if (!provider || !credentials) {
      return res.status(400).json({
        success: false,
        error: 'Provider and credentials are required'
      });
    }
    
    const result = await cloudService.connectProvider(provider, credentials);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Cloud connect error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect cloud provider'
    });
  }
});

// GET /api/cloud/regions - Get available regions for all providers
router.get('/regions', async (req, res) => {
  try {
    const regions = await cloudService.getAllRegions();
    
    res.json({
      success: true,
      data: regions
    });
  } catch (error) {
    logger.error('Regions fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cloud regions'
    });
  }
});

export { router as cloudRouter };