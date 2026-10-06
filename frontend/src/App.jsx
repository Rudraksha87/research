import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewResearchPage from './pages/NewResearchPage';
import ResearchPage from './pages/ResearchPage';
import PapersPage from './pages/PapersPage';
import AnalysisPage from './pages/AnalysisPage';
import ComparisonPage from './pages/ComparisonPage';
import ResearchGapsPage from './pages/ResearchGapsPage';
import FutureResearchPage from './pages/FutureResearchPage';
import ReportPage from './pages/ReportPage';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full ${isAuthPage ? 'max-w-none' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research"
              element={
                <ProtectedRoute>
                  <NewResearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-research"
              element={
                <ProtectedRoute>
                  <NewResearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:id"
              element={
                <ProtectedRoute>
                  <ResearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:id/papers"
              element={
                <ProtectedRoute>
                  <PapersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:id/analysis"
              element={
                <ProtectedRoute>
                  <AnalysisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:id/comparison"
              element={
                <ProtectedRoute>
                  <ComparisonPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:id/gaps"
              element={
                <ProtectedRoute>
                  <ResearchGapsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:id/future"
              element={
                <ProtectedRoute>
                  <FutureResearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research/:id/report"
              element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
