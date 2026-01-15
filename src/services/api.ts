// services/api.ts
const API_BASE_URL = 'http://127.0.0.1:8000';

export const analystApi = {
  // 1. Generate or Reverse Engineer AFL
  processAfl: async (prompt: string, mode: string, apiKey: string) => {
    const endpoint = mode === 'reverse' ? '/reverse-engineer' : '/process-afl';
    
    // If it's reverse, we send a query param; if generate, we send a body
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        prompt: prompt,
        mode: mode,
        strategy_type: 'standalone'
      })
    });

    if (!response.ok) throw new Error('Failed to connect to Potomac Engine');
    return response.json();
  },

  // 2. Health Check
  checkStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.json();
  }
};