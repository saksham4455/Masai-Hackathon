import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Users, CheckCircle, Plus, ClipboardList } from 'lucide-react';
import { localStorageService, Issue } from '../lib/localStorage';
import { IssueMap } from '../components/IssueMap';
import { useAuth } from '../contexts/AuthContext';

export function PublicDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const { issues, error } = await localStorageService.getIssues();
      
      if (error) throw error;
      setIssues(issues);
    } catch (error) {
      console.error('Error loading issues:', error);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex-grow">
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
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <div className="animate-fadeIn">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Your Voice <span className="text-yellow-400">Matters</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Empowering citizens to report, track, and resolve city issues together. 
                <br />
                <span className="font-semibold">Make your neighborhood better, one issue at a time.</span>
              </p>
            </div>
            
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
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 animate-pulse">
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {stats.total}
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-1">
              {stats.total}
            </div>
            <div className="text-sm font-medium text-gray-600">Total Issues</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {stats.pending}
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-1">
              {stats.pending}
            </div>
            <div className="text-sm font-medium text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 animate-spin-slow" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {stats.inProgress}
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent mb-1">
              {stats.inProgress}
            </div>
            <div className="text-sm font-medium text-gray-600">In Progress</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {stats.resolved}
              </div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-1">
              {stats.resolved}
            </div>
            <div className="text-sm font-medium text-gray-600">Resolved</div>
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
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              What Can You Report?
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Potholes', icon: '🚧', color: 'from-orange-500 to-red-500' },
              { name: 'Garbage', icon: '🗑️', color: 'from-green-500 to-teal-500' },
              { name: 'Street Lights', icon: '💡', color: 'from-yellow-500 to-amber-500' },
              { name: 'Water Leaks', icon: '💧', color: 'from-blue-500 to-cyan-500' },
              { name: 'Broken Sidewalks', icon: '🚶', color: 'from-gray-500 to-slate-500' },
              { name: 'Traffic Signals', icon: '🚦', color: 'from-red-500 to-pink-500' },
              { name: 'Drainage', icon: '🌊', color: 'from-blue-600 to-indigo-600' },
              { name: 'Graffiti', icon: '🎨', color: 'from-purple-500 to-fuchsia-500' },
              { name: 'Tree Maintenance', icon: '🌳', color: 'from-green-600 to-emerald-600' },
              { name: 'Noise', icon: '📢', color: 'from-yellow-600 to-orange-600' },
              { name: 'Parking', icon: '🅿️', color: 'from-blue-500 to-sky-500' },
              { name: 'Other', icon: '📝', color: 'from-gray-600 to-zinc-600' },
            ].map((type) => (
              <div 
                key={type.name} 
                className="bg-white rounded-xl p-4 text-center hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-100 cursor-pointer group"
              >
                <div className="mb-2 text-3xl transform group-hover:scale-110 transition-transform">
                  {type.icon}
                </div>
                <div className={`font-medium text-transparent bg-gradient-to-r ${type.color} bg-clip-text`}>
                  {type.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-to-b from-white to-blue-50 py-16 mb-8 rounded-2xl">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                What Citizens Are Saying
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Local Resident",
                  image: "https://randomuser.me/api/portraits/women/1.jpg",
                  quote: "I reported a broken streetlight and it was fixed within 48 hours. Amazing response time!"
                },
                {
                  name: "Michael Chen",
                  role: "Community Leader",
                  image: "https://randomuser.me/api/portraits/men/2.jpg",
                  quote: "This platform has revolutionized how we communicate with city officials. Highly recommended!"
                },
                {
                  name: "Emily Rodriguez",
                  role: "Business Owner",
                  image: "https://randomuser.me/api/portraits/women/3.jpg",
                  quote: "The transparency in issue tracking has greatly improved our neighborhood's maintenance."
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-blue-500"
                    />
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-blue-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
