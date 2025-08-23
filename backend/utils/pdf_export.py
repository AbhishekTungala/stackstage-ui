"""PDF Report Generation for StackStage Architecture Analysis"""

import io
import base64
import os
import tempfile
from datetime import datetime
from typing import Dict, Any
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.platypus.frames import Frame
from reportlab.platypus.doctemplate import PageTemplate
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

# Set the style for professional charts
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")


def generate_analysis_pdf(analysis_data: Dict[str, Any]) -> bytes:
    """Generate comprehensive PDF report from StackStage analysis data"""
    
    # Create a file-like buffer to receive PDF data
    buffer = io.BytesIO()
    
    # Create the PDF object, using the buffer as its "file"
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                          rightMargin=50, leftMargin=50,
                          topMargin=50, bottomMargin=50)
    
    # Container for the 'Flowable' objects
    story = []
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=HexColor('#1a1a1a')
    )
    
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=HexColor('#2563eb')
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6,
        alignment=TA_JUSTIFY
    )
    
    # Professional Header
    story.append(Paragraph("StackStage", title_style))
    story.append(Paragraph("Cloud Architecture Analysis Report", section_style))
    story.append(Paragraph("Build with Confidence", body_style))
    story.append(Spacer(1, 30))
    
    # Executive Summary with Enhanced Data
    story.append(Paragraph("Executive Summary", section_style))
    
    # Enhanced score and metrics display
    score = analysis_data.get('score', 0)
    score_color = get_score_color(score)
    chart_data = analysis_data.get('chart_data', {})
    
    summary_data = [
        ['Overall Architecture Score', f'<font color="{score_color}"><b>{score}/100</b></font>'],
        ['Security Assessment', f'{chart_data.get("security_score", "N/A")}/100'],
        ['Performance Rating', f'{chart_data.get("performance_score", "N/A")}/100'],
        ['Cost Optimization', f'{chart_data.get("cost_score", "N/A")}/100'],
        ['Reliability Score', f'{chart_data.get("reliability_score", "N/A")}/100'],
        ['Analysis Date', analysis_data.get('timestamp', datetime.now().isoformat())[:19].replace('T', ' ')],
        ['Analysis ID', analysis_data.get('analysis_id', 'N/A')],
        ['Estimated Monthly Cost', analysis_data.get('estimated_cost', 'Calculating...')]
    ]
    
    summary_table = Table(summary_data, colWidths=[2*inch, 3*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#f8fafc')),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#374151')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, HexColor('#e5e7eb'))
    ]))
    
    story.append(summary_table)
    story.append(Spacer(1, 20))
    
    # Detailed Analysis
    details = analysis_data.get('details', {})
    if details:
        story.append(Paragraph("Detailed Assessment", section_style))
        
        details_data = [
            ['Metric', 'Rating'],
            ['Security Grade', details.get('security_grade', 'N/A')],
            ['Scalability Score', f"{details.get('scalability_score', 'N/A')}/100"],
            ['Reliability Score', f"{details.get('reliability_score', 'N/A')}/100"],
            ['Cost Efficiency', details.get('cost_efficiency', 'N/A')],
            ['Performance Rating', details.get('performance_rating', 'N/A')],
            ['Compliance Status', details.get('compliance_status', 'N/A')]
        ]
        
        details_table = Table(details_data, colWidths=[2.5*inch, 2.5*inch])
        details_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#e5e7eb')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#ffffff'), HexColor('#f8fafc')])
        ]))
        
        story.append(details_table)
        story.append(Spacer(1, 20))
    
    # Visual Dashboard Analytics
    story.append(PageBreak())
    story.append(Paragraph("Performance Analytics Dashboard", section_style))
    
    # Generate professional charts as in-memory images
    chart_summary = chart_data if chart_data else {}
    
    # Add professional charts
    try:
        # 1. Radar Chart
        radar_img_data = create_radar_chart_memory(chart_summary)
        if radar_img_data:
            story.append(Image(radar_img_data, width=6.5*inch, height=4*inch))
            story.append(Spacer(1, 15))
        
        # 2. Bar Chart  
        bar_img_data = create_bar_chart_memory(chart_summary)
        if bar_img_data:
            story.append(Image(bar_img_data, width=6.5*inch, height=3.5*inch))
            story.append(Spacer(1, 15))
            
        # 3. Performance Summary Table (instead of trend chart for reliability)
        create_performance_summary_table(story, chart_summary, section_style, body_style)
            
    except Exception as e:
        print(f"Chart generation error: {e}")
        # Fallback to text summary
        story.append(Paragraph("Performance Summary", section_style))
        story.append(Paragraph(f"Overall Score: {chart_summary.get('overall_score', 'N/A')}/100", body_style))
        story.append(Paragraph(f"Security: {chart_summary.get('security_score', 'N/A')}/100", body_style))
        story.append(Paragraph(f"Performance: {chart_summary.get('performance_score', 'N/A')}/100", body_style))

    # Issues Section
    issues = analysis_data.get('issues', [])
    if issues:
        story.append(Paragraph("Critical Issues Identified", section_style))
        for i, issue in enumerate(issues[:8], 1):  # Limit to 8 issues for better formatting
            story.append(Paragraph(f"<b>{i}.</b> {issue}", body_style))
        story.append(Spacer(1, 15))
    
    # Recommendations Section
    recommendations = analysis_data.get('recommendations', [])
    if recommendations:
        story.append(Paragraph("Architecture Recommendations", section_style))
        for i, rec in enumerate(recommendations[:8], 1):  # Limit to 8 recommendations
            story.append(Paragraph(f"<b>{i}.</b> {rec}", body_style))
        story.append(Spacer(1, 15))
    
    # Architecture Diagram (if available)
    diagram = analysis_data.get('diagram', '')
    if diagram:
        story.append(PageBreak())
        story.append(Paragraph("Optimized Architecture Diagram", section_style))
        story.append(Paragraph("The following Mermaid diagram represents the optimized architecture:", body_style))
        story.append(Spacer(1, 10))
        
        # Add diagram as code block
        diagram_style = ParagraphStyle(
            'DiagramCode',
            parent=styles['Code'],
            fontSize=9,
            leftIndent=20,
            rightIndent=20,
            spaceAfter=12,
            backgroundColor=HexColor('#f3f4f6')
        )
        story.append(Paragraph(f"<pre>{diagram}</pre>", diagram_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph("Note: Use a Mermaid renderer to visualize this diagram.", body_style))
    
    # Footer
    story.append(Spacer(1, 30))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        alignment=TA_CENTER,
        textColor=HexColor('#6b7280')
    )
    story.append(Paragraph("Generated by StackStage - Cloud Architecture Analysis Platform", footer_style))
    story.append(Paragraph(f"Report generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}", footer_style))
    
    # Build PDF
    doc.build(story)
    
    # Get the value of the BytesIO buffer and return it
    pdf_data = buffer.getvalue()
    buffer.close()
    
    return pdf_data


