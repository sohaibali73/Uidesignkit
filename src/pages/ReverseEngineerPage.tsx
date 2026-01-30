import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Search,
  GitBranch,
  Code,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Zap,
  Send,
  Clock,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import apiClient from '@/lib/api';
import yellowLogo from '@/assets/yellowlogo.png';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ReverseEngineerPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [description, setDescription] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [schematic, setSchematic] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [strategyId, setStrategyId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme-aware colors
  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    cardBg: isDark ? '#1E1E1E' : '#f8f9fa',
    inputBg: isDark ? '#2A2A2A' : '#ffffff',
    border: isDark ? '#424242' : '#e0e0e0',
    text: isDark ? '#FFFFFF' : '#212121',
    textMuted: isDark ? '#9E9E9E' : '#757575',
    codeBg: isDark ? '#0D1117' : '#f5f5f5',
    userBubble: '#FEC00F',
    assistantBubble: isDark ? '#2A2A2A' : '#f0f0f0',
  };

  const steps = [
    { icon: FileText, label: 'DESCRIBE', desc: 'Describe the strategy' },
    { icon: Search, label: 'RESEARCH', desc: 'AI researches components' },
    { icon: GitBranch, label: 'SCHEMATIC', desc: 'Generate architecture' },
    { icon: Code, label: 'CODE', desc: 'Generate AFL code' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Clean text by removing emojis, extra asterisks, hashtags
  const cleanText = (text: unknown): string => {
    if (!text || typeof text !== 'string') return '';
    // Remove emojis
    let cleaned = text.replace(/[\u{1F600}-\u{1F64F}]/gu, '');
    cleaned = cleaned.replace(/[\u{1F300}-\u{1F5FF}]/gu, '');
    cleaned = cleaned.replace(/[\u{1F680}-\u{1F6FF}]/gu, '');
    cleaned = cleaned.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '');
    cleaned = cleaned.replace(/[\u{2600}-\u{26FF}]/gu, '');
    cleaned = cleaned.replace(/[\u{2700}-\u{27BF}]/gu, '');
    // Remove markdown formatting
    cleaned = cleaned.replace(/\*\*/g, '');
    cleaned = cleaned.replace(/\*/g, '');
    cleaned = cleaned.replace(/#{1,6}\s*/g, '');
    cleaned = cleaned.replace(/`/g, '');
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    return cleaned.trim();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStart = async () => {
    if (!description.trim()) {
      setError('Please describe your strategy');
      return;
    }
    
    setLoading(true);
    setError('');
    setActiveStep(1);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: description,
      timestamp: new Date(),
    };
    setChatMessages([userMsg]);

    try {
      const data = await apiClient.startReverseEngineering(description);
      setStrategyId(data.id || data.strategy_id || 'temp-id');
      
      const researchText = cleanText(data.response || 'Strategy analysis completed.');
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: researchText,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMsg]);
      setActiveStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || loading) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setLoading(true);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const data = await apiClient.continueReverseEngineering(strategyId, userMessage);
      const responseText = cleanText(data.response || 'I understand. Let me continue analyzing your strategy.');
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSchematic = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await apiClient.generateStrategySchematic(strategyId);
      setSchematic(cleanText(data.response) || `STRATEGY ARCHITECTURE

PRICE DATA INPUT
  OHLCV Data Stream

INDICATOR CALCULATIONS
  Moving Averages
  RSI / MACD
  Volume Analysis

SIGNAL LOGIC
  Entry Rules
  Exit Rules
  Confirmation Filters

RISK MANAGEMENT
  Stop Loss Levels
  Position Sizing
  Maximum Drawdown`);
      setActiveStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate schematic');
    } finally {
      setLoading(false);
    }
  };

  const handleCode = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await apiClient.generateStrategyCode(strategyId);
      setGeneratedCode(data.afl_code || `// AFL Strategy Code
// Generated by Analyst by Potomac

// Strategy Parameters
Period = Param("Period", 20, 5, 100, 1);
StopLoss = Param("Stop Loss %", 2, 0.5, 10, 0.5);

// Calculate Indicators
FastMA = MA(Close, Period);
SlowMA = MA(Close, Period * 2);
RSI_Val = RSI(14);

// Entry Conditions
BuySignal = Cross(FastMA, SlowMA) AND RSI_Val < 70;
SellSignal = Cross(SlowMA, FastMA) OR RSI_Val > 80;

// Execute Trades
Buy = BuySignal;
Sell = SellSignal;

// Risk Management
ApplyStop(stopTypeLoss, stopModePercent, StopLoss);

// Position Sizing
PositionSize = 100;`);
      setActiveStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = generatedCode || schematic;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setDescription('');
    setChatInput('');
    setActiveStep(0);
    setError('');
    setChatMessages([]);
    setSchematic('');
    setGeneratedCode('');
    setStrategyId('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      padding: '32px',
      fontFamily: "'Quicksand', sans-serif",
      transition: 'background-color 0.3s ease',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '32px',
          fontWeight: 700,
          color: colors.text,
          letterSpacing: '2px',
          marginBottom: '8px',
        }}>
          REVERSE ENGINEER
        </h1>
        <p style={{ color: colors.textMuted, fontSize: '15px', margin: 0 }}>
          Transform strategy descriptions into working AFL code
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{
        backgroundColor: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <React.Fragment key={step.label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: isComplete ? '#2D7F3E' : isActive ? '#FEC00F' : colors.inputBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    transition: 'all 0.3s',
                    border: `1px solid ${colors.border}`,
                  }}>
                    {isComplete ? (
                      <Check size={24} color="#FFFFFF" />
                    ) : (
                      <Icon size={24} color={isActive ? '#212121' : colors.textMuted} />
                    )}
                  </div>
                  <span style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isComplete || isActive ? colors.text : colors.textMuted,
                    letterSpacing: '0.5px',
                  }}>
                    {step.label}
                  </span>
                  <span style={{ color: colors.textMuted, fontSize: '11px', marginTop: '4px' }}>
                    {step.desc}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: index < activeStep ? '#2D7F3E' : colors.border,
                    margin: '0 16px',
                    marginBottom: '40px',
                    transition: 'background-color 0.3s',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid #DC2626',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
        }}>
          <p style={{ color: '#DC2626', fontSize: '14px', margin: 0 }}>{error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Panel - Description or Chat */}
        <div style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '500px',
        }}>
          {activeStep === 0 ? (
            // Initial Description Input
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
                color: colors.text,
                letterSpacing: '1px',
                marginBottom: '20px',
                marginTop: 0,
              }}>
                STRATEGY DESCRIPTION
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the trading strategy you want to reverse engineer..."
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  color: colors.text,
                  fontSize: '14px',
                  fontFamily: "'Quicksand', sans-serif",
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.6,
                }}
              />
              <button
                onClick={handleStart}
                disabled={!description.trim() || loading}
                style={{
                  marginTop: '16px',
                  height: '48px',
                  backgroundColor: !description.trim() || loading ? colors.border : '#FEC00F',
                  border: 'none',
                  borderRadius: '8px',
                  color: !description.trim() || loading ? colors.textMuted : '#212121',
                  fontSize: '14px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  cursor: !description.trim() || loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'START ANALYSIS'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          ) : (
            // Chat Interface
            <>
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h2 style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    color: colors.text,
                    margin: 0,
                  }}>
                    RESEARCH CHAT
                  </h2>
                  <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>
                    Discuss your strategy with AI
                  </p>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginBottom: '16px',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    )}
                    <div style={{ maxWidth: '80%' }}>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: msg.role === 'user' ? colors.userBubble : colors.assistantBubble,
                        color: msg.role === 'user' ? '#212121' : colors.text,
                        fontSize: '13px',
                        lineHeight: 1.6,
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '10px', color: colors.textMuted }}>
                        <Clock size={10} />
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: colors.assistantBubble }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: '#FEC00F',
                            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Ask follow-up questions..."
                    style={{
                      flex: 1,
                      height: '40px',
                      padding: '0 12px',
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || loading}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: chatInput.trim() && !loading ? '#FEC00F' : colors.border,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: chatInput.trim() && !loading ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Send size={16} color={chatInput.trim() && !loading ? '#212121' : colors.textMuted} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={handleReset}
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '12px',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <RefreshCw size={14} />
                    RESET
                  </button>
                  {activeStep === 2 && (
                    <button
                      onClick={handleSchematic}
                      disabled={loading}
                      style={{
                        flex: 1,
                        height: '36px',
                        backgroundColor: loading ? colors.border : '#FEC00F',
                        border: 'none',
                        borderRadius: '8px',
                        color: loading ? colors.textMuted : '#212121',
                        fontSize: '12px',
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      GENERATE SCHEMATIC
                    </button>
                  )}
                  {activeStep === 3 && (
                    <button
                      onClick={handleCode}
                      disabled={loading}
                      style={{
                        flex: 1,
                        height: '36px',
                        backgroundColor: loading ? colors.border : '#FEC00F',
                        border: 'none',
                        borderRadius: '8px',
                        color: loading ? colors.textMuted : '#212121',
                        fontSize: '12px',
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      GENERATE CODE
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Output */}
        <div style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '500px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: colors.text,
              margin: 0,
            }}>
              {activeStep >= 4 ? 'GENERATED CODE' : activeStep >= 3 ? 'STRATEGY SCHEMATIC' : 'OUTPUT'}
            </h2>
            {(schematic || generatedCode) && (
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: copied ? '#2D7F3E' : 'transparent',
                  border: `1px solid ${copied ? '#2D7F3E' : colors.border}`,
                  borderRadius: '6px',
                  color: copied ? '#fff' : colors.text,
                  fontSize: '12px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            )}
          </div>

          <div style={{
            flex: 1,
            padding: '20px',
            backgroundColor: colors.codeBg,
            overflow: 'auto',
          }}>
            {activeStep >= 3 ? (
              <pre style={{
                margin: 0,
                fontFamily: activeStep >= 4 ? "'Fira Code', monospace" : "'Quicksand', sans-serif",
                fontSize: '13px',
                lineHeight: 1.7,
                color: colors.text,
                whiteSpace: 'pre-wrap',
              }}>
                {generatedCode || schematic}
              </pre>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textMuted,
              }}>
                <Zap size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p style={{ fontSize: '14px', margin: 0, textAlign: 'center' }}>
                  {activeStep === 0 
                    ? 'Describe a strategy to begin' 
                    : 'Continue chatting to refine your strategy, then generate schematic'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}