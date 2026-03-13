# KnitInfo Directory - Database Requirements & Backend Implementation Guide

## 📋 Table of Contents
1. [Database Schema Overview](#database-schema-overview)
2. [Page-by-Page Backend Requirements](#page-by-page-backend-requirements)
3. [Function-by-Function Implementation](#function-by-function-implementation)
4. [API Endpoints Specification](#api-endpoints-specification)
5. [Security & Validation Rules](#security--validation-rules)
6. [Performance Optimization](#performance-optimization)
7. [Backup & Recovery](#backup--recovery)

---

## 1. Database Schema Overview

### 1.1 Firebase Collections Structure

```
📁 knitinfo-directory (Firebase Project)
├── 🗂️ companies (Main business directory)
├── 🗂️ priorities (Company ranking system)
├── 🗂️ form_submissions (User form data)
├── 🗂️ categories (Business categories)
├── 🗂️ books (Product catalog)
├── 🗂️ orders (Book orders)
├── 🗂️ users (Admin management)
├── 🗂️ excel_uploads (Upload tracking)
└── 🗂️ app_settings (Configuration)
```

### 1.2 Storage Structure

```
📁 Firebase Storage
├── 📁 uploads/excel-files/
├── 📁 visiting-cards/
├── 📁 company-documents/
├── 📁 books/covers/
└── 📁 form-attachments/
```

---

## 2. Page-by-Page Backend Requirements

### 2.1 🏠 Home Page (`/`)

**Database Operations:**
- **Read**: Featured categories from `categories` collection
- **Read**: Latest companies from `companies` collection (limit 6)
- **Read**: App settings from `app_settings` collection

**Required Functions:**
```javascript
// Get featured categories for homepage
async getFeaturedCategories() {
  return await categoryService.getCategories()
    .where('isActive', '==', true)
    .orderBy('displayOrder', 'asc')
    .limit(6);
}

// Get latest companies for showcase
async getLatestCompanies() {
  return await companyService.getCompanies({
    status: 'active',
    limit: 6
  });
}

// Get app configuration
async getAppSettings() {
  return await getDoc(doc(db, 'app_settings', 'general'));
}
```

**Performance Requirements:**
- Cache featured categories (24 hours)
- Lazy load company images
- Preload critical above-the-fold content

---

### 2.2 📚 Books Page (`/books`)

**Database Operations:**
- **Read**: All active books from `books` collection
- **Read**: Book categories for filtering

**Required Functions:**
```javascript
// Get all books with optional filtering
async getBooks(filters = {}) {
  const constraints = [where('status', '==', 'active')];
  
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  
  return await getDocs(query(collection(db, 'books'), ...constraints));
}

// Get book categories for filter dropdown
async getBookCategories() {
  return await getDocs(
    query(collection(db, 'books'), 
    where('status', '==', 'active'))
  ).then(snapshot => {
    const categories = new Set();
    snapshot.docs.forEach(doc => categories.add(doc.data().category));
    return Array.from(categories);
  });
}
```

---

### 2.3 📖 Individual Book Page (`/books/[id]`)

**Database Operations:**
- **Read**: Single book details from `books` collection
- **Create**: Order record in `orders` collection when purchased

**Required Functions:**
```javascript
// Get single book details
async getBook(bookId) {
  const bookDoc = await getDoc(doc(db, 'books', bookId));
  if (!bookDoc.exists()) throw new Error('Book not found');
  return { id: bookDoc.id, ...bookDoc.data() };
}

// Create order when user purchases
async createOrder(orderData) {
  const order = {
    ...orderData,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  return await addDoc(collection(db, 'orders'), order);
}

// Update book stock after purchase
async updateBookStock(bookId, quantity) {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, {
    stock: increment(-quantity),
    updatedAt: Timestamp.now()
  });
}
```

---

### 2.4 🗂️ Catalogue Page (`/catalogue`)

**Database Operations:**
- **Read**: All categories from `categories` collection
- **Read**: Company count per category

**Required Functions:**
```javascript
// Get all categories with company counts
async getCategoriesWithCounts() {
  const categories = await getDocs(
    query(collection(db, 'categories'),
    where('isActive', '==', true),
    orderBy('displayOrder', 'asc'))
  );
  
  // Get company count for each category
  const categoriesWithCounts = await Promise.all(
    categories.docs.map(async (categoryDoc) => {
      const category = categoryDoc.data();
      const companyCount = await getCompanyCountByCategory(category.name);
      return {
        id: categoryDoc.id,
        ...category,
        companyCount
      };
    })
  );
  
  return categoriesWithCounts;
}

// Helper function to get company count by category
async getCompanyCountByCategory(categoryName) {
  const snapshot = await getDocs(
    query(collection(db, 'companies'),
    where('category', '==', categoryName),
    where('status', '==', 'active'))
  );
  return snapshot.size;
}
```

---

### 2.5 🧶 Category Pages (`/catalogue/[category]`)

**Database Operations:**
- **Read**: Companies filtered by category from `companies` collection
- **Read**: Priorities for the category from `priorities` collection
- **Read**: Category details from `categories` collection

**Required Functions:**
```javascript
// Get companies by category with priority sorting
async getCompaniesByCategory(categoryName, filters = {}) {
  // Get companies
  const constraints = [
    where('category', '==', categoryName),
    where('status', '==', 'active')
  ];
  
  if (filters.city) {
    // Note: This requires a composite index
    constraints.push(where('city', '==', filters.city));
  }
  
  const companies = await getDocs(
    query(collection(db, 'companies'), ...constraints)
  );
  
  // Get priorities for this category
  const priorities = await getPrioritiesByCategory(categoryName);
  
  // Sort companies by priority
  return sortCompaniesByPriority(companies.docs, priorities);
}

// Get active priorities for category
async getPrioritiesByCategory(categoryName) {
  const now = Timestamp.now();
  
  return await getDocs(
    query(collection(db, 'priorities'),
    where('category', '==', categoryName),
    where('status', '==', 'active'),
    orderBy('position', 'asc'))
  );
}

// Sort companies by priority position
function sortCompaniesByPriority(companies, priorities) {
  const priorityMap = new Map();
  priorities.forEach(p => {
    const data = p.data();
    // Check if temporary priority is not expired
    if (data.priorityType === 'permanent' || 
        (data.expiresAt && data.expiresAt.toDate() > new Date())) {
      priorityMap.set(data.companyName.toLowerCase(), data.position);
    }
  });
  
  return companies.sort((a, b) => {
    const aData = a.data();
    const bData = b.data();
    const aPriority = priorityMap.get(aData.companyName.toLowerCase()) || 999;
    const bPriority = priorityMap.get(bData.companyName.toLowerCase()) || 999;
    
    return aPriority - bPriority;
  });
}

// Search companies within category
async searchCompaniesInCategory(categoryName, searchTerm) {
  const companies = await getCompaniesByCategory(categoryName);
  
  return companies.filter(company => {
    const data = company.data();
    return data.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           data.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
  });
}
```

**Required Indexes:**
```javascript
// Composite indexes needed in Firestore
[
  {
    collection: 'companies',
    fields: [
      { field: 'category', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'companies',
    fields: [
      { field: 'category', order: 'ASCENDING' },
      { field: 'city', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' }
    ]
  }
]
```

---

### 2.6 📝 Add Data Page (`/add-data`)

**Database Operations:**
- **Create**: Form submission in `form_submissions` collection
- **Upload**: Files to Firebase Storage
- **Create**: Company record in `companies` collection (after admin approval)

**Required Functions:**
```javascript
// Submit add data form
async submitAddDataForm(formData, files) {
  // Upload files first
  const attachmentUrls = await uploadFormAttachments(files, 'add-data');
  
  // Create form submission
  const submission = {
    type: 'add-data',
    formData: {
      ...formData,
      submittedAt: new Date().toISOString()
    },
    attachments: attachmentUrls,
    status: 'pending',
    submittedAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'form_submissions'), submission);
  
  // Send notification to admin (optional)
  await sendAdminNotification('new_submission', {
    type: 'Add Data',
    company: formData.companyName,
    submissionId: docRef.id
  });
  
  return docRef.id;
}

// Upload form attachments
async uploadFormAttachments(files, submissionType) {
  const uploadPromises = files.map(async (file, index) => {
    const fileName = `${submissionType}_${Date.now()}_${index}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, `form-attachments/${fileName}`);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  });
  
  return await Promise.all(uploadPromises);
}

// Admin function: Approve submission and create company
async approveAddDataSubmission(submissionId) {
  const submissionDoc = await getDoc(doc(db, 'form_submissions', submissionId));
  if (!submissionDoc.exists()) throw new Error('Submission not found');
  
  const submission = submissionDoc.data();
  const formData = submission.formData;
  
  // Create company record
  const company = {
    companyName: formData.companyName,
    contactPerson: formData.contactPerson,
    email: formData.email,
    phone: formData.phone,
    website: formData.website || '',
    address: formData.address,
    category: formData.category,
    description: formData.description,
    products: formData.products ? formData.products.split(',').map(p => p.trim()) : [],
    certifications: formData.certifications || '',
    gstNumber: formData.gstNumber || '',
    visitingCardUrl: submission.attachments[0] || '',
    documentsUrls: submission.attachments.slice(1) || [],
    status: 'active',
    source: 'form-submission',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  const companyRef = await addDoc(collection(db, 'companies'), company);
  
  // Update submission status
  await updateDoc(doc(db, 'form_submissions', submissionId), {
    status: 'approved',
    reviewedAt: Timestamp.now(),
    reviewedBy: 'admin', // Should be actual admin user ID
    companyId: companyRef.id
  });
  
  return companyRef.id;
}
```

**Validation Rules:**
```javascript
// Form validation schema
const addDataValidation = {
  companyName: { required: true, minLength: 2, maxLength: 100 },
  contactPerson: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, format: 'email' },
  phone: { required: true, format: 'phone', pattern: /^\+91[0-9]{10}$/ },
  address: { required: true, minLength: 10, maxLength: 500 },
  category: { required: true, enum: VALID_CATEGORIES },
  description: { required: true, minLength: 50, maxLength: 1000 },
  website: { format: 'url', optional: true },
  gstNumber: { format: 'gst', pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, optional: true }
};
```

---

### 2.7 📢 Advertise Page (`/advertise`)

**Database Operations:**
- **Create**: Advertising request in `form_submissions` collection

**Required Functions:**
```javascript
// Submit advertising request
async submitAdvertiseForm(formData) {
  const submission = {
    type: 'advertise',
    formData: {
      ...formData,
      submittedAt: new Date().toISOString()
    },
    attachments: [],
    status: 'pending',
    submittedAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'form_submissions'), submission);
  
  // Send notification to admin
  await sendAdminNotification('new_advertising_request', {
    company: formData.companyName,
    adType: formData.adType,
    budget: formData.budget,
    submissionId: docRef.id
  });
  
  return docRef.id;
}

// Get advertising packages (from app settings)
async getAdvertisingPackages() {
  const settingsDoc = await getDoc(doc(db, 'app_settings', 'advertising'));
  return settingsDoc.exists() ? settingsDoc.data().packages : [];
}
```

---

### 2.8 🤝 Collaborate Page (`/collaborate`)

**Database Operations:**
- **Create**: Collaboration proposal in `form_submissions` collection

**Required Functions:**
```javascript
// Submit collaboration proposal
async submitCollaborateForm(formData) {
  const submission = {
    type: 'collaborate',
    formData: {
      ...formData,
      submittedAt: new Date().toISOString()
    },
    attachments: [],
    status: 'pending',
    submittedAt: Timestamp.now()
  };
  
  const docRef = await addDoc(collection(db, 'form_submissions'), submission);
  
  // Send notification to admin
  await sendAdminNotification('new_collaboration_proposal', {
    organization: formData.organizationName,
    collaborationType: formData.collaborationType,
    submissionId: docRef.id
  });
  
  return docRef.id;
}
```

---

### 2.9 🔐 Admin Login (`/admin`)

**Database Operations:**
- **Read**: User authentication via Firebase Auth
- **Read**: User profile from `users` collection

**Required Functions:**
```javascript
// Admin login
async adminLogin(email, password) {
  try {
    // Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile || userProfile.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    // Update last login
    await updateLastLogin(user.uid);
    
    return {
      user: user,
      profile: userProfile
    };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

// Get user profile
async getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() : null;
}

// Update last login timestamp
async updateLastLogin(uid) {
  await updateDoc(doc(db, 'users', uid), {
    lastLogin: Timestamp.now()
  });
}

// Create admin user (run once during setup)
async createAdminUser(email, password, displayName) {
  // Create auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: email,
    displayName: displayName,
    role: 'admin',
    permissions: [
      'read:companies', 'write:companies', 'delete:companies',
      'manage:priorities', 'manage:submissions', 'upload:excel',
      'manage:users', 'view:analytics'
    ],
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),
    isActive: true
  });
  
  return user.uid;
}
```

---

### 2.10 📊 Admin Dashboard (`/admin/dashboard`)

**Database Operations:**
- **Read**: All form submissions from `form_submissions` collection
- **Read**: All priorities from `priorities` collection
- **Read**: Statistics and analytics data
- **Create/Update/Delete**: Priority management
- **Update**: Form submission status

**Required Functions:**
```javascript
// Get dashboard statistics
async getDashboardStats() {
  const [
    totalCompanies,
    totalSubmissions,
    activePriorities,
    recentOrders
  ] = await Promise.all([
    getCompanyCount(),
    getSubmissionCount(),
    getPriorityCount(),
    getRecentOrders()
  ]);
  
  return {
    totalCompanies,
    totalSubmissions,
    activePriorities,
    recentOrders
  };
}

