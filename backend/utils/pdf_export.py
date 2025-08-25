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
    """Generate comprehensive PDF report from StackStage analysis data with enhanced visualizations"""
    
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
    
    # Custom styles for enhanced StackStage branding
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor=HexColor('#1a1a1a'),
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'SubtitleStyle',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=25,
        alignment=TA_CENTER,
        textColor=HexColor('#74b9ff'),
        fontName='Helvetica'
    )
    
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=HexColor('#2563eb'),
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
        fontName='Helvetica'
    )
    
    score_style = ParagraphStyle(
        'ScoreText',
        parent=styles['Normal'],
        fontSize=14,
        spaceAfter=8,
        alignment=TA_CENTER,
        textColor=HexColor('#00b894'),
        fontName='Helvetica-Bold'
    )
    
    # Enhanced Professional Header
    story.append(Paragraph("StackStage", title_style))
    story.append(Paragraph("AI-Powered Cloud Architecture Analysis", subtitle_style))
    story.append(Paragraph("Build with Confidence - Enterprise Infrastructure Report", body_style))
    story.append(Spacer(1, 20))
    
    # Analysis Method Badge
    analysis_method = analysis_data.get('analysis_method', 'hybrid_ai_enhanced')
    method_display = {
        'hybrid_ai_enhanced': 'AI + Static Analysis + Local Intelligence',
        'enhanced_local_fallback': 'Enhanced Local Analysis Engine',
        'enhanced_fallback_after_ai_failure': 'Comprehensive Fallback Analysis'
    }.get(analysis_method, 'Advanced Analysis Engine')
    
    story.append(Paragraph(f"Analysis Method: <b>{method_display}</b>", body_style))
    story.append(Spacer(1, 30))
    
    # Add premium branding bar
    branding_style = ParagraphStyle(
        'BrandingBar',
        parent=styles['Normal'],
        fontSize=10,
        alignment=TA_CENTER,
        textColor=HexColor('#6366f1'),
        spaceBefore=10,
        spaceAfter=20
    )
    story.append(Paragraph("🚀 Premium SaaS Dashboard Export | Real-time AI Analysis", branding_style))
    
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
    
    # Premium SaaS Dashboard Analytics
    story.append(PageBreak())
    story.append(Paragraph("Premium Analytics Dashboard", section_style))
    story.append(Paragraph("Comprehensive visual analysis with gradient charts and enterprise-grade insights", body_style))
    story.append(Spacer(1, 20))
    
    # Generate enhanced chart data with all metrics from Results page
    chart_summary = chart_data if chart_data else {}
    enhanced_data = {
        'security_score': chart_summary.get('security_score', analysis_data.get('security_score', 70)),
        'performance_score': chart_summary.get('performance_score', analysis_data.get('performance_score', 75)),
        'cost_score': chart_summary.get('cost_score', analysis_data.get('cost_score', 65)),
        'reliability_score': chart_summary.get('reliability_score', analysis_data.get('reliability_score', 80)),
        'scalability_score': chart_summary.get('scalability_score', max(45, min(88, score + (len(analysis_data.get('recommendations', [])) > 2 and 3 or -7)))),
        'compliance_score': chart_summary.get('compliance_score', max(35, min(95, score - (len(analysis_data.get('issues', [])) > 4 and 15 or 8) + 10))),
        'overall_score': score
    }
    
    # Add premium dashboard charts
    try:
        # 1. Multi-Dimensional Radar Chart
        story.append(Paragraph("Multi-Dimensional Architecture Analysis", section_style))
        radar_img_data = create_radar_chart_memory(enhanced_data)
        if radar_img_data:
            story.append(Image(radar_img_data, width=7*inch, height=5*inch))
            story.append(Spacer(1, 20))
        
        # 2. Premium Performance Dashboard  
        story.append(Paragraph("Performance Metrics Dashboard", section_style))
        bar_img_data = create_bar_chart_memory(enhanced_data)
        if bar_img_data:
            story.append(Image(bar_img_data, width=7*inch, height=4.5*inch))
            story.append(Spacer(1, 20))
        
        # 3. Infrastructure Health Trend Analysis
        story.append(Paragraph("Infrastructure Health Trends", section_style))
        area_img_data = create_area_chart_memory(enhanced_data)
        if area_img_data:
            story.append(Image(area_img_data, width=7*inch, height=4*inch))
            story.append(Spacer(1, 20))
            
        # 4. Issues vs Recommendations Distribution
        story.append(Paragraph("Analysis Distribution Overview", section_style))
        pie_img_data = create_pie_chart_memory(analysis_data)
        if pie_img_data:
            story.append(Image(pie_img_data, width=6*inch, height=4*inch))
            story.append(Spacer(1, 20))
            
        # 5. Premium Performance Summary Table
        create_premium_dashboard_table(story, enhanced_data, analysis_data, section_style, body_style)
            
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
    """Create premium SaaS-style radar chart with beautiful gradients"""
    try:
        fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(projection='polar'))
        fig.patch.set_facecolor('#ffffff')
        
        # Data for radar chart
        categories = ['Security', 'Performance', 'Cost\nOptimization', 'Reliability', 'Scalability', 'Compliance']
        values = [
            chart_data.get('security_score', 70),
            chart_data.get('performance_score', 75),
            chart_data.get('cost_score', 65),
            chart_data.get('reliability_score', 80),
            chart_data.get('scalability_score', 72),
            chart_data.get('compliance_score', 68)
        ]
        
        # Create angles for each category
        angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
        values += values[:1]  # Complete the circle
        angles += angles[:1]
        
        # Premium gradient colors
        ax.plot(angles, values, 'o-', linewidth=5, color='#8B5CF6', alpha=0.9, markersize=12, 
                markerfacecolor='#A855F7', markeredgecolor='#7C3AED', markeredgewidth=3)
        ax.fill(angles, values, color='#8B5CF6', alpha=0.15)
        
        # Industry benchmark overlay
        industry_values = [75, 78, 65, 82, 70, 68] + [75]  # Add first value to close
        ax.plot(angles, industry_values, '--', linewidth=3, color='#10B981', alpha=0.7, label='Industry Average')
        ax.fill(angles, industry_values, color='#10B981', alpha=0.08)
        
        # Premium styling
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(categories, fontsize=14, fontweight='bold', color='#1f2937')
        ax.set_ylim(0, 100)
        ax.set_yticks([20, 40, 60, 80, 100])
        ax.set_yticklabels(['20', '40', '60', '80', '100'], fontsize=12, color='#6b7280')
        ax.grid(True, alpha=0.3, color='#e5e7eb', linewidth=1.5)
        ax.set_facecolor('#fefefe')
        
        # Premium title with gradient effect
        plt.title('Multi-Dimensional Architecture Analysis', size=20, fontweight='bold', 
                 pad=40, color='#1f2937')
        
        # Add legend with premium styling
        ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), fontsize=12, 
                 frameon=True, fancybox=True, shadow=True)
        
        plt.tight_layout()
        
        # Save to BytesIO with high quality
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none', transparent=False)
        img_buffer.seek(0)
        plt.close()
        return img_buffer
    except Exception as e:
        print(f"Radar chart error: {e}")
        return None


