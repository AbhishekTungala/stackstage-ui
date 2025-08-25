"""
StackStage Plotly Visualization Engine
Creates interactive charts and visualizations for architecture health scoring
"""
import json
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
from typing import Dict, List, Any, Optional
import numpy as np

class PlotlyVisualizer:
    """Professional visualization engine using Plotly for StackStage analytics"""
    
    def __init__(self):
        # StackStage brand colors
        self.colors = {
            'primary': '#74b9ff',      # Blue
            'secondary': '#fd79a8',    # Pink
            'success': '#55efc4',      # Green
            'warning': '#fdcb6e',      # Yellow
            'danger': '#ff6b6b',       # Red
            'info': '#a29bfe',         # Purple
            'dark': '#2d3436',         # Dark Gray
            'light': '#ddd'            # Light Gray
        }
        
        self.gradient_colors = {
            'security': ['#ff6b6b', '#fd79a8', '#fdcb6e', '#55efc4'],
            'performance': ['#74b9ff', '#a29bfe', '#fd79a8', '#55efc4'],
            'cost': ['#fdcb6e', '#fd79a8', '#74b9ff', '#55efc4'],
            'reliability': ['#a29bfe', '#74b9ff', '#55efc4', '#00b894']
        }
        
        # Professional styling
        self.layout_theme = {
            'template': 'plotly_white',
            'font': {'family': 'Inter, Arial, sans-serif', 'size': 12},
            'colorway': list(self.colors.values()),
            'paper_bgcolor': 'white',
            'plot_bgcolor': 'rgba(0,0,0,0)'
        }
    
    def create_architecture_health_score_chart(self, scores: Dict[str, int]) -> Dict[str, Any]:
        """Create comprehensive architecture health score visualization"""
        
        # Extract scores with defaults
        overall_score = scores.get('overall', 75)
        security_score = scores.get('security', 22)
        reliability_score = scores.get('reliability', 23) 
        performance_score = scores.get('performance', 15)
        cost_score = scores.get('cost', 15)
        
        # Create subplot layout
        fig = make_subplots(
            rows=2, cols=3,
            specs=[
                [{"type": "indicator"}, {"type": "indicator"}, {"type": "indicator"}],
                [{"type": "indicator"}, {"type": "indicator"}, {"colspan": 1}]
            ],
            subplot_titles=("Overall Score", "Security", "Reliability", "Performance", "Cost", ""),
            vertical_spacing=0.15,
            horizontal_spacing=0.1
        )
        
        # Overall Score - Large gauge
        fig.add_trace(
            go.Indicator(
                mode="gauge+number+delta",
                value=overall_score,
                title={'text': "Architecture Health"},
                gauge={
                    'axis': {'range': [None, 100]},
                    'bar': {'color': self._get_score_color(overall_score)},
                    'steps': [
                        {'range': [0, 50], 'color': "rgba(255, 107, 107, 0.2)"},
                        {'range': [50, 80], 'color': "rgba(253, 203, 110, 0.2)"},
                        {'range': [80, 100], 'color': "rgba(85, 239, 196, 0.2)"}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': 90
                    }
                }
            ),
            row=1, col=1
        )
        
        # Security Score
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=security_score,
                title={'text': f"Security<br><span style='font-size:0.8em'>/{30} max</span>"},
                gauge={
                    'axis': {'range': [None, 30]},
                    'bar': {'color': self.colors['danger']},
                    'steps': [
                        {'range': [0, 15], 'color': "rgba(255, 107, 107, 0.2)"},
                        {'range': [15, 25], 'color': "rgba(253, 203, 110, 0.2)"},
                        {'range': [25, 30], 'color': "rgba(85, 239, 196, 0.2)"}
                    ]
                }
            ),
            row=1, col=2
        )
        
        # Reliability Score
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=reliability_score,
                title={'text': f"Reliability<br><span style='font-size:0.8em'>/{30} max</span>"},
                gauge={
                    'axis': {'range': [None, 30]},
                    'bar': {'color': self.colors['primary']},
                    'steps': [
                        {'range': [0, 15], 'color': "rgba(255, 107, 107, 0.2)"},
                        {'range': [15, 25], 'color': "rgba(253, 203, 110, 0.2)"},
                        {'range': [25, 30], 'color': "rgba(85, 239, 196, 0.2)"}
                    ]
                }
            ),
            row=1, col=3
        )
        
        # Performance Score
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=performance_score,
                title={'text': f"Performance<br><span style='font-size:0.8em'>/{20} max</span>"},
                gauge={
                    'axis': {'range': [None, 20]},
                    'bar': {'color': self.colors['info']},
                    'steps': [
                        {'range': [0, 10], 'color': "rgba(255, 107, 107, 0.2)"},
                        {'range': [10, 16], 'color': "rgba(253, 203, 110, 0.2)"},
                        {'range': [16, 20], 'color': "rgba(85, 239, 196, 0.2)"}
                    ]
                }
            ),
            row=2, col=1
        )
        
        # Cost Score
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=cost_score,
                title={'text': f"Cost Efficiency<br><span style='font-size:0.8em'>/{20} max</span>"},
                gauge={
                    'axis': {'range': [None, 20]},
                    'bar': {'color': self.colors['warning']},
                    'steps': [
                        {'range': [0, 10], 'color': "rgba(255, 107, 107, 0.2)"},
                        {'range': [10, 16], 'color': "rgba(253, 203, 110, 0.2)"},
                        {'range': [16, 20], 'color': "rgba(85, 239, 196, 0.2)"}
                    ]
                }
            ),
            row=2, col=2
        )
        
        # Update layout
        fig.update_layout(
            title={
                'text': 'StackStage Architecture Health Dashboard',
                'x': 0.5,
                'font': {'size': 20, 'family': 'Inter'}
            },
            height=600,
            showlegend=False,
            **self.layout_theme
        )
        
        return {
            'chart_type': 'health_dashboard',
            'plotly_json': fig.to_json(),
            'html': fig.to_html(include_plotlyjs='cdn'),
            'summary': {
                'overall_score': overall_score,
                'grade': self._get_grade(overall_score),
                'total_possible': 100
            }
        }
    
    def create_issues_severity_chart(self, issues: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create issues breakdown by severity chart"""
        
        if not issues:
            # Create empty state chart
            fig = go.Figure()
            fig.add_annotation(
                text="No issues detected in your architecture! 🎉",
                xref="paper", yref="paper",
                x=0.5, y=0.5,
                showarrow=False,
                font={'size': 18, 'color': self.colors['success']}
            )
            fig.update_layout(
                title="Security & Compliance Issues",
                **self.layout_theme
            )
            return {
                'chart_type': 'issues_severity',
                'plotly_json': fig.to_json(),
                'html': fig.to_html(include_plotlyjs='cdn'),
                'summary': {'total_issues': 0, 'status': 'healthy'}
            }
        
        # Count issues by severity
        severity_counts = {}
        for issue in issues:
            severity = issue.get('severity', 'medium').lower()
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
        
        # Define severity order and colors
        severity_order = ['critical', 'high', 'medium', 'low', 'info']
        severity_colors = {
            'critical': self.colors['danger'],
            'high': '#ff8f39',
            'medium': self.colors['warning'], 
            'low': self.colors['info'],
            'info': self.colors['light']
        }
        
        # Prepare data
        severities = []
        counts = []
        colors = []
        
        for severity in severity_order:
            if severity in severity_counts:
                severities.append(severity.title())
                counts.append(severity_counts[severity])
                colors.append(severity_colors[severity])
        
        # Create combined chart
        fig = make_subplots(
            rows=1, cols=2,
            specs=[[{"type": "pie"}, {"type": "bar"}]],
            subplot_titles=("Issues Distribution", "Severity Breakdown"),
            horizontal_spacing=0.1
        )
        
        # Pie chart
        fig.add_trace(
            go.Pie(
                labels=severities,
                values=counts,
                hole=0.4,
                marker_colors=colors,
                textinfo='label+percent',
                textposition='outside'
            ),
            row=1, col=1
        )
        
        # Bar chart
        fig.add_trace(
            go.Bar(
                x=severities,
                y=counts,
                marker_color=colors,
                text=counts,
                textposition='auto',
                name='Issues'
            ),
            row=1, col=2
        )
        
        fig.update_layout(
            title={
                'text': f'Security & Compliance Issues Analysis ({sum(counts)} total)',
                'x': 0.5
            },
            height=400,
            showlegend=False,
            **self.layout_theme
        )
        
        return {
            'chart_type': 'issues_severity',
            'plotly_json': fig.to_json(),
            'html': fig.to_html(include_plotlyjs='cdn'),
            'summary': {
                'total_issues': sum(counts),
                'critical_issues': severity_counts.get('critical', 0),
                'status': 'critical' if severity_counts.get('critical', 0) > 0 else 'needs_attention'
            }
        }
    
    def create_cost_breakdown_chart(self, cost_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create cost analysis and breakdown visualization"""
        
        breakdown = cost_data.get('breakdown', {})
        total_cost = cost_data.get('monthly', 750)
        optimization_potential = cost_data.get('optimization_potential', 150)
        currency = cost_data.get('currency', 'USD')
        
        if not breakdown:
            # Default breakdown if none provided
            breakdown = {
                'compute': total_cost * 0.4,
                'storage': total_cost * 0.25,
                'network': total_cost * 0.2,
                'security': total_cost * 0.15
            }
        
        # Create subplots
        fig = make_subplots(
            rows=2, cols=2,
            specs=[
                [{"type": "pie"}, {"type": "bar"}],
                [{"colspan": 2, "type": "scatter"}]
            ],
            subplot_titles=(
                "Cost Breakdown by Service",
                "Monthly Costs",
                "Cost Optimization Opportunities"
            ),
            vertical_spacing=0.12,
            horizontal_spacing=0.1
        )
        
        # Prepare data
        services = list(breakdown.keys())
        costs = [float(breakdown[service]) for service in services]
        service_colors = [
            self.colors['primary'],
            self.colors['secondary'],
            self.colors['info'],
            self.colors['warning'],
            self.colors['success']
        ]
        
        # Pie chart - Cost breakdown
        fig.add_trace(
            go.Pie(
                labels=[service.title() for service in services],
                values=costs,
                hole=0.4,
                marker_colors=service_colors[:len(services)],
                textinfo='label+percent+value',
                texttemplate='%{label}<br>%{percent}<br>$%{value:.0f}',
                textposition='outside'
            ),
            row=1, col=1
        )
        
        # Bar chart - Service costs
        fig.add_trace(
            go.Bar(
                x=[service.title() for service in services],
                y=costs,
                marker_color=service_colors[:len(services)],
                text=[f'${cost:.0f}' for cost in costs],
                textposition='auto',
                name='Monthly Cost'
            ),
            row=1, col=2
        )
        
        # Cost optimization waterfall
        optimization_data = {
            'Current Cost': total_cost,
            'Reserved Instances': -optimization_potential * 0.4,
            'Right Sizing': -optimization_potential * 0.3,
            'Storage Optimization': -optimization_potential * 0.2,
            'Network Optimization': -optimization_potential * 0.1,
            'Optimized Cost': total_cost - optimization_potential
        }
        
        x_vals = list(optimization_data.keys())
        y_vals = list(optimization_data.values())
        
        # Calculate cumulative for waterfall effect
        cumulative = [y_vals[0]]
        for i in range(1, len(y_vals) - 1):
            cumulative.append(cumulative[-1] + y_vals[i])
        cumulative.append(y_vals[-1])  # Final optimized cost
        
        colors = ['blue'] + ['red' if val < 0 else 'green' for val in y_vals[1:-1]] + ['green']
        
        fig.add_trace(
            go.Scatter(
                x=x_vals,
                y=cumulative,
                mode='lines+markers+text',
                line=dict(color='gray', width=2),
                marker=dict(size=10, color=colors),
                text=[f'${val:.0f}' for val in cumulative],
                textposition='top center',
                name='Cost Impact'
            ),
            row=2, col=1
        )
        
        # Add bars for waterfall visualization
        for i, (label, value) in enumerate(optimization_data.items()):
            if i == 0 or i == len(optimization_data) - 1:
                # Start and end points
                fig.add_trace(
                    go.Bar(
                        x=[label],
                        y=[abs(value)],
                        marker_color='blue' if i == 0 else 'green',
                        showlegend=False
                    ),
                    row=2, col=1
                )
            else:
                # Optimization steps
                fig.add_trace(
                    go.Bar(
                        x=[label],
                        y=[abs(value)],
                        marker_color='red',
                        showlegend=False
                    ),
                    row=2, col=1
                )
        
        fig.update_layout(
            title={
                'text': f'Cost Analysis Dashboard - ${total_cost:.0f} {currency}/month',
                'x': 0.5
            },
            height=800,
            showlegend=False,
            **self.layout_theme
        )
        
        return {
            'chart_type': 'cost_analysis',
            'plotly_json': fig.to_json(),
            'html': fig.to_html(include_plotlyjs='cdn'),
            'summary': {
                'total_monthly_cost': total_cost,
                'optimization_potential': optimization_potential,
                'potential_savings_percent': round((optimization_potential / total_cost) * 100, 1),
                'currency': currency
            }
        }
    
    def create_compliance_radar_chart(self, compliance_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create compliance framework radar chart"""
        
        framework_scores = compliance_data.get('framework_scores', {})
        
        if not framework_scores:
            # Default compliance scores
            framework_scores = {
                'SOC2': {'score': 78, 'status': 'partially_compliant'},
                'GDPR': {'score': 85, 'status': 'compliant'},
                'HIPAA': {'score': 72, 'status': 'partially_compliant'},
                'PCI_DSS': {'score': 68, 'status': 'non_compliant'}
            }
        
        # Prepare data for radar chart
        frameworks = list(framework_scores.keys())
        scores = [framework_scores[fw]['score'] for fw in frameworks]
        
        # Add first point at the end to close the radar chart
        frameworks.append(frameworks[0])
        scores.append(scores[0])
        
        fig = go.Figure()
        
        # Add radar trace
        fig.add_trace(
            go.Scatterpolar(
                r=scores,
                theta=frameworks,
                fill='toself',
                fillcolor='rgba(116, 185, 255, 0.2)',
                line=dict(color=self.colors['primary'], width=3),
                marker=dict(size=8, color=self.colors['primary']),
                name='Compliance Score'
            )
        )
        
        # Add ideal score line
        ideal_scores = [100] * len(frameworks)
        fig.add_trace(
            go.Scatterpolar(
                r=ideal_scores,
                theta=frameworks,
                line=dict(color=self.colors['success'], width=2, dash='dash'),
                name='Target Score (100)',
                showlegend=True
            )
        )
        
        fig.update_layout(
            polar=dict(
                radialaxis=dict(
                    visible=True,
                    range=[0, 100],
                    tickfont=dict(size=10),
                    gridcolor='lightgray'
                ),
                angularaxis=dict(
                    tickfont=dict(size=12)
                )
            ),
            title={
                'text': 'Compliance Framework Assessment',
                'x': 0.5,
                'font': {'size': 18}
            },
            height=500,
            **self.layout_theme
        )
        
        # Calculate overall compliance
        overall_compliance = sum(scores[:-1]) / (len(scores) - 1)  # Exclude duplicate first item
        
        return {
            'chart_type': 'compliance_radar',
            'plotly_json': fig.to_json(), 
            'html': fig.to_html(include_plotlyjs='cdn'),
            'summary': {
                'overall_compliance_score': round(overall_compliance, 1),
                'frameworks_assessed': len(frameworks) - 1,
                'compliant_frameworks': len([fw for fw, data in framework_scores.items() if data['score'] >= 80])
            }
        }
    
    def create_performance_trends_chart(self, performance_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create performance trends over time"""
        
        if not performance_data:
            # Generate sample trend data
            dates = pd.date_range('2024-01-01', periods=30, freq='D')
            performance_data = [
                {
                    'date': date.strftime('%Y-%m-%d'),
                    'response_time': np.random.normal(200, 50),
                    'throughput': np.random.normal(1000, 100),
                    'error_rate': np.random.normal(2, 0.5),
                    'availability': np.random.normal(99.5, 0.3)
                }
                for date in dates
            ]
        
        df = pd.DataFrame(performance_data)
        
        # Create subplots
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=(
                'Response Time (ms)',
                'Throughput (req/s)', 
                'Error Rate (%)',
                'Availability (%)'
            ),
            vertical_spacing=0.1,
            horizontal_spacing=0.1
        )
        
        # Response Time
        fig.add_trace(
            go.Scatter(
                x=df['date'],
                y=df['response_time'],
                mode='lines+markers',
                name='Response Time',
                line=dict(color=self.colors['primary'], width=2),
                fill='tonexty' if 'response_time' in df.columns else None
            ),
            row=1, col=1
        )
        
        # Throughput
        fig.add_trace(
            go.Scatter(
                x=df['date'],
                y=df['throughput'],
                mode='lines+markers',
                name='Throughput',
                line=dict(color=self.colors['success'], width=2)
            ),
            row=1, col=2
        )
        
        # Error Rate
        fig.add_trace(
            go.Scatter(
                x=df['date'],
                y=df['error_rate'],
                mode='lines+markers',
                name='Error Rate',
                line=dict(color=self.colors['danger'], width=2),
                fill='tozeroy'
            ),
            row=2, col=1
        )
        
        # Availability
        fig.add_trace(
            go.Scatter(
                x=df['date'],
                y=df['availability'],
                mode='lines+markers',
                name='Availability',
                line=dict(color=self.colors['info'], width=2)
            ),
            row=2, col=2
        )
        
        fig.update_layout(
            title={
                'text': 'Performance Trends Dashboard',
                'x': 0.5
            },
            height=600,
            showlegend=False,
            **self.layout_theme
        )
        
        # Calculate performance summary
        avg_response_time = df['response_time'].mean()
        avg_throughput = df['throughput'].mean()
        avg_error_rate = df['error_rate'].mean()
        avg_availability = df['availability'].mean()
        
        return {
            'chart_type': 'performance_trends',
            'plotly_json': fig.to_json(),
            'html': fig.to_html(include_plotlyjs='cdn'),
            'summary': {
                'avg_response_time': round(avg_response_time, 1),
                'avg_throughput': round(avg_throughput, 0),
                'avg_error_rate': round(avg_error_rate, 2),
                'avg_availability': round(avg_availability, 2),
                'performance_grade': self._get_grade(min(100, (100 - avg_response_time/10)))
            }
        }
    
    def create_comprehensive_dashboard(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Create comprehensive multi-chart dashboard"""
        
        # Extract data from analysis results
        scores = analysis_results.get('score', {})
        issues = analysis_results.get('issues', [])
        cost_data = analysis_results.get('estimated_cost', {})
        compliance_data = analysis_results.get('compliance_assessment', {})
        
        # Generate individual charts
        health_chart = self.create_architecture_health_score_chart(scores)
        issues_chart = self.create_issues_severity_chart(issues)
        cost_chart = self.create_cost_breakdown_chart(cost_data)
        compliance_chart = self.create_compliance_radar_chart(compliance_data)
        performance_chart = self.create_performance_trends_chart([])
        
        return {
            'dashboard_type': 'comprehensive',
            'charts': {
                'health_scores': health_chart,
                'issues_analysis': issues_chart,
                'cost_breakdown': cost_chart,
                'compliance_assessment': compliance_chart,
                'performance_trends': performance_chart
            },
            'summary': {
                'overall_health': scores.get('overall', 75),
                'total_issues': len(issues),
                'estimated_monthly_cost': cost_data.get('monthly', 750),
                'compliance_score': compliance_data.get('overall_compliance_score', 75)
            },
            'generated_at': self._get_timestamp()
        }
    
    def _get_score_color(self, score: int) -> str:
        """Get color based on score value"""
        if score >= 80:
            return self.colors['success']
        elif score >= 60:
            return self.colors['warning'] 
        else:
            return self.colors['danger']
    
    def _get_grade(self, score: float) -> str:
        """Convert numeric score to letter grade"""
        if score >= 90:
            return 'A'
        elif score >= 80:
            return 'B'
        elif score >= 70:
            return 'C'
        elif score >= 60:
            return 'D'
        else:
            return 'F'
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()

    def export_charts_as_images(self, charts: Dict[str, Any], output_dir: str = "chart_exports") -> Dict[str, str]:
        """Export Plotly charts as static images"""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        exported_files = {}
        
        for chart_name, chart_data in charts.items():
            try:
                if 'plotly_json' in chart_data:
                    fig = go.Figure(json.loads(chart_data['plotly_json']))
                    
                    # Export as PNG
                    png_path = os.path.join(output_dir, f"{chart_name}.png")
                    fig.write_image(png_path, width=800, height=600)
                    exported_files[f"{chart_name}_png"] = png_path
                    
                    # Export as HTML
                    html_path = os.path.join(output_dir, f"{chart_name}.html")
                    fig.write_html(html_path)
                    exported_files[f"{chart_name}_html"] = html_path
                    
            except Exception as e:
                print(f"Failed to export chart {chart_name}: {e}")
                continue
        
        return exported_files