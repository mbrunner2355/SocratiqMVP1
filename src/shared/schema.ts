// Shared type definitions for the application

export interface Document {
  id: string;
  originalName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  processingProgress?: number;
  semanticTags?: string[];
  entities?: Entity[];
}

export interface Entity {
  id: string;
  documentId: string;
  type: string;
  text: string;
  confidence: number;
  context?: string;
}

export interface ProcessingStats {
  totalDocuments: number;
  processingQueue: number;
  avgProcessingTime: number;
  avgAccuracy: number;
}

export interface AnalyticsData {
  entityStats: Record<string, number>;
  processingStats: ProcessingStats;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  dueDate: string;
  client?: string;
  teamSize?: number;
  budget?: number;
}