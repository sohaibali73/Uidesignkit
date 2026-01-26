import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, DollarSign, Users, Activity, BarChart3, Clock, Building, Users2, Shield, Zap } from 'lucide-react';

interface CompanyResearchTerminalProps {
  symbol: string;
}

const CompanyResearchTerminal: React.FC<CompanyResearchTerminalProps> = ({ symbol }) => {
  // Mock data for company research
  const financialData = [
    { year: '2020', revenue: 274.5, netIncome: 57.4, eps: 3.28 },
    { year: '2021', revenue: 365.8, netIncome: 94.7, eps: 5.61 },
    { year: '2022', revenue: 394.3, netIncome: 99.8, eps: 5.91 },
    { year: '2023', revenue: 383.3, netIncome: 97.0, eps: 5.79 },
    { year: '2024', revenue: 391.0, netIncome: 104.0, eps: 6.20 }
  ];

  const quarterlyData = [
    { quarter: 'Q1', revenue: 90.8, growth: 5.2 },
    { quarter: 'Q2', revenue: 89.5, growth: 3.8 },
    { quarter: 'Q3', revenue: 89.9, growth: 2.1 },
    { quarter: 'Q4', revenue: 120.8, growth: 8.5 }
  ];

  const insiderData = [
    { name: 'Tim Cook', role: 'CEO', transactions: 12, netShares: 50000 },
    { name: 'Luca Maestri', role: 'CFO', transactions: 8, netShares: 25000 },
    { name: 'Jeff Williams', role: 'COO', transactions: 6, netShares: 30000 },
    { name: 'Katherine Adams', role: 'General Counsel', transactions: 4, netShares: 15000 }
  ];

  const analystData = [
    { rating: 'Buy', count: 25, color: '#22c55e' },
    { rating: 'Hold', count: 8, color: '#f59e0b' },
    { rating: 'Sell', count: 2, color: '#ef4444' }
  ];

  const riskData = [
    { subject: 'Volatility', A: 65, B: 80, fullMark: 100 },
    { subject: 'Liquidity', A: 95, B: 70, fullMark: 100 },
    { subject: 'Valuation', A: 45, B: 60, fullMark: 100 },
    { subject: 'Growth', A: 85, B: 75, fullMark: 100 },
    { subject: 'Profitability', A: 90, B: 85, fullMark: 100 },
    { subject: 'Debt', A: 70, B: 50, fullMark: 100 }
  ];

  const ownershipData = [
    { name: 'Institutional', value: 61, color: '#3b82f6' },
    { name: 'Insider', value: 0.05, color: '#22c55e' },
    { name: 'Public', value: 38.95, color: '#f59e0b' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">COMPANY RESEARCH</span>
            <span className="text-xs text-gray-600">AAPL</span>
            <span className="text-white font-bold">APPLE INC.</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-500">SECTOR:</span>
            <span className="text-blue-400 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/50">
              TECHNOLOGY
            </span>
            <span className="text-gray-500">INDUSTRY:</span>
            <span className="text-purple-400 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/50">
              CONSUMER ELECTRONICS
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6 grid grid-cols-12 gap-6">
        
        {/* Top Row - Company Overview */}
        <div className="col-span-8 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">COMPANY OVERVIEW</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">$157.10</div>
              <div className="text-sm text-green-400">+2.85 (+1.85%)</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-2">MARKET CAP</div>
              <div className="text-white font-bold">$2.96T</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">P/E RATIO</div>
              <div className="text-white font-bold">29.5</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">DIVIDEND YIELD</div>
              <div className="text-white font-bold">0.45%</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">52W HIGH</div>
              <div className="text-green-400 font-bold">$204.62</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">52W LOW</div>
              <div className="text-red-400 font-bold">$164.08</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">BETA</div>
              <div className="text-white font-bold">1.25</div>
            </div>
          </div>
        </div>

        {/* Top Right - Analyst Consensus */}
        <div className="col-span-4 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Users2 className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">ANALYST CONSENSUS</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analystData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {analystData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {analystData.map((rating, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-500">{rating.rating}</span>
                <span className="text-white">{rating.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500">TARGET PRICE</div>
            <div className="text-lg font-bold text-white">$195.23</div>
            <div className="text-xs text-green-400">+24.2% Upside</div>
          </div>
        </div>

        {/* Financial Performance Chart */}
        <div className="col-span-8 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">FINANCIAL PERFORMANCE</span>
            </div>
            <div className="flex space-x-2">
              <button className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700">
                Revenue
              </button>
              <button className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700">
                Net Income
              </button>
              <button className="text-xs px-2 py-1 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700">
                EPS
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={10}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    color: '#ffffff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="netIncome" 
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Performance */}
        <div className="col-span-4 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-gray-400">QUARTERLY PERFORMANCE</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="quarter" 
                  stroke="#9ca3af"
                  fontSize={10}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={10}
                />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {quarterlyData.map((quarter, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-500">{quarter.quarter}</span>
                <div className="flex space-x-2">
                  <span className="text-white">${quarter.revenue}B</span>
                  <span className={`font-bold ${quarter.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {quarter.growth > 0 ? '+' : ''}{quarter.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="col-span-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-4 w-4 text-red-400" />
            <span className="text-sm text-gray-400">RISK ANALYSIS</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={riskData}>
                <PolarGrid gridType="circle" stroke="#374151" />
                <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={10} />
                <PolarRadiusAxis angle={60} domain={[0, 100]} stroke="#9ca3af" fontSize={10} />
                <Radar name="Apple" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Radar name="Industry Avg" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insider Activity */}
        <div className="col-span-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">INSIDER ACTIVITY</span>
          </div>
          <div className="space-y-3">
            {insiderData.map((insider, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-700">
                <div>
                  <div className="text-white font-bold">{insider.name}</div>
                  <div className="text-xs text-gray-500">{insider.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">+{insider.netShares.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{insider.transactions} transactions</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500">NET INSIDER POSITION</div>
            <div className="text-lg font-bold text-green-400">+120,000 shares</div>
            <div className="text-xs text-green-400">Bullish Signal</div>
          </div>
        </div>

        {/* Ownership Structure */}
        <div className="col-span-4 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-400">OWNERSHIP STRUCTURE</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ownershipData}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ownershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {ownershipData.map((owner, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-gray-500">{owner.name}</span>
                <span className="text-white">{owner.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="col-span-4 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">KEY METRICS</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-800 p-2 rounded border border-gray-700">
                <div className="text-gray-500">ROE</div>
                <div className="text-white font-bold">156%</div>
              </div>
              <div className="bg-gray-800 p-2 rounded border border-gray-700">
                <div className="text-gray-500">ROA</div>
                <div className="text-white font-bold">22%</div>
              </div>
              <div className="bg-gray-800 p-2 rounded border border-gray-700">
                <div className="text-gray-500">Debt/Equity</div>
                <div className="text-white font-bold">1.98</div>
              </div>
              <div className="bg-gray-800 p-2 rounded border border-gray-700">
                <div className="text-gray-500">Current Ratio</div>
                <div className="text-white font-bold">0.97</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="col-span-4 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">AI ANALYSIS</span>
          </div>
          <div className="text-xs space-y-2">
            <div className="text-green-400 font-bold">STRENGTHS</div>
            <div className="text-gray-300">• Strong brand loyalty and ecosystem lock-in</div>
            <div className="text-gray-300">• Consistent cash flow generation</div>
            <div className="text-gray-300">• Leading position in premium smartphone market</div>
            
            <div className="text-red-400 font-bold mt-2">RISKS</div>
            <div className="text-gray-300">• Heavy reliance on iPhone revenue</div>
            <div className="text-gray-300">• Regulatory scrutiny in multiple jurisdictions</div>
            <div className="text-gray-300">• Supply chain dependencies</div>
            
            <div className="text-blue-400 font-bold mt-2">OUTLOOK</div>
            <div className="text-gray-300">• Services growth expected to accelerate</div>
            <div className="text-gray-300">• AR/VR potential long-term catalyst</div>
            <div className="text-gray-300">• AI integration opportunities</div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center space-x-4 text-gray-500">
            <span>DATA SOURCE: REAL-TIME</span>
            <span>ANALYSIS: AI-POWERED</span>
            <span>LAST UPDATED: 16:00:00 EST</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <span>CONFIDENCE: 94%</span>
            <span>RISK LEVEL: MODERATE</span>
            <span>RECOMMENDATION: HOLD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyResearchTerminal;