import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';  // Named import
import MainLayout  from './layouts/MainLayout';              // Named import

// Page imports - all named imports except ReverseEngineerPage
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AFLGeneratorPage } from './pages/AFLGeneratorPage';
import { ChatPage } from './pages/ChatPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { BacktestPage } from './pages/BacktestPage';
import ReverseEngineerPage from './pages/ReverseEngineerPage';  // Default import
import { SettingsPage } from './pages/SettingsPage';

// Add this route inside the protected routes:




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="afl" element={<AFLGeneratorPage />} />
            <Route path="afl-generator" element={<AFLGeneratorPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="knowledge" element={<KnowledgeBasePage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="backtest" element={<BacktestPage />} />
            <Route path="reverse-engineer" element={<ReverseEngineerPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
