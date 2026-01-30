// API Types and Interfaces
// Complete type definitions for the AFL Code Generator application

// ============================================================================
// AUTHENTICATION & USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  is_admin?: boolean;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  nickname?: string;
}

// ============================================================================
// CHAT & CONVERSATION TYPES
// ============================================================================

export interface Artifact {
  type: string;
  code: string;
  language: string;
  id: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: string;
  // Tools used in generating this message
  tools_used?: ToolUsage[];
  // Additional metadata (errors, attachments, etc.)
  metadata?: MessageMetadata;
  // Artifact fields for rendering interactive components
  text?: string;
  artifacts?: Artifact[];
  has_artifacts?: boolean;
}

export interface ToolUsage {
  tool: string;
  input: any;
  result_preview?: string;
  execution_time_ms?: number;
}

export interface MessageMetadata {
  error?: boolean;
  error_message?: string;
  attached_files?: AttachedFile[];
  tokens_used?: number;
  model?: string;
}

export interface AttachedFile {
  file_id: string;
  filename: string;
  content_type: string;
  size: number;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  conversation_type?: 'agent' | 'afl' | 'general';
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message_at?: string;
}

export interface ConversationCreateRequest {
  title?: string;
  conversation_type?: 'agent' | 'afl' | 'general';
}

export interface MessageCreateRequest {
  content: string;
  conversation_id?: string;
}

export interface MessageResponse {
  conversation_id: string;
  response: string;
  tools_used?: ToolUsage[];
  error?: boolean;
  error_message?: string;
}

export interface ConversationFile {
  id: string;
  conversation_id: string;
  filename: string;
  content_type: string;
  size: number;
  file_data: FileData;
  created_at: string;
}

export interface FileData {
  filename: string;
  content_type: string;
  base64_content?: string;
  text_content?: string;
  size: number;
}

export interface FileUploadResponse {
  file_id: string;
  filename: string;
  content_type: string;
  size: number;
}

// ============================================================================
// AFL CODE GENERATION TYPES
// ============================================================================

export interface AFLGenerateRequest {
  prompt: string;
  strategy_type?: 'standalone' | 'composite' | 'indicator' | 'exploration';
  settings?: BacktestSettings;
  conversation_id?: string;
  answers?: Record<string, string>;
  include_training?: boolean;
  stream?: boolean;
}

export interface BacktestSettings {
  initial_equity?: number;
  position_size?: string;
  position_size_type?: string;
  max_positions?: number;
  commission?: number;
  trade_delays?: number[];
  margin_requirement?: number;
}

export interface AFLGenerateResponse {
  afl_code: string;
  explanation?: string;
  quality_score?: number;
  warnings?: string[];
  validation_result?: ValidationResult;
  generation_time_ms?: number;
  tokens_used?: number;
}

export interface ValidationResult {
  is_valid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
}

