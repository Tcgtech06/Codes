// Local Storage utilities for data management
// This will be replaced with Supabase later

export interface Company {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  category: string;
  description: string;
  products?: string;
  gstNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Priority {
  id: string;
  companyName: string;
  category: string;
  position: number;
  priorityType: 'permanent' | 'temporary';
  duration?: number;
  durationType?: 'days' | 'months' | 'years';
  expiresAt?: string;
  createdAt: string;
}

export interface FormSubmission {
  id: string;
  type: 'add-data' | 'advertise' | 'collaborate';
  formData: Record<string, any>;
  submittedAt: string;
}

// Local Storage keys
const STORAGE_KEYS = {
  COMPANIES: 'knitinfo_companies',
  PRIORITIES: 'knitinfo_priorities',
  FORM_SUBMISSIONS: 'knitinfo_form_submissions',
  VISITOR_STATS: 'knitinfo_visitor_stats'
};

// Utility functions
export const localStorageService = {
  // Companies
  getCompanies: (): Company[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCompanies: (companies: Company[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    } catch (error) {
      console.error('Failed to save companies:', error);
    }
  },

  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Company => {
    const companies = localStorageService.getCompanies();
    const newCompany: Company = {
      ...company,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    companies.push(newCompany);
    localStorageService.saveCompanies(companies);
    return newCompany;
  },

  // Priorities
  getPriorities: (): Priority[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRIORITIES);
      const priorities = data ? JSON.parse(data) : [];
      
      // Filter out expired temporary priorities
      const activePriorities = priorities.filter((priority: Priority) => {
        if (priority.priorityType === 'permanent') return true;
        if (!priority.expiresAt) return true;
        return new Date(priority.expiresAt) > new Date();
      });

      // Save filtered priorities back
      if (activePriorities.length !== priorities.length) {
        localStorageService.savePriorities(activePriorities);
      }

      return activePriorities.sort((a: Priority, b: Priority) => a.position - b.position);
    } catch {
      return [];
    }
  },

  savePriorities: (priorities: Priority[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(priorities));
    } catch (error) {
      console.error('Failed to save priorities:', error);
    }
  },

  addPriority: (priority: Omit<Priority, 'id' | 'createdAt'>): Priority => {
    const priorities = localStorageService.getPriorities();
    const newPriority: Priority = {
      ...priority,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    priorities.push(newPriority);
    localStorageService.savePriorities(priorities);
    return newPriority;
  },

  updatePriority: (id: string, updates: Partial<Priority>): void => {
    const priorities = localStorageService.getPriorities();
    const index = priorities.findIndex(p => p.id === id);
    if (index !== -1) {
      priorities[index] = { ...priorities[index], ...updates };
      localStorageService.savePriorities(priorities);
    }
  },

  deletePriority: (id: string): void => {
    const priorities = localStorageService.getPriorities();
    const filtered = priorities.filter(p => p.id !== id);
    localStorageService.savePriorities(filtered);
  },

  // Form Submissions
  getFormSubmissions: (): FormSubmission[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FORM_SUBMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFormSubmissions: (submissions: FormSubmission[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORM_SUBMISSIONS, JSON.stringify(submissions));
    } catch (error) {
      console.error('Failed to save form submissions:', error);
    }
  },

  addFormSubmission: (submission: Omit<FormSubmission, 'id' | 'submittedAt'>): FormSubmission => {
    const submissions = localStorageService.getFormSubmissions();
    const newSubmission: FormSubmission = {
      ...submission,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    localStorageService.saveFormSubmissions(submissions);
    return newSubmission;
  },

  // Visitor Stats
  getVisitorStats: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISITOR_STATS);
      return data ? JSON.parse(data) : {
        totalVisitors: 1250,
        liveVisitors: 8,
        totalCompanies: 450,
        lastUpdated: new Date().toISOString()
      };
    } catch {
      return {
        totalVisitors: 1250,
        liveVisitors: 8,
        totalCompanies: 450,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  updateVisitorStats: (stats: any): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.VISITOR_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save visitor stats:', error);
    }
  }
};