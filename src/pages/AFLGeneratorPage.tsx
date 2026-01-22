import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, Bug, Lightbulb, Zap, Loader2, MessageSquare } from 'lucide-react';
import FeedbackModal from '@/components/FeedbackModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000';

export function AFLGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [strategyType, setStrategyType] = useState('standalone');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [codeId, setCodeId] = useState<string | undefined>(undefined);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe your strategy');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/afl/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          strategy_type: strategyType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const result = await response.json();
      setGeneratedCode(result.code || '// Generated code will appear here');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategy.afl';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      padding: '32px',
      fontFamily: "'Quicksand', sans-serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '32px',
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '2px',
          marginBottom: '8px',
        }}>
          AFL CODE GENERATOR
        </h1>
        <p style={{ color: '#9E9E9E', fontSize: '15px', margin: 0 }}>
          Generate AmiBroker Formula Language code from natural language descriptions
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Panel - Input */}
        <div style={{
          backgroundColor: '#1E1E1E',
          border: '1px solid #424242',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: '#FFFFFF',
            letterSpacing: '1px',
            marginBottom: '8px',
            marginTop: 0,
          }}>
            DESCRIBE YOUR STRATEGY
          </h2>
          <p style={{ color: '#757575', fontSize: '13px', marginBottom: '24px', marginTop: 0 }}>
            Write a detailed description of your trading strategy
          </p>

          {error && (
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid #DC2626',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
            }}>
              <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Strategy Type */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}>
              STRATEGY TYPE
            </label>
            <select
              value={strategyType}
              onChange={(e) => setStrategyType(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 16px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #424242',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: "'Quicksand', sans-serif",
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="standalone">Standalone Strategy</option>
              <option value="entry">Entry Signal</option>
              <option value="exit">Exit Signal</option>
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}>
              STRATEGY DESCRIPTION
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Create a moving average crossover strategy that goes long when the 20-day MA crosses above the 50-day MA and exits when it crosses below. Include risk management with 2% stop loss..."
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '16px',
                backgroundColor: '#2A2A2A',
                border: '1px solid #424242',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: "'Quicksand', sans-serif",
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: loading || !prompt.trim() ? '#424242' : '#FEC00F',
              border: 'none',
              borderRadius: '8px',
              color: loading || !prompt.trim() ? '#757575' : '#212121',
              fontSize: '14px',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
              letterSpacing: '1px',
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                GENERATING...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                GENERATE AFL CODE
              </>
            )}
          </button>

          {/* Tips */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#2A2A2A',
            borderRadius: '8px',
          }}>
            <h3 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '12px',
              marginTop: 0,
            }}>
              TIPS FOR BETTER RESULTS:
            </h3>
            <ul style={{
              margin: 0,
              paddingLeft: '20px',
              color: '#9E9E9E',
              fontSize: '13px',
              lineHeight: 1.8,
            }}>
              <li>Be specific about entry and exit conditions</li>
              <li>Include stop loss and take profit levels</li>
              <li>Mention any risk management rules</li>
              <li>Specify any filters or market conditions</li>
              <li>Include position sizing details</li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div style={{
          backgroundColor: '#1E1E1E',
          border: '1px solid #424242',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            backgroundColor: '#2A2A2A',
            borderBottom: '1px solid #424242',
          }}>
            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '0.5px',
              margin: 0,
            }}>
              AFL CODE OUTPUT
            </h2>
            {generatedCode && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: copied ? '#2D7F3E' : 'transparent',
                    border: `1px solid ${copied ? '#2D7F3E' : '#424242'}`,
                    borderRadius: '8px',
                    color: copied ? '#FFFFFF' : '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!copied) {
                      e.currentTarget.style.borderColor = '#FEC00F';
                      e.currentTarget.style.color = '#FEC00F';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copied) {
                      e.currentTarget.style.borderColor = '#424242';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid #424242',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FEC00F';
                    e.currentTarget.style.color = '#FEC00F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#424242';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  <Download size={14} />
                  DOWNLOAD
                </button>
              </div>
            )}
          </div>

          {/* Code Display */}
          <div style={{
            flex: 1,
            padding: '24px',
            backgroundColor: '#0D1117',
            overflow: 'auto',
            minHeight: '400px',
          }}>
            {loading ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#757575',
              }}>
                <Loader2 size={48} color="#FEC00F" style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '14px', margin: 0 }}>Generating your AFL code...</p>
              </div>
            ) : generatedCode ? (
              <pre style={{
                margin: 0,
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontSize: '13px',
                lineHeight: 1.7,
                color: '#E0E0E0',
              }}>
                {generatedCode.split('\n').map((line, i) => (
                  <div key={i} style={{ display: 'flex' }}>
                    <span style={{
                      width: '40px',
                      color: '#6E7681',
                      textAlign: 'right',
                      paddingRight: '16px',
                      userSelect: 'none',
                      borderRight: '1px solid #21262D',
                      marginRight: '16px',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      color: line.trim().startsWith('//') ? '#6A9955' :
                        line.includes('Buy') || line.includes('Sell') || line.includes('Short') || line.includes('Cover') ? '#FEC00F' :
                        line.includes('MA(') || line.includes('EMA(') || line.includes('Cross(') || line.includes('RSI(') ? '#DCDCAA' :
                        line.includes('Close') || line.includes('Open') || line.includes('High') || line.includes('Low') ? '#9CDCFE' :
                        /^\s*\d+/.test(line) ? '#B5CEA8' : '#E6EDF3'
                    }}>
                      {line || ' '}
                    </span>
                  </div>
                ))}
              </pre>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#757575',
              }}>
                <Zap size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>Generate code to see results here</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {generatedCode && !loading && (
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '16px 24px',
              borderTop: '1px solid #424242',
              backgroundColor: '#1E1E1E',
            }}>
              <button
                style={{
                  flex: 1,
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #424242',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FEC00F';
                  e.currentTarget.style.color = '#FEC00F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#424242';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <Zap size={16} />
                OPTIMIZE
              </button>
              <button
                style={{
                  flex: 1,
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #424242',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FEC00F';
                  e.currentTarget.style.color = '#FEC00F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#424242';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <Bug size={16} />
                DEBUG
              </button>
              <button
                style={{
                  flex: 1,
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #424242',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FEC00F';
                  e.currentTarget.style.color = '#FEC00F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#424242';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <Lightbulb size={16} />
                EXPLAIN
              </button>
              <button
                onClick={() => setShowFeedbackModal(true)}
                style={{
                  flex: 1,
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #FEC00F',
                  borderRadius: '8px',
                  color: '#FEC00F',
                  fontSize: '13px',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FEC00F22';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <MessageSquare size={16} />
                FEEDBACK
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        codeId={codeId}
        originalPrompt={prompt}
        generatedCode={generatedCode}
      />

      {/* CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}