// Get company count by status
async getCompanyCount() {
  const snapshot = await getDocs(
    query(collection(db, 'companies'),
    where('status', '==', 'active'))
  );
  return snapshot.size;
}

// Get submission count by type
async getSubmissionCount() {
  const snapshot = await getDocs(collection(db, 'form_submissions'));
  const counts = { total: 0, pending: 0, approved: 0, rejected: 0 };
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    counts.total++;
    counts[data.status] = (counts[data.status] || 0) + 1;
  });
  
  return counts;
}

// Get active priority count
async getPriorityCount() {
  const snapshot = await getDocs(
    query(collection(db, 'priorities'),
    where('status', '==', 'active'))
  );
  return snapshot.size;
}

// Get recent orders
async getRecentOrders(limit = 10) {
  const snapshot = await getDocs(
    query(collection(db, 'orders'),
    orderBy('createdAt', 'desc'),
    limit(limit))
  );
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Priority Management Functions
async createPriority(priorityData) {
  // Validate position is not already taken
  const existingPriority = await getDocs(
    query(collection(db, 'priorities'),
    where('category', '==', priorityData.category),
    where('position', '==', priorityData.position),
    where('status', '==', 'active'))
  );
  
  if (!existingPriority.empty) {
    throw new Error('Priority position already taken');
  }
  
  const priority = {
    ...priorityData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    status: 'active'
  };
  
  return await addDoc(collection(db, 'priorities'), priority);
}

async updatePriority(priorityId, updates) {
  await updateDoc(doc(db, 'priorities', priorityId), {
    ...updates,
    updatedAt: Timestamp.now()
  });
}

async deletePriority(priorityId) {
  await updateDoc(doc(db, 'priorities', priorityId), {
    status: 'deleted',
    deletedAt: Timestamp.now()
  });
}

// Excel Upload Processing
async processExcelUpload(file, category, adminUserId) {
  // Create upload record
  const uploadRecord = {
    fileName: file.name,
    category: category,
    fileUrl: '', // Will be updated after upload
    uploadedBy: adminUserId,
    uploadedAt: Timestamp.now(),
    status: 'processing',
    recordsCount: 0,
    successCount: 0,
    errorCount: 0,
    errors: []
  };
  
  const uploadRef = await addDoc(collection(db, 'excel_uploads'), uploadRecord);
  
  try {
    // Upload file to storage
    const fileName = `excel_${category}_${Date.now()}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, `uploads/excel-files/${fileName}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    
    // Update upload record with file URL
    await updateDoc(uploadRef, { fileUrl });
    
    // Process Excel file (this would typically be done in a Cloud Function)
    const processResult = await processExcelFile(file, category);
    
    // Update upload record with results
    await updateDoc(uploadRef, {
      status: 'completed',
      processedAt: Timestamp.now(),
      recordsCount: processResult.totalRecords,
      successCount: processResult.successCount,
      errorCount: processResult.errorCount,
      errors: processResult.errors,
      processedCompanyIds: processResult.companyIds
    });
    
    return {
      uploadId: uploadRef.id,
      ...processResult
    };
    
  } catch (error) {
    // Update upload record with error
    await updateDoc(uploadRef, {
      status: 'failed',
      processedAt: Timestamp.now(),
      errors: [error.message]
    });
    
    throw error;
  }
}

// Process Excel file and create company records
async processExcelFile(file, category) {
  // This is a simplified version - in production, use a proper Excel parsing library
  const results = {
    totalRecords: 0,
    successCount: 0,
    errorCount: 0,
    errors: [],
    companyIds: []
  };
  
  // Parse Excel file (pseudo-code)
  const rows = await parseExcelFile(file);
  results.totalRecords = rows.length;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    try {
      // Validate row data
      const validationResult = validateCompanyData(row);
      if (!validationResult.isValid) {
        results.errors.push(`Row ${i + 1}: ${validationResult.errors.join(', ')}`);
        results.errorCount++;
        continue;
      }
      
      // Create company record
      const company = {
        companyName: row.companyName,
        contactPerson: row.contactPerson,
        email: row.email,
        phone: row.phone,
        website: row.website || '',
        address: row.address,
        category: category,
        description: row.description,
        products: row.products ? row.products.split(',').map(p => p.trim()) : [],
        certifications: row.certifications || '',
        gstNumber: row.gstNumber || '',
        status: 'active',
        source: 'excel-upload',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const companyRef = await addDoc(collection(db, 'companies'), company);
      results.companyIds.push(companyRef.id);
      results.successCount++;
      
    } catch (error) {
      results.errors.push(`Row ${i + 1}: ${error.message}`);
      results.errorCount++;
    }
  }
  
  return results;
}
```

---

## 3. Function-by-Function Implementation

### 3.1 Search Functions

```javascript
// Global search across all companies
async globalSearch(searchTerm, filters = {}) {
  const constraints = [where('status', '==', 'active')];
  
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  
  if (filters.city) {
    constraints.push(where('city', '==', filters.city));
  }
  
  const snapshot = await getDocs(
    query(collection(db, 'companies'), ...constraints)
  );
  
  // Client-side text search (Firestore doesn't support full-text search)
  return snapshot.docs.filter(doc => {
    const data = doc.data();
    const searchFields = [
      data.companyName,
      data.description,
      data.products.join(' '),
      data.address
    ].join(' ').toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });
}

// Auto-complete search suggestions
async getSearchSuggestions(partialTerm, limit = 10) {
  const snapshot = await getDocs(
    query(collection(db, 'companies'),
    where('status', '==', 'active'),
    orderBy('companyName'),
    limit(50)) // Get more results for better filtering
  );
  
  const suggestions = new Set();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    
    // Add company name if it matches
    if (data.companyName.toLowerCase().includes(partialTerm.toLowerCase())) {
      suggestions.add(data.companyName);
    }
    
    // Add matching products
    data.products.forEach(product => {
      if (product.toLowerCase().includes(partialTerm.toLowerCase())) {
        suggestions.add(product);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, limit);
}
```

### 3.2 Analytics Functions

```javascript
// Get category-wise company distribution
async getCategoryAnalytics() {
  const snapshot = await getDocs(
    query(collection(db, 'companies'),
    where('status', '==', 'active'))
  );
  
  const categoryCount = {};
  snapshot.docs.forEach(doc => {
    const category = doc.data().category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  return categoryCount;
}

// Get monthly submission trends
async getSubmissionTrends(months = 12) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const snapshot = await getDocs(
    query(collection(db, 'form_submissions'),
    where('submittedAt', '>=', Timestamp.fromDate(startDate)),
    where('submittedAt', '<=', Timestamp.fromDate(endDate)),
    orderBy('submittedAt', 'asc'))
  );
  
  const monthlyData = {};
  snapshot.docs.forEach(doc => {
    const date = doc.data().submittedAt.toDate();
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, byType: {} };
    }
    
    monthlyData[monthKey].total++;
    const type = doc.data().type;
    monthlyData[monthKey].byType[type] = (monthlyData[monthKey].byType[type] || 0) + 1;
  });
  
  return monthlyData;
}

// Get top performing companies (by views/contacts)
async getTopCompanies(limit = 10) {
  // This would require implementing view/contact tracking
  const snapshot = await getDocs(
    query(collection(db, 'companies'),
    where('status', '==', 'active'),
    orderBy('viewCount', 'desc'), // Requires adding viewCount field
    limit(limit))
  );
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
```

### 3.3 Notification Functions

```javascript
// Send admin notification (email/SMS)
async sendAdminNotification(type, data) {
  const notification = {
    type: type,
    data: data,
    sentAt: Timestamp.now(),
    status: 'pending'
  };
  
  // Store notification record
  await addDoc(collection(db, 'notifications'), notification);
  
  // Send actual notification (implement based on your service)
  switch (type) {
    case 'new_submission':
      await sendEmail({
        to: 'admin@knitinfo.com',
        subject: `New ${data.type} Submission`,
        body: `New submission from ${data.company}. Review at: /admin/dashboard`
      });
      break;
      
    case 'new_order':
      await sendSMS({
        to: '+919943632229',
        message: `New book order: ${data.bookTitle} - ${data.customerName}`
      });
      break;
  }
}

// Send customer confirmation
async sendCustomerConfirmation(type, customerData, submissionId) {
  const confirmationEmail = {
    to: customerData.email,
    subject: getConfirmationSubject(type),
    body: getConfirmationBody(type, customerData, submissionId)
  };
  
  await sendEmail(confirmationEmail);
}
```

### 3.4 Backup Functions

```javascript
// Create daily backup
async createDailyBackup() {
  const backupData = {
    timestamp: Timestamp.now(),
    collections: {}
  };
  
  // Backup each collection
  const collections = ['companies', 'priorities', 'form_submissions', 'categories', 'books', 'orders'];
  
  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db, collectionName));
    backupData.collections[collectionName] = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
  }
  
  // Store backup (could be in Cloud Storage or separate database)
  const backupRef = await addDoc(collection(db, 'backups'), backupData);
  
  return backupRef.id;
}

