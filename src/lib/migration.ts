import { companyService, priorityService, submissionService, firestoreUtils } from './firestore';
import { Company, Priority, FormSubmission } from './firestore';

// Migration service to move data from localStorage to Firebase
export const migrationService = {
  // Migrate priorities from localStorage to Firebase
  migratePriorities: async () => {
    try {
      const localPriorities = JSON.parse(localStorage.getItem('companyPriorities') || '[]');
      
      if (localPriorities.length === 0) {
        console.log('No priorities to migrate');
        return { success: true, migrated: 0 };
      }

      let migratedCount = 0;
      
      for (const priority of localPriorities) {
        try {
          // Convert localStorage format to Firebase format
          const priorityData: Omit<Priority, 'id' | 'createdAt' | 'updatedAt'> = {
            companyId: priority.companyId || `local-${priority.companyName.replace(/\s+/g, '-').toLowerCase()}`,
            companyName: priority.companyName,
            category: priority.category,
            position: priority.position,
            priorityType: priority.priorityType,
            duration: priority.duration,
            durationType: priority.durationType,
            expiresAt: priority.expiresAt ? firestoreUtils.dateToTimestamp(new Date(priority.expiresAt)) : null,
            createdBy: 'migration',
            status: 'active'
          };

          await priorityService.createPriority(priorityData);
          migratedCount++;
        } catch (error) {
          console.error('Error migrating priority:', priority, error);
        }
      }

      // Clear localStorage after successful migration
      if (migratedCount > 0) {
        localStorage.removeItem('companyPriorities');
      }

      return { success: true, migrated: migratedCount };
    } catch (error) {
      console.error('Error migrating priorities:', error);
      return { success: false, error: error.message };
    }
  },

  // Migrate form submissions from localStorage to Firebase
  migrateFormSubmissions: async () => {
    try {
      const submissions = [
        ...JSON.parse(localStorage.getItem('addDataSubmissions') || '[]').map((s: any) => ({ ...s, type: 'add-data' })),
        ...JSON.parse(localStorage.getItem('advertiseSubmissions') || '[]').map((s: any) => ({ ...s, type: 'advertise' })),
        ...JSON.parse(localStorage.getItem('collaborateSubmissions') || '[]').map((s: any) => ({ ...s, type: 'collaborate' }))
      ];

      if (submissions.length === 0) {
        console.log('No form submissions to migrate');
        return { success: true, migrated: 0 };
      }

      let migratedCount = 0;

      for (const submission of submissions) {
        try {
          const submissionData: Omit<FormSubmission, 'id' | 'submittedAt'> = {
            type: submission.type,
            formData: submission,
            attachments: [],
            status: 'pending'
          };

          await submissionService.createSubmission(submissionData);
          migratedCount++;
        } catch (error) {
          console.error('Error migrating submission:', submission, error);
        }
      }

      // Clear localStorage after successful migration
      if (migratedCount > 0) {
        localStorage.removeItem('addDataSubmissions');
        localStorage.removeItem('advertiseSubmissions');
        localStorage.removeItem('collaborateSubmissions');
      }

      return { success: true, migrated: migratedCount };
    } catch (error) {
      console.error('Error migrating form submissions:', error);
      return { success: false, error: error.message };
    }
  },

  // Initialize default categories
  initializeCategories: async () => {
    try {
      const defaultCategories = [
        {
          name: 'Yarn',
          slug: 'yarn',
          description: 'Yarn suppliers and manufacturers',
          iconName: 'Layers',
          colorClass: 'bg-blue-100 text-blue-600',
          displayOrder: 1,
          isActive: true,
          companyCount: 0
        },
        {
          name: 'Fabric Suppliers',
          slug: 'fabric-suppliers',
          description: 'Fabric suppliers and distributors',
          iconName: 'Package',
          colorClass: 'bg-green-100 text-green-600',
          displayOrder: 2,
          isActive: true,
          companyCount: 0
        },
        {
          name: 'Knitting',
          slug: 'knitting',
          description: 'Knitting services and machinery',
          iconName: 'Zap',
          colorClass: 'bg-purple-100 text-purple-600',
          displayOrder: 3,
          isActive: true,
          companyCount: 0
        },
        {
          name: 'Dyeing & Printing',
          slug: 'dyeing-printing',
          description: 'Dyeing and printing services',
          iconName: 'Palette',
          colorClass: 'bg-red-100 text-red-600',
          displayOrder: 4,
          isActive: true,
          companyCount: 0
        },
        {
          name: 'Garment Manufacturing',
          slug: 'garment-manufacturing',
          description: 'Garment manufacturers and exporters',
          iconName: 'Shirt',
          colorClass: 'bg-yellow-100 text-yellow-600',
          displayOrder: 5,
          isActive: true,
          companyCount: 0
        }
      ];

      // Add categories to Firestore
      const { addDoc, collection } = await import('firebase/firestore');
      const { db } = await import('./firebase');

      for (const category of defaultCategories) {
        await addDoc(collection(db, 'categories'), {
          ...category,
          createdAt: firestoreUtils.now(),
          updatedAt: firestoreUtils.now()
        });
      }

      return { success: true, created: defaultCategories.length };
    } catch (error) {
      console.error('Error initializing categories:', error);
      return { success: false, error: error.message };
    }
  },

  // Run all migrations
  runAllMigrations: async () => {
    console.log('Starting data migration...');
    
    const results = {
      categories: await migrationService.initializeCategories(),
      priorities: await migrationService.migratePriorities(),
      submissions: await migrationService.migrateFormSubmissions()
    };

    console.log('Migration results:', results);
    return results;
  }
};

// Utility to check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  );
};

// Utility to check if user is online
export const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};