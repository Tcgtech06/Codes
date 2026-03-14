# Frontend API Integration - Complete Guide

## ✅ Completed Integrations

### 1. API Service Layer (`src/lib/api.ts`)
Created centralized API service with all backend endpoints:
- Auth API (login, verify)
- Categories API (getAll)
- Companies API (getAll, getById, getByCategory, search, create, update, delete, export)
- Priorities API (getAll, getByCategory, create, update, delete)
- Books API (getAll, getById, create)
- Orders API (getAll, create)
- Submissions API (getAll, create, updateStatus, approve)
- Contact API (getAll, submit)
- Dashboard API (getStats)
- Excel API (upload, getHistory)
- Analytics API (getTrends)
- Settings API (get)

### 2. Environment Configuration
- Created `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
- API base URL configurable via environment variable

### 3. Updated Pages

#### Home Page (`app/page.tsx`)
- ✅ Fetches books from API instead of static data
- ✅ Fetches categories from API
- ✅ Displays real-time data

#### Catalogue Page (`app/catalogue/page.tsx`)
- ✅ Fetches categories from API
- ✅ Shows company counts per category
- ✅ Loading state with skeleton UI
- ✅ Dynamic routing with category slugs

#### Books Page (`app/books/page.tsx`)
- ✅ Fetches books from API
- ✅ Loading state with skeleton UI
- ✅ Dynamic book data display

#### Contact Page (`app/contact/page.tsx`)
- ✅ Submits contact form to API
- ✅ Stores message in database
- ✅ Still opens WhatsApp after submission
- ✅ Success/error feedback

#### Add Data Page (`app/add-data/page.tsx`)
- ✅ Fetches categories from API
- ✅ Submits form data to API
- ✅ Creates submission in database
- ✅ Success/error feedback

---

## 🔄 Pages Still Using LocalStorage (Need Update)

### 1. Admin Dashboard (`app/admin/dashboard/page.tsx`)
**Current**: Uses localStorage for stats
**Needs**: 
```typescript
import { dashboardAPI, submissionsAPI, companiesAPI } from '@/lib/api';

// Fetch dashboard stats
const stats = await dashboardAPI.getStats();

// Fetch submissions
const submissions = await submissionsAPI.getAll({ status: 'pending' });
```

### 2. Catalogue Category Pages (`app/catalogue/[category]/page.tsx`)
**Needs**: 
```typescript
import { companiesAPI } from '@/lib/api';

// Fetch companies by category
const { companies } = await companiesAPI.getByCategory(category);
```

### 3. Advertise Page (`app/advertise/page.tsx`)
**Needs**:
```typescript
import { submissionsAPI } from '@/lib/api';

// Submit advertise form
await submissionsAPI.create({
  type: 'advertise',
  formData: { ...formData }
});
```

### 4. Collaborate Page (`app/collaborate/page.tsx`)
**Needs**:
```typescript
import { submissionsAPI } from '@/lib/api';

// Submit collaborate form
await submissionsAPI.create({
  type: 'collaborate',
  formData: { ...formData }
});
```

### 5. Book Detail Page (`app/books/[id]/page.tsx`)
**Needs**:
```typescript
import { booksAPI, ordersAPI } from '@/lib/api';

// Fetch book details
const book = await booksAPI.getById(id);

// Create order
await ordersAPI.create({
  bookId: id,
  customerName,
  customerEmail,
  customerPhone,
  quantity,
  totalAmount
});
```

---

## 🔐 Authentication Flow

### Login Process
1. User enters credentials
2. Call `authAPI.login(username, password)`
3. Store token in localStorage: `localStorage.setItem('authToken', token)`
4. Token automatically included in protected API calls

### Token Verification
```typescript
const token = localStorage.getItem('authToken');
if (token) {
  const { valid, user } = await authAPI.verify(token);
  if (!valid) {
    localStorage.removeItem('authToken');
    // Redirect to login
  }
}
```

---

## 📊 API Response Formats

### Categories
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Yarn",
      "slug": "yarn",
      "count": 25
    }
  ]
}
```

### Companies
```json
{
  "companies": [
    {
      "id": "uuid",
      "companyName": "ABC Textiles",
      "contactPerson": "John Doe",
      "email": "john@abc.com",
      "phone": "+91 1234567890",
      "website": "https://abc.com",
      "address": "123 Street",
      "category": "Yarn",
      "description": "Leading yarn supplier",
      "products": ["Cotton Yarn", "Polyester Yarn"],
      "status": "active"
    }
  ],
  "total": 25
}
```

### Books
```json
{
  "books": [
    {
      "id": "uuid",
      "title": "Textile Directory 2024",
      "author": "KnitInfo Team",
      "description": "Comprehensive directory",
      "price": 500,
      "category": "Directory",
      "coverImage": "https://...",
      "stock": 100,
      "status": "active"
    }
  ]
}
```

### Submissions
```json
{
  "submissions": [
    {
      "id": "uuid",
      "type": "add-data",
      "formData": { ... },
      "status": "pending",
      "submittedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 🚀 Testing the Integration

### 1. Start Backend
```bash
cd KnitInfo_Backend
go run cmd/server/main.go
```
Backend runs on: http://localhost:8080

### 2. Start Frontend
```bash
cd KnitInfo_Frontend
npm run dev
```
Frontend runs on: http://localhost:3000

### 3. Test Endpoints

#### Test Categories
```bash
curl http://localhost:8080/api/v1/categories
```

#### Test Companies
```bash
curl http://localhost:8080/api/v1/companies
```

#### Test Books
```bash
curl http://localhost:8080/api/v1/books
```

#### Test Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"KnitInfo2024@Admin"}'
```

---

## 🔧 Next Steps

### Priority 1: Complete Remaining Pages
1. Update admin dashboard to use API
2. Update catalogue category pages
3. Update advertise/collaborate pages
4. Update book detail page with order functionality

### Priority 2: Add Authentication
1. Create login page
2. Add auth context/provider
3. Protect admin routes
4. Add logout functionality

### Priority 3: Error Handling
1. Add global error boundary
2. Add toast notifications
3. Add retry logic for failed requests
4. Add offline detection

### Priority 4: Performance
1. Add React Query for caching
2. Implement pagination
3. Add infinite scroll
4. Optimize image loading

---

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password
PORT=8080
```

---

## ✅ Integration Status

| Page | API Integration | Status |
|------|----------------|--------|
| Home | ✅ Books, Categories | Complete |
| Catalogue | ✅ Categories | Complete |
| Catalogue/[category] | ❌ Companies | Pending |
| Books | ✅ Books List | Complete |
| Books/[id] | ❌ Book Detail, Orders | Pending |
| Contact | ✅ Contact Form | Complete |
| Add Data | ✅ Submissions | Complete |
| Advertise | ❌ Submissions | Pending |
| Collaborate | ❌ Submissions | Pending |
| Admin Dashboard | ❌ Stats, Submissions | Pending |
| Admin Login | ❌ Auth | Pending |

---

## 🎯 Current Progress: 40% Complete

**Completed**: 5/12 pages
**Remaining**: 7/12 pages

The foundation is solid with the API service layer complete. The remaining pages follow the same pattern and can be updated quickly.
