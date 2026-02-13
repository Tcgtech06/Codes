# KnitInfo Frontend - Next.js Application

This is the frontend application for KnitInfo, built with Next.js 16, React 19, and Tailwind CSS.

## Features

- Mobile-first responsive design
- Bottom navigation for mobile devices
- Admin dashboard for data management
- Excel file upload and parsing
- Category-based company listings
- Book catalog with purchase options
- Visitor statistics tracking
- PWA support

## Tech Stack

- **Framework**: Next.js 16.1.6 with Turbopack
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Excel Processing**: xlsx
- **TypeScript**: 5.x

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build static export
npm run build
```

This creates an `out` folder with static files ready for deployment.

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── about/        # About page
│   ├── add-data/     # Data submission form
│   ├── admin/        # Admin dashboard
│   ├── advertise/    # Advertising page
│   ├── books/        # Book catalog
│   ├── catalogue/    # Company listings by category
│   ├── collaborate/  # Collaboration page
│   ├── contact/      # Contact page
│   └── page.tsx      # Home page
├── components/       # Reusable components
│   ├── BottomNav.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── SplashScreen.tsx
│   └── StatCard.tsx
├── data/            # Static data
│   └── books.ts
├── hooks/           # Custom React hooks
│   ├── useLocalStorage.ts
│   └── useVisitorStats.ts
└── lib/             # Utility functions
    ├── api.ts       # API client
    └── localStorage.ts
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
ADMIN_PASSWORD=your_admin_password
```

## Deployment

### Netlify (Recommended)

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel

1. Connect your GitHub repository
2. Vercel will auto-detect Next.js
3. Set environment variables
4. Deploy

## Features

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Bottom navigation bar for easy mobile access
- Touch-friendly UI elements

### Admin Dashboard
- Secure login with password protection
- Excel file upload and parsing
- Company data management
- Real-time statistics

### Category Listings
- Browse companies by category
- Search functionality
- Detailed company information
- Contact details and products

### Book Catalog
- Physical book listings
- Purchase via WhatsApp
- Detailed book information

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production (static export)
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - All rights reserved

## Contact

For support or inquiries, contact via WhatsApp: +91 9943632229

---

**Powered by TCG Technologies**
