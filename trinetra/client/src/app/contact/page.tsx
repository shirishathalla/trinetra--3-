'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';

export default function ContactPage() {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: null as string | null, success: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setStatus({ loading: false, error: 'Please fill in all fields', success: false });
      return;
    }
    
    setStatus({ loading: true, error: null, success: false });
    try {
      await api.post('/support', formData);
      setStatus({ loading: false, error: null, success: true });
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
    } catch (err: any) {
      setStatus({ loading: false, error: err.response?.data?.error || 'Something went wrong. Please try again.', success: false });
    }
  };

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
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-6 ${
            theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-navy'
          }`}>
            Contact & Support
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-600')
          }`}>
            Our Central Command Team is available 24/7 to assist you. In case of an immediate emergency, please use the SOS feature or call 112.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className={`p-8 rounded-3xl shadow-xl relative overflow-hidden text-white border ${
              theme === 'colorful' ? 'bg-gradient-to-br from-navy to-blue-900 border-white/10' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-navy border-transparent')
            }`}>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Phone className="w-64 h-64" />
              </div>
              <h2 className="text-2xl font-bold mb-6">Official Channels</h2>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-saffron" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">National Emergency Number</p>
                    <p className="text-3xl font-extrabold text-white">112</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-saffron" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Support Email</p>
                    <p className="text-lg font-bold text-white">support@trinetra.gov.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-saffron" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Headquarters</p>
                    <p className="text-lg font-medium text-slate-200">
                      Ministry of Tourism<br/>
                      Transport Bhavan, Sansad Marg<br/>
                      New Delhi - 110001, India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-8 md:p-10 rounded-3xl shadow-2xl border ${
              theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 
              (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white border-slate-100 shadow-navy/5')
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className={`h-6 w-6 ${theme === 'colorful' || theme === 'dark' ? 'text-blue-400' : 'text-navy'}`} />
              <h2 className={`text-2xl font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Send a Message</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {status.success && (
                <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-500 font-bold mb-6">
                  Message sent successfully! Our Central Command Team will review it shortly.
                </div>
              )}
              {status.error && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-500 font-bold mb-6">
                  {status.error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={`font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="John" 
                    className={`h-12 rounded-xl focus-visible:ring-saffron ${
                      theme === 'colorful' ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400' : 
                      (theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-slate-50')
                    }`} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={`font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Doe" 
                    className={`h-12 rounded-xl focus-visible:ring-saffron ${
                      theme === 'colorful' ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400' : 
                      (theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-slate-50')
                    }`} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={`font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                  className={`h-12 rounded-xl focus-visible:ring-saffron ${
                    theme === 'colorful' ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400' : 
                    (theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-slate-50')
                  }`} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className={`font-bold ${theme === 'colorful' || theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Message</Label>
                <textarea 
                  id="message" 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className={`w-full flex rounded-xl border px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 ${
                    theme === 'colorful' ? 'bg-white/10 border-white/20 text-white placeholder:text-slate-400 ring-offset-navy' : 
                    (theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 ring-offset-slate-900' : 'bg-slate-50 border-input ring-offset-background placeholder:text-muted-foreground')
                  }`}
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <Button type="submit" disabled={status.loading} className="w-full h-14 rounded-xl bg-saffron hover:bg-orange-600 text-white font-bold text-lg shadow-lg transition-all hover:scale-[1.02]">
                {status.loading ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </form>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
