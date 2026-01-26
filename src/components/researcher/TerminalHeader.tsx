import React from 'react';
import { Search, TrendingUp, BarChart3, Newspaper, Building, DollarSign, Settings } from 'lucide-react';

interface TerminalHeaderProps {
  onSearch: (symbol: string) => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({ onSearch, currentView, onViewChange }) => {
  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'strategy', label: 'Strategy', icon: BarChart3 },
    { id: 'comparison', label: 'Comparison', icon: BarChart3 },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'macro', label: 'Macro', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-gray-400">RESEARCHER</span>
            <span className="text-xs text-gray-600">v2.1.0</span>
          </div>
          
          {/* Current View Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">VIEW:</span>
            <span className="text-sm font-mono text-white bg-gray-800 px-2 py-1 rounded">
              {currentView.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)..."
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm font-mono pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSearch(e.currentTarget.value.toUpperCase());
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              ↵ ENTER
            </div>
          </div>
        </div>

        {/* View Navigation */}
        <div className="flex items-center space-x-2">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                  currentView === view.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TerminalHeader;