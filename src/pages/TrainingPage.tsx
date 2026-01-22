import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Search,
  Lightbulb,
  MessageCircle,
  BookOpen,
  Play,
  Send,
  Loader,
  AlertCircle,
  Star,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import {
  LearningCurve,
  PopularPattern,
  KnowledgeSearchResult,
  TrainingStats,
  UserFeedback,
  TrainingSuggestion,
} from '@/types/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    fontFamily: "'Quicksand', sans-serif",
  } as React.CSSProperties,
  header: {
    background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
    borderBottom: '1px solid #424242',
    padding: '32px',
  } as React.CSSProperties,
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  title: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '32px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '8px',
    letterSpacing: '1px',
  } as React.CSSProperties,
  subtitle: {
    color: '#9E9E9E',
    fontSize: '14px',
  } as React.CSSProperties,
  content: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  card: {
    backgroundColor: '#1E1E1E',
    border: '1px solid #424242',
    borderRadius: '12px',
    padding: '20px',
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  statItem: {
    backgroundColor: '#2A2A2A',
    border: '1px solid #424242',
    borderRadius: '8px',
    padding: '16px',
  } as React.CSSProperties,
  statValue: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: '#FEC00F',
    marginBottom: '4px',
  } as React.CSSProperties,
  statLabel: {
    color: '#9E9E9E',
    fontSize: '12px',
    fontWeight: 600,
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '18px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '16px',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  knowledgeCard: {
    backgroundColor: '#2A2A2A',
    border: '1px solid #424242',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  feedbackIcon: (type: string) => {
    const baseStyle = { width: '16px', height: '16px', marginRight: '6px' };
    switch (type) {
      case 'praise':
        return { ...baseStyle, color: '#4CAF50' };
      case 'correction':
        return { ...baseStyle, color: '#2196F3' };
      case 'improvement':
        return { ...baseStyle, color: '#FF9800' };
      case 'bug':
        return { ...baseStyle, color: '#F44444' };
      default:
        return baseStyle;
    }
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    marginRight: '6px',
  } as React.CSSProperties,
};

interface TabData {
  learningCurve: LearningCurve | null;
  popularPatterns: PopularPattern[];
  stats: TrainingStats | null;
  feedback: UserFeedback[];
  suggestions: TrainingSuggestion[];
  knowledgeResults: KnowledgeSearchResult[];
}