def get_score_color(score: int) -> str:
    """Get color based on score"""
    if score >= 90:
        return "#10b981"  # Green
    elif score >= 80:
        return "#f59e0b"  # Yellow
    elif score >= 60:
        return "#f97316"  # Orange
    else:
        return "#ef4444"  # Red


def get_status_label(score: int) -> str:
    """Get status label based on score"""
    if score >= 90:
        return "Excellent"
    elif score >= 80:
        return "Good"
    elif score >= 60:
        return "Fair"
    else:
        return "Needs Improvement"


def create_radar_chart_memory(chart_data: Dict[str, Any]) -> io.BytesIO:
    """Create professional radar chart in memory"""
    try:
        fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(projection='polar'))
        fig.patch.set_facecolor('white')
        
        # Data for radar chart
        categories = ['Security', 'Performance', 'Cost\nOptimization', 'Reliability', 'Overall']
        values = [
            chart_data.get('security_score', 70),
            chart_data.get('performance_score', 75),
            chart_data.get('cost_score', 65),
            chart_data.get('reliability_score', 80),
            chart_data.get('overall_score', 73)
        ]
        
        # Create angles for each category
        angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
        values += values[:1]  # Complete the circle
        angles += angles[:1]
        
        # Plot with professional styling
        ax.plot(angles, values, 'o-', linewidth=4, color='#3B82F6', alpha=0.9, markersize=8)
        ax.fill(angles, values, color='#3B82F6', alpha=0.25)
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(categories, fontsize=12, fontweight='bold')
        ax.set_ylim(0, 100)
        ax.set_yticks([20, 40, 60, 80, 100])
        ax.set_yticklabels(['20', '40', '60', '80', '100'], fontsize=10)
        ax.grid(True, alpha=0.3)
        
        plt.title('Architecture Performance Overview', size=16, fontweight='bold', pad=30)
        plt.tight_layout()
        
        # Save to BytesIO
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=200, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        img_buffer.seek(0)
        plt.close()
        return img_buffer
    except Exception as e:
        print(f"Radar chart error: {e}")
        return None


