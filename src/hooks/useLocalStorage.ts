// React hooks for local storage data management
// This will be replaced with Supabase hooks later

import { useState } from 'react';
import { 
  localStorageService, 
  Company, 
  Priority, 
  FormSubmission 
} from '@/lib/localStorage';

// Hook for managing companies
export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(() => localStorageService.getCompanies());
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    const data = localStorageService.getCompanies();
    setCompanies(data);
    setLoading(false);
  };

  const addCompany = (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompany = localStorageService.addCompany(company);
    setCompanies(prev => [...prev, newCompany]);
    return newCompany;
  };

  return {
    companies,
    loading,
    addCompany,
    reload
  };
};

// Hook for managing priorities
export const usePriorities = () => {
  const [priorities, setPriorities] = useState<Priority[]>(() => localStorageService.getPriorities());
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    const data = localStorageService.getPriorities();
    setPriorities(data);
    setLoading(false);
  };

  const createPriority = (priority: Omit<Priority, 'id' | 'createdAt'>) => {
    const newPriority = localStorageService.addPriority(priority);
    setPriorities(prev => [...prev, newPriority].sort((a, b) => a.position - b.position));
    return newPriority;
  };

  const updatePriority = (id: string, updates: Partial<Priority>) => {
    localStorageService.updatePriority(id, updates);
    reload();
  };

  const deletePriority = (id: string) => {
    localStorageService.deletePriority(id);
    setPriorities(prev => prev.filter(p => p.id !== id));
  };

  return {
    priorities,
    loading,
    createPriority,
    updatePriority,
    deletePriority,
    reload
  };
};

// Hook for managing form submissions
export const useFormSubmissions = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => localStorageService.getFormSubmissions());
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    const data = localStorageService.getFormSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  const addSubmission = (submission: Omit<FormSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission = localStorageService.addFormSubmission(submission);
    setSubmissions(prev => [...prev, newSubmission]);
    return newSubmission;
  };

  return {
    submissions,
    loading,
    addSubmission,
    reload
  };
};

// Hook for data availability (replaces Firebase ready state)
export const useDataService = () => {
  return {
    isReady: true, // Local storage is always ready
    isOffline: false // Local storage doesn't depend on network
  };
};