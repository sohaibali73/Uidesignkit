import React, { useState } from 'react';
import {
  Sparkles,
  GitBranch,
  Lightbulb,
  BarChart3,
  Database,
  Search,
  Settings,
  Bell,
  User,
  ChevronDown,
  Play,
  Code,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Upload,
  Copy,
  Plus,
  Activity,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Globe,
  Newspaper,
  BarChart2,
  TrendingDown,
  ExternalLink,
  Clock,
  X,
  Heart
} from 'lucide-react';
import logoFull from 'figma:asset/b6f4dd51f4a6c34cb4d10bae287dadeedec5a8d0.png';

interface AnalystPrototypeProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function AnalystPrototype({ darkMode, setDarkMode }: AnalystPrototypeProps) {
  const [activeMode, setActiveMode] = useState<'generate' | 'reverse' | 'ideas' | 'analyze' | 'knowledge' | 'market'>('generate');
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const modes = [
    { id: 'generate', label: 'GENERATE', icon: Sparkles, description: 'AFL Code Generation' },
    { id: 'reverse', label: 'REVERSE ENGINEERING', icon: GitBranch, description: 'Strategy Flowcharts' },
    { id: 'ideas', label: 'IDEAS', icon: Lightbulb, description: 'Strategy Discovery' },
    { id: 'analyze', label: 'ANALYZE', icon: BarChart3, description: 'Backtest Analysis' },
    { id: 'market', label: 'MARKET RESEARCH', icon: Globe, description: 'Market Analysis' },
    { id: 'knowledge', label: 'KNOWLEDGE BASE', icon: Database, description: 'Knowledge Manager' }
  ];

  const sampleStrategies = [
    { name: 'Moving Average Crossover', performance: '+24.5%', sharpe: '1.82', winRate: '64%' },
    { name: 'RSI Divergence', performance: '+18.3%', sharpe: '1.54', winRate: '58%' },
    { name: 'Bollinger Breakout', performance: '+31.2%', sharpe: '2.11', winRate: '71%' },
    { name: 'MACD Momentum', performance: '+15.7%', sharpe: '1.38', winRate: '55%' }
  ];

