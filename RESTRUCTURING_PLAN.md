# KnitInfo Project Restructuring Plan

## Executive Summary

**Current State:** Split into `KnitInfo_Backend` and `KnitInfo_Frontend` folders  
**Target State:** Unified monorepo structure matching the reference repository (D:\Codes)  
**Goal:** Consolidate into a single, clean architecture with proper separation of concerns

---

## Structure Analysis

### Reference Repository Structure (D:\Codes - node branch)
```
D:\Codes/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/
│   │   ├── add-data/
│   │   ├── admin/
│   │   ├── advertise/
│   │   ├── api/                # API routes (backend logic)
│   │   │   ├── health/
│   │   │   ├── test-schema/
│   │   │   └── v1/
│   │   ├── books/
│   │   ├── catalogue/
│   │   ├── collaborate/
│   │   ├── contact/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # Reusable UI components
│   │   ├── BottomNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── SplashScreen.tsx
│   │   └── StatCard.tsx
│   ├── data/                   # Static data/constants
│   │   └── books.ts
│   ├── hooks/                  # Custom React hooks
│   │   ├── useLocalStorage.ts
│   │   └── useVisitorStats.ts
│   └── lib/                    # Utility functions & configs
│       ├── api.ts
│       ├── localStorage.ts
│       └── supabase.ts
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── logo.jpg
│   ├── manifest.json
│   └── ...
├── .env.example
├── .env.local.example
├── .gitignore
├── .nvmrc
├── .watchmanconfig
├── CHECK_DATABASE_SCHEMA.sql
├── check-products-data.js      # Utility scripts
├── check-website-data.js
├── check-yarn-websites.js
├── eslint.config.mjs
├── FIX_AND_RUN.bat
├── fix-products-db.js
├── netlify.toml
├── next.config.ts
├── package.json                # Single package.json
├── postcss.config.mjs
├── README.md
├── test-api.js
├── test-delete-replace.js
└── tsconfig.json
```

