import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly bcryptRounds: number;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');

    if (!process.env.JWT_SECRET) {
      logger.warn('JWT_SECRET not set in environment variables. Using fallback secret.');
    }
  }

  // Generate JWT token
  generateToken(user: { id: string; email: string; role: string; permissions: string[] }): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'stackstage-api',
      audience: 'stackstage-clients'
    });
  }

  // Verify JWT token
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'stackstage-api',
        audience: 'stackstage-clients'
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid token');
      } else {
        logger.error('Token verification error:', error);
      }
      return null;
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptRounds);
  }

  // Verify password
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate refresh token
  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  // Verify refresh token
  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      if (decoded.type === 'refresh') {
        return { userId: decoded.userId };
      }
      return null;
    } catch (error) {
      logger.error('Refresh token verification error:', error);
      return null;
    }
  }
}

// Roles and permissions configuration
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  ANALYST: 'analyst',
  VIEWER: 'viewer'
} as const;

const PERMISSIONS = {
  // Analysis permissions
  CREATE_ANALYSIS: 'create:analysis',
  READ_ANALYSIS: 'read:analysis',
  UPDATE_ANALYSIS: 'update:analysis',
  DELETE_ANALYSIS: 'delete:analysis',
  
  // Cloud permissions
  CONNECT_CLOUD: 'connect:cloud',
  READ_CLOUD_STATUS: 'read:cloud_status',
  
  // AI permissions
  USE_AI_ASSISTANT: 'use:ai_assistant',
  GENERATE_DIAGRAMS: 'generate:diagrams',
  
  // Admin permissions
  MANAGE_USERS: 'manage:users',
  VIEW_SYSTEM_METRICS: 'view:system_metrics',
  MANAGE_SYSTEM: 'manage:system'
} as const;

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ANALYST]: [
    PERMISSIONS.CREATE_ANALYSIS,
    PERMISSIONS.READ_ANALYSIS,
    PERMISSIONS.UPDATE_ANALYSIS,
    PERMISSIONS.CONNECT_CLOUD,
    PERMISSIONS.READ_CLOUD_STATUS,
    PERMISSIONS.USE_AI_ASSISTANT,
    PERMISSIONS.GENERATE_DIAGRAMS,
    PERMISSIONS.VIEW_SYSTEM_METRICS
  ],
  [ROLES.USER]: [
    PERMISSIONS.CREATE_ANALYSIS,
    PERMISSIONS.READ_ANALYSIS,
    PERMISSIONS.READ_CLOUD_STATUS,
    PERMISSIONS.USE_AI_ASSISTANT,
    PERMISSIONS.GENERATE_DIAGRAMS
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.READ_ANALYSIS,
    PERMISSIONS.READ_CLOUD_STATUS
  ]
};

const authService = new AuthService();

// Authentication middleware
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please provide a valid access token'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const payload = authService.verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      error: 'Invalid or expired token',
      message: 'Please login again'
    });
  }

  // Add user info to request
  req.user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
    permissions: payload.permissions
  };

  next();
};

// Optional authentication (for public endpoints that can benefit from user context)
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);
    
    if (payload) {
      req.user = {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions
      };
    }
  }

  next();
};

// Permission-based authorization middleware
export const authorize = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }

    if (!req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Required permission: ${requiredPermission}`,
        userPermissions: req.user.permissions
      });
    }

    next();
  };
};

// Role-based authorization middleware
export const requireRole = (requiredRole: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient role',
        message: `Required role: ${roles.join(' or ')}`,
        userRole: req.user.role
      });
    }

    next();
  };
};

// API key authentication for external integrations
export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'Please provide a valid API key in the X-API-Key header'
    });
  }

  // In production, validate against database
  const validApiKeys = (process.env.VALID_API_KEYS || '').split(',');
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      error: 'Invalid API key'
    });
  }

  next();
};

// Helper function to get user permissions for a role
export const getRolePermissions = (role: string): string[] => {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
};

// Helper function to create user with role
export const createUserWithRole = (userBase: { id: string; email: string }, role: string) => {
  return {
    ...userBase,
    role,
    permissions: getRolePermissions(role)
  };
};

// Export auth service and constants
export { 
  authService, 
  AuthenticatedRequest, 
  ROLES, 
  PERMISSIONS,
  ROLE_PERMISSIONS 
};