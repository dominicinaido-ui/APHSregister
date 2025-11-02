import React, { useState } from 'react';
import { CreditCard as Edit, Trash2, AlertTriangle, Clock, User, Calendar, Stethoscope, Table, List } from 'lucide-react';
import { SurgicalCase } from '../types';
import { SPECIALTIES } from '../data/constants';
import { DatasheetView } from './DatasheetView';
import { getPatientTypeDisplay } from '../utils/helpers';

interface CaseListProps {
  cases: SurgicalCase[];
  onEditCase: (case_: SurgicalCase) => void;
  onDeleteCase: (id: string) => void;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  onEditCase,
  onDeleteCase,
  selectedDate,
  onDateSelect
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'list' | 'datasheet'>('list');

  const getSpecialtyInfo = (specialtyId: string) => {
    return SPECIALTIES.find(s => s.id === specialtyId);
  };

  // Get cases for selected date and calculate counts
  const casesForSelectedDate = selectedDate 
    ? cases.filter(case_ => case_.date === selectedDate)
    : [];

  const selectedDateCounts = selectedDate ? {
    total: casesForSelectedDate.length,
    scheduled: casesForSelectedDate.filter(c => c.status === 'scheduled').length,
    completed: casesForSelectedDate.filter(c => c.status === 'completed').length,
    deferred: casesForSelectedDate.filter(c => c.status === 'deferred').length,
    cancelled: casesForSelectedDate.filter(c => c.status === 'cancelled').length
  } : null;

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

