import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localStorageService, Issue } from '../lib/localStorage';
import { IssueMap } from '../components/IssueMap';

type AdminIssueDetailProps = {
  issueId: string;
  onNavigate: (page: string) => void;
};

export function AdminIssueDetail({ issueId, onNavigate }: AdminIssueDetailProps) {
  const { user, profile } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadIssue();
    }
  }, [user, profile, issueId]);

  const loadIssue = async () => {
    try {
      const { issue: issueData, error } = await localStorageService.getIssueById(issueId);

      if (error) throw error;
      if (issueData) {
        setIssue(issueData);
        setNewStatus(issueData.status);
      }
    } catch (error) {
      console.error('Error loading issue:', error);
      setError('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!issue || newStatus === issue.status) return;

    setUpdating(true);
    setError('');
    setSuccess(false);

    try {
      const { issue: updatedIssue, error } = await localStorageService.updateIssueStatus(issueId, newStatus as Issue['status']);

      if (error) throw error;

      if (updatedIssue) {
        setIssue(updatedIssue);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
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

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Access Denied: Admin Only</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Issue not found</p>
          <button
            onClick={() => onNavigate('admin')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
                {issue.issue_type}
              </h1>
              <p className="text-sm text-gray-500">Issue ID: {issue.id}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                issue.status
              )}`}
            >
              {getStatusLabel(issue.status)}
            </span>
          </div>

          {/* Citizen Report Details Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Citizen Report Details</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Date Reported</p>
                    <p className="font-medium text-gray-900">
                      {new Date(issue.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Reported By</p>
                    <p className="font-medium text-gray-900">User ID: {issue.user_id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">
                      {issue.location_address || `${Number(issue.latitude).toFixed(6)}, ${Number(issue.longitude).toFixed(6)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(issue.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 bg-white p-4 rounded-lg border">{issue.description}</p>
              </div>

              {issue.photo_url && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Submitted Photo(s)</h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <img
                      src={issue.photo_url}
                      alt="Issue"
                      className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(issue.photo_url, '_blank')}
                    />
                    <p className="text-sm text-gray-500 mt-2">Click image to view larger</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Location</h3>
                <div className="bg-white p-4 rounded-lg border">
                  <IssueMap
                    issues={[issue]}
                    center={{ lat: Number(issue.latitude), lng: Number(issue.longitude) }}
                    zoom={15}
                    height="400px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes Section */}
          {issue.admin_notes && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Notes</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700">{issue.admin_notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Issue Status</h2>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 text-green-700">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <span>Status updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-red-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <div
                className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  issue.status
                )}`}
              >
                {getStatusLabel(issue.status)}
              </div>
            </div>

            <div>
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating || newStatus === issue.status}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
