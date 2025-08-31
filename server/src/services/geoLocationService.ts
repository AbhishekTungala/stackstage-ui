import geoip from 'geoip-lite';
import { logger } from '../utils/logger';

interface LocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isp?: string;
  accuracy: 'high' | 'medium' | 'low';
  source: 'geoip' | 'maxmind' | 'browser' | 'fallback';
}

interface CloudRegion {
  provider: 'aws' | 'gcp' | 'azure';
  region: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  estimatedLatency: number;
}

class GeoLocationService {
  private fallbackLocation = {
    country: 'United States',
    countryCode: 'US',
    region: 'Virginia',
    regionCode: 'VA',
    city: 'Ashburn',
    timezone: 'America/New_York',
    coordinates: { lat: 39.0438, lng: -77.4874 }
  };

  private cloudRegions: CloudRegion[] = [
    // AWS Regions
    { provider: 'aws', region: 'us-east-1', name: 'US East (N. Virginia)', coordinates: { lat: 39.0438, lng: -77.4874 }, estimatedLatency: 0 },
    { provider: 'aws', region: 'us-west-2', name: 'US West (Oregon)', coordinates: { lat: 45.5152, lng: -122.6784 }, estimatedLatency: 0 },
    { provider: 'aws', region: 'eu-west-1', name: 'Europe (Ireland)', coordinates: { lat: 53.3498, lng: -6.2603 }, estimatedLatency: 0 },
    { provider: 'aws', region: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', coordinates: { lat: 1.3521, lng: 103.8198 }, estimatedLatency: 0 },
    { provider: 'aws', region: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', coordinates: { lat: 35.6762, lng: 139.6503 }, estimatedLatency: 0 },
    
    // GCP Regions
    { provider: 'gcp', region: 'us-central1', name: 'US Central (Iowa)', coordinates: { lat: 41.5868, lng: -93.6250 }, estimatedLatency: 0 },
    { provider: 'gcp', region: 'us-west1', name: 'US West (Oregon)', coordinates: { lat: 45.5152, lng: -122.6784 }, estimatedLatency: 0 },
    { provider: 'gcp', region: 'europe-west1', name: 'Europe West (Belgium)', coordinates: { lat: 50.8503, lng: 4.3517 }, estimatedLatency: 0 },
    { provider: 'gcp', region: 'asia-southeast1', name: 'Asia Southeast (Singapore)', coordinates: { lat: 1.3521, lng: 103.8198 }, estimatedLatency: 0 },
    
    // Azure Regions
    { provider: 'azure', region: 'eastus', name: 'East US (Virginia)', coordinates: { lat: 39.0438, lng: -77.4874 }, estimatedLatency: 0 },
    { provider: 'azure', region: 'westus2', name: 'West US 2 (Washington)', coordinates: { lat: 47.6062, lng: -122.3321 }, estimatedLatency: 0 },
    { provider: 'azure', region: 'westeurope', name: 'West Europe (Netherlands)', coordinates: { lat: 52.3667, lng: 4.9000 }, estimatedLatency: 0 },
    { provider: 'azure', region: 'southeastasia', name: 'Southeast Asia (Singapore)', coordinates: { lat: 1.3521, lng: 103.8198 }, estimatedLatency: 0 }
  ];

  async detectLocationFromIP(ip: string): Promise<LocationData> {
    try {
      // Remove local/private IP handling
      if (this.isPrivateIP(ip)) {
        logger.warn(`Private IP detected: ${ip}, using fallback location`);
        return this.createLocationData(ip, this.fallbackLocation, 'low', 'fallback');
      }

      // Use geoip-lite for location detection
      const geo = geoip.lookup(ip);
      
      if (geo) {
        return {
          ip,
          country: geo.country,
          countryCode: geo.country,
          region: geo.region,
          regionCode: geo.region,
          city: geo.city,
          timezone: geo.timezone,
          coordinates: {
            lat: geo.ll[0],
            lng: geo.ll[1]
          },
          accuracy: 'medium',
          source: 'geoip'
        };
      }

      // Fallback to default location
      logger.warn(`No geo data found for IP: ${ip}, using fallback`);
      return this.createLocationData(ip, this.fallbackLocation, 'low', 'fallback');

    } catch (error) {
      logger.error('Location detection error:', error);
      return this.createLocationData(ip, this.fallbackLocation, 'low', 'fallback');
    }
  }

  async detectLocationFromBrowser(browserData: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    timezone?: string;
  }): Promise<Partial<LocationData>> {
    try {
      if (!browserData.latitude || !browserData.longitude) {
        throw new Error('Browser coordinates not available');
      }

      // Reverse geocoding would be implemented here with a service like OpenCage or Google
      // For now, return the coordinates with high accuracy
      return {
        coordinates: {
          lat: browserData.latitude,
          lng: browserData.longitude
        },
        timezone: browserData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        accuracy: 'high',
        source: 'browser'
      };

    } catch (error) {
      logger.error('Browser location detection error:', error);
      throw error;
    }
  }

  getOptimalCloudRegion(location: LocationData, provider?: 'aws' | 'gcp' | 'azure'): CloudRegion {
    let regions = this.cloudRegions;
    
    if (provider) {
      regions = regions.filter(r => r.provider === provider);
    }

    // Calculate distances and find closest region
    let closestRegion = regions[0];
    let minDistance = this.calculateDistance(
      location.coordinates.lat,
      location.coordinates.lng,
      closestRegion.coordinates.lat,
      closestRegion.coordinates.lng
    );

    for (const region of regions) {
      const distance = this.calculateDistance(
        location.coordinates.lat,
        location.coordinates.lng,
        region.coordinates.lat,
        region.coordinates.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestRegion = region;
      }
    }

    // Estimate latency based on distance (very rough approximation)
    closestRegion.estimatedLatency = Math.round(minDistance / 100); // ~1ms per 100km

    return closestRegion;
  }

  getAllRegionsWithLatency(location: LocationData): CloudRegion[] {
    return this.cloudRegions.map(region => ({
      ...region,
      estimatedLatency: Math.round(
        this.calculateDistance(
          location.coordinates.lat,
          location.coordinates.lng,
          region.coordinates.lat,
          region.coordinates.lng
        ) / 100
      )
    })).sort((a, b) => a.estimatedLatency - b.estimatedLatency);
  }

  getRegionsByProvider(provider: 'aws' | 'gcp' | 'azure', location?: LocationData): CloudRegion[] {
    let regions = this.cloudRegions.filter(r => r.provider === provider);
    
    if (location) {
      regions = regions.map(region => ({
        ...region,
        estimatedLatency: Math.round(
          this.calculateDistance(
            location.coordinates.lat,
            location.coordinates.lng,
            region.coordinates.lat,
            region.coordinates.lng
          ) / 100
        )
      })).sort((a, b) => a.estimatedLatency - b.estimatedLatency);
    }

    return regions;
  }

  private isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ];

