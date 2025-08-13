import { Request, Response, NextFunction } from 'express';
import { USER_ROLES, ROLE_PERMISSIONS } from '@shared/schema';
import type { UserRole } from '@shared/schema';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        claims: {
          sub: string;
          email: string;
          first_name?: string;
          last_name?: string;
          profile_image_url?: string;
        };
        role?: UserRole;
        permissions?: string[];
      };
    }
  }
}

export function requireRole(requiredRole: UserRole | UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userRole = req.user.role;
      if (!userRole) {
        return res.status(403).json({ error: 'No role assigned' });
      }

      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // Super admin can access everything
      if (userRole === USER_ROLES.SUPER_ADMIN) {
        return next();
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: allowedRoles,
          current: userRole
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}

export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userRole = req.user.role;
      if (!userRole) {
        return res.status(403).json({ error: 'No role assigned' });
      }

      // Super admin has all permissions
      if (userRole === USER_ROLES.SUPER_ADMIN) {
        return next();
      }

      // Check role-based permissions
      const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
      if (!rolePermissions.includes(permission)) {
        return res.status(403).json({ 
          error: 'Permission denied',
          required: permission,
          available: rolePermissions
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
}

export function getUserRole(userId: string): Promise<UserRole | null> {
  // This will be implemented to fetch from database
  // For now, return null to be implemented by storage layer
  return Promise.resolve(null);
}

// Role hierarchy helper
export function hasHigherRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = [
    USER_ROLES.VIEWER,
    USER_ROLES.ANALYST, 
    USER_ROLES.PARTNER_ADMIN,
    USER_ROLES.PLATFORM_ADMIN,
    USER_ROLES.SUPER_ADMIN
  ];

  const userIndex = roleHierarchy.indexOf(userRole);
  const requiredIndex = roleHierarchy.indexOf(requiredRole);

  return userIndex >= requiredIndex;
}