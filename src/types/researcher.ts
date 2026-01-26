export interface CompanyResearch {
  symbol: string;
  company_name: string;
  sector: string;
  industry: string;
  description: string;
  fundamentals: {
    market_cap: number;
    pe_ratio: number;
    dividend_yield: number;
    earnings_growth: number;
    revenue_growth: number;
  };
  financial_health: {
    debt_to_equity: number;
    current_ratio: number;
    roe: number;
    roa: number;
  };
  analyst_consensus: {
    target_price: number;
    ratings: { buy: number; hold: number; sell: number };
    sentiment: string;
  };
  insider_activity: {
    recent_buys: number;
    recent_sells: number;
    net_insider_position: number;
  };
  sec_filings: SEC Filing[];
  news: NewsItem[];
  ai_summary: string;
}

export interface NewsItem {
  headline: string;
  source: string;
  timestamp: string;
  sentiment: {
    score: number;
    confidence: number;
  };
  summary: string;
  url: string;
}

export interface SEC Filing {
  type: string;
  date: string;
  summary: string;
  key_metrics: Record<string, any>;
  url: string;
}

export interface StrategyAnalysis {
  symbol: string;
  strategy: string;
  market_regime: string;
  strategy_fit: string;
  confidence: number;
  recommendation: string;
  risks: string[];
  opportunities: string[];
  adjusted_parameters: Record<string, any>;
}

export interface PeerComparison {
  company: string;
  peers: string[];
  comparison: Record<string, Record<string, number>>;
  analysis: string;
  recommendation: string;
}

export interface MacroContext {
  fed_rate: number;
  inflation: number;
  unemployment: number;
  gdp_growth: number;
  sentiment_index: number;
  market_outlook: string;
  upcoming_events: MacroEvent[];
}

export interface MacroEvent {
  event: string;
  date: string;
  expected_impact: string;
  market_reaction_guide: string;
}

export interface ResearchReport {
  report_id: string;
  title: string;
  generated_at: string;
  sections: ReportSection[];
  export_options: string[];
  export_format: string;
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface ResearcherState {
  currentSymbol: string | null;
  reportType: 'company' | 'strategy' | 'comparison';
  comparisonSymbols: string[];
  researchData: any;
  loading: boolean;
  error: string | null;
}

export interface ResearchHistory {
  id: string;
  user_id: string;
  symbol: string;
  research_type: 'company' | 'strategy' | 'comparison' | 'macro' | 'report';
  query_text: string;
  result_summary: string;
  created_at: string;
}

export interface ResearchStats {
  user_stats: {
    total_researches: number;
    total_reports: number;
    strategy_analyses: number;
    peer_comparisons: number;
  };
  recent_activity: ResearchHistory[];
  research_types: string[];
  symbols_researched: string[];
}

export interface EconomicIndicator {
  indicator: string;
  value: number;
  change: number;
  change_percent: number;
  last_updated: string;
}

export interface MarketSentiment {
  index: number;
  sentiment: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
  last_updated: string;
}

export interface InsiderTrade {
  symbol: string;
  name: string;
  relationship: string;
  transaction_type: 'buy' | 'sell';
  shares_traded: number;
  price: number;
  date: string;
}

export interface AnalystRating {
  symbol: string;
  buy: number;
  hold: number;
  sell: number;
  target_price: number;
  average_rating: number;
  last_updated: string;
}

export interface EarningsEstimate {
  symbol: string;
  current_quarter: number;
  next_quarter: number;
  current_year: number;
  next_year: number;
  last_updated: string;
}

export interface ResearchSearchResult {
  type: 'company' | 'strategy' | 'macro' | 'report';
  symbol?: string;
  title: string;
  description: string;
  relevance_score: number;
  last_updated: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  default_format: string;
  created_at: string;
}

export interface ReportExport {
  report_id: string;
  format: string;
  download_url: string;
  expires_at: string;
  file_size: number;
}

export interface ResearcherHealth {
  status: string;
  services: {
    openbb: boolean;
    finnhub: boolean;
    fred: boolean;
    sec: boolean;
    news: boolean;
    ai: boolean;
  };
  cache_status: {
    redis: boolean;
    memory: boolean;
  };
  last_updated: string;
}