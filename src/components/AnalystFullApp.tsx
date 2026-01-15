import React, { useState, useEffect } from 'react';
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
  Heart,
  FileText,
  Share2,
  Save,
  RefreshCw,
  TrendingUpIcon,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  Maximize2,
  MinusCircle,
  PlusCircle,
  ArrowRight,
  Info,
  BookOpen,
  FolderOpen,
  Tag,
  Link as LinkIcon
} from 'lucide-react';
import logoFull from 'figma:asset/b6f4dd51f4a6c34cb4d10bae287dadeedec5a8d0.png';
import { SetupWizard, SetupData } from './SetupWizard';

interface AnalystFullAppProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function AnalystFullApp({ darkMode, setDarkMode }: AnalystFullAppProps) {
  // --- 1. CORE APPLICATION STATE ---
  const [showSplash, setShowSplash] = useState(true);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [activeMode, setActiveMode] = useState<'generate' | 'reverse' | 'ideas' | 'analyze' | 'knowledge' | 'market'>('generate');
  const [showSettings, setShowSettings] = useState(false);
  const [userData, setUserData] = useState<SetupData | null>(null);

  // --- 2. ENGINE & API STATE ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("// Ready for strategy input...");
  const [schematicData, setSchematicData] = useState<any>(null); 
  const [promptText, setPromptText] = useState<string>(""); // Added to track input field

  // --- 3. LIFECYCLE & INITIALIZATION ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      const isSetupComplete = localStorage.getItem('analystSetupComplete');
      
