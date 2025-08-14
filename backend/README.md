# StackStage FastAPI Backend

## Overview
This is the FastAPI backend for StackStage that replaces mock data with real AI-powered analysis using OpenAI GPT-4.

## Features
- **Architecture Analysis**: Real-time cloud architecture analysis with security, performance, and cost insights
- **AI Assistant**: Interactive chat assistant for cloud architecture guidance
- **Diagram Generation**: Mermaid diagram generation for various architecture patterns
- **OpenAI Integration**: Uses GPT-4 for intelligent responses and analysis

## Project Structure
```
backend/
├── main.py                 # FastAPI app entry point
├── start_backend.py        # Server startup script
├── routers/
│   ├── analyze.py         # Architecture analysis endpoints
│   ├── assistant.py       # AI chat assistant endpoints
│   └── diagram.py         # Diagram generation endpoints
├── models/
│   └── schemas.py         # Pydantic data models
└── utils/
    └── ai_engine.py       # OpenAI integration and AI logic
```

## API Endpoints

### Analysis
- `POST /api/analyze/` - Analyze cloud architecture
- `GET /api/analyze/health` - Health check

### Assistant
- `POST /api/assistant/` - Chat with AI assistant
- `GET /api/assistant/health` - Health check

### Diagrams
- `POST /api/diagram/` - Generate architecture diagram
- `GET /api/diagram/templates` - Get available diagram templates
- `GET /api/diagram/health` - Health check

## Setup and Configuration

### 1. Environment Variables
Set your OpenAI API key:
```bash
export OPENAI_API_KEY="your-openai-api-key"
```

### 2. Start the Backend
```bash
cd backend
python start_backend.py
```

The API will be available at `http://localhost:8000`

### 3. API Documentation
- Interactive docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Integration with Frontend

The FastAPI backend is configured with CORS to work alongside the existing React frontend running on port 5000. The frontend can make requests to:
- Analysis: `http://localhost:8000/api/analyze`
- Assistant: `http://localhost:8000/api/assistant`
- Diagrams: `http://localhost:8000/api/diagram`

## Authentication

Currently uses OpenAI API key authentication. Future versions will integrate with the existing Replit authentication system.

## Development

The backend supports hot reload during development. Any changes to Python files will automatically restart the server.