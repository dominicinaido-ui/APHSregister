import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { Calendar } from './components/Calendar';
import { CaseList } from './components/CaseList';
import { CaseModal } from './components/CaseModal';
import { Analytics } from './components/Analytics';
import { useSurgicalCases } from './hooks/useSurgicalCases';
import { useAuth } from './hooks/useAuth';
import { useActivityLogs } from './hooks/useActivityLogs';
import { SurgicalCase } from './types';

function App() {
  const { user, loading: authLoading, isAuthenticated, login } = useAuth();
  const { activityLogs, logActivity } = useActivityLogs(isAuthenticated);
  const { cases, loading, addCase, updateCase, deleteCase } = useSurgicalCases(logActivity, user?.username || 'Unknown User', isAuthenticated);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<SurgicalCase | null>(null);
  const [isCalendarMinimized, setIsCalendarMinimized] = useState(false);
  const [currentView, setCurrentView] = useState<'calendar' | 'analytics'>('calendar');

  const handleDateSelect = (date: string) => {
    if (date === '') {
      setSelectedDate(null);
    } else {
      setSelectedDate(selectedDate === date ? null : date);
    }
  };

  const handleAddCase = () => {
    setEditingCase(null);
    setIsModalOpen(true);
  };

  const handleEditCase = (case_: SurgicalCase) => {
    // Check if this is just a checkbox update (confirmedOnOTList change)
    const existingCase = cases.find(c => c.id === case_.id);
    if (existingCase && 
        existingCase.confirmedOnOTList !== case_.confirmedOnOTList &&
        // Check if only confirmedOnOTList and updatedAt changed
        Object.keys(case_).every(key => 
          key === 'confirmedOnOTList' || 
          key === 'updatedAt' || 
          existingCase[key as keyof SurgicalCase] === case_[key as keyof SurgicalCase]
        )) {
      // This is just a checkbox update, update directly without opening modal
      updateCase(case_.id, { 
        confirmedOnOTList: case_.confirmedOnOTList,
        updatedAt: case_.updatedAt 
      });
    } else {
      // This is a regular edit, open the modal
      setEditingCase(case_);
      setIsModalOpen(true);
    }
  };

  const handleSaveCase = (caseData: Omit<SurgicalCase, 'id' | 'createdAt' | 'updatedAt'>) => {
    addCase(caseData);
  };

  const handleUpdateCase = (updates: Partial<SurgicalCase>) => {
    if (editingCase) {
      updateCase(editingCase.id, updates);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCase(null);
  };

  const handleLoginSuccess = () => {
    // Login is handled by Supabase auth state change
    // No need to manually set user here
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading surgical cases...</p>
        </div>
      </div>
    );
  }

  // Count all cases (scheduled, deferred, cancelled, and completed)
  const totalCases = cases.length;
  const scheduledCases = cases.filter(c => c.status === 'scheduled').length;
  const deferredCases = cases.filter(c => c.status === 'deferred').length;
  const cancelledCases = cases.filter(c => c.status === 'cancelled').length;
  const completedCases = cases.filter(c => c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        totalCases={totalCases}
        scheduledCases={scheduledCases}
        deferredCases={deferredCases}
        cancelledCases={cancelledCases}
        completedCases={completedCases}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      {currentView === 'analytics' ? (
        <Analytics cases={cases} activityLogs={activityLogs} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCalendarMinimized ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsCalendarMinimized(false)}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Show Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </button>
              {selectedDate && (
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Viewing cases for: <span className="font-medium text-gray-900">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: window.innerWidth < 640 ? 'short' : 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </span>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear date filter
                  </button>
                </div>
              )}
            </div>
            <CaseList
              cases={cases}
              onEditCase={handleEditCase}
              onDeleteCase={deleteCase}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="xl:col-span-2">
              <Calendar
                cases={cases}
                onDateSelect={handleDateSelect}
                onAddCase={handleAddCase}
                selectedDate={selectedDate}
                onToggleMinimize={() => setIsCalendarMinimized(true)}
                isMinimized={false}
              />
            </div>
            <div className="xl:col-span-1">
              <CaseList
                cases={cases}
                onEditCase={handleEditCase}
                onDeleteCase={deleteCase}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </div>
        )}
        </div>
      )}

      <CaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCase}
        onUpdate={handleUpdateCase}
        editingCase={editingCase}
        initialDate={selectedDate || ''}
      />
    </div>
  );
}

export default App;