      if (!isSetupComplete) {
        setShowSetupWizard(true);
      } else {
        setSetupComplete(true);
        // Load existing user data if available
        const savedData = localStorage.getItem('analystUserData');
        if (savedData) setUserData(json.parse(savedData));
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSetupComplete = (data: SetupData) => {
    setUserData(data);
    setSetupComplete(true);
    setShowSetupWizard(false);
    
    // CRITICAL: Store setup state and API keys for the Backend
    localStorage.setItem('analystSetupComplete', 'true');
    localStorage.setItem('analystUserData', JSON.stringify(data));
    
    if (data.preferences.defaultMode) {
      setActiveMode(data.preferences.defaultMode as any);
    }
  };

  const skipSplash = () => {
    setShowSplash(false);
    const isSetupComplete = localStorage.getItem('analystSetupComplete');
    if (!isSetupComplete) {
      setShowSetupWizard(true);
    } else {
      setSetupComplete(true);
    }
  };

  const modes = [
    { id: 'generate', label: 'GENERATE', icon: Sparkles, description: 'AFL Code Generation' },
    { id: 'reverse', label: 'REVERSE ENGINEERING', icon: GitBranch, description: 'Strategy Flowcharts' },
    { id: 'ideas', label: 'IDEAS', icon: Lightbulb, description: 'Strategy Discovery' },
    { id: 'analyze', label: 'ANALYZE', icon: BarChart3, description: 'Backtest Analysis' },
    { id: 'market', label: 'MARKET RESEARCH', icon: Globe, description: 'Market Analysis' },
    { id: 'knowledge', label: 'KNOWLEDGE BASE', icon: Database, description: 'Knowledge Manager' }
  ];

  // --- 4. ENGINE LOGIC ---
  const handleRunStrategy = async () => {
    if (!promptText) return;
    
    setIsGenerating(true);
    try {
      // Pull API key from userData (Set in Wizard) or fallback to env
      const apiKey = userData?.apiConnections.alphavantage || ""; // Replace with your Claude field
      
      const result = await analystApi.processAfl(promptText, activeMode, apiKey);
      
      setGeneratedCode(result.afl_code);
      setSchematicData(result.schematic);
    } catch (error) {
      console.error("Engine Error:", error);
      setGeneratedCode("// Error connecting to Potomac Engine. Check terminal.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 5. RENDER SPLASH/WIZARD ---
  if (showSplash) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <svg width="400" height="200" viewBox="0 0 400 200" className="animate-pulse">
              <defs>
                <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF0000">
                    <animate attributeName="stop-color" values="#FF0000;#FF7F00;#FFFF00;#00FF00;#0000FF;#4B0082;#9400D3;#FF0000" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#00FF00">
                    <animate attributeName="stop-color" values="#00FF00;#0000FF;#4B0082;#9400D3;#FF0000;#FF7F00;#FFFF00;#00FF00" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#0000FF">
                    <animate attributeName="stop-color" values="#0000FF;#4B0082;#9400D3;#FF0000;#FF7F00;#FFFF00;#00FF00;#0000FF" dur="3s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="396" height="196" fill="none" stroke="url(#rainbow)" strokeWidth="4" rx="12">
                <animate attributeName="stroke-dasharray" values="0 1600; 1600 0; 0 1600" dur="4s" repeatCount="1" />
                <animate attributeName="stroke-dashoffset" values="0; -1600; -3200" dur="4s" repeatCount="1" />
              </rect>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={logoFull} alt="Potomac" className="h-16" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={skipSplash}
            className={`px-6 py-2 rounded-lg border ${darkMode ? 'border-[#424242] text-[#9E9E9E] hover:bg-[#2A2A2A]' : 'border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'} font-['Rajdhani'] text-[14px] font-semibold transition-colors`}
          >
            SKIP
          </button>
        </div>
      </div>
    );
  }

 // --- 5. SETUP WIZARD CHECK ---
  if (showSetupWizard) {
    return <SetupWizard darkMode={darkMode} onComplete={handleSetupComplete} />;
  }

  // --- 6. MAIN APPLICATION RENDER ---
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} border-b ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'}`}>
        <div className="px-6 py-4 flex items-center justify-between">
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

          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}>
              <Search className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'} relative`}>
              <Bell className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FEC00F] rounded-full"></span>
            </button>
            <button onClick={() => setShowSettings(true)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}>
              <Settings className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'}`}>
              {darkMode ? '🌙' : '☀️'}
            </button>
            <button className={`flex items-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
              <User className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
              <span className={`font-['Quicksand'] text-sm ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                {userData?.personalInfo.firstName?.[0] || 'S'}. {userData?.personalInfo.lastName || 'Ali'}
              </span>
            </button>
          </div>
        </div>

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

      {/* Main Content Area */}
      <main className="p-6">
        {/* CRITICAL: Passing props to connect Frontend to Backend */}
        {activeMode === 'generate' && (
          <GenerateTab 
            darkMode={darkMode} 
            isGenerating={isGenerating} 
            generatedCode={generatedCode} 
            onRun={handleRunStrategy} // Connected to the API function
          />
        )}
        
        {activeMode === 'reverse' && <ReverseEngineeringTab darkMode={darkMode} />}
        {activeMode === 'ideas' && <IdeasTab darkMode={darkMode} />}
        {activeMode === 'analyze' && <AnalyzeTab darkMode={darkMode} />}
        
        {/* Placeholders for tabs not yet defined in this block */}
        {activeMode === 'market' && <MarketResearchTab darkMode={darkMode} />}
        {activeMode === 'knowledge' && <KnowledgeBaseTab darkMode={darkMode} />}
      </main>

      {/* Settings Modal */}
      {/* Assuming SettingsModal is defined elsewhere or imported */}
      {showSettings && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} p-6 rounded-lg w-96`}>
             <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>Settings</h2>
             <button onClick={() => setShowSettings(false)} className="mt-4 px-4 py-2 bg-[#FEC00F] text-black rounded">Close</button>
           </div>
         </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

// 1. GENERATE TAB (Updated with API Props)
interface GenerateTabProps {
  darkMode: boolean;
  isGenerating: boolean;
  generatedCode: string;
  onRun: (prompt: string) => void;
}

function GenerateTab({ darkMode, isGenerating, generatedCode, onRun }: GenerateTabProps) {
  // Local state for the input text only
  const [prompt, setPrompt] = useState('Create a moving average crossover strategy. Buy when the 10-day moving average crosses above the 30-day moving average. Sell when it crosses below.');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
          AFL CODE GENERATOR
        </h2>
        <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
          Generate AFL code from natural language descriptions using advanced AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
          <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-3 block`}>
            STRATEGY DESCRIPTION
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your trading strategy... (e.g., Buy when 10-day MA crosses above 30-day MA)"
            className={`w-full h-48 px-4 py-3 rounded-lg border ${
              darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
            } font-['Quicksand'] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
          />
          
          <div className="mt-4 flex gap-3">
            <button 
              onClick={() => onRun(prompt)} // Triggers the API call
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'GENERATING...' : 'GENERATE CODE'}
            </button>
            <button 
              onClick={() => setPrompt('')}
              className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'border-[#424242] text-[#9E9E9E] hover:bg-[#2A2A2A]' : 'border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'
            } font-['Rajdhani'] text-[14px] font-semibold transition-colors`}>
              CLEAR
            </button>
          </div>

