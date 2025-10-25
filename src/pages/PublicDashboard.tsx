import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, MapPin, AlertTriangle, Users, CheckCircle, Plus, ClipboardList } from 'lucide-react';
import { localStorageService, Issue } from '../lib/localStorage';
import { IssueMap } from '../components/IssueMap';
import { useAuth } from '../contexts/AuthContext';

export function PublicDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    let filtered = issues;

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((issue) => 
        issue.description.toLowerCase().includes(query) ||
        issue.id.toLowerCase().includes(query) ||
        (issue.location_address && issue.location_address.toLowerCase().includes(query)) ||
        issue.issue_type.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(issue => issue.issue_type === typeFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, statusFilter, typeFilter, searchQuery]);

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
    
    // Resolution rate
    resolutionRate: issues.length > 0 ? Math.round((issues.filter(i => i.status === 'resolved').length / issues.length) * 100) : 0,
    
    // Recent activity (last 7 days)
    recentActivity: issues.filter(i => {
      const issueDate = new Date(i.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return issueDate >= weekAgo;
    }).length,
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
      {/* Top Banner - Social Proof */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">
                Join <strong>{issues.length} citizens</strong> making a difference in their community
              </span>
            </div>
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Get Started Free →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Your Voice Matters</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Empowering citizens to report, track, and resolve city issues together. 
              Make your neighborhood better, one issue at a time.
            </p>
            
            {/* Action Buttons for Citizens */}
            {user && profile?.role === 'citizen' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/report')}
                  className="flex items-center justify-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Report an Issue</span>
                </button>
                <button
                  onClick={() => navigate('/my-complaints')}
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
                  onClick={() => navigate('/login')}
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

      {/* How It Works Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Making city improvements is simple and transparent</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Report an Issue</h3>
              <p className="text-gray-600">Submit issues with photos, location, and priority level</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Track Progress</h3>
              <p className="text-gray-600">Follow your issue through the resolution process in real-time</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. See Results</h3>
              <p className="text-gray-600">Watch your city improve as issues get resolved</p>
            </div>
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

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.resolutionRate}%</div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.recentActivity}</div>
            <div className="text-sm text-gray-600">Issues This Week</div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gray-50 py-12 mb-8 rounded-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
                <p className="text-gray-600 text-sm">Built for citizens, by citizens</p>
              </div>
              
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <MapPin className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Real-Time Updates</h3>
                <p className="text-gray-600 text-sm">Track issues as they're being resolved</p>
              </div>
              
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Priority System</h3>
                <p className="text-gray-600 text-sm">Critical issues get addressed first</p>
              </div>
              
              <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">See all issues and their status publicly</p>
              </div>
            </div>
          </div>
        </div>

        {/* What Can You Report Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">What Can You Report?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Potholes', 'Garbage', 'Street Lights', 'Water Leaks', 
              'Broken Sidewalks', 'Traffic Signals', 'Drainage', 'Graffiti', 
              'Tree Maintenance', 'Noise', 'Parking', 'Other'].map((type) => (
              <div key={type} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition">
                <span className="font-medium text-gray-700">{type}</span>
              </div>
            ))}
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
            {/* Search Input */}
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by description, location, ID, or type..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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
                <option value="garbage">Garbage Collection</option>
                <option value="streetlight">Streetlight Failure</option>
                <option value="water_leak">Water Leak</option>
                <option value="broken_sidewalk">Broken Sidewalk</option>
                <option value="traffic_signal">Traffic Signal Issue</option>
                <option value="street_sign">Damaged/Missing Street Sign</option>
                <option value="drainage">Drainage Problem</option>
                <option value="tree_maintenance">Tree Maintenance</option>
                <option value="graffiti">Graffiti/Vandalism</option>
                <option value="noise_complaint">Noise Complaint</option>
                <option value="parking_violation">Parking Violation</option>
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