export default function TrainingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [data, setData] = useState<TabData>({
    learningCurve: null,
    popularPatterns: [],
    stats: null,
    feedback: [],
    suggestions: [],
    knowledgeResults: [],
  });

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Test Training Dialog
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Suggest Training Dialog
  const [showSuggestDialog, setShowSuggestDialog] = useState(false);
  const [suggestForm, setSuggestForm] = useState({
    title: '',
    description: '',
    example_input: '',
    example_output: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback Dialog
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    code_id: '',
    feedback_type: 'correction' as any,
    feedback_text: '',
    correct_code: '',
    rating: 5,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [curve, patterns, stats, feedback, suggestions] = await Promise.all([
        apiClient.getLearningCurve().catch(() => null),
        apiClient.getPopularPatterns(),
        apiClient.getTrainStats(),
        apiClient.getMyFeedback(),
        apiClient.getMySuggestions(),
      ]);

      setData({
        learningCurve: curve,
        popularPatterns: patterns || [],
        stats: stats || null,
        feedback: feedback || [],
        suggestions: suggestions || [],
        knowledgeResults: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load training data');
      console.error('Failed to load training data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      const results = await apiClient.searchTrainingKnowledge(searchQuery, undefined, 20);
      setData((prev) => ({ ...prev, knowledgeResults: results }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleTestTraining = async () => {
    if (!testPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setIsTesting(true);
      setError(null);
      const result = await apiClient.testTraining({
        prompt: testPrompt,
        category: 'afl',
        include_training: true,
      });
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmitSuggestion = async () => {
    if (!suggestForm.title.trim() || !suggestForm.example_output.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient.suggestTraining(suggestForm);
      setShowSuggestDialog(false);
      setSuggestForm({
        title: '',
        description: '',
        example_input: '',
        example_output: '',
        reason: '',
      });
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.feedback_text.trim()) {
      setError('Please enter feedback');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient.submitFeedback(feedbackForm);
      setShowFeedbackDialog(false);
      setFeedbackForm({
        code_id: '',
        feedback_type: 'correction',
        feedback_text: '',
        correct_code: '',
        rating: 5,
      });
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'praise':
        return <ThumbsUp style={styles.feedbackIcon(type)} />;
      case 'correction':
        return <AlertTriangle style={styles.feedbackIcon(type)} />;
      case 'improvement':
        return <Zap style={styles.feedbackIcon(type)} />;
      case 'bug':
        return <AlertCircle style={styles.feedbackIcon(type)} />;
      default:
        return null;
    }
  };

  const getSuggestionBadgeStyle = (status: string) => {
    const baseStyle = styles.badge;
    switch (status) {
      case 'pending':
        return { ...baseStyle, backgroundColor: '#FEC00F22', color: '#FEC00F' };
      case 'approved':
        return { ...baseStyle, backgroundColor: '#4CAF5022', color: '#4CAF50' };
      case 'implemented':
        return { ...baseStyle, backgroundColor: '#2196F322', color: '#2196F3' };
      case 'rejected':
        return { ...baseStyle, backgroundColor: '#F4444422', color: '#F44444' };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Training & Learning</h1>
          <p style={styles.subtitle}>Improve code generation, test training effectiveness, and share insights</p>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Error Alert */}
        {error && (
          <Alert style={{ marginBottom: '20px', backgroundColor: '#F4444422', border: '1px solid #F4444444' }}>
            <AlertCircle style={{ color: '#F44444' }} />
            <AlertDescription style={{ color: '#F44444' }}>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9E9E9E' }}>
            <Loader style={{ width: '32px', height: '32px', animation: 'spin 2s linear infinite', marginBottom: '16px', display: 'inline-block' }} />
            <p>Loading your training data...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList style={{ backgroundColor: '#1E1E1E', borderBottom: '1px solid #424242', marginBottom: '20px' }}>
              <TabsTrigger value="overview" style={{ color: activeTab === 'overview' ? '#FEC00F' : '#9E9E9E' }}>
                <BarChart3 style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="test" style={{ color: activeTab === 'test' ? '#FEC00F' : '#9E9E9E' }}>
                <Play style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                Test Training
              </TabsTrigger>
              <TabsTrigger value="knowledge" style={{ color: activeTab === 'knowledge' ? '#FEC00F' : '#9E9E9E' }}>
                <BookOpen style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="suggestions" style={{ color: activeTab === 'suggestions' ? '#FEC00F' : '#9E9E9E' }}>
                <Lightbulb style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="feedback" style={{ color: activeTab === 'feedback' ? '#FEC00F' : '#9E9E9E' }}>
                <MessageCircle style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                Feedback
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Stats */}
                {data.stats && (
                  <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>Your Training Statistics</h2>
                    <div style={styles.statsGrid}>
                      <div style={styles.statItem}>
                        <div style={styles.statValue}>{data.stats.total}</div>
                        <div style={styles.statLabel}>Total Examples</div>
                      </div>
                      <div style={styles.statItem}>
                        <div style={styles.statValue}>{data.stats.active}</div>
                        <div style={styles.statLabel}>Active Examples</div>
                      </div>
                      <div style={styles.statItem}>
                        <div style={styles.statValue}>{data.feedback.length}</div>
                        <div style={styles.statLabel}>Feedback Submitted</div>
                      </div>
                      <div style={styles.statItem}>
                        <div style={styles.statValue}>{data.suggestions.length}</div>
                        <div style={styles.statLabel}>Suggestions Made</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Learning Curve Chart Placeholder */}
                {data.learningCurve && (
                  <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>Your Learning Progress</h2>
                    <div style={{ backgroundColor: '#2A2A2A', borderRadius: '8px', padding: '20px', textAlign: 'center', color: '#9E9E9E', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p>Learning curve chart will display your code quality improvements over time</p>
                    </div>
                  </div>
                )}

                {/* Popular Patterns */}
                {data.popularPatterns.length > 0 && (
                  <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>Popular Training Patterns</h2>
                    <div style={styles.grid}>
                      {data.popularPatterns.slice(0, 6).map((pattern) => (
                        <div key={pattern.id} style={{ ...styles.knowledgeCard, backgroundColor: '#2A2A2A', cursor: 'default' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FEC00F'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#424242'; }}>
                          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ fontWeight: 600, color: '#FEC00F', fontSize: '12px' }}>{pattern.training_type}</div>
                            <div style={{ fontSize: '12px', color: '#9E9E9E' }}>{pattern.usage_count}x used</div>
                          </div>
                          <h3 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{pattern.title}</h3>
                          <p style={{ color: '#9E9E9E', fontSize: '12px' }}>Category: {pattern.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <Button
                    onClick={() => setShowTestDialog(true)}
                    style={{
                      backgroundColor: '#FEC00F',
                      color: '#212121',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '14px',
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    <Play style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                    Test Training
                  </Button>
                  <Button
                    onClick={() => setShowSuggestDialog(true)}
                    style={{
                      backgroundColor: '#424242',
                      color: '#FFFFFF',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '1px solid #FEC00F44',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '14px',
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    <Lightbulb style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                    Suggest Training
                  </Button>
                  <Button
                    onClick={() => setShowFeedbackDialog(true)}
                    style={{
                      backgroundColor: '#424242',
                      color: '#FFFFFF',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: '1px solid #FEC00F44',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '14px',
                      fontFamily: "'Rajdhani', sans-serif",
                    }}
                  >
                    <MessageCircle style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Test Training Tab */}
            <TabsContent value="test">
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Test Training Effectiveness</h2>
                <p style={{ color: '#9E9E9E', marginBottom: '16px', fontSize: '14px' }}>Generate code with and without training to see how training improves output quality</p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Prompt</label>
                  <Textarea
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="e.g., Create a moving average crossover strategy"
                    style={{
                      backgroundColor: '#2A2A2A',
                      border: '1px solid #424242',
                      color: '#FFFFFF',
                      minHeight: '80px',
                      fontFamily: "'Quicksand', sans-serif",
                    }}
                  />
                </div>

                <Button
                  onClick={handleTestTraining}
                  disabled={isTesting}
                  style={{
                    backgroundColor: '#FEC00F',
                    color: '#212121',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: isTesting ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    fontFamily: "'Rajdhani', sans-serif",
                    opacity: isTesting ? 0.6 : 1,
                  }}
                >
                  {isTesting ? (
                    <>
                      <Loader style={{ marginRight: '8px', width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                      Run Test
                    </>
                  )}
                </Button>

                {testResult && (
                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Test Results</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ ...styles.card, backgroundColor: '#2A2A2A' }}>
                        <div style={{ fontSize: '12px', color: '#9E9E9E', fontWeight: 600, marginBottom: '8px' }}>WITHOUT TRAINING</div>
                        <div style={{ backgroundColor: '#1E1E1E', borderRadius: '6px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#E0E0E0', maxHeight: '200px', overflowY: 'auto' }}>
                          {testResult.without_training?.code || 'No code generated'}
                        </div>
                      </div>

                      <div style={{ ...styles.card, backgroundColor: '#2A2A2A' }}>
                        <div style={{ fontSize: '12px', color: '#FEC00F', fontWeight: 600, marginBottom: '8px' }}>WITH TRAINING</div>
                        <div style={{ backgroundColor: '#1E1E1E', borderRadius: '6px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#4CAF50', maxHeight: '200px', overflowY: 'auto' }}>
                          {testResult.with_training?.code || 'No code generated'}
                        </div>
                      </div>
                    </div>

                    {testResult.differences_detected && (
                      <Alert style={{ backgroundColor: '#4CAF5022', border: '1px solid #4CAF5044', marginBottom: '16px' }}>
                        <CheckCircle style={{ color: '#4CAF50' }} />
                        <AlertDescription style={{ color: '#4CAF50' }}>Training made a difference! The AI generated better code with training context.</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge">
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Knowledge Base Search</h2>
                <p style={{ color: '#9E9E9E', marginBottom: '16px', fontSize: '14px' }}>Search training examples, rules, and patterns</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', marginBottom: '24px' }}>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search training examples, patterns, rules..."
                    style={{
                      backgroundColor: '#2A2A2A',
                      border: '1px solid #424242',
                      color: '#FFFFFF',
                      fontFamily: "'Quicksand', sans-serif",
                      gridColumn: '1 / -1',
                    }}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    style={{
                      backgroundColor: '#FEC00F',
                      color: '#212121',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: isSearching ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '13px',
                      gridColumn: '1 / -1',
                      opacity: isSearching ? 0.6 : 1,
                    }}
                  >
                    {isSearching ? (
                      <>
                        <Loader style={{ marginRight: '6px', width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search style={{ marginRight: '6px', width: '14px', height: '14px' }} />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {data.knowledgeResults.length > 0 && (
                  <div style={styles.grid}>
                    {data.knowledgeResults.map((result, idx) => (
                      <div
                        key={idx}
                        style={styles.knowledgeCard}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#3A3A3A';
                          e.currentTarget.style.borderColor = '#FEC00F';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#2A2A2A';
                          e.currentTarget.style.borderColor = '#424242';
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#FEC00F', marginBottom: '8px' }}>
                          Relevance: {(result.relevance_score * 100).toFixed(0)}%
                        </div>
                        <h3 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, marginBottom: '8px', wordBreak: 'break-word' }}>{result.document_id}</h3>
                        <p style={{ color: '#9E9E9E', fontSize: '12px', marginBottom: '8px', lineHeight: '1.4' }}>{result.content.substring(0, 150)}...</p>
                        <p style={{ color: '#757575', fontSize: '11px' }}>File: {result.filename}</p>
                      </div>
                    ))}
                  </div>
                )}

                {!isSearching && data.knowledgeResults.length === 0 && searchQuery && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9E9E9E' }}>
                    <Search style={{ width: '32px', height: '32px', marginBottom: '12px', opacity: 0.5, display: 'inline-block' }} />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}

                {!searchQuery && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9E9E9E' }}>
                    <BookOpen style={{ width: '32px', height: '32px', marginBottom: '12px', opacity: 0.5, display: 'inline-block' }} />
                    <p>Enter a search query to explore the knowledge base</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions">
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Your Training Suggestions</h2>
                <p style={{ color: '#9E9E9E', marginBottom: '16px', fontSize: '14px' }}>
                  {data.suggestions.length} suggestion{data.suggestions.length !== 1 ? 's' : ''} made
                </p>

                {data.suggestions.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {data.suggestions.map((suggestion) => (
                      <div key={suggestion.id} style={{ ...styles.knowledgeCard, backgroundColor: '#2A2A2A', cursor: 'default' }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h3 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 600, flex: 1 }}>{suggestion.title}</h3>
                          <span style={getSuggestionBadgeStyle(suggestion.status)}>{suggestion.status}</span>
                        </div>
                        {suggestion.description && (
                          <p style={{ color: '#9E9E9E', fontSize: '13px', marginBottom: '8px' }}>{suggestion.description}</p>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          {suggestion.example_input && (
                            <div style={{ fontSize: '11px', color: '#9E9E9E' }}>
                              <span style={{ color: '#757575', fontWeight: 600 }}>Input:</span> {suggestion.example_input.substring(0, 50)}
                            </div>
                          )}
                          {suggestion.example_output && (
                            <div style={{ fontSize: '11px', color: '#9E9E9E' }}>
                              <span style={{ color: '#757575', fontWeight: 600 }}>Output:</span> {suggestion.example_output.substring(0, 50)}
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: '11px', color: '#757575' }}>Created: {new Date(suggestion.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9E9E9E' }}>
                    <Lightbulb style={{ width: '32px', height: '32px', marginBottom: '12px', opacity: 0.5, display: 'inline-block' }} />
                    <p>No suggestions yet. Help improve the training by suggesting examples!</p>
                    <Button
                      onClick={() => setShowSuggestDialog(true)}
                      style={{
                        marginTop: '16px',
                        backgroundColor: '#FEC00F',
                        color: '#212121',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '13px',
                      }}
                    >
                      Create First Suggestion
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Your Feedback</h2>
                <p style={{ color: '#9E9E9E', marginBottom: '16px', fontSize: '14px' }}>
                  {data.feedback.length} feedback submission{data.feedback.length !== 1 ? 's' : ''}
                </p>

                {data.feedback.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {data.feedback.map((fb) => (
                      <div key={fb.id} style={{ ...styles.knowledgeCard, backgroundColor: '#2A2A2A', cursor: 'default' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          {getFeedbackIcon(fb.feedback_type)}
                          <span style={{ color: '#9E9E9E', fontSize: '12px', fontWeight: 600 }}>{fb.feedback_type}</span>
                          {fb.rating && (
                            <span style={{ marginLeft: 'auto', color: '#FEC00F', fontSize: '12px' }}>
                              {'⭐'.repeat(fb.rating)}
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#E0E0E0', fontSize: '13px', marginBottom: '8px', wordBreak: 'break-word' }}>{fb.feedback_text}</p>
                        {fb.correct_code && (
                          <div style={{ backgroundColor: '#1E1E1E', borderRadius: '6px', padding: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#4CAF50', marginBottom: '8px', maxHeight: '100px', overflowY: 'auto' }}>
                            {fb.correct_code}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#757575' }}>
                          <span>Status: {fb.status}</span>
                          <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9E9E9E' }}>
                    <MessageCircle style={{ width: '32px', height: '32px', marginBottom: '12px', opacity: 0.5, display: 'inline-block' }} />
                    <p>No feedback submitted yet. Share your thoughts about generated code!</p>
                    <Button
                      onClick={() => setShowFeedbackDialog(true)}
                      style={{
                        marginTop: '16px',
                        backgroundColor: '#FEC00F',
                        color: '#212121',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '13px',
                      }}
                    >
                      Submit Feedback
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Test Training Dialog */}
        <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
          <DialogContent style={{ backgroundColor: '#1E1E1E', border: '1px solid #424242', borderRadius: '12px' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#FFFFFF', fontFamily: "'Rajdhani', sans-serif" }}>Test Training</DialogTitle>
              <DialogDescription style={{ color: '#9E9E9E' }}>Generate code with and without training to compare quality</DialogDescription>
            </DialogHeader>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Prompt</label>
                <Textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="e.g., Create a moving average crossover strategy"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '80px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowTestDialog(false)} style={{ backgroundColor: '#424242', color: '#FFFFFF', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </Button>
                <Button onClick={handleTestTraining} disabled={isTesting} style={{ backgroundColor: '#FEC00F', color: '#212121', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: isTesting ? 'not-allowed' : 'pointer', opacity: isTesting ? 0.6 : 1 }}>
                  Run Test
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Suggest Training Dialog */}
        <Dialog open={showSuggestDialog} onOpenChange={setShowSuggestDialog}>
          <DialogContent style={{ backgroundColor: '#1E1E1E', border: '1px solid #424242', borderRadius: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#FFFFFF', fontFamily: "'Rajdhani', sans-serif" }}>Suggest Training</DialogTitle>
              <DialogDescription style={{ color: '#9E9E9E' }}>Help improve the AI by suggesting training examples</DialogDescription>
            </DialogHeader>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Title *</label>
                <Input
                  value={suggestForm.title}
                  onChange={(e) => setSuggestForm({ ...suggestForm, title: e.target.value })}
                  placeholder="What should be learned?"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF' }}
                />
              </div>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <Textarea
                  value={suggestForm.description}
                  onChange={(e) => setSuggestForm({ ...suggestForm, description: e.target.value })}
                  placeholder="Explain what this training should teach"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '60px' }}
                />
              </div>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Example Input</label>
                <Textarea
                  value={suggestForm.example_input}
                  onChange={(e) => setSuggestForm({ ...suggestForm, example_input: e.target.value })}
                  placeholder="Example input/prompt"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '60px' }}
                />
              </div>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Expected Output *</label>
                <Textarea
                  value={suggestForm.example_output}
                  onChange={(e) => setSuggestForm({ ...suggestForm, example_output: e.target.value })}
                  placeholder="Correct/desired output"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '80px' }}
                />
              </div>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Why is this important?</label>
                <Textarea
                  value={suggestForm.reason}
                  onChange={(e) => setSuggestForm({ ...suggestForm, reason: e.target.value })}
                  placeholder="Explain why the AI needs to learn this"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '60px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowSuggestDialog(false)} style={{ backgroundColor: '#424242', color: '#FFFFFF', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitSuggestion} disabled={isSubmitting} style={{ backgroundColor: '#FEC00F', color: '#212121', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}>
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent style={{ backgroundColor: '#1E1E1E', border: '1px solid #424242', borderRadius: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#FFFFFF', fontFamily: "'Rajdhani', sans-serif" }}>Submit Feedback</DialogTitle>
              <DialogDescription style={{ color: '#9E9E9E' }}>Help improve code generation with your feedback</DialogDescription>
            </DialogHeader>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Feedback Type *</label>
                <select
                  value={feedbackForm.feedback_type}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback_type: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', fontFamily: "'Quicksand', sans-serif" }}
                >
                  <option value="correction">Correction (Code was wrong)</option>
                  <option value="improvement">Improvement (Better approach)</option>
                  <option value="bug">Bug (Found a bug)</option>
                  <option value="praise">Praise (Excellent code)</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Your Feedback *</label>
                <Textarea
                  value={feedbackForm.feedback_text}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback_text: e.target.value })}
                  placeholder="What feedback do you have?"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '80px' }}
                />
              </div>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Correct Code (if applicable)</label>
                <Textarea
                  value={feedbackForm.correct_code}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, correct_code: e.target.value })}
                  placeholder="Provide the correct version if this is a correction"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '60px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Rating (1-5)</label>
                <select
                  value={feedbackForm.rating}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}
                  style={{ width: '100%', backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', fontFamily: "'Quicksand', sans-serif" }}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowFeedbackDialog(false)} style={{ backgroundColor: '#424242', color: '#FFFFFF', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitFeedback} disabled={isSubmitting} style={{ backgroundColor: '#FEC00F', color: '#212121', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}>
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
