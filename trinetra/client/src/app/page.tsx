'use client';

import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, Navigation, Activity, ShieldAlert, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "tween", duration: 0.5, ease: "easeOut" } }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-hidden pt-16 ${
      theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. IMMERSIVE HERO SECTION (Like Before) */}
      <section className={`relative w-full min-h-[85vh] flex items-center overflow-hidden ${
        theme === 'colorful' ? 'bg-navy' : (theme === 'dark' ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-slate-200')
      }`}>
        {/* Background Image (Always visible, overlay changes based on theme) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" 
            alt="India Tourism Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className={`absolute inset-0 ${
            theme === 'colorful' ? 'bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40' : 
            (theme === 'dark' ? 'bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40' : 
            'bg-gradient-to-r from-white/95 via-white/80 to-white/40')
          }`}></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative h-full flex flex-col lg:flex-row items-center gap-12">
          
          {/* Hero Copy */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 max-w-2xl">
            <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider ${
              theme === 'colorful' ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700')
            }`}>
              <ShieldCheck className={`h-4 w-4 ${theme === 'colorful' ? 'text-saffron' : 'text-navy dark:text-blue-400'}`} />
              Ministry of Tourism Partnership
            </motion.div>
            
            <motion.h1 variants={itemVariants} className={`text-5xl md:text-7xl font-extrabold tracking-tight leading-tight ${
              theme === 'colorful' ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>
              Secure Your <br/>
              <span className={
                theme === 'colorful' ? 'text-transparent bg-clip-text bg-gradient-to-r from-saffron to-orange-400' : 
                (theme === 'dark' ? 'text-blue-400' : 'text-navy')
              }>
                Journey in India.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className={`text-xl leading-relaxed font-medium ${
              theme === 'colorful' ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'
            }`}>
              The world's most advanced digital identity and emergency tracking system, designed to give global and domestic tourists absolute peace of mind.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <Link href="/register">
                <Button className={`h-14 px-8 rounded-full text-white text-lg font-bold transition-all hover:scale-105 border-none ${
                  theme === 'colorful' ? 'bg-saffron hover:bg-orange-600 shadow-xl shadow-saffron/20' : 
                  (theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-navy hover:bg-slate-800')
                }`}>
                  Register as Tourist <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className={`h-14 px-8 rounded-full text-lg font-bold transition-all ${
                  theme === 'colorful' ? 'bg-white/5 hover:bg-white/10 text-white border-white/20 backdrop-blur-md' : 
                  (theme === 'dark' ? 'bg-transparent text-white border-slate-600 hover:bg-slate-800' : 'bg-white text-navy border-slate-300 hover:bg-slate-50')
                }`}>
                  Authority Dispatch
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating UI Elements (For Colorful Mode) */}
          {theme === 'colorful' && (
            <div className="hidden lg:block relative h-[500px] w-full flex-1">
              <motion.div initial={{ opacity: 0, y: 50, rotate: -5 }} animate={{ opacity: 1, y: 0, rotate: -5 }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-10 right-20 w-72 bg-white rounded-3xl shadow-2xl p-6 z-10 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center"><ShieldAlert className="h-5 w-5" /></div>
                  <div><p className="text-xs font-bold text-slate-400 uppercase">Emergency Protocol</p><p className="text-sm font-extrabold text-navy">SOS Activated</p></div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-red-500"></motion.div></div>
                  <p className="text-xs font-bold text-slate-400 text-right">Dispatching Units...</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 50, rotate: 5 }} animate={{ opacity: 1, y: 0, rotate: 5 }} transition={{ duration: 1, delay: 0.4 }} className="absolute bottom-20 right-0 w-80 bg-navy/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 z-20 border border-white/10">
                <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-green-400 animate-pulse" /><p className="text-xs font-bold text-white uppercase tracking-wider">Live Telemetry</p></div><span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full">SECURE</span></div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10"><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Tourist ID</p><p className="text-lg font-mono font-bold text-white tracking-widest mb-2">IND-8842-X</p><div className="flex justify-between items-center border-t border-white/10 pt-2"><p className="text-xs text-slate-300 font-semibold"><MapPin className="inline h-3 w-3 mr-1"/> Delhi, IN</p><p className="text-xs text-saffron font-bold">12:44:03 IST</p></div></div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* 2. THE NEW ENTERPRISE DASHBOARD PREVIEW SECTION (Split Layout) */}
      <section className={`w-full border-b py-24 ${
        theme === 'colorful' ? 'bg-navy border-white/10' : 
        (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')
      }`}>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-5/12 text-left space-y-6">
            <div>
              <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 border-b-2 pb-2 inline-block border-current ${theme === 'colorful' ? 'text-saffron' : 'text-slate-500'}`}>System Overview</h2>
              <h3 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Command-Level Visibility.
              </h3>
            </div>
            
            <p className={`text-lg leading-relaxed ${theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>
              Equip your rapid response units with a centralized telemetry dashboard. Monitor active transits in real-time and dispatch emergency services with unprecedented speed and accuracy.
            </p>

            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-3">
                <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${theme === 'colorful' ? 'bg-blue-500/20 text-blue-400' : (theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600')}`}><MapPin className="h-3 w-3" /></div>
                <p className={`font-medium ${theme === 'colorful' ? 'text-slate-200' : (theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}`}>Real-time coordinate mapping for active SOS alerts.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${theme === 'colorful' ? 'bg-green-500/20 text-green-400' : (theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600')}`}><Activity className="h-3 w-3" /></div>
                <p className={`font-medium ${theme === 'colorful' ? 'text-slate-200' : (theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}`}>Live system telemetry and automated threat detection.</p>
              </li>
            </ul>
          </div>
          
          <div className="w-full lg:w-7/12">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`w-full rounded-lg shadow-2xl border overflow-hidden ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-xl' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-slate-50 border-slate-200 shadow-slate-200/50')
            }`}>
              <div className={`px-4 py-3 flex items-center gap-2 border-b ${
                theme === 'colorful' ? 'bg-white/5 border-white/10' : 
                (theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300')
              }`}>
                <div className="h-3 w-3 rounded-full bg-red-400"></div><div className="h-3 w-3 rounded-full bg-yellow-400"></div><div className="h-3 w-3 rounded-full bg-green-400"></div>
                <span className="ml-4 text-xs font-mono text-slate-500">trinetra.gov.in / command-center</span>
              </div>
              <div className="p-6 md:p-8 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Monitored Zone</h4>
                    <p className={`text-xl md:text-2xl font-extrabold ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-navy'}`}>National Capital Region</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-sm border border-green-200 shrink-0">
                    <Activity className="h-4 w-4 text-green-700 animate-pulse" />
                    <span className="text-xs font-bold text-green-800 uppercase tracking-wider hidden sm:inline">System Online</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex items-center justify-between p-4 border rounded-sm ${
                      theme === 'colorful' ? 'bg-white/5 border-white/10' : 
                      (theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200')
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-sm flex items-center justify-center shrink-0 ${theme === 'colorful' || theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}><MapPin className="h-5 w-5 text-slate-500" /></div>
                        <div>
                          <p className={`text-base font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>IND-8842-X{i}</p>
                          <p className="text-sm text-slate-500 font-mono">28.6139° N, 77.2090° E</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-500">SECURE</p>
                        <p className="text-xs text-slate-400">Sync: 1s ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. TRUSTED BY BANNER */}
      <section className={`w-full py-10 border-b ${
        theme === 'colorful' ? 'bg-navy border-white/10 relative z-10' : 
        (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200')
      }`}>
        {/* Glow for Colorful */}
        {theme === 'colorful' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-full bg-blue-900/30 blur-[100px] pointer-events-none z-0"></div>}
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Integrated With Official Frameworks</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-80 hover:opacity-100 transition-opacity">
            <div className={`flex items-center gap-2 font-bold text-lg ${theme === 'colorful' || theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}><Globe className="h-5 w-5"/> Ministry of Tourism</div>
            <div className={`flex items-center gap-2 font-bold text-lg ${theme === 'colorful' || theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}><ShieldCheck className="h-5 w-5"/> National Informatics Centre</div>
            <div className={`flex items-center gap-2 font-bold text-lg ${theme === 'colorful' || theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}><Activity className="h-5 w-5"/> Digital India</div>
          </div>
        </div>
      </section>

      {/* 4. SOLID METRICS SECTION */}
      <section className={`py-20 border-b relative ${
        theme === 'colorful' ? 'bg-navy border-white/10' : 
        (theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
      }`}>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className={`grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x ${theme === 'colorful' ? 'divide-white/10' : (theme === 'dark' ? 'divide-slate-700' : 'divide-slate-200')}`}>
            <motion.div variants={itemVariants} className="text-center py-4">
              <h2 className={`text-4xl md:text-5xl font-extrabold mb-2 ${theme === 'colorful' ? 'text-white' : (theme === 'dark' ? 'text-white' : 'text-navy')}`}>10M+</h2>
              <p className={`font-bold uppercase tracking-widest text-xs ${theme === 'colorful' ? 'text-saffron' : 'text-slate-500'}`}>Registered Profiles</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center py-4">
              <h2 className={`text-4xl md:text-5xl font-extrabold mb-2 ${theme === 'colorful' ? 'text-white' : (theme === 'dark' ? 'text-white' : 'text-navy')}`}>&lt;2m</h2>
              <p className={`font-bold uppercase tracking-widest text-xs ${theme === 'colorful' ? 'text-saffron' : 'text-slate-500'}`}>Average Response Time</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center py-4">
              <h2 className={`text-4xl md:text-5xl font-extrabold mb-2 ${theme === 'colorful' ? 'text-white' : (theme === 'dark' ? 'text-white' : 'text-navy')}`}>100%</h2>
              <p className={`font-bold uppercase tracking-widest text-xs ${theme === 'colorful' ? 'text-saffron' : 'text-slate-500'}`}>Uptime Guarantee</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. CORE CAPABILITIES (Clean Grid) */}
      <section className={`py-24 border-b relative ${
        theme === 'colorful' ? 'bg-navy border-white/10' : 
        (theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200')
      }`}>
        {/* Glow for Colorful */}
        {theme === 'colorful' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>}
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="mb-16">
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-3 border-b-2 pb-2 inline-block ${theme === 'colorful' ? 'text-saffron border-saffron' : (theme === 'dark' ? 'text-blue-400 border-blue-400' : 'text-navy border-navy')}`}>Core Capabilities</h2>
            <h3 className={`text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl mt-4 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Enterprise-grade tracking and response infrastructure.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-8 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
            }`}>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-6 border ${
                theme === 'colorful' ? 'bg-blue-500/20 border-transparent text-blue-400' : 
                (theme === 'dark' ? 'bg-slate-700 border-slate-600 text-blue-400' : 'bg-slate-100 border-slate-200 text-navy')
              }`}><Navigation className="h-6 w-6"/></div>
              <h4 className={`text-xl font-bold mb-3 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Live Telemetry</h4>
              <p className={`text-sm leading-relaxed ${theme === 'colorful' ? 'text-slate-300' : 'text-slate-500'}`}>Continuous, encrypted GPS tracking ensures Central Command has precise coordinates during active transits.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className={`p-8 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
            }`}>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-6 border ${
                theme === 'colorful' ? 'bg-red-500/20 border-transparent text-red-400' : 
                (theme === 'dark' ? 'bg-slate-700 border-slate-600 text-blue-400' : 'bg-slate-100 border-slate-200 text-navy')
              }`}><ShieldAlert className="h-6 w-6"/></div>
              <h4 className={`text-xl font-bold mb-3 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Priority SOS</h4>
              <p className={`text-sm leading-relaxed ${theme === 'colorful' ? 'text-slate-300' : 'text-slate-500'}`}>A dedicated distress protocol that bypasses standard queues to alert local law enforcement instantly.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className={`p-8 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 hover:-translate-y-2' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')
            }`}>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-6 border ${
                theme === 'colorful' ? 'bg-green-500/20 border-transparent text-green-400' : 
                (theme === 'dark' ? 'bg-slate-700 border-slate-600 text-blue-400' : 'bg-slate-100 border-slate-200 text-navy')
              }`}><Activity className="h-6 w-6"/></div>
              <h4 className={`text-xl font-bold mb-3 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Digital Identity</h4>
              <p className={`text-sm leading-relaxed ${theme === 'colorful' ? 'text-slate-300' : 'text-slate-500'}`}>A centralized, scannable QR profile containing verified emergency contacts and critical medical data.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. STRUCTURED CTA */}
      <section className={`py-24 ${theme === 'colorful' ? 'bg-navy' : (theme === 'dark' ? 'bg-slate-900' : 'bg-white')}`}>
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl mx-auto rounded-2xl p-12 text-center shadow-2xl border relative overflow-hidden ${
            theme === 'colorful' ? 'bg-gradient-to-br from-navy to-blue-900 border-blue-800' : 
            (theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-800 border-slate-700')
          }`}>
            
            {theme === 'colorful' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-saffron/10 rounded-full blur-[100px] pointer-events-none"></div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Deploy TRINETRA Today.</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto font-medium">Join millions of authenticated profiles relying on standard-issue safety infrastructure. Configuration takes under two minutes.</p>
              <Link href="/register">
                <Button className={`h-14 px-8 rounded-xl text-lg font-bold shadow-lg transition-all border-none ${
                  theme === 'colorful' ? 'bg-saffron hover:bg-orange-600 text-white shadow-saffron/20' : 
                  'bg-white hover:bg-slate-100 text-navy'
                }`}>
                  Create Tourist Profile <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
