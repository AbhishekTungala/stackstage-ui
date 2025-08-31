import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

const router = Router();

// JWT secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Middleware to verify JWT token
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization token required'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

// Setup authentication middleware
export function setupAuth(app: any) {
  // For now, we'll use a simple demo approach
  // In production, this would integrate with Replit Auth
  logger.info('Setting up authentication...');
}

// GET /api/auth/user - Get current user profile
router.get('/user', (req, res) => {
  try {
    // Return demo user for development
    const demoUser = {
      id: "demo_user_123",
      email: "demo@stackstage.dev",
      firstName: "Alex",
      lastName: "Developer",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      phoneNumber: "+1 (555) 123-4567",
      isEmailVerified: true,
      isPhoneVerified: false,
      bio: "Senior Cloud Architect passionate about scalable infrastructure",
      jobTitle: "Senior Cloud Architect",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date(),
    };
    
    res.json({
      success: true,
      data: demoUser
    });
  } catch (error) {
    logger.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user"
    });
  }
});

// POST /api/auth/login - Login user (demo implementation)
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo login - in production, verify credentials
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: 'demo_user_123',
        email: email,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: 'demo_user_123',
          email: email,
          firstName: 'Alex',
          lastName: 'Developer'
        }
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  // In a real implementation, you might blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export { router as authRouter };