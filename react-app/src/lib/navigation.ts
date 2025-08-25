// src/lib/navigation.ts
import { NavigateFunction } from 'react-router-dom';

export class NavigationService {
  private static navigate: NavigateFunction | null = null;

  static setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  static goTo(path: string, options?: { replace?: boolean }) {
    if (this.navigate) {
      this.navigate(path, options);
    } else {
      // Fallback for non-React Router contexts
      window.location.href = path;
    }
  }

  static goToEMMESection(section: string) {
    const sectionMap: Record<string, string> = {
      'research-hub': '/app/emme/research-hub',
      'competitive-intelligence': '/app/emme/competitive-intelligence', 
      'regulatory-strategy': '/app/emme/regulatory-strategy',
      'market-access': '/app/emme/market-access',
      'content-library': '/app/emme/content-library',
      'partnerships': '/app/emme/partnerships',
      'analytics-dashboard': '/app/emme/analytics-dashboard',
      'analytics': '/app/emme/analytics-dashboard',
      'projects': '/app/emme/projects',
      'questions': '/app/emme/questions'
    };

    const path = sectionMap[section] || '/app/emme';
    this.goTo(path);
  }

  static handleLogin(partnerApp?: string) {
    if (partnerApp) {
      localStorage.setItem('partner-app', partnerApp);
    }
    this.goTo('/login');
  }

  static handleAppEntry(partnerApp: string) {
    localStorage.setItem('partner-app', partnerApp);
    
    // Route to appropriate app section
    switch (partnerApp) {
      case 'emme-engage':
        this.goTo('/app/emme-engage/app');
        break;
      case 'emme-health':
        this.goTo('/app/dashboard');
        break;
      default:
        this.goTo('/app/dashboard');
    }
  }

  static async logout() {
    try {
      // Clear all auth-related localStorage items
      localStorage.removeItem('cognito_access_token');
      localStorage.removeItem('cognito_id_token');
      localStorage.removeItem('cognito_refresh_token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('partner-app');
      
      console.log('Successfully cleared authentication data');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Always navigate to landing page after logout
    this.goTo('/emme-engage', { replace: true });
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  // Get current user info
  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Handle authentication redirect after login
  static handleAuthRedirect() {
    const partnerApp = localStorage.getItem('partner-app');
    
    if (partnerApp === 'emme-engage') {
      this.goTo('/app/emme-engage/app');
    } else if (partnerApp === 'emme-health') {
      this.goTo('/app/dashboard');
    } else {
      // Default redirect
      this.goTo('/app/dashboard');
    }
  }

  // Validate current session
  static async validateSession(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      // For now, just check if auth flag exists
      // In production, you'd validate tokens with your API
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }
}

// Hook to initialize navigation service
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function useNavigationSetup() {
  const navigate = useNavigate();
  
  useEffect(() => {
    NavigationService.setNavigate(navigate);
  }, [navigate]);
}

// Hook for session management
export function useSessionValidation() {
  useEffect(() => {
    const validateSession = async () => {
      const isValid = await NavigationService.validateSession();
      
      if (!isValid && 
          window.location.pathname !== '/login' && 
          !window.location.pathname.startsWith('/emme-engage') && 
          !window.location.pathname.startsWith('/emme-health')) {
        NavigationService.goTo('/login');
      }
    };

    // Validate session on mount
    validateSession();

    // Set up periodic session validation (every 5 minutes)
    const interval = setInterval(validateSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
}