**Key Characteristics:**
- ✅ **Unified monorepo** - Single Next.js app with both frontend and backend
- ✅ **API routes in app/api/** - Backend logic colocated with frontend
- ✅ **Clean separation** - components/, hooks/, lib/, data/ folders
- ✅ **Single package.json** - One dependency tree
- ✅ **Utility scripts at root** - Database checks, test scripts
- ✅ **Environment examples** - .env.example files for documentation

---

### Current Project Structure (D:\Freelancing\KnitInfo)

```
D:\Freelancing\KnitInfo/
├── KnitInfo_Backend/           # ❌ Separate backend folder
│   ├── src/
│   │   ├── app/
│   │   │   ├── about/
│   │   │   ├── add-data/
│   │   │   ├── admin/
│   │   │   ├── advertise/
│   │   │   ├── api/            # Backend API routes
│   │   │   ├── books/
│   │   │   ├── catalogue/
│   │   │   ├── collaborate/
│   │   │   ├── contact/
│   │   │   ├── logout/
│   │   │   ├── sign-in/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   └── lib/
│   │       ├── api.ts
│   │       ├── googleOAuth.ts  # ✅ Additional OAuth logic
│   │       ├── localStorage.ts
│   │       ├── serverAuth.ts
│   │       ├── supabase.ts
│   │       ├── supabaseAuth.ts
│   │       └── userSession.ts
│   ├── database/               # ✅ Database migrations
│   │   └── migrations/
│   ├── public/
│   ├── .env
│   ├── .env.local
│   ├── package.json            # ❌ Duplicate package.json
│   ├── GOOGLE_OAUTH_SETUP.md   # ✅ Documentation
│   ├── SUPABASE_OAUTH_SETUP.md
│   └── ...
│
├── KnitInfo_Frontend/          # ❌ Separate frontend folder (mostly duplicate)
│   ├── src/
│   │   ├── app/                # ❌ Duplicate pages
│   │   ├── components/         # ❌ Duplicate components
│   │   ├── data/
│   │   ├── hooks/
│   │   └── lib/                # ⚠️ Subset of backend lib
│   ├── Images/                 # ❌ Duplicate images
│   ├── public/                 # ❌ Duplicate public assets
│   ├── package.json            # ❌ Duplicate package.json
│   └── ...
│
├── .gitignore
├── DATABASE_OPERATIONS_USER_STORIES.txt
├── Dyes & Chemicals.xlsx
└── package-lock.json
```

**Issues:**
- ❌ **Duplicate structure** - Frontend/Backend split is unnecessary for Next.js
- ❌ **Code duplication** - Components, pages, and assets duplicated
- ❌ **Two package.json files** - Dependency management complexity
- ❌ **Confusing architecture** - Next.js is full-stack by design
- ⚠️ **Backend has more features** - OAuth, auth logic, database migrations

---

## Restructuring Strategy

### Phase 1: Consolidate into Unified Structure

**Target Structure:**
```
D:\Freelancing\KnitInfo/
├── src/
│   ├── app/                    # All pages + API routes
│   │   ├── about/
│   │   ├── add-data/
│   │   ├── admin/
│   │   ├── advertise/
│   │   ├── api/                # Backend API routes
│   │   │   └── v1/
│   │   │       ├── auth/
│   │   │       │   ├── google/
│   │   │       │   │   ├── init/
│   │   │       │   │   └── callback/
│   │   │       │   └── ...
│   │   │       ├── products/
│   │   │       ├── websites/
│   │   │       └── ...
│   │   ├── books/
│   │   ├── catalogue/
│   │   ├── collaborate/
│   │   ├── contact/
│   │   ├── logout/
│   │   ├── sign-in/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # UI components
│   │   ├── BottomNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── SplashScreen.tsx
│   │   └── StatCard.tsx
│   ├── data/                   # Static data
│   │   └── books.ts
│   ├── hooks/                  # Custom hooks
│   │   ├── useLocalStorage.ts
│   │   └── useVisitorStats.ts
│   └── lib/                    # Utilities & configs
│       ├── api.ts
│       ├── googleOAuth.ts
│       ├── localStorage.ts
│       ├── serverAuth.ts
│       ├── supabase.ts
│       ├── supabaseAuth.ts
│       └── userSession.ts
├── database/                   # Database files
│   └── migrations/
│       └── 2026-02-22_create_form_submissions.sql
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── logo.jpg
│   ├── manifest.json
│   └── ...
├── docs/                       # Documentation (NEW)
│   ├── GOOGLE_OAUTH_SETUP.md
│   ├── SUPABASE_OAUTH_SETUP.md
│   ├── SUPABASE_OAUTH_COMPLETION.md
│   ├── DATABASE_OPERATIONS_USER_STORIES.txt
│   ├── DB_REQUIREMENTS.md
│   └── FRONTEND_API_INTEGRATION.md
├── scripts/                    # Utility scripts (NEW)
│   ├── check-products-data.js
│   ├── check-website-data.js
│   ├── check-yarn-websites.js
│   ├── fix-products-db.js
│   ├── test-api.js
│   └── test-delete-replace.js
├── .env.example
├── .env.local.example
├── .env.local                  # Local environment (gitignored)
├── .gitignore
├── .nvmrc
├── .watchmanconfig
├── CHECK_DATABASE_SCHEMA.sql
├── eslint.config.mjs
├── FIX_AND_RUN.bat
├── netlify.toml
├── next.config.ts
├── package.json                # Single unified package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── Dyes & Chemicals.xlsx
```

---

## Detailed Migration Steps

### Step 1: Backup Current State
```bash
# Create backup
xcopy "D:\Freelancing\KnitInfo" "D:\Freelancing\KnitInfo_BACKUP" /E /I /H /Y
```

### Step 2: Use Backend as Base (It has more features)
- Backend has Google OAuth implementation
- Backend has database migrations
- Backend has more complete lib/ folder
- Backend runs on port 8080

### Step 3: File Movements

#### A. Keep from Backend (Primary Source)
```
KnitInfo_Backend/src/          → src/
KnitInfo_Backend/database/     → database/
KnitInfo_Backend/public/       → public/
KnitInfo_Backend/package.json  → package.json (merge dependencies)
KnitInfo_Backend/.env.local    → .env.local
KnitInfo_Backend/.env          → .env.example
```

#### B. Create New Folders
```
docs/                          # Move all .md and .txt documentation
scripts/                       # Move all .js utility scripts
```

#### C. Move Documentation
```
KnitInfo_Backend/GOOGLE_OAUTH_SETUP.md              → docs/
KnitInfo_Backend/SUPABASE_OAUTH_SETUP.md            → docs/
KnitInfo_Backend/SUPABASE_OAUTH_COMPLETION.md       → docs/
KnitInfo_Frontend/DATABASE_OPERATIONS_USER_STORIES.txt → docs/
KnitInfo_Frontend/DB_REQUIREMENTS.md                → docs/
KnitInfo_Frontend/FRONTEND_API_INTEGRATION.md       → docs/
DATABASE_OPERATIONS_USER_STORIES.txt (root)        → docs/
```

#### D. Move Utility Scripts
```
KnitInfo_Backend/check-products-data.js      → scripts/
KnitInfo_Backend/check-website-data.js       → scripts/
KnitInfo_Backend/check-yarn-websites.js      → scripts/
KnitInfo_Backend/fix-products-db.js          → scripts/
KnitInfo_Backend/test-api.js                 → scripts/
KnitInfo_Backend/test-delete-replace.js      → scripts/
```

#### E. Move Root Config Files
```
KnitInfo_Backend/.gitignore           → .gitignore (merge with root)
KnitInfo_Backend/.nvmrc               → .nvmrc
KnitInfo_Backend/.watchmanconfig      → .watchmanconfig
KnitInfo_Backend/CHECK_DATABASE_SCHEMA.sql → CHECK_DATABASE_SCHEMA.sql
KnitInfo_Backend/eslint.config.mjs    → eslint.config.mjs
KnitInfo_Backend/FIX_AND_RUN.bat      → FIX_AND_RUN.bat
KnitInfo_Backend/netlify.toml         → netlify.toml
KnitInfo_Backend/next.config.ts       → next.config.ts
KnitInfo_Backend/postcss.config.mjs   → postcss.config.mjs
KnitInfo_Backend/tsconfig.json        → tsconfig.json
```

#### F. Delete Redundant Folders
```
KnitInfo_Frontend/                    # Delete entire folder (redundant)
KnitInfo_Backend/                     # Delete after migration
```

### Step 4: Update package.json

Merge both package.json files, keeping backend as base and adding any unique frontend dependencies:

```json
{
  "name": "knitinfo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "cross-env TURBOPACK=0 next dev -p 8080",
    "dev:turbo": "next dev --turbopack -p 8080",
    "build": "next build",
    "start": "next start -p 8080",
    "lint": "eslint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.3",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "express": "^4.18.2",
    "firebase": "^11.1.0",
    "framer-motion": "^12.26.2",
    "google-auth-library": "^10.5.0",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.562.0",
    "multer": "^1.4.5-lts.1",
    "next": "^16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "tailwind-merge": "^3.4.0",
    "uuid": "^9.0.1",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/uuid": "^9.0.7",
    "cross-env": "^10.1.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### Step 5: Update .gitignore

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/

# Backup
*_BACKUP/
```

### Step 6: Create Environment Templates

**.env.example:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NODE_ENV=development
```

### Step 7: Update Import Paths (if needed)

No import path changes needed since we're keeping the same `src/` structure.

### Step 8: Update Documentation References

Update all documentation files in `docs/` folder to reference the new structure:
- Change references from `KnitInfo_Backend/` to root `/`
- Update file paths in setup guides
- Update script execution paths

---

## Benefits of New Structure

### 1. **Simplified Architecture**
- Single Next.js app (as intended by framework design)
- No confusion between "frontend" and "backend"
- API routes naturally colocated with pages

### 2. **Reduced Duplication**
- One package.json → easier dependency management
- One set of components → single source of truth
- One public folder → no asset duplication

### 3. **Better Developer Experience**
- Single `npm install`
- Single `npm run dev`
- Clearer project navigation

### 4. **Improved Maintainability**
- Documentation organized in `docs/`
- Utility scripts organized in `scripts/`
- Clear separation of concerns within `src/`

### 5. **Matches Industry Standards**
- Follows Next.js best practices
- Matches reference repository pattern
- Easier onboarding for new developers

---

## Rollback Plan

If issues arise:
```bash
# Delete new structure
rmdir /s /q "D:\Freelancing\KnitInfo"

# Restore backup
xcopy "D:\Freelancing\KnitInfo_BACKUP" "D:\Freelancing\KnitInfo" /E /I /H /Y
```

---

## Post-Migration Checklist

- [ ] Run `npm install` in root
- [ ] Copy `.env.local` with actual credentials
- [ ] Test `npm run dev` - server starts on port 8080
- [ ] Test all pages load correctly
- [ ] Test API endpoints work
- [ ] Test Google OAuth flow
- [ ] Test database operations
- [ ] Update README.md with new structure
- [ ] Commit to git with clear message
- [ ] Delete backup folder after verification

---

## Estimated Time

- Backup: 2 minutes
- File movements: 10 minutes
- Configuration updates: 5 minutes
- Testing: 15 minutes
- **Total: ~30 minutes**

---

## Next Steps

1. Review this plan
2. Confirm approval to proceed
3. Execute migration
4. Test thoroughly
5. Update documentation
6. Clean up backups