  const sampleCode = `// Moving Average Crossover Strategy
_SECTION_BEGIN("Moving Averages");
FastMA = MA(Close, 10);
SlowMA = MA(Close, 30);

Buy = Cross(FastMA, SlowMA);
Sell = Cross(SlowMA, FastMA);

PlotShapes(IIf(Buy, shapeUpArrow, shapeNone), colorGreen);
PlotShapes(IIf(Sell, shapeDownArrow, shapeNone), colorRed);
_SECTION_END();`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} border-b ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'}`}>
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoFull} alt="Potomac" className="h-8" />
            <div className={`h-8 w-px ${darkMode ? 'bg-[#424242]' : 'bg-[#E0E0E0]'}`}></div>
            <div>
              <h1 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                ANALYST
              </h1>
              <p className={`font-['Quicksand'] text-[10px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                by Potomac Fund Management
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}>
              <Search className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'} relative`}>
              <Bell className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FEC00F] rounded-full"></span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}
            >
              <Settings className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            <button className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
              <User className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
              <span className={`font-['Quicksand'] text-sm ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                S. Ali
              </span>
            </button>
          </div>
        </div>

        {/* Mode Navigation */}
        <div className={`px-6 flex gap-1 border-t ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'}`}>
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#FEC00F] text-[#FEC00F]'
                    : `border-transparent ${darkMode ? 'text-[#9E9E9E] hover:text-white' : 'text-[#757575] hover:text-[#212121]'}`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-['Rajdhani'] text-[14px] font-semibold tracking-wider">
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeMode === 'generate' && (
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
                AFL CODE GENERATOR
              </h2>
              <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Generate AFL code from natural language descriptions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-3 block`}>
                  STRATEGY DESCRIPTION
                </label>
                <textarea
                  placeholder="Describe your trading strategy... (e.g., Buy when 10-day MA crosses above 30-day MA)"
                  className={`w-full h-48 px-4 py-3 rounded-lg border ${
                    darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                  } font-['Quicksand'] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                  defaultValue="Create a moving average crossover strategy. Buy when the 10-day moving average crosses above the 30-day moving average. Sell when it crosses below."
                />
                
                <div className="mt-4 flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors">
                    <Sparkles className="w-4 h-4" />
                    GENERATE CODE
                  </button>
                  <button className={`px-4 py-2 rounded-lg border ${
                    darkMode ? 'border-[#424242] text-[#9E9E9E] hover:bg-[#2A2A2A]' : 'border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'
                  } font-['Rajdhani'] text-[14px] font-semibold transition-colors`}>
                    CLEAR
                  </button>
                </div>
              </div>

              {/* Output Panel */}
              <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    GENERATED AFL CODE
                  </label>
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}>
                      <Copy className={`w-4 h-4 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                    </button>
                    <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}>
                      <Download className={`w-4 h-4 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                    </button>
                  </div>
                </div>
                <pre className={`w-full h-48 px-4 py-3 rounded-lg ${
                  darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'
                } font-mono text-[12px] overflow-auto ${darkMode ? 'text-[#BFFF00]' : 'text-[#1B5E20]'}`}>
{sampleCode}
                </pre>
                
                <div className="mt-4 flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors">
                    <Play className="w-4 h-4" />
                    TEST IN AMIBROKER
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'market' && (
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
                MARKET RESEARCH
              </h2>
              <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Real-time market analysis, news, and insights
              </p>
            </div>

            {/* Stock Chart */}
            <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6 mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`font-['Rajdhani'] text-[20px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-1`}>
                    S&P 500 INDEX (^GSPC)
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`font-['Rajdhani'] text-[28px] font-bold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      4,783.45
                    </span>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="font-['Rajdhani'] text-[16px] font-semibold text-green-500">
                        +42.18 (+0.89%)
                      </span>
                    </div>
                    <span className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      As of Jan 14, 2026 3:45 PM EST
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className={`px-3 py-1 rounded ${darkMode ? 'bg-[#2A2A2A] text-[#9E9E9E]' : 'bg-[#F5F5F5] text-[#757575]'} font-['Quicksand'] text-[12px]`}>
                    1D
                  </button>
                  <button className="px-3 py-1 rounded bg-[#FEC00F] text-[#212121] font-['Quicksand'] text-[12px] font-semibold">
                    5D
                  </button>
                  <button className={`px-3 py-1 rounded ${darkMode ? 'bg-[#2A2A2A] text-[#9E9E9E]' : 'bg-[#F5F5F5] text-[#757575]'} font-['Quicksand'] text-[12px]`}>
                    1M
                  </button>
                  <button className={`px-3 py-1 rounded ${darkMode ? 'bg-[#2A2A2A] text-[#9E9E9E]' : 'bg-[#F5F5F5] text-[#757575]'} font-['Quicksand'] text-[12px]`}>
                    YTD
                  </button>
                  <button className={`px-3 py-1 rounded ${darkMode ? 'bg-[#2A2A2A] text-[#9E9E9E]' : 'bg-[#F5F5F5] text-[#757575]'} font-['Quicksand'] text-[12px]`}>
                    1Y
                  </button>
                </div>
              </div>
              
              <div className={`w-full h-80 rounded-lg ${darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'} p-4 relative`}>
                <svg className="w-full h-full" viewBox="0 0 800 300">
                  <line x1="0" y1="75" x2="800" y2="75" stroke={darkMode ? '#424242' : '#E0E0E0'} strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke={darkMode ? '#424242' : '#E0E0E0'} strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="225" x2="800" y2="225" stroke={darkMode ? '#424242' : '#E0E0E0'} strokeWidth="1" strokeDasharray="5,5" />
                  <polyline points="0,200 80,185 160,180 240,165 320,170 400,150 480,145 560,130 640,125 720,110 800,105" fill="none" stroke="#22C55E" strokeWidth="3" />
                  <polygon points="0,200 80,185 160,180 240,165 320,170 400,150 480,145 560,130 640,125 720,110 800,105 800,300 0,300" fill="url(#gradient)" opacity="0.2" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Market News and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 ${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className={`w-5 h-5 ${darkMode ? 'text-[#FEC00F]' : 'text-[#FEC00F]'}`} />
                  <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    MARKET NEWS
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { title: 'Fed Signals Potential Rate Cut in Q2 2026', source: 'Bloomberg', time: '2 hours ago', sentiment: 'positive' },
                    { title: 'Tech Stocks Rally on Strong Earnings Reports', source: 'Reuters', time: '4 hours ago', sentiment: 'positive' },
                    { title: 'Oil Prices Drop Amid Supply Concerns', source: 'CNBC', time: '6 hours ago', sentiment: 'negative' },
                    { title: 'Cryptocurrency Market Shows Signs of Recovery', source: 'CoinDesk', time: '8 hours ago', sentiment: 'positive' }
                  ].map((news, idx) => (
                    <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-[#1A1A1A] hover:bg-[#2A2A2A]' : 'bg-[#FAFAFA] hover:bg-[#F5F5F5]'} cursor-pointer transition-colors`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className={`font-['Rajdhani'] text-[15px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-1`}>
                            {news.title}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                              {news.source}
                            </span>
                            <span className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#757575]' : 'text-[#9E9E9E]'}`}>
                              • {news.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {news.sentiment === 'positive' ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <ExternalLink className={`w-4 h-4 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className={`w-5 h-5 ${darkMode ? 'text-[#FEC00F]' : 'text-[#FEC00F]'}`} />
                    <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      ECONOMIC DATA
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          GDP Growth
                        </span>
                        <span className={`font-['Rajdhani'] text-[14px] font-semibold text-green-500`}>
                          +3.2%
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
                        <div className="h-full w-[65%] bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          Unemployment
                        </span>
                        <span className={`font-['Rajdhani'] text-[14px] font-semibold text-green-500`}>
                          3.7%
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
                        <div className="h-full w-[37%] bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          Inflation (CPI)
                        </span>
                        <span className={`font-['Rajdhani'] text-[14px] font-semibold text-red-500`}>
                          4.1%
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
                        <div className="h-full w-[82%] bg-red-500 rounded-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          Interest Rate
                        </span>
                        <span className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                          5.25%
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
                        <div className="h-full w-[52%] bg-[#FEC00F] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
                  <h3 className={`font-['Rajdhani'] text-[16px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-3`}>
                    ANALYST CONSENSUS
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        Bullish
                      </span>
                      <span className={`font-['Rajdhani'] text-[14px] font-semibold text-green-500`}>
                        62%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        Neutral
                      </span>
                      <span className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                        25%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        Bearish
                      </span>
                      <span className={`font-['Rajdhani'] text-[14px] font-semibold text-red-500`}>
                        13%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Ideas */}
            <div className={`mt-6 ${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className={`w-5 h-5 ${darkMode ? 'text-[#FEC00F]' : 'text-[#FEC00F]'}`} />
                <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                  TRADE IDEAS
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { symbol: 'AAPL', action: 'BUY', price: '$185.20', target: '$205.00', confidence: 'HIGH', timeframe: '3-6 months' },
                  { symbol: 'TSLA', action: 'SELL', price: '$238.45', target: '$210.00', confidence: 'MEDIUM', timeframe: '1-3 months' },
                  { symbol: 'NVDA', action: 'BUY', price: '$512.30', target: '$580.00', confidence: 'HIGH', timeframe: '6-12 months' }
                ].map((idea, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    idea.action === 'BUY' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-[#212121]'}`} />
                        <span className={`font-['Rajdhani'] text-[18px] font-bold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                          {idea.symbol}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-[11px] font-['Rajdhani'] font-semibold ${
                        idea.action === 'BUY' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {idea.action}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          Entry
                        </span>
                        <span className={`font-['Rajdhani'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                          {idea.price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          Target
                        </span>
                        <span className={`font-['Rajdhani'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                          {idea.target}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          Confidence
                        </span>
                        <span className={`font-['Rajdhani'] text-[11px] font-semibold px-2 py-0.5 rounded ${
                          idea.confidence === 'HIGH' ? 'bg-[#FEC00F] text-[#212121]' : 'bg-[#757575] text-white'
                        }`}>
                          {idea.confidence}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className={`w-3 h-3 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                        <span className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                          {idea.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className={`p-6 border-b ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} flex items-center justify-between`}>
              <h2 className={`font-['Rajdhani'] text-[24px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                SETTINGS
              </h2>
              <button onClick={() => setShowSettings(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}>
                <X className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-4`}>
                  GENERAL
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                        Notifications
                      </p>
                      <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        Receive alerts for market changes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-[#424242] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FEC00F]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                        Auto-save
                      </p>
                      <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        Automatically save your work
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-[#424242] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FEC00F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg border-2 ${darkMode ? 'border-[#FEC00F]/30 bg-[#FEC00F]/5' : 'border-[#FEC00F]/50 bg-[#FEC00F]/10'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-[#FEC00F]" />
                  <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    CREDITS
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-[#FEC00F]/20' : 'bg-[#FEC00F]/30'} flex items-center justify-center`}>
                        <User className="w-6 h-6 text-[#FEC00F]" />
                      </div>
                      <div>
                        <p className={`font-['Rajdhani'] text-[16px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                          DEVELOPED BY
                        </p>
                        <p className={`font-['Quicksand'] text-[14px] text-[#FEC00F]`}>
                          Sohaib Ali
                        </p>
                      </div>
                    </div>
                    <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      Lead Developer & Architect
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-[#FEC00F]/20' : 'bg-[#FEC00F]/30'} flex items-center justify-center`}>
                        <Heart className="w-6 h-6 text-[#FEC00F]" />
                      </div>
                      <div>
                        <p className={`font-['Rajdhani'] text-[16px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                          SPECIAL THANKS TO
                        </p>
                        <p className={`font-['Quicksand'] text-[14px] text-[#FEC00F]`}>
                          Shyam Patel
                        </p>
                      </div>
                    </div>
                    <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      Project Guidance & Support
                    </p>
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'}`}>
                  <p className={`font-['Quicksand'] text-[11px] text-center ${darkMode ? 'text-[#757575]' : 'text-[#9E9E9E]'}`}>
                    © 2025 POTOMAC FUND MANAGEMENT • ANALYST PLATFORM v1.0
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} flex justify-end gap-3`}>
              <button onClick={() => setShowSettings(false)} className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-[#424242] text-[#9E9E9E] hover:bg-[#2A2A2A]' : 'border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'} font-['Rajdhani'] text-[14px] font-semibold transition-colors`}>
                CANCEL
              </button>
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors">
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
