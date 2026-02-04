import { useState, useEffect } from 'react';
import { isFirebaseConfigured, isOnline } from '../lib/migration';
import { companyService, priorityService, submissionService } from '../lib/firestore';
import { Company, Priority, FormSubmission } from '../lib/firestore';

// Custom hook for managing data with Firebase/localStorage fallback
export const useFirebaseData = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check if Firebase is configured
    setIsFirebaseReady(isFirebaseConfigured());
    setIsOffline(!isOnline());

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isFirebaseReady, isOffline };
};

// Hook for managing priorities with Firebase/localStorage fallback
export const usePriorities = (category?: string) => {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFirebaseReady, isOffline } = useFirebaseData();

  const loadPriorities = async () => {
    setLoading(true);
    try {
      if (isFirebaseReady && !isOffline) {
        // Load from Firebase
        const firebasePriorities = await priorityService.getPriorities(category);
        setPriorities(firebasePriorities);
      } else {
        // Fallback to localStorage
        const localPriorities = JSON.parse(localStorage.getItem('companyPriorities') || '[]');
        const filteredPriorities = category 
          ? localPriorities.filter((p: any) => p.category.toLowerCase() === category.toLowerCase())
          : localPriorities;
        setPriorities(filteredPriorities);
      }
    } catch (error) {
      console.error('Error loading priorities:', error);
      // Fallback to localStorage on error
      const localPriorities = JSON.parse(localStorage.getItem('companyPriorities') || '[]');
      const filteredPriorities = category 
        ? localPriorities.filter((p: any) => p.category.toLowerCase() === category.toLowerCase())
        : localPriorities;
      setPriorities(filteredPriorities);
    } finally {
      setLoading(false);
    }
  };

  const createPriority = async (priorityData: Omit<Priority, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (isFirebaseReady && !isOffline) {
        // Save to Firebase
        const id = await priorityService.createPriority(priorityData);
        await loadPriorities(); // Reload data
        return id;
      } else {
        // Fallback to localStorage
        const localPriorities = JSON.parse(localStorage.getItem('companyPriorities') || '[]');
        const newPriority = {
          ...priorityData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localPriorities.push(newPriority);
        localStorage.setItem('companyPriorities', JSON.stringify(localPriorities));
        await loadPriorities();
        return newPriority.id;
      }
    } catch (error) {
      console.error('Error creating priority:', error);
      throw error;
    }
  };

  const updatePriority = async (id: string, updates: Partial<Priority>) => {
    try {
      if (isFirebaseReady && !isOffline) {
        // Update in Firebase
        await priorityService.updatePriority(id, updates);
        await loadPriorities();
      } else {
        // Update in localStorage
        const localPriorities = JSON.parse(localStorage.getItem('companyPriorities') || '[]');
        const index = localPriorities.findIndex((p: any) => p.id === id);
        if (index !== -1) {
          localPriorities[index] = { ...localPriorities[index], ...updates, updatedAt: new Date().toISOString() };
          localStorage.setItem('companyPriorities', JSON.stringify(localPriorities));
          await loadPriorities();
        }
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      throw error;
    }
  };

  const deletePriority = async (id: string) => {
    try {
      if (isFirebaseReady && !isOffline) {
        // Delete from Firebase
        await priorityService.deletePriority(id);
        await loadPriorities();
      } else {
        // Delete from localStorage
        const localPriorities = JSON.parse(localStorage.getItem('companyPriorities') || '[]');
        const filteredPriorities = localPriorities.filter((p: any) => p.id !== id);
        localStorage.setItem('companyPriorities', JSON.stringify(filteredPriorities));
        await loadPriorities();
      }
    } catch (error) {
      console.error('Error deleting priority:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadPriorities();
  }, [category, isFirebaseReady, isOffline]);

  return {
    priorities,
    loading,
    createPriority,
    updatePriority,
    deletePriority,
    reload: loadPriorities
  };
};

// Hook for managing form submissions
export const useFormSubmissions = (type?: string) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFirebaseReady, isOffline } = useFirebaseData();

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      if (isFirebaseReady && !isOffline) {
        // Load from Firebase
        const firebaseSubmissions = await submissionService.getSubmissions(type);
        setSubmissions(firebaseSubmissions);
      } else {
        // Fallback to localStorage
        const allSubmissions = [
          ...JSON.parse(localStorage.getItem('addDataSubmissions') || '[]').map((s: any) => ({ ...s, type: 'add-data' })),
          ...JSON.parse(localStorage.getItem('advertiseSubmissions') || '[]').map((s: any) => ({ ...s, type: 'advertise' })),
          ...JSON.parse(localStorage.getItem('collaborateSubmissions') || '[]').map((s: any) => ({ ...s, type: 'collaborate' }))
        ];
        const filteredSubmissions = type 
          ? allSubmissions.filter((s: any) => s.type === type)
          : allSubmissions;
        setSubmissions(filteredSubmissions);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      // Fallback to localStorage on error
      const allSubmissions = [
        ...JSON.parse(localStorage.getItem('addDataSubmissions') || '[]').map((s: any) => ({ ...s, type: 'add-data' })),
        ...JSON.parse(localStorage.getItem('advertiseSubmissions') || '[]').map((s: any) => ({ ...s, type: 'advertise' })),
        ...JSON.parse(localStorage.getItem('collaborateSubmissions') || '[]').map((s: any) => ({ ...s, type: 'collaborate' }))
      ];
      const filteredSubmissions = type 
        ? allSubmissions.filter((s: any) => s.type === type)
        : allSubmissions;
      setSubmissions(filteredSubmissions);
    } finally {
      setLoading(false);
    }
  };

  const createSubmission = async (submissionData: Omit<FormSubmission, 'id' | 'submittedAt'>) => {
    try {
      if (isFirebaseReady && !isOffline) {
        // Save to Firebase
        const id = await submissionService.createSubmission(submissionData);
        await loadSubmissions();
        return id;
      } else {
        // Fallback to localStorage
        const newSubmission = {
          ...submissionData,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString()
        };

        const storageKey = `${submissionData.type.replace('-', '')}Submissions`;
        const existingSubmissions = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existingSubmissions.push(newSubmission.formData);
        localStorage.setItem(storageKey, JSON.stringify(existingSubmissions));
        
        await loadSubmissions();
        return newSubmission.id;
      }
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [type, isFirebaseReady, isOffline]);

  return {
    submissions,
    loading,
    createSubmission,
    reload: loadSubmissions
  };
};

// Hook for managing companies
export const useCompanies = (category?: string) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFirebaseReady, isOffline } = useFirebaseData();

  const loadCompanies = async () => {
    setLoading(true);
    try {
      if (isFirebaseReady && !isOffline) {
        // Load from Firebase
        const result = await companyService.getCompanies({ 
          category, 
          status: 'active',
          limit: 100 
        });
        setCompanies(result.companies);
      } else {
        // For now, return empty array as we don't have company data in localStorage
        // This will be populated when Excel upload is implemented
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [category, isFirebaseReady, isOffline]);

  return {
    companies,
    loading,
    reload: loadCompanies
  };
};