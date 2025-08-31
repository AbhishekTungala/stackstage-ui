import { logger } from "../utils/logger";

interface LocationData {
  ip: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  latitude: number;
  longitude: number;
  currency: string;
  recommendedRegions: string[];
}

interface RegionOptimizationRequest {
  userLocations: Array<{
    country: string;
    userCount: number;
  }>;
  serviceRequirements: {
    latencyThreshold: number;
    redundancy: boolean;
    compliance: string[];
  };
}

class GeoService {
  private readonly ipApiKey: string;

  constructor() {
    this.ipApiKey = process.env.IP_API_KEY || '';
  }

  async getLocationData(clientIp: string): Promise<LocationData> {
    try {
      // Skip local/private IPs
      if (this.isPrivateIP(clientIp)) {
        return this.getDefaultLocation();
      }

      // Use IP geolocation service
      const locationData = await this.fetchIPLocation(clientIp);
      
      // Add cloud region recommendations
      const recommendedRegions = this.getRecommendedRegions(
        locationData.country,
        locationData.latitude,
        locationData.longitude
      );

      return {
        ...locationData,
        recommendedRegions
      };

    } catch (error) {
      logger.error('Geolocation error:', error);
      return this.getDefaultLocation();
    }
  }

  async getRegionOptimization(request: RegionOptimizationRequest) {
    try {
      const { userLocations, serviceRequirements } = request;
      
      // Calculate optimal regions based on user distribution
      const recommendations = [];

      // Primary region selection
      const primaryRegion = this.selectPrimaryRegion(userLocations);
      recommendations.push({
        type: 'primary',
        region: primaryRegion,
        reason: 'Closest to majority of users',
        estimatedLatency: this.calculateLatency(primaryRegion, userLocations),
        costImpact: 'baseline'
      });

      // Secondary region for redundancy
      if (serviceRequirements.redundancy) {
        const secondaryRegion = this.selectSecondaryRegion(primaryRegion, userLocations);
        recommendations.push({
          type: 'secondary',
          region: secondaryRegion,
          reason: 'High availability and disaster recovery',
          estimatedLatency: this.calculateLatency(secondaryRegion, userLocations),
          costImpact: '+15-25%'
        });
      }

      // Compliance-specific regions
      if (serviceRequirements.compliance.length > 0) {
        const complianceRegions = this.getComplianceRegions(serviceRequirements.compliance);
        complianceRegions.forEach(region => {
          recommendations.push({
            type: 'compliance',
            region: region.code,
            reason: `Required for ${region.compliance.join(', ')} compliance`,
            estimatedLatency: 'N/A',
            costImpact: region.costImpact
          });
        });
      }

      return {
        recommendations,
        summary: {
          totalRegions: recommendations.length,
          estimatedCostIncrease: this.calculateTotalCostImpact(recommendations),
          averageLatency: this.calculateAverageLatency(recommendations, userLocations)
        }
      };

    } catch (error) {
      logger.error('Region optimization error:', error);
      throw error;
    }
  }

  private async fetchIPLocation(ip: string): Promise<Omit<LocationData, 'recommendedRegions'>> {
    try {
      if (this.ipApiKey) {
        // Use premium IP geolocation service
        const response = await fetch(`https://ipapi.co/${ip}/json/?key=${this.ipApiKey}`);
        const data = await response.json();
        
        return {
          ip,
          country: data.country_name || 'Unknown',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
          currency: data.currency || 'USD'
        };
      } else {
        // Use free service with rate limiting
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        
        return {
          ip,
          country: data.country || 'Unknown',
          region: data.regionName || 'Unknown', 
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
          latitude: data.lat || 0,
          longitude: data.lon || 0,
          currency: data.currency || 'USD'
        };
      }
    } catch (error) {
      logger.error('IP location fetch error:', error);
      return this.getDefaultLocation();
    }
  }

  private isPrivateIP(ip: string): boolean {
    return ip === '127.0.0.1' || 
           ip === '::1' || 
           ip.startsWith('192.168.') ||
           ip.startsWith('10.') ||
           ip.startsWith('172.16.') ||
           ip.startsWith('::ffff:127.') ||
           ip === 'localhost';
  }

  private getDefaultLocation(): LocationData {
    return {
      ip: '127.0.0.1',
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      timezone: 'America/Los_Angeles',
      latitude: 37.7749,
      longitude: -122.4194,
      currency: 'USD',
      recommendedRegions: ['us-west-1', 'us-west-2', 'us-central1']
    };
  }