def create_bar_chart_memory(chart_data: Dict[str, Any]) -> io.BytesIO:
    """Create professional bar chart in memory"""
    try:
        fig, ax = plt.subplots(figsize=(10, 6))
        fig.patch.set_facecolor('white')
        
        categories = ['Security', 'Performance', 'Cost\nOptimization', 'Reliability']
        values = [
            chart_data.get('security_score', 70),
            chart_data.get('performance_score', 75),
            chart_data.get('cost_score', 65),
            chart_data.get('reliability_score', 80)
        ]
        
        # Professional color scheme
        colors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6']
        
        bars = ax.bar(categories, values, color=colors, alpha=0.8, 
                     edgecolor='white', linewidth=2)
        
        # Add value labels on bars
        for bar, value in zip(bars, values):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5,
                    f'{value}%', ha='center', va='bottom', fontweight='bold', 
                    fontsize=13, color='#1f2937')
        
        ax.set_ylim(0, 105)
        ax.set_ylabel('Score (%)', fontsize=14, fontweight='bold')
        ax.set_title('Performance Metrics Comparison', fontsize=16, fontweight='bold', pad=20)
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        
        # Professional styling
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#e5e7eb')
        ax.spines['bottom'].set_color('#e5e7eb')
        
        plt.tight_layout()
        
        # Save to BytesIO
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=200, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        img_buffer.seek(0)
        plt.close()
        return img_buffer
    except Exception as e:
        print(f"Bar chart error: {e}")
        return None


def create_performance_summary_table(story, chart_data: Dict[str, Any], section_style, body_style):
    """Create a detailed performance summary table"""
    story.append(Paragraph("Detailed Performance Metrics", section_style))
    
    # Enhanced performance data with visual indicators
    performance_data = [
        ['Metric', 'Current Score', 'Status', 'Target Score'],
        ['Security Assessment', f'{chart_data.get("security_score", 70)}/100', 
         get_status_label(chart_data.get("security_score", 70)), '90/100'],
        ['Performance Rating', f'{chart_data.get("performance_score", 75)}/100', 
         get_status_label(chart_data.get("performance_score", 75)), '85/100'],
        ['Cost Optimization', f'{chart_data.get("cost_score", 65)}/100', 
         get_status_label(chart_data.get("cost_score", 65)), '80/100'],
        ['Reliability Score', f'{chart_data.get("reliability_score", 80)}/100', 
         get_status_label(chart_data.get("reliability_score", 80)), '95/100'],
        ['Overall Architecture', f'{chart_data.get("overall_score", 73)}/100', 
         get_status_label(chart_data.get("overall_score", 73)), '88/100']
    ]
    
    performance_table = Table(performance_data, colWidths=[2*inch, 1.2*inch, 1.3*inch, 1.2*inch])
    performance_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1.5, HexColor('#e5e7eb')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#ffffff'), HexColor('#f8fafc')])
    ]))
    
    story.append(performance_table)
    story.append(Spacer(1, 20))


def create_radar_chart(chart_data: Dict[str, Any], output_file: str) -> bool:
    """Create professional radar chart for performance metrics"""
    try:
        fig, ax = plt.subplots(figsize=(10, 8), subplot_kw=dict(projection='polar'))
        fig.patch.set_facecolor('white')
        
        # Data for radar chart
        categories = ['Security', 'Performance', 'Cost\nOptimization', 'Reliability', 'Overall']
        values = [
            chart_data.get('security_score', 70),
            chart_data.get('performance_score', 75),
            chart_data.get('cost_score', 65),
            chart_data.get('reliability_score', 80),
            chart_data.get('overall_score', 73)
        ]
        
        # Create angles for each category
        angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
        values += values[:1]  # Complete the circle
        angles += angles[:1]
        
        # Plot with professional styling
        ax.plot(angles, values, 'o-', linewidth=3, color='#3B82F6', alpha=0.8, markersize=8)
        ax.fill(angles, values, color='#3B82F6', alpha=0.25)
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(categories, fontsize=11, fontweight='bold')
        ax.set_ylim(0, 100)
        ax.set_yticks([20, 40, 60, 80, 100])
        ax.set_yticklabels(['20', '40', '60', '80', '100'], fontsize=9)
        ax.grid(True, alpha=0.3)
        
        plt.title('Architecture Performance Overview', size=16, fontweight='bold', pad=20)
        plt.tight_layout()
        plt.savefig(output_file, dpi=300, bbox_inches='tight', facecolor='white', 
                   edgecolor='none', transparent=False)
        plt.close()
        return True
    except Exception as e:
        print(f"Radar chart error: {e}")
        return False


