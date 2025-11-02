import React from 'react';
import { Calendar, Activity, BarChart3, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface User {
  username: string;
}

interface HeaderProps {
  user: User | null;
  totalCases: number;
  scheduledCases: number;
  deferredCases: number;
  cancelledCases: number;
  completedCases: number;
  currentView: 'calendar' | 'analytics';
  onViewChange: (view: 'calendar' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  totalCases,
  scheduledCases,
  deferredCases,
  cancelledCases,
  completedCases,
  currentView,
  onViewChange
}) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 py-4">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-blue-600" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                Surgical Case Register
              </h1>
              <p className="text-sm text-gray-600">Alotau Provincial Hospital</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">
                Case Register
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden xl:inline">Sign out</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Desktop Navigation Bar */}
        <div className="hidden lg:block border-t border-gray-200 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewChange('calendar')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Cases</span>
              </button>
              <button
                onClick={() => onViewChange('analytics')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4 xl:space-x-8">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{totalCases}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{scheduledCases}</div>
              <div className="text-xs text-gray-600">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{deferredCases}</div>
              <div className="text-xs text-gray-600">Deferred</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{cancelledCases}</div>
              <div className="text-xs text-gray-600">Cancelled</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{completedCases}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white absolute top-full left-0 right-0 z-50 shadow-lg">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  onViewChange('calendar');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors touch-manipulation ${
                  currentView === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Cases</span>
              </button>
              <button
                onClick={() => {
                  onViewChange('analytics');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors touch-manipulation ${
                  currentView === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </button>
            </div>

            {/* Case Statistics - Mobile Layout */}
            <div className="px-4 py-3 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Case Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-lg font-bold text-blue-600">{totalCases}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-lg font-bold text-green-600">{scheduledCases}</div>
                  <div className="text-xs text-gray-600">Scheduled</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-lg font-bold text-yellow-600">{deferredCases}</div>
                  <div className="text-xs text-gray-600">Deferred</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-lg font-bold text-red-600">{cancelledCases}</div>
                  <div className="text-xs text-gray-600">Cancelled</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <div className="text-lg font-bold text-blue-600">{completedCases}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25" onClick={toggleMobileMenu} aria-hidden="true"></div>
      )}
    </div>
  );
};