  // If datasheet view is selected, render the DatasheetView component
  if (viewMode === 'datasheet') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">View Options</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <List className="h-4 w-4" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('datasheet')}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Table className="h-4 w-4" />
                <span>Datasheet View</span>
              </button>
            </div>
          </div>
        </div>
        <DatasheetView 
          cases={cases} 
          selectedDate={selectedDate}
          filter={filter}
          sortBy={sortBy}
          onFilterChange={setFilter}
          onSortChange={setSortBy}
          onEditCase={onEditCase}
          onDeleteCase={onDeleteCase}
          onDateSelect={onDateSelect}
        />
      </div>
    );
  }

  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
      case 'priority':
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        return 0;
      case 'doctor':
        return a.doctor.localeCompare(b.doctor);
      case 'specialty':
        return a.specialty.localeCompare(b.specialty);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'deferred': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Surgical Cases 
              {selectedDate && (
                <span className="text-blue-600 block sm:inline">
                  {' '}for {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              )}
            </h2>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  viewMode === 'list'
                    ? 'text-white bg-blue-600 border-transparent hover:bg-blue-700'
                    : 'text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
                <span className="sm:hidden">L</span>
              </button>
              <button
                onClick={() => setViewMode('datasheet')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  viewMode === 'datasheet'
                    ? 'text-white bg-blue-600 border-transparent hover:bg-blue-700'
                    : 'text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Table className="h-4 w-4" />
                <span className="hidden sm:inline">Datasheet</span>
                <span className="sm:hidden">D</span>
              </button>
            </div>
          </div>
          
          {selectedDate && selectedDateCounts && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
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
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-end gap-2 sm:gap-4">
            <div className="flex items-center space-x-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDate || ''}
                  onChange={(e) => onDateSelect(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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
            
            <select
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="doctor">Sort by Doctor</option>
              <option value="specialty">Sort by Specialty</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedCases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No surgical cases found</p>
            {selectedDate && (
              <div className="text-sm mt-2">
                <p>No cases scheduled for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="text-blue-600 mt-1">Click "Add Case" to schedule a procedure for this date</p>
              </div>
            )}
          </div>
        ) : (
          sortedCases.map((case_) => {
            const specialtyInfo = getSpecialtyInfo(case_.specialty);
            return (
              <div key={case_.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
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
                          // We need to call updateCase directly, but we don't have access to it here
                          // So we'll use onEditCase but with a flag to indicate it's just a checkbox update
                          onEditCase(updatedCase);
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        title="Confirmed on OT List"
                      />
                      <h3 className={`text-lg font-medium ${
                        case_.age < 13 
                          ? 'text-purple-700 bg-purple-100 px-1 sm:px-2 py-1 rounded-md font-semibold text-sm sm:text-lg' 
                          : 'text-gray-900'
                      }`}>
                        {case_.patientName}
                      </h3>
                      {case_.confirmedOnOTList && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ On OT List
                        </span>
                      )}
                      <span className="text-xs sm:text-sm text-gray-500">Age: {case_.age}</span>
                      <span className="text-xs sm:text-sm text-gray-500">Sex: {case_.sex.charAt(0).toUpperCase() + case_.sex.slice(1)}</span>
                      {case_.origin && (
                        <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Origin: {case_.origin}</span>
                      )}
                      {case_.placeOfResidence && (
                        <span className="text-xs sm:text-sm text-gray-500">Residence: {case_.placeOfResidence}</span>
                      )}
                      {case_.priority && (
                        <span className="inline-flex items-center px-1 sm:px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Priority
                        </span>
                      )}
                      {case_.isReferral && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Referral
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        case_.caseType === 'emergency' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {case_.caseType === 'emergency' ? 'Emergency' : 'Elective'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                        {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Diagnosis:</span> {case_.diagnosis}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Procedure:</span> {case_.procedure}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(case_.date).toLocaleDateString()}
                        {case_.time && ` at ${case_.time}`}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {getPatientTypeDisplay(case_.patientType, case_.wardNumber, case_.admissionSource)}
                        {case_.fastingTime && <span className="hidden sm:inline"> • Fasting: {case_.fastingTime}</span>}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Contact:</span> {case_.contactDetails}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="font-medium text-gray-700">Doctor: {case_.doctor}</span>
                      {specialtyInfo && (
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: specialtyInfo.color }}
                        >
                          {specialtyInfo.name}
                        </span>
                      )}
                    </div>

                    {case_.status === 'cancelled' && case_.cancellationReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <strong>Cancellation Reason:</strong> {case_.cancellationReason}
                      </div>
                    )}

                    {case_.cancellationHistory && case_.cancellationHistory.length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                        <strong>Cancellation History ({case_.cancellationHistory.length} time{case_.cancellationHistory.length > 1 ? 's' : ''}):</strong>
                        <div className="mt-1 space-y-1">
                          {case_.cancellationHistory.map((cancellation, index) => (
                            <div key={index} className="text-xs">
                              {new Date(cancellation.cancelledAt).toLocaleDateString()}: {cancellation.reason} 
                              (Original date: {new Date(cancellation.originalDate).toLocaleDateString()})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {case_.status === 'deferred' && case_.deferralReason && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        {case_.deferralHistory && case_.deferralHistory.length > 0 ? (
                          <div>
                            <strong>Deferral History ({case_.deferralHistory.length} time{case_.deferralHistory.length !== 1 ? 's' : ''}):</strong>
                            <div className="mt-1 space-y-1">
                              {case_.deferralHistory.map((deferral, index) => (
                                <div key={index} className="text-xs">
                                  <span className="font-medium">{new Date(deferral.deferredAt).toLocaleDateString()}:</span> {deferral.reason}
                                  {index === 0 ? (
                                    <span className="text-yellow-600 ml-2">(Current)</span>
                                  ) : (
                                    <span className="text-yellow-600 ml-2">(was scheduled: {new Date(deferral.originalDate).toLocaleDateString()})</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <strong>Deferral Reason:</strong> {case_.deferralReason}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Show deferral history for non-deferred cases */}
                    {case_.status !== 'deferred' && case_.deferralHistory && case_.deferralHistory.length > 0 && (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                        <strong>Previous Deferrals ({case_.deferralHistory.length} time{case_.deferralHistory.length > 1 ? 's' : ''}):</strong>
                        <div className="mt-1 space-y-1">
                          {case_.deferralHistory.map((deferral, index) => (
                            <div key={index} className="text-xs">
                              <span className="font-medium">{new Date(deferral.deferredAt).toLocaleDateString()}:</span> {deferral.reason}
                              <span className="text-orange-600 ml-2">(was scheduled: {new Date(deferral.originalDate).toLocaleDateString()})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}


                    {case_.isReferral && case_.referralDetails && (
                      <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-sm text-purple-800">
                        <strong>Referral Details:</strong> {case_.referralDetails}
                      </div>
                    )}

                    {case_.notes && (
                      <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                        <strong>Notes:</strong> {case_.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 ml-2 sm:ml-4">
                    <button
                      onClick={() => onEditCase(case_)}
                      className="text-blue-600 hover:text-blue-800 p-1.5 sm:p-2 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this case?')) {
                          onDeleteCase(case_.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1.5 sm:p-2 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};