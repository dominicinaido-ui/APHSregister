import { useState, useEffect } from 'react';
import { ActivityLog } from '../types';

export const useActivityLogs = (isAuthenticated: boolean) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Load activity logs from localStorage when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setActivityLogs([]);
      return;
    }

    const savedLogs = localStorage.getItem('activityLogs');
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        setActivityLogs(parsedLogs);
      } catch (error) {
        console.error('Error parsing activity logs:', error);
        setActivityLogs([]);
      }
    }
  }, [isAuthenticated]);

  // Save activity logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const logActivity = (activity: Omit<ActivityLog, 'id'>) => {
    const newActivity: ActivityLog = {
      ...activity,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    setActivityLogs(prev => {
      const updated = [newActivity, ...prev];
      // Keep only the last 100 entries
      return updated.slice(0, 100);
    });
  };

  return {
    activityLogs,
    logActivity
  };
};