// Restore from backup
async restoreFromBackup(backupId) {
  const backupDoc = await getDoc(doc(db, 'backups', backupId));
  if (!backupDoc.exists()) throw new Error('Backup not found');
  
  const backupData = backupDoc.data();
  
  // Restore each collection
  for (const [collectionName, documents] of Object.entries(backupData.collections)) {
    for (const document of documents) {
      await setDoc(doc(db, collectionName, document.id), document.data);
    }
  }
  
  return true;
}
```

---

## 4. API Endpoints Specification

### 4.1 REST API Structure

```javascript
// Express.js API routes structure
const express = require('express');
const app = express();

// Companies API
app.get('/api/companies', getCompanies);
app.get('/api/companies/:id', getCompany);
app.post('/api/companies', authenticateAdmin, createCompany);
app.put('/api/companies/:id', authenticateAdmin, updateCompany);
app.delete('/api/companies/:id', authenticateAdmin, deleteCompany);
app.get('/api/companies/search', searchCompanies);

// Categories API
app.get('/api/categories', getCategories);
app.get('/api/categories/:slug/companies', getCompaniesByCategory);

// Priorities API
app.get('/api/priorities', authenticateAdmin, getPriorities);
app.post('/api/priorities', authenticateAdmin, createPriority);
app.put('/api/priorities/:id', authenticateAdmin, updatePriority);
app.delete('/api/priorities/:id', authenticateAdmin, deletePriority);

