import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  MessageSquare,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import {
  TrainingData,
  AdminStatus,
  UserFeedback,
  TrainingSuggestion,
  AnalyticsOverview,
  AdminUser,
} from '@/types/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  } as React.CSSProperties,
  statCard: {
    backgroundColor: '#1E1E1E',
    border: '1px solid #424242',
    borderRadius: '12px',
    padding: '20px',
  } as React.CSSProperties,
  statValue: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '28px',
    fontWeight: 700,
    color: '#FEC00F',
    marginBottom: '4px',
  } as React.CSSProperties,
  statLabel: {
    color: '#9E9E9E',
    fontSize: '13px',
    fontWeight: 600,
  } as React.CSSProperties,
  tabsContainer: {
    backgroundColor: '#1E1E1E',
    border: '1px solid #424242',
    borderRadius: '12px',
    padding: '0',
  } as React.CSSProperties,
  tableContainer: {
    overflowX: 'auto' as const,
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,
  tableHeader: {
    backgroundColor: '#2A2A2A',
    borderBottom: '1px solid #424242',
  } as React.CSSProperties,
  tableHeaderCell: {
    padding: '12px',
    textAlign: 'left' as const,
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
  } as React.CSSProperties,
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #333333',
    fontSize: '13px',
    color: '#E0E0E0',
  } as React.CSSProperties,
  tableRow: {
    backgroundColor: '#1E1E1E',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 600,
  } as React.CSSProperties,
  badgePending: {
    backgroundColor: '#FEC00F22',
    color: '#FEC00F',
    border: '1px solid #FEC00F44',
  } as React.CSSProperties,
  badgeApproved: {
    backgroundColor: '#4CAF5022',
    color: '#4CAF50',
    border: '1px solid #4CAF5044',
  } as React.CSSProperties,
  badgeRejected: {
    backgroundColor: '#F4444422',
    color: '#F44444',
    border: '1px solid #F4444444',
  } as React.CSSProperties,
  actionButton: {
    padding: '6px 12px',
    marginRight: '4px',
    fontSize: '12px',
  } as React.CSSProperties,
};

