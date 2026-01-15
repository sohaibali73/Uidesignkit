import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Play,
  Eye,
  Settings,
  Palette,
  Type,
  Layout,
  BarChart3,
  Box,
  CheckCircle,
  Info,
  ArrowRight
} from 'lucide-react';
import logoFull from 'figma:asset/b6f4dd51f4a6c34cb4d10bae287dadeedec5a8d0.png';
import logoIconYellow from 'figma:asset/5ce167767639106e26c3015beb74a7ba651e69bf.png';
import logoIconBlack from 'figma:asset/d24c5ff124bb0ac606d4e26646d856d125b21d37.png';
import { AnalystFullApp } from './components/AnalystFullApp';
import { SetupWizard } from './components/SetupWizard';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'kit' | 'splash' | 'wizard' | 'app'>('kit');
  const [showSplash, setShowSplash] = useState(false);

  // If viewing full app
  if (viewMode === 'app') {
    return (
      <div className="relative">
        <button
          onClick={() => setViewMode('kit')}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors shadow-lg"
        >
          ← BACK TO DESIGN KIT
        </button>
        <AnalystFullApp darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    );
  }

  // If viewing setup wizard
  if (viewMode === 'wizard') {
    return (
      <div className="relative">
        <button
          onClick={() => setViewMode('kit')}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors shadow-lg"
        >
          ← BACK TO DESIGN KIT
        </button>
        <SetupWizard 
          darkMode={darkMode} 
          onComplete={(data) => {
            console.log('Setup complete:', data);
            setViewMode('app');
          }} 
        />
      </div>
    );
  }

  // If viewing splash screen
  if (viewMode === 'splash' || showSplash) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'} flex items-center justify-center relative overflow-hidden`}>
        <button
          onClick={() => {
            setShowSplash(false);
            setViewMode('kit');
          }}
          className="absolute top-6 right-6 z-20 px-4 py-2 rounded-lg border border-[#FEC00F] text-[#FEC00F] hover:bg-[#FEC00F] hover:text-[#212121] font-['Rajdhani'] text-[12px] font-semibold transition-all"
        >
          BACK TO DESIGN KIT
        </button>

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
                <animate attributeName="stroke-dasharray" values="0 1600; 1600 0; 0 1600" dur="4s" repeatCount="indefinite" />
                <animate attributeName="stroke-dashoffset" values="0; -1600; -3200" dur="4s" repeatCount="indefinite" />
              </rect>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={logoFull} alt="Potomac" className="h-16" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 text-center w-full">
          <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#757575]' : 'text-[#BDBDBD]'}`}>
            LOADING...
          </p>
        </div>
      </div>
    );
  }

  // Design Kit View
  return (
    <div className={darkMode ? 'bg-[#121212] min-h-screen' : 'bg-[#FAFAFA] min-h-screen'}>
      {/* Header */}
      <div className={`border-b ${darkMode ? 'border-[#424242] bg-[#212121]' : 'border-[#E0E0E0] bg-white'} sticky top-0 z-50`}>
        <div className="max-w-[1920px] mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className={`font-['Rajdhani'] text-[32px] font-bold tracking-wider ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
              ANALYST UI DESIGN KIT
            </h1>
            <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
              Comprehensive design system for Analyst by Potomac Fund Management
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-lg border ${darkMode ? 'border-[#424242] hover:border-[#FEC00F]' : 'border-[#E0E0E0] hover:border-[#FEC00F]'} transition-all`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-[#FEC00F]" /> : <Moon className="w-5 h-5 text-[#757575]" />}
          </button>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-8 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <p className={`font-['Quicksand'] text-[15px] ${darkMode ? 'text-[#E0E0E0]' : 'text-[#424242]'} max-w-4xl leading-relaxed mb-6`}>
            Complete design system for Analyst by Potomac Fund Management. This kit includes all visual components, typography, colors, interactive elements, and specialized UI for financial analysis. Developed by Sohaib Ali with special thanks to Shyam Patel.
          </p>

          {/* Quick Access Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setViewMode('splash')}
              className={`p-6 rounded-lg border-2 ${darkMode ? 'border-[#424242] bg-[#212121] hover:border-[#FEC00F]' : 'border-[#E0E0E0] bg-white hover:border-[#FEC00F]'} transition-all text-left`}
            >
              <Play className="w-8 h-8 text-[#FEC00F] mb-3" />
              <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
                TEST SPLASH SCREEN
              </h3>
              <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Preview the animated loading screen with rainbow outline effect
              </p>
            </button>

            <button
              onClick={() => setViewMode('wizard')}
              className={`p-6 rounded-lg border-2 ${darkMode ? 'border-[#424242] bg-[#212121] hover:border-[#FEC00F]' : 'border-[#E0E0E0] bg-white hover:border-[#FEC00F]'} transition-all text-left`}
            >
              <Settings className="w-8 h-8 text-[#FEC00F] mb-3" />
              <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
                TEST SETUP WIZARD
              </h3>
              <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Try the complete 5-step onboarding experience
              </p>
            </button>

            <button
              onClick={() => setViewMode('app')}
              className={`p-6 rounded-lg border-2 ${darkMode ? 'border-[#424242] bg-[#212121] hover:border-[#FEC00F]' : 'border-[#E0E0E0] bg-white hover:border-[#FEC00F]'} transition-all text-left`}
            >
              <Sparkles className="w-8 h-8 text-[#FEC00F] mb-3" />
              <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
                LAUNCH FULL APP
              </h3>
              <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Experience the complete Analyst application with all 6 modes
              </p>
            </button>
          </div>
        </section>

        {/* Brand Logos */}
        <section className="mb-20">
          <h2 className={`font-['Rajdhani'] text-[28px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-8`}>
            BRAND LOGOS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
              <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
                FULL LOGO
              </h3>
              <div className="bg-white p-8 rounded-lg mb-4 flex items-center justify-center min-h-[120px]">
                <img src={logoFull} alt="Potomac Full Logo" className="max-w-full h-auto" />
              </div>
              <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} text-center`}>
                Primary logo for headers and marketing materials
              </p>
            </div>

            <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
              <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
                ICON - YELLOW
              </h3>
              <div className="bg-white p-8 rounded-lg mb-4 flex items-center justify-center min-h-[120px]">
                <img src={logoIconYellow} alt="Potomac Icon Yellow" className="w-24 h-24" />
              </div>
              <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} text-center`}>
                Icon for app branding and favicons
              </p>
            </div>

            <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
              <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
                ICON - BLACK
              </h3>
              <div className="bg-white p-8 rounded-lg mb-4 flex items-center justify-center min-h-[120px]">
                <img src={logoIconBlack} alt="Potomac Icon Black" className="w-24 h-24" />
              </div>
              <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} text-center`}>
                Monochrome version for print and minimal designs
              </p>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-20">
          <h2 className={`font-['Rajdhani'] text-[28px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-8`}>
            COLOR PALETTE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Colors */}
            <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
              <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
                PRIMARY COLORS
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-[#212121] border-2 border-white shadow-lg"></div>
                  <div>
                    <p className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      Corporate Gray
                    </p>
                    <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      #212121
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-[#FEC00F] shadow-lg"></div>
                  <div>
                    <p className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      Energetic Yellow
                    </p>
                    <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      #FEC00F
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Neutral Colors */}
            <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
              <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
                NEUTRAL COLORS
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Light Gray', hex: '#FAFAFA' },
                  { name: 'Gray 200', hex: '#E0E0E0' },
                  { name: 'Gray 400', hex: '#BDBDBD' },
                  { name: 'Gray 600', hex: '#757575' },
                  { name: 'Gray 700', hex: '#616161' },
                  { name: 'Gray 800', hex: '#424242' },
                  { name: 'Black', hex: '#000000' }
                ].map((color) => (
                  <div key={color.hex} className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'}`} style={{ backgroundColor: color.hex }}></div>
                    <div>
                      <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                        {color.name}
                      </p>
                      <p className={`font-['Quicksand'] text-[10px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        {color.hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <div className={`rounded-xl p-8 mt-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
            <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
              SEMANTIC COLORS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="w-full h-16 rounded-lg bg-green-500 mb-2"></div>
                <p className={`font-['Rajdhani'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                  Success / Bullish
                </p>
                <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                  #22C55E
                </p>
              </div>
              <div>
                <div className="w-full h-16 rounded-lg bg-red-500 mb-2"></div>
                <p className={`font-['Rajdhani'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                  Error / Bearish
                </p>
                <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                  #EF4444
                </p>
              </div>
              <div>
                <div className="w-full h-16 rounded-lg bg-blue-500 mb-2"></div>
                <p className={`font-['Rajdhani'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                  Info
                </p>
                <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                  #3B82F6
                </p>
              </div>
              <div>
                <div className="w-full h-16 rounded-lg bg-orange-500 mb-2"></div>
                <p className={`font-['Rajdhani'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                  Warning
                </p>
                <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                  #F97316
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-20">
          <h2 className={`font-['Rajdhani'] text-[28px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-8`}>
            TYPOGRAPHY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rajdhani - Headers */}
            <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
              <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
                RAJDHANI - HEADERS (ALL CAPS)
              </h3>
              <div className="space-y-4">
                <div>
                  <h1 className={`font-['Rajdhani'] text-[32px] font-bold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    ANALYST PLATFORM
                  </h1>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    32px Bold - Main Headings
                  </p>
                </div>
                <div>
                  <h2 className={`font-['Rajdhani'] text-[24px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    MARKET ANALYSIS
                  </h2>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    24px Semibold - Section Headings
                  </p>
                </div>
                <div>
                  <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    TRADING STRATEGY
                  </h3>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    18px Semibold - Subsection Headings
                  </p>
                </div>
                <div>
                  <h4 className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    BUTTON TEXT
                  </h4>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    14px Semibold - Buttons & Labels
                  </p>
                </div>
              </div>
            </div>

            {/* Quicksand - Body */}
            <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
              <h3 className={`font-['Rajdhani'] text-[16px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
                QUICKSAND - BODY TEXT
              </h3>
              <div className="space-y-4">
                <div>
                  <p className={`font-['Quicksand'] text-[16px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    The quick brown fox jumps over the lazy dog. Premium financial analysis platform.
                  </p>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    16px Regular - Large Body Text
                  </p>
                </div>
                <div>
                  <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                    Generate AFL code from natural language descriptions using advanced AI technology.
                  </p>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    14px Regular - Standard Body Text
                  </p>
                </div>
                <div>
                  <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                    Real-time market analysis and insights for professional traders.
                  </p>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    13px Regular - Secondary Text
                  </p>
                </div>
                <div>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#757575]' : 'text-[#9E9E9E]'}`}>
                    © 2025 Potomac Fund Management. All rights reserved.
                  </p>
                  <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mt-1`}>
                    11px Regular - Captions & Metadata
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-20">
          <h2 className={`font-['Rajdhani'] text-[28px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-8`}>
            BUTTONS
          </h2>

          <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-4`}>
                  PRIMARY BUTTONS
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-6 py-3 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors">
                    PRIMARY ACTION
                  </button>
                  <button className="w-full px-6 py-3 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#E5AD0E] transition-colors">
                    <Sparkles className="w-4 h-4" />
                    WITH ICON
                  </button>
                  <button className="w-full px-6 py-3 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold opacity-50 cursor-not-allowed">
                    DISABLED
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-4`}>
                  SECONDARY BUTTONS
                </h3>
                <div className="space-y-3">
                  <button className={`w-full px-6 py-3 rounded-lg border ${darkMode ? 'border-[#424242] text-white hover:bg-[#2A2A2A]' : 'border-[#E0E0E0] text-[#212121] hover:bg-[#F5F5F5]'} font-['Rajdhani'] text-[14px] font-semibold transition-colors`}>
                    SECONDARY ACTION
                  </button>
                  <button className={`w-full px-6 py-3 rounded-lg border ${darkMode ? 'border-[#424242] text-white hover:bg-[#2A2A2A]' : 'border-[#E0E0E0] text-[#212121] hover:bg-[#F5F5F5]'} font-['Rajdhani'] text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors`}>
                    <ArrowRight className="w-4 h-4" />
                    WITH ICON
                  </button>
                </div>
              </div>

              <div>
                <h3 className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-4`}>
                  ICON BUTTONS
                </h3>
                <div className="flex items-center gap-3">
                  <button className={`p-3 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'} transition-colors`}>
                    <Settings className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                  </button>
                  <button className={`p-3 rounded-lg ${darkMode ? 'hover:bg-[#2A2A2A]' : 'hover:bg-[#F5F5F5]'} transition-colors`}>
                    <Eye className={`w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                  </button>
                  <button className={`p-3 rounded-lg bg-[#FEC00F] hover:bg-[#E5AD0E] transition-colors`}>
                    <Sparkles className="w-5 h-5 text-[#212121]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Input Fields */}
        <section className="mb-20">
          <h2 className={`font-['Rajdhani'] text-[28px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-8`}>
            INPUT FIELDS
          </h2>

          <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                    TEXT INPUT
                  </label>
                  <input
                    type="text"
                    placeholder="Enter text..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                    } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                  />
                </div>

                <div>
                  <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                    TEXTAREA
                  </label>
                  <textarea
                    placeholder="Enter description..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                    } font-['Quicksand'] text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                    SELECT DROPDOWN
                  </label>
                  <select className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                  } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}>
                    <option>Select an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </div>

                <div>
                  <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                    TOGGLE SWITCH
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#424242] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FEC00F]"></div>
                    <span className={`ml-3 font-['Quicksand'] text-[14px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      Enable feature
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-20">
          <h2 className={`font-['Rajdhani'] text-[28px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-8`}>
            CARDS & CONTAINERS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div className={`rounded-lg border ${darkMode ? 'border-[#424242] bg-[#212121]' : 'border-[#E0E0E0] bg-white'} p-6`}>
              <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
                BASIC CARD
              </h3>
              <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Standard container for content with border and padding.
              </p>
            </div>

            {/* Highlighted Card */}
            <div className={`rounded-lg border-2 border-[#FEC00F] bg-[#FEC00F]/5 p-6`}>
              <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
                HIGHLIGHTED CARD
              </h3>
              <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Featured content with accent border and subtle background.
              </p>
            </div>

            {/* Success Card */}
            <div className="rounded-lg border-2 border-green-500 bg-green-500/5 p-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                  SUCCESS CARD
                </h3>
              </div>
              <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                Positive feedback or successful operation indicator.
              </p>
            </div>
          </div>
        </section>

        {/* Chart Preview */}
        <section className="mb-20">
          <h2 className={`font-['Rajdhani'] text-[28px] font-semibold tracking-wide ${darkMode ? 'text-white' : 'text-[#212121]'} mb-8`}>
            CHARTS & VISUALIZATIONS
          </h2>

          <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#212121] border border-[#424242]' : 'bg-white border border-[#E0E0E0]'}`}>
            <h3 className={`font-['Rajdhani'] text-[18px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-6`}>
              LINE CHART EXAMPLE
            </h3>
            <div className={`w-full h-64 rounded-lg ${darkMode ? 'bg-[#1A1A1A]' : 'bg-[#FAFAFA]'} p-4`}>
              <svg className="w-full h-full" viewBox="0 0 800 200">
                <line x1="0" y1="50" x2="800" y2="50" stroke={darkMode ? '#424242' : '#E0E0E0'} strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="800" y2="100" stroke={darkMode ? '#424242' : '#E0E0E0'} strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="800" y2="150" stroke={darkMode ? '#424242' : '#E0E0E0'} strokeWidth="1" strokeDasharray="5,5" />
                <polyline points="0,150 100,140 200,130 300,120 400,110 500,100 600,90 700,80 800,70" fill="none" stroke="#22C55E" strokeWidth="3" />
                <polygon points="0,150 100,140 200,130 300,120 400,110 500,100 600,90 700,80 800,70 800,200 0,200" fill="url(#chartGradient)" opacity="0.2" />
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className={`text-center py-12 border-t ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'}`}>
          <p className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mb-2`}>
            Analyst UI Design Kit by Potomac Fund Management
          </p>
          <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#757575]' : 'text-[#9E9E9E]'}`}>
            Developed by Sohaib Ali • Special Thanks to Shyam Patel
          </p>
        </section>
      </div>
    </div>
  );
}
