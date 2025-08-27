import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';
import { AlertTriangle, CheckCircle, Info, Code, TrendingUp, Globe, Shield } from 'lucide-react';

interface Risk {
  id: string;
  title: string;
  severity: 'high' | 'med' | 'low';
  impact: string;
  fix: string;
}

interface Recommendation {
  title: string;
  why: string;
  how: string;
  iac_snippet: string;
}

interface CostItem {
  service: string;
  est_usd: number;
}

interface Alternative {
  name: string;
  pros: string[];
  cons: string[];
  cost_delta_pct: number;
  latency_delta_ms: number;
}

interface StructuredResponseData {
  score: number;
  summary: string;
  rationale: string;
  risks: Risk[];
  recommendations: Recommendation[];
  rpo_rto_alignment: {
    rpo_minutes: number;
    rto_minutes: number;
    notes: string;
  };
  pci_essentials: Array<{
    control: string;
    status: 'pass' | 'gap';
    action: string;
  }>;
  cost: {
    currency: string;
    assumptions: string[];
    range_monthly_usd: { low: number; high: number };
    items: CostItem[];
  };
  latency: {
    primary_region: string;
    alt_regions_considered: string[];
    notes: string;
  };
  diagram_mermaid: string;
  alternatives: Alternative[];
}

interface StructuredResponseProps {
  data: StructuredResponseData;
  className?: string;
  parsingError?: boolean;
}

const StructuredResponse: React.FC<StructuredResponseProps> = ({ data, className = '', parsingError = false }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'med': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {parsingError && (
        <Card className="glass-card border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">AI Response Format Issue</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
              The AI provided an unstructured response. Please try asking your question again with more specific requirements.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Score and Summary */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Architecture Analysis</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor(data.score || 0)}`}>
                {data.score || 0}/100
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium mb-2">{data.summary || 'Analysis summary not available'}</p>
          {data.rationale && <p className="text-muted-foreground">{data.rationale}</p>}
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      {data.cost && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Monthly Cost Range</h4>
                {data.cost.range_monthly_usd ? (
                  <div className="text-2xl font-bold text-green-600">
                    ${data.cost.range_monthly_usd.low} - ${data.cost.range_monthly_usd.high}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Cost range not available</div>
                )}
                <p className="text-sm text-muted-foreground">{data.cost.currency || 'USD'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Key Assumptions</h4>
                {data.cost.assumptions && Array.isArray(data.cost.assumptions) && data.cost.assumptions.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {data.cost.assumptions.map((assumption, index) => (
                      <li key={index} className="text-muted-foreground">• {assumption}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No assumptions provided</p>
                )}
              </div>
            </div>
            {data.cost.items && Array.isArray(data.cost.items) && data.cost.items.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium mb-3">Service Breakdown</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                    {data.cost.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">{item.service}</span>
                        <span className="font-medium">${item.est_usd}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Risks */}
      {data.risks && data.risks.length > 0 && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.risks.map((risk, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{risk.title}</h4>
                    <Badge variant="outline" className={getSeverityColor(risk.severity)}>
                      {risk.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{risk.impact}</p>
                  <div className="text-sm">
                    <strong>Fix:</strong> {risk.fix}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RTO/RPO Alignment */}
      {data.rpo_rto_alignment && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              RTO/RPO Alignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-muted/50 rounded">
                <div className="text-2xl font-bold text-primary">{data.rpo_rto_alignment.rpo_minutes}m</div>
                <div className="text-sm text-muted-foreground">Recovery Point Objective</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded">
                <div className="text-2xl font-bold text-primary">{data.rpo_rto_alignment.rto_minutes}m</div>
                <div className="text-sm text-muted-foreground">Recovery Time Objective</div>
              </div>
            </div>
            {data.rpo_rto_alignment.notes && (
              <p className="text-sm text-muted-foreground">{data.rpo_rto_alignment.notes}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-primary/20 pl-4">
                  <h4 className="font-medium mb-2">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{rec.why}</p>
                  <p className="text-sm mb-3">{rec.how}</p>
                  {rec.iac_snippet && (
                    <div className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto max-w-none">
                      <pre>{rec.iac_snippet}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mermaid Diagram */}
      {data.diagram_mermaid && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Architecture Diagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded text-sm font-mono overflow-x-auto max-w-none">
              <pre>{data.diagram_mermaid}</pre>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Copy this Mermaid code to visualize the architecture diagram in your preferred tool.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alternatives */}
      {data.alternatives && data.alternatives.length > 0 && (
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Alternative Architectures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.alternatives.map((alt, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{alt.name}</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong className="text-green-600">Pros:</strong>
                      <ul className="mt-1 space-y-1">
                        {alt.pros.map((pro, i) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-red-600">Cons:</strong>
                      <ul className="mt-1 space-y-1">
                        {alt.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div><strong>Cost:</strong> {alt.cost_delta_pct > 0 ? '+' : ''}{alt.cost_delta_pct}%</div>
                      <div><strong>Latency:</strong> {alt.latency_delta_ms > 0 ? '+' : ''}{alt.latency_delta_ms}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StructuredResponse;