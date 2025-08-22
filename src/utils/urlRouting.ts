// URL-based routing utilities for EMME Engage
export function updateUrlForView(view: string, projectId?: string) {
  const url = new URL(window.location.href);
  
  // Update the hash to reflect current view
  if (projectId) {
    url.hash = `#/${view}/${projectId}`;
  } else {
    url.hash = `#/${view}`;
  }
  
  // Update URL without page reload
  window.history.pushState({ view, projectId }, '', url.toString());
}

export function getViewFromUrl(): { view: string; projectId?: string } {
  const hash = window.location.hash.slice(1); // Remove #
  const parts = hash.split('/').filter(Boolean);
  
  if (parts.length >= 2) {
    return {
      view: parts[0],
      projectId: parts[1]
    };
  } else if (parts.length === 1) {
    return {
      view: parts[0]
    };
  }
  
  return { view: 'home' };
}

export function initializeUrlRouting(onViewChange: (view: string, projectId?: string) => void) {
  // Handle browser back/forward buttons
  window.addEventListener('popstate', (event) => {
    const { view, projectId } = getViewFromUrl();
    onViewChange(view, projectId);
  });
  
  // Set initial view from URL
  const { view, projectId } = getViewFromUrl();
  if (view !== 'home') {
    onViewChange(view, projectId);
  }
}