import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TerminalHeader from '../components/researcher/TerminalHeader';
import TerminalDashboard from '../components/researcher/TerminalDashboard';
import { Search, TrendingUp, BarChart3, Newspaper, Building, DollarSign, Settings } from 'lucide-react';

export const Researcher: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [symbol, setSymbol] = useState('');

  const handleSearch = (searchSymbol: string) => {
    if (searchSymbol.trim()) {
      setSymbol(searchSymbol.trim().toUpperCase());
      setCurrentView('company');
      navigate(`/researcher/company/${searchSymbol.trim().toUpperCase()}`);
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    switch (view) {
      case 'company':
        navigate('/researcher/company');
        break;
      case 'strategy':
        navigate('/researcher/strategy');
        break;
      case 'comparison':
        navigate('/researcher/compare');
        break;
      case 'news':
        navigate('/researcher/news');
        break;
      case 'macro':
        navigate('/researcher/macro');
        break;
      case 'settings':
        navigate('/researcher/settings');
        break;
      default:
        navigate('/researcher');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      {/* Terminal Header */}
      <TerminalHeader 
        onSearch={handleSearch}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Main Content */}
      <div className="p-6">
        {currentView === 'dashboard' && <TerminalDashboard symbol={symbol} />}
        {currentView === 'company' && <TerminalDashboard symbol={symbol} />}
        {currentView === 'strategy' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-400">STRATEGY ANALYSIS</span>
            </div>
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-white mb-2">Strategy Analysis Module</div>
              <div className="text-gray-500">Analyze how well trading strategies fit current market conditions</div>
            </div>
          </div>
        )}
        {currentView === 'comparison' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-gray-400">PEER COMPARISON</span>
            </div>
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-white mb-2">Peer Comparison Module</div>
              <div className="text-gray-500">Compare companies against peers and industry benchmarks</div>
            </div>
          </div>
        )}
        {currentView === 'news' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Newspaper className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-400">NEWS ANALYSIS</span>
            </div>
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-white mb-2">News Analysis Module</div>
              <div className="text-gray-500">Aggregated news with sentiment analysis and impact assessment</div>
            </div>
          </div>
        )}
        {currentView === 'macro' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="h-5 w-5 text-red-400" />
              <span className="text-sm text-gray-400">MACRO CONTEXT</span>
            </div>
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-white mb-2">Macro Context Module</div>
              <div className="text-gray-500">Economic indicators, Fed policy impact, and market sentiment analysis</div>
            </div>
          </div>
        )}
        {currentView === 'settings' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-400">SETTINGS</span>
            </div>
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-white mb-2">Settings Module</div>
              <div className="text-gray-500">Configure researcher preferences and API settings</div>
            </div>
          </div>
        )}
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
