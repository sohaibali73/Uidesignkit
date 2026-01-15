import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Building2,
  Key,
  Settings,
  Database,
  Globe,
  Sparkles,
  Shield
} from 'lucide-react';
import logoFull from 'figma:asset/b6f4dd51f4a6c34cb4d10bae287dadeedec5a8d0.png';

interface SetupWizardProps {
  darkMode: boolean;
  onComplete: (data: SetupData) => void;
}

export interface SetupData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    role: string;
  };
  preferences: {
    defaultMode: string;
    notifications: boolean;
    autoSave: boolean;
    chartType: string;
  };
  apiConnections: {
    amibroker: boolean;
    alphavantage: string;
    newsapi: string;
  };
}

export function SetupWizard({ darkMode, onComplete }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      role: ''
    },
    preferences: {
      defaultMode: 'generate',
      notifications: true,
      autoSave: true,
      chartType: 'candlestick'
    },
    apiConnections: {
      amibroker: false,
      alphavantage: '',
      newsapi: ''
    }
  });

  const steps = [
    { id: 0, title: 'WELCOME', icon: Sparkles, description: 'Welcome to Analyst' },
    { id: 1, title: 'PERSONAL INFO', icon: User, description: 'Tell us about yourself' },
    { id: 2, title: 'PREFERENCES', icon: Settings, description: 'Configure your settings' },
    { id: 3, title: 'API CONNECTIONS', icon: Key, description: 'Connect external services' },
    { id: 4, title: 'COMPLETE', icon: Check, description: 'You\'re all set!' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(setupData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setSetupData({
      ...setupData,
      personalInfo: { ...setupData.personalInfo, [field]: value }
    });
  };

  const updatePreferences = (field: string, value: any) => {
    setSetupData({
      ...setupData,
      preferences: { ...setupData.preferences, [field]: value }
    });
  };

  const updateApiConnections = (field: string, value: any) => {
    setSetupData({
      ...setupData,
      apiConnections: { ...setupData.apiConnections, [field]: value }
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'} flex items-center justify-center p-6`}>
      <div className={`${darkMode ? 'bg-[#212121]' : 'bg-white'} rounded-lg border ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} max-w-4xl w-full overflow-hidden`}>
        {/* Progress Bar */}
        <div className={`h-2 ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
          <div
            className="h-full bg-[#FEC00F] transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className={`p-8 border-b ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'}`}>
          <div className="flex items-center justify-center mb-6">
            <img src={logoFull} alt="Potomac" className="h-12" />
          </div>
          <h1 className={`font-['Rajdhani'] text-[32px] font-semibold text-center ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2`}>
            {steps[currentStep].title}
          </h1>
          <p className={`font-['Quicksand'] text-[14px] text-center ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
            {steps[currentStep].description}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-[#FEC00F] border-[#FEC00F]'
                          : isCurrent
                          ? 'border-[#FEC00F] bg-[#FEC00F]/10'
                          : `${darkMode ? 'border-[#424242] bg-[#2A2A2A]' : 'border-[#E0E0E0] bg-[#F5F5F5]'}`
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-[#212121]" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isCurrent ? 'text-[#FEC00F]' : darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                      )}
                    </div>
                    <span
                      className={`font-['Quicksand'] text-[10px] mt-2 ${
                        isCompleted || isCurrent ? 'text-[#FEC00F]' : darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'
                      }`}
                    >
                      Step {index + 1}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-[#FEC00F]' : darkMode ? 'bg-[#424242]' : 'bg-[#E0E0E0]'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px]">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 rounded-full ${darkMode ? 'bg-[#FEC00F]/20' : 'bg-[#FEC00F]/30'} flex items-center justify-center`}>
                  <Sparkles className="w-12 h-12 text-[#FEC00F]" />
                </div>
              </div>
              <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                WELCOME TO ANALYST
              </h2>
              <p className={`font-['Quicksand'] text-[16px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} max-w-2xl mx-auto leading-relaxed`}>
                Your comprehensive financial analysis platform powered by Potomac Fund Management. 
                Let's get you set up with all the tools you need to generate AFL code, analyze strategies, 
                conduct market research, and discover new trading ideas.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {[
                  { label: 'Generate', icon: Sparkles },
                  { label: 'Reverse Engineer', icon: Globe },
                  { label: 'Ideas', icon: Database },
                  { label: 'Analyze', icon: Shield },
                  { label: 'Market Research', icon: Globe },
                  { label: 'Knowledge Base', icon: Database }
                ].map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${darkMode ? 'border-[#424242] bg-[#2A2A2A]' : 'border-[#E0E0E0] bg-[#F5F5F5]'}`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${darkMode ? 'text-[#FEC00F]' : 'text-[#FEC00F]'}`} />
                      <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                        {feature.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                    FIRST NAME *
                  </label>
                  <input
                    type="text"
                    value={setupData.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                    } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                    LAST NAME *
                  </label>
                  <input
                    type="text"
                    value={setupData.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                    } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={setupData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                  } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                  placeholder="your.email@company.com"
                />
              </div>

              <div>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                  COMPANY / ORGANIZATION
                </label>
                <div className="relative">
                  <Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                  <input
                    type="text"
                    value={setupData.personalInfo.company}
                    onChange={(e) => updatePersonalInfo('company', e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                      darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                    } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                  ROLE / TITLE
                </label>
                <select
                  value={setupData.personalInfo.role}
                  onChange={(e) => updatePersonalInfo('role', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                  } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                >
                  <option value="">Select your role</option>
                  <option value="trader">Trader</option>
                  <option value="analyst">Analyst</option>
                  <option value="portfolio-manager">Portfolio Manager</option>
                  <option value="researcher">Researcher</option>
                  <option value="developer">Developer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                  DEFAULT MODE
                </label>
                <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mb-3`}>
                  Choose which mode to open when you launch Analyst
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'generate', label: 'Generate' },
                    { id: 'reverse', label: 'Reverse Engineer' },
                    { id: 'ideas', label: 'Ideas' },
                    { id: 'analyze', label: 'Analyze' },
                    { id: 'market', label: 'Market Research' },
                    { id: 'knowledge', label: 'Knowledge Base' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updatePreferences('defaultMode', mode.id)}
                      className={`p-3 rounded-lg border-2 font-['Rajdhani'] text-[14px] font-semibold transition-all ${
                        setupData.preferences.defaultMode === mode.id
                          ? 'border-[#FEC00F] bg-[#FEC00F]/10 text-[#FEC00F]'
                          : `${darkMode ? 'border-[#424242] text-[#9E9E9E] hover:border-[#FEC00F]/50' : 'border-[#E0E0E0] text-[#757575] hover:border-[#FEC00F]/50'}`
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${darkMode ? 'border-[#424242] bg-[#2A2A2A]' : 'border-[#E0E0E0] bg-[#F5F5F5]'}`}>
                <h3 className={`font-['Rajdhani'] text-[16px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-4`}>
                  GENERAL SETTINGS
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                        Enable Notifications
                      </p>
                      <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        Receive alerts for market changes and updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setupData.preferences.notifications}
                        onChange={(e) => updatePreferences('notifications', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-[#424242] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FEC00F]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                        Auto-save Work
                      </p>
                      <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                        Automatically save your strategies and analysis
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setupData.preferences.autoSave}
                        onChange={(e) => updatePreferences('autoSave', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-[#424242] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FEC00F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                  PREFERRED CHART TYPE
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['candlestick', 'line', 'bar'].map((type) => (
                    <button
                      key={type}
                      onClick={() => updatePreferences('chartType', type)}
                      className={`p-3 rounded-lg border-2 font-['Rajdhani'] text-[14px] font-semibold capitalize transition-all ${
                        setupData.preferences.chartType === type
                          ? 'border-[#FEC00F] bg-[#FEC00F]/10 text-[#FEC00F]'
                          : `${darkMode ? 'border-[#424242] text-[#9E9E9E] hover:border-[#FEC00F]/50' : 'border-[#E0E0E0] text-[#757575] hover:border-[#FEC00F]/50'}`
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: API Connections */}
          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className={`p-6 rounded-lg border-2 ${darkMode ? 'border-[#FEC00F]/30 bg-[#FEC00F]/5' : 'border-[#FEC00F]/50 bg-[#FEC00F]/10'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[#FEC00F] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-['Quicksand'] text-[14px] ${darkMode ? 'text-white' : 'text-[#212121]'} mb-1`}>
                      Your API keys are encrypted and stored securely
                    </p>
                    <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      All connections are optional and can be configured later in Settings
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg border ${darkMode ? 'border-[#424242] bg-[#2A2A2A]' : 'border-[#E0E0E0] bg-[#F5F5F5]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-['Rajdhani'] text-[16px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      AMIBROKER CONNECTION
                    </h3>
                    <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      Connect to AmiBroker for live testing
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={setupData.apiConnections.amibroker}
                      onChange={(e) => updateApiConnections('amibroker', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-[#424242] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FEC00F]"></div>
                  </label>
                </div>
                {setupData.apiConnections.amibroker && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="AmiBroker connection string"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-white border-[#E0E0E0] text-[#212121]'
                      } font-['Quicksand'] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                  ALPHA VANTAGE API KEY
                </label>
                <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mb-3`}>
                  For real-time market data and historical prices
                </p>
                <div className="relative">
                  <Key className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                  <input
                    type="password"
                    value={setupData.apiConnections.alphavantage}
                    onChange={(e) => updateApiConnections('alphavantage', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                    } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                    placeholder="Enter your Alpha Vantage API key"
                  />
                </div>
                <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#757575]' : 'text-[#9E9E9E]'} mt-2`}>
                  Don't have a key? <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-[#FEC00F] hover:underline">Get one free</a>
                </p>
              </div>

              <div>
                <label className={`font-['Rajdhani'] text-[14px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-2 block`}>
                  NEWS API KEY
                </label>
                <p className={`font-['Quicksand'] text-[12px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} mb-3`}>
                  For market news and sentiment analysis
                </p>
                <div className="relative">
                  <Key className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`} />
                  <input
                    type="password"
                    value={setupData.apiConnections.newsapi}
                    onChange={(e) => updateApiConnections('newsapi', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      darkMode ? 'bg-[#1A1A1A] border-[#424242] text-white' : 'bg-[#FAFAFA] border-[#E0E0E0] text-[#212121]'
                    } font-['Quicksand'] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FEC00F]`}
                    placeholder="Enter your News API key"
                  />
                </div>
                <p className={`font-['Quicksand'] text-[11px] ${darkMode ? 'text-[#757575]' : 'text-[#9E9E9E]'} mt-2`}>
                  Get your free key at <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer" className="text-[#FEC00F] hover:underline">newsapi.org</a>
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 rounded-full bg-[#FEC00F] flex items-center justify-center animate-pulse`}>
                  <Check className="w-12 h-12 text-[#212121]" />
                </div>
              </div>
              <h2 className={`font-['Rajdhani'] text-[28px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                YOU'RE ALL SET!
              </h2>
              <p className={`font-['Quicksand'] text-[16px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'} max-w-2xl mx-auto leading-relaxed`}>
                Your Analyst workspace is ready. You can now start generating AFL code, analyzing strategies, 
                conducting market research, and exploring trading ideas.
              </p>
              
              <div className={`max-w-md mx-auto p-6 rounded-lg border ${darkMode ? 'border-[#424242] bg-[#2A2A2A]' : 'border-[#E0E0E0] bg-[#F5F5F5]'} text-left`}>
                <h3 className={`font-['Rajdhani'] text-[16px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} mb-3`}>
                  SETUP SUMMARY
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      Default Mode
                    </span>
                    <span className={`font-['Quicksand'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'} capitalize`}>
                      {setupData.preferences.defaultMode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      Notifications
                    </span>
                    <span className={`font-['Quicksand'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      {setupData.preferences.notifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      Auto-save
                    </span>
                    <span className={`font-['Quicksand'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      {setupData.preferences.autoSave ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-['Quicksand'] text-[13px] ${darkMode ? 'text-[#9E9E9E]' : 'text-[#757575]'}`}>
                      API Connections
                    </span>
                    <span className={`font-['Quicksand'] text-[13px] font-semibold ${darkMode ? 'text-white' : 'text-[#212121]'}`}>
                      {[
                        setupData.apiConnections.amibroker && 'AmiBroker',
                        setupData.apiConnections.alphavantage && 'Alpha Vantage',
                        setupData.apiConnections.newsapi && 'News API'
                      ].filter(Boolean).length || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${darkMode ? 'border-[#424242]' : 'border-[#E0E0E0]'} flex items-center justify-between`}>
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-['Rajdhani'] text-[14px] font-semibold transition-all ${
              currentStep === 0
                ? `${darkMode ? 'text-[#757575] bg-[#2A2A2A]' : 'text-[#9E9E9E] bg-[#F5F5F5]'} cursor-not-allowed`
                : `${darkMode ? 'text-white bg-[#2A2A2A] hover:bg-[#3A3A3A]' : 'text-[#212121] bg-[#F5F5F5] hover:bg-[#E0E0E0]'}`
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            BACK
          </button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep ? 'bg-[#FEC00F] w-8' : darkMode ? 'bg-[#424242]' : 'bg-[#E0E0E0]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-[#FEC00F] text-[#212121] rounded-lg font-['Rajdhani'] text-[14px] font-semibold hover:bg-[#E5AD0E] transition-colors"
          >
            {currentStep === steps.length - 1 ? 'START USING ANALYST' : 'NEXT'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
