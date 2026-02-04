# KnitInfo - Textile Industry Directory

A mobile-first web application for the knitwear industry, built with Next.js and Turbopack.

## Features

- 🚀 **Turbopack** - Lightning-fast development with Next.js Turbopack
- 📱 **Mobile-First Design** - Bottom navigation bar optimized for mobile devices
- 💻 **Responsive** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS
- 📦 **PWA Ready** - Can be installed as a native app on mobile devices

## Getting Started

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the static export:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Mobile App Features

### Bottom Navigation
On mobile devices (screens smaller than 768px), the navigation automatically switches to a bottom navigation bar with:
- Home
- Catalogue
- About
- Contact

### PWA Installation
Users can install the app on their mobile devices:
1. Open the site in a mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"

## Project Structure

```
src/
├── app/
│   ├── about/          # About page
│   ├── catalogue/      # Catalogue page
│   ├── contact/        # Contact page
│   ├── layout.tsx      # Root layout with navigation
│   └── page.tsx        # Home page
├── components/
│   ├── BottomNav.tsx   # Mobile bottom navigation
│   ├── Navbar.tsx      # Desktop top navigation
│   └── Footer.tsx      # Footer (desktop only)
```

## Technologies

- Next.js 16.1.2
- React 19.2.3
- Tailwind CSS 4
- TypeScript 5
- Turbopack (Next.js bundler)
- Lucide React (icons)
- Framer Motion (animations)

## PWA Setup

To complete the PWA setup, add app icons to the `public` folder:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

These icons will be used when users install the app on their devices.

## Notes

- The footer is hidden on mobile to avoid conflicts with the bottom navigation
- Desktop users see the traditional top navigation bar
- The app uses static export mode for easy deployment to Netlify or other static hosts
- Turbopack provides faster development builds and hot module replacement
