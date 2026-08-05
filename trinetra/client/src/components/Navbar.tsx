'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { MapPin, ShieldAlert, LogOut, LayoutDashboard, Search, Menu, X, Shield, Moon, Sun, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Is this a dashboard/app view where colorful mode shouldn't be allowed?
  const isAppView = pathname.includes('dashboard') || pathname.includes('map') || pathname.includes('track');

  useEffect(() => {
    // If we're on a dashboard and theme is colorful, force it to light
    if (isAppView && theme === 'colorful') {
      setTheme('light');
    }
  }, [pathname, isAppView, theme, setTheme]);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/'; 
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Guidelines', href: '/guidelines' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${
        scrolled 
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800' 
          : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="group-hover:scale-105 transition-transform">
              <img 
                src={theme === 'dark' || theme === 'colorful' ? '/logo-dark.png' : '/logo-light.png'} 
                alt="Trinetra Logo" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy dark:text-white tracking-tight">
                TRINETRA
              </h1>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                In Partnership with Ministry of Tourism
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  pathname === link.href 
                    ? 'bg-saffron/10 text-saffron dark:bg-saffron/20 dark:text-saffron' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isMounted && (
              <>
                {/* Theme Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 mr-2">
                  {!isAppView && (
                    <button onClick={() => setTheme('colorful')} className={`p-1.5 rounded-full transition-all ${theme === 'colorful' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`} title="Colorful Mode">
                      <Palette className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => setTheme('light')} className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`} title="Light Mode">
                    <Sun className="h-4 w-4" />
                  </button>
                  <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`} title="Dark Mode">
                    <Moon className="h-4 w-4" />
                  </button>
                </div>

                {!isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button variant="ghost" className="font-semibold text-slate-600 dark:text-slate-300 hover:text-navy dark:hover:text-white rounded-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-saffron hover:bg-orange-600 text-white rounded-full font-bold shadow-md shadow-orange-200/50 dark:shadow-none border-none">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {user?.role === 'tourist' ? (
                      <>
                        <Link href="/dashboard">
                          <Button variant="ghost" size="sm" className="rounded-full text-slate-700 dark:text-slate-300 hover:bg-saffron/10 hover:text-saffron font-semibold">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/track">
                          <Button variant="ghost" size="sm" className="rounded-full text-slate-700 dark:text-slate-300 hover:bg-saffron/10 hover:text-saffron font-semibold">
                            <MapPin className="mr-2 h-4 w-4" />
                            Live Map
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/authority-dashboard">
                          <Button variant="ghost" size="sm" className="rounded-full text-slate-700 dark:text-slate-300 hover:bg-saffron/10 hover:text-saffron font-semibold">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Authority Panel
                          </Button>
                        </Link>
                        <Link href="/authority-map">
                          <Button variant="ghost" size="sm" className="rounded-full text-slate-700 dark:text-slate-300 hover:bg-saffron/10 hover:text-saffron font-semibold">
                            <MapPin className="mr-2 h-4 w-4" />
                            Command Map
                          </Button>
                        </Link>
                      </>
                    )}
                    
                    <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20 ml-2">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-navy rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 mt-3 absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`block px-3 py-3 rounded-xl text-base font-medium ${
                    pathname === link.href ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                    {link.name}
                  </div>
                </Link>
              ))}
              
              <div className="border-t border-gray-100 pt-4 mt-2">
                {isMounted && (
                  !isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl justify-center">Sign In</Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full rounded-xl bg-gradient-to-r from-saffron to-indigo-600 text-white justify-center">Get Started</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href={user?.role === 'tourist' ? '/dashboard' : '/authority-dashboard'} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl justify-start">
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Button>
                      </Link>
                      <Link href={user?.role === 'tourist' ? '/track' : '/authority-map'} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl justify-start">
                          <MapPin className="mr-2 h-4 w-4" /> Live Map
                        </Button>
                      </Link>
                      <Button variant="destructive" onClick={handleLogout} className="w-full rounded-xl justify-start">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