interface TabData {
  trainingData: TrainingData[];
  feedback: UserFeedback[];
  suggestions: TrainingSuggestion[];
  users: AdminUser[];
  adminStatus: AdminStatus | null;
  analytics: AnalyticsOverview | null;
}

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Data state
  const [data, setData] = useState<TabData>({
    trainingData: [],
    feedback: [],
    suggestions: [],
    users: [],
    adminStatus: null,
    analytics: null,
  });

  // Form state
  const [trainingForm, setTrainingForm] = useState({
    title: '',
    input_prompt: '',
    expected_output: '',
    explanation: '',
    training_type: 'example' as any,
    category: 'afl' as any,
    priority: 5,
  });

  // Load data
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadAllData();
  }, [isAdmin, navigate]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [adminStatus, trainingList, feedback, suggestions, users] = await Promise.all([
        apiClient.getAdminStatus(),
        apiClient.getTrainingList({ limit: 100 }),
        apiClient.getAllFeedback({ limit: 100 }),
        apiClient.getAllSuggestions(),
        apiClient.getUsers(),
      ]);

      setData({
        trainingData: trainingList,
        feedback: feedback,
        suggestions: suggestions,
        users: users,
        adminStatus: adminStatus,
        analytics: adminStatus.stats as any,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTraining = async () => {
    try {
      await apiClient.addTraining(trainingForm);
      setShowDialog(false);
      setTrainingForm({
        title: '',
        input_prompt: '',
        expected_output: '',
        explanation: '',
        training_type: 'example',
        category: 'afl',
        priority: 5,
      });
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add training');
    }
  };

  const handleDeleteTraining = async (id: string) => {
    try {
      await apiClient.deleteTraining(id);
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete training');
    }
  };

  const handleToggleTraining = async (id: string) => {
    try {
      await apiClient.toggleTraining(id);
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle training');
    }
  };

  const handleReviewFeedback = async (feedbackId: string, status: any) => {
    try {
      await apiClient.reviewFeedback(feedbackId, {
        status,
        admin_notes: 'Reviewed by admin',
      });
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review feedback');
    }
  };

  const handleReviewSuggestion = async (suggestionId: string, status: any) => {
    try {
      await apiClient.reviewSuggestion(suggestionId, {
        status,
        priority: 5,
      });
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review suggestion');
    }
  };

  const handleExportTraining = async () => {
    try {
      const training = await apiClient.exportTraining();
      const dataStr = JSON.stringify(training, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `training-data-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export training data');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pending_review':
        return { ...styles.badge, ...styles.badgePending };
      case 'approved':
      case 'reviewed':
      case 'implemented':
        return { ...styles.badge, ...styles.badgeApproved };
      case 'rejected':
        return { ...styles.badge, ...styles.badgeRejected };
      default:
        return { ...styles.badge };
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage training data, review feedback, and monitor analytics</p>
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

        {/* Stats Overview */}
        {data.adminStatus && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{data.adminStatus.stats.total_users}</div>
              <div style={styles.statLabel}>Total Users</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{data.adminStatus.stats.training.total}</div>
              <div style={styles.statLabel}>Training Examples</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{data.adminStatus.stats.training.active}</div>
              <div style={styles.statLabel}>Active Training</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{data.feedback.filter((f) => f.status === 'pending_review').length}</div>
              <div style={styles.statLabel}>Pending Feedback</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ backgroundColor: '#1E1E1E', borderBottom: '1px solid #424242', marginBottom: '20px' }}>
            <TabsTrigger value="overview" style={{ color: activeTab === 'overview' ? '#FEC00F' : '#9E9E9E' }}>
              <BarChart3 style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="training" style={{ color: activeTab === 'training' ? '#FEC00F' : '#9E9E9E' }}>
              <BookOpen style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Training Data
            </TabsTrigger>
            <TabsTrigger value="feedback" style={{ color: activeTab === 'feedback' ? '#FEC00F' : '#9E9E9E' }}>
              <MessageSquare style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="suggestions" style={{ color: activeTab === 'suggestions' ? '#FEC00F' : '#9E9E9E' }}>
              <AlertCircle style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="users" style={{ color: activeTab === 'users' ? '#FEC00F' : '#9E9E9E' }}>
              <Users style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div style={styles.tabsContainer}>
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}>
                  System Overview
                </h2>
                {data.adminStatus && (
                  <div>
                    <p style={{ color: '#9E9E9E', marginBottom: '12px' }}>
                      Total Users: <span style={{ color: '#FEC00F', fontWeight: 'bold' }}>{data.adminStatus.stats.total_users}</span>
                    </p>
                    <p style={{ color: '#9E9E9E', marginBottom: '12px' }}>
                      Total Documents: <span style={{ color: '#FEC00F', fontWeight: 'bold' }}>{data.adminStatus.stats.total_documents}</span>
                    </p>
                    <p style={{ color: '#9E9E9E', marginBottom: '12px' }}>
                      Training Examples: <span style={{ color: '#FEC00F', fontWeight: 'bold' }}>{data.adminStatus.stats.training.total}</span>
                    </p>
                    <p style={{ color: '#9E9E9E' }}>
                      Active Training: <span style={{ color: '#FEC00F', fontWeight: 'bold' }}>{data.adminStatus.stats.training.active}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training">
            <div style={styles.tabsContainer}>
              <div style={{ padding: '20px', borderBottom: '1px solid #424242', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Training Data Management
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    onClick={() => setShowDialog(true)}
                    style={{
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
                    <Plus style={{ marginRight: '6px', width: '14px', height: '14px' }} />
                    Add Training
                  </Button>
                  <Button
                    onClick={handleExportTraining}
                    style={{
                      backgroundColor: '#424242',
                      color: '#FFFFFF',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    <Download style={{ marginRight: '6px', width: '14px', height: '14px' }} />
                    Export
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9E9E9E' }}>
                  <Loader style={{ display: 'inline-block', animation: 'spin 2s linear infinite', marginBottom: '10px' }} />
                  <p>Loading...</p>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                      <tr>
                        <th style={styles.tableHeaderCell}>Title</th>
                        <th style={styles.tableHeaderCell}>Type</th>
                        <th style={styles.tableHeaderCell}>Category</th>
                        <th style={styles.tableHeaderCell}>Priority</th>
                        <th style={styles.tableHeaderCell}>Status</th>
                        <th style={styles.tableHeaderCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.trainingData.map((training) => (
                        <tr key={training.id} style={styles.tableRow}>
                          <td style={styles.tableCell}>{training.title}</td>
                          <td style={styles.tableCell}>{training.training_type}</td>
                          <td style={styles.tableCell}>{training.category}</td>
                          <td style={styles.tableCell}>{training.priority}</td>
                          <td style={styles.tableCell}>
                            <span style={getStatusBadgeStyle(training.is_active ? 'approved' : 'pending')}>
                              {training.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={styles.tableCell}>
                            <Button
                              onClick={() => handleToggleTraining(training.id)}
                              style={{ ...styles.actionButton, backgroundColor: '#424242', color: '#FEC00F', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              <RefreshCw style={{ width: '12px', height: '12px' }} />
                            </Button>
                            <Button
                              onClick={() => handleDeleteTraining(training.id)}
                              style={{ ...styles.actionButton, backgroundColor: '#F4444422', color: '#F44444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ width: '12px', height: '12px' }} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <div style={styles.tabsContainer}>
              <div style={{ padding: '20px', borderBottom: '1px solid #424242' }}>
                <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Feedback Review
                </h2>
              </div>

              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9E9E9E' }}>
                  <Loader style={{ display: 'inline-block', animation: 'spin 2s linear infinite', marginBottom: '10px' }} />
                  <p>Loading...</p>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                      <tr>
                        <th style={styles.tableHeaderCell}>User</th>
                        <th style={styles.tableHeaderCell}>Type</th>
                        <th style={styles.tableHeaderCell}>Rating</th>
                        <th style={styles.tableHeaderCell}>Status</th>
                        <th style={styles.tableHeaderCell}>Created</th>
                        <th style={styles.tableHeaderCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.feedback.map((feedback) => (
                        <tr key={feedback.id} style={styles.tableRow}>
                          <td style={styles.tableCell}>{feedback.user_id.substring(0, 8)}...</td>
                          <td style={styles.tableCell}>{feedback.feedback_type}</td>
                          <td style={styles.tableCell}>{feedback.rating ? `${feedback.rating}/5` : 'N/A'}</td>
                          <td style={styles.tableCell}>
                            <span style={getStatusBadgeStyle(feedback.status)}>{feedback.status}</span>
                          </td>
                          <td style={styles.tableCell}>{new Date(feedback.created_at).toLocaleDateString()}</td>
                          <td style={styles.tableCell}>
                            {feedback.status === 'pending_review' && (
                              <>
                                <Button
                                  onClick={() => handleReviewFeedback(feedback.id, 'reviewed')}
                                  style={{ ...styles.actionButton, backgroundColor: '#4CAF5022', color: '#4CAF50', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  <CheckCircle style={{ width: '12px', height: '12px' }} />
                                </Button>
                                <Button
                                  onClick={() => handleReviewFeedback(feedback.id, 'rejected')}
                                  style={{ ...styles.actionButton, backgroundColor: '#F4444422', color: '#F44444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  <XCircle style={{ width: '12px', height: '12px' }} />
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions">
            <div style={styles.tabsContainer}>
              <div style={{ padding: '20px', borderBottom: '1px solid #424242' }}>
                <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  Training Suggestions
                </h2>
              </div>

              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9E9E9E' }}>
                  <Loader style={{ display: 'inline-block', animation: 'spin 2s linear infinite', marginBottom: '10px' }} />
                  <p>Loading...</p>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                      <tr>
                        <th style={styles.tableHeaderCell}>Title</th>
                        <th style={styles.tableHeaderCell}>User</th>
                        <th style={styles.tableHeaderCell}>Status</th>
                        <th style={styles.tableHeaderCell}>Priority</th>
                        <th style={styles.tableHeaderCell}>Created</th>
                        <th style={styles.tableHeaderCell}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.suggestions.map((suggestion) => (
                        <tr key={suggestion.id} style={styles.tableRow}>
                          <td style={styles.tableCell}>{suggestion.title}</td>
                          <td style={styles.tableCell}>{suggestion.user_id.substring(0, 8)}...</td>
                          <td style={styles.tableCell}>
                            <span style={getStatusBadgeStyle(suggestion.status)}>{suggestion.status}</span>
                          </td>
                          <td style={styles.tableCell}>{suggestion.priority || '—'}</td>
                          <td style={styles.tableCell}>{new Date(suggestion.created_at).toLocaleDateString()}</td>
                          <td style={styles.tableCell}>
                            {suggestion.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => handleReviewSuggestion(suggestion.id, 'approved')}
                                  style={{ ...styles.actionButton, backgroundColor: '#4CAF5022', color: '#4CAF50', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  <CheckCircle style={{ width: '12px', height: '12px' }} />
                                </Button>
                                <Button
                                  onClick={() => handleReviewSuggestion(suggestion.id, 'rejected')}
                                  style={{ ...styles.actionButton, backgroundColor: '#F4444422', color: '#F44444', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  <XCircle style={{ width: '12px', height: '12px' }} />
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div style={styles.tabsContainer}>
              <div style={{ padding: '20px', borderBottom: '1px solid #424242' }}>
                <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  User Management
                </h2>
              </div>

              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9E9E9E' }}>
                  <Loader style={{ display: 'inline-block', animation: 'spin 2s linear infinite', marginBottom: '10px' }} />
                  <p>Loading...</p>
                </div>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                      <tr>
                        <th style={styles.tableHeaderCell}>Email</th>
                        <th style={styles.tableHeaderCell}>Name</th>
                        <th style={styles.tableHeaderCell}>Admin</th>
                        <th style={styles.tableHeaderCell}>Codes Generated</th>
                        <th style={styles.tableHeaderCell}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map((user) => (
                        <tr key={user.id} style={styles.tableRow}>
                          <td style={styles.tableCell}>{user.email}</td>
                          <td style={styles.tableCell}>{user.name || '—'}</td>
                          <td style={styles.tableCell}>
                            <span style={getStatusBadgeStyle(user.is_admin ? 'approved' : 'pending')}>
                              {user.is_admin ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td style={styles.tableCell}>{user.codes_generated || 0}</td>
                          <td style={styles.tableCell}>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Training Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent style={{ backgroundColor: '#1E1E1E', border: '1px solid #424242', borderRadius: '12px' }}>
            <DialogHeader>
              <DialogTitle style={{ color: '#FFFFFF', fontFamily: "'Rajdhani', sans-serif" }}>Add Training Data</DialogTitle>
              <DialogDescription style={{ color: '#9E9E9E' }}>Create a new training example for the AI model.</DialogDescription>
            </DialogHeader>

            <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Title</label>
                <Input
                  value={trainingForm.title}
                  onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                  placeholder="Training title"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF' }}
                />
              </div>

              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Training Type</label>
                <Select value={trainingForm.training_type} onValueChange={(value) => setTrainingForm({ ...trainingForm, training_type: value })}>
                  <SelectTrigger style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#1E1E1E', border: '1px solid #424242' }}>
                    <SelectItem value="example">Example</SelectItem>
                    <SelectItem value="rule">Rule</SelectItem>
                    <SelectItem value="pattern">Pattern</SelectItem>
                    <SelectItem value="anti_pattern">Anti-Pattern</SelectItem>
                    <SelectItem value="correction">Correction</SelectItem>
                    <SelectItem value="terminology">Terminology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                <Select value={trainingForm.category} onValueChange={(value) => setTrainingForm({ ...trainingForm, category: value })}>
                  <SelectTrigger style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#1E1E1E', border: '1px solid #424242' }}>
                    <SelectItem value="afl">AFL</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="backtesting">Backtesting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Input Prompt</label>
                <Textarea
                  value={trainingForm.input_prompt}
                  onChange={(e) => setTrainingForm({ ...trainingForm, input_prompt: e.target.value })}
                  placeholder="Example input prompt"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '80px' }}
                />
              </div>

              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Expected Output</label>
                <Textarea
                  value={trainingForm.expected_output}
                  onChange={(e) => setTrainingForm({ ...trainingForm, expected_output: e.target.value })}
                  placeholder="Expected model output"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '80px' }}
                />
              </div>

              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Explanation</label>
                <Textarea
                  value={trainingForm.explanation}
                  onChange={(e) => setTrainingForm({ ...trainingForm, explanation: e.target.value })}
                  placeholder="Why this training is important"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF', minHeight: '60px' }}
                />
              </div>

              <div>
                <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Priority (1-10)</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={trainingForm.priority}
                  onChange={(e) => setTrainingForm({ ...trainingForm, priority: parseInt(e.target.value) })}
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #424242', color: '#FFFFFF' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button
                  onClick={() => setShowDialog(false)}
                  style={{
                    backgroundColor: '#424242',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTraining}
                  style={{
                    backgroundColor: '#FEC00F',
                    color: '#212121',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Add Training
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
