// Multi-tenant configuration for white-label EMME solutions

export interface TenantConfig {
  tenantId: string;
  tenantName: string;
  brandName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  domain: string;
  features: string[];
  customization: {
    headerTitle: string;
    welcomeMessage: string;
    footerText: string;
    supportEmail: string;
    documentationUrl?: string;
  };
  limits: {
    maxUsers: number;
    maxProjects: number;
    maxDocuments: number;
    storageGB: number;
  };
  integrations: {
    sso?: {
      provider: string;
      config: Record<string, any>;
    };
    api?: {
      enabled: boolean;
      rateLimit: number;
    };
  };
}

// Default configuration for mock5 partners
export const MOCK5_TENANT_CONFIG: TenantConfig = {
  tenantId: "mock5",
  tenantName: "mock5 Strategic Intelligence",
  brandName: "Strategic Intelligence Platform",
  logo: "/assets/mock5-logo.png",
  primaryColor: "#2563eb", // Blue
  secondaryColor: "#1e40af", // Dark blue
  domain: "intelligence.mock5.com",
  features: [
    "project_management",
    "partnership_analytics", 
    "market_intelligence",
    "regulatory_insights",
    "competitive_analysis",
    "client_collaboration"
  ],
  customization: {
    headerTitle: "Strategic Intelligence Platform",
    welcomeMessage: "Welcome to your pharmaceutical intelligence hub",
    footerText: "Powered by mock5 Strategic Intelligence",
    supportEmail: "support@mock5.com",
    documentationUrl: "https://docs.mock5.com"
  },
  limits: {
    maxUsers: 100,
    maxProjects: 500,
    maxDocuments: 10000,
    storageGB: 1000
  },
  integrations: {
    sso: {
      provider: "azure_ad",
      config: {
        tenantId: "mock5-azure-tenant",
        clientId: "mock5-client-id"
      }
    },
    api: {
      enabled: true,
      rateLimit: 1000
    }
  }
};

// Configuration for mock5's pharmaceutical clients
export const createClientTenantConfig = (clientName: string, clientDomain: string): TenantConfig => ({
  tenantId: `mock5_${clientName.toLowerCase().replace(/\s+/g, '_')}`,
  tenantName: `${clientName} Intelligence Platform`,
  brandName: `${clientName} Strategic Intelligence`,
  logo: `/assets/clients/${clientName.toLowerCase()}-logo.png`,
  primaryColor: "#059669", // Emerald for client branding
  secondaryColor: "#047857", // Dark emerald
  domain: clientDomain,
  features: [
    "project_management",
    "document_intelligence",
    "regulatory_tracking",
    "market_analysis",
    "competitive_monitoring",
    "partnership_opportunities"
  ],
  customization: {
    headerTitle: `${clientName} Intelligence Hub`,
    welcomeMessage: `Welcome to ${clientName}'s pharmaceutical intelligence platform`,
    footerText: `© ${new Date().getFullYear()} ${clientName}. Powered by mock5 Intelligence`,
    supportEmail: `support@${clientDomain}`,
    documentationUrl: `https://docs.${clientDomain}`
  },
  limits: {
    maxUsers: 50,
    maxProjects: 200,
    maxDocuments: 5000,
    storageGB: 500
  },
  integrations: {
    sso: {
      provider: "saml",
      config: {
        entityId: `${clientDomain}-saml`,
        ssoUrl: `https://${clientDomain}/sso/saml`
      }
    },
    api: {
      enabled: true,
      rateLimit: 500
    }
  }
});

// Predefined client configurations for mock5's pharmaceutical partners
export const CLIENT_TENANT_CONFIGS: Record<string, TenantConfig> = {
  pharmax: createClientTenantConfig("PharmaX", "intelligence.pharmax.com"),
  biotech_solutions: createClientTenantConfig("BioTech Solutions", "insights.biotechsolutions.com"),
  medical_innovations: createClientTenantConfig("Medical Innovations Inc", "platform.medinnovations.com")
};

export const getAllTenantConfigs = (): Record<string, TenantConfig> => ({
  mock5: MOCK5_TENANT_CONFIG,
  ...CLIENT_TENANT_CONFIGS
});

export const getTenantByDomain = (domain: string): TenantConfig | null => {
  const allConfigs = getAllTenantConfigs();
  return Object.values(allConfigs).find(config => config.domain === domain) || null;
};

export const getTenantById = (tenantId: string): TenantConfig | null => {
  const allConfigs = getAllTenantConfigs();
  return allConfigs[tenantId] || null;
};