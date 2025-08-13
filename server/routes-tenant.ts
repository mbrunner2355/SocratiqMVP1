import type { Express } from 'express';
import { getTenantConfig, isFeatureEnabled } from './middleware/tenant';
import { isAuthenticated } from './replitAuth';

export function registerTenantRoutes(app: Express): void {
  
  // Get tenant configuration
  app.get('/api/tenant/config', (req, res) => {
    try {
      const tenant = getTenantConfig(req);
      
      // Return tenant config without sensitive information
      const publicConfig = {
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName,
        brandName: tenant.brandName,
        logo: tenant.logo,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        features: tenant.features,
        customization: tenant.customization,
        limits: {
          maxUsers: tenant.limits.maxUsers,
          maxProjects: tenant.limits.maxProjects,
          maxDocuments: tenant.limits.maxDocuments,
        }
      };
      
      res.json(publicConfig);
    } catch (error) {
      console.error('Error getting tenant config:', error);
      res.status(500).json({ error: 'Failed to get tenant configuration' });
    }
  });
  
  // Get tenant-specific features
  app.get('/api/tenant/features', (req, res) => {
    try {
      const tenant = getTenantConfig(req);
      res.json({ features: tenant.features });
    } catch (error) {
      console.error('Error getting tenant features:', error);
      res.status(500).json({ error: 'Failed to get tenant features' });
    }
  });
  
  // Check if specific feature is enabled
  app.get('/api/tenant/features/:feature', (req, res) => {
    try {
      const tenant = getTenantConfig(req);
      const { feature } = req.params;
      const enabled = isFeatureEnabled(tenant, feature);
      
      res.json({ feature, enabled });
    } catch (error) {
      console.error('Error checking feature:', error);
      res.status(500).json({ error: 'Failed to check feature' });
    }
  });
  
  // Get tenant usage statistics (requires authentication)
  app.get('/api/tenant/usage', isAuthenticated, async (req, res) => {
    try {
      const tenant = getTenantConfig(req);
      
      // Mock usage data - would come from database in real implementation
      const usage = {
        users: {
          current: 15,
          limit: tenant.limits.maxUsers,
          percentage: (15 / tenant.limits.maxUsers) * 100
        },
        projects: {
          current: 42,
          limit: tenant.limits.maxProjects,
          percentage: (42 / tenant.limits.maxProjects) * 100
        },
        documents: {
          current: 1250,
          limit: tenant.limits.maxDocuments,
          percentage: (1250 / tenant.limits.maxDocuments) * 100
        },
        storage: {
          currentGB: 125,
          limitGB: tenant.limits.storageGB,
          percentage: (125 / tenant.limits.storageGB) * 100
        }
      };
      
      res.json(usage);
    } catch (error) {
      console.error('Error getting tenant usage:', error);
      res.status(500).json({ error: 'Failed to get tenant usage' });
    }
  });
  
  // Get tenant-specific analytics
  app.get('/api/tenant/analytics', isAuthenticated, async (req, res) => {
    try {
      const tenant = getTenantConfig(req);
      
      // Check if analytics feature is enabled
      if (!isFeatureEnabled(tenant, 'partnership_analytics')) {
        return res.status(403).json({ 
          error: 'Analytics feature not enabled for this tenant' 
        });
      }
      
      // Mock analytics data - would come from database in real implementation
      const analytics = {
        overview: {
          totalProjects: 42,
          activeProjects: 28,
          completedProjects: 14,
          totalUsers: 15,
          avgProjectDuration: 120, // days
          successRate: 94.2 // percentage
        },
        trends: {
          projectsLastMonth: 8,
          projectsThisMonth: 12,
          growthRate: 50, // percentage
          userEngagement: 87.5 // percentage
        },
        topPerformers: [
          { metric: 'Most Active User', value: 'Sarah Johnson', count: 12 },
          { metric: 'Most Projects', value: 'Marketing Team', count: 18 },
          { metric: 'Fastest Completion', value: 'Project Alpha', days: 45 }
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Error getting tenant analytics:', error);
      res.status(500).json({ error: 'Failed to get tenant analytics' });
    }
  });
  
  // Health check endpoint for tenant
  app.get('/api/tenant/health', (req, res) => {
    try {
      const tenant = getTenantConfig(req);
      
      res.json({
        status: 'healthy',
        tenantId: tenant.tenantId,
        tenantName: tenant.tenantName,
        timestamp: new Date().toISOString(),
        features: tenant.features.length,
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Error in tenant health check:', error);
      res.status(500).json({ 
        status: 'unhealthy', 
        error: 'Tenant configuration error' 
      });
    }
  });
}