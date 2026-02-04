// Conditional Firebase Firestore imports
let collection: any, doc: any, getDocs: any, getDoc: any, addDoc: any, updateDoc: any, deleteDoc: any;
let query: any, where: any, orderBy: any, limit: any, startAfter: any, Timestamp: any;

try {
  const firestore = require('firebase/firestore');
  collection = firestore.collection;
  doc = firestore.doc;
  getDocs = firestore.getDocs;
  getDoc = firestore.getDoc;
  addDoc = firestore.addDoc;
  updateDoc = firestore.updateDoc;
  deleteDoc = firestore.deleteDoc;
  query = firestore.query;
  where = firestore.where;
  orderBy = firestore.orderBy;
  limit = firestore.limit;
  startAfter = firestore.startAfter;
  Timestamp = firestore.Timestamp;
} catch (error) {
  console.warn('Firebase Firestore not available');
}
import { db } from './firebase';

// Types for Firebase compatibility
export interface DocumentSnapshot {
  id: string;
  data: () => any;
  exists: () => boolean;
}

export interface QueryConstraint {
  type: string;
}

// Types
export interface Company {
  id?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  category: string;
  description: string;
  products: string[];
  certifications?: string;
  gstNumber?: string;
  visitingCardUrl?: string;
  documentsUrls?: string[];
  status: 'active' | 'inactive' | 'pending';
  source: 'excel-upload' | 'form-submission' | 'admin-added';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
}

export interface Priority {
  id?: string;
  companyId: string;
  companyName: string;
  category: string;
  position: number;
  priorityType: 'permanent' | 'temporary';
  duration?: number;
  durationType?: 'days' | 'months' | 'years';
  expiresAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  status: 'active' | 'expired';
}

