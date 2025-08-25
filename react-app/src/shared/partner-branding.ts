export interface PartnerBrandConfig {
  partnerId: string;
  partnerName: string;
  agentName: string;
  agentBrand: string;
  colors: {
    primary: string;
    secondary: string;
    avatar: string;
    gradient: {
      from: string;
      to: string;
    };
    chat: {
      background: string;
      text: string;
      avatar?: string;
    };
    button?: {
      primary: string;
      hover: string;
    };
  };
  messaging: {
    industry: string;
    roleDescription: string;
    specialization: string;
    journey: string;
  };
}

export const PARTNER_BRANDS: Record<string, PartnerBrandConfig> = {
  'socratiq': {
    partnerId: 'socratiq',
    partnerName: 'SocratIQ',
    agentName: 'Sophie',
    agentBrand: 'AI Research Assistant',
    colors: {
      primary: 'blue-600',
      secondary: 'blue-100',
      avatar: 'blue-500',
      gradient: {
        from: 'blue-500',
        to: 'purple-600'
      },
      chat: {
        background: 'gray-50',
        text: 'gray-900',
        avatar: 'blue-500'
      },
      button: {
        primary: 'blue-600',
        hover: 'blue-700'
      }
    },
    messaging: {
      industry: 'General Research',
      roleDescription: 'AI Research Assistant',
      specialization: 'Document Analysis & Insights',
      journey: 'Intelligent Document Processing'
    }
  },
  'emme-engage': {
    partnerId: 'emme-engage',
    partnerName: 'EMME Engage™',
    agentName: 'Emma',
    agentBrand: 'Pharmaceutical Intelligence Agent',
    colors: {
      primary: 'emerald-600',
      secondary: 'emerald-100',
      avatar: 'emerald-500',
      gradient: {
        from: 'emerald-500',
        to: 'teal-600'
      },
      chat: {
        background: 'emerald-50',
        text: 'emerald-900',
        avatar: 'emerald-500'
      },
      button: {
        primary: 'emerald-600',
        hover: 'emerald-700'
      }
    },
    messaging: {
      industry: 'Pharmaceutical',
      roleDescription: 'Strategic Intelligence Agent',
      specialization: 'Clinical Trial Analytics',
      journey: 'Pharmaceutical Strategic Intelligence'
    }
  },
  'demo-partner': {
    partnerId: 'demo-partner',
    partnerName: 'Demo Partner',
    agentName: 'Alex',
    agentBrand: 'Demo Assistant',
    colors: {
      primary: 'purple-600',
      secondary: 'purple-100',
      avatar: 'purple-500',
      gradient: {
        from: 'purple-500',
        to: 'pink-600'
      },
      chat: {
        background: 'purple-50',
        text: 'purple-900',
        avatar: 'purple-500'
      },
      button: {
        primary: 'purple-600',
        hover: 'purple-700'
      }
    },
    messaging: {
      industry: 'Technology',
      roleDescription: 'Demo Assistant',
      specialization: 'Product Demonstrations',
      journey: 'Interactive Demo Experience'
    }
  }
};

export function detectPartnerContext(): string {
  // Logic to detect partner context based on URL, headers, etc.
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  if (hostname.includes('emme') || pathname.includes('emme')) {
    return 'emme-engage';
  }
  
  if (hostname.includes('demo') || pathname.includes('demo')) {
    return 'demo-partner';
  }
  
  return 'socratiq'; // default
}

export function getPartnerBrand(partnerId?: string): PartnerBrandConfig {
  const id = partnerId || detectPartnerContext();
  return PARTNER_BRANDS[id] || PARTNER_BRANDS['socratiq'];
}