export interface AFLCode {
  id: string;
  user_id?: string;
  code: string;
  title: string;
  description?: string;
  explanation?: string;
  strategy_type: string;
  quality_score?: number;
  is_favorite?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AFLDebugRequest {
  code: string;
  error_message?: string;
}

export interface AFLOptimizeRequest {
  code: string;
  optimization_goals?: string[];
}

export interface AFLExplainRequest {
  code: string;
  detail_level?: 'basic' | 'detailed' | 'expert';
}

// ============================================================================
// DOCUMENT & KNOWLEDGE BASE TYPES
// ============================================================================

export interface Document {
  id: string;
  user_id?: string;
  filename: string;
  title?: string;
  category: string;
  size: number;
  content_type?: string;
  metadata?: DocumentMetadata;
  created_at: string;
  updated_at: string;
}

export interface DocumentMetadata {
  pages?: number;
  word_count?: number;
  extracted_text_length?: number;
  processing_status?: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface DocumentUploadRequest {
  file: File;
  title?: string;
  category?: string;
}

export interface SearchResult {
  document_id: string;
  content: string;
  relevance_score: number;
  filename: string;
  category?: string;
  page_number?: number;
}

export interface KnowledgeBaseSearchRequest {
  query: string;
  category?: string;
  limit?: number;
}

export interface BrainStats {
  total_documents: number;
  total_size: number;
  categories: Record<string, number>;
  last_updated?: string;
}

// ============================================================================
// BACKTEST TYPES
// ============================================================================

export interface BacktestRequest {
  code: string;
  symbol?: string;
  start_date?: string;
  end_date?: string;
  settings?: BacktestSettings;
}

export interface BacktestResult {
  id: string;
  strategy_id?: string;
  code_id?: string;
  symbol?: string;
  start_date?: string;
  end_date?: string;
  metrics: BacktestMetrics;
  trades?: Trade[];
  equity_curve?: EquityPoint[];
  analysis?: string;
  recommendations?: BacktestRecommendation[];
  created_at: string;
}

export interface BacktestMetrics {
  total_return?: number;
  cagr?: number;
  sharpe_ratio?: number;
  sortino_ratio?: number;
  max_drawdown?: number;
  max_drawdown_duration?: number;
  win_rate?: number;
  profit_factor?: number;
  total_trades?: number;
  winning_trades?: number;
  losing_trades?: number;
  average_win?: number;
  average_loss?: number;
  largest_win?: number;
  largest_loss?: number;
  average_trade_duration?: number;
  exposure_time?: number;
}

export interface Trade {
  entry_date: string;
  entry_price: number;
  exit_date: string;
  exit_price: number;
  shares: number;
  profit: number;
  profit_percent: number;
  duration_days: number;
  type: 'long' | 'short';
}

export interface EquityPoint {
  date: string;
  equity: number;
  drawdown?: number;
}

export interface BacktestRecommendation {
  priority: number;
  recommendation: string;
  expected_impact?: string;
  implementation?: string;
  category?: 'entry' | 'exit' | 'position_sizing' | 'risk_management';
}

// ============================================================================
// STRATEGY TYPES
// ============================================================================

export interface Strategy {
  id: string;
  user_id?: string;
  name: string;
  description: string;
  code?: string;
  schematic?: string;
  strategy_type?: string;
  backtest_results?: BacktestMetrics;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

export interface StrategyCreateRequest {
  name: string;
  description: string;
  code?: string;
  strategy_type?: string;
}

// ============================================================================
// TRAINING DATA TYPES
// ============================================================================

export type TrainingType = 
  | 'example' 
  | 'rule' 
  | 'pattern' 
  | 'anti_pattern' 
  | 'correction' 
  | 'terminology'
  | 'best_practice';

export type TrainingCategory = 
  | 'afl' 
  | 'general' 
  | 'trading' 
  | 'backtesting'
  | 'indicators'
  | 'risk_management';

export interface TrainingData {
  id: string;
  training_type: TrainingType;
  title: string;
  input_prompt?: string;
  expected_output?: string;
  explanation?: string;
  category: TrainingCategory;
  tags?: string[];
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  usage_count?: number;
  created_by?: string;
  last_used_at?: string;
}

export interface TrainingCreateRequest {
  training_type: TrainingType;
  title: string;
  input_prompt?: string;
  expected_output?: string;
  explanation?: string;
  category?: TrainingCategory;
  tags?: string[];
  priority?: number;
  is_active?: boolean;
}

export interface QuickTrainRequest {
  what_to_learn: string;
  example_input?: string;
  example_output?: string;
  training_type?: TrainingType;
  category?: TrainingCategory;
}

export interface CorrectionRequest {
  original_prompt: string;
  wrong_output: string;
  correct_output: string;
  feedback?: string;
}

export interface TrainingStats {
  total: number;
  active: number;
  inactive: number;
  by_type: Record<string, number>;
  by_category: Record<string, number>;
  total_usage: number;
  avg_usage_per_item: number;
}

// ============================================================================
// FEEDBACK TYPES
// ============================================================================

export type FeedbackType = 
  | 'correction' 
  | 'improvement' 
  | 'bug' 
  | 'praise'
  | 'feature_request';

export type FeedbackStatus = 
  | 'pending_review' 
  | 'reviewed' 
  | 'implemented' 
  | 'rejected'
  | 'in_progress';

export interface UserFeedback {
  id: string;
  user_id: string;
  code_id?: string;
  conversation_id?: string;
  original_prompt?: string;
  generated_code?: string;
  feedback_type: FeedbackType;
  feedback_text: string;
  correct_code?: string;
  rating?: number;
  status: FeedbackStatus;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface FeedbackCreateRequest {
  code_id?: string;
  conversation_id?: string;
  original_prompt?: string;
  generated_code?: string;
  feedback_type: FeedbackType;
  feedback_text: string;
  correct_code?: string;
  rating?: number;
}

export interface FeedbackReviewRequest {
  status: FeedbackStatus;
  admin_notes?: string;
  create_training?: boolean;
}

export interface FeedbackStats {
  total: number;
  by_type: Record<FeedbackType, number>;
  by_status: Record<FeedbackStatus, number>;
  average_rating?: number;
  pending_count: number;
}

// ============================================================================
// SUGGESTION TYPES
// ============================================================================

export type SuggestionStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'implemented'
  | 'under_review';

export interface TrainingSuggestion {
  id: string;
  user_id: string;
  feedback_id?: string;
  title: string;
  description?: string;
  example_input?: string;
  example_output?: string;
  reason?: string;
  status: SuggestionStatus;
  admin_notes?: string;
  priority?: number;
  training_data_id?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface SuggestionCreateRequest {
  title: string;
  description?: string;
  example_input?: string;
  example_output?: string;
  reason?: string;
}

export interface SuggestionReviewRequest {
  status: SuggestionStatus;
  admin_notes?: string;
  priority?: number;
  create_training?: boolean;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsOverview {
  users: UserAnalytics;
  code_generation: CodeAnalytics;
  feedback: FeedbackAnalytics;
  training: TrainingAnalytics;
  conversations: ConversationAnalytics;
}

export interface UserAnalytics {
  total: number;
  new_today?: number;
  new_this_week?: number;
  active_today?: number;
  active_this_week?: number;
  retention_rate?: number;
}

export interface CodeAnalytics {
  total_codes: number;
  today?: number;
  this_week?: number;
  average_quality_score?: number;
  total_tokens_used?: number;
}

export interface FeedbackAnalytics {
  total: number;
  average_rating?: number;
  corrections: number;
  improvements: number;
  bugs: number;
  praise: number;
  pending_review: number;
}

export interface TrainingAnalytics {
  total_examples: number;
  active_examples: number;
  pending_suggestions: number;
  total_usage: number;
  most_used_types: Record<string, number>;
}

export interface ConversationAnalytics {
  total: number;
  active_today?: number;
  average_messages_per_conversation?: number;
  total_messages?: number;
}

export interface AnalyticsTrends {
  period: string;
  data: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  users?: number;
  codes?: number;
  feedback?: number;
  conversations?: number;
  messages?: number;
}

export interface LearningCurve {
  period: string;
  data: LearningDataPoint[];
}

export interface LearningDataPoint {
  date: string;
  quality_score?: number;
  corrections?: number;
  codes_generated?: number;
  training_items_added?: number;
}

export interface PopularPattern {
  id: string;
  title: string;
  training_type: TrainingType;
  usage_count: number;
  category: TrainingCategory;
  last_used_at?: string;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface AdminStatus {
  status: string;
  admin_id: string;
  stats: AdminStats;
  system_health: SystemHealth;
}

export interface AdminStats {
  total_users: number;
  total_documents: number;
  total_conversations: number;
  total_messages: number;
  training: TrainingStats;
  feedback: FeedbackStats;
}

export interface SystemHealth {
  database_status: 'healthy' | 'degraded' | 'down';
  api_status: 'healthy' | 'degraded' | 'down';
  storage_usage_percent?: number;
  last_check: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  is_admin: boolean;
  created_at: string;
  last_login?: string;
  codes_generated?: number;
  feedback_submitted?: number;
  conversations_count?: number;
}

export interface AdminConfig {
  admin_emails: string[];
  features: Record<string, boolean>;
  settings: Record<string, any>;
}

export interface AdminUserUpdateRequest {
  name?: string;
  nickname?: string;
  is_admin?: boolean;
}

// ============================================================================
// TEST & EVALUATION TYPES
// ============================================================================

export interface TrainingTestRequest {
  prompt: string;
  category?: TrainingCategory;
  include_training?: boolean;
  strategy_type?: string;
}

export interface TrainingTestResult {
  without_training: GenerationResult;
  with_training: GenerationResult;
  training_context_used?: string;
  differences_detected: boolean;
  quality_comparison?: QualityComparison;
  execution_time_comparison?: {
    without_training_ms: number;
    with_training_ms: number;
  };
}

export interface GenerationResult {
  code: string;
  explanation?: string;
  quality_score?: number;
  warnings?: string[];
  errors?: string[];
}

export interface QualityComparison {
  without_training_score: number;
  with_training_score: number;
  improvement_percent: number;
  specific_improvements: string[];
}

export interface TrainingEffectiveness {
  total_corrections: number;
  correction_rate: number;
  quality_improvement: number;
  most_effective_rules: TrainingData[];
  usage_statistics: UsageStatistics;
}

export interface UsageStatistics {
  total_uses: number;
  unique_users: number;
  average_uses_per_user: number;
  by_category: Record<string, number>;
  by_type: Record<string, number>;
}

// ============================================================================
// KNOWLEDGE & SEARCH TYPES
// ============================================================================

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  training_type: TrainingType;
  category: TrainingCategory;
  relevance_score: number;
  excerpt?: string;
  full_content?: string;
  created_at?: string;
}

export interface KnowledgeCategory {
  name: string;
  count: number;
  description?: string;
  subcategories?: string[];
}

export interface TrainingTypeInfo {
  type: TrainingType;
  description: string;
  count: number;
  example_use_case?: string;
}

// ============================================================================
// TOOL TYPES
// ============================================================================

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema?: ToolInputSchema;
  type?: string;
  max_uses?: number;
}

export interface ToolInputSchema {
  type: string;
  properties: Record<string, ToolProperty>;
  required: string[];
}

export interface ToolProperty {
  type: string;
  description: string;
  enum?: string[];
  default?: any;
}

export interface ToolCallRequest {
  tool_name: string;
  tool_input: Record<string, any>;
}

export interface ToolCallResult {
  success: boolean;
  result?: any;
  error?: string;
  execution_time_ms?: number;
}

// ============================================================================
// SETTINGS & PREFERENCES TYPES
// ============================================================================

export interface UserSettings {
  user_id: string;
  theme?: 'light' | 'dark' | 'system';
  accent_color?: string;
  default_strategy_type?: string;
  auto_validate_code?: boolean;
  show_explanations?: boolean;
  enable_notifications?: boolean;
  updated_at?: string;
}

export interface UserSettingsUpdateRequest {
  theme?: 'light' | 'dark' | 'system';
  accent_color?: string;
  default_strategy_type?: string;
  auto_validate_code?: boolean;
  show_explanations?: boolean;
  enable_notifications?: boolean;
}

// ============================================================================
// UTILITY & COMMON TYPES
// ============================================================================

export interface ApiError {
  detail: string;
  status_code?: number;
  error_code?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: Record<string, ServiceStatus>;
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  latency_ms?: number;
  last_check?: string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Re-export for convenience
  Message as ChatMessage,
  Conversation as ChatConversation,
  Document as KnowledgeDocument,
  Strategy as TradingStrategy,
};