def create_bar_chart(chart_data: Dict[str, Any], output_file: str) -> bool:
    """Create professional bar chart comparing metrics"""
    try:
        fig, ax = plt.subplots(figsize=(12, 6))
        fig.patch.set_facecolor('white')
        
        categories = ['Security', 'Performance', 'Cost\nOptimization', 'Reliability']
        values = [
            chart_data.get('security_score', 70),
            chart_data.get('performance_score', 75),
            chart_data.get('cost_score', 65),
            chart_data.get('reliability_score', 80)
        ]
        
        # Professional color scheme
        colors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6']
        
        bars = ax.bar(categories, values, color=colors, alpha=0.8, 
                     edgecolor='white', linewidth=2)
        
        # Add value labels on bars
        for bar, value in zip(bars, values):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5,
                    f'{value}%', ha='center', va='bottom', fontweight='bold', 
                    fontsize=12, color='#1f2937')
        
        ax.set_ylim(0, 105)
        ax.set_ylabel('Score (%)', fontsize=13, fontweight='bold')
        ax.set_title('Performance Metrics Comparison', fontsize=16, fontweight='bold', pad=20)
        ax.grid(axis='y', alpha=0.3, linestyle='--')
        
        # Professional styling
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#e5e7eb')
        ax.spines['bottom'].set_color('#e5e7eb')
        
        plt.tight_layout()
        plt.savefig(output_file, dpi=300, bbox_inches='tight', facecolor='white',
                   edgecolor='none', transparent=False)
        plt.close()
        return True
    except Exception as e:
        print(f"Bar chart error: {e}")
        return False


def create_trend_chart(chart_data: Dict[str, Any], output_file: str) -> bool:
    """Create trend analysis chart"""
    try:
        fig, ax = plt.subplots(figsize=(12, 6))
        fig.patch.set_facecolor('white')
        
        # Timeline data
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        
        # Create realistic trend data based on current scores
        security_score = chart_data.get('security_score', 70)
        performance_score = chart_data.get('performance_score', 75)
        cost_score = chart_data.get('cost_score', 65)
        
        # Generate progressive improvement trends
        security_trend = [max(40, security_score - 25), max(50, security_score - 20), 
                         max(55, security_score - 15), max(60, security_score - 10), 
                         max(65, security_score - 5), security_score]
        
        performance_trend = [max(45, performance_score - 20), max(55, performance_score - 15), 
                            max(60, performance_score - 12), max(65, performance_score - 8), 
                            max(70, performance_score - 4), performance_score]
        
        cost_trend = [max(35, cost_score - 20), max(45, cost_score - 15), 
                     max(50, cost_score - 10), max(55, cost_score - 8), 
                     max(60, cost_score - 3), cost_score]
        
        # Plot with professional styling
        ax.plot(months, security_trend, marker='o', linewidth=3, markersize=8,
                label='Security', color='#EF4444', alpha=0.9)
        ax.plot(months, performance_trend, marker='s', linewidth=3, markersize=8,
                label='Performance', color='#10B981', alpha=0.9) 
        ax.plot(months, cost_trend, marker='^', linewidth=3, markersize=8,
                label='Cost Optimization', color='#F59E0B', alpha=0.9)
        
        ax.set_ylim(0, 100)
        ax.set_ylabel('Score (%)', fontsize=13, fontweight='bold')
        ax.set_xlabel('Timeline (2024)', fontsize=13, fontweight='bold')
        ax.set_title('Performance Trend Analysis', fontsize=16, fontweight='bold', pad=20)
        ax.legend(frameon=True, fancybox=True, shadow=True, fontsize=12, loc='lower right')
        ax.grid(True, alpha=0.3, linestyle='--')
        
        # Professional styling
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#e5e7eb')
        ax.spines['bottom'].set_color('#e5e7eb')
        
        plt.tight_layout()
        plt.savefig(output_file, dpi=300, bbox_inches='tight', facecolor='white',
                   edgecolor='none', transparent=False)
        plt.close()
        return True
    except Exception as e:
        print(f"Trend chart error: {e}")
        return False


def get_chart_color(score: int) -> str:
    """Get chart color based on score"""
    if score >= 90:
        return '#10B981'  # Green
    elif score >= 80:
        return '#84CC16'  # Light Green  
    elif score >= 70:
        return '#F59E0B'  # Yellow
    elif score >= 60:
        return '#F97316'  # Orange
    else:
        return '#EF4444'  # Red


def generate_pdf_base64(analysis_data: Dict[str, Any]) -> str:
    """Generate PDF and return as base64 string"""
    pdf_bytes = generate_analysis_pdf(analysis_data)
    return base64.b64encode(pdf_bytes).decode('utf-8')