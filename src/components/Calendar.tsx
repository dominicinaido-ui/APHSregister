import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minimize2, Settings } from 'lucide-react';
import { SurgicalCase } from '../types';
import { SPECIALTIES, getHolidayName, getCurrentPublicHolidays } from '../data/constants';
import { HolidayManager } from './HolidayManager';

interface CalendarProps {
  cases: SurgicalCase[];
  onDateSelect: (date: string) => void;
  onAddCase: () => void;
  selectedDate: string | null;
  onToggleMinimize: () => void;
  isMinimized: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  cases,
  onDateSelect,
  onAddCase,
  selectedDate,
  onToggleMinimize,
  isMinimized
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [publicHolidays, setPublicHolidays] = useState<string[]>(getCurrentPublicHolidays());
  const [isHolidayManagerOpen, setIsHolidayManagerOpen] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getCasesForDate = (dateString: string) => {
    return cases?.filter(c => c.date === dateString) || [];
  };

  const getOverdueCasesForDate = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateString >= today) return [];
    return cases?.filter(c => c.date === dateString && c.status === 'scheduled') || [];
  };

  const getSpecialtyColor = (specialtyId: string) => {
    return SPECIALTIES.find(s => s.id === specialtyId)?.color || '#6b7280';
  };

  const isPublicHoliday = (dateString: string) => {
    return publicHolidays.includes(dateString);
  };

  const handleHolidaysUpdate = (newHolidays: string[]) => {
    setPublicHolidays(newHolidays);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(year, month, day);
      const casesForDay = getCasesForDate(dateString);
      const overdueCases = getOverdueCasesForDate(dateString);
      const isSelected = selectedDate === dateString;
      const isToday = dateString === new Date().toISOString().split('T')[0];
      const isHoliday = isPublicHoliday(dateString);
      const holidayName = getHolidayName(dateString);

      days.push(
        <div
          key={day}
          className={`h-16 sm:h-20 lg:h-24 border p-1 transition-all ${
            overdueCases.length > 0
              ? 'bg-red-100 border-red-400 border-2 cursor-pointer hover:bg-red-200'
              : isHoliday 
              ? 'bg-red-50 border-red-200 cursor-pointer hover:bg-red-100' 
              : 'border-gray-200 cursor-pointer hover:bg-blue-50'
          } ${
            isSelected ? 'bg-blue-100 border-blue-500 border-2' : ''
          } ${isToday ? 'bg-yellow-50 border-yellow-300' : ''}`}
          onClick={() => {
            onDateSelect(dateString);
          }}
        >
          <div className={`text-xs sm:text-sm font-medium ${
            overdueCases.length > 0 ? 'text-red-900' :
            isHoliday 
              ? 'text-red-800' :
            isSelected ? 'text-blue-800' : 
            isToday ? 'text-yellow-800' : 
            'text-gray-900'
          }`}>
            {day}
            {overdueCases.length > 0 && (
              <span className="ml-1 text-red-600 font-bold" title={`${overdueCases.length} overdue case${overdueCases.length !== 1 ? 's' : ''}`}>
                !
              </span>
            )}
          </div>
          <div className="mt-1">
            {overdueCases.length > 0 ? (
              <div className="space-y-1">
                <div className="text-xs text-red-800 font-bold">
                  {overdueCases.length} Overdue
                </div>
                <div className="text-xs text-red-700">
                  Update Status
                </div>
              </div>
            ) : isHoliday ? (
              <div className="text-xs text-red-700 font-medium truncate">
                {holidayName}
              </div>
            ) : casesForDay.length > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">
                    {casesForDay.length} case{casesForDay.length !== 1 ? 's' : ''}
                  </span>
                  {casesForDay.some(c => c.priority) && (
                    <span className="text-xs text-red-600 font-bold">!</span>
                  )}
                </div>
                {casesForDay.some(c => c.status === 'cancelled') && (
                  <div className="text-xs text-red-600 font-semibold">
                    {casesForDay.filter(c => c.status === 'cancelled').length} Cancelled
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(casesForDay.map(c => c.specialty))).slice(0, 3).map((specialty, index) => {
                    const count = casesForDay.filter(c => c.specialty === specialty).length;
                    return (
                      <div
                        key={index}
                        className="text-xs px-1 py-0.5 rounded text-white font-medium min-w-0"
                        style={{ backgroundColor: getSpecialtyColor(specialty) }}
                        title={`${count} ${specialty} case${count !== 1 ? 's' : ''}`}
                      >
                        {count}
                      </div>
                    );
                  })}
                  {Array.from(new Set(casesForDay.map(c => c.specialty))).length > 3 && (
                    <div className="text-xs px-1 py-0.5 rounded bg-gray-400 text-white font-medium">
                      +
                    </div>
                  )}
                </div>
              </div>
            ) : isSelected ? (
              !isHoliday && (
                <div className="text-xs text-blue-600 italic hidden sm:block">
                  Click to add case
                </div>
              )
            ) : null}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={onToggleMinimize}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Minimize calendar"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={onAddCase}
            className={`px-2 sm:px-3 py-2 rounded-md transition-colors flex items-center space-x-1 sm:space-x-2 text-sm ${
              'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title={
              selectedDate 
                  ? `Add case for ${new Date(selectedDate).toLocaleDateString()}` 
                  : 'Add new case'
            }
          >
            <Plus className="h-4 w-4" />
            <span>
              <span className="hidden sm:inline">{selectedDate 
                  ? 'Add Case for Selected Date' 
                  : 'Add Case'
              }</span>
              <span className="sm:hidden">Add</span>
            </span>
          </button>
          <button
            onClick={() => setIsHolidayManagerOpen(true)}
            className="ml-1 sm:ml-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Manage public holidays"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <HolidayManager
        isOpen={isHolidayManagerOpen}
        onClose={() => setIsHolidayManagerOpen(false)}
        onHolidaysUpdate={handleHolidaysUpdate}
      />
      
      {selectedDate && (
        <div className={`px-4 py-2 border-t ${
          isPublicHoliday(selectedDate) 
            ? 'bg-red-50 border-red-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-sm ${
            isPublicHoliday(selectedDate) ? 'text-red-800' : 'text-blue-800'
          }`}>
            <span className="font-medium">Selected:</span> {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {isPublicHoliday(selectedDate) && (
              <span className="ml-2 font-semibold">
                - {getHolidayName(selectedDate)} (Public Holiday - Only emergency cases allowed)
              </span>
            )}
            <button
              onClick={() => onDateSelect('')}
              className={`ml-2 underline ${
                isPublicHoliday(selectedDate) 
                  ? 'text-red-600 hover:text-red-800' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Clear selection
            </button>
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-7 gap-0">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500 border-b">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
      
      <div className="px-2 sm:px-4 py-2 bg-gray-50 border-t text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border-2 border-red-400 rounded"></div>
            <span>Overdue Cases</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
            <span>Public Holiday</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-50 border border-yellow-300 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <Settings className="w-3 h-3 text-gray-400" />
            <span>Manage Holidays</span>
          </div>
        </div>
      </div>
    </div>
  );
};