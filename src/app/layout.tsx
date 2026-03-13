'use client';

import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import { LayoutComponents } from "@/components/LayoutComponents";
import ConditionalSpacer from "@/components/ConditionalSpacer";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('splashShown');
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  return (
    <html lang="en">
      <head>
        <title>Knit Info - India's Leading Textile Industry Directory & Platform</title>
        <meta name="description" content="Knit Info is India's most comprehensive textile industry directory connecting manufacturers, suppliers, buyers, and service providers. Find yarn suppliers, fabric manufacturers, knitting companies, printing services, dyes & chemicals, machineries, and more." />
        <meta name="keywords" content="knit info, knitinfo, textile directory, textile industry, yarn suppliers, fabric manufacturers, knitting companies, textile machinery, dyes chemicals, printing services, buying agents, textile business, garment industry, hosiery manufacturers, textile sourcing, India textile directory, textile suppliers directory, knitwear industry, textile trade, fabric suppliers, textile equipment, textile raw materials" />
        <meta name="author" content="Knit Info" />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta name="googlebot" content="index,follow" />
        <meta name="bingbot" content="index,follow" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Knit Info - India's Leading Textile Industry Directory & Platform" />
        <meta property="og:description" content="Knit Info is India's most comprehensive textile industry directory connecting manufacturers, suppliers, buyers, and service providers. Find yarn suppliers, fabric manufacturers, knitting companies, printing services, dyes & chemicals, machineries, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://knitinfo.netlify.app" />
        <meta property="og:image" content="https://knitinfo.netlify.app/logo.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Knit Info" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Knit Info - India's Leading Textile Industry Directory & Platform" />
        <meta name="twitter:description" content="Knit Info is India's most comprehensive textile industry directory connecting manufacturers, suppliers, buyers, and service providers." />
        <meta name="twitter:image" content="https://knitinfo.netlify.app/logo.jpg" />
        
        {/* Geo Meta Tags */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="geo.placename" content="Tirupur, Tamil Nadu, India" />
        <meta name="ICBM" content="11.1085, 77.3411" />
        
        {/* Business Meta Tags */}
        <meta name="classification" content="Business Directory" />
        <meta name="category" content="Textile Industry" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        
        {/* Language and Region */}
        <meta httpEquiv="content-language" content="en-IN" />
        <link rel="alternate" hrefLang="en-in" href="https://knitinfo.netlify.app" />
        <link rel="alternate" hrefLang="en" href="https://knitinfo.netlify.app" />
        <link rel="alternate" hrefLang="x-default" href="https://knitinfo.netlify.app" />
        
        <link rel="canonical" href="https://knitinfo.netlify.app" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.jpg" />
        <link rel="shortcut icon" href="/logo.jpg" />
        <script src="/register-sw.js" defer></script>
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Knit Info",
              "alternateName": ["KnitInfo", "Knit Info Directory"],
              "url": "https://knitinfo.netlify.app",
              "logo": "https://knitinfo.netlify.app/logo.jpg",
              "description": "India's most comprehensive textile industry directory connecting manufacturers, suppliers, buyers, and service providers.",
              "foundingDate": "2007",
              "founders": [
                {
                  "@type": "Person",
                  "name": "N. Mohanraj"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Winner Traders, 51, RPS Complex, KSC School Road, Near Shri Paper Mart, Dharapuram Road",
                "addressLocality": "Tirupur",
                "addressRegion": "Tamil Nadu",
                "postalCode": "641604",
                "addressCountry": "IN"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-9943632229",
                  "contactType": "customer service",
                  "availableLanguage": ["English", "Tamil", "Hindi"]
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-9843232229",
                  "contactType": "customer service",
                  "availableLanguage": ["English", "Tamil", "Hindi"]
                }
              ],
              "email": "knitinfo.in@gmail.com",
              "sameAs": [
                "https://knitinfo.netlify.app"
              ],
              "industry": "Textile Industry Directory",
              "numberOfEmployees": "10-50",
              "areaServed": {
                "@type": "Country",
                "name": "India"
              }
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Knit Info",
              "alternateName": "KnitInfo Directory",
              "url": "https://knitinfo.netlify.app",
              "description": "India's most comprehensive textile industry directory connecting manufacturers, suppliers, buyers, and service providers.",
              "publisher": {
                "@type": "Organization",
                "name": "Knit Info"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://knitinfo.netlify.app/catalogue?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 overflow-x-hidden`}
      >
        <AuthProvider>
          {false && isMobile && showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          
          <LayoutComponents />
          <Navbar />
          <div className="hidden md:block h-16"></div>
          <ConditionalSpacer />
          <main className="flex-grow pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