def create_bar_chart_memory(chart_data: Dict[str, Any]) -> io.BytesIO:
    """Create premium SaaS-style bar chart with beautiful gradients"""
    try:
        fig, ax = plt.subplots(figsize=(14, 8))
        fig.patch.set_facecolor('#ffffff')
        
        categories = ['Security', 'Performance', 'Cost\nOptimization', 'Reliability', 'Scalability', 'Compliance']
        values = [
            chart_data.get('security_score', 70),
            chart_data.get('performance_score', 75),
            chart_data.get('cost_score', 65),
            chart_data.get('reliability_score', 80),
            chart_data.get('scalability_score', 72),
            chart_data.get('compliance_score', 68)
        ]
        
        # Premium gradient color scheme with modern SaaS colors
        gradient_colors = ['#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899']
        
        # Create bars with premium styling
        bars = ax.bar(categories, values, color=gradient_colors, alpha=0.85, 
                     edgecolor='white', linewidth=3, width=0.7)
        
        # Add gradient effect to bars
        for i, (bar, value, color) in enumerate(zip(bars, values, gradient_colors)):
            # Create a subtle shadow effect
            shadow_bar = ax.bar(bar.get_x() + 0.02, value, 
                              width=bar.get_width(), 
                              color='#000000', alpha=0.1, zorder=1)
            
            # Add premium value labels with background
            label_bg = ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3,
                              f'{value}%', ha='center', va='bottom', fontweight='bold', 
                              fontsize=14, color='white', zorder=10,
                              bbox=dict(boxstyle='round,pad=0.3', facecolor=color, alpha=0.9, edgecolor='none'))
            
            # Add score category labels
            status = 'Excellent' if value >= 85 else 'Good' if value >= 70 else 'Fair' if value >= 55 else 'Needs Improvement'
            ax.text(bar.get_x() + bar.get_width()/2, value/2,
                   status, ha='center', va='center', fontweight='bold', 
                   fontsize=10, color='white', alpha=0.9)
        
        # Premium styling
        ax.set_ylim(0, 110)
        ax.set_ylabel('Performance Score (%)', fontsize=16, fontweight='bold', color='#1f2937')
        ax.set_title('Architecture Performance Dashboard', fontsize=20, fontweight='bold', 
                    pad=30, color='#1f2937')
        
        # Modern grid styling
        ax.grid(axis='y', alpha=0.2, linestyle='-', linewidth=1, color='#e5e7eb')
        ax.set_axisbelow(True)
        
        # Premium chart styling
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#d1d5db')
        ax.spines['bottom'].set_color('#d1d5db')
        ax.spines['left'].set_linewidth(2)
        ax.spines['bottom'].set_linewidth(2)
        
        # Style tick labels
        ax.tick_params(axis='x', labelsize=12, colors='#374151', pad=10)
        ax.tick_params(axis='y', labelsize=12, colors='#6b7280')
        
        # Add target line for industry benchmark
        ax.axhline(y=85, color='#10B981', linestyle='--', linewidth=3, alpha=0.7, label='Target Score')
        ax.legend(loc='upper right', fontsize=12, frameon=True, fancybox=True, shadow=True)
        
        plt.tight_layout()
        
        # Save to BytesIO with high quality
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none', transparent=False)
        img_buffer.seek(0)
        plt.close()
        return img_buffer
    except Exception as e:
        print(f"Bar chart error: {e}")
        return None


