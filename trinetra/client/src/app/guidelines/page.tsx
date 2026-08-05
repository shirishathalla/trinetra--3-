'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, PhoneCall, Info } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export default function GuidelinesPage() {
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
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-6 ${
            theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-navy'
          }`}>
            Official Safety Guidelines
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')
          }`}>
            Essential protocols and recommendations for all tourists traveling in India, issued in partnership with the Ministry of Tourism.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Section 1: Do's */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-3xl shadow-xl border-l-[6px] border-green-500 ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 
              (theme === 'dark' ? 'bg-slate-800 border-y-slate-700 border-r-slate-700 shadow-black/50' : 'bg-white border-y-slate-100 border-r-slate-100 shadow-navy/5')
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                theme === 'colorful' ? 'bg-green-500/20' : (theme === 'dark' ? 'bg-slate-700' : 'bg-green-100')
              }`}>
                <ShieldCheck className="h-6 w-6 text-green-500" />
              </div>
              <h2 className={`text-2xl font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recommended Practices (Do's)</h2>
            </div>
            <ul className={`space-y-4 list-disc pl-6 marker:text-green-500 ${
              theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')
            }`}>
              <li><strong>Register on TRINETRA:</strong> Ensure your profile is complete with accurate emergency contacts and medical details before starting your journey.</li>
              <li><strong>Enable Location Services:</strong> Keep GPS and mobile data enabled while traveling in remote or high-risk zones to allow Live Fleet Tracking.</li>
              <li><strong>Use Registered Transport:</strong> Only use official tourist transport or government-approved cab aggregators.</li>
              <li><strong>Keep Digital IDs Ready:</strong> Save your TRINETRA QR identity card on your mobile device for quick verification by local authorities.</li>
            </ul>
          </motion.div>

          {/* Section 2: Don'ts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-3xl shadow-xl border-l-[6px] border-red-500 ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 
              (theme === 'dark' ? 'bg-slate-800 border-y-slate-700 border-r-slate-700 shadow-black/50' : 'bg-white border-y-slate-100 border-r-slate-100 shadow-navy/5')
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                theme === 'colorful' ? 'bg-red-500/20' : (theme === 'dark' ? 'bg-slate-700' : 'bg-red-100')
              }`}>
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className={`text-2xl font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Restricted Actions (Don'ts)</h2>
            </div>
            <ul className={`space-y-4 list-disc pl-6 marker:text-red-500 ${
              theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')
            }`}>
              <li><strong>Avoid Unverified Guides:</strong> Do not engage with unverified individuals offering unsolicited tour services.</li>
              <li><strong>Don't Disable Tracking in Transit:</strong> Do not turn off your TRINETRA tracking module while moving between cities.</li>
              <li><strong>Avoid Isolated Areas at Night:</strong> Stick to well-lit, populated tourist corridors during late hours.</li>
              <li><strong>Do not share OTPs:</strong> Never share TRINETRA verification OTPs or passwords with anyone. Authorities will never ask for them.</li>
            </ul>
          </motion.div>

          {/* Section 3: Emergency Protocol */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-8 rounded-3xl shadow-xl border text-white ${
              theme === 'colorful' ? 'bg-gradient-to-br from-navy to-blue-900 border-white/10' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-navy border-blue-900')
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <PhoneCall className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">SOS Emergency Protocol</h2>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl mb-6 border border-white/5">
              <p className="font-semibold mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-saffron" /> How to trigger an SOS:</p>
              <ol className="list-decimal pl-6 space-y-2 text-slate-300">
                <li>Open the TRINETRA mobile app or dashboard.</li>
                <li>Tap the red <strong className="text-red-400">"EMERGENCY SOS"</strong> button.</li>
                <li>Confirm the alert prompt.</li>
                <li>Your exact coordinates, medical profile, and battery status will instantly be sent to the nearest Central Command Center.</li>
              </ol>
            </div>
            <p className={`text-sm italic ${theme === 'colorful' ? 'text-slate-400' : (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>
              * Note: Misuse of the SOS feature is a punishable offense. Use only in genuine emergencies.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
