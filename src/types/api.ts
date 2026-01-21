// API Types and Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AFLGenerateRequest {
  prompt: string;
  strategy_type?: 'standalone' | 'entry' | 'exit';
  settings?: {
    initial_equity?: number;
    max_positions?: number;
  };
}

export interface AFLCode {
  id: string;
  code: string;
  title: string;
  description: string;
  strategy_type: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  filename: string;
  category: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  document_id: string;
  content: string;
  relevance_score: number;
  filename: string;
}

export interface BacktestResult {
  id: string;
  strategy_id: string;
  total_return: number;
  win_rate: number;
  max_drawdown: number;
  sharpe_ratio: number;
  created_at: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  code?: string;
  schematic?: string;
  created_at: string;
  updated_at: string;
}

export interface BrainStats {
  total_documents: number;
  total_size: number;
  categories: Record<string, number>;
}

// Request/Response types
export interface ApiError {
  detail: string;
  status_code: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}
