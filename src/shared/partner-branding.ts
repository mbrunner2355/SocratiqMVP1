// Partner branding utilities for multi-tenant support

export interface PartnerBrand {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  logo?: string;
  domain?: string;
}

export const defaultBrand: PartnerBrand = {
  id: 'default',
  name: 'SocratIQ',
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af', 
    accent: '#3b82f6',
    background: '#ffffff',
    text: '#1f2937'
  }
};

export const emmeBrand: PartnerBrand = {
  id: 'emme',
  name: 'EMME Engage',
  colors: {
    primary: '#7c3aed',
    secondary: '#6d28d9',
    accent: '#8b5cf6', 
    background: '#ffffff',
    text: '#1f2937'
  }
};

export const partnerBrands: Record<string, PartnerBrand> = {
  default: defaultBrand,
  emme: emmeBrand,
  'emme-engage': emmeBrand
};

export function detectPartnerContext(domain?: string, path?: string): string {
  if (path?.includes('emme') || domain?.includes('emme')) {
    return 'emme';
  }
  return 'default';
}

export function getPartnerBrand(partnerId: string): PartnerBrand {
  return partnerBrands[partnerId] || defaultBrand;
}

export function applyPartnerBranding(brand: PartnerBrand) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', brand.colors.primary);
  root.style.setProperty('--color-secondary', brand.colors.secondary);
  root.style.setProperty('--color-accent', brand.colors.accent);
  root.style.setProperty('--color-background', brand.colors.background);
  root.style.setProperty('--color-text', brand.colors.text);
}