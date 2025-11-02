import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { SurgicalCase } from '../types';
import { SPECIALTIES } from '../data/constants';
import { getPatientTypeDisplay } from '../utils/helpers';

interface DatasheetViewProps {
  cases: SurgicalCase[];
  selectedDate: string | null;
  filter: string;
  sortBy: string;
  onFilterChange: (filter: string) => void;
  onSortChange: (sortBy: string) => void;
  onEditCase: (case_: SurgicalCase) => void;
  onDeleteCase: (id: string) => void;
  onDateSelect: (date: string) => void;
}

export const DatasheetView: React.FC<DatasheetViewProps> = ({
  cases,
  selectedDate,
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
  onEditCase,
  onDeleteCase,
  onDateSelect
}) => {
  const getSpecialtyName = (specialtyId: string) => {
    return SPECIALTIES.find(s => s.id === specialtyId)?.name || specialtyId;
  };

  // Apply filters
  const filteredCases = cases.filter(case_ => {
    if (selectedDate && case_.date !== selectedDate) return false;
    if (filter === 'all') return true;
    if (filter === 'priority') return case_.priority;
    if (filter === 'cancelled') return case_.status === 'cancelled';
    if (filter === 'scheduled') return case_.status === 'scheduled';
    if (filter === 'deferred') return case_.status === 'deferred';
    if (filter === 'completed') return case_.status === 'completed';
    if (filter === 'admission') return case_.patientType === 'admission';
    if (filter === 'daycase') return case_.patientType === 'daycase';
    if (filter === 'ward') return case_.patientType === 'ward';
    if (filter === 'children') return case_.age < 18;
    if (filter === 'adults') return case_.age >= 18;
    return case_.specialty === filter;
  });

  // Get cases for selected date and calculate counts
  const casesForSelectedDate = selectedDate 
    ? cases.filter(case_ => case_.date === selectedDate)
    : filteredCases;

  const selectedDateCounts = {
    total: casesForSelectedDate.length,
    scheduled: casesForSelectedDate.filter(c => c.status === 'scheduled').length,
    completed: casesForSelectedDate.filter(c => c.status === 'completed').length,
    deferred: casesForSelectedDate.filter(c => c.status === 'deferred').length,
    cancelled: casesForSelectedDate.filter(c => c.status === 'cancelled').length
  };

  // Apply sorting
  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date + ' ' + (a.time || '00:00')).getTime() - new Date(b.date + ' ' + (b.time || '00:00')).getTime();
      case 'priority':
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        return 0;
      case 'doctor':
        return a.doctor.localeCompare(b.doctor);
      case 'specialty':
        return a.specialty.localeCompare(b.specialty);
      case 'name':
        return a.patientName.localeCompare(b.patientName);
      default:
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return a.patientName.localeCompare(b.patientName);
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Surgical Cases - Datasheet View
          {selectedDate && (
            <span className="text-blue-600">
              {' '}for {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          )}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {sortedCases.length} case{sortedCases.length !== 1 ? 's' : ''} shown
        </p>
        
        {selectedDateCounts && (
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
              Total: {selectedDateCounts.total}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
              Scheduled: {selectedDateCounts.scheduled}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
              Completed: {selectedDateCounts.completed}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
              Deferred: {selectedDateCounts.deferred}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 font-medium">
              Cancelled: {selectedDateCounts.cancelled}
            </span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedDate || ''}
              onChange={(e) => onDateSelect(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
            <div className="flex-1 min-w-0">
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
              >
                <option value="all">All Cases</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="deferred">Deferred</option>
                <option value="cancelled">Cancelled</option>
                <option value="priority">Priority</option>
                <option value="admission">Admission</option>
                <option value="daycase">Day Case</option>
                <option value="ward">Ward</option>
                <option value="children">{"Children (<18)"}</option>
                <option value="adults">{"Adults (≥18)"}</option>
                {SPECIALTIES.map(specialty => (
                  <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-0">
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="time">Sort by Time</option>
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="doctor">Sort by Doctor</option>
                <option value="specialty">Sort by Specialty</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {sortedCases.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No surgical cases found</p>
          {selectedDate && (
            <p className="text-sm mt-2">
              No cases scheduled for {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  OT List
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 sticky left-0 bg-gray-50 z-20 border-r border-gray-300">
                  Name
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Sex
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Age
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                  Diagnosis
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Specialty
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Patient Type
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Status
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Case Type
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                  Procedure
                </th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={case_.confirmedOnOTList}
                        onChange={(e) => {
                          // Update the case directly without opening the modal
                          const updatedCase = {
                            ...case_,
                            confirmedOnOTList: e.target.checked,
                            updatedAt: new Date().toISOString()
                          };
                          onEditCase(updatedCase);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        title="Confirmed on OT List"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 sticky left-0 bg-white z-10 border-r border-gray-300">
                    <div className={`text-sm font-medium ${
                      case_.age < 13 
                        ? 'text-purple-700 bg-purple-100 px-1 py-0.5 rounded text-xs font-semibold inline-block' 
                        : 'text-gray-900'
                    }`}>
                      {case_.patientName}
                    </div>
                    {case_.priority && (
                      <div className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                        Priority
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {case_.sex}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {case_.age}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900">
                    {case_.diagnosis}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: SPECIALTIES.find(s => s.id === case_.specialty)?.color || '#6b7280' }}
                    >
                      {getSpecialtyName(case_.specialty)}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">
                    {getPatientTypeDisplay(case_.patientType, case_.wardNumber, case_.admissionSource)}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      case_.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      case_.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      case_.status === 'deferred' ? 'bg-yellow-100 text-yellow-800' :
                      case_.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      case_.caseType === 'emergency' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {case_.caseType === 'emergency' ? 'Emergency' : 'Elective'}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900">
                    {case_.procedure}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onEditCase(case_)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Edit case"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this case?')) {
                            onDeleteCase(case_.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete case"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};