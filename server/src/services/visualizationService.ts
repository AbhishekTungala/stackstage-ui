import { logger } from '../utils/logger';

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'radar';
  data: any[];
  labels?: string[];
  title?: string;
  colors?: string[];
  options?: Record<string, any>;
}

interface MermaidDiagram {
  type: 'flowchart' | 'sequence' | 'gantt' | 'pie' | 'gitgraph' | 'architecture';
  content: string;
  title?: string;
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
}

class VisualizationService {
  
  // Generate Chart.js compatible data from analysis results
  generateAnalysisCharts(analysisResult: any): ChartData[] {
    const charts: ChartData[] = [];

    // Security score radar chart
    if (analysisResult.categories) {
      charts.push({
        type: 'radar',
        title: 'Security Assessment Radar',
        data: [{
          label: 'Current Scores',
          data: [
            analysisResult.categories.security || 0,
            analysisResult.categories.reliability || 0,
            analysisResult.categories.scalability || 0,
            analysisResult.categories.performance || 0,
            analysisResult.categories.cost || 0
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)'
        }],
        labels: ['Security', 'Reliability', 'Scalability', 'Performance', 'Cost'],
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    // Overall score trend (mock historical data)
    charts.push({
      type: 'line',
      title: 'Score Trend Over Time',
      data: [{
        label: 'Overall Score',
        data: this.generateMockTrendData(analysisResult.overallScore || 75),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }],
      labels: this.generateTimeLabels(7),
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    // Issues distribution pie chart
    if (analysisResult.issues && analysisResult.issues.length > 0) {
      const issueCounts = this.categorizeIssues(analysisResult.issues);
      charts.push({
        type: 'pie',
        title: 'Issues by Category',
        data: [{
          data: Object.values(issueCounts),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }],
        labels: Object.keys(issueCounts)
      });
    }

    return charts;
  }

  // Generate cloud region latency chart
  generateRegionLatencyChart(regions: any[]): ChartData {
    return {
      type: 'bar',
      title: 'Cloud Region Latency Comparison',
      data: [{
        label: 'Estimated Latency (ms)',
        data: regions.map(r => r.estimatedLatency || 0),
        backgroundColor: regions.map((_, index) => 
          `hsl(${(index * 360) / regions.length}, 70%, 60%)`
        )
      }],
      labels: regions.map(r => r.name || r.region),
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Latency (ms)'
            }
          }
        }
      }
    };
  }

  // Generate cost comparison chart
  generateCostComparisonChart(providers: any[]): ChartData {
    return {
      type: 'bar',
      title: 'Cloud Provider Cost Comparison',
      data: [{
        label: 'Estimated Monthly Cost ($)',
        data: providers.map(p => parseFloat(p.estimatedMonthlyCost?.replace('$', '') || '0')),
        backgroundColor: ['#FF9500', '#4285F4', '#00BCF2']
      }],
      labels: providers.map(p => p.provider?.toUpperCase() || 'Unknown'),
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cost ($)'
            }
          }
        }
      }
    };
  }

  // Generate Mermaid diagram from architecture description
  generateArchitectureDiagram(architecture: any): MermaidDiagram {
    let mermaidContent = '';

    if (architecture.type === 'microservices') {
      mermaidContent = this.generateMicroservicesDiagram(architecture);
    } else if (architecture.type === 'serverless') {
      mermaidContent = this.generateServerlessDiagram(architecture);
    } else if (architecture.type === 'traditional') {
      mermaidContent = this.generateTraditionalDiagram(architecture);
    } else {
      mermaidContent = this.generateGenericDiagram(architecture);
    }

    return {
      type: 'flowchart',
      content: mermaidContent,
      title: `${architecture.name || 'Cloud'} Architecture Diagram`,
      theme: 'default'
    };
  }

  // Generate process flow from AI analysis
  generateProcessFlowDiagram(analysis: any): MermaidDiagram {
    const content = `
flowchart TD
    A[Input: ${analysis.cloudProvider || 'Multi-Cloud'} Configuration] --> B[Parse Configuration]
    B --> C[Security Analysis]
    B --> D[Performance Analysis]
    B --> E[Cost Analysis]
    C --> F[Security Score: ${analysis.categories?.security || 'N/A'}]
    D --> G[Performance Score: ${analysis.categories?.performance || 'N/A'}]
    E --> H[Cost Score: ${analysis.categories?.cost || 'N/A'}]
    F --> I[Generate Recommendations]
    G --> I
    H --> I
    I --> J[Final Report: ${analysis.overallScore || 'N/A'}/100]
    
    style A fill:#e1f5fe
    style J fill:#c8e6c9
    style F fill:#ffcdd2
    style G fill:#fff3e0
    style H fill:#f3e5f5
    `;

    return {
      type: 'flowchart',
      content,
      title: 'Analysis Process Flow',
      theme: 'default'
    };
  }

  // Generate deployment diagram
  generateDeploymentDiagram(infrastructure: any): MermaidDiagram {
    const content = `
graph TB
    subgraph "Cloud Provider: ${infrastructure.provider || 'Multi-Cloud'}"
        subgraph "Production Environment"
            LB[Load Balancer]
            WEB1[Web Server 1]
            WEB2[Web Server 2]
            APP1[Application Server 1]
            APP2[Application Server 2]
            DB[(Database)]
            CACHE[(Cache)]
        end
        
        subgraph "Monitoring & Security"
            MON[Monitoring]
            LOG[Logging]
            SEC[Security Gateway]
        end
    end
    
    USER[Users] --> SEC
    SEC --> LB
    LB --> WEB1
    LB --> WEB2
    WEB1 --> APP1
    WEB2 --> APP2
    APP1 --> DB
    APP2 --> DB
    APP1 --> CACHE
    APP2 --> CACHE
    
    APP1 --> MON
    APP2 --> MON
    WEB1 --> LOG
    WEB2 --> LOG
    
    style USER fill:#e3f2fd
    style DB fill:#fff3e0
    style CACHE fill:#f3e5f5
    style SEC fill:#ffebee
    `;

    return {
      type: 'flowchart',
      content,
      title: 'Deployment Architecture',
      theme: 'default'
    };
  }

  // Generate sequence diagram for API interactions
  generateAPISequenceDiagram(apiFlow: any): MermaidDiagram {
    const content = `
sequenceDiagram
    participant Client
    participant Gateway
    participant Auth
    participant Service
    participant Database
    
    Client->>Gateway: API Request
    Gateway->>Auth: Validate Token
    Auth-->>Gateway: Token Valid
    Gateway->>Service: Forward Request
    Service->>Database: Query Data
    Database-->>Service: Return Data
    Service-->>Gateway: Response
    Gateway-->>Client: API Response
    
    Note over Client,Database: Secure API Communication Flow
    `;

    return {
      type: 'sequence',
      content,
      title: 'API Interaction Flow',
      theme: 'default'
    };
  }

  // Generate performance metrics chart
  generatePerformanceChart(metrics: any): ChartData {
    return {
      type: 'area',
      title: 'Performance Metrics Over Time',
      data: [
        {
          label: 'Response Time (ms)',
          data: metrics.responseTime || this.generateMockMetrics(24, 100, 500),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y'
        },
        {
          label: 'Throughput (req/s)',
          data: metrics.throughput || this.generateMockMetrics(24, 50, 200),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          yAxisID: 'y1'
        }
      ],
      labels: this.generateTimeLabels(24, 'hour'),
      options: {
        responsive: true,
        interaction: {
          mode: 'index' as const,
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
              display: true,
              text: 'Response Time (ms)'
            }
          },
          y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            title: {
              display: true,
              text: 'Throughput (req/s)'
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        }
      }
    };
  }

  // Private helper methods
  private generateMockTrendData(currentScore: number, days: number = 7): number[] {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const variance = Math.random() * 10 - 5; // ±5 points variance
      data.push(Math.max(0, Math.min(100, currentScore + variance)));
    }
    return data;
  }

  private generateTimeLabels(count: number, unit: 'day' | 'hour' | 'minute' = 'day'): string[] {
    const labels = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now);
      
      if (unit === 'day') {
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      } else if (unit === 'hour') {
        date.setHours(date.getHours() - i);
        labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      } else {
        date.setMinutes(date.getMinutes() - i);
        labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      }
    }
    
    return labels;
  }

  private generateMockMetrics(count: number, min: number, max: number): number[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(Math.random() * (max - min) + min);
    }
    return data;
  }

  private categorizeIssues(issues: string[]): Record<string, number> {
    const categories: Record<string, number> = {
      Security: 0,
      Performance: 0,
      Cost: 0,
      Reliability: 0,
      Other: 0
    };

    issues.forEach(issue => {
      const lowerIssue = issue.toLowerCase();
      if (lowerIssue.includes('security') || lowerIssue.includes('iam') || lowerIssue.includes('encrypt')) {
        categories.Security++;
      } else if (lowerIssue.includes('performance') || lowerIssue.includes('latency') || lowerIssue.includes('speed')) {
        categories.Performance++;
      } else if (lowerIssue.includes('cost') || lowerIssue.includes('expense') || lowerIssue.includes('price')) {
        categories.Cost++;
      } else if (lowerIssue.includes('reliability') || lowerIssue.includes('availability') || lowerIssue.includes('backup')) {
        categories.Reliability++;
      } else {
        categories.Other++;
      }
    });

    // Remove categories with 0 count
    Object.keys(categories).forEach(key => {
      if (categories[key] === 0) {
        delete categories[key];
      }
    });

    return categories;
  }

  private generateMicroservicesDiagram(architecture: any): string {
    return `
graph TB
    subgraph "API Gateway"
        GW[API Gateway]
    end
    
    subgraph "Microservices"
        AUTH[Auth Service]
        USER[User Service]
        ORDER[Order Service]
        PAY[Payment Service]
        NOTIFY[Notification Service]
    end
    
    subgraph "Data Layer"
        AUTHDB[(Auth DB)]
        USERDB[(User DB)]
        ORDERDB[(Order DB)]
        PAYDB[(Payment DB)]
    end
    
    subgraph "External"
        CACHE[(Redis Cache)]
        QUEUE[Message Queue]
    end
    
    GW --> AUTH
    GW --> USER
    GW --> ORDER
    GW --> PAY
    
    AUTH --> AUTHDB
    USER --> USERDB
    ORDER --> ORDERDB
    PAY --> PAYDB
    
    ORDER --> QUEUE
    PAY --> QUEUE
    QUEUE --> NOTIFY
    
    USER --> CACHE
    ORDER --> CACHE
    `;
  }

  private generateServerlessDiagram(architecture: any): string {
    return `
graph TB
    subgraph "Serverless Architecture"
        CF[CloudFront CDN]
        S3[S3 Static Hosting]
        
        subgraph "API Layer"
            APIGW[API Gateway]
            LAMBDA1[Lambda: Auth]
            LAMBDA2[Lambda: Users]
            LAMBDA3[Lambda: Orders]
        end
        
        subgraph "Data & Storage"
            DDB[(DynamoDB)]
            S3DATA[(S3 Data)]
            SQS[SQS Queue]
        end
    end
    
    USER[Users] --> CF
    CF --> S3
    CF --> APIGW
    
    APIGW --> LAMBDA1
    APIGW --> LAMBDA2
    APIGW --> LAMBDA3
    
    LAMBDA1 --> DDB
    LAMBDA2 --> DDB
    LAMBDA3 --> DDB
    LAMBDA3 --> SQS
    `;
  }

  private generateTraditionalDiagram(architecture: any): string {
    return `
graph TB
    subgraph "Traditional 3-Tier Architecture"
        subgraph "Presentation Tier"
            LB[Load Balancer]
            WEB1[Web Server 1]
            WEB2[Web Server 2]
        end
        
        subgraph "Application Tier"
            APP1[App Server 1]
            APP2[App Server 2]
        end
        
        subgraph "Data Tier"
            DB[(Primary DB)]
            DBSLAVE[(Replica DB)]
        end
    end
    
    USER[Users] --> LB
    LB --> WEB1
    LB --> WEB2
    WEB1 --> APP1
    WEB2 --> APP2
    APP1 --> DB
    APP2 --> DB
    DB --> DBSLAVE
    `;
  }

  private generateGenericDiagram(architecture: any): string {
    return `
graph TB
    A[Client Application] --> B[Load Balancer]
    B --> C[Web Servers]
    C --> D[Application Layer]
    D --> E[Database Layer]
    D --> F[Cache Layer]
    D --> G[External APIs]
    
    style A fill:#e1f5fe
    style E fill:#fff3e0
    style F fill:#f3e5f5
    `;
  }
}

export const visualizationService = new VisualizationService();