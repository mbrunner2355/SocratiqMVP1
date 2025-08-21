export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Document {
  id: string;
  filename: string;
  content: string;
  upload_date: Date;
  file_size: number;
  file_type: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  confidence: number;
  document_id: string;
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}