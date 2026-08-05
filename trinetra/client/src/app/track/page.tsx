'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { GoogleMap, useJsApiLoader, Marker, Circle, Libraries } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Navigation, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';

const libraries: Libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
}; // New Delhi

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#475569" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#475569" }] }
];

export default function LiveTracking() {
  const { user, isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const [tracking, setTracking] = useState(false);
  const [modal, setModal] = useState<{ isOpen: boolean, type: 'confirm' | 'alert', message: string, onConfirm?: () => void }>({ isOpen: false, type: 'alert', message: '' });
  const watchIdRef = useRef<number | null>(null);

  const [locationPermission, setLocationPermission] = useState<string>('prompt');

  const isDark = theme === 'dark' || theme === 'colorful';
  const isColorful = theme === 'colorful';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role === 'authority' || user?.role === 'admin') {
      router.push('/authority-map');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        result.onchange = function () {
          setLocationPermission(this.state);
        };
      });
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

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });

        if (user?.role === 'tourist') {
          try {
            await api.post('/gps/update', { coordinates: [longitude, latitude] });
          } catch (err) {
            console.error('Failed to update GPS', err);
          }
        }
      },
      (error) => {
        console.error(error);
        setModal({ isOpen: true, type: 'alert', message: 'Error getting location: ' + error.message });
        setTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  if (!isLoaded) return (
    <div className={`flex-1 flex items-center justify-center font-bold uppercase tracking-widest ${isDark ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>
      Initializing Tracking Grid...
    </div>
  );

  return (
    <div className={`flex-1 flex flex-col relative h-[calc(100vh-64px)] ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="absolute top-24 left-6 md:left-10 z-10 w-full max-w-md pr-8 flex flex-col gap-4">
        <Button 
          variant="outline" 
          className={`w-28 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg backdrop-blur-md transition-all hover:-translate-x-1 ${isDark ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-navy'}`}
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className={`shadow-2xl backdrop-blur-xl border-t-[6px] rounded-3xl overflow-hidden transition-all ${
          isColorful ? 'bg-navy/80 border-t-saffron border-x-white/10 border-b-white/10' : 
          (isDark ? 'bg-slate-900/80 border-t-blue-500 border-x-slate-700 border-b-slate-700' : 'bg-white/95 border-t-navy border-x-slate-200 border-b-slate-200')
        }`}>
          <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                isColorful ? 'bg-saffron text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 
                (isDark ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-navy text-white shadow-lg')
              }`}>
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-black uppercase tracking-wider text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Central Tracking System</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-2 ${tracking ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                  Govt. of India TRINETRA Map
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className={`flex justify-between items-center p-4 border rounded-2xl ${
              isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs uppercase font-bold tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Module Status</span>
              {tracking ? (
                <span className="text-xs font-black text-green-500 flex items-center tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                  <Activity className="h-3.5 w-3.5 mr-1.5 animate-pulse" /> LIVE STREAMING
                </span>
              ) : (
                <span className={`text-xs font-black tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>STANDBY</span>
              )}
            </div>

            {!tracking ? (
              <Button onClick={startTracking} className={`w-full font-bold uppercase tracking-widest rounded-2xl shadow-lg h-14 transition-all hover:scale-[1.02] ${
                isColorful ? 'bg-saffron hover:bg-orange-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)]' : 
                (isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)]' : 'bg-navy hover:bg-blue-900 text-white shadow-[0_4px_20px_rgba(15,23,42,0.2)]')
              }`}>
                <Navigation className="h-4 w-4 mr-2" /> ENGAGE TRACKING
              </Button>
            ) : (
              <Button onClick={stopTracking} variant="outline" className={`w-full font-bold uppercase tracking-widest rounded-2xl h-14 transition-all hover:scale-[1.02] ${
                isDark ? 'border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300' : 'border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700'
              }`}>
                DISENGAGE TRACKING
              </Button>
            )}
            
            <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Button variant="destructive" className={`w-full font-black uppercase tracking-widest rounded-2xl h-14 transition-all hover:scale-[1.02] ${
                isDark ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] border-none' : 'bg-red-600 hover:bg-red-700 shadow-xl'
              }`} onClick={() => {
                setModal({
                  isOpen: true,
                  type: 'confirm',
                  message: 'CRITICAL ALERT: Are you sure you want to trigger SOS from your current location?',
                  onConfirm: async () => {
                    setModal({ isOpen: false, type: 'alert', message: '' });
                    
                    const triggerApi = async (lng: number, lat: number) => {
                      try {
                        await api.post('/sos/trigger', { 
                          coordinates: [lng, lat],
                          deviceInfo: {
                            batteryLevel: (navigator as any).getBattery ? await (navigator as any).getBattery().then((b:any) => Math.round(b.level * 100)) : 100,
                            networkStatus: navigator.onLine ? 'online' : 'offline',
                            deviceType: navigator.userAgent
                          }
                        });
                        setModal({
                          isOpen: true,
                          type: 'alert',
                          message: 'SOS Triggered! Central Command has been notified and your location is being tracked.'
                        });
                      } catch (e) {
                        setModal({
                          isOpen: true,
                          type: 'alert',
                          message: 'Error triggering SOS. Please try again or call 112 immediately.'
                        });
                      }
                    };

                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => triggerApi(pos.coords.longitude, pos.coords.latitude),
                        (err) => triggerApi(currentLocation.lng, currentLocation.lat), // Fallback to last known
                        { enableHighAccuracy: true, timeout: 5000 }
                      );
                    } else {
                      triggerApi(currentLocation.lng, currentLocation.lat);
                    }
                  }
                });
              }}>
                <AlertTriangle className="mr-2 h-5 w-5 animate-pulse" />
                EMERGENCY OVERRIDE
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 w-full relative min-h-screen">
        <div className={`absolute inset-0 border-t-4 z-10 pointer-events-none ${isColorful ? 'border-saffron' : isDark ? 'border-blue-600' : 'border-navy'}`}></div>
        
        {locationPermission !== 'granted' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Card className={`max-w-md p-8 text-center shadow-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-saffron animate-bounce" />
              <h2 className={`text-xl font-black uppercase tracking-widest mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Location Access Required</h2>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {locationPermission === 'denied' 
                  ? 'You have denied location access. Please enable location permissions in your browser settings to use the live tracking system.' 
                  : 'Central Command requires access to your live GPS coordinates to ensure your safety and enable emergency SOS functionality.'}
              </p>
              {locationPermission !== 'denied' && (
                <Button onClick={requestLocationPermission} className={`w-full font-bold uppercase tracking-widest h-12 ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-navy hover:bg-blue-900 text-white'}`}>
                  Grant Access
                </Button>
              )}
            </Card>
          </div>
        )}

        <div className="absolute inset-0 z-0">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentLocation}
            zoom={15}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: isDark ? darkMapStyle : []
            }}
          >
            {tracking && (
              <>
                <Marker position={currentLocation} icon={{
                  path: typeof window !== 'undefined' ? window.google.maps.SymbolPath.CIRCLE : 0,
                  scale: 8,
                  fillColor: isColorful ? '#f97316' : isDark ? '#3b82f6' : '#1e3a8a',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                }} />
                <Circle
                  center={currentLocation}
                  radius={200}
                  options={{
                    fillColor: isColorful ? '#f97316' : isDark ? '#3b82f6' : '#1e3a8a',
                    fillOpacity: 0.15,
                    strokeColor: isColorful ? '#f97316' : isDark ? '#3b82f6' : '#1e3a8a',
                    strokeOpacity: 0.5,
                    strokeWeight: 1,
                  }}
                />
              </>
            )}
          </GoogleMap>
        </div>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border p-6 text-center ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4 animate-bounce" />
            <h3 className={`text-lg font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {modal.type === 'confirm' ? 'Confirm SOS' : 'Alert'}
            </h3>
            <p className={`text-sm font-medium mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {modal.message}
            </p>
            <div className="flex gap-3 justify-center">
              {modal.type === 'confirm' ? (
                <>
                  <Button variant="outline" className={`flex-1 rounded-xl h-12 font-bold ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : ''}`} onClick={() => setModal({ ...modal, isOpen: false })}>Cancel</Button>
                  <Button variant="destructive" className="flex-1 rounded-xl h-12 font-bold bg-red-600 hover:bg-red-700" onClick={modal.onConfirm}>Confirm SOS</Button>
                </>
              ) : (
                <Button className={`w-full rounded-xl h-12 font-bold ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-navy hover:bg-blue-900 text-white'}`} onClick={() => setModal({ ...modal, isOpen: false })}>Acknowledge</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
