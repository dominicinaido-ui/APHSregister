import React, { useMemo, useState } from 'react';
import { Calendar, Users, Clock, AlertTriangle, TrendingUp, Activity, UserCheck, XCircle, CheckCircle, Pause, Filter, FileText, PlusCircle, CreditCard as Edit, Trash2 } from 'lucide-react';
import { SurgicalCase, ActivityLog } from '../types';
import { SPECIALTIES, DOCTORS } from '../data/constants';

interface AnalyticsProps {
  cases: SurgicalCase[];
  activityLogs: ActivityLog[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ cases, activityLogs }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showActivityLog, setShowActivityLog] = useState(false);

  const analytics = useMemo(() => {
    // Filter cases by date range if dates are provided
    const filteredCases = cases.filter(case_ => {
      if (!startDate && !endDate) return true;
      
      const caseDate = new Date(case_.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return caseDate >= start && caseDate <= end;
      } else if (start) {
        return caseDate >= start;
      } else if (end) {
        return caseDate <= end;
      }
      
      return true;
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Basic counts
    const totalCases = filteredCases.length;
    const scheduledCases = filteredCases.filter(c => c.status === 'scheduled').length;
    const completedCases = filteredCases.filter(c => c.status === 'completed').length;
    const cancelledCases = filteredCases.filter(c => c.status === 'cancelled').length;
    const deferredCases = filteredCases.filter(c => c.status === 'deferred').length;
    const priorityCases = filteredCases.filter(c => c.priority).length;
    const confirmedOnOTList = filteredCases.filter(c => c.confirmedOnOTList).length;

    // Recent activity (last 30 days)
    const recentCases = filteredCases.filter(c => new Date(c.createdAt) >= thirtyDaysAgo);
    const recentCompletions = filteredCases.filter(c => 
      c.status === 'completed' && new Date(c.updatedAt) >= thirtyDaysAgo
    );

    // Weekly activity (last 7 days)
    const weeklyCases = filteredCases.filter(c => new Date(c.createdAt) >= sevenDaysAgo);
    const weeklyCompletions = filteredCases.filter(c => 
      c.status === 'completed' && new Date(c.updatedAt) >= sevenDaysAgo
    );

    // Age demographics
    const pediatricCases = filteredCases.filter(c => c.age < 18).length;
    const adultCases = filteredCases.filter(c => c.age >= 18).length;
    const elderlyCase = filteredCases.filter(c => c.age >= 65).length;

    // Patient type distribution
    const admissionCases = filteredCases.filter(c => c.patientType === 'admission').length;
    const daycaseCases = filteredCases.filter(c => c.patientType === 'daycase').length;
    const wardCases = filteredCases.filter(c => c.patientType === 'ward').length;

    // Specialty distribution
    const specialtyStats = SPECIALTIES.map(specialty => ({
      ...specialty,
      count: filteredCases.filter(c => c.specialty === specialty.id).length,
      scheduled: filteredCases.filter(c => c.specialty === specialty.id && c.status === 'scheduled').length,
      completed: filteredCases.filter(c => c.specialty === specialty.id && c.status === 'completed').length
    })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

    // Doctor statistics
    // Get all unique doctors from cases (including those not in DOCTORS constant)
    const allDoctorNames = Array.from(new Set(filteredCases.map(c => c.doctor)));
    const doctorStats = allDoctorNames.map(doctorName => {
      const doctorFromConstants = DOCTORS.find(d => d.name === doctorName);
      return {
        id: doctorFromConstants?.id || doctorName.toLowerCase().replace(/\s+/g, '-'),
        name: doctorName,
        count: filteredCases.filter(c => c.doctor === doctorName).length,
        scheduled: filteredCases.filter(c => c.doctor === doctorName && c.status === 'scheduled').length,
        completed: filteredCases.filter(c => c.doctor === doctorName && c.status === 'completed').length,
        priority: filteredCases.filter(c => c.doctor === doctorName && c.priority).length
      };
    }).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

    // Rebook statistics
    const rebookedCases = filteredCases.filter(c => c.rebookCount > 0);
    const totalRebooks = filteredCases.reduce((sum, c) => sum + c.rebookCount, 0);
    const avgRebooksPerCase = totalCases > 0 ? (totalRebooks / totalCases).toFixed(2) : '0';

    // Cancellation and deferral reasons
    const cancellationReasons = filteredCases
      .filter(c => c.cancellationReason)
      .reduce((acc, c) => {
        acc[c.cancellationReason!] = (acc[c.cancellationReason!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Add cancellation history to the reasons count
    filteredCases.forEach(c => {
      if (c.cancellationHistory && c.cancellationHistory.length > 0) {
        c.cancellationHistory.forEach(cancellation => {
          cancellationReasons[cancellation.reason] = (cancellationReasons[cancellation.reason] || 0) + 1;
        });
      }
    });
    const deferralReasons = filteredCases
      .filter(c => c.deferralReason)
      .reduce((acc, c) => {
        acc[c.deferralReason!] = (acc[c.deferralReason!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Add deferral history to the reasons count
    filteredCases.forEach(c => {
      if (c.deferralHistory && c.deferralHistory.length > 0) {
        c.deferralHistory.forEach(deferral => {
          deferralReasons[deferral.reason] = (deferralReasons[deferral.reason] || 0) + 1;
        });
      }
    });

    // Calculate total historical cancellations and deferrals
    const totalHistoricalCancellations = filteredCases.reduce((sum, c) => 
      sum + (c.cancellationHistory?.length || 0), 0
    );
    const totalHistoricalDeferrals = filteredCases.reduce((sum, c) => 
      sum + (c.deferralHistory?.length || 0), 0
    );
    
    // Total cancellations including history
    const totalCancellationsWithHistory = cancelledCases + totalHistoricalCancellations;
    const totalDeferralsWithHistory = deferredCases + totalHistoricalDeferrals;
    // Completion rate
    const completionRate = totalCases > 0 ? ((completedCases / totalCases) * 100).toFixed(1) : '0';
    const cancellationRate = totalCases > 0 ? ((totalCancellationsWithHistory / totalCases) * 100).toFixed(1) : '0';

    return {
      totalCases,
      scheduledCases,
      completedCases,
      cancelledCases,
      deferredCases,
      priorityCases,
      confirmedOnOTList,
      recentCases: recentCases.length,
      recentCompletions: recentCompletions.length,
      weeklyCases: weeklyCases.length,
      weeklyCompletions: weeklyCompletions.length,
      pediatricCases,
      adultCases,
      elderlyCase,
      admissionCases,
      daycaseCases,
      wardCases,
      specialtyStats,
      doctorStats,
      rebookedCases: rebookedCases.length,
      totalRebooks,
      avgRebooksPerCase,
      cancellationReasons,
      deferralReasons,
      totalHistoricalCancellations,
      totalHistoricalDeferrals,
      totalCancellationsWithHistory,
      totalDeferralsWithHistory,
      completionRate,
      cancellationRate
    };
  }, [cases, startDate, endDate]);

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const getDateRangeText = () => {
    if (!startDate && !endDate) return 'All Time';
    if (startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    }
    if (startDate) {
      return `From ${new Date(startDate).toLocaleDateString()}`;
    }
    if (endDate) {
      return `Until ${new Date(endDate).toLocaleDateString()}`;
    }
    return 'All Time';
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <PlusCircle className="h-4 w-4 text-green-600" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'deleted':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">
              Comprehensive insights into surgical case management
              <span className="ml-2 text-sm font-medium text-blue-600">
                ({getDateRangeText()})
              </span>
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowActivityLog(!showActivityLog)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showActivityLog
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Activity Log</span>
              </button>
              
              <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={clearDateFilter}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      {/* Activity Log */}
      {showActivityLog && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity Log
            </h3>
            <span className="text-sm text-gray-500">
              {activityLogs.length} recent activities
            </span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {activityLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No activity recorded yet</p>
                <p className="text-sm mt-1">Case changes will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {log.patientName}
                        </span>
                        <span className="text-xs text-gray-500">
                          by {log.user}
                        </span>
                      </div>
                      {log.changes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {log.changes}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Cases"
          value={analytics.totalCases}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-green-500"
          subtitle={`${analytics.completedCases} completed`}
        />
        <StatCard
          title="Cancellation Rate"
          value={`${analytics.cancellationRate}%`}
          icon={<XCircle className="h-6 w-6 text-white" />}
          color="bg-red-500"
          subtitle={`${analytics.totalCancellationsWithHistory} total cancellations`}
        />
        <StatCard
          title="Priority Cases"
          value={analytics.priorityCases}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {startDate || endDate ? 'Activity in Selected Period' : 'Recent Activity (30 Days)'}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Cases Added</span>
              <span className="text-lg font-semibold text-blue-600">{analytics.recentCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cases Completed</span>
              <span className="text-lg font-semibold text-green-600">{analytics.recentCompletions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weekly New Cases</span>
              <span className="text-lg font-semibold text-purple-600">{analytics.weeklyCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weekly Completions</span>
              <span className="text-lg font-semibold text-indigo-600">{analytics.weeklyCompletions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Status Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Scheduled</span>
              </div>
              <span className="text-lg font-semibold">{analytics.scheduledCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="text-lg font-semibold">{analytics.completedCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Deferred</span>
              </div>
              <span className="text-lg font-semibold">{analytics.deferredCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <span className="text-lg font-semibold">{analytics.cancelledCases}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics and Patient Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Demographics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pediatric (&lt;18)</span>
              <span className="text-lg font-semibold text-purple-600">{analytics.pediatricCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Adult (18-64)</span>
              <span className="text-lg font-semibold text-blue-600">{analytics.adultCases - analytics.elderlyCase}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Elderly (≥65)</span>
              <span className="text-lg font-semibold text-orange-600">{analytics.elderlyCase}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Admission</span>
              <span className="text-lg font-semibold text-green-600">{analytics.admissionCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Day Case</span>
              <span className="text-lg font-semibold text-blue-600">{analytics.daycaseCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ward</span>
              <span className="text-lg font-semibold text-purple-600">{analytics.wardCases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confirmed on OT List</span>
              <span className="text-lg font-semibold text-indigo-600">{analytics.confirmedOnOTList}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialty Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Specialty</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.specialtyStats.map((specialty) => (
                <tr key={specialty.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: specialty.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">{specialty.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {specialty.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {specialty.scheduled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {specialty.completed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {specialty.count > 0 ? ((specialty.completed / specialty.count) * 100).toFixed(1) : '0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Doctor</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.doctorStats.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.scheduled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.completed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.count > 0 ? ((doctor.completed / doctor.count) * 100).toFixed(1) : '0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rebook Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rebook Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{analytics.rebookedCases}</div>
            <div className="text-sm text-gray-600">Cases Rebooked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{analytics.totalRebooks}</div>
            <div className="text-sm text-gray-600">Total Rebooks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{analytics.avgRebooksPerCase}</div>
            <div className="text-sm text-gray-600">Avg Rebooks/Case</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{analytics.totalCancellationsWithHistory}</div>
            <div className="text-sm text-gray-600">Total Cancellations (All Time)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{analytics.totalDeferralsWithHistory}</div>
            <div className="text-sm text-gray-600">Total Deferrals (All Time)</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Historical counts include cancellations and deferrals from cases that were later rescheduled or completed</p>
        </div>
      </div>

      {/* Cancellation and Deferral Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.keys(analytics.cancellationReasons).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Cancellation Reasons 
              <span className="text-sm font-normal text-gray-600 ml-2">
                (Including Historical Data)
              </span>
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.cancellationReasons)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{reason}</span>
                    <span className="text-sm font-semibold text-red-600">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {Object.keys(analytics.deferralReasons).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Deferral Reasons
              <span className="text-sm font-normal text-gray-600 ml-2">
                (Including Historical Data)
              </span>
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.deferralReasons)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{reason}</span>
                    <span className="text-sm font-semibold text-yellow-600">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};