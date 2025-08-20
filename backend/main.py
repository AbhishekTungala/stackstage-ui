from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, assistant, diagram, export, chat_export, auth, cloud_connect, control_center
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="StackStage API", 
    version="1.0",
    description="Production-grade FastAPI backend for StackStage cloud architecture analysis platform"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Assistant"])
app.include_router(diagram.router, prefix="/api/diagram", tags=["Diagram"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])
app.include_router(chat_export.router, prefix="/api/chat/export", tags=["ChatExport"])
app.include_router(cloud_connect.router, prefix="/api/cloud", tags=["CloudConnect"])
app.include_router(control_center.router, prefix="/api/control", tags=["ControlCenter"])

@app.get("/")
def root():
    return {"message": "StackStage API is running!", "status": "operational"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0"}