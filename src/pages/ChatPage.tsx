import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Paperclip, Copy, Check, Trash2, Clock, Sparkles } from 'lucide-react';
import apiClient from '@/lib/api';
import { Conversation, Message } from '@/types/api';
import { useTheme } from '@/contexts/ThemeContext';
import yellowLogo from '@/assets/yellowlogo.png';

export function ChatPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme-aware colors
  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    sidebar: isDark ? '#1E1E1E' : '#f8f9fa',
    cardBg: isDark ? '#1E1E1E' : '#ffffff',
    inputBg: isDark ? '#2A2A2A' : '#f5f5f5',
    border: isDark ? '#424242' : '#e0e0e0',
    text: isDark ? '#FFFFFF' : '#212121',
    textMuted: isDark ? '#9E9E9E' : '#757575',
    codeBg: isDark ? '#1a1a2e' : '#f5f5f5',
    userBubble: '#FEC00F',
    assistantBubble: isDark ? '#2A2A2A' : '#f0f0f0',
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await apiClient.getConversations();
      setConversations(data);
      if (data.length > 0) setSelectedConversation(data[0]);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await apiClient.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setInput('');
    setLoading(true);

    const tempUserMsg: Message = {
      id: 'temp-user',
      conversation_id: selectedConversation?.id || '',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await apiClient.sendMessage(userMessage, selectedConversation?.id);
      setMessages(prev => [...prev.filter(m => m.id !== 'temp-user'), response]);
    } catch (err) {
      console.error('Failed to send message:', err);
      // Add error message
      setMessages(prev => [...prev.filter(m => m.id !== 'temp-user'), {
        id: 'error',
        conversation_id: selectedConversation?.id || '',
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConv = await apiClient.createConversation();
      setConversations(prev => [newConv, ...prev]);
      setSelectedConversation(newConv);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (content: string | undefined | null, messageId: string, isUser: boolean) => {
    // Guard against undefined/null content
    if (!content) {
      return <span>No content</span>;
    }
    
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index);
        parts.push(
          <span key={`text-${lastIndex}`} style={{ whiteSpace: 'pre-wrap' }}>
            {renderFormattedText(textContent)}
          </span>
        );
      }

      const language = match[1] || 'code';
      const code = match[2];
      const codeId = `${messageId}-${match.index}`;
      
      parts.push(
        <div
          key={`code-${match.index}`}
          style={{
            backgroundColor: colors.codeBg,
            borderRadius: '12px',
            margin: '16px 0',
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            backgroundColor: isDark ? '#252540' : '#e8e8e8',
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#FEC00F',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {language}
            </span>
            <button
              onClick={() => handleCopyCode(code, codeId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: copiedId === codeId ? '#22C55E' : 'transparent',
                border: `1px solid ${copiedId === codeId ? '#22C55E' : colors.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                color: copiedId === codeId ? '#fff' : colors.textMuted,
                fontSize: '12px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              {copiedId === codeId ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === codeId ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{
            margin: 0,
            padding: '16px',
            fontFamily: "'Fira Code', 'Monaco', monospace",
            fontSize: '13px',
            color: isDark ? '#e0e0e0' : '#333',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.6,
            overflowX: 'auto',
          }}>
            {code}
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} style={{ whiteSpace: 'pre-wrap' }}>
          {renderFormattedText(content.slice(lastIndex))}
        </span>
      );
    }

    return parts.length > 0 ? parts : renderFormattedText(content);
  };

  const renderFormattedText = (text: unknown) => {
    // Guard against non-string values
    if (!text || typeof text !== 'string') {
      return <span>{String(text || '')}</span>;
    }
    let processedText = text;
    // Bold text
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic text
    processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    processedText = processedText.replace(/`([^`]+)`/g, '<code style="background-color: rgba(254,192,15,0.2); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
    // Line breaks
    processedText = processedText.replace(/\n/g, '<br/>');
    
    return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: colors.background,
      display: 'flex',
      fontFamily: "'Quicksand', sans-serif",
      transition: 'background-color 0.3s ease',
    }}>
      {/* Conversations Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: colors.sidebar,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease',
      }}>
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h2 style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text,
              letterSpacing: '1px',
              margin: 0,
            }}>
              CONVERSATIONS
            </h2>
            <button
              onClick={handleNewConversation}
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#FEC00F',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(254,192,15,0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(254,192,15,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(254,192,15,0.3)';
              }}
            >
              <Plus size={18} color="#212121" />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
          {loadingConversations ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 0',
            }}>
              <div className="spinner" style={{
                width: '28px',
                height: '28px',
                border: `3px solid ${colors.border}`,
                borderTopColor: '#FEC00F',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
            </div>
          ) : conversations.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
            }}>
              <MessageSquare size={40} color={colors.textMuted} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ color: colors.textMuted, fontSize: '13px', margin: 0 }}>
                No conversations yet.<br />Start a new one!
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  marginBottom: '8px',
                  backgroundColor: selectedConversation?.id === conv.id 
                    ? (isDark ? 'rgba(254,192,15,0.15)' : 'rgba(254,192,15,0.2)')
                    : 'transparent',
                  border: selectedConversation?.id === conv.id 
                    ? '1px solid #FEC00F' 
                    : `1px solid transparent`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedConversation?.id !== conv.id) {
                    e.currentTarget.style.backgroundColor = colors.inputBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConversation?.id !== conv.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={16} color={selectedConversation?.id === conv.id ? '#FEC00F' : colors.textMuted} />
                  <span style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    color: selectedConversation?.id === conv.id ? '#FEC00F' : colors.text,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}>
                    {conv.title || 'New Conversation'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background,
      }}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                  <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h1 style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '18px',
                    fontWeight: 600,
                    color: colors.text,
                    letterSpacing: '0.5px',
                    margin: 0,
                  }}>
                    {selectedConversation.title || 'NEW CONVERSATION'}
                  </h1>
                  <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
                    AI-powered trading assistant
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: colors.inputBg,
                borderRadius: '20px',
              }}>
                <Sparkles size={14} color="#FEC00F" />
                <span style={{ fontSize: '12px', color: colors.textMuted }}>
                  Context: {messages.length} messages
                </span>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              backgroundColor: colors.background,
            }}>
              {messages.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.textMuted,
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    opacity: 0.8,
                  }}>
                    <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', color: colors.text, marginBottom: '8px' }}>
                    How can I help you today?
                  </h3>
                  <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
                    Ask me about AFL code generation, trading strategies, backtest analysis, or any trading-related questions.
                  </p>
                </div>
              ) : (
                <>
                  {messages.filter(m => m && m.id && m.content !== undefined).map((message, index) => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '24px',
                        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                        animation: 'fadeIn 0.3s ease',
                      }}
                    >
                      {message.role === 'assistant' && (
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}>
                          <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                      )}
                      <div style={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                      }}>
                        <div style={{
                          padding: '16px 20px',
                          borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          backgroundColor: message.role === 'user' ? colors.userBubble : colors.assistantBubble,
                          color: message.role === 'user' ? '#212121' : colors.text,
                          fontSize: '14px',
                          lineHeight: 1.7,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}>
                          {renderMessageContent(message.content, message.id, message.role === 'user')}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '6px',
                          fontSize: '11px',
                          color: colors.textMuted,
                        }}>
                          <Clock size={12} />
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FEC00F 0%, #FFD740 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: '#212121',
                          fontSize: '14px',
                          flexShrink: 0,
                        }}>
                          U
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}>
                        <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{
                        padding: '16px 20px',
                        borderRadius: '20px 20px 20px 4px',
                        backgroundColor: colors.assistantBubble,
                      }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: '#FEC00F',
                                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div style={{
              padding: '20px 24px',
              borderTop: `1px solid ${colors.border}`,
              backgroundColor: colors.cardBg,
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end',
              }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Describe your trading strategy or ask a question..."
                    style={{
                      width: '100%',
                      minHeight: '56px',
                      maxHeight: '200px',
                      padding: '16px 60px 16px 20px',
                      backgroundColor: colors.inputBg,
                      border: `2px solid ${colors.border}`,
                      borderRadius: '16px',
                      color: colors.text,
                      fontSize: '14px',
                      fontFamily: "'Quicksand', sans-serif",
                      outline: 'none',
                      resize: 'none',
                      lineHeight: 1.5,
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FEC00F';
                      e.target.style.boxShadow = '0 0 0 3px rgba(254,192,15,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      bottom: '12px',
                      width: '40px',
                      height: '40px',
                      backgroundColor: input.trim() && !loading ? '#FEC00F' : colors.border,
                      border: 'none',
                      borderRadius: '12px',
                      cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: input.trim() && !loading ? '0 2px 8px rgba(254,192,15,0.3)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (input.trim() && !loading) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Send size={18} color={input.trim() && !loading ? '#212121' : colors.textMuted} />
                  </button>
                </div>
              </div>
              <p style={{
                fontSize: '11px',
                color: colors.textMuted,
                marginTop: '12px',
                textAlign: 'center',
              }}>
                Press <kbd style={{ 
                  backgroundColor: colors.inputBg, 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                }}>Enter</kbd> to send, <kbd style={{ 
                  backgroundColor: colors.inputBg, 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  border: `1px solid ${colors.border}`,
                }}>Shift + Enter</kbd> for new line
              </p>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textMuted,
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              overflow: 'hidden',
              marginBottom: '24px',
              opacity: 0.6,
            }}>
              <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <p style={{ fontSize: '16px', color: colors.text, marginBottom: '8px' }}>
              Welcome to AI Chat
            </p>
            <p style={{ fontSize: '14px' }}>
              Select or create a conversation to start chatting
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}