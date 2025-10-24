import { useEffect, useState } from 'react';
import { Filter, MapPin, AlertTriangle, Users, CheckCircle, Plus, ClipboardList } from 'lucide-react';
import { localStorageService, Issue } from '../lib/localStorage';
import { IssueMap } from '../components/IssueMap';
import { useAuth } from '../contexts/AuthContext';

type PublicDashboardProps = {
  onNavigate: (page: string) => void;
};

export function PublicDashboard({ onNavigate }: PublicDashboardProps) {
  const { user, profile } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(issue => issue.issue_type === typeFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, statusFilter, typeFilter]);

  const loadIssues = async () => {
    try {
      const { issues, error } = await localStorageService.getIssues();
      
      if (error) throw error;
      setIssues(issues);
      setFilteredIssues(issues);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  // Calculate statistics
  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Improve My City</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Report problems. Track progress. Make your city better.
            </p>
            
            {/* Action Buttons for Citizens */}
            {user && profile?.role === 'citizen' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('report')}
                  className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Report an Issue</span>
                </button>
                <button
                  onClick={() => onNavigate('my-complaints')}
                  className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 transition-colors shadow-lg"
                >
                  <ClipboardList className="w-5 h-5" />
                  <span>My Complaints</span>
                </button>
              </div>
            )}
            
            {/* Login CTA for non-authenticated users */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  <span>Sign In to Report Issues</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Issues</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                Issues Map
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredIssues.length} of {issues.length} issues
              </div>
            </div>
            <IssueMap issues={filteredIssues} />
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Filter className="w-6 h-6 mr-2" />
              All Reports
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredIssues.length} of {issues.length} issues
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="pothole">Pothole</option>
                <option value="garbage">Garbage</option>
                <option value="streetlight">Streetlight</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No issues found</h3>
                <p className="text-gray-500">No issues match your current filters.</p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {issue.issue_type}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                      {issue.location_address && (
                        <p className="text-sm text-gray-500 mt-1">{issue.location_address}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {getStatusLabel(issue.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span>Reported on {new Date(issue.created_at).toLocaleDateString()}</span>
                    <span>Updated {new Date(issue.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
