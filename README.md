# StackStage Backend - Complete Implementation

## Overview

StackStage is a comprehensive cloud architecture analysis platform with a dual-backend architecture:

- **Primary Backend**: Node.js + Express + TypeScript (API orchestration, authentication, session management)
- **Secondary AI Backend**: Python + FastAPI (Deep AI processing, infrastructure analysis, diagram generation)

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Frontend      │    │  Node.js Backend │    │  Python AI Backend │
│   React + TS    │◄──►│  Express + TS    │◄──►│   FastAPI + Python  │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │                           │
                              ▼                           ▼
                       ┌─────────────────┐        ┌─────────────────┐
                       │   PostgreSQL    │        │  OpenRouter API │
                       │   Database      │        │  (OpenAI GPT-4) │
                       └─────────────────┘        └─────────────────┘
```

## Features Implemented

### 🔥 Core API Endpoints

#### Analysis Engine
- `POST /api/analyze` - Comprehensive infrastructure analysis
- `POST /api/assistant` - AI-powered conversational assistance
- `POST /api/compare` - Architecture comparison

#### Visualization
- `POST /api/diagram` - Generate Mermaid diagrams
- `POST /api/diagram/export` - Export diagrams to SVG/PNG
- `GET /api/diagram/templates` - Get diagram templates

#### Cloud Integration
- `GET /api/cloud/aws/status` - AWS resources status
- `GET /api/cloud/azure/status` - Azure resources status 
- `GET /api/cloud/gcp/status` - GCP resources status
- `POST /api/cloud/connect` - Connect cloud providers

#### Reports & Export
- `POST /api/export/pdf` - Generate PDF reports
- `POST /api/export/markdown` - Generate Markdown reports
- `POST /api/export/email` - Email reports
- `POST /api/export/slack` - Send to Slack

#### Geo-Location
- `GET /api/location` - Get user location and regional recommendations
- `POST /api/location/optimize` - Region optimization suggestions

### 🎯 AI-Powered Features

- **Multi-dimensional Scoring**: Security, Reliability, Scalability, Performance, Cost
- **Role-based AI Personas**: CTO, DevOps Engineer, Cloud Architect, Security Expert
- **Real-time Analysis**: Streaming analysis progress
- **Intelligent Recommendations**: Context-aware suggestions

### 🗄️ Database Schema

Complete PostgreSQL schema with Drizzle ORM:
- **Users**: Authentication and profile management
- **Analyses**: Infrastructure analysis results
- **Diagrams**: Generated architecture diagrams
- **Conversations**: AI assistant chat history
- **Reports**: Generated PDF/Markdown reports
- **Cloud Connections**: Cloud provider integrations

### 🔧 Services Architecture

#### Node.js Services
- **AI Service**: OpenRouter integration, analysis orchestration
- **Diagram Service**: Mermaid.js generation, template management
- **Cloud Service**: Multi-cloud provider status and integration
- **Report Service**: PDF/Markdown generation, delivery
- **Geo Service**: IP geolocation, region optimization

#### Python AI Services
- **Analysis Engine**: Deep architecture analysis, AI processing
- **Diagram Engine**: Smart diagram generation from content
- **Scoring Engine**: Multi-dimensional architecture scoring

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Add your API keys
OPENROUTER_API_KEY=your_key_here
DATABASE_URL=your_postgres_url
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (if using AI backend)
cd backend/fastapi
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# Push database schema
npm run db:push
```

### 4. Start Development Server

```bash
# Start full-stack application
npm run dev
```

The application will be available at `http://localhost:5000`

## API Documentation

### Analysis Request Example

```javascript
POST /api/analyze
{
  "content": "AWS VPC with EC2 instances behind ALB connecting to RDS MySQL",
  "analysisMode": "comprehensive",
  "cloudProvider": "aws",
  "userRegion": "us-east-1"
}
```

### Analysis Response Example

```javascript
{
  "success": true,
  "data": {
    "id": "analysis_1234567890",
    "score": 78,
    "categories": {
      "security": 72,
      "reliability": 80,
      "scalability": 85,
      "performance": 75,
      "cost": 70
    },
    "verdict": "Good architecture with some improvements recommended",
    "issues": [
      "No multi-AZ configuration detected",
      "Missing monitoring and alerting setup"
    ],
    "recommendations": [
      "Implement multi-AZ deployment for high availability",
      "Add comprehensive monitoring and alerting"
    ]
  }
}
```

### Assistant Request Example

```javascript
POST /api/assistant
{
  "message": "How can I improve the security of my AWS infrastructure?",
  "persona": "security",
  "context": "Current architecture has basic VPC setup"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter API key for AI analysis | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `AWS_ACCESS_KEY_ID` | AWS credentials (optional) | No |
| `AZURE_CLIENT_ID` | Azure credentials (optional) | No |
| `GCP_SERVICE_ACCOUNT_KEY` | GCP credentials (optional) | No |

## Technology Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **FastAPI** + **Python** for AI processing
- **PostgreSQL** with **Drizzle ORM**
- **OpenRouter API** (OpenAI GPT-4)

### Key Libraries
- **Zod** for validation
- **PDFKit** for report generation
- **Mermaid.js** for diagram generation
- **JWT** for authentication
- **Winston** for logging

## Production Deployment

The backend is designed for production deployment with:

- **Security**: JWT authentication, input validation, CORS configuration
- **Scalability**: Stateless design, database connection pooling
- **Monitoring**: Comprehensive logging, error handling
- **Performance**: Async/await, efficient database queries

## Future Enhancements

- WebSocket integration for real-time analysis streaming
- Advanced cloud provider integrations
- Custom diagram themes and templates
- Integration with CI/CD pipelines
- Advanced cost optimization algorithms

---

**Built for StackStage** - Professional Cloud Architecture Analysis Platform