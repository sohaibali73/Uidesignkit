// src/components/FeedbackModal.tsx
import React, { useState } from 'react';
import { X, MessageSquare, AlertCircle, ThumbsUp, Bug, Send, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api';
import { FeedbackType, FeedbackCreateRequest } from '@/types/api';
import { useTheme } from '@/contexts/ThemeContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeId?: string;
  conversationId?: string;
  originalPrompt?: string;
  generatedCode?: string;
}

const feedbackTypes: { type: FeedbackType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'correction', label: 'Correction', icon: <AlertCircle size={20} />, description: 'The code has errors or is incorrect' },
  { type: 'improvement', label: 'Improvement', icon: <MessageSquare size={20} />, description: 'Suggestions to make the code better' },
  { type: 'bug', label: 'Bug Report', icon: <Bug size={20} />, description: 'Report a bug in the generation' },
  { type: 'praise', label: 'Praise', icon: <ThumbsUp size={20} />, description: 'The code worked great!' },
];

export function FeedbackModal({
  isOpen,
  onClose,
  codeId,
  conversationId,
  originalPrompt,
  generatedCode,
}: FeedbackModalProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [selectedType, setSelectedType] = useState<FeedbackType>('improvement');
  const [feedbackText, setFeedbackText] = useState('');
  const [correctCode, setCorrectCode] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    modal: isDark ? '#1E1E1E' : '#ffffff',
    border: isDark ? '#424242' : '#e0e0e0',
    text: isDark ? '#FFFFFF' : '#212121',
    textMuted: isDark ? '#9E9E9E' : '#757575',
    inputBg: isDark ? '#2A2A2A' : '#f5f5f5',
    accent: '#FEC00F',
    accentText: '#212121',
    hoverBg: isDark ? '#2A2A2A' : '#e8e8e8',
  };

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      setError('Please provide feedback details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const request: FeedbackCreateRequest = {
        code_id: codeId,
        conversation_id: conversationId,
        original_prompt: originalPrompt,
        generated_code: generatedCode,
        feedback_type: selectedType,
        feedback_text: feedbackText,
        correct_code: correctCode || undefined,
        rating: rating > 0 ? rating : undefined,
      };

      await apiClient.submitFeedback(request);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset form
        setSelectedType('improvement');
        setFeedbackText('');
        setCorrectCode('');
        setRating(0);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: colors.modal,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '20px',
                fontWeight: 700,
                color: colors.text,
                letterSpacing: '1px',
                margin: 0,
              }}
            >
              PROVIDE FEEDBACK
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '13px', margin: '4px 0 0 0' }}>
              Help us improve the AI by sharing your feedback
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {success ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <ThumbsUp size={32} color="#22C55E" />
              </div>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: colors.text,
                  margin: '0 0 8px 0',
                }}
              >
                Thank You!
              </h3>
              <p style={{ color: colors.textMuted, fontSize: '14px', margin: 0 }}>
                Your feedback has been submitted successfully.
              </p>
            </div>
          ) : (
            <>
              {/* Feedback Type Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text,
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}
                >
                  FEEDBACK TYPE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {feedbackTypes.map((ft) => (
                    <button
                      key={ft.type}
                      onClick={() => setSelectedType(ft.type)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '14px',
                        backgroundColor: selectedType === ft.type ? 'rgba(254, 192, 15, 0.1)' : colors.inputBg,
                        border: `2px solid ${selectedType === ft.type ? colors.accent : 'transparent'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          color: selectedType === ft.type ? colors.accent : colors.textMuted,
                          flexShrink: 0,
                        }}
                      >
                        {ft.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: '14px',
                            fontWeight: 600,
                            color: colors.text,
                          }}
                        >
                          {ft.label}
                        </div>
                        <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>
                          {ft.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text,
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}
                >
                  RATING (OPTIONAL)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: star <= rating ? colors.accent : colors.inputBg,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: star <= rating ? colors.accentText : colors.textMuted,
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.text,
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  FEEDBACK DETAILS *
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Describe the issue or suggestion in detail..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '14px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.text,
                    fontSize: '14px',
                    fontFamily: "'Quicksand', sans-serif",
                    outline: 'none',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Correct Code (for corrections) */}
              {selectedType === 'correction' && (
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: colors.text,
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                    }}
                  >
                    CORRECT CODE (OPTIONAL)
                  </label>
                  <textarea
                    value={correctCode}
                    onChange={(e) => setCorrectCode(e.target.value)}
                    placeholder="Paste the corrected code here..."
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '14px',
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      color: colors.text,
                      fontSize: '13px',
                      fontFamily: "'Fira Code', 'Consolas', monospace",
                      outline: 'none',
                      resize: 'vertical',
                      lineHeight: 1.6,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid #DC2626',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}>{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '20px 24px',
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <button
              onClick={onClose}
              style={{
                flex: 1,
                height: '44px',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                color: colors.text,
                fontSize: '14px',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !feedbackText.trim()}
              style={{
                flex: 1,
                height: '44px',
                backgroundColor: loading || !feedbackText.trim() ? colors.border : colors.accent,
                border: 'none',
                borderRadius: '8px',
                color: loading || !feedbackText.trim() ? colors.textMuted : colors.accentText,
                fontSize: '14px',
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 600,
                cursor: loading || !feedbackText.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  SUBMITTING...
                </>
              ) : (
                <>
                  <Send size={18} />
                  SUBMIT FEEDBACK
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default FeedbackModal;