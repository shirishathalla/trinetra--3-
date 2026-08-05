'use client';

import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Navigation, Activity } from 'lucide-react';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';

export default function AboutPage() {
  const { theme } = useThemeStore();
  return (
    <div className={`relative flex-1 pt-32 pb-24 min-h-screen overflow-hidden ${
      theme === 'colorful' ? 'bg-navy' : (theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50')
    }`}>
      {theme === 'colorful' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-saffron/10 blur-[120px]"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        </div>
      )}
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider mb-6 ${
            theme === 'colorful' ? 'bg-white/10 border-white/20 text-saffron' : 
            (theme === 'dark' ? 'bg-blue-900/30 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-100 text-navy')
          }`}>
            <Shield className="h-4 w-4" />
            Partnership Initiative
          </div>
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-6 ${
            theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-navy'
          }`}>
            Securing the Journey of Every Traveler
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
            theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')
          }`}>
            TRINETRA is a modern, private-public partnership with the Ministry of Tourism, Government of India, designed to provide absolute security, real-time tracking, and immediate emergency response for both global and domestic tourists.
          </p>
        </motion.div>

        {/* Core Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`p-8 rounded-3xl shadow-xl border ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white border-slate-100 shadow-navy/5')
            }`}
          >
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
              theme === 'colorful' ? 'bg-blue-500/20 text-blue-400' : 
              (theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-blue-50 text-navy')
            }`}>
              <Navigation className="h-7 w-7" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Live Fleet Tracking</h3>
            <p className={`leading-relaxed ${theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>
              State-of-the-art GPS telemetry ensures that authorities have a real-time visualization of tourist movements in high-risk zones, guaranteeing a swift response when needed.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`p-8 rounded-3xl shadow-xl border ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white border-slate-100 shadow-navy/5')
            }`}
          >
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
              theme === 'colorful' ? 'bg-red-500/20 text-red-400' : 
              (theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-red-50 text-red-600')
            }`}>
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Emergency SOS</h3>
            <p className={`leading-relaxed ${theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>
              A single tap instantly dispatches distress signals to the Central Command Center, complete with exact coordinates, battery telemetry, and vital medical profiles.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`p-8 rounded-3xl shadow-xl border ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white border-slate-100 shadow-navy/5')
            }`}
          >
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
              theme === 'colorful' ? 'bg-green-500/20 text-green-400' : 
              (theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-green-50 text-green-600')
            }`}>
              <Activity className="h-7 w-7" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Digital Identity</h3>
            <p className={`leading-relaxed ${theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}`}>
              Every registered tourist receives a unique, scannable QR identity card linking critical health data, ensuring first responders have all necessary information upon arrival.
            </p>
          </motion.div>
        </div>

        {/* Ministry Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl border ${
            theme === 'colorful' ? 'bg-gradient-to-br from-navy to-blue-900 border-white/10' : 
            (theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-navy border-transparent')
          }`}
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Shield className="w-64 h-64" />
          </div>
          <h2 className="text-3xl font-bold mb-6">A Ministry of Tourism Partnership</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            By bridging cutting-edge private sector technology with official government infrastructure, TRINETRA establishes a new global standard for tourism security.
          </p>
          <Link href="/register" className={`inline-block font-bold py-4 px-8 rounded-xl shadow-lg transition-all hover:scale-105 ${
            theme === 'colorful' ? 'bg-saffron hover:bg-orange-600 text-white' : 
            (theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-saffron hover:bg-orange-600 text-white')
          }`}>
            Register as a Tourist
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
