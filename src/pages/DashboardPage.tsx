import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  MessageCircle,
  Database,
  TrendingUp,
  Zap,
  Plus,
  ArrowRight,
  Sparkles,
  FileCode,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    fontFamily: "'Quicksand', sans-serif",
  } as React.CSSProperties,
  header: {
    background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
    borderBottom: '1px solid #424242',
    padding: window.innerWidth < 768 ? '24px' : '32px',
  } as React.CSSProperties,
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  title: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: window.innerWidth < 768 ? '24px' : '36px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '8px',
    letterSpacing: '1px',
  } as React.CSSProperties,
  subtitle: {
    color: '#9E9E9E',
    fontSize: '14px',
    marginBottom: '16px',
  } as React.CSSProperties,
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: window.innerWidth < 768 ? '12px 20px' : '14px 28px',
    backgroundColor: '#FEC00F',
    color: '#212121',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  content: {
    padding: window.innerWidth < 768 ? '20px' : '32px',
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: window.innerWidth < 768 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  } as React.CSSProperties,
  statCard: {
    backgroundColor: '#1E1E1E',
    border: '1px solid #424242',
    borderRadius: '12px',
    padding: window.innerWidth < 768 ? '16px' : '24px',
  } as React.CSSProperties,
  statLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  } as React.CSSProperties,
  statValue: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: window.innerWidth < 768 ? '28px' : '36px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '4px',
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: window.innerWidth < 768 ? '16px' : '20px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '16px',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  } as React.CSSProperties,
  featureCard: {
    backgroundColor: '#1E1E1E',
    border: '1px solid #424242',
    borderRadius: '12px',
    padding: window.innerWidth < 768 ? '16px' : '24px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  featureIcon: {
    width: window.innerWidth < 768 ? '40px' : '48px',
    height: window.innerWidth < 768 ? '40px' : '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  } as React.CSSProperties,
  featureTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: window.innerWidth < 768 ? '15px' : '18px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  featureDesc: {
    color: '#9E9E9E',
    fontSize: '13px',
    marginBottom: '12px',
    lineHeight: 1.5,
  } as React.CSSProperties,
  featureLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#FEC00F',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: "'Rajdhani', sans-serif",
  } as React.CSSProperties,
  activityCard: {
    backgroundColor: '#1E1E1E',
    border: '1px solid #424242',
    borderRadius: '12px',
    overflow: 'hidden',
  } as React.CSSProperties,
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #424242',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Code2,
      title: 'AFL Generator',
      description: 'Generate AmiBroker Formula Language code from natural language descriptions',
      href: '/afl-generator',
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      icon: MessageCircle,
      title: 'AI Chat',
      description: 'Chat with AI to discuss strategies, get code reviews, and ask questions',
      href: '/chat',
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      icon: Database,
      title: 'Knowledge Base',
      description: 'Upload and search your trading knowledge and strategy documents',
      href: '/knowledge-base',
      color: '#22C55E',
      bgColor: 'rgba(34, 197, 94, 0.1)',
    },
    {
      icon: TrendingUp,
      title: 'Backtest Analysis',
      description: 'Upload and analyze your backtest results with AI-powered insights',
      href: '/backtest',
      color: '#F97316',
      bgColor: 'rgba(249, 115, 22, 0.1)',
    },
    {
      icon: Zap,
      title: 'Reverse Engineer',
      description: 'Convert existing trading strategies into working AFL code',
      href: '/reverse-engineer',
      color: '#FEC00F',
      bgColor: 'rgba(254, 192, 15, 0.1)',
    },
  ];

  const stats = [
    { label: 'Total Strategies', value: '12', sub: '+2 this week', icon: FileCode, color: '#3B82F6' },
    { label: 'Documents Uploaded', value: '8', sub: 'Knowledge base', icon: BookOpen, color: '#22C55E' },
    { label: 'Backtests Analyzed', value: '24', sub: 'Total completed', icon: BarChart3, color: '#8B5CF6' },
  ];

  const recentActivity = [
    { id: 1, action: 'Generated AFL code', time: '2 hours ago' },
    { id: 2, action: 'Uploaded backtest results', time: '4 hours ago' },
    { id: 3, action: 'Started reverse engineering session', time: '1 day ago' },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            Welcome, <span style={{ color: '#FEC00F' }}>{user?.name || 'Trader'}</span>!
          </h1>
          <p style={styles.subtitle}>
            Your AI-powered AFL code generation and trading strategy studio
          </p>
          <button
            onClick={() => navigate('/afl-generator')}
            style={styles.primaryBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFD740'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEC00F'; }}
          >
            <Plus size={18} />
            GENERATE CODE NOW
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={styles.statCard}>
                <div style={styles.statLabel}>
                  <span style={{ color: '#9E9E9E', fontSize: '14px', fontWeight: 500 }}>{stat.label}</span>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={{ color: '#757575', fontSize: '12px' }}>{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <h2 style={styles.sectionTitle}>
          <Sparkles size={20} style={{ color: '#FEC00F' }} />
          GET STARTED
        </h2>
        <div style={styles.featuresGrid}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.href}
                style={styles.featureCard}
                onClick={() => navigate(feature.href)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#757575';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#424242';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ ...styles.featureIcon, backgroundColor: feature.bgColor }}>
                  <Icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
                <span style={styles.featureLink}>
                  Get Started <ArrowRight size={16} />
                </span>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <h2 style={styles.sectionTitle}>
          <Sparkles size={20} style={{ color: '#FEC00F' }} />
          RECENT ACTIVITY
        </h2>
        <div style={styles.activityCard}>
          {recentActivity.map((activity, index) => (
            <div
              key={activity.id}
              style={{
                ...styles.activityItem,
                borderBottom: index === recentActivity.length - 1 ? 'none' : '1px solid #424242',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2A2A2A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#FEC00F', borderRadius: '50%' }} />
                <span style={{ color: '#FFFFFF', fontSize: '14px' }}>{activity.action}</span>
              </div>
              <span style={{ color: '#757575', fontSize: '13px' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
