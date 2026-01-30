import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Paperclip, Copy, Check, Trash2, Clock, X} from 'lucide-react';
import apiClient from '@/lib/api';
import { Conversation, Message } from '@/types/api';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArtifactRenderer } from '@/components/ArtifactRenderer';

// Import logo properly from assets
import yellowLogo from '@/assets/yellowlogo.png';

// Extended Message type with artifacts
interface MessageWithArtifacts extends Message {
  text?: string;
  artifacts?: Array<{
    type: string;
    code: string;
    language: string;
    id: string;
  }>;
  has_artifacts?: boolean;
}

export function ChatPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const { user } = useAuth();
  const isDark = resolvedTheme === 'dark';
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<MessageWithArtifacts[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    userBubble: accentColor,
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
    const tempId = `temp-${Date.now()}`;
    setInput('');
    setLoading(true);

    // Optimistic update for user message
    const optimisticUserMsg: MessageWithArtifacts = {
      id: tempId,
      conversation_id: selectedConversation?.id || 'pending',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, optimisticUserMsg]);

    try {
      const apiResponse = await apiClient.sendMessage(userMessage, selectedConversation?.id);
      
      // Remove optimistic message and add real messages with artifacts
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [
          ...filtered,
          {
            id: `user-${apiResponse.conversation_id}-${Date.now()}`,
            conversation_id: apiResponse.conversation_id,
            role: 'user',
            content: userMessage,
            created_at: new Date().toISOString(),
          },
          {
            id: `assistant-${apiResponse.conversation_id}-${Date.now()}`,
            conversation_id: apiResponse.conversation_id,
            role: 'assistant',
            content: apiResponse.response,
            text: apiResponse.text || apiResponse.response,
            artifacts: apiResponse.artifacts || [],
            has_artifacts: apiResponse.has_artifacts || false,
            created_at: new Date().toISOString(),
          }
        ];
      });

      // Update conversation state
      if (!selectedConversation?.id) {
        setSelectedConversation(prev => prev ? { ...prev, id: apiResponse.conversation_id } : null);
        await loadConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      
      // Replace optimistic message with error state
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempId);
        return [
          ...filtered,
          {
            id: `user-${Date.now()}`,
            conversation_id: selectedConversation?.id || '',
            role: 'user',
            content: userMessage,
            created_at: new Date().toISOString(),
          },
          {
            id: `error-${Date.now()}`,
            conversation_id: selectedConversation?.id || '',
            role: 'assistant',
            content: '⚠️ Failed to send message. Please try again.',
            created_at: new Date().toISOString(),
            metadata: { error: true }
          }
        ];
      });
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

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      await apiClient.deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!selectedConversation?.id) {
      alert('Please start a conversation first');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await apiClient.uploadFile(selectedConversation.id, formData);
      alert(`File "${file.name}" uploaded successfully!`);
    } catch (err) {
      console.error('Failed to upload file:', err);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleCopy = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: colors.background,
      fontFamily: "'Quicksand', sans-serif",
      overflow: 'hidden',
    }}>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".txt,.pdf,.csv,.json,.afl,.c"
      />

      {/* Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: colors.sidebar,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <button
            onClick={handleNewConversation}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#FEC00F',
              border: 'none',
              borderRadius: '12px',
              color: '#212121',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(254,192,15,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5b800';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(254,192,15,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FEC00F';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(254,192,15,0.3)';
            }}
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Conversations List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
        }}>
          {loadingConversations ? (
            <div style={{ padding: '20px', textAlign: 'center', color: colors.textMuted }}>
              Loading...
            </div>
          ) : conversations.length === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              color: colors.textMuted,
              fontSize: '14px',
            }}>
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                style={{
                  padding: '14px',
                  marginBottom: '8px',
                  backgroundColor: selectedConversation?.id === conv.id ? colors.inputBg : 'transparent',
                  border: `1px solid ${selectedConversation?.id === conv.id ? colors.border : 'transparent'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}>
                    <MessageSquare size={14} color="#FEC00F" />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {conv.title || 'New Conversation'}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: colors.textMuted,
                  }}>
                    <Clock size={12} />
                    {formatTime(conv.updated_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff5252';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 size={14} color={colors.textMuted} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background,
      }}>
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
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
                    opacity: 0.6,
                  }}>
                    <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <p style={{ fontSize: '16px', color: colors.text, marginBottom: '8px' }}>
                    Start a conversation
                  </p>
                  <p style={{ fontSize: '14px' }}>
                    Ask me anything about trading, AFL code, or create visual artifacts
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '24px',
                        animation: 'fadeIn 0.3s ease-in',
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: message.role === 'user' ? colors.userBubble : 'transparent',
                      }}>
                        {message.role === 'user' ? (
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                            {user?.email?.[0].toUpperCase() || 'U'}
                          </span>
                        ) : (
                          <img src={yellowLogo} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        )}
                      </div>

                      {/* Message Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          padding: '16px 20px',
                          borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          backgroundColor: message.role === 'user' ? colors.userBubble : colors.assistantBubble,
                          color: message.role === 'user' ? '#ffffff' : colors.text,
                          fontSize: '14px',
                          lineHeight: '1.6',
                          wordWrap: 'break-word',
                          position: 'relative',
                        }}>
                          <div style={{ whiteSpace: 'pre-wrap' }}>
                            {message.has_artifacts ? message.text : message.content}
                          </div>
                          
                          {/* Copy button for assistant messages */}
                          {message.role === 'assistant' && (
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                padding: '6px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                opacity: 0.6,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.backgroundColor = colors.inputBg;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0.6';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              {copiedId === message.id ? (
                                <Check size={14} color="#4CAF50" />
                              ) : (
                                <Copy size={14} color={colors.text} />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Render artifacts if present */}
                        {message.has_artifacts && message.artifacts && message.artifacts.length > 0 && (
                          <div>
                            {message.artifacts.map((artifact, idx) => (
                              <ArtifactRenderer
                                key={`${message.id}-artifact-${idx}`}
                                artifact={artifact}
                                isDark={isDark}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {loading && (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                {/* File upload button */}
                <button
                  onClick={handleFileUpload}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEC00F';
                    e.currentTarget.style.borderColor = '#FEC00F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.inputBg;
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  <Paperclip size={18} color={colors.textMuted} />
                </button>

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
                    placeholder="Ask me to create a chart, diagram, or trading strategy..."
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
