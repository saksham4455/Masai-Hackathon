import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { PublicDashboard } from './pages/PublicDashboard';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminIssueDetail } from './pages/AdminIssueDetail';
import { AdminActionPanel } from './pages/AdminActionPanel';
import { UserProfilePage } from './pages/UserProfilePage';
import { AnalyticsPage } from './pages/AnalyticsPage';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<><Navbar /><PublicDashboard /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* User routes */}
        <Route path="/report" element={<><Navbar /><ReportIssuePage /></>} />
        <Route path="/my-complaints" element={<><Navbar /><MyComplaintsPage /></>} />
        <Route path="/profile" element={<><Navbar /><UserProfilePage /></>} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<><Navbar /><AdminDashboard /></>} />
        <Route path="/admin/issue/:issueId" element={<><Navbar /><AdminIssueDetail /></>} />
        <Route path="/admin/action-panel" element={<><Navbar /><AdminActionPanel /></>} />
        <Route path="/admin/analytics" element={<><Navbar /><AnalyticsPage /></>} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
