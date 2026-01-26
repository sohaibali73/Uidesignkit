import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Users, Activity, BarChart3, Clock } from 'lucide-react';

interface TerminalDashboardProps {
  symbol?: string;
}

const TerminalDashboard: React.FC<TerminalDashboardProps> = ({ symbol }) => {
  // Mock data for charts
  const priceData = [
    { time: '09:30', price: 150.25 },
    { time: '10:00', price: 151.10 },
    { time: '10:30', price: 149.80 },
    { time: '11:00', price: 152.45 },
    { time: '11:30', price: 151.90 },
    { time: '12:00', price: 153.20 },
    { time: '12:30', price: 152.80 },
    { time: '13:00', price: 154.10 },
    { time: '13:30', price: 153.75 },
    { time: '14:00', price: 155.20 },
    { time: '14:30', price: 154.80 },
    { time: '15:00', price: 156.30 },
    { time: '15:30', price: 155.90 },
    { time: '16:00', price: 157.10 }
  ];

  const volumeData = [
    { time: '09:30', volume: 1200 },
    { time: '10:00', volume: 1800 },
    { time: '10:30', volume: 900 },
    { time: '11:00', volume: 2100 },
    { time: '11:30', volume: 1500 },
    { time: '12:00', volume: 1900 },
    { time: '12:30', volume: 1100 },
    { time: '13:00', volume: 2200 },
    { time: '13:30', volume: 1600 },
    { time: '14:00', volume: 2400 },
    { time: '14:30', volume: 1800 },
    { time: '15:00', volume: 2600 },
    { time: '15:30', volume: 2000 },
    { time: '16:00', volume: 3000 }
  ];

  const sectorAllocation = [
    { name: 'Technology', value: 45, color: '#22c55e' },
    { name: 'Healthcare', value: 20, color: '#3b82f6' },
    { name: 'Financial', value: 15, color: '#f59e0b' },
    { name: 'Consumer', value: 12, color: '#ef4444' },
    { name: 'Energy', value: 8, color: '#8b5cf6' }
  ];

  const riskMetrics = [
    { metric: 'Beta', value: 1.25, color: '#3b82f6' },
    { metric: 'Volatility', value: 0.18, color: '#f59e0b' },
    { metric: 'Sharpe', value: 1.42, color: '#22c55e' },
    { metric: 'Max Drawdown', value: -0.12, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">TERMINAL DASHBOARD</span>
            <span className="text-xs text-gray-600">v2.1.0</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-500">MARKET STATUS:</span>
            <span className="text-green-400 bg-green-500/20 px-2 py-1 rounded border border-green-500/50">
              OPEN
            </span>
            <span className="text-gray-500">TIME:</span>
            <span className="text-white">16:00:00 EST</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6 grid grid-cols-12 gap-6">
        
        {/* Left Column - Price Chart */}
        <div className="col-span-8 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">LIVE PRICE CHART</span>
              <span className="text-xs text-gray-600">AAPL</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">$157.10</div>
              <div className="text-sm text-green-400">+2.85 (+1.85%)</div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af"
                  fontSize={10}
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
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Metrics */}
        <div className="col-span-4 space-y-6">
          
          {/* Key Metrics */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">KEY METRICS</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Market Cap</span>
                <span className="text-white">$2.96T</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">P/E Ratio</span>
                <span className="text-white">29.5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dividend Yield</span>
                <span className="text-white">0.45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Volume</span>
                <span className="text-white">3.2M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Beta</span>
                <span className="text-white">1.25</span>
              </div>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">VOLUME</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af"
                    fontSize={10}
                    tick={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={10}
                    tick={false}
                  />
                  <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector Allocation */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <PieChart className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">SECTOR ALLOCATION</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sectorAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1">
              {sectorAllocation.map((sector, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-500">{sector.name}</span>
                  <span className="text-white">{sector.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - Risk Metrics */}
        <div className="col-span-12 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-gray-400">RISK METRICS</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {riskMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-800 rounded p-3 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{metric.metric}</span>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  ></div>
                </div>
                <div className="text-lg font-bold text-white">
                  {typeof metric.value === 'number' && metric.value < 0 ? '-' : ''}
                  {Math.abs(metric.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Market Overview */}
        <div className="col-span-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">MARKET OVERVIEW</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">S&P 500</span>
                <span className="text-green-400">+0.45%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Dow Jones</span>
                <span className="text-green-400">+0.32%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nasdaq</span>
                <span className="text-red-400">-0.15%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">VIX</span>
                <span className="text-white">18.5</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Fear & Greed</span>
                <span className="text-yellow-400">Neutral</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Market Cap</span>
                <span className="text-white">$45.2T</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - News Feed */}
        <div className="col-span-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Newspaper className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">LATEST NEWS</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-start text-xs">
              <div>
                <div className="text-white font-bold">Apple Reports Q4 Earnings Beat</div>
                <div className="text-gray-500">Revenue up 8% YoY, iPhone sales exceed expectations</div>
              </div>
              <div className="text-green-400 text-right">
                <div>+2.1%</div>
                <div className="text-gray-500">Impact</div>
              </div>
            </div>
            <div className="flex justify-between items-start text-xs">
              <div>
                <div className="text-white font-bold">Supply Chain Issues Resolved</div>
                <div className="text-gray-500">Production ramping up ahead of holiday season</div>
              </div>
              <div className="text-green-400 text-right">
                <div>+1.2%</div>
                <div className="text-gray-500">Impact</div>
              </div>
            </div>
            <div className="flex justify-between items-start text-xs">
              <div>
                <div className="text-white font-bold">New Product Launch Announced</div>
                <div className="text-gray-500">Next-generation devices expected Q1 2024</div>
              </div>
              <div className="text-blue-400 text-right">
                <div>+0.8%</div>
                <div className="text-gray-500">Impact</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center space-x-4 text-gray-500">
            <span>SYSTEM STATUS: ONLINE</span>
            <span>DATA FEED: ACTIVE</span>
            <span>AI ANALYSIS: ENABLED</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <span>LAST UPDATE: 16:00:00 EST</span>
            <span>MEMORY USAGE: 45%</span>
            <span>CPU USAGE: 12%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalDashboard;