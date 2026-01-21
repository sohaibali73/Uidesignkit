import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  MessageCircle,
  Database,
  TrendingUp,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import yellowLogo from '@/assets/yellowlogo.png';
import blackLogo from '@/assets/blacklogo.png';

const navItems = [
  { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AFL GENERATOR', href: '/afl-generator', icon: Code2 },
  { name: 'CHAT', href: '/chat', icon: MessageCircle },
  { name: 'SETTINGS', href: '/settings', icon: Settings },
  { name: 'KNOWLEDGE BASE', href: '/knowledge-base', icon: Database },
  { name: 'BACKTEST', href: '/backtest', icon: TrendingUp },
  { name: 'REVERSE ENGINEER', href: '/reverse-engineer', icon: Zap },
];

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 256;
  const isDark = resolvedTheme === 'dark';

  // Theme-aware colors
  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    sidebar: isDark ? '#1E1E1E' : '#f5f5f5',
    border: isDark ? '#424242' : '#e0e0e0',
    text: isDark ? '#FFFFFF' : '#212121',
    textMuted: isDark ? '#9E9E9E' : '#757575',
    textSecondary: isDark ? '#757575' : '#9E9E9E',
    hoverBg: isDark ? '#2A2A2A' : '#e8e8e8',
    inputBg: isDark ? '#2A2A2A' : '#ffffff',
    accent: '#FEC00F',
    accentText: '#212121',
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: "'Quicksand', sans-serif",
      transition: 'background-color 0.3s ease',
    } as React.CSSProperties,
    sidebar: {
      position: 'fixed' as const,
      left: 0,
      top: 0,
      height: '100vh',
      backgroundColor: colors.sidebar,
      borderRight: `1px solid ${colors.border}`,
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'width 0.3s ease, background-color 0.3s ease',
      zIndex: 50,
    } as React.CSSProperties,
    logoSection: {
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      borderBottom: `1px solid ${colors.border}`,
    } as React.CSSProperties,
    logoBox: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    } as React.CSSProperties,
    logoText: {
      fontFamily: "'Rajdhani', sans-serif",
      fontWeight: 700,
      fontSize: '20px',
      color: colors.text,
      letterSpacing: '2px',
      marginLeft: '12px',
      transition: 'color 0.3s ease',
    } as React.CSSProperties,
    nav: {
      flex: 1,
      padding: '16px 12px',
      overflowY: 'auto' as const,
    } as React.CSSProperties,
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      marginBottom: '4px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'left' as const,
      transition: 'all 0.2s',
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: '13px',
      fontWeight: 600,
      letterSpacing: '0.5px',
    } as React.CSSProperties,
    userSection: {
      padding: '16px',
      borderTop: `1px solid ${colors.border}`,
    } as React.CSSProperties,
    userAvatar: {
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
    } as React.CSSProperties,
    main: {
      flex: 1,
      minHeight: '100vh',
      transition: 'margin-left 0.3s ease',
    } as React.CSSProperties,
    collapseBtn: {
      background: 'none',
      border: 'none',
      color: colors.textMuted,
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease',
    } as React.CSSProperties,
    logoutBtn: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px',
      backgroundColor: 'transparent',
      color: '#DC2626',
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      fontFamily: "'Rajdhani', sans-serif",
      letterSpacing: '0.5px',
      marginTop: '12px',
      transition: 'background-color 0.2s ease',
    } as React.CSSProperties,
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === href;
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarWidth }}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={styles.logoBox}>
              <img 
                src={yellowLogo} 
                alt="Analyst Logo" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
            {!collapsed && <span style={styles.logoText}>ANALYST</span>}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={styles.collapseBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hoverBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                style={{
                  ...styles.navButton,
                  backgroundColor: active ? colors.accent : 'transparent',
                  color: active ? colors.accentText : colors.textMuted,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                    e.currentTarget.style.color = colors.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.textMuted;
                  }
                }}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div style={styles.userSection}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: colors.text, fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.3s ease' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ color: colors.textSecondary, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            style={styles.logoutBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={16} />
            {!collapsed && 'LOGOUT'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ ...styles.main, marginLeft: sidebarWidth }}>
        <Outlet />
      </main>
    </div>
  );
}