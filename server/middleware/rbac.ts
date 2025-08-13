// Role-Based Access Control middleware
import { RequestHandler } from 'express';
import { USER_ROLES, UserRole } from '@shared/schema';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role: UserRole;
    tenantId?: string;
    partnerId?: string;
    claims: any;
  };
}

// Check if user has required role
export const requireRole = (allowedRoles: UserRole[]): RequestHandler => {
  return async (req: any, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Forbidden: Insufficient privileges",
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

// Check if user can access tenant data
export const requireTenantAccess = (tenantIdParam?: string): RequestHandler => {
  return async (req: any, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const targetTenantId = tenantIdParam || req.params.tenantId;

    // Admin can access everything
    if (user.role === USER_ROLES.ADMIN) {
      return next();
    }

    // Partner can access their own tenant and their customers
    if (user.role === USER_ROLES.PARTNER) {
      if (user.tenantId === targetTenantId) {
        return next();
      }
    }

    // Partner customers can only access their own tenant
    if (user.role === USER_ROLES.PARTNER_CUSTOMER) {
      if (user.tenantId === targetTenantId) {
        return next();
      }
    }

    // Direct customers have no tenant access
    if (user.role === USER_ROLES.CUSTOMER) {
      return res.status(403).json({ message: "Access denied to tenant data" });
    }

    return res.status(403).json({ message: "Access denied" });
  };
};

// Admin only access
export const requireAdmin = requireRole([USER_ROLES.ADMIN]);

// Partner or admin access
export const requirePartnerOrAdmin = requireRole([USER_ROLES.PARTNER, USER_ROLES.ADMIN]);

// Any authenticated user
export const requireAuth: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};