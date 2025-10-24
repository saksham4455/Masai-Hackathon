import { useState } from 'react';
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

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('');
  const { loading } = useAuth();

  const handleNavigate = (page: string, issueId?: string) => {
    setCurrentPage(page);
    if (issueId) {
      setSelectedIssueId(issueId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'login' && currentPage !== 'admin-login' && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {currentPage === 'home' && <PublicDashboard onNavigate={handleNavigate} />}
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'admin-login' && <AdminLoginPage onNavigate={handleNavigate} />}
      {currentPage === 'report' && <ReportIssuePage onNavigate={handleNavigate} />}
      {currentPage === 'my-complaints' && <MyComplaintsPage onNavigate={handleNavigate} />}
      {currentPage === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
      {currentPage === 'admin-action-panel' && <AdminActionPanel onNavigate={handleNavigate} />}
      {currentPage === 'admin-detail' && (
        <AdminIssueDetail issueId={selectedIssueId} onNavigate={handleNavigate} />
      )}
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
