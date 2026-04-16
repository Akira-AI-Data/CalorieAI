export type Role = 'user' | 'assistant';

export type Model =
  | 'claude-sonnet-4-20250514'
  | 'claude-haiku-4-5-20251001';

export const MODEL_LABELS: Record<Model, string> = {
  'claude-sonnet-4-20250514': 'Max',
  'claude-haiku-4-5-20251001': 'Pro',
};

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  files?: FileAttachment[];
  artifacts?: Artifact[];
}

export interface Artifact {
  id: string;
  type: 'code' | 'document' | 'html';
  title: string;
  content: string;
  language?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: Model;
  createdAt: number;
  updatedAt: number;
}
