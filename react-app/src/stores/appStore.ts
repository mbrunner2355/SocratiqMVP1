import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Document {
  id: string
  filename: string
  originalName: string
  fileType: string
  fileSize: number
  status: 'processing' | 'completed' | 'failed'
  processingProgress: number
  content?: string
  entities?: any[]
  semanticTags?: string[]
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  projectId?: string
}

export interface Project {
  id: string
  name: string
  client: string
  status: 'active' | 'planning' | 'completed' | 'on-hold'
  progress: number
  startDate: string
  endDate: string
  teamMembers: number
  modules: string[]
  budget: number
  spent: number
  description: string
  therapeuticArea: string
  indication: string
  phase: string
  keyObjectives: string[]
  milestones: Array<{
    name: string
    date: string
    status: 'completed' | 'in-progress' | 'pending'
  }>
  documents?: Document[]
}

export interface AppState {
  // Documents
  documents: Document[]
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  getDocument: (id: string) => Document | undefined
  getDocumentsByProject: (projectId: string) => Document[]
  
  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, 'id'>) => string
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | undefined
  linkDocumentToProject: (documentId: string, projectId: string) => void
  
  // UI State
  currentView: string
  setCurrentView: (view: string) => void
  
  // Analytics
  getAnalytics: () => {
    totalDocuments: number
    totalProjects: number
    processingDocuments: number
    activeProjects: number
  }
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      documents: [],
      projects: [
        {
          id: 'proj-001',
          name: 'Xarelto Market Access Strategy',
          client: 'Bayer HealthCare',
          status: 'active',
          progress: 78,
          startDate: '2024-01-15',
          endDate: '2024-06-30',
          teamMembers: 12,
          modules: ['Insight Engine', 'Engagement Studio', 'Learning Hub'],
          budget: 850000,
          spent: 663000,
          description: 'Comprehensive market access strategy for Xarelto anticoagulant therapy, focusing on payer engagement and value-based care messaging.',
          therapeuticArea: 'Cardiovascular',
          indication: 'Anticoagulation',
          phase: 'Commercial Launch',
          keyObjectives: [
            'Develop payer value propositions',
            'Create HCP education materials',
            'Launch patient support programs',
            'Establish real-world evidence strategy'
          ],
          milestones: [
            { name: 'Payer Dossier Completion', date: '2024-02-15', status: 'completed' },
            { name: 'HCP Materials Launch', date: '2024-04-01', status: 'completed' },
            { name: 'Patient Program Rollout', date: '2024-05-15', status: 'in-progress' },
            { name: 'Outcomes Data Analysis', date: '2024-06-30', status: 'pending' }
          ]
        },
        {
          id: 'proj-004',
          name: 'VMS Global Vendor Management Platform',
          client: 'Bayer HealthCare',
          status: 'active',
          progress: 65,
          startDate: '2024-03-01',
          endDate: '2024-12-31',
          teamMembers: 18,
          modules: ['Strategic Intelligence', 'Market Analysis', 'Regulatory Strategy'],
          budget: 2500000,
          spent: 1625000,
          description: 'Comprehensive pharmaceutical intelligence platform for women entering menopause drug development, focusing on strategic market positioning and regulatory pathway optimization.',
          therapeuticArea: 'Women\'s Health',
          indication: 'Menopause Management',
          phase: 'Phase 3 Development',
          keyObjectives: [
            'Accelerate menopause therapy development',
            'Optimize regulatory submission strategy',
            'Establish market access framework',
            'Build comprehensive competitive intelligence'
          ],
          milestones: [
            { name: 'Phase 3 Protocol Finalization', date: '2024-04-15', status: 'completed' },
            { name: 'Regulatory Strategy Submission', date: '2024-07-01', status: 'in-progress' },
            { name: 'Market Access Framework', date: '2024-09-30', status: 'pending' },
            { name: 'Commercial Launch Preparation', date: '2024-12-31', status: 'pending' }
          ]
        }
      ],
      currentView: 'home',
      
      // Document methods
      addDocument: (documentData) => {
        const id = generateId()
        const document: Document = {
          ...documentData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          documents: [...state.documents, document]
        }))
        return id
      },
      
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates, updatedAt: new Date().toISOString() } : doc
          )
        }))
      },
      
      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id)
        }))
      },
      
      getDocument: (id) => {
        return get().documents.find((doc) => doc.id === id)
      },
      
      getDocumentsByProject: (projectId) => {
        return get().documents.filter((doc) => doc.projectId === projectId)
      },
      
      // Project methods
      addProject: (projectData) => {
        const id = generateId()
        const project: Project = {
          ...projectData,
          id,
        }
        set((state) => ({
          projects: [...state.projects, project]
        }))
        return id
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          )
        }))
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id)
        }))
      },
      
      getProject: (id) => {
        return get().projects.find((project) => project.id === id)
      },
      
      linkDocumentToProject: (documentId, projectId) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === documentId ? { ...doc, projectId, updatedAt: new Date().toISOString() } : doc
          )
        }))
      },
      
      // UI methods
      setCurrentView: (view) => {
        set({ currentView: view })
      },
      
      // Analytics
      getAnalytics: () => {
        const state = get()
        return {
          totalDocuments: state.documents.length,
          totalProjects: state.projects.length,
          processingDocuments: state.documents.filter(doc => doc.status === 'processing').length,
          activeProjects: state.projects.filter(project => project.status === 'active').length,
        }
      },
    }),
    {
      name: 'socratiq-app-storage',
      partialize: (state) => ({
        documents: state.documents,
        projects: state.projects,
        currentView: state.currentView,
      }),
    }
  )
)