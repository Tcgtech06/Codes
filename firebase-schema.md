# Firebase Database Schema Design for KnitInfo Directory

## Collections Structure

### 1. **companies** Collection
```javascript
{
  id: "auto-generated-id",
  companyName: "ABC Textiles Ltd",
  contactPerson: "John Doe",
  email: "john@abctextiles.com",
  phone: "+91 9876543210",
  website: "https://abctextiles.com",
  address: "123 Industrial Area, Tirupur, Tamil Nadu",
  category: "Yarn", // Yarn, Fabric Suppliers, Knitting, etc.
  description: "Leading textile manufacturer...",
  products: ["Cotton Yarn", "Polyester Yarn", "Blended Yarn"],
  certifications: "ISO 9001, OEKO-TEX",
  gstNumber: "22AAAAA0000A1Z5",
  visitingCardUrl: "https://firebase-storage-url/visiting-cards/company-id.jpg",
  documentsUrls: ["https://firebase-storage-url/docs/doc1.pdf"],
  status: "active", // active, inactive, pending
  source: "excel-upload", // excel-upload, form-submission, admin-added
  createdAt: "2026-01-31T10:00:00Z",
  updatedAt: "2026-01-31T10:00:00Z",
  createdBy: "admin-user-id"
}
```

### 2. **priorities** Collection
```javascript
{
  id: "auto-generated-id",
  companyId: "company-document-id",
  companyName: "ABC Textiles Ltd",
  category: "Yarn",
  position: 1, // 1 = highest priority
  priorityType: "permanent", // permanent, temporary
  duration: 30, // only for temporary
  durationType: "days", // days, months, years
  expiresAt: "2026-02-30T10:00:00Z", // null for permanent
  createdAt: "2026-01-31T10:00:00Z",
  updatedAt: "2026-01-31T10:00:00Z",
  createdBy: "admin-user-id",
  status: "active" // active, expired
}
```

### 3. **form_submissions** Collection
```javascript
{
  id: "auto-generated-id",
  type: "add-data", // add-data, advertise, collaborate
  formData: {
    // Dynamic object based on form type
    companyName: "XYZ Corp",
    contactPerson: "Jane Smith",
    email: "jane@xyzcorp.com",
    // ... other form fields
  },
  attachments: ["url1", "url2"], // Firebase Storage URLs
  status: "pending", // pending, reviewed, approved, rejected
  submittedAt: "2026-01-31T10:00:00Z",
  reviewedAt: null,
  reviewedBy: null,
  reviewNotes: ""
}
```

### 4. **books** Collection
```javascript
{
  id: "auto-generated-id",
  title: "Textile Industry Guide",
  edition: "2024 Edition",
  price: 500,
  currency: "INR",
  description: "Comprehensive guide to textile industry",
  coverImageUrl: "https://firebase-storage-url/books/book-id.jpg",
  category: "Educational",
  status: "active", // active, inactive, out-of-stock
  createdAt: "2026-01-31T10:00:00Z",
  updatedAt: "2026-01-31T10:00:00Z"
}
```

### 5. **orders** Collection
```javascript
{
  id: "auto-generated-id",
  bookId: "book-document-id",
  bookTitle: "Textile Industry Guide",
  quantity: 2,
  unitPrice: 500,
  totalAmount: 1000,
  currency: "INR",
  customerInfo: {
    name: "Customer Name",
    phone: "+91 9876543210",
    email: "customer@email.com",
    address: "Delivery address"
  },
  orderStatus: "pending", // pending, confirmed, shipped, delivered, cancelled
  paymentStatus: "pending", // pending, paid, failed
  whatsappMessageSent: true,
  createdAt: "2026-01-31T10:00:00Z",
  updatedAt: "2026-01-31T10:00:00Z"
}
```

### 6. **categories** Collection
```javascript
{
  id: "auto-generated-id",
  name: "Yarn",
  slug: "yarn",
  description: "Yarn suppliers and manufacturers",
  iconName: "Layers", // Lucide icon name
  colorClass: "bg-blue-100 text-blue-600",
  displayOrder: 1,
  isActive: true,
  companyCount: 150, // Updated periodically
  createdAt: "2026-01-31T10:00:00Z",
  updatedAt: "2026-01-31T10:00:00Z"
}
```

