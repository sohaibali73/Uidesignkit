import React, { useState, useRef } from 'react';
import { Sparkles, Copy, Check, Download, Bug, Lightbulb, Zap, Loader2, MessageSquare, Paperclip, Upload, X, FileText, Maximize2, Minimize2 } from 'lucide-react';
import apiClient from '@/lib/api';
import FeedbackModal from '@/components/FeedbackModal';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';

export function AFLGeneratorPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [prompt, setPrompt] = useState('');
  const [strategyType, setStrategyType] = useState('standalone');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [codeId, setCodeId] = useState<string | undefined>(undefined);
  
  // Environment Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [backtestSettings, setBacktestSettings] = useState({
    initial_equity: 100000,
    position_size: "100",
    position_size_type: "spsPercentOfEquity",
    max_positions: 10,
    commission: 0.001,
    trade_delays: [0, 0, 0, 0] as [number, number, number, number],
    margin_requirement: 100,
  });
  
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Code editor state
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const editorRef = useRef<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe your strategy');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const result = await apiClient.generateAFL({
        request: prompt,
        strategy_type: strategyType as any,
        backtest_settings: backtestSettings,
        uploaded_file_ids: selectedFileIds,
      });
      setGeneratedCode(result.afl_code || result.code || '// Generated code will appear here');
      setCodeId(result.id);
      
      // Auto-format after generation
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.formatDocument')?.run();
        }
      }, 100);
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
    a.download = `strategy_${Date.now()}.afl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleToggleFullscreen = () => {
    setIsEditorFullscreen(!isEditorFullscreen);
  };

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    
    monaco.languages.register({ id: 'afl' });
    
    monaco.languages.setMonarchTokensProvider('afl', {
      keywords: [
        'Buy', 'Sell', 'Short', 'Cover', 'Filter', 
        'if', 'else', 'for', 'while', 'function',
        'SetOption', 'SetTradeDelays', 'SetPositionSize',
        'Param', 'Optimize', 'Plot', 'PlotShapes',
        'ExRem', 'Flip', 'Cross', 'TimeFrameSet', 'TimeFrameRestore',
      ],
      
      builtinFunctions: [
        'MA', 'EMA', 'SMA', 'WMA', 'DEMA', 'TEMA',
        'RSI', 'MACD', 'ATR', 'ADX', 'CCI', 'MFI',
        'BBandTop', 'BBandBot', 'SAR', 'ROC',
        'HHV', 'LLV', 'Ref', 'Sum', 'Cum',
      ],
      
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@builtinFunctions': 'type.identifier',
              '@default': 'identifier'
            }
          }],
          [/".*?"/, 'string'],
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
          [/\d+/, 'number'],
        ],
        comment: [
          [/\*\//, 'comment', '@pop'],
          [/./, 'comment']
        ],
      },
    });
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB');
      return;
    }
    
    const allowedTypes = [
      'text/csv',
      'text/plain',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const isAllowed = allowedTypes.includes(file.type) || 
                      file.name.endsWith('.afl') || 
                      file.name.endsWith('.csv');
    
    if (!isAllowed) {
      alert('Unsupported file type. Please upload CSV, TXT, PDF, or AFL files.');
      return;
    }
    
    setUploadingFile(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await apiClient.uploadAflFile(formData);
      
      setUploadedFiles(prev => [result, ...prev]);
      setSelectedFileIds(prev => [...prev, result.file_id]);
      
      alert(` File uploaded: ${result.filename}`);
      
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(`L Upload failed: ${err.response?.data?.detail || err.message}`);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Delete this file?')) return;
    
    try {
      await apiClient.deleteAflFile(fileId);
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      setSelectedFileIds(prev => prev.filter(id => id !== fileId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete file');
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
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
              height: '48px',
              backgroundColor: loading || !prompt.trim() ? '#424242' : '#FEC00F',
              border: 'none',
              borderRadius: '8px',
              color: loading || !prompt.trim() ? '#757575' : '#212121',
              fontSize: '14px',
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.5px',
              cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
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
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    cursor: 'pointer',
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
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 600,
                    cursor: 'pointer',
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
                  height: '40px',
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
                  cursor: 'pointer',
                }}
              >
                <Zap size={16} />
                OPTIMIZE
              </button>
              <button
                style={{
                  flex: 1,
                  height: '40px',
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
                  cursor: 'pointer',
                }}
              >
                <Bug size={16} />
                DEBUG
              </button>
              <button
                style={{
                  flex: 1,
                  height: '40px',
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
                  cursor: 'pointer',
                }}
              >
                <Lightbulb size={16} />
                EXPLAIN
              </button>
              <button
                onClick={() => setShowFeedbackModal(true)}
                style={{
                  flex: 1,
                  height: '40px',
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
                  cursor: 'pointer',
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