// Form Submissions API
app.post('/api/submissions/add-data', submitAddDataForm);
app.post('/api/submissions/advertise', submitAdvertiseForm);
app.post('/api/submissions/collaborate', submitCollaborateForm);
app.get('/api/submissions', authenticateAdmin, getSubmissions);
app.put('/api/submissions/:id/status', authenticateAdmin, updateSubmissionStatus);

// File Upload API
app.post('/api/upload/excel', authenticateAdmin, uploadExcel);
app.post('/api/upload/files', uploadFiles);

// Books API
app.get('/api/books', getBooks);
app.get('/api/books/:id', getBook);
app.post('/api/orders', createOrder);

// Analytics API
app.get('/api/analytics/dashboard', authenticateAdmin, getDashboardAnalytics);
app.get('/api/analytics/categories', getCategoryAnalytics);
app.get('/api/analytics/trends', getSubmissionTrends);

// Authentication API
app.post('/api/auth/login', adminLogin);
app.post('/api/auth/logout', adminLogout);
app.get('/api/auth/profile', authenticateAdmin, getProfile);
```

### 4.2 API Response Formats

```javascript
// Standard API response format
const apiResponse = {
  success: true,
  data: {}, // or []
  message: 'Operation completed successfully',
  timestamp: new Date().toISOString(),
  pagination: { // for paginated responses
    page: 1,
    limit: 20,
    total: 100,
    hasMore: true
  }
};

