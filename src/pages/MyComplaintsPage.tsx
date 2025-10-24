import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localStorageService, Issue } from '../lib/localStorage';

type MyComplaintsPageProps = {
  onNavigate: (page: string) => void;
};

export function MyComplaintsPage({ onNavigate }: MyComplaintsPageProps) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMyIssues();
    }
  }, [user]);

  const loadMyIssues = async () => {
    try {
      if (!user?.id) return;
      
      const { issues, error } = await localStorageService.getUserIssues(user.id);
      
      if (error) throw error;
      setIssues(issues);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to view your complaints</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Login
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <ClipboardList className="w-10 h-10 mr-3" />
            My Complaints
          </h1>
          <p className="text-gray-600">Track the status of all your reported issues</p>
        </div>

        {issues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No complaints yet</h2>
            <p className="text-gray-500 mb-6">Start by reporting an issue in your city</p>
            <button
              onClick={() => onNavigate('report')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Report an Issue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 capitalize">
                        {issue.issue_type}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {getStatusLabel(issue.status)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{issue.description}</p>
                    {issue.location_address && (
                      <p className="text-sm text-gray-500 mb-2">{issue.location_address}</p>
                    )}
                    {issue.photo_url && (
                      <img
                        src={issue.photo_url}
                        alt="Issue"
                        className="mt-3 max-w-sm rounded-lg border-2 border-gray-200"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-3 mt-3">
                  <div className="flex space-x-4">
                    <span>
                      <span className="font-medium">Reported:</span>{' '}
                      {new Date(issue.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(issue.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">ID: {issue.id.slice(0, 8)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
