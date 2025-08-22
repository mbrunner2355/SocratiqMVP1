// Project data export utility for EMME Engage projects
export interface LocalStorageProjectData {
  'emme-projects': any[];
  'emme-project-context': any;
  'current-project': any;
  [key: string]: any;
}

export function exportLocalStorageData(): LocalStorageProjectData {
  const exportData: LocalStorageProjectData = {
    'emme-projects': [],
    'emme-project-context': null,
    'current-project': null,
  };

  // Export EMME projects from localStorage
  const emmeProjects = localStorage.getItem('emme-projects');
  if (emmeProjects) {
    try {
      exportData['emme-projects'] = JSON.parse(emmeProjects);
    } catch (e) {
      console.error('Error parsing emme-projects from localStorage:', e);
    }
  }

  // Export project context from sessionStorage
  const projectContext = sessionStorage.getItem('emme-project-context');
  if (projectContext) {
    try {
      exportData['emme-project-context'] = JSON.parse(projectContext);
    } catch (e) {
      console.error('Error parsing emme-project-context from sessionStorage:', e);
    }
  }

  // Export current project from sessionStorage
  const currentProject = sessionStorage.getItem('current-project');
  if (currentProject) {
    try {
      exportData['current-project'] = JSON.parse(currentProject);
    } catch (e) {
      console.error('Error parsing current-project from sessionStorage:', e);
    }
  }

  // Export any project-specific data stored with project IDs
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('project-')) {
      const value = sessionStorage.getItem(key);
      if (value) {
        try {
          exportData[key] = JSON.parse(value);
        } catch (e) {
          exportData[key] = value;
        }
      }
    }
  }

  return exportData;
}

export function downloadProjectData() {
  const data = exportLocalStorageData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `emme-projects-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function uploadProjectDataToDatabase(data: LocalStorageProjectData) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
  
  if (data['emme-projects'] && Array.isArray(data['emme-projects'])) {
    for (const project of data['emme-projects']) {
      try {
        const response = await fetch(`${apiUrl}/api/emme/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectTitle: project.name || project.projectTitle || 'Imported Project',
            client: project.client || 'Unknown Client',
            team: project.team || 'Unknown Team', 
            summary: project.summary || 'Imported from localStorage',
            type: project.organizationType === 'pharmaceutical' ? 'campaign' : 'campaign',
            status: project.status || 'draft',
            therapeuticArea: project.therapeuticArea,
            // Map other fields as needed
            metadata: {
              importedFromLocalStorage: true,
              originalData: project
            }
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to upload project:', project, response.statusText);
        } else {
          console.log('Successfully uploaded project:', project.name || project.id);
        }
      } catch (error) {
        console.error('Error uploading project:', error);
      }
    }
  }
}