// Error response format
const errorResponse = {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: {
      field: 'email',
      reason: 'Invalid email format'
    }
  },
  timestamp: new Date().toISOString()
};
```

---

## 5. Security & Validation Rules

### 5.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Public read access
    match /companies/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /categories/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /books/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Admin only access
    match /priorities/{document} {
      allow read, write: if isAdmin();
    }
    
    match /excel_uploads/{document} {
      allow read, write: if isAdmin();
    }
    
    match /users/{document} {
      allow read: if isOwner(document) || isAdmin();
      allow write: if isAdmin();
    }
    
    // Form submissions
    match /form_submissions/{document} {
      allow create: if true; // Anyone can submit
      allow read, update, delete: if isAdmin();
    }
    
    // Orders
    match /orders/{document} {
      allow create: if true; // Anyone can place orders
      allow read, update, delete: if isAdmin();
    }
    
    // App settings
    match /app_settings/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Notifications and backups - admin only
    match /notifications/{document} {
      allow read, write: if isAdmin();
    }
    
    match /backups/{document} {
      allow read, write: if isAdmin();
    }
  }
}
```

### 5.2 Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read, authenticated write
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Specific rules for different file types
    match /uploads/excel-files/{fileName} {
      allow read, write: if request.auth != null && 
                         get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /visiting-cards/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null && 
                    get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5.3 Input Validation Schemas

```javascript
// Company validation schema
const companySchema = {
  companyName: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s&.-]+$/
  },
  contactPerson: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s.]+$/
  },
  email: {
    type: 'string',
    required: true,
    format: 'email',
    maxLength: 100
  },
  phone: {
    type: 'string',
    required: true,
    pattern: /^\+91[6-9]\d{9}$/
  },
  website: {
    type: 'string',
    format: 'url',
    optional: true
  },
  address: {
    type: 'string',
    required: true,
    minLength: 10,
    maxLength: 500
  },
  category: {
    type: 'string',
    required: true,
    enum: ['Yarn', 'Fabric Suppliers', 'Knitting', 'Buying Agents', 'Printing', 'Threads', 'Trims & Accessories', 'Dyes & Chemicals', 'Machineries', 'Machine Spares']
  },
  description: {
    type: 'string',
    required: true,
    minLength: 50,
    maxLength: 1000
  },
  products: {
    type: 'array',
    items: {
      type: 'string',
      maxLength: 100
    },
    maxItems: 20
  },
  gstNumber: {
    type: 'string',
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    optional: true
  }
};

// Priority validation schema
const prioritySchema = {
  companyName: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 100
  },
  category: {
    type: 'string',
    required: true,
    enum: ['Yarn', 'Fabric Suppliers', 'Knitting', 'Buying Agents', 'Printing', 'Threads', 'Trims & Accessories', 'Dyes & Chemicals', 'Machineries', 'Machine Spares']
  },
  position: {
    type: 'number',
    required: true,
    min: 1,
    max: 100
  },
  priorityType: {
    type: 'string',
    required: true,
    enum: ['permanent', 'temporary']
  },
  duration: {
    type: 'number',
    min: 1,
    max: 3650, // Max 10 years
    requiredIf: { priorityType: 'temporary' }
  },
  durationType: {
    type: 'string',
    enum: ['days', 'months', 'years'],
    requiredIf: { priorityType: 'temporary' }
  }
};
```

---

## 6. Performance Optimization

### 6.1 Database Indexes

```javascript
// Required Firestore indexes
const requiredIndexes = [
  // Companies collection
  {
    collection: 'companies',
    fields: [
      { field: 'category', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'companies',
    fields: [
      { field: 'status', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  },
  
  // Priorities collection
  {
    collection: 'priorities',
    fields: [
      { field: 'category', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' },
      { field: 'position', order: 'ASCENDING' }
    ]
  },
  {
    collection: 'priorities',
    fields: [
      { field: 'priorityType', order: 'ASCENDING' },
      { field: 'expiresAt', order: 'ASCENDING' },
      { field: 'status', order: 'ASCENDING' }
    ]
  },
  
  // Form submissions collection
  {
    collection: 'form_submissions',
    fields: [
      { field: 'type', order: 'ASCENDING' },
      { field: 'submittedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'form_submissions',
    fields: [
      { field: 'status', order: 'ASCENDING' },
      { field: 'submittedAt', order: 'DESCENDING' }
    ]
  },
  
  // Orders collection
  {
    collection: 'orders',
    fields: [
      { field: 'orderStatus', order: 'ASCENDING' },
      { field: 'createdAt', order: 'DESCENDING' }
    ]
  }
];
```

### 6.2 Caching Strategy

```javascript
// Cache configuration
const cacheConfig = {
  // Static data - cache for 24 hours
  categories: { ttl: 86400 },
  appSettings: { ttl: 86400 },
  
  // Semi-static data - cache for 1 hour
  companies: { ttl: 3600 },
  books: { ttl: 3600 },
  
  // Dynamic data - cache for 5 minutes
  priorities: { ttl: 300 },
  dashboardStats: { ttl: 300 },
  
  // Search results - cache for 15 minutes
  searchResults: { ttl: 900 }
};

// Cache implementation
class CacheManager {
  constructor() {
    this.cache = new Map();
  }
  
  set(key, value, ttl) {
    const expiresAt = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiresAt });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
```

### 6.3 Pagination Implementation

```javascript
// Pagination for large datasets
async function getPaginatedCompanies(filters = {}, pageSize = 20, lastDoc = null) {
  const constraints = [where('status', '==', 'active')];
  
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(pageSize));
  
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }
  
  const snapshot = await getDocs(
    query(collection(db, 'companies'), ...constraints)
  );
  
  return {
    companies: snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize
  };
}
```

---

## 7. Backup & Recovery

### 7.1 Automated Backup Strategy

```javascript
// Daily backup function (to be run as Cloud Function)
exports.dailyBackup = functions.pubsub
  .schedule('0 2 * * *') // Run at 2 AM daily
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    const backupId = await createDailyBackup();
    console.log(`Daily backup created: ${backupId}`);
    
    // Clean up old backups (keep last 30 days)
    await cleanupOldBackups(30);
    
    return null;
  });

// Cleanup old backups
async function cleanupOldBackups(daysToKeep) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const oldBackups = await getDocs(
    query(collection(db, 'backups'),
    where('timestamp', '<', Timestamp.fromDate(cutoffDate)))
  );
  
  const deletePromises = oldBackups.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  console.log(`Cleaned up ${oldBackups.docs.length} old backups`);
}
```

### 7.2 Data Export Functions

```javascript
// Export companies to Excel
async function exportCompaniesToExcel(filters = {}) {
  const companies = await getCompanies(filters);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Companies');
  
  // Add headers
  worksheet.columns = [
    { header: 'Company Name', key: 'companyName', width: 30 },
    { header: 'Contact Person', key: 'contactPerson', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Address', key: 'address', width: 50 },
    { header: 'Products', key: 'products', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 15 }
  ];
  
  // Add data
  companies.forEach(company => {
    worksheet.addRow({
      ...company,
      products: company.products.join(', '),
      createdAt: company.createdAt.toDate().toLocaleDateString()
    });
  });
  
  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

// Export form submissions to CSV
async function exportSubmissionsToCSV(type = null) {
  const submissions = await getSubmissions(type);
  
  const csvData = submissions.map(submission => ({
    Type: submission.type,
    'Company/Organization': submission.formData.companyName || submission.formData.organizationName,
    'Contact Person': submission.formData.contactPerson,
    Email: submission.formData.email,
    Phone: submission.formData.phone,
    Status: submission.status,
    'Submitted At': submission.submittedAt.toDate().toLocaleDateString()
  }));
  
  return csvData;
}
```

---

## 8. Monitoring & Logging

### 8.1 Performance Monitoring

```javascript
// Performance monitoring middleware
function performanceMonitor(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Store metrics
    storeMetric({
      endpoint: req.path,
      method: req.method,
      duration: duration,
      statusCode: res.statusCode,
      timestamp: new Date()
    });
  });
  
  next();
}

// Store performance metrics
async function storeMetric(metric) {
  await addDoc(collection(db, 'performance_metrics'), metric);
}
```

### 8.2 Error Logging

```javascript
// Error logging function
async function logError(error, context = {}) {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    context: context,
    timestamp: Timestamp.now(),
    severity: getErrorSeverity(error)
  };
  
  await addDoc(collection(db, 'error_logs'), errorLog);
  
  // Send alert for critical errors
  if (errorLog.severity === 'critical') {
    await sendAdminAlert('Critical Error', errorLog);
  }
}

// Determine error severity
function getErrorSeverity(error) {
  if (error.message.includes('permission-denied')) return 'high';
  if (error.message.includes('not-found')) return 'medium';
  if (error.message.includes('validation')) return 'low';
  return 'medium';
}
```

---

## 9. Testing Requirements

### 9.1 Unit Tests

```javascript
// Test company CRUD operations
describe('Company Service', () => {
  test('should create company with valid data', async () => {
    const companyData = {
      companyName: 'Test Company',
      contactPerson: 'John Doe',
      email: 'john@test.com',
      phone: '+919876543210',
      address: 'Test Address',
      category: 'Yarn',
      description: 'Test description',
      products: ['Cotton Yarn'],
      status: 'active',
      source: 'test'
    };
    
    const companyId = await companyService.createCompany(companyData);
    expect(companyId).toBeDefined();
    
    const company = await companyService.getCompany(companyId);
    expect(company.companyName).toBe('Test Company');
  });
  
  test('should reject invalid email', async () => {
    const invalidData = {
      companyName: 'Test Company',
      email: 'invalid-email',
      // ... other fields
    };
    
    await expect(companyService.createCompany(invalidData))
      .rejects.toThrow('Invalid email format');
  });
});
```

### 9.2 Integration Tests

```javascript
// Test complete form submission flow
describe('Form Submission Flow', () => {
  test('should handle add-data form submission', async () => {
    const formData = {
      companyName: 'Integration Test Co',
      contactPerson: 'Jane Doe',
      email: 'jane@test.com',
      phone: '+919876543210',
      address: 'Test Address',
      category: 'Yarn',
      description: 'Integration test description'
    };
    
    // Submit form
    const submissionId = await submitAddDataForm(formData, []);
    expect(submissionId).toBeDefined();
    
    // Verify submission was created
    const submission = await getDoc(doc(db, 'form_submissions', submissionId));
    expect(submission.exists()).toBe(true);
    expect(submission.data().type).toBe('add-data');
    
    // Test admin approval
    await approveAddDataSubmission(submissionId);
    
    // Verify company was created
    const companies = await searchCompanies('Integration Test Co');
    expect(companies.length).toBe(1);
    expect(companies[0].companyName).toBe('Integration Test Co');
  });
});
```

---

## 10. Deployment Checklist

### 10.1 Pre-deployment Steps

```markdown
## Pre-deployment Checklist

### Database Setup
- [ ] Firebase project created
- [ ] Firestore database initialized
- [ ] Storage bucket configured
- [ ] Authentication enabled
- [ ] Security rules deployed
- [ ] Required indexes created
- [ ] Initial data seeded

### Environment Configuration
- [ ] Environment variables set
- [ ] API keys configured
- [ ] Admin user created
- [ ] Email service configured
- [ ] SMS service configured (optional)

### Code Quality
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Security vulnerabilities checked
- [ ] Performance optimized
- [ ] Error handling implemented

### Monitoring Setup
- [ ] Logging configured
- [ ] Performance monitoring enabled
- [ ] Error tracking setup
- [ ] Backup strategy implemented
- [ ] Alerts configured
```

### 10.2 Post-deployment Verification

```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {}
  };
  
  try {
    // Check database connection
    await getDocs(query(collection(db, 'companies'), limit(1)));
    healthCheck.services.database = 'OK';
  } catch (error) {
    healthCheck.services.database = 'ERROR';
    healthCheck.status = 'ERROR';
  }
  
  try {
    // Check storage connection
    await listAll(ref(storage, 'uploads'));
    healthCheck.services.storage = 'OK';
  } catch (error) {
    healthCheck.services.storage = 'ERROR';
    healthCheck.status = 'ERROR';
  }
  
  res.status(healthCheck.status === 'OK' ? 200 : 500).json(healthCheck);
});
```

---

This comprehensive database requirements document covers every aspect of the backend implementation needed for your KnitInfo Directory webapp. Each section provides step-by-step implementation details, code examples, and best practices to ensure a robust, scalable, and maintainable system.