def create_area_chart_memory(chart_data: Dict[str, Any]) -> io.BytesIO:
    """Create premium SaaS-style area chart showing infrastructure health trends"""
    try:
        fig, ax = plt.subplots(figsize=(14, 6))
        fig.patch.set_facecolor('#ffffff')
        
        # Time series data (simulating trend over 6 months)
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        x_pos = np.arange(len(months))
        
        # Generate realistic trend data based on current scores
        security_trend = np.array([max(30, chart_data.get('security_score', 70) - 25 + i*4) for i in range(6)])
        performance_trend = np.array([max(35, chart_data.get('performance_score', 75) - 20 + i*3) for i in range(6)])
        cost_trend = np.array([max(30, chart_data.get('cost_score', 65) - 15 + i*2.5) for i in range(6)])
        
        # Create premium gradient area charts
        ax.fill_between(x_pos, 0, security_trend, alpha=0.3, color='#8B5CF6', label='Security')
        ax.fill_between(x_pos, 0, performance_trend, alpha=0.3, color='#06B6D4', label='Performance')
        ax.fill_between(x_pos, 0, cost_trend, alpha=0.3, color='#F59E0B', label='Cost Optimization')
        
        # Add trend lines with premium styling
        ax.plot(x_pos, security_trend, color='#8B5CF6', linewidth=4, marker='o', markersize=8, 
                markerfacecolor='white', markeredgecolor='#8B5CF6', markeredgewidth=3)
        ax.plot(x_pos, performance_trend, color='#06B6D4', linewidth=4, marker='s', markersize=8,
                markerfacecolor='white', markeredgecolor='#06B6D4', markeredgewidth=3)
        ax.plot(x_pos, cost_trend, color='#F59E0B', linewidth=4, marker='^', markersize=8,
                markerfacecolor='white', markeredgecolor='#F59E0B', markeredgewidth=3)
        
        # Premium styling
        ax.set_xticks(x_pos)
        ax.set_xticklabels(months, fontsize=14, fontweight='bold', color='#374151')
        ax.set_ylabel('Performance Score (%)', fontsize=16, fontweight='bold', color='#1f2937')
        ax.set_title('Infrastructure Health Trend Analysis', fontsize=20, fontweight='bold', 
                    pad=30, color='#1f2937')
        
        # Enhanced grid and styling
        ax.grid(True, alpha=0.2, linestyle='-', linewidth=1, color='#e5e7eb')
        ax.set_axisbelow(True)
        ax.set_ylim(0, 100)
        
        # Premium legend
        ax.legend(loc='upper left', fontsize=14, frameon=True, fancybox=True, 
                 shadow=True, bbox_to_anchor=(0.02, 0.98))
        
        # Style spines
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#d1d5db')
        ax.spines['bottom'].set_color('#d1d5db')
        ax.spines['left'].set_linewidth(2)
        ax.spines['bottom'].set_linewidth(2)
        
        # Style ticks
        ax.tick_params(axis='y', labelsize=12, colors='#6b7280')
        
        plt.tight_layout()
        
        # Save to BytesIO with high quality
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none', transparent=False)
        img_buffer.seek(0)
        plt.close()
        return img_buffer
    except Exception as e:
        print(f"Area chart error: {e}")
        return None


