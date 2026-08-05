'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ShieldAlert, Eye, EyeOff, ArrowRight, Quote } from 'lucide-react';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'authority' || user?.role === 'admin') {
        router.push('/authority-dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'authority' || currentUser?.role === 'admin') {
        router.push('/authority-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      // Error handled by store
    }
  };

  const isDark = theme === 'dark' || theme === 'colorful';

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      
      {/* Left Column - Image & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy overflow-hidden">
        {theme === 'colorful' ? (
          <>
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" alt="Himalayas" className="absolute inset-0 w-full h-full object-cover object-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-navy/60 to-saffron/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"></div>
          </>
        ) : theme === 'dark' ? (
          <>
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" alt="Himalayas" className="absolute inset-0 w-full h-full object-cover object-center opacity-50 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-950/90"></div>
          </>
        ) : (
          <>
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" alt="Himalayas" className="absolute inset-0 w-full h-full object-cover object-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-navy/70 to-blue-900/80"></div>
          </>
        )}
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center gap-3 text-white group">
              <div className="transition-all group-hover:scale-105">
                <img src="/logo-dark.png" alt="Trinetra" className="h-14 w-auto object-contain drop-shadow-lg" />
              </div>
              <span className="text-3xl font-extrabold tracking-widest uppercase drop-shadow-md">Trinetra</span>
            </Link>
          </motion.div>
          
          <motion.div 
            className="max-w-lg space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1]">
              Your <span className="text-saffron">Secure</span> Travel Identity.
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md">
              Access the official tourist portal for verified movement, emergency response, and localized insights across sensitive regions.
            </p>
            
            <div className="pt-8 mt-8 border-t border-white/20">
              <Quote className="h-8 w-8 text-white/40 mb-4" />
              <p className="text-slate-300 text-sm font-medium italic">
                "Ensuring the safety of our visitors while preserving the sanctity of our borders. TRINETRA is the definitive gateway to the Himalayas."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-saffron/20 border border-saffron/40 flex items-center justify-center">
                  <ShieldAlert className="h-4 w-4 text-saffron" />
                </div>
                <div className="text-xs">
                  <p className="text-white font-bold tracking-wider uppercase">Border Security Command</p>
                  <p className="text-slate-400">Official Directive</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className={`inline-flex items-center gap-2 ${isDark ? 'text-white' : 'text-navy'}`}>
            <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="Trinetra" className="h-8 w-auto object-contain" />
            <span className="text-xl font-extrabold tracking-widest uppercase">Trinetra</span>
          </Link>
        </div>

        <motion.div 
          className="w-full max-w-md mt-12 lg:mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="space-y-3 mb-10">
            <h2 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Welcome back</h2>
            <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enter your credentials to access your secure portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center text-sm border border-red-500/20 shadow-sm"
              >
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
            
            <div className="space-y-2.5">
              <Label htmlFor="email" className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-12 rounded-xl border-2 transition-all duration-300 font-medium ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:border-blue-500 focus-visible:ring-0 focus-visible:bg-slate-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-navy focus-visible:ring-0 focus-visible:bg-white'
                }`}
              />
            </div>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</Label>
                <Link href="#" className={`text-xs font-bold tracking-wide transition-colors ${
                  theme === 'colorful' ? 'text-saffron hover:text-orange-400' : 
                  (theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-navy hover:text-blue-800')
                }`}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`h-12 rounded-xl border-2 pr-12 transition-all duration-300 font-medium ${
                    isDark 
                      ? 'bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:border-blue-500 focus-visible:ring-0 focus-visible:bg-slate-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-navy focus-visible:ring-0 focus-visible:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300 group-focus-within:text-blue-500' : 'text-slate-400 hover:text-slate-600 group-focus-within:text-navy'}`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className={`w-full h-14 rounded-xl text-base font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none group relative overflow-hidden ${
                  theme === 'colorful' ? 'bg-saffron hover:bg-orange-600 text-white shadow-[0_8px_20px_-8px_rgba(245,158,11,0.6)]' : 
                  (theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.6)]' : 'bg-navy hover:bg-slate-800 text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.6)]')
                }`} 
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    Sign In Securely
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </Button>
            </div>
          </form>
          
          <div className="pt-10 text-center">
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Don't have an official account?{' '}
              <Link href="/register" className={`font-bold tracking-wide hover:underline transition-colors ${
                theme === 'colorful' ? 'text-saffron hover:text-orange-400' : 
                (theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-navy hover:text-blue-800')
              }`}>
                Register now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
