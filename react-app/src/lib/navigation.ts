// src/lib/navigation.ts
import { NavigateFunction } from 'react-router-dom';

export class NavigationService {
  private static navigate: NavigateFunction;

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
      'research-hub': '/emme/research-hub',
      'competitive-intelligence': '/emme/competitive-intelligence',
      'regulatory-strategy': '/emme/regulatory-strategy',
      'market-access': '/emme/market-access',
      'content-library': '/emme/content-library',
      'partnerships': '/emme/partnerships',
      'analytics-dashboard': '/emme/analytics-dashboard',
      'analytics': '/emme/analytics-dashboard',
      'projects': '/emme/projects',
      'questions': '/emme/questions'
    };

    const path = sectionMap[section] || '/emme';
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
        this.goTo('/app/emme-engage/app');  // Goes directly to EMME Engage app
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
      // Import Cognito service dynamically to avoid circular dependencies
      const { CognitoAuthService } = await import('./aws-config');
      const cognitoAuth = new CognitoAuthService();
      
      // Sign out from Cognito (clears tokens from localStorage)
      await cognitoAuth.signOut();
      
      console.log('Successfully signed out from Cognito');
    } catch (error) {
      console.error('Error during Cognito sign out:', error);
      
      // Fallback: manually clear all auth-related localStorage items
      localStorage.removeItem('cognito_access_token');
      localStorage.removeItem('cognito_id_token');
      localStorage.removeItem('cognito_refresh_token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('partner-app');
    }
    
    // Always navigate to landing page after logout
    this.goTo('/emme-engage', { replace: true });
  }

  // New method: Check if user is authenticated
  static isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true' && 
           !!localStorage.getItem('cognito_access_token');
  }

  // New method: Get current user info
  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // New method: Handle authentication redirect after login
  static handleAuthRedirect() {
    const partnerApp = localStorage.getItem('partner-app');
    
    if (partnerApp === 'emme-engage') {
      this.goTo('/app/emme-engage/app');  // Goes directly to EMME Engage app
    } else if (partnerApp === 'emme-health') {
      this.goTo('/app/dashboard');
    } else {
      // Default redirect
      this.goTo('/app/dashboard');
    }
  }

  // New method: Handle token refresh and navigation
  static async handleTokenRefresh() {
    try {
      const refreshToken = localStorage.getItem('cognito_refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { CognitoAuthService } = await import('./aws-config');
      const cognitoAuth = new CognitoAuthService();
      
      const tokens = await cognitoAuth.refreshToken(refreshToken);
      
      // Update tokens in localStorage
      localStorage.setItem('cognito_access_token', tokens.accessToken!);
      localStorage.setItem('cognito_id_token', tokens.idToken!);
      
      console.log('Tokens refreshed successfully');
      return true;
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails, logout user
      await this.logout();
      return false;
    }
  }

  // New method: Validate current session
  static async validateSession(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      // Check if tokens are still valid by making a test API call
      // You can implement this based on your API structure
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      
      // Try to refresh tokens
      return await this.handleTokenRefresh();
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
      
      if (!isValid && window.location.pathname !== '/login' && 
          !window.location.pathname.startsWith('/emme-engage') && 
          !window.location.pathname.startsWith('/emme-health')) {
        // Redirect to login if session is invalid and user is on a protected route
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