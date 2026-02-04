import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask
} from 'firebase/storage';
import { storage } from './firebase';

// Storage paths
export const STORAGE_PATHS = {
  EXCEL_UPLOADS: 'uploads/excel-files',
  VISITING_CARDS: 'visiting-cards',
  COMPANY_DOCUMENTS: 'company-documents',
  BOOK_COVERS: 'books/covers',
  FORM_ATTACHMENTS: 'form-attachments'
} as const;

// File upload service
export const storageService = {
  // Upload file with progress tracking
  uploadFile: (
    file: File,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; task: UploadTask }> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot: any) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error: any) => {
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url, task: uploadTask });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  },

  // Simple file upload without progress
  uploadFileSimple: async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  // Delete file
  deleteFile: async (path: string): Promise<void> => {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  // Get download URL
  getDownloadURL: async (path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },

  // List files in directory
  listFiles: async (path: string) => {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return result.items;
  },

  // Generate unique filename
  generateFileName: (originalName: string, prefix?: string): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const baseName = originalName.split('.').slice(0, -1).join('.');
    
    return prefix 
      ? `${prefix}_${timestamp}_${randomString}.${extension}`
      : `${baseName}_${timestamp}_${randomString}.${extension}`;
  }
};

// Specific upload functions
export const uploadServices = {
  // Upload Excel file
  uploadExcelFile: async (
    file: File,
    category: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const fileName = storageService.generateFileName(file.name, `excel_${category}`);
    const path = `${STORAGE_PATHS.EXCEL_UPLOADS}/${fileName}`;
    
    if (onProgress) {
      const { url } = await storageService.uploadFile(file, path, onProgress);
      return url;
    } else {
      return await storageService.uploadFileSimple(file, path);
    }
  },

  // Upload visiting card
  uploadVisitingCard: async (
    file: File,
    companyId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const fileName = storageService.generateFileName(file.name, `visiting_card_${companyId}`);
    const path = `${STORAGE_PATHS.VISITING_CARDS}/${fileName}`;
    
    if (onProgress) {
      const { url } = await storageService.uploadFile(file, path, onProgress);
      return url;
    } else {
      return await storageService.uploadFileSimple(file, path);
    }
  },

  // Upload company documents
  uploadCompanyDocuments: async (
    files: File[],
    companyId: string,
    onProgress?: (progress: number) => void
  ): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = storageService.generateFileName(file.name, `doc_${companyId}_${index}`);
      const path = `${STORAGE_PATHS.COMPANY_DOCUMENTS}/${companyId}/${fileName}`;
      
      if (onProgress) {
        const { url } = await storageService.uploadFile(file, path, (fileProgress) => {
          // Calculate overall progress
          const overallProgress = ((index + fileProgress / 100) / files.length) * 100;
          onProgress(overallProgress);
        });
        return url;
      } else {
        return await storageService.uploadFileSimple(file, path);
      }
    });

    return await Promise.all(uploadPromises);
  },

  // Upload form attachments
  uploadFormAttachments: async (
    files: File[],
    submissionId: string,
    onProgress?: (progress: number) => void
  ): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = storageService.generateFileName(file.name, `attachment_${index}`);
      const path = `${STORAGE_PATHS.FORM_ATTACHMENTS}/${submissionId}/${fileName}`;
      
      if (onProgress) {
        const { url } = await storageService.uploadFile(file, path, (fileProgress) => {
          const overallProgress = ((index + fileProgress / 100) / files.length) * 100;
          onProgress(overallProgress);
        });
        return url;
      } else {
        return await storageService.uploadFileSimple(file, path);
      }
    });

    return await Promise.all(uploadPromises);
  },

  // Upload book cover
  uploadBookCover: async (
    file: File,
    bookId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const fileName = storageService.generateFileName(file.name, `book_cover_${bookId}`);
    const path = `${STORAGE_PATHS.BOOK_COVERS}/${fileName}`;
    
    if (onProgress) {
      const { url } = await storageService.uploadFile(file, path, onProgress);
      return url;
    } else {
      return await storageService.uploadFileSimple(file, path);
    }
  }
};

// File validation utilities
export const fileValidation = {
  // Validate file type
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  // Validate file size (in MB)
  validateFileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  // Get file extension
  getFileExtension: (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  },

  // Validate Excel file
  validateExcelFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!fileValidation.validateFileType(file, allowedTypes)) {
      return { isValid: false, error: 'Please select a valid Excel file (.xlsx or .xls)' };
    }
    
    if (!fileValidation.validateFileSize(file, 10)) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }
    
    return { isValid: true };
  },

  // Validate image file
  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!fileValidation.validateFileType(file, allowedTypes)) {
      return { isValid: false, error: 'Please select a valid image file (JPG, PNG, GIF, WebP)' };
    }
    
    if (!fileValidation.validateFileSize(file, 5)) {
      return { isValid: false, error: 'Image size must be less than 5MB' };
    }
    
    return { isValid: true };
  },

  // Validate document file
  validateDocumentFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (!fileValidation.validateFileType(file, allowedTypes)) {
      return { isValid: false, error: 'Please select a valid document (PDF, DOC, DOCX, JPG, PNG)' };
    }
    
    if (!fileValidation.validateFileSize(file, 10)) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }
    
    return { isValid: true };
  }
};