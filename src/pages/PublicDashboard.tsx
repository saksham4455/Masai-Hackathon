import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Users, CheckCircle, Plus, ClipboardList } from 'lucide-react';
import { localStorageService, Issue, User } from '../lib/localStorage';
import { IssueMap } from '../components/IssueMap';
import { useAuth } from '../contexts/AuthContext';

export function PublicDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [issuesResult, usersResult] = await Promise.all([
        localStorageService.getIssues(),
        localStorageService.getUsers()
      ]);
      
      if (issuesResult.error) throw issuesResult.error;
      if (usersResult.error) throw usersResult.error;
      
      setIssues(issuesResult.issues);
      setUsers(usersResult.users);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <div className="text-xl font-heading text-gray-600 animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex-grow">
      {/* Top Banner - Social Proof */}
      <div className="bg-gradient-to-r from-accent-50 to-yellow-50 border-b border-accent-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-accent-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-accent-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Join <span className="text-gradient font-bold">{users.length} citizens</span> making a difference in their community
              </span>
            </div>
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors duration-300 hover:scale-105"
              >
                Get Started Free →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Your Voice Matters
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed">
              Empowering citizens to report, track, and resolve city issues together. 
              Make your neighborhood better, one issue at a time.
            </p>
            
            {/* Action Buttons for Citizens */}
            {user && profile?.role === 'citizen' && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
                <button
                  onClick={() => navigate('/report')}
                  className="group flex items-center justify-center space-x-3 bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span>Report an Issue</span>
                </button>
                <button
                  onClick={() => navigate('/my-complaints')}
                  className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <span>My Complaints</span>
                </button>
              </div>
            )}
            
            {/* Login CTA for non-authenticated users */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
                <button
                  onClick={() => navigate('/login')}
                  className="group flex items-center justify-center space-x-3 bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <span>Sign In to Report Issues</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Making city improvements is simple and transparent</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group animate-fade-in">
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="w-10 h-10 text-primary-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-gray-900">Report an Issue</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Submit issues with photos, location, and priority level</p>
            </div>
            
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ClipboardList className="w-10 h-10 text-accent-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-gray-900">Track Progress</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Follow your issue through the resolution process in real-time</p>
            </div>
            
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="relative mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="w-10 h-10 text-secondary-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-gray-900">See Results</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Watch your city improve as issues get resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card-enhanced p-8 text-center group hover:shadow-custom-lg transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-4xl font-heading font-bold text-gray-900 mb-2 animate-pulse-slow">{stats.total}</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Issues</div>
          </div>
          
          <div className="card-enhanced p-8 text-center group hover:shadow-custom-lg transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-4xl font-heading font-bold text-red-600 mb-2 animate-pulse-slow">{stats.pending}</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</div>
          </div>
          
          <div className="card-enhanced p-8 text-center group hover:shadow-custom-lg transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-8 h-8 text-accent-600" />
            </div>
            <div className="text-4xl font-heading font-bold text-accent-600 mb-2 animate-pulse-slow">{stats.inProgress}</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">In Progress</div>
          </div>
          
          <div className="card-enhanced p-8 text-center group hover:shadow-custom-lg transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-secondary-600" />
            </div>
            <div className="text-4xl font-heading font-bold text-secondary-600 mb-2 animate-pulse-slow">{stats.resolved}</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resolved</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card-enhanced p-8 text-center group hover:shadow-custom-lg transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-4xl font-heading font-bold text-purple-600 mb-2 animate-pulse-slow">{stats.resolutionRate}%</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resolution Rate</div>
          </div>
          
          <div className="card-enhanced p-8 text-center group hover:shadow-custom-lg transition-all duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-4xl font-heading font-bold text-indigo-600 mb-2 animate-pulse-slow">{stats.recentActivity}</div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Issues This Week</div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-16 mb-12 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                Why Choose <span className="text-gradient">Our Platform?</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Community Driven</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Built for citizens, by citizens</p>
              </div>
              
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Real-Time Updates</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Track issues as they're being resolved</p>
              </div>
              
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Priority System</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Critical issues get addressed first</p>
              </div>
              
              <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-secondary-600" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gray-900">Transparency</h3>
                <p className="text-gray-600 text-sm leading-relaxed">See all issues and their status publicly</p>
              </div>
            </div>
          </div>
        </div>

        {/* What Can You Report Section */}
        <div className="card-enhanced p-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-gray-900 mb-8">
            What Can You <span className="text-gradient">Report?</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Potholes', icon: '🚧', color: 'from-red-100 to-red-200', textColor: 'text-red-600' },
              { name: 'Garbage', icon: '🗑️', color: 'from-green-100 to-green-200', textColor: 'text-green-600' },
              { name: 'Street Lights', icon: '💡', color: 'from-yellow-100 to-yellow-200', textColor: 'text-yellow-600' },
              { name: 'Water Leaks', icon: '💧', color: 'from-blue-100 to-blue-200', textColor: 'text-blue-600' },
              { name: 'Broken Sidewalks', icon: '🚶', color: 'from-gray-100 to-gray-200', textColor: 'text-gray-600' },
              { name: 'Traffic Signals', icon: '🚦', color: 'from-orange-100 to-orange-200', textColor: 'text-orange-600' },
              { name: 'Drainage', icon: '🌊', color: 'from-cyan-100 to-cyan-200', textColor: 'text-cyan-600' },
              { name: 'Graffiti', icon: '🎨', color: 'from-purple-100 to-purple-200', textColor: 'text-purple-600' },
              { name: 'Tree Maintenance', icon: '🌳', color: 'from-emerald-100 to-emerald-200', textColor: 'text-emerald-600' },
              { name: 'Noise', icon: '🔊', color: 'from-pink-100 to-pink-200', textColor: 'text-pink-600' },
              { name: 'Parking', icon: '🅿️', color: 'from-indigo-100 to-indigo-200', textColor: 'text-indigo-600' },
              { name: 'Other', icon: '📋', color: 'from-slate-100 to-slate-200', textColor: 'text-slate-600' }
            ].map((item, index) => (
              <div key={item.name} className="group bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 text-center hover:from-primary-50 hover:to-purple-50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg border border-gray-100 hover:border-primary-200">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <span className={`font-semibold text-gray-700 group-hover:${item.textColor} transition-colors`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