    return privateRanges.some(range => range.test(ip)) || ip === 'localhost';
  }

  private createLocationData(
    ip: string, 
    locationInfo: any, 
    accuracy: 'high' | 'medium' | 'low',
    source: LocationData['source']
  ): LocationData {
    return {
      ip,
      country: locationInfo.country,
      countryCode: locationInfo.countryCode,
      region: locationInfo.region,
      regionCode: locationInfo.regionCode,
      city: locationInfo.city,
      timezone: locationInfo.timezone,
      coordinates: locationInfo.coordinates,
      accuracy,
      source
    };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Enhanced location detection that combines multiple sources
  async getEnhancedLocation(ip: string, browserData?: any): Promise<LocationData> {
    let ipLocation: LocationData;
    
    try {
      ipLocation = await this.detectLocationFromIP(ip);
    } catch (error) {
      logger.error('IP location detection failed:', error);
      ipLocation = this.createLocationData(ip, this.fallbackLocation, 'low', 'fallback');
    }

    // If browser data is available and more accurate, use it
    if (browserData?.latitude && browserData?.longitude) {
      try {
        const browserLocation = await this.detectLocationFromBrowser(browserData);
        
        // Merge IP location with more accurate browser coordinates
        return {
          ...ipLocation,
          coordinates: browserLocation.coordinates!,
          accuracy: 'high',
          source: 'browser'
        };
      } catch (error) {
        logger.warn('Browser location enhancement failed:', error);
      }
    }

    return ipLocation;
  }

  // Get timezone-aware recommendations
  getTimezoneRecommendations(location: LocationData) {
    const now = new Date();
    const userTime = new Date(now.toLocaleString("en-US", { timeZone: location.timezone }));
    const hour = userTime.getHours();

    const recommendations = [];

    if (hour >= 9 && hour <= 17) {
      recommendations.push('Optimal time for cloud operations (business hours)');
    } else if (hour >= 18 || hour <= 8) {
      recommendations.push('Consider maintenance windows during off-peak hours');
    }

    if (hour >= 0 && hour <= 6) {
      recommendations.push('Low traffic period - ideal for deployments');
    }

    return {
      userTime: userTime.toISOString(),
      localHour: hour,
      timezone: location.timezone,
      recommendations
    };
  }
}

export const geoLocationService = new GeoLocationService();