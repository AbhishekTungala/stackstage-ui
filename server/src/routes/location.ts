import { Router } from "express";
import { geoService } from "../services/geoService";
import { logger } from "../utils/logger";

const router = Router();

// GET /api/location - Get user geo-location info
router.get('/', async (req, res) => {
  try {
    // Get client IP from various headers (considering proxies)
    const clientIp = (
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      '127.0.0.1'
    ).split(',')[0].trim();
    
    logger.info(`Getting location for IP: ${clientIp}`);
    
    const locationData = await geoService.getLocationData(clientIp);
    
    res.json({
      success: true,
      data: locationData
    });
  } catch (error) {
    logger.error('Location service error:', error);
    
    // Return default location on error
    res.json({
      success: true,
      data: {
        ip: '127.0.0.1',
        country: 'US',
        region: 'California',
        city: 'San Francisco',
        timezone: 'PST',
        latitude: 37.7749,
        longitude: -122.4194,
        currency: 'USD',
        recommendedRegions: ['us-west-1', 'us-west-2'],
        note: 'Default location used due to service unavailability'
      }
    });
  }
});

// POST /api/location/optimize - Get region optimization recommendations
router.post('/optimize', async (req, res) => {
  try {
    const { userLocations, serviceRequirements } = req.body;
    
    const recommendations = await geoService.getRegionOptimization(
      userLocations,
      serviceRequirements
    );
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    logger.error('Region optimization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate region optimization recommendations'
    });
  }
});

export { router as locationRouter };