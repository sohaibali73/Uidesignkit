import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Settings,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Plus,
  Search,
  Loader,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const styles = {
  page: {
    minHeight: '100vh',
    fontFamily: "'Quicksand', sans-serif",
  } as React.CSSProperties,
  header: {
    borderBottom: '1px solid #424242',
    padding: '32px',
    transition: 'background-color 0.3s ease',
  } as React.CSSProperties,
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  title: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 500,
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
    fontSize: '28px',
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
    fontWeight: 700,
    marginBottom: '16px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,
  tableHeader: {
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
    padding: '12px',
    textAlign: 'left' as const,
    fontSize: '13px',
    fontWeight: 600,
    borderBottom: '1px solid #424242',
  } as React.CSSProperties,
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #424242',
    color: '#E0E0E0',
    fontSize: '13px',
  } as React.CSSProperties,
  tableRow: {
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
  inputField: {
    backgroundColor: '#2A2A2A',
    border: '1px solid #424242',
    color: '#FFFFFF',
    borderRadius: '6px',
    padding: '8px 12px',
    fontFamily: "'Quicksand', sans-serif",
    fontSize: '13px',
  } as React.CSSProperties,
};

export function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Load admin data here
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.page, backgroundColor: '#121212' }}>
        <div style={{ ...styles.header, backgroundColor: '#1E1E1E', borderColor: '#424242' }}>
          <div style={styles.headerContent}>
            <h1 style={{ ...styles.title, color: '#FFFFFF' }}>Admin Panel</h1>
            <p style={{ ...styles.subtitle, color: '#9E9E9E' }}>Manage system, users, and content</p>
          </div>
        </div>
        <div style={{ ...styles.content, backgroundColor: '#121212' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9E9E9E' }}>
            <Loader style={{ width: '32px', height: '32px', animation: 'spin 2s linear infinite', marginBottom: '16px', display: 'inline-block' }} />
            <p>Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.page, backgroundColor: '#121212' }}>
      {/* Header */}
      <div style={{ ...styles.header, backgroundColor: '#1E1E1E', borderColor: '#424242' }}>
        <div style={styles.headerContent}>
          <h1 style={{ ...styles.title, color: '#FFFFFF' }}>Admin Panel</h1>
          <p style={{ ...styles.subtitle, color: '#9E9E9E' }}>Manage system, users, and content</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ ...styles.content, backgroundColor: '#121212' }}>
        {error && (
          <Alert style={{ marginBottom: '20px', backgroundColor: '#F4444422', border: '1px solid #F4444444' }}>
            <AlertCircle style={{ color: '#F44444' }} />
            <AlertDescription style={{ color: '#F44444' }}>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ backgroundColor: 'transparent', borderBottom: '2px solid #424242', marginBottom: '24px', padding: '0', height: 'auto', display: 'flex', gap: '0' }}>
            <TabsTrigger value="overview" style={{ color: activeTab === 'overview' ? '#FEC00F' : '#9E9E9E', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'overview' ? '3px solid #FEC00F' : 'none', borderRadius: '0', padding: '12px 20px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px', transition: 'all 0.2s ease', cursor: 'pointer', textTransform: 'uppercase' }}>
              <BarChart3 style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" style={{ color: activeTab === 'users' ? '#FEC00F' : '#9E9E9E', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'users' ? '3px solid #FEC00F' : 'none', borderRadius: '0', padding: '12px 20px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px', transition: 'all 0.2s ease', cursor: 'pointer', textTransform: 'uppercase' }}>
              <Users style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" style={{ color: activeTab === 'content' ? '#FEC00F' : '#9E9E9E', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'content' ? '3px solid #FEC00F' : 'none', borderRadius: '0', padding: '12px 20px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px', transition: 'all 0.2s ease', cursor: 'pointer', textTransform: 'uppercase' }}>
              <FileText style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" style={{ color: activeTab === 'settings' ? '#FEC00F' : '#9E9E9E', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'settings' ? '3px solid #FEC00F' : 'none', borderRadius: '0', padding: '12px 20px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '14px', letterSpacing: '0.5px', transition: 'all 0.2s ease', cursor: 'pointer', textTransform: 'uppercase' }}>
              <Settings style={{ marginRight: '8px', width: '16px', height: '16px' }} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>System Statistics</h2>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>1,234</div>
                    <div style={styles.statLabel}>Total Users</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>567</div>
                    <div style={styles.statLabel}>Active Today</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>45</div>
                    <div style={styles.statLabel}>New Signups</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statValue}>98.5%</div>
                    <div style={styles.statLabel}>Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>User Management</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={{ backgroundColor: '#2A2A2A' }}>
                      <th style={styles.tableHeader}>Username</th>
                      <th style={styles.tableHeader}>Email</th>
                      <th style={styles.tableHeader}>Role</th>
                      <th style={styles.tableHeader}>Status</th>
                      <th style={styles.tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={styles.tableRow}>
                      <td style={styles.tableCell}>user123</td>
                      <td style={styles.tableCell}>user@example.com</td>
                      <td style={styles.tableCell}>User</td>
                      <td style={styles.tableCell}>
                        <span style={{ color: '#4CAF50', fontSize: '12px', fontWeight: 600 }}>Active</span>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.buttonGroup}>
                          <button style={{ backgroundColor: '#424242', color: '#FFFFFF', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Edit</button>
                          <button style={{ backgroundColor: '#F4444422', color: '#F44444', padding: '6px 12px', borderRadius: '6px', border: '1px solid #F44444', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Ban</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Content Management</h2>
              <p style={{ color: '#9E9E9E', marginBottom: '20px', fontSize: '14px' }}>Manage training materials, knowledge base, and system content</p>
              <button style={{ backgroundColor: '#FEC00F', color: '#212121', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus style={{ width: '16px', height: '16px' }} />
                Add Content
              </button>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>System Settings</h2>
              <p style={{ color: '#9E9E9E', marginBottom: '20px', fontSize: '14px' }}>Configure system-wide settings and preferences</p>
              <div style={{ display: 'grid', gap: '20px', maxWidth: '400px' }}>
                <div>
                  <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>API Key</label>
                  <Input placeholder="Enter API key" style={{ ...styles.inputField }} />
                </div>
                <div>
                  <label style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Max Users</label>
                  <Input type="number" placeholder="Enter max users" style={{ ...styles.inputField }} />
                </div>
                <button style={{ backgroundColor: '#FEC00F', color: '#212121', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px', width: '100%' }}>
                  Save Settings
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