### 7. **users** Collection (Admin Management)
```javascript
{
  id: "firebase-auth-uid",
  email: "admin@knitinfo.com",
  displayName: "Admin User",
  role: "admin", // admin, moderator, viewer
  permissions: ["read", "write", "delete", "manage-priorities"],
  lastLogin: "2026-01-31T10:00:00Z",
  createdAt: "2026-01-31T10:00:00Z",
  isActive: true
}
```

### 8. **excel_uploads** Collection
```javascript
{
  id: "auto-generated-id",
  fileName: "yarn-companies.xlsx",
  category: "Yarn",
  fileUrl: "https://firebase-storage-url/uploads/file-id.xlsx",
  uploadedBy: "admin-user-id",
  uploadedAt: "2026-01-31T10:00:00Z",
  processedAt: "2026-01-31T10:00:00Z",
  status: "processed", // uploaded, processing, processed, failed
  recordsCount: 150,
  successCount: 145,
  errorCount: 5,
  errors: ["Row 5: Invalid email format", "Row 12: Missing company name"],
  processedCompanyIds: ["company-id-1", "company-id-2"]
}
```

### 9. **app_settings** Collection
```javascript
{
  id: "general",
  siteName: "KnitInfo Directory",
  siteDescription: "Comprehensive directory for textile industry",
  contactPhone: "+91 9943632229",
  contactEmail: "info@knitinfo.com",
  whatsappNumber: "+91 9943632229",
  socialLinks: {
    facebook: "https://facebook.com/knitinfo",
    twitter: "https://twitter.com/knitinfo",
    instagram: "https://instagram.com/knitinfo"
  },
  maintenanceMode: false,
  featuredCategories: ["Yarn", "Fabric Suppliers", "Knitting"],
  updatedAt: "2026-01-31T10:00:00Z",
  updatedBy: "admin-user-id"
}
```

## Firebase Storage Structure

```
/uploads/
  /excel-files/
    /{upload-id}.xlsx
  /visiting-cards/
    /{company-id}.jpg
  /company-documents/
    /{company-id}/
      /doc1.pdf
      /doc2.jpg
  /books/
    /covers/
      /{book-id}.jpg
  /form-attachments/
    /{submission-id}/
      /file1.pdf
      /file2.jpg
```

## Security Rules Structure

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to companies and categories
    match /companies/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /books/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin only access
    match /priorities/{document} {
      allow read, write: if request.auth != null && 
                         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /form_submissions/{document} {
      allow create: if true; // Anyone can submit forms
      allow read, update, delete: if request.auth != null && 
                                  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /users/{document} {
      allow read, write: if request.auth != null && 
                         (request.auth.uid == document || 
                          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /visiting-cards/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /company-documents/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Indexes Required

### Composite Indexes
1. **companies**: category (Ascending), createdAt (Descending)
2. **companies**: status (Ascending), category (Ascending), createdAt (Descending)
3. **priorities**: category (Ascending), position (Ascending), status (Ascending)
4. **priorities**: expiresAt (Ascending), status (Ascending)
5. **form_submissions**: type (Ascending), submittedAt (Descending)
6. **form_submissions**: status (Ascending), submittedAt (Descending)
7. **orders**: orderStatus (Ascending), createdAt (Descending)

## API Endpoints Structure (Cloud Functions)

### Company Management
- `GET /api/companies` - Get companies with filters
- `POST /api/companies` - Create new company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

### Priority Management
- `GET /api/priorities` - Get all priorities
- `POST /api/priorities` - Create priority
- `PUT /api/priorities/{id}` - Update priority
- `DELETE /api/priorities/{id}` - Delete priority

### Form Submissions
- `POST /api/submissions/add-data` - Submit add data form
- `POST /api/submissions/advertise` - Submit advertise form
- `POST /api/submissions/collaborate` - Submit collaborate form
- `GET /api/submissions` - Get all submissions (admin)

### Excel Upload
- `POST /api/upload/excel` - Upload and process Excel file
- `GET /api/upload/status/{id}` - Get upload status

### Search & Filtering
- `GET /api/search` - Search companies with filters
- `GET /api/categories/{slug}/companies` - Get companies by category