import { useState, useEffect, useCallback } from 'react';

interface VisitorStats {
  liveVisitors: number;
  totalVisitors: number;
  totalCompanies: number;
}

export const useVisitorStats = () => {
  const [stats, setStats] = useState<VisitorStats>({
    liveVisitors: 0,
    totalVisitors: 0,
    totalCompanies: 0
  });
  const [loading, setLoading] = useState(true);

  const initializeVisitorTracking = useCallback(async () => {
    try {
      // Check if this is a new session
      const sessionId = sessionStorage.getItem('visitor_session_id');
      
      if (!sessionId) {
        // New session - generate unique ID
        const newSessionId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        sessionStorage.setItem('visitor_session_id', newSessionId);
        
        console.log('New visitor session created:', newSessionId);
        
        // Increment total visitors in database
        await incrementTotalVisitors(newSessionId);
        
        // Mark as active user
        await updateActiveSession(newSessionId);
      } else {
        console.log('Existing visitor session:', sessionId);
        // Update activity for existing session
        await updateActiveSession(sessionId);
      }
      
      // Update last activity
      sessionStorage.setItem('last_activity', Date.now().toString());
      
    } catch (error) {
      console.error('Error initializing visitor tracking:', error);
    }
  }, []);

  const incrementTotalVisitors = async (sessionId: string) => {
    try {
      console.log('Incrementing visitor count for session:', sessionId);
      
      const response = await fetch('/api/v1/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Visitor count updated:', data);
        
        setStats(prev => ({
          ...prev,
          totalVisitors: data.totalVisitors
        }));
      } else {
        const errorData = await response.json();
        console.error('Failed to increment visitor count:', errorData);
      }
    } catch (error) {
      console.error('Error incrementing total visitors:', error);
    }
  };

  const updateActiveSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/v1/visitors/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Active session updated:', data);
        
        // Add random 2-6 to actual active count
        const randomIncrease = Math.floor(Math.random() * 5) + 2; // 2-6
        const displayCount = data.activeCount + randomIncrease;
        
        setStats(prev => ({
          ...prev,
          liveVisitors: displayCount
        }));
      }
    } catch (error) {
      console.error('Error updating active session:', error);
    }
  };

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('Loading visitor stats...');
      
      // Fetch visitor stats from database
      const response = await fetch('/api/v1/visitors');
      
      if (response.ok) {
        const data = await response.json();
        
        console.log('Visitor stats loaded:', data);
        
        // Fetch active visitors count
        const activeResponse = await fetch('/api/v1/visitors/active');
        let liveVisitors = 7; // Default
        
        if (activeResponse.ok) {
          const activeData = await activeResponse.json();
          // Add random 2-6 to actual active count
          const randomIncrease = Math.floor(Math.random() * 5) + 2; // 2-6
          liveVisitors = activeData.activeCount + randomIncrease;
          console.log('Active visitors:', activeData.activeCount, '+ random:', randomIncrease, '=', liveVisitors);
        }
        
        setStats({
          liveVisitors: liveVisitors,
          totalVisitors: data.totalVisitors,
          totalCompanies: data.totalCompanies
        });
      } else {
        console.error('Failed to load visitor stats:', await response.text());
        // Fallback to default values
        setStats({
          liveVisitors: Math.floor(Math.random() * 5) + 7, // 7-11
          totalVisitors: 1247,
          totalCompanies: 668
        });
      }
      
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to default values
      setStats({
        liveVisitors: Math.floor(Math.random() * 5) + 7, // 7-11
        totalVisitors: 1247,
        totalCompanies: 668
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLiveVisitorsDisplay = useCallback(async () => {
    try {
      const sessionId = sessionStorage.getItem('visitor_session_id');
      
      if (sessionId) {
        // Update current session activity
        await updateActiveSession(sessionId);
      }
      
      // Fetch current active count
      const activeResponse = await fetch('/api/v1/visitors/active');
      
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        // Add random 2-6 to actual active count
        const randomIncrease = Math.floor(Math.random() * 5) + 2; // 2-6
        const displayCount = activeData.activeCount + randomIncrease;
        
        setStats(prev => ({
          ...prev,
          liveVisitors: displayCount
        }));
      }
    } catch (error) {
      console.error('Error updating live visitors display:', error);
    }
  }, []);

  useEffect(() => {
    initializeVisitorTracking();
    loadStats();

    // Update live visitors every 30 seconds with random increase
    const liveInterval = setInterval(() => {
      updateLiveVisitorsDisplay();
    }, 30000);

    // Refresh all stats every 2 minutes
    const statsInterval = setInterval(() => {
      loadStats();
    }, 120000);

    return () => {
      clearInterval(liveInterval);
      clearInterval(statsInterval);
    };
  }, [initializeVisitorTracking, loadStats, updateLiveVisitorsDisplay]);

  return {
    stats,
    loading,
    refreshStats: loadStats
  };
};