          <div className={`mt-6 p-4 rounded-lg border ${darkMode ? 'border-[#424242] bg-[#2A2A2A]' : 'border-[#E0E0E0] bg-[#F5F5F5]'}`}>
            <h3 className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-3`}>
              QUICK TEMPLATES
            </h3>
            <div className="space-y-2">
              {[
                'RSI Oversold/Overbought Strategy',
                'Bollinger Band Squeeze',
                'MACD Crossover with Volume Filter',
                'Support/Resistance Breakout'
              ].map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(`Generate AFL code for: ${template}`)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    darkMode ? 'hover:bg-[#3A3A3A] text-[#9E9E9E]' : 'hover:bg-white text-[#757575]'
                  } font-['Quicksand'] text-[13px] transition-colors`}
                >
                  {template}
                </button>
              ))}
            </div>
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
          <pre className={`w-full h-96 px-4 py-3 rounded-lg ${
            darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'
          } font-mono text-[12px] overflow-auto ${darkMode ? 'text-[#BFFF00]' : 'text-[#1B5E20]'}`}>
            {generatedCode}
          </pre>
          
          <div className="mt-4 flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors">
              <Play className="w-4 h-4" />
              TEST IN AMIBROKER
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              darkMode ? 'border-[#424242] text-[#9E9E9E] hover:bg-[#2A2A2A]' : 'border-[#E0E0E0] text-[#757575] hover:bg-[#F5F5F5]'
            } font-['Rajdhani'] text-[14px] font-semibold transition-colors`}>
              <Save className="w-4 h-4" />
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. REVERSE ENGINEERING TAB
function ReverseEngineeringTab({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
          REVERSE ENGINEERING
        </h2>
        <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
          Convert AFL code into visual flowcharts and understand strategy logic
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Input */}
        <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
          <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-3 block`}>
            AFL CODE INPUT
          </label>
          <textarea
            placeholder="Paste your AFL code here..."
            className={`w-full h-96 px-4 py-3 rounded-lg border ${
              darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
            } font-mono text-[12px] resize-none focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
            defaultValue={`// RSI Strategy\nRSIperiod = 14;\nRSIvalue = RSI(RSIperiod);\n\nBuy = Cross(RSIvalue, 30);\nSell = Cross(70, RSIvalue);\n\nPlotShapes(IIf(Buy, shapeUpArrow, shapeNone), colorGreen);\nPlotShapes(IIf(Sell, shapeDownArrow, shapeNone), colorRed);`}
          />
          <div className="mt-4 flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors">
              <GitBranch className="w-4 h-4" />
              GENERATE FLOWCHART
            </button>
          </div>
        </div>

        {/* Flowchart Output */}
        <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
           {/* Placeholder Flowchart UI */}
           <div className={`w-full h-96 rounded-lg ${darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'} flex items-center justify-center`}>
              <p className={darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}>Visual Flowchart will appear here</p>
           </div>
        </div>
      </div>
    </div>
  );
}

// 3. IDEAS TAB
function IdeasTab({ darkMode }: { darkMode: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'momentum', 'mean-reversion', 'breakout', 'trend-following', 'volatility'];

  const strategies = [
    { name: 'Golden Cross Momentum', category: 'momentum', performance: '+34.2%', sharpe: '2.15', winRate: '68%', complexity: 'Low', timeframe: 'Daily', description: 'Buy when 50-day MA crosses above 200-day MA' },
    { name: 'RSI Divergence Play', category: 'mean-reversion', performance: '+28.7%', sharpe: '1.89', winRate: '62%', complexity: 'Medium', timeframe: 'Intraday', description: 'Trade when price and RSI show divergence' },
    { name: 'Bollinger Squeeze', category: 'breakout', performance: '+41.5%', sharpe: '2.43', winRate: '71%', complexity: 'Medium', timeframe: 'Daily', description: 'Capitalize on volatility contraction followed by expansion' },
  ];

  const filteredStrategies = selectedCategory === 'all' 
    ? strategies 
    : strategies.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
          STRATEGY IDEAS
        </h2>
        <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
          Discover proven trading strategies and customize them to your needs
        </p>
      </div>

      {/* Filter Bar */}
      <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Filter className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
             <span className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>FILTER BY CATEGORY</span>
          </div>
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-['Quicksand'] text-[13px] font-semibold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FEC00F] text-[#212121]'
                    : `${darkMode ? 'bg-[#2A2A2A] text-[#9E9E9E] hover:bg-[#3A3A3A]' : 'bg-[#F5F5F5] text-[#757575] hover:bg-[#E0E0E0]'}`
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy, idx) => (
          <div
            key={idx}
            className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242] hover:border-[#FEC00F]/50' : 'border-[#E0E0E0] hover:border-[#FEC00F]/50'} p-6 transition-all cursor-pointer hover:shadow-lg`}
          >
             <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-1`}>
                {strategy.name}
             </h3>
             <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mb-4`}>
               {strategy.description}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. ANALYZE TAB (Completed)
function AnalyzeTab({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
          BACKTEST ANALYSIS
        </h2>
        <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
          Comprehensive analysis of your trading strategy performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve Placeholder */}
        <div className={`lg:col-span-2 ${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
           <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-4`}>EQUITY CURVE</h3>
           <div className={`w-full h-80 rounded-lg ${darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'}`}></div>
        </div>

        {/* Trade Statistics */}
        <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} p-6`}>
          <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-4`}>
            TRADE STATISTICS
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Total Trades', value: '247' },
              { label: 'Winning Trades', value: '168' },
              { label: 'Losing Trades', value: '79' },
              { label: 'Profit Factor', value: '2.33' }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                  {stat.label}
                </span>
                <span className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}