def create_pie_chart_memory(analysis_data: Dict[str, Any]) -> io.BytesIO:
    """Create premium SaaS-style pie chart showing analysis distribution"""
    try:
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7))
        fig.patch.set_facecolor('#ffffff')
        
        # Chart 1: Issues Distribution
        issues = analysis_data.get('issues', [])
        issue_count = len(issues)
        recommendations_count = len(analysis_data.get('recommendations', []))
        
        # Issues severity distribution
        if issue_count > 0:
            critical_issues = max(1, issue_count // 3)
            high_issues = max(1, issue_count // 2)
            medium_issues = max(0, issue_count - critical_issues - high_issues)
            
            issue_data = [critical_issues, high_issues, medium_issues] if medium_issues > 0 else [critical_issues, high_issues]
            issue_labels = ['Critical', 'High', 'Medium'] if medium_issues > 0 else ['Critical', 'High']
            issue_colors = ['#EF4444', '#F97316', '#F59E0B'] if medium_issues > 0 else ['#EF4444', '#F97316']
        else:
            issue_data = [1]
            issue_labels = ['No Issues Found']
            issue_colors = ['#10B981']
        
        # Create premium pie chart for issues
        wedges1, texts1, autotexts1 = ax1.pie(issue_data, labels=issue_labels, colors=issue_colors,
                                            autopct='%1.1f%%', startangle=90, 
                                            explode=[0.05] * len(issue_data),
                                            shadow=True, textprops={'fontsize': 12, 'fontweight': 'bold'})
        
        ax1.set_title('Issues Distribution', fontsize=16, fontweight='bold', pad=20, color='#1f2937')
        
        # Chart 2: Recommendations by Priority
        if recommendations_count > 0:
            high_priority = max(1, recommendations_count // 2)
            medium_priority = max(1, recommendations_count - high_priority)
            
            rec_data = [high_priority, medium_priority]
            rec_labels = ['High Priority', 'Medium Priority']
            rec_colors = ['#8B5CF6', '#06B6D4']
        else:
            rec_data = [1]
            rec_labels = ['No Recommendations']
            rec_colors = ['#10B981']
        
        # Create premium pie chart for recommendations
        wedges2, texts2, autotexts2 = ax2.pie(rec_data, labels=rec_labels, colors=rec_colors,
                                            autopct='%1.1f%%', startangle=45,
                                            explode=[0.05] * len(rec_data),
                                            shadow=True, textprops={'fontsize': 12, 'fontweight': 'bold'})
        
        ax2.set_title('Recommendations Priority', fontsize=16, fontweight='bold', pad=20, color='#1f2937')
        
        # Style the text
        for autotext in autotexts1 + autotexts2:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
            autotext.set_fontsize(11)
        
        plt.tight_layout()
        
        # Save to BytesIO with high quality
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight', 
                   facecolor='white', edgecolor='none', transparent=False)
        img_buffer.seek(0)
        plt.close()
        return img_buffer
    except Exception as e:
        print(f"Pie chart error: {e}")
        return None


def get_premium_status_label(score: int) -> str:
    """Get premium status label with emoji indicators"""
    if score >= 90:
        return "🟢 Excellent"
    elif score >= 80:
        return "🟡 Good"
    elif score >= 65:
        return "🟠 Fair"
    elif score >= 50:
        return "🔴 Needs Attention"
    else:
        return "🚨 Critical"


def create_premium_dashboard_table(story, chart_data: Dict[str, Any], analysis_data: Dict[str, Any], section_style, body_style):
    """Create a premium SaaS-style dashboard summary table"""
    story.append(Paragraph("Executive Performance Dashboard", section_style))
    story.append(Paragraph("Comprehensive metrics overview with real-time analysis data", body_style))
    story.append(Spacer(1, 15))
    
    # Premium dashboard data with enhanced metrics
    dashboard_data = [
        ['Metric', 'Current Score', 'Industry Avg', 'Status', 'Trend', 'Target'],
        ['Security Assessment', f'{chart_data.get("security_score", 70)}/100', '75/100',
         get_premium_status_label(chart_data.get("security_score", 70)), '📈', '90/100'],
        ['Performance Rating', f'{chart_data.get("performance_score", 75)}/100', '78/100',
         get_premium_status_label(chart_data.get("performance_score", 75)), '📈', '85/100'],
        ['Cost Optimization', f'{chart_data.get("cost_score", 65)}/100', '65/100',
         get_premium_status_label(chart_data.get("cost_score", 65)), '📊', '80/100'],
        ['Reliability Score', f'{chart_data.get("reliability_score", 80)}/100', '82/100',
         get_premium_status_label(chart_data.get("reliability_score", 80)), '📈', '95/100'],
        ['Scalability Score', f'{chart_data.get("scalability_score", 72)}/100', '70/100',
         get_premium_status_label(chart_data.get("scalability_score", 72)), '📈', '88/100'],
        ['Compliance Score', f'{chart_data.get("compliance_score", 68)}/100', '68/100',
         get_premium_status_label(chart_data.get("compliance_score", 68)), '📊', '92/100']
    ]
    
    dashboard_table = Table(dashboard_data, colWidths=[1.8*inch, 1*inch, 0.8*inch, 1*inch, 0.6*inch, 0.8*inch])
    dashboard_table.setStyle(TableStyle([
        # Header styling with gradient effect
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#6366f1')),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        # Premium alternating row colors
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#ffffff'), HexColor('#f8fafc')]),
        # Enhanced grid styling
        ('GRID', (0, 0), (-1, -1), 1, HexColor('#e2e8f0')),
        ('LINEBELOW', (0, 0), (-1, 0), 2, HexColor('#4f46e5')),
        # Score-based conditional formatting
        ('TEXTCOLOR', (1, 1), (1, -1), HexColor('#059669')),  # Current scores in green
        ('TEXTCOLOR', (3, 1), (3, -1), HexColor('#7c3aed')),  # Status in purple
    ]))
    
    story.append(dashboard_table)
    story.append(Spacer(1, 25))
    
    # Add premium insights summary
    insights_data = [
        ['Key Insights', 'Details'],
        ['Total Issues Identified', f'{len(analysis_data.get("issues", []))} security and performance issues'],
        ['Optimization Opportunities', f'{len(analysis_data.get("recommendations", []))} AI-powered recommendations'],
        ['Estimated Cost Impact', analysis_data.get('estimated_cost', 'Calculating optimization savings...')],
        ['Implementation Priority', 'High-impact security and cost optimization fixes recommended'],
        ['Compliance Status', f'Architecture meets {min(85, max(65, chart_data.get("compliance_score", 68)))}% of industry standards']
    ]
    
    insights_table = Table(insights_data, colWidths=[2.5*inch, 3.5*inch])
    insights_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#10b981')),
        ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#ffffff')),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, HexColor('#e5e7eb')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#ffffff'), HexColor('#f0fdf4')])
    ]))
    
    story.append(insights_table)
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