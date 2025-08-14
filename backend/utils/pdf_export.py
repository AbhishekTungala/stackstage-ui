"""PDF Report Generation for StackStage Architecture Analysis"""

import io
import base64
from datetime import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.platypus.frames import Frame
from reportlab.platypus.doctemplate import PageTemplate
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY


def generate_analysis_pdf(analysis_data: Dict[str, Any]) -> bytes:
    """Generate PDF report from analysis data"""
    
    # Create a file-like buffer to receive PDF data
    buffer = io.BytesIO()
    
    # Create the PDF object, using the buffer as its "file"
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
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
    
    # Title
    story.append(Paragraph("StackStage Architecture Analysis Report", title_style))
    story.append(Spacer(1, 20))
    
    # Analysis Summary
    story.append(Paragraph("Executive Summary", section_style))
    
    # Score display
    score = analysis_data.get('score', 0)
    score_color = get_score_color(score)
    
    summary_data = [
        ['Overall Score', f'<font color="{score_color}"><b>{score}/100</b></font>'],
        ['Analysis Date', analysis_data.get('timestamp', datetime.now().isoformat())[:10]],
        ['Analysis ID', analysis_data.get('analysis_id', 'N/A')],
        ['Cost Estimate', analysis_data.get('estimated_cost', 'Not available')]
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
    
    # Issues Section
    issues = analysis_data.get('issues', [])
    if issues:
        story.append(Paragraph("Critical Issues Identified", section_style))
        for i, issue in enumerate(issues[:10], 1):  # Limit to 10 issues
            story.append(Paragraph(f"<b>{i}.</b> {issue}", body_style))
        story.append(Spacer(1, 15))
    
    # Recommendations Section
    recommendations = analysis_data.get('recommendations', [])
    if recommendations:
        story.append(Paragraph("Architecture Recommendations", section_style))
        for i, rec in enumerate(recommendations[:10], 1):  # Limit to 10 recommendations
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


def generate_pdf_base64(analysis_data: Dict[str, Any]) -> str:
    """Generate PDF and return as base64 string"""
    pdf_bytes = generate_analysis_pdf(analysis_data)
    return base64.b64encode(pdf_bytes).decode('utf-8')