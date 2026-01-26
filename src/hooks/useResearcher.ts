import { useState, useCallback, useEffect } from 'react';
import { researcherApi } from '../services/researcher';
import { 
  CompanyResearch, 
  StrategyAnalysis, 
  PeerComparison, 
  MacroContext, 
  ResearchReport, 
  NewsItem,
  ResearcherState 
} from '../types/researcher';

export const useResearcher = () => {
  const [state, setState] = useState<ResearcherState>({
    currentSymbol: null,
    reportType: 'company',
    comparisonSymbols: [],
    researchData: null,
    loading: false,
    error: null
  });

  const [companyData, setCompanyData] = useState<CompanyResearch | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [strategyAnalysis, setStrategyAnalysis] = useState<StrategyAnalysis | null>(null);
  const [peerComparison, setPeerComparison] = useState<PeerComparison | null>(null);
  const [macroContext, setMacroContext] = useState<MacroContext | null>(null);
  const [reports, setReports] = useState<ResearchReport[]>([]);

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const fetchCompanyResearch = useCallback(async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.getCompanyResearch(symbol);
      setCompanyData(data);
      setState(prev => ({ ...prev, researchData: data, currentSymbol: symbol }));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch company research';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompanyNews = useCallback(async (symbol: string, limit: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.getCompanyNews(symbol, limit);
      setNewsData(data.news);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch company news';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeStrategyFit = useCallback(async (symbol: string, strategyType: string, timeframe: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.analyzeStrategyFit(symbol, strategyType, timeframe);
      setStrategyAnalysis(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze strategy fit';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPeerComparison = useCallback(async (symbol: string, peers: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.getPeerComparison(symbol, peers);
      setPeerComparison(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get peer comparison';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMacroContext = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.getMacroContext();
      setMacroContext(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get macro context';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (
    symbol: string, 
    reportType: string, 
    sections: string[], 
    format: string = 'json'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const report = await researcherApi.generateReport(symbol, reportType, sections, format);
      setReports(prev => [...prev, report]);
      return report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (reportId: string, format: string) => {
    setLoading(true);
    setError(null);
    try {
      const exportData = await researcherApi.exportReport(reportId, format);
      return exportData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export report';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchResearch = useCallback(async (query: string, searchType: string, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.searchResearch(query, searchType, limit);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search research';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrendingResearch = useCallback(async (limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.getTrendingResearch(limit);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get trending research';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await researcherApi.getHealth();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get health status';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // State setters
  const setCurrentSymbol = useCallback((symbol: string) => {
    setState(prev => ({ ...prev, currentSymbol: symbol }));
  }, []);

  const setReportType = useCallback((type: 'company' | 'strategy' | 'comparison') => {
    setState(prev => ({ ...prev, reportType: type }));
  }, []);

  const addComparisonSymbol = useCallback((symbol: string) => {
    setState(prev => ({ 
      ...prev, 
      comparisonSymbols: [...prev.comparisonSymbols, symbol] 
    }));
  }, []);

  const removeComparisonSymbol = useCallback((symbol: string) => {
    setState(prev => ({ 
      ...prev, 
      comparisonSymbols: prev.comparisonSymbols.filter(s => s !== symbol) 
    }));
  }, []);

  const clearComparisonSymbols = useCallback(() => {
    setState(prev => ({ ...prev, comparisonSymbols: [] }));
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setState({
      currentSymbol: null,
      reportType: 'company',
      comparisonSymbols: [],
      researchData: null,
      loading: false,
      error: null
    });
    setCompanyData(null);
    setNewsData([]);
    setStrategyAnalysis(null);
    setPeerComparison(null);
    setMacroContext(null);
  }, []);

  return {
    // State
    ...state,
    companyData,
    newsData,
    strategyAnalysis,
    peerComparison,
    macroContext,
    reports,

    // Actions
    fetchCompanyResearch,
    fetchCompanyNews,
    analyzeStrategyFit,
    getPeerComparison,
    getMacroContext,
    generateReport,
    exportReport,
    searchResearch,
    getTrendingResearch,
    getHealth,
    setCurrentSymbol,
    setReportType,
    addComparisonSymbol,
    removeComparisonSymbol,
    clearComparisonSymbols,
    resetState,

    // Helpers
    setLoading,
    setError
  };
};