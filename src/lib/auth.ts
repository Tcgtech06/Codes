import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// User role type
export type UserRole = 'admin' | 'moderator' | 'viewer';

// Extended user interface
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  permissions: string[];
  lastLogin: Date;
  isActive: boolean;
}

// Auth service
export const authService = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await signOut(auth);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<AppUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid,
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          permissions: userData.permissions || [],
          lastLogin: userData.lastLogin?.toDate() || new Date(),
          isActive: userData.isActive ?? true
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Update user profile
  updateUserProfile: async (uid: string, updates: Partial<AppUser>): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    }, { merge: true });
  },

  // Update last login
  updateLastLogin: async (uid: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      lastLogin: new Date()
    }, { merge: true });
  },

  // Check if user has permission
  hasPermission: (user: AppUser, permission: string): boolean => {
    return user.permissions.includes(permission) || user.role === 'admin';
  },

  // Check if user has role
  hasRole: (user: AppUser, role: UserRole): boolean => {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      moderator: 2,
      admin: 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[role];
  }
};

// Permission constants
export const PERMISSIONS = {
  READ_COMPANIES: 'read:companies',
  WRITE_COMPANIES: 'write:companies',
  DELETE_COMPANIES: 'delete:companies',
  MANAGE_PRIORITIES: 'manage:priorities',
  MANAGE_SUBMISSIONS: 'manage:submissions',
  UPLOAD_EXCEL: 'upload:excel',
  MANAGE_USERS: 'manage:users',
  VIEW_ANALYTICS: 'view:analytics'
} as const;

// Default permissions by role
export const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  viewer: [
    PERMISSIONS.READ_COMPANIES,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  moderator: [
    PERMISSIONS.READ_COMPANIES,
    PERMISSIONS.WRITE_COMPANIES,
    PERMISSIONS.MANAGE_SUBMISSIONS,
    PERMISSIONS.VIEW_ANALYTICS
  ],
  admin: [
    PERMISSIONS.READ_COMPANIES,
    PERMISSIONS.WRITE_COMPANIES,
    PERMISSIONS.DELETE_COMPANIES,
    PERMISSIONS.MANAGE_PRIORITIES,
    PERMISSIONS.MANAGE_SUBMISSIONS,
    PERMISSIONS.UPLOAD_EXCEL,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_ANALYTICS
  ]
};

// Auth context hook (to be used with React Context)
export const useAuthContext = () => {
  // This would be implemented with React Context
  // For now, it's a placeholder
  return {
    user: null as AppUser | null,
    loading: false,
    signIn: authService.signIn,
    signOut: authService.signOut
  };
};