export interface FormSubmission {
  id?: string;
  type: 'add-data' | 'advertise' | 'collaborate';
  formData: Record<string, any>;
  attachments?: string[];
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  reviewedAt?: Timestamp | null;
  reviewedBy?: string | null;
  reviewNotes?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  colorClass: string;
  displayOrder: number;
  isActive: boolean;
  companyCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Company CRUD operations
export const companyService = {
  // Get all companies with optional filters
  async getCompanies(filters?: {
    category?: string;
    status?: string;
    limit?: number;
    lastDoc?: DocumentSnapshot;
  }) {
    if (!db || !collection || !query || !getDocs) {
      console.warn('Firebase not available, returning empty results');
      return { companies: [], lastDoc: null };
    }

    try {
      const constraints: QueryConstraint[] = [];
      
      if (filters?.category && where) {
        constraints.push(where('category', '==', filters.category));
      }
      
      if (filters?.status && where) {
        constraints.push(where('status', '==', filters.status));
      }
      
      if (orderBy) {
        constraints.push(orderBy('createdAt', 'desc'));
      }
      
      if (filters?.limit && limit) {
        constraints.push(limit(filters.limit));
      }
      
      if (filters?.lastDoc && startAfter) {
        constraints.push(startAfter(filters.lastDoc));
      }
      
      const q = query(collection(db, 'companies'), ...constraints);
      const snapshot = await getDocs(q);
      
      return {
        companies: snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        } as Company)),
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error fetching companies:', error);
      return { companies: [], lastDoc: null };
    }
  },

  // Get single company
  async getCompany(id: string) {
    if (!db || !doc || !getDoc) {
      console.warn('Firebase not available');
      return null;
    }

    try {
      const docRef = doc(db, 'companies', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Company;
      }
      return null;
    } catch (error) {
      console.error('Error fetching company:', error);
      return null;
    }
  },

  // Create company
  async createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!db || !collection || !addDoc || !Timestamp) {
      throw new Error('Firebase not available');
    }

    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'companies'), {
        ...companyData,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Update company
  async updateCompany(id: string, updates: Partial<Company>) {
    if (!db || !doc || !updateDoc || !Timestamp) {
      throw new Error('Firebase not available');
    }

    try {
      const docRef = doc(db, 'companies', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  // Delete company
  async deleteCompany(id: string) {
    if (!db || !doc || !deleteDoc) {
      throw new Error('Firebase not available');
    }

    try {
      const docRef = doc(db, 'companies', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  },

  // Search companies
  async searchCompanies(searchTerm: string, category?: string) {
    if (!db || !collection || !query || !getDocs || !where || !orderBy) {
      console.warn('Firebase not available, returning empty results');
      return [];
    }

    try {
      const constraints: QueryConstraint[] = [];
      
      if (category) {
        constraints.push(where('category', '==', category));
      }
      
      constraints.push(where('status', '==', 'active'));
      constraints.push(orderBy('companyName'));
      
      const q = query(collection(db, 'companies'), ...constraints);
      const snapshot = await getDocs(q);
      
      // Client-side filtering for search term (Firestore doesn't support full-text search)
      const companies = snapshot.docs
        .map((doc: any) => ({ id: doc.id, ...doc.data() } as Company))
        .filter((company: Company) => 
          company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.products.some((product: string) => 
            product.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      
      return companies;
    } catch (error) {
      console.error('Error searching companies:', error);
      return [];
    }
  }
};

// Priority CRUD operations
export const priorityService = {
  // Get all priorities
  async getPriorities(category?: string) {
    if (!db || !collection || !query || !getDocs || !where || !orderBy) {
      console.warn('Firebase not available, returning empty results');
      return [];
    }

    try {
      const constraints: QueryConstraint[] = [];
      
      if (category) {
        constraints.push(where('category', '==', category));
      }
      
      constraints.push(where('status', '==', 'active'));
      constraints.push(orderBy('position', 'asc'));
      
      const q = query(collection(db, 'priorities'), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as Priority));
    } catch (error) {
      console.error('Error fetching priorities:', error);
      return [];
    }
  },

  // Create priority
  async createPriority(priorityData: Omit<Priority, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!db || !collection || !addDoc || !Timestamp) {
      throw new Error('Firebase not available');
    }

    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'priorities'), {
        ...priorityData,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating priority:', error);
      throw error;
    }
  },

  // Update priority
  async updatePriority(id: string, updates: Partial<Priority>) {
    if (!db || !doc || !updateDoc || !Timestamp) {
      throw new Error('Firebase not available');
    }

    try {
      const docRef = doc(db, 'priorities', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating priority:', error);
      throw error;
    }
  },

  // Delete priority
  async deletePriority(id: string) {
    if (!db || !doc || !deleteDoc) {
      throw new Error('Firebase not available');
    }

    try {
      const docRef = doc(db, 'priorities', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting priority:', error);
      throw error;
    }
  },

  // Clean expired priorities
  async cleanExpiredPriorities() {
    if (!db || !collection || !query || !getDocs || !where || !updateDoc || !doc || !Timestamp) {
      console.warn('Firebase not available for cleaning expired priorities');
      return 0;
    }

    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, 'priorities'),
        where('priorityType', '==', 'temporary'),
        where('expiresAt', '<=', now),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(q);
      const batch = [];
      
      for (const docSnap of snapshot.docs) {
        batch.push(updateDoc(doc(db, 'priorities', docSnap.id), {
          status: 'expired',
          updatedAt: now
        }));
      }
      
      await Promise.all(batch);
      return snapshot.docs.length;
    } catch (error) {
      console.error('Error cleaning expired priorities:', error);
      return 0;
    }
  }
};

// Form submission CRUD operations
export const submissionService = {
  // Get all submissions
  async getSubmissions(type?: string, status?: string) {
    if (!db || !collection || !query || !getDocs || !where || !orderBy) {
      console.warn('Firebase not available, returning empty results');
      return [];
    }

    try {
      const constraints: QueryConstraint[] = [];
      
      if (type) {
        constraints.push(where('type', '==', type));
      }
      
      if (status) {
        constraints.push(where('status', '==', status));
      }
      
      constraints.push(orderBy('submittedAt', 'desc'));
      
      const q = query(collection(db, 'form_submissions'), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as FormSubmission));
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  },

  // Create submission
  async createSubmission(submissionData: Omit<FormSubmission, 'id' | 'submittedAt'>) {
    if (!db || !collection || !addDoc || !Timestamp) {
      throw new Error('Firebase not available');
    }

    try {
      const docRef = await addDoc(collection(db, 'form_submissions'), {
        ...submissionData,
        submittedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  },

  // Update submission status
  async updateSubmissionStatus(
    id: string, 
    status: FormSubmission['status'], 
    reviewNotes?: string,
    reviewedBy?: string
  ) {
    if (!db || !doc || !updateDoc || !Timestamp) {
      throw new Error('Firebase not available');
    }

    try {
      const docRef = doc(db, 'form_submissions', id);
      await updateDoc(docRef, {
        status,
        reviewedAt: Timestamp.now(),
        reviewedBy,
        reviewNotes
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw error;
    }
  }
};

// Category CRUD operations
export const categoryService = {
  // Get all categories
  async getCategories() {
    const q = query(
      collection(db, 'categories'),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    } as Category));
  },

  // Update company count for category
  async updateCompanyCount(categoryName: string, count: number) {
    const q = query(
      collection(db, 'categories'),
      where('name', '==', categoryName)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = doc(db, 'categories', snapshot.docs[0].id);
      await updateDoc(docRef, {
        companyCount: count,
        updatedAt: Timestamp.now()
      });
    }
  }
};

// Utility functions
export const firestoreUtils = {
  // Convert Firestore timestamp to Date
  timestampToDate: (timestamp: Timestamp) => timestamp.toDate(),
  
  // Convert Date to Firestore timestamp
  dateToTimestamp: (date: Date) => Timestamp.fromDate(date),
  
  // Get current timestamp
  now: () => Timestamp.now()
};