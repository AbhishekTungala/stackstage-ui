# StackStage - Cloud Architecture Analysis Platform

## Overview
StackStage is a cloud architecture analysis platform designed to help users identify security vulnerabilities, optimize costs, and improve performance within their cloud infrastructure. It features a professional SaaS design with Aurora animated backgrounds and glass morphism effects. The platform aims to provide real-time analysis, intelligent AI assistance, and comprehensive reporting to cloud professionals and organizations.

## User Preferences
- Modern, professional design aesthetic
- Smooth, subtle animations (not harsh or intrusive)
- World-class UI patterns similar to Framer, Linear, or Apple

## System Architecture
**Frontend**: React with TypeScript, Vite, Tailwind CSS, utilizing `wouter` for routing. UI components are built with `shadcn/ui` and custom glass morphism styling. The design incorporates custom Aurora backgrounds with smooth gradient animations.
**Backend**: A FastAPI backend in Python handles core AI functionality, while an Express.js server serves the frontend. AI integration is powered by OpenAI GPT-4 (via OpenRouter for cost efficiency), providing real-time analysis and chat assistance.
**Storage**: In-memory storage is used for transient data.
**Core Features**:
- **Authentication**: User login and signup pages are implemented.
- **Pricing**: A professional SaaS pricing page with three tiers is included.
- **AI Assistant**: Features an enterprise chat interface with dynamic suggestion generation, contextual memory, and role-based AI system prompts (CTO, DevOps, Architect perspectives).
- **Architecture Analysis**: Offers enhanced workflow with real-time validation, results visualization using Mermaid diagrams (with SVG/PNG export), and comprehensive report generation (PDF export using ReportLab).
- **UI/UX**: Emphasizes a consistent $100M SaaS aesthetic with professional loading states, subtle animations, and refined UI elements.
- **Diagram Engine**: Dynamically renders Mermaid.js diagrams, supports pan and zoom, theme switching, and provides AI-powered insights and recommendations.

## External Dependencies
- **AI Services**: OpenAI GPT-4 (accessed via OpenRouter for API calls).
- **Database**: PostgreSQL (for user profile management and session storage).
- **Libraries/Tools**:
    - `wouter`: Routing library.
    - `shadcn/ui`: UI component library.
    - `html-to-image`: For exporting diagrams.
    - `react-zoom-pan-pinch`: For diagram interactions.
    - `ReportLab`: For PDF report generation.
    - `Mermaid.js`: For diagram rendering.