  private getRecommendedRegions(country: string, lat: number, lng: number): string[] {
    // Map countries/regions to optimal cloud provider regions
    const regionMappings: Record<string, string[]> = {
      'United States': ['us-west-2', 'us-east-1', 'us-central1'],
      'Canada': ['us-west-2', 'us-east-1', 'canada-central'],
      'United Kingdom': ['eu-west-1', 'eu-west-2', 'europe-west1'],
      'Germany': ['eu-central-1', 'eu-west-1', 'europe-west3'],
      'France': ['eu-west-3', 'eu-west-1', 'europe-west1'],
      'Japan': ['ap-northeast-1', 'ap-northeast-3', 'asia-northeast1'],
      'Australia': ['ap-southeast-2', 'australia-southeast1'],
      'Singapore': ['ap-southeast-1', 'asia-southeast1'],
      'India': ['ap-south-1', 'asia-south1'],
      'Brazil': ['sa-east-1', 'southamerica-east1']
    };

    return regionMappings[country] || ['us-east-1', 'us-west-2', 'eu-west-1'];
  }

  private selectPrimaryRegion(userLocations: Array<{ country: string; userCount: number }>): string {
    // Find the country with the most users
    const primaryCountry = userLocations.reduce((prev, current) => 
      prev.userCount > current.userCount ? prev : current
    );

    const regionMappings: Record<string, string> = {
      'United States': 'us-east-1',
      'United Kingdom': 'eu-west-1',
      'Germany': 'eu-central-1',
      'Japan': 'ap-northeast-1',
      'Singapore': 'ap-southeast-1',
      'Australia': 'ap-southeast-2'
    };

    return regionMappings[primaryCountry.country] || 'us-east-1';
  }

  private selectSecondaryRegion(primaryRegion: string, userLocations: Array<{ country: string; userCount: number }>): string {
    // Select a geographically distant region for redundancy
    const redundancyMap: Record<string, string> = {
      'us-east-1': 'us-west-2',
      'us-west-2': 'us-east-1',
      'eu-west-1': 'eu-central-1',
      'eu-central-1': 'eu-west-1',
      'ap-northeast-1': 'ap-southeast-1',
      'ap-southeast-1': 'ap-northeast-1'
    };

    return redundancyMap[primaryRegion] || 'eu-west-1';
  }

  private getComplianceRegions(compliance: string[]) {
    const complianceRegions = [
      {
        code: 'eu-central-1',
        compliance: ['GDPR'],
        costImpact: '+10%'
      },
      {
        code: 'us-gov-east-1',
        compliance: ['FedRAMP', 'FISMA'],
        costImpact: '+25%'
      },
      {
        code: 'ca-central-1',
        compliance: ['PIPEDA'],
        costImpact: '+5%'
      }
    ];

    return complianceRegions.filter(region => 
      region.compliance.some(c => compliance.includes(c))
    );
  }

  private calculateLatency(region: string, userLocations: Array<{ country: string; userCount: number }>): number {
    // Simplified latency calculation based on region
    const latencyMap: Record<string, Record<string, number>> = {
      'us-east-1': {
        'United States': 50,
        'Canada': 70,
        'United Kingdom': 120,
        'Germany': 140,
        'Japan': 200
      },
      'eu-west-1': {
        'United Kingdom': 30,
        'Germany': 50,
        'France': 40,
        'United States': 120,
        'Japan': 250
      }
    };

    // Calculate weighted average latency
    const totalUsers = userLocations.reduce((sum, loc) => sum + loc.userCount, 0);
    
    return userLocations.reduce((avgLatency, loc) => {
      const regionLatencies = latencyMap[region] || {};
      const latency = regionLatencies[loc.country] || 150;
      const weight = loc.userCount / totalUsers;
      return avgLatency + (latency * weight);
    }, 0);
  }

  private calculateTotalCostImpact(recommendations: any[]): string {
    const impacts = recommendations
      .map(r => r.costImpact)
      .filter(impact => impact !== 'baseline' && impact !== 'N/A');
    
    if (impacts.length === 0) return '0%';
    
    // Simple estimation
    return impacts.length > 1 ? '+20-35%' : '+15-25%';
  }

  private calculateAverageLatency(recommendations: any[], userLocations: any[]): number {
    const latencies = recommendations
      .map(r => r.estimatedLatency)
      .filter(latency => typeof latency === 'number');
    
    if (latencies.length === 0) return 100;
    
    return latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length;
  }
}

export const geoService = new GeoService();