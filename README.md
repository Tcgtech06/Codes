# KnitInfo - Textile Industry Directory

A comprehensive full-stack web application for the knitwear industry, featuring a mobile-first Next.js frontend and a Go backend API with Supabase PostgreSQL integration.

## 🚀 Quick Start

### Frontend (Next.js)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Backend (Go + Supabase)
```bash
# 1. Setup Supabase at https://supabase.com
# 2. Run migration from migrations/001_initial_schema.sql
# 3. Update .env with your Supabase credentials
go mod tidy
go run cmd/server/main.go
```
API runs on [http://localhost:8080](http://localhost:8080)

## 📱 Frontend Features

- 🚀 **Turbopack** - Lightning-fast development with Next.js
- 📱 **Mobile-First Design** - Bottom navigation optimized for mobile
- 💻 **Responsive** - Seamless desktop and mobile experience
- 🎨 **Modern UI** - Clean design with Tailwind CSS
- 📦 **PWA Ready** - Installable as native mobile app
- 🌐 **Static Export** - Easy deployment to Netlify/Vercel

### Mobile App Features
- Bottom navigation bar (Home, Catalogue, About, Contact)
- PWA installation support
- Auto-hiding navbar on scroll
- Profile menu with services
- Live visitor statistics
- Interactive story timeline

## 🔧 Backend Features

- 🗄️ **Supabase PostgreSQL** - Scalable cloud database
- 🔐 **JWT Authentication** - Secure admin access
- 📊 **RESTful API** - Clean, documented endpoints
- 🔍 **Search & Filter** - Advanced company search
- ⚡ **Priority System** - Company ranking with expiration
- 📝 **Form Management** - Handle submissions and contacts
- 📚 **Book Orders** - E-commerce functionality

## 📚 Documentation

### Frontend
- **Mobile-First Design** - Bottom nav, PWA support
- **Component Structure** - Reusable React components
- **Static Export** - Optimized for CDN deployment

### Backend
- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Database setup guide
- **[API_TESTING.md](API_TESTING.md)** - Test all endpoints
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step guide

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/v1/companies` - List companies
- `GET /api/v1/companies/:id` - Get company details
- `GET /api/v1/companies/search` - Search companies
- `GET /api/v1/categories` - List categories
- `GET /api/v1/priorities` - List priorities
- `GET /api/v1/books` - List books
- `POST /api/v1/orders` - Create book order
- `POST /api/v1/submissions` - Submit form
- `POST /api/v1/contact` - Contact form
- `POST /api/v1/auth/login` - Admin login

### Protected Endpoints (JWT Required)
- `POST /api/v1/companies` - Create company
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company
- `POST /api/v1/priorities` - Create priority
- `GET /api/v1/submissions` - List submissions
- `GET /api/v1/contacts` - List contacts

## 🏗️ Architecture

```
Frontend (Next.js + React)
       ↓
Echo API Server (Go)
       ↓
Repository Layer
       ↓
Supabase PostgreSQL
```

## 📊 Database Schema

- **companies** - Business directory listings
- **priorities** - Company ranking system
- **form_submissions** - User form submissions
- **contact_messages** - Contact form messages
- **categories** - Business categories
- **books** - Book catalog
- **orders** - Book orders
- **app_settings** - Application settings

## 🛠️ Technologies

### Frontend
- Next.js 16.1.2
- React 19.2.3
- Tailwind CSS 4
- TypeScript 5
- Turbopack
- Lucide React (icons)

### Backend
- Go 1.21+
- Echo Framework v4
- Supabase PostgreSQL
- JWT Authentication
- CORS enabled

## 📁 Project Structure

```
├── src/                    # Frontend source
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities
├── cmd/                   # Backend entry points
│   └── server/           # Main server
├── pkg/                   # Backend packages
│   ├── database/         # Database connection
│   ├── models/           # Data models
│   └── repository/       # Data access layer
├── migrations/            # Database migrations
└── public/               # Static assets
```

## 🔐 Authentication

### Admin Login
```bash
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "KnitInfo2024@Admin"
}
```

### Protected Routes
Add header: `Authorization: Bearer <token>`

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy 'out' folder to Netlify/Vercel
```

### Backend
```bash
go build -o knitinfo-api cmd/server/main.go
./knitinfo-api
```

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend (.env)
```
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
JWT_SECRET=your-secret-key
PORT=8080
```

## 🎨 Categories Supported
- Yarn
- Fabric Suppliers
- Knitting
- Buying Agents
- Printing
- Threads
- Trims & Accessories
- Dyes & Chemicals
- Machineries
- Machine Spares

## 📱 PWA Setup

Add app icons to `public/` folder:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software for KnitInfo.

## 🔗 Links

- Frontend: https://github.com/Tcgtech06/Codes/tree/frontend
- Backend: https://github.com/Tcgtech06/Codes/tree/backend
- Powered by: [TCG Technologies](https://tcgtech.in)
