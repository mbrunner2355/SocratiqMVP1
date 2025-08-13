import type { Request, Response, NextFunction } from 'express';
import { getTenantByDomain, getTenantById, MOCK5_TENANT_CONFIG } from '@shared/tenant-config';
import type { TenantConfig } from '@shared/tenant-config';

// Extend Express Request to include tenant information
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantConfig;
      tenantId?: string;
    }
  }
}

/**
 * Middleware to identify and load tenant configuration based on domain
 * This enables white-label functionality for mock5's clients
 */
export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const host = req.get('host') || '';
  const domain = host.split(':')[0]; // Remove port if present
  
  // Try to identify tenant by domain
  let tenant = getTenantByDomain(domain);
  
  // Fallback to tenant ID from headers (for API calls)
  if (!tenant && req.headers['x-tenant-id']) {
    const tenantId = req.headers['x-tenant-id'] as string;
    tenant = getTenantById(tenantId);
  }
  
  // Fallback to tenant ID from query params (for development)
  if (!tenant && req.query.tenantId) {
    const tenantId = req.query.tenantId as string;
    tenant = getTenantById(tenantId);
  }
  
  // Default to mock5 tenant if no specific tenant found
  if (!tenant) {
    tenant = MOCK5_TENANT_CONFIG;
  }
  
  // Attach tenant info to request
  req.tenant = tenant;
  req.tenantId = tenant.tenantId;
  
  // Add tenant info to response headers for debugging
  res.set('X-Tenant-ID', tenant.tenantId);
  res.set('X-Tenant-Name', tenant.tenantName);
  
  next();
};

/**
 * Middleware to ensure user has access to the current tenant
 */
export const tenantAccessMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.tenant) {
    return res.status(400).json({ 
      error: 'Tenant not identified',
      message: 'Unable to determine tenant from request' 
    });
  }
  
  // TODO: Add user-tenant access validation here
  // For now, we allow access to all authenticated users
  
  next();
};

/**
 * Helper function to get tenant-specific database prefix
 */
export const getTenantPrefix = (tenantId: string): string => {
  return `tenant_${tenantId}_`;
};

/**
 * Helper function to check if feature is enabled for tenant
 */
export const isFeatureEnabled = (tenant: TenantConfig, feature: string): boolean => {
  return tenant.features.includes(feature);
};

/**
 * Helper function to get tenant-specific configuration
 */
export const getTenantConfig = (req: Request): TenantConfig => {
  if (!req.tenant) {
    throw new Error('Tenant not available in request');
  }
  return req.tenant;
};