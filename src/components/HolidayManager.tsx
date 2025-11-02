import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Calendar, Save, AlertTriangle } from 'lucide-react';
import { PUBLIC_HOLIDAYS, getHolidayName } from '../data/constants';

interface HolidayManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onHolidaysUpdate: (holidays: string[]) => void;
}

export const HolidayManager: React.FC<HolidayManagerProps> = ({
  isOpen,
  onClose,
  onHolidaysUpdate
}) => {
  const [holidays, setHolidays] = useState<string[]>([...PUBLIC_HOLIDAYS]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');
  const [editingHoliday, setEditingHoliday] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddHoliday = () => {
    if (newHolidayDate && newHolidayName.trim()) {
      if (!holidays.includes(newHolidayDate)) {
        const updatedHolidays = [...holidays, newHolidayDate].sort();
        setHolidays(updatedHolidays);
        // Store the holiday name in localStorage for custom holidays
        const customHolidays = JSON.parse(localStorage.getItem('customHolidays') || '{}');
        customHolidays[newHolidayDate] = newHolidayName.trim();
        localStorage.setItem('customHolidays', JSON.stringify(customHolidays));
      }
      setNewHolidayDate('');
      setNewHolidayName('');
    }
  };

  const handleRemoveHoliday = (date: string) => {
    const updatedHolidays = holidays.filter(h => h !== date);
    setHolidays(updatedHolidays);
    // Remove from custom holidays if it exists
    const customHolidays = JSON.parse(localStorage.getItem('customHolidays') || '{}');
    delete customHolidays[date];
    localStorage.setItem('customHolidays', JSON.stringify(customHolidays));
  };

  const handleEditHoliday = (date: string) => {
    setEditingHoliday(date);
    const customHolidays = JSON.parse(localStorage.getItem('customHolidays') || '{}');
    setEditingName(customHolidays[date] || getHolidayName(date) || '');
  };

  const handleSaveEdit = () => {
    if (editingHoliday && editingName.trim()) {
      const customHolidays = JSON.parse(localStorage.getItem('customHolidays') || '{}');
      customHolidays[editingHoliday] = editingName.trim();
      localStorage.setItem('customHolidays', JSON.stringify(customHolidays));
      setEditingHoliday(null);
      setEditingName('');
    }
  };

  const handleSave = () => {
    onHolidaysUpdate(holidays);
    onClose();
  };

  const getDisplayName = (date: string) => {
    const customHolidays = JSON.parse(localStorage.getItem('customHolidays') || '{}');
    return customHolidays[date] || getHolidayName(date) || 'Custom Holiday';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Manage Public Holidays</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important Notes:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Public holidays are highlighted in red on the calendar</li>
                  <li>Only emergency cases can be booked on public holidays</li>
                  <li>Changes will apply immediately to the calendar</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Add New Holiday */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-3">Add New Holiday</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name</label>
                <input
                  type="text"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  placeholder="e.g., Custom Holiday"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddHoliday}
                  disabled={!newHolidayDate || !newHolidayName.trim()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Holiday
                </button>
              </div>
            </div>
          </div>

          {/* Holidays List */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Current Public Holidays</h4>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holiday Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day of Week
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {holidays.sort().map((date) => (
                    <tr key={date} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingHoliday === date ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingHoliday(null);
                                setEditingName('');
                              }}
                              className="text-gray-600 hover:text-gray-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          getDisplayName(date)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditHoliday(date)}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Edit holiday name"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this holiday?')) {
                                handleRemoveHoliday(date);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Remove holiday"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};