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
        this.goTo('/emme-engage/app');
        break;
      case 'emme-health':
        this.goTo('/dashboard');
        break;
      default:
        this.goTo('/dashboard');
    }
  }

  static logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('partner-app');
    this.goTo('/emme-engage', { replace: true });
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