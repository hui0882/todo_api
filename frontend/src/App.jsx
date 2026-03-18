import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import TodoPage from './pages/TodoPage';
import SettingsPage from './pages/SettingsPage';
import StressTestPage from './pages/StressTestPage';

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TodoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stress-test"
              element={
                <ProtectedRoute>
                  <StressTestPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
