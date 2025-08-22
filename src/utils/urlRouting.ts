// URL-based routing utilities - removed unused import

// URL-based routing utilities for EMME Engage
export function updateUrlForView(view: string, projectId?: string, section?: string, tab?: string) {
  let newPath = '/projects';
  
  if (view === 'home') {
    newPath = '/projects/home';
  } else if (view === 'create-project') {
    newPath = '/projects/create';
  } else if (view === 'view-projects') {
    newPath = '/projects/view';
  } else if (projectId) {
    if (view === 'project-insights') {
      if (tab) {
        newPath = `/projects/${projectId}/insights/${tab}`;
      } else {
        newPath = `/projects/${projectId}/insights`;
      }
    } else if (view === 'framework') {
      if (section) {
        newPath = `/projects/${projectId}/framework/${section}`;
      } else {
        newPath = `/projects/${projectId}/framework`;
      }
    } else if (view === 'client-content') {
      newPath = `/projects/${projectId}/client-content`;
    } else if (view === 'playground') {
      newPath = `/projects/${projectId}/playground`;
    } else if (view === 'strategy-map') {
      newPath = `/projects/${projectId}/strategy-map`;
    } else if (view === 'dashboard') {
      newPath = `/projects/${projectId}/dashboard`;
    } else {
      newPath = `/projects/${projectId}`;
    }
  }
  
  // Update URL without page reload
  window.history.pushState({ view, projectId, section, tab }, '', newPath);
}

export function getViewFromUrl(): { view: string; projectId?: string; section?: string; tab?: string } {
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  
  // Handle /projects routes
  if (parts[0] === 'projects') {
    if (parts.length === 1) {
      return { view: 'home' };
    } else if (parts[1] === 'home') {
      return { view: 'home' };
    } else if (parts[1] === 'create') {
      return { view: 'create-project' };
    } else if (parts[1] === 'view') {
      return { view: 'view-projects' };
    } else if (parts.length >= 2) {
      const projectId = parts[1];
      
      if (parts.length === 2) {
        return { view: 'project-insights', projectId };
      } else if (parts[2] === 'insights') {
        const tab = parts[3] || 'overview';
        return { view: 'project-insights', projectId, tab };
      } else if (parts[2] === 'framework') {
        const section = parts[3] || 'background';
        return { view: 'framework', projectId, section };
      } else if (parts[2] === 'client-content') {
        return { view: 'client-content', projectId };
      } else if (parts[2] === 'playground') {
        return { view: 'playground', projectId };
      } else if (parts[2] === 'strategy-map') {
        return { view: 'strategy-map', projectId };
      } else if (parts[2] === 'dashboard') {
        return { view: 'dashboard', projectId };
      }
    }
  }
  
  return { view: 'home' };
}

export function initializeUrlRouting(onViewChange: (view: string, projectId?: string, section?: string, tab?: string) => void) {
  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const { view, projectId, section, tab } = getViewFromUrl();
    onViewChange(view, projectId, section, tab);
  });
  
  // Set initial view from URL
  const { view, projectId, section, tab } = getViewFromUrl();
  onViewChange(view, projectId, section, tab);
}