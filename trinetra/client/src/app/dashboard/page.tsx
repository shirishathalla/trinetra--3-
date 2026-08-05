'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QRCode from 'react-qr-code';
import { AlertTriangle, Phone, FileText, ShieldAlert, MapPin, BadgeCheck, X, Navigation, Fingerprint, Activity, Settings, User, Heart, Shield, BellRing, Clock, CloudLightning, History, Info, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, Libraries } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem'
};

const libraries: Libraries = ['places'];

const defaultMapCenter = {
  lat: 32.2396,
  lng: 77.1887 // Manali, HP as fallback
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [modalMessage, setModalMessage] = useState<{title: string, message: string, type: 'error' | 'success'} | null>(null);

  // Map & Location State
  const [currentLocation, setCurrentLocation] = useState(defaultMapCenter);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [journeyLogs, setJourneyLogs] = useState<any[]>([]);

  const calculateAge = (dob: string | Date | undefined) => {
    if (!dob) return undefined;
    const birthDate = new Date(dob);
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--;
    }
    return computedAge;
  };

  const [advisories, setAdvisories] = useState<any[]>([
    {
      id: 'routine_1',
      type: 'Routine Security Update',
      message: 'Level 1 clearance processing times are currently nominal. Please keep your QR payload ready when approaching checkpoints.',
      time: 'Issued: 08:00 AM Today',
      icon: 'info',
      color: 'blue'
    }
  ]);

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    gender: '',
    identificationNumber: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: ''
  });

  const isColorful = theme === 'colorful';
  const isDark = theme === 'dark' || isColorful;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [res, journeyRes] = await Promise.all([
          api.get('/tourists/me'),
          api.get('/tourists/me/journey').catch(() => ({ data: [] }))
        ]);
        
        setProfile(res.data);
        setJourneyLogs(journeyRes.data || []);
        
        // Pre-fill form data
        setFormData({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          phone: res.data.phone || '',
          dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.split('T')[0] : (res.data.age ? '' : ''),
          nationality: res.data.nationality || '',
          gender: res.data.gender || '',
          identificationNumber: res.data.identificationNumber || '',
          bloodGroup: res.data.medicalDetails?.bloodGroup || '',
          allergies: res.data.medicalDetails?.allergies || '',
          chronicConditions: res.data.medicalDetails?.chronicConditions || '',
          emergencyContacts: res.data.emergencyContacts?.length ? res.data.emergencyContacts : [{ name: '', relation: '', phone: '', countryCode: '+91' }],
        });
      } catch (err: any) {
        console.error('Failed to fetch profile', err);
        if (err.response?.status === 404) {
          // If profile doesn't exist, this means registration was incomplete
          useAuthStore.getState().logout();
          router.push('/register');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'tourist') {
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const [locationPermission, setLocationPermission] = useState<string>('prompt');

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        const weatherCode = data.current_weather?.weathercode || 0;
        const temp = data.current_weather?.temperature;
        
        let weatherMessage = `Current temperature is ${temp}°C. Weather is clear.`;
        let advisoryType = 'Weather Update';
        let color = 'blue';
        let icon = 'info';
        
        if (weatherCode >= 51 && weatherCode <= 67) {
          weatherMessage = `Rain is expected (Temp: ${temp}°C). Roads may be slippery. Proceed with caution.`;
          advisoryType = 'Weather Advisory: Rain';
          color = 'yellow';
          icon = 'lightning';
        } else if (weatherCode >= 71 && weatherCode <= 77) {
          weatherMessage = `Snowfall expected (Temp: ${temp}°C). Tourist vehicles without snow chains will not be permitted beyond higher checkpoints.`;
          advisoryType = 'Weather Advisory: Snow';
          color = 'yellow';
          icon = 'lightning';
        } else if (weatherCode >= 95) {
          weatherMessage = `Severe thunderstorms detected. Seek shelter and suspend outdoor activities immediately.`;
          advisoryType = 'CRITICAL WEATHER ALERT';
          color = 'red';
          icon = 'lightning';
        }

        setAdvisories(prev => [
          {
            id: 'weather_1',
            type: advisoryType,
            message: weatherMessage,
            time: 'Issued: Live Data (Open-Meteo)',
            icon: icon,
            color: color
          },
          ...prev.filter(a => a.id !== 'weather_1')
        ]);
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
    };

    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        result.onchange = function () {
          setLocationPermission(this.state);
        };
      });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCurrentLocation({ lat, lng: lon });
          fetchWeather(lat, lon);
        },
        (error) => {
          console.error("Geolocation error:", error);
          fetchWeather(defaultMapCenter.lat, defaultMapCenter.lng);
        }
      );
    } else {
      fetchWeather(defaultMapCenter.lat, defaultMapCenter.lng);
    }
  }, []);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission('granted'),
        (err) => {
          console.error(err);
          setLocationPermission('denied');
        }
      );
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || undefined,
        nationality: formData.nationality,
        gender: formData.gender,
        identificationNumber: formData.identificationNumber,
        medicalDetails: {
          bloodGroup: formData.bloodGroup,
          allergies: formData.allergies,
          chronicConditions: formData.chronicConditions,
        },
        emergencyContacts: formData.emergencyContacts
      };

      const res = await api.put('/tourists/me', updatedProfile);
      setProfile(res.data);
      setShowSettings(false);
      setModalMessage({
        title: 'SETTINGS UPDATED',
        message: 'Your profile configuration has been successfully updated.',
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to update settings', err);
      setModalMessage({
        title: 'UPDATE FAILED',
        message: 'Could not save your settings. Please try again later.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmAndTriggerSOS = async () => {
    setSosCountdown(3);
    
    let currentCount = 3;
    const intervalId = setInterval(async () => {
      currentCount -= 1;
      setSosCountdown(currentCount);
      
      if (currentCount <= 0) {
        clearInterval(intervalId);
        setSosCountdown(null);
        setShowSosConfirm(false);
        try {
          setSosActive(true);
          const coordinates = [currentLocation.lng, currentLocation.lat]; 
          
          let detectedType = 'Desktop';
          if (/Mobi|Android/i.test(navigator.userAgent)) detectedType = 'Mobile';
          if (/Tablet|iPad/i.test(navigator.userAgent)) detectedType = 'Tablet';
          
          let navBattery = 85;
          try {
            const nav = navigator as any;
            if (nav.getBattery) {
              const battery = await nav.getBattery();
              navBattery = Math.floor(battery.level * 100);
            }
          } catch(e) {}
          
          let navNetwork = '4G';
          try {
            const nav = navigator as any;
            if (nav.connection && nav.connection.effectiveType) {
              navNetwork = nav.connection.effectiveType.toUpperCase();
            }
          } catch(e) {}

          await api.post('/sos/trigger', {
            coordinates,
            batteryLevel: navBattery,
            networkStatus: navNetwork,
            deviceType: detectedType,
            userAgent: navigator.userAgent
          });

          // Use the first emergency contact for WA message
          let emergencyContact = profile?.emergencyContacts?.[0];
          let emergencyPhone = emergencyContact?.phone;
          let emergencyCountryCode = emergencyContact?.countryCode || '+91';

          if (emergencyPhone) {
            // Remove any non-digits from country code and phone
            let cleanCountryCode = emergencyCountryCode.replace(/\D/g, '');
            let cleanPhone = emergencyPhone.replace(/\D/g, '');
            
            // For backward compatibility: if countryCode wasn't saved but it's a 10 digit number
            if (!emergencyContact?.countryCode && cleanPhone.length === 10) {
              cleanCountryCode = '91';
            }
            
            const waNumber = cleanCountryCode + cleanPhone;
            const message = `EMERGENCY SOS: I am in danger. My live coordinates are: https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng} . Please contact Trinetra Authority immediately.`;
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
            
            const waWindow = window.open(waUrl, '_blank');
            if (!waWindow) {
              alert('Please allow popups to open WhatsApp directly.');
            }
          }

          setModalMessage({
            title: 'EMERGENCY SOS DEPLOYED',
            message: 'Your live location has been transmitted to Border Security Command and your emergency contact. Help is immediately en route. Stay exactly where you are.',
            type: 'success'
          });
        } catch (err) {
          console.error('SOS Failed', err);
          setModalMessage({
            title: 'SOS TRANSMISSION FAILED',
            message: 'Data connection unavailable. Dial 112 immediately for emergency services.',
            type: 'error'
          });
          setSosActive(false);
        }
      }
    }, 1000);
  };

  const triggerSOS = () => {
    setShowSosConfirm(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring' as const, stiffness: 100 } }
  };

  if (loading || authLoading) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${isDark ? 'bg-slate-950 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>Loading Profile...</div>;
  }

  if (!profile) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${isDark ? 'bg-slate-950 text-red-500' : 'bg-slate-50 text-red-500'}`}>Profile Initialization Failed</div>;
  }

  const qrPayload = typeof window !== 'undefined' ? `${window.location.origin}/qr/${profile.touristId}` : '';

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-500 ${isColorful ? 'bg-[#0f172a]' : isDark ? 'bg-[#0a0f1a]' : 'bg-slate-50'}`}>
      
      {/* Colorful Theme Dynamic Background */}
      {isColorful && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
      )}

      {/* SOS Confirmation Modal */}
      <AnimatePresence>
        {showSosConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-md rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden border ${isDark ? 'bg-slate-900 border-red-900/50' : 'bg-white border-red-200'}`}
            >
              <div className={`p-5 flex justify-between items-center ${isDark ? 'bg-red-950/40 border-b border-red-900/50' : 'bg-red-50 border-b border-red-100'}`}>
                <div className={`flex items-center gap-3 text-red-500 font-extrabold uppercase tracking-widest text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Critical Alert
                </div>
                <button onClick={() => setShowSosConfirm(false)} className={`transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-8">
                <p className={`text-xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Deploy Emergency SOS?
                </p>
                {sosCountdown !== null ? (
                  <div className="flex flex-col items-center justify-center my-6">
                    <p className={`text-6xl font-black text-red-500 animate-pulse`}>{sosCountdown}</p>
                    <p className={`text-sm mt-2 font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Deploying in...</p>
                  </div>
                ) : (
                  <p className={`text-sm mb-8 font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    This will immediately transmit your live GPS coordinates to local authorities and emergency contacts. Misuse is a punishable offense.
                  </p>
                )}
                <div className="flex gap-4 justify-end">
                  <Button variant="ghost" onClick={() => { setShowSosConfirm(false); setSosCountdown(null); }} className={`font-bold tracking-wide ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`} disabled={sosCountdown !== null}>CANCEL</Button>
                  <Button onClick={confirmAndTriggerSOS} disabled={sosCountdown !== null} className="bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide rounded-xl shadow-[0_8px_20px_-8px_rgba(220,38,38,0.6)] px-6">DEPLOY NOW</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col border ${isColorful ? 'bg-slate-900/80 border-white/20 backdrop-blur-xl' : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className={`p-5 flex justify-between items-center border-b ${isColorful ? 'bg-white/5 border-white/10' : isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`flex items-center gap-3 font-extrabold uppercase tracking-widest text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Settings className="h-5 w-5" />
                  Configuration
                </div>
                <button onClick={() => setShowSettings(false)} className={`transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Tabs */}
                <div className={`w-48 p-4 border-r flex flex-col gap-2 ${isColorful ? 'border-white/10 bg-black/20' : isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'}`}>
                  {[
                    { id: 'profile', icon: User, label: 'Profile' },
                    { id: 'medical', icon: Heart, label: 'Medical' },
                    { id: 'emergency', icon: Phone, label: 'Emergency' },
                    { id: 'security', icon: Shield, label: 'Security' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? (isDark ? 'bg-blue-600 text-white' : 'bg-navy text-white shadow-md') : (isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900')}`}
                    >
                      <tab.icon className="h-4 w-4" /> {tab.label}
                    </button>
                  ))}
                </div>

                {/* Form Content */}
                <div className={`flex-1 p-8 overflow-y-auto ${isColorful ? 'bg-white/5' : ''}`}>
                  <div className="space-y-6">
                    
                    {activeTab === 'profile' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Personal Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>First Name</Label>
                            <Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                          </div>
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Last Name</Label>
                            <Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Phone Number</Label>
                            <Input type="tel" maxLength={10} pattern="\d{10}" title="Must be exactly 10 digits" placeholder="9876543210" value={formData.phone} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, '').substring(0, 10); setFormData({...formData, phone: e.target.value})}} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                          </div>
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Date of Birth</Label>
                            <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Gender</Label>
                            <select 
                              value={formData.gender}
                              onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                              className={`flex w-full h-10 items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'bg-slate-800/50 border-slate-700 text-white' : 'border-slate-200'}`}
                            >
                              <option value="Male" className="text-black">Male</option>
                              <option value="Female" className="text-black">Female</option>
                              <option value="Other" className="text-black">Other</option>
                              <option value="Prefer not to say" className="text-black">Prefer not to say</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Nationality</Label>
                            <Input value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>ID Number</Label>
                          <Input value={formData.identificationNumber} onChange={(e) => setFormData({...formData, identificationNumber: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'medical' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Medical Telemetry</h3>
                        <div className="space-y-2">
                          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Blood Group</Label>
                          <Input placeholder="e.g., O+, AB-" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                        </div>
                        <div className="space-y-2">
                          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Known Allergies</Label>
                          <Input placeholder="e.g., Peanuts, Penicillin" value={formData.allergies} onChange={(e) => setFormData({...formData, allergies: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                        </div>
                        <div className="space-y-2">
                          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Chronic Conditions</Label>
                          <Input placeholder="e.g., Asthma, Diabetes" value={formData.chronicConditions} onChange={(e) => setFormData({...formData, chronicConditions: e.target.value})} className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'emergency' && (
                      <div className="space-y-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-red-400 flex items-center">
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Emergency Contacts
                      </h4>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (formData.emergencyContacts.length < 3) {
                            setFormData(prev => ({
                              ...prev,
                              emergencyContacts: [...prev.emergencyContacts, { name: '', relation: '', phone: '', countryCode: '+91' }]
                            }));
                          }
                        }}
                        disabled={formData.emergencyContacts?.length >= 3}
                        className="h-8 text-xs font-bold uppercase tracking-widest border-slate-700 text-slate-300"
                      >
                        + Add ({formData.emergencyContacts?.length || 0}/3)
                      </Button>
                    </div>

                    {formData.emergencyContacts?.map((contact: any, index: number) => (
                      <div key={index} className="p-4 rounded-sm border border-slate-700 bg-slate-800/50 space-y-4 relative">
                        {(formData.emergencyContacts?.length || 0) > 1 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const newContacts = [...formData.emergencyContacts];
                              newContacts.splice(index, 1);
                              setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
                            }}
                            className="absolute top-2 right-2 p-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-slate-700"
                          >
                            Remove
                          </button>
                        )}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact #{index + 1}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Name</Label>
                            <Input 
                              value={contact.name} 
                              onChange={(e) => {
                                const newContacts = [...formData.emergencyContacts];
                                newContacts[index].name = e.target.value;
                                setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
                              }}
                              className="rounded-sm text-sm bg-slate-900 border-slate-700 text-white" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Relation</Label>
                            <Input 
                              value={contact.relation} 
                              onChange={(e) => {
                                const newContacts = [...formData.emergencyContacts];
                                newContacts[index].relation = e.target.value;
                                setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
                              }}
                              className="rounded-sm text-sm bg-slate-900 border-slate-700 text-white" 
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Phone</Label>
                            <div className="flex gap-2">
                              <select 
                                value={contact.countryCode || '+91'} 
                                onChange={(e) => {
                                  const newContacts = [...formData.emergencyContacts];
                                  newContacts[index].countryCode = e.target.value;
                                  setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
                                }}
                                className="w-24 p-2 rounded-sm border bg-slate-900 border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                              >
                                <option value="+91">+91 (IN)</option>
                                <option value="+1">+1 (US/CA)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+61">+61 (AU)</option>
                                <option value="+971">+971 (AE)</option>
                                <option value="+65">+65 (SG)</option>
                                <option value="+49">+49 (DE)</option>
                                <option value="+33">+33 (FR)</option>
                              </select>
                              <Input 
                                value={contact.phone} 
                                onChange={(e) => {
                                  const newContacts = [...formData.emergencyContacts];
                                  newContacts[index].phone = e.target.value;
                                  setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
                                }}
                                type="tel" maxLength={10} pattern="[0-9]{10}"
                                className="flex-1 rounded-sm text-sm bg-slate-900 border-slate-700 text-white" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                    )}

                    {activeTab === 'security' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Change Password</h3>
                        <div className="space-y-4 max-w-sm">
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Current Password</Label>
                            <Input type="password" id="currentPassword" placeholder="••••••••" className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                          </div>
                          <div className="space-y-2">
                            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>New Password</Label>
                            <Input type="password" id="newPassword" placeholder="••••••••" className={isDark ? 'bg-slate-800/50 border-slate-700 text-white' : ''} />
                          </div>
                          <Button 
                            onClick={async () => {
                              const currentPass = (document.getElementById('currentPassword') as HTMLInputElement).value;
                              const newPass = (document.getElementById('newPassword') as HTMLInputElement).value;
                              if(!currentPass || !newPass) {
                                setModalMessage({ title: 'ERROR', message: 'Please enter both current and new passwords.', type: 'error' });
                                return;
                              }
                              try {
                                await api.put('/auth/change-password', { currentPassword: currentPass, newPassword: newPass });
                                setModalMessage({ title: 'SUCCESS', message: 'Password changed successfully.', type: 'success' });
                                (document.getElementById('currentPassword') as HTMLInputElement).value = '';
                                (document.getElementById('newPassword') as HTMLInputElement).value = '';
                              } catch (err: any) {
                                setModalMessage({ title: 'ERROR', message: err.response?.data?.message || 'Failed to change password.', type: 'error' });
                              }
                            }}
                            className={`w-full font-bold tracking-wide rounded-xl px-8 mt-2 ${isColorful ? 'bg-blue-600 hover:bg-blue-700 text-white' : isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-navy text-white hover:bg-blue-900'}`}
                          >
                            UPDATE PASSWORD
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`p-5 flex justify-end gap-3 border-t ${isColorful ? 'bg-black/20 border-white/10' : isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <Button variant="ghost" onClick={() => setShowSettings(false)} className={`font-bold tracking-wide rounded-xl px-6 ${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-200'}`}>CANCEL</Button>
                <Button onClick={handleSaveSettings} disabled={saving} className={`font-bold tracking-wide rounded-xl px-8 ${isColorful ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-navy text-white hover:bg-blue-900'}`}>
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {modalMessage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border ${isDark ? 'bg-slate-900' : 'bg-white'} ${modalMessage.type === 'error' ? 'border-red-500/30' : 'border-green-500/30'}`}
            >
              <div className={`p-5 flex justify-between items-center border-b ${modalMessage.type === 'error' ? (isDark ? 'bg-red-950/40 border-red-900/50' : 'bg-red-50 border-red-100') : (isDark ? 'bg-green-950/40 border-green-900/50' : 'bg-green-50 border-green-100')}`}>
                <div className={`flex items-center gap-3 font-extrabold uppercase tracking-widest text-sm ${modalMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                  {modalMessage.type === 'error' ? <AlertTriangle className="h-5 w-5" /> : <BadgeCheck className="h-5 w-5" />}
                  {modalMessage.title}
                </div>
                <button onClick={() => setModalMessage(null)} className={`transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-8">
                <p className={`text-base font-medium mb-8 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {modalMessage.message}
                </p>
                <div className="flex justify-end">
                  <Button onClick={() => setModalMessage(null)} className={`font-bold tracking-wide rounded-xl px-8 ${isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-navy hover:bg-blue-900 text-white'}`}>ACKNOWLEDGE</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10"
      >
        
        {/* Header Action Bar */}
        <motion.div variants={itemVariants} className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-5 rounded-3xl transition-all duration-300 backdrop-blur-xl ${isDark ? 'bg-slate-900/60 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'bg-white/80 border border-slate-200/60 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${isColorful ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-navy text-white shadow-md'}`}>
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-xl font-extrabold uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Secure Portal</h1>
              <p className={`text-xs font-semibold tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Welcome, {profile.firstName} {profile.lastName}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button 
              onClick={() => setShowSettings(true)}
              className={`w-full sm:w-auto rounded-xl h-11 px-4 text-xs font-bold tracking-widest transition-all ${isColorful ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy'}`}
            >
              <Settings className="mr-2 h-4 w-4" /> SETTINGS
            </Button>
            <Link href="/track" className="w-full sm:w-auto">
              <Button className={`w-full rounded-xl h-11 px-6 text-xs font-bold tracking-widest transition-all ${isColorful ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy'}`}>
                <Navigation className="mr-2 h-4 w-4" /> LIVE GPS
              </Button>
            </Link>
            <Button 
              onClick={triggerSOS}
              className={`w-full sm:w-auto rounded-xl h-11 px-6 text-xs font-bold tracking-widest transition-all shadow-lg ${sosActive ? 'animate-pulse bg-red-700 hover:bg-red-800 text-white shadow-red-500/50' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'}`}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              {sosActive ? 'TRANSMITTING...' : 'EMERGENCY SOS'}
            </Button>
          </div>
        </motion.div>

        {locationPermission !== 'granted' && (
          <motion.div variants={itemVariants} className={`p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border shadow-sm ${isDark ? 'bg-red-950/30 border-red-900/50 text-red-200' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-red-500 animate-bounce" />
              <div>
                <p className="font-bold uppercase tracking-widest text-xs">Location Access Needed</p>
                <p className="text-sm">Trinetra uses your location to provide critical travel advisories and enable the emergency SOS feature.</p>
              </div>
            </div>
            {locationPermission === 'denied' ? (
              <Button disabled variant="outline" className={`shrink-0 font-bold tracking-widest text-xs h-10 ${isDark ? 'border-red-800 text-red-500' : 'border-red-300 text-red-500'}`}>
                ACCESS DENIED
              </Button>
            ) : (
              <Button onClick={requestLocationPermission} className="shrink-0 font-bold uppercase tracking-widest text-xs h-10 bg-red-600 hover:bg-red-700 text-white shadow-md">
                Enable Location
              </Button>
            )}
          </motion.div>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Main ID Card (Spans 2 cols on lg) */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
            <div className={`h-full relative overflow-hidden rounded-[2rem] border p-1 shadow-xl transition-all duration-300 ${isColorful ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-2xl' : isDark ? 'bg-slate-900 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
              <div className={`h-full w-full rounded-[1.75rem] p-6 sm:p-8 flex flex-col relative overflow-hidden ${isColorful ? 'bg-slate-950/40' : isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                
                {/* Card Watermark */}
                <Fingerprint className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-500 opacity-[0.03] rotate-12 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center h-12 w-12 rounded-xl text-[8px] font-black uppercase shadow-inner border ${isColorful ? 'bg-white/10 border-white/20 text-white' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                      INDIA
                    </div>
                    <div>
                      <h2 className={`text-2xl font-black uppercase tracking-tight leading-none mb-1 ${isDark ? 'text-white' : 'text-navy'}`}>Digital ID</h2>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isColorful ? 'text-blue-300' : isDark ? 'text-blue-400' : 'text-blue-600'}`}>Trinetra Secure Pass</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                    profile.verificationStatus === 'verified' ? (isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200') : 
                    profile.verificationStatus === 'rejected' ? (isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200') :
                    (isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200')
                  }`}>
                    {profile.verificationStatus === 'verified' && <BadgeCheck className="h-3 w-3" />}
                    {profile.verificationStatus}
                  </div>
                </div>

                <div className="space-y-6 mt-auto relative z-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isColorful ? 'text-white/60' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Cardholder Name</p>
                      <p className={`text-xl font-bold uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.firstName} {profile.lastName}</p>
                    </div>
                    {(profile.age || profile.dateOfBirth) && (
                      <div className="text-right">
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isColorful ? 'text-white/60' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>DOB / Age / Gender</p>
                        <p className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'} &bull; {profile.age || calculateAge(profile.dateOfBirth)} &bull; {profile.gender?.charAt(0) || 'U'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isColorful ? 'text-white/60' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Clearance</p>
                      <p className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Lvl 1 (Tourist)</p>
                    </div>
                    <div>
                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isColorful ? 'text-white/60' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Nationality / ID</p>
                      <p className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.nationality || 'IND'} &bull; {profile.identificationNumber || profile.touristId.substring(0, 10)}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* QR Code Panel */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1">
            <div className={`h-full rounded-[2rem] border p-6 flex flex-col items-center justify-center text-center transition-all backdrop-blur-xl ${isColorful ? 'bg-white/10 border-white/20' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-slate-50 mb-6 group transition-transform hover:scale-105">
                <QRCode value={qrPayload} size={250} className="rounded-xl" bgColor="#FFFFFF" fgColor="#000000" />
              </div>
              <h3 className={`font-black uppercase tracking-widest text-sm mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Scan Payload</h3>
              <p className={`text-xs font-medium leading-relaxed ${isColorful ? 'text-white/70' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Contains active journey, medical, and clearance telemetry.
              </p>
            </div>
          </motion.div>

          {/* Right Column Data Panels */}
          <div className="md:col-span-3 lg:col-span-1 flex flex-col gap-6">
            
            {/* Medical Mini-Card */}
            <motion.div variants={itemVariants} className={`flex-1 rounded-[2rem] border p-6 flex flex-col justify-center transition-all backdrop-blur-xl ${isColorful ? 'bg-white/10 border-white/20' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${isColorful ? 'bg-red-500/20 text-red-300' : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Medical Info</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isColorful ? 'text-white/60' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Blood Type</span>
                  <span className={`text-xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>{profile.medicalDetails?.bloodGroup || 'N/A'}</span>
                </div>
                <div className={`pt-3 border-t ${isColorful ? 'border-white/10' : isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${isColorful ? 'text-white/60' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>Allergies</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.medicalDetails?.allergies || 'None'}</span>
                </div>
              </div>
            </motion.div>

            {/* Active Tour Mini-Card */}
            <motion.div variants={itemVariants} className={`flex-1 rounded-[2rem] border p-6 flex flex-col justify-center transition-all backdrop-blur-xl ${isColorful ? 'bg-white/10 border-white/20' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${isColorful ? 'bg-saffron/20 text-saffron' : isDark ? 'bg-saffron/20 text-saffron' : 'bg-orange-100 text-orange-600'}`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Tour</h3>
              </div>
              <div className={`p-3 rounded-xl mb-4 border ${isColorful ? 'bg-white/5 border-white/10' : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                {profile.isTourActive ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <p className={`text-sm font-bold uppercase text-green-500`}>Journey Active</p>
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs font-medium text-center ${isColorful ? 'text-white/80' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    No active journey recorded today.
                  </p>
                )}
              </div>
              <Button 
                onClick={async () => {
                  try {
                    const res = await api.put('/tourists/me/tour-status', { isTourActive: !profile.isTourActive });
                    setProfile({ ...profile, isTourActive: res.data.isTourActive });
                  } catch (err) {
                    console.error('Failed to update tour status', err);
                  }
                }}
                className={`w-full rounded-xl h-10 text-[10px] font-black uppercase tracking-widest transition-all ${
                  profile.isTourActive
                    ? isDark ? 'bg-red-900/50 hover:bg-red-900/70 text-red-500 border border-red-900' : 'bg-red-100 hover:bg-red-200 text-red-700'
                    : isColorful ? 'bg-white text-blue-900 hover:bg-white/90' : isDark ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-navy text-white hover:bg-blue-900'
                }`}
              >
                {profile.isTourActive ? 'END JOURNEY' : 'NEW JOURNEY'}
              </Button>
            </motion.div>

          </div>
        </div>

        {/* Travel Intel & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pt-2">
          
          {/* Left Stack: Advisories & History */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Active Travel Advisories */}
            <motion.div variants={itemVariants} className={`rounded-[2rem] border p-6 md:p-8 flex flex-col transition-all backdrop-blur-xl ${isColorful ? 'bg-white/10 border-white/20' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${isColorful ? 'bg-blue-500/20 text-blue-300' : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Travel Advisories</h3>
                  <p className={`text-xs font-bold tracking-widest uppercase ${isColorful ? 'text-blue-300' : isDark ? 'text-blue-400' : 'text-blue-600'}`}>Official Intelligence</p>
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                {advisories.map((adv) => (
                  <div key={adv.id} className={`p-5 rounded-2xl border flex gap-4 transition-all hover:scale-[1.01] ${adv.color === 'red' ? (isDark ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50 border-red-200') : adv.color === 'yellow' ? (isColorful ? 'bg-yellow-500/10 border-yellow-500/20' : isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200') : (isColorful ? 'bg-white/5 border-white/10' : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100')}`}>
                    <div className={`shrink-0 mt-1 ${adv.color === 'red' ? 'text-red-500' : adv.color === 'yellow' ? (isColorful ? 'text-yellow-400' : isDark ? 'text-yellow-500' : 'text-yellow-600') : (isColorful ? 'text-blue-300' : isDark ? 'text-blue-400' : 'text-blue-500')}`}>
                      {adv.icon === 'lightning' ? <CloudLightning className="h-6 w-6" /> : <Info className="h-6 w-6" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{adv.type}</h4>
                      <p className={`text-xs font-medium leading-relaxed ${isColorful ? 'text-white/70' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {adv.message}
                      </p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-3 ${adv.color === 'red' ? 'text-red-500' : adv.color === 'yellow' ? (isColorful ? 'text-yellow-400' : isDark ? 'text-yellow-500' : 'text-yellow-700') : (isColorful ? 'text-blue-300' : isDark ? 'text-slate-500' : 'text-slate-400')}`}>{adv.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Journey History */}
            <motion.div variants={itemVariants} className={`rounded-[2rem] border p-6 md:p-8 flex flex-col transition-all backdrop-blur-xl ${isColorful ? 'bg-white/10 border-white/20' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-2xl ${isColorful ? 'bg-purple-500/20 text-purple-300' : isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Journey Log</h3>
                  <p className={`text-xs font-bold tracking-widest uppercase ${isColorful ? 'text-purple-300' : isDark ? 'text-purple-400' : 'text-purple-600'}`}>Recent Activity</p>
                </div>
              </div>

              <div className="relative flex-1 pl-4 border-l-2 border-dashed ml-3 space-y-8 pb-4 border-slate-300 dark:border-slate-700">
                
                {journeyLogs.length === 0 ? (
                  <div className={`pt-4 text-xs font-bold uppercase tracking-widest ${isColorful ? 'text-white/50' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No journey activity recorded yet.
                  </div>
                ) : (
                  journeyLogs.map((log) => (
                    <div key={log.id} className="relative">
                      <div className={`absolute -left-[25px] top-1 h-5 w-5 rounded-full border-4 flex items-center justify-center ${
                        log.color === 'green' ? (isColorful ? 'bg-green-400 border-slate-900 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : isDark ? 'bg-green-500 border-slate-900' : 'bg-green-500 border-white shadow-sm') :
                        log.color === 'blue' ? (isColorful ? 'bg-blue-400 border-slate-900 shadow-[0_0_15px_rgba(96,165,250,0.5)]' : isDark ? 'bg-blue-500 border-slate-900' : 'bg-blue-500 border-white shadow-sm') :
                        log.color === 'red' ? (isColorful ? 'bg-red-400 border-slate-900 shadow-[0_0_15px_rgba(248,113,113,0.5)]' : isDark ? 'bg-red-500 border-slate-900' : 'bg-red-500 border-white shadow-sm') :
                        (isColorful ? 'bg-slate-400 border-slate-900' : isDark ? 'bg-slate-500 border-slate-900' : 'bg-slate-400 border-white shadow-sm')
                      }`}></div>
                      <div className="pl-4">
                        <h4 className={`text-sm font-bold uppercase tracking-wide mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{log.title}</h4>
                        <p className={`text-xs font-medium ${isColorful ? 'text-white/70' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>{log.description}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Clock className={`h-3 w-3 ${
                            log.color === 'green' ? (isColorful ? 'text-green-300' : isDark ? 'text-green-400' : 'text-green-600') :
                            log.color === 'blue' ? (isColorful ? 'text-blue-300' : isDark ? 'text-blue-400' : 'text-blue-600') :
                            log.color === 'red' ? (isColorful ? 'text-red-300' : isDark ? 'text-red-400' : 'text-red-600') :
                            (isColorful ? 'text-slate-300' : isDark ? 'text-slate-400' : 'text-slate-500')
                          }`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            log.color === 'green' ? (isColorful ? 'text-green-300' : isDark ? 'text-green-400' : 'text-green-600') :
                            log.color === 'blue' ? (isColorful ? 'text-blue-300' : isDark ? 'text-blue-400' : 'text-blue-600') :
                            log.color === 'red' ? (isColorful ? 'text-red-300' : isDark ? 'text-red-400' : 'text-red-600') :
                            (isColorful ? 'text-slate-300' : isDark ? 'text-slate-400' : 'text-slate-500')
                          }`}>
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

              </div>
            </motion.div>

          </div>

          {/* Right Area: Interactive Tourist Map */}
          <motion.div variants={itemVariants} className={`lg:col-span-3 rounded-[2rem] border p-6 flex flex-col transition-all backdrop-blur-xl min-h-[500px] h-full ${isColorful ? 'bg-white/10 border-white/20' : isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl ${isColorful ? 'bg-green-500/20 text-green-300' : isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Local Destinations</h3>
                <p className={`text-xs font-bold tracking-widest uppercase ${isColorful ? 'text-green-300' : isDark ? 'text-green-400' : 'text-green-600'}`}>Nearest Attractions & Checkpoints</p>
              </div>
            </div>

            <div className="flex-1 w-full rounded-3xl overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-inner relative">
              {!isMapLoaded ? (
                <div className={`absolute inset-0 flex items-center justify-center font-bold uppercase tracking-widest ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                  Initializing Maps Interface...
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={currentLocation}
                  zoom={12}
                  onLoad={(map) => setMapInstance(map)}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: isDark ? [
                      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
                    ] : undefined
                  }}
                >
                  {/* Current Location Marker */}
                  <Marker 
                    position={currentLocation}
                    icon={{
                      path: typeof window !== 'undefined' && window.google ? window.google.maps.SymbolPath.CIRCLE : 0,
                      scale: 8,
                      fillColor: '#3b82f6',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }}
                  />

                  {/* Dynamic Tourist Attractions */}
                  {nearbyPlaces.map((place, index) => (
                    <Marker 
                      key={place.place_id || index}
                      position={place.geometry.location}
                      label={{
                        text: place.name,
                        className: 'font-bold uppercase tracking-widest text-[10px] bg-white text-slate-900 px-2 py-1 rounded-md shadow-md border border-slate-200',
                        color: '#0f172a'
                      }}
                    />
                  ))}
                </GoogleMap>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}


