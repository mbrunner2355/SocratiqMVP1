import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TenantConfig } from '@shared/tenant-config';

interface TenantContextType {
  tenant: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  error: null,
});

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  
  // Fetch tenant configuration from server
  const { data, isLoading, error } = useQuery<TenantConfig>({
    queryKey: ['/api/tenant/config'],
    retry: 3,
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (data) {
      setTenant(data);
      
      // Apply tenant-specific styling
      applyTenantStyling(data);
      
      // Update document title
      document.title = data.customization.headerTitle;
      
      // Update favicon if specified
      if (data.logo) {
        updateFavicon(data.logo);
      }
    }
  }, [data]);
  
  const applyTenantStyling = (tenantConfig: TenantConfig) => {
    const root = document.documentElement;
    
    // Apply primary color
    root.style.setProperty('--tenant-primary', tenantConfig.primaryColor);
    root.style.setProperty('--tenant-secondary', tenantConfig.secondaryColor);
    
    // Apply CSS custom properties for consistent branding
    root.style.setProperty('--tenant-primary-rgb', hexToRgb(tenantConfig.primaryColor));
    root.style.setProperty('--tenant-secondary-rgb', hexToRgb(tenantConfig.secondaryColor));
  };
  
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };
  
  const updateFavicon = (iconUrl: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = iconUrl;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = iconUrl;
      document.getElementsByTagName('head')[0].appendChild(newLink);
    }
  };
  
  const contextValue: TenantContextType = {
    tenant,
    isLoading,
    error: error?.message || null,
  };
  
  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
};

// Hook to check if a feature is enabled for the current tenant
export const useFeature = (featureName: string): boolean => {
  const { tenant } = useTenant();
  return tenant?.features.includes(featureName) || false;
};

// Hook to get tenant-specific styling
export const useTenantStyling = () => {
  const { tenant } = useTenant();
  
  return {
    primaryColor: tenant?.primaryColor || '#2563eb',
    secondaryColor: tenant?.secondaryColor || '#1e40af',
    logo: tenant?.logo || '/default-logo.png',
    brandName: tenant?.brandName || 'EMME Platform',
  };
};