import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
  features: string[];
  branding: {
    companyName: string;
    supportEmail: string;
  };
}

interface TenantContextType {
  tenant: TenantConfig | null;
  isLoading: boolean;
  error: Error | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

// Hook for tenant-based styling
export const useTenantStyling = () => {
  const { tenant } = useTenant();
  
  return {
    primaryColor: tenant?.theme?.primaryColor || '#2563EB',
    secondaryColor: tenant?.theme?.secondaryColor || '#0EA5E9',
    logo: tenant?.theme?.logo || '/logo.svg',
    companyName: tenant?.branding?.companyName || 'SocratIQ',
    supportEmail: tenant?.branding?.supportEmail || 'support@socratiq.com',
    
    // CSS custom properties for dynamic theming
    getCSSVariables: () => ({
      '--tenant-primary': tenant?.theme?.primaryColor || '#2563EB',
      '--tenant-secondary': tenant?.theme?.secondaryColor || '#0EA5E9',
    }),
    
    // Utility classes
    primaryBg: `bg-[${tenant?.theme?.primaryColor || '#2563EB'}]`,
    secondaryBg: `bg-[${tenant?.theme?.secondaryColor || '#0EA5E9'}]`,
    primaryText: `text-[${tenant?.theme?.primaryColor || '#2563EB'}]`,
    secondaryText: `text-[${tenant?.theme?.secondaryColor || '#0EA5E9'}]`,
    
    // Border classes
    primaryBorder: `border-[${tenant?.theme?.primaryColor || '#2563EB'}]`,
    secondaryBorder: `border-[${tenant?.theme?.secondaryColor || '#0EA5E9'}]`,
  };
};

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  // For development, return a mock tenant config instead of making API calls
  const mockTenant: TenantConfig = {
    id: 'socratiq-demo',
    name: 'SocratIQ Platform',
    domain: 'demo.socratiq.com',
    theme: {
      primaryColor: '#2563EB',
      secondaryColor: '#0EA5E9',
      logo: '/logo.svg'
    },
    features: ['transform', 'mesh', 'trace', 'sophie', 'emme'],
    branding: {
      companyName: 'SocratIQ',
      supportEmail: 'support@socratiq.com'
    }
  };

  // In development, skip the API call and use mock data
  const isDevelopment = import.meta.env.DEV || 
                       window.location.hostname === 'localhost' ||
                       window.location.hostname.includes('replit');

  const { data: tenant, isLoading, error } = useQuery({
    queryKey: ['/api/tenant/config'],
    queryFn: async () => {
      if (isDevelopment) {
        // Return mock data for development
        return mockTenant;
      }
      
      // In production, make actual API call
      const response = await fetch('/api/tenant/config', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tenant config: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: true, // Always enabled, but uses mock data in development
  });

  const value: TenantContextType = {
    tenant: tenant || mockTenant, // Fallback to mock tenant
    isLoading: isDevelopment ? false : isLoading, // No loading in development
    error: isDevelopment ? null : error, // No errors in development
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};