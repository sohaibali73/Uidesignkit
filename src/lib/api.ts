// API Client for communicating with the backend

import { User, AuthResponse, Message, Conversation, AFLGenerateRequest, AFLCode, Document, SearchResult, BacktestResult, Strategy, BrainStats } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000';

class APIClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private getToken() {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    isFormData: boolean = false
  ): Promise<T> {
    const headers: HeadersInit = {};
    const token = this.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!isFormData && method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      if (isFormData) {
        config.body = body;
      } else {
        config.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name: string, claudeApiKey: string) {
    const response = await this.request<AuthResponse>('/auth/register', 'POST', {
      email,
      password,
      name,
      claude_api_key: claudeApiKey,
    });
    this.setToken(response.access_token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<AuthResponse>('/auth/login', 'POST', {
      email,
      password,
    });
    this.setToken(response.access_token);
    return response;
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // AFL endpoints
  async generateAFL(request: AFLGenerateRequest) {
    return this.request<AFLCode>('/afl/generate', 'POST', request);
  }

  async optimizeAFL(code: string) {
    return this.request<AFLCode>('/afl/optimize', 'POST', { code });
  }

  async debugAFL(code: string, errorMessage?: string) {
    return this.request<AFLCode>('/afl/debug', 'POST', {
      code,
      error_message: errorMessage,
    });
  }

  async explainAFL(code: string) {
    return this.request<{ explanation: string }>('/afl/explain', 'POST', { code });
  }

  async validateAFL(code: string) {
    return this.request<{ valid: boolean; errors?: string[] }>('/afl/validate', 'POST', { code });
  }

  // Chat endpoints
  async getConversations() {
    return this.request<Conversation[]>('/chat/conversations');
  }

  async createConversation() {
    return this.request<Conversation>('/chat/conversations', 'POST', {});
  }

  async getMessages(conversationId: string) {
    return this.request<Message[]>(`/chat/conversations/${conversationId}/messages`);
  }

  async sendMessage(content: string, conversationId?: string) {
    return this.request<Message>('/chat/message', 'POST', {
      content,
      conversation_id: conversationId,
    });
  }

  // Brain/Knowledge Base endpoints
  async uploadDocument(file: File, category: string = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    return this.request<Document>('/brain/upload', 'POST', formData, true);
  }

  async uploadText(text: string, category: string = 'general') {
    return this.request<Document>('/brain/upload-text', 'POST', {
      text,
      category,
    });
  }

  async searchKnowledge(query: string, category?: string, limit: number = 10) {
    return this.request<SearchResult[]>('/brain/search', 'POST', {
      query,
      category,
      limit,
    });
  }

  async getDocuments() {
    return this.request<Document[]>('/brain/documents');
  }

  async getBrainStats() {
    return this.request<BrainStats>('/brain/stats');
  }

  async deleteDocument(documentId: string) {
    return this.request<{ success: boolean }>(`/brain/documents/${documentId}`, 'DELETE');
  }

  // Backtest endpoints
  async uploadBacktest(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<BacktestResult>('/backtest/upload', 'POST', formData, true);
  }

  async getBacktest(backtestId: string) {
    return this.request<BacktestResult>(`/backtest/${backtestId}`);
  }

  async getStrategyBacktests(strategyId: string) {
    return this.request<BacktestResult[]>(`/backtest/strategy/${strategyId}`);
  }

  // Reverse Engineer endpoints
  async startReverseEngineering() {
    return this.request<Strategy>('/reverse-engineer/start', 'POST', {});
  }

  async continueReverseEngineering(strategyId: string, content: string) {
    return this.request<Strategy>('/reverse-engineer/continue', 'POST', {
      strategy_id: strategyId,
      content,
    });
  }

  async researchStrategy(strategyId: string) {
    return this.request<Strategy>(`/reverse-engineer/research/${strategyId}`, 'POST', {});
  }

  async generateStrategySchematic(strategyId: string) {
    return this.request<Strategy>(`/reverse-engineer/schematic/${strategyId}`, 'POST', {});
  }

  async generateStrategyCode(strategyId: string) {
    return this.request<Strategy>(`/reverse-engineer/generate-code/${strategyId}`, 'POST', {});
  }

  async getStrategy(strategyId: string) {
    return this.request<Strategy>(`/reverse-engineer/strategy/${strategyId}`);
  }

  // Health check
  async checkHealth() {
    return this.request<{ status: string }>('/health');
  }

  async getRoutes() {
    return this.request<string[]>('/routes');
  }
}

// ... your existing APIClient class code ...

export const apiClient = new APIClient();
export default apiClient;

// ADD THIS - compatibility layer for pages expecting 'api'
export const api = {
  auth: {
    login: (email: string, password: string) => apiClient.login(email, password),
    register: (data: any) => apiClient.register(data.email, data.password, data.name, data.claude_api_key),
    getMe: () => apiClient.getCurrentUser(),
  },
  afl: {
    generate: (prompt: string, strategyType?: string, settings?: any) => 
      apiClient.generateAFL({ prompt, strategy_type: strategyType, settings }),
    optimize: (code: string) => apiClient.optimizeAFL(code),
    debug: (code: string, errorMessage?: string) => apiClient.debugAFL(code, errorMessage),
    explain: (code: string) => apiClient.explainAFL(code),
    validate: (code: string) => apiClient.validateAFL(code),
  },
  chat: {
    getConversations: () => apiClient.getConversations(),
    createConversation: () => apiClient.createConversation(),
    getMessages: (conversationId: string) => apiClient.getMessages(conversationId),
    sendMessage: (content: string, conversationId?: string) => apiClient.sendMessage(content, conversationId),
  },
  brain: {
    uploadDocument: (file: File, category?: string) => apiClient.uploadDocument(file, category),
    search: (query: string, category?: string, limit?: number) => apiClient.searchKnowledge(query, category, limit),
    getDocuments: () => apiClient.getDocuments(),
    getStats: () => apiClient.getBrainStats(),
    deleteDocument: (documentId: string) => apiClient.deleteDocument(documentId),
  },
  backtest: {
    upload: (file: File) => apiClient.uploadBacktest(file),
    getBacktest: (backtestId: string) => apiClient.getBacktest(backtestId),
  },
  reverseEngineer: {
    startSession: (description: string) => apiClient.startReverseEngineering(),
    generateSchematic: (strategyId: string) => apiClient.generateStrategySchematic(strategyId),
    generateCode: (strategyId: string) => apiClient.generateStrategyCode(strategyId),
    getStrategy: (strategyId: string) => apiClient.getStrategy(strategyId),
  },
};
