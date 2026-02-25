'use client';

import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
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
        <title>KnitInfo - Textile Industry Directory</title>
        <meta name="description" content="Comprehensive directory for the textile and knitting industry. Find suppliers, manufacturers, and services." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.jpg" />
        <link rel="shortcut icon" href="/logo.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <AuthProvider>
          {false && isMobile && showSplash && <SplashScreen onFinish={handleSplashFinish} />}
          
          <Navbar />
          <div className="hidden md:block h-16"></div>
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
