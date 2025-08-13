export interface PartnerBrandConfig {
  partnerId: string;
  partnerName: string;
  agentName: string;
  agentBrand: string;
  
  // Color scheme
  colors: {
    primary: string;      // Main brand color
    secondary: string;    // Secondary/accent color
    background: string;   // Background tint
    gradient: {
      from: string;
      to: string;
    };
    avatar: string;       // Avatar background color
    button: {
      primary: string;
      hover: string;
    };
    chat: {
      background: string;
      avatar: string;
    };
  };
  
  // Messaging customization
  messaging: {
    industry: string;           // e.g., "biopharmaceutical", "strategic intelligence"
    roleDescription: string;    // e.g., "colleague", "assistant"
    specialization: string;     // e.g., "regulatory guidance", "analytical support"
    journey: string;           // e.g., "from lab to market", "to success"
  };
  
  // Logo and assets (optional)
  assets?: {
    logo?: string;
    favicon?: string;
    backgroundImage?: string;
  };
}

// Partner brand configurations
export const PARTNER_BRANDS: Record<string, PartnerBrandConfig> = {
  'emme-engage': {
    partnerId: 'emme-engage',
    partnerName: 'EMME Engage',
    agentName: 'EMME',
    agentBrand: 'EMME™',
    colors: {
      primary: 'purple-400',
      secondary: 'purple-600',
      background: 'purple-50',
      gradient: {
        from: 'purple-50',
        to: 'stone-200'
      },
      avatar: 'purple-400',
      button: {
        primary: 'purple-600',
        hover: 'purple-700'
      },
      chat: {
        background: 'stone-200',
        avatar: 'purple-400'
      }
    },
    messaging: {
      industry: 'biopharmaceutical development',
      roleDescription: 'biopharmaceutical colleague',
      specialization: 'regulatory guidance',
      journey: 'from lab to market'
    }
  },
  
  'emme-health': {
    partnerId: 'emme-health',
    partnerName: 'EMME Health',
    agentName: 'EMME',
    agentBrand: 'EMME Health™',
    colors: {
      primary: 'green-500',
      secondary: 'blue-600',
      background: 'green-50',
      gradient: {
        from: 'green-50',
        to: 'blue-50'
      },
      avatar: 'green-500',
      button: {
        primary: 'blue-600',
        hover: 'blue-700'
      },
      chat: {
        background: 'green-50',
        avatar: 'green-500'
      }
    },
    messaging: {
      industry: 'healthcare innovation',
      roleDescription: 'healthcare intelligence partner',
      specialization: 'clinical insights',
      journey: 'to better patient outcomes'
    }
  },
  
  'fedtech-scout': {
    partnerId: 'fedtech-scout',
    partnerName: 'FedTech Scout',
    agentName: 'Scout',
    agentBrand: 'FedTech Scout™',
    colors: {
      primary: 'indigo-600',
      secondary: 'orange-500',
      background: 'indigo-50',
      gradient: {
        from: 'indigo-50',
        to: 'orange-50'
      },
      avatar: 'indigo-600',
      button: {
        primary: 'orange-500',
        hover: 'orange-600'
      },
      chat: {
        background: 'indigo-50',
        avatar: 'indigo-600'
      }
    },
    messaging: {
      industry: 'federal technology transfer',
      roleDescription: 'technology discovery specialist',
      specialization: 'IP analysis and market assessment',
      journey: 'to commercialization success'
    }
  },
  
  'pharma-intelligence': {
    partnerId: 'pharma-intelligence',
    partnerName: 'Pharma Intelligence',
    agentName: 'PI',
    agentBrand: 'Pharma Intelligence™',
    colors: {
      primary: 'cyan-600',
      secondary: 'rose-500',
      background: 'cyan-50',
      gradient: {
        from: 'cyan-50',
        to: 'rose-50'
      },
      avatar: 'cyan-600',
      button: {
        primary: 'rose-500',
        hover: 'rose-600'
      },
      chat: {
        background: 'cyan-50',
        avatar: 'cyan-600'
      }
    },
    messaging: {
      industry: 'pharmaceutical market intelligence',
      roleDescription: 'strategic intelligence advisor',
      specialization: 'competitive analysis and market dynamics',
      journey: 'to market leadership'
    }
  },
  
  // Default SocratIQ branding
  'socratiq': {
    partnerId: 'socratiq',
    partnerName: 'SocratIQ',
    agentName: 'Sophie',
    agentBrand: 'Sophie™',
    colors: {
      primary: 'blue-500',
      secondary: 'teal-600',
      background: 'blue-50',
      gradient: {
        from: 'blue-50',
        to: 'teal-50'
      },
      avatar: 'blue-500',
      button: {
        primary: 'teal-600',
        hover: 'teal-700'
      },
      chat: {
        background: 'blue-50',
        avatar: 'blue-500'
      }
    },
    messaging: {
      industry: 'strategic intelligence',
      roleDescription: 'intelligence assistant',
      specialization: 'analytical support',
      journey: 'to success'
    }
  }
};

// Utility function to get partner brand configuration
export function getPartnerBrand(partnerId?: string): PartnerBrandConfig {
  if (!partnerId) return PARTNER_BRANDS['socratiq'];
  return PARTNER_BRANDS[partnerId] || PARTNER_BRANDS['socratiq'];
}

// Utility function to detect partner context
export function detectPartnerContext(): string {
  // Check URL patterns - EMME Connect white-label routes
  const pathname = window.location.pathname;
  if (pathname === '/engage' || pathname === '/mock5-client' || pathname.includes('/emme-engage')) return 'emme-engage';
  if (pathname.includes('/emme-health') || pathname.includes('/health')) return 'emme-health';
  if (pathname.includes('/fedtech') || pathname.includes('/fedscout')) return 'fedtech-scout';
  if (pathname.includes('/pharma-intel')) return 'pharma-intelligence';
  
  // Check localStorage
  const partnerApp = localStorage.getItem('partner-app');
  if (partnerApp) return partnerApp;
  
  // Check tenant context
  const tenantId = localStorage.getItem('tenant-id');
  if (tenantId?.includes('mock5')) return 'emme-engage';
  if (tenantId?.includes('emme')) return 'emme-health';
  
  // Default to SocratIQ
  return 'socratiq';
}