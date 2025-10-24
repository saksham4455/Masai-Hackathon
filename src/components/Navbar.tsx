import { useState } from 'react';
import { MapPin, LogIn, LogOut, User, LayoutDashboard, Plus, ClipboardList, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition"
            >
              <MapPin className="w-6 h-6" />
              <span>Improve My City</span>
            </button>

            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  currentPage === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </button>

              {user && (profile?.role === 'citizen' || !profile?.role) && (
                <>
                  <button
                    onClick={() => onNavigate('report')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                      currentPage === 'report'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report Issue</span>
                  </button>
                  <button
                    onClick={() => onNavigate('my-complaints')}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                      currentPage === 'my-complaints'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>My Complaints</span>
                  </button>
                </>
              )}

              {user && profile?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    currentPage === 'admin' || currentPage === 'admin-detail'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{profile?.full_name}</span>
                  {profile?.role === 'admin' && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition ${
                  currentPage === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </button>

              {user && (profile?.role === 'citizen' || !profile?.role) && (
                <>
                  <button
                    onClick={() => {
                      onNavigate('report');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition ${
                      currentPage === 'report'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report Issue</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('my-complaints');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition ${
                      currentPage === 'my-complaints'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>My Complaints</span>
                  </button>
                </>
              )}

              {user && profile?.role === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium transition ${
                    currentPage === 'admin' || currentPage === 'admin-detail'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-700 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{profile?.full_name}</span>
                      {profile?.role === 'admin' && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
