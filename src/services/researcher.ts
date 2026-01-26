import { apiClient } from '../lib/api';

class ResearcherApi {
  async getCompanyResearch(symbol) {
    return apiClient.request(`/api/researcher/company/${symbol}`, 'GET');
  }

  async getCompanyNews(symbol, limit = 20) {
    return apiClient.request(`/api/researcher/news/${symbol}?limit=${limit}`, 'GET');
  }

  async analyzeStrategyFit(symbol, strategyType, timeframe) {
    return apiClient.request('/api/researcher/strategy-analysis', 'POST', {
      symbol,
      strategy_type: strategyType,
      timeframe
    });
  }

  async getPeerComparison(symbol, peers) {
    return apiClient.request('/api/researcher/comparison', 'POST', {
      symbol,
      peers
    });
  }

  async getMacroContext() {
    return apiClient.request('/api/researcher/macro-context', 'GET');
  }

  async getSECFilings(symbol) {
    return apiClient.request(`/api/researcher/sec-filings/${symbol}`, 'GET');
  }

  async generateReport(symbol, reportType, sections, format = 'json') {
    return apiClient.request('/api/researcher/generate-report', 'POST', {
      symbol,
      report_type: reportType,
      sections,
      format
    });
  }

  async exportReport(reportId, format) {
    return apiClient.request(`/api/researcher/reports/${reportId}/export?format=${format}`, 'GET');
  }

  async searchResearch(query, searchType, limit = 10) {
    return apiClient.request(`/api/researcher/search?query=${encodeURIComponent(query)}&search_type=${searchType}&limit=${limit}`, 'GET');
  }

  async getTrendingResearch(limit = 10) {
    return apiClient.request(`/api/researcher/trending?limit=${limit}`, 'GET');
  }

  async getHealth() {
    return apiClient.request('/api/researcher/health', 'GET');
  }
}

export const researcherApi = new ResearcherApi();