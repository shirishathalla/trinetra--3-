'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, Libraries } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Navigation, Activity, CheckCircle, Phone, ArrowLeft, AlertTriangle, Users } from 'lucide-react';

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

export default function AuthorityLiveMap() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [activeTourists, setActiveTourists] = useState<any[]>([]);
  const [selectedSOS, setSelectedSOS] = useState<any>(null);
  const [selectedTourist, setSelectedTourist] = useState<any>(null);
  const [modal, setModal] = useState<{ isOpen: boolean, type: 'alert' | 'confirm', message: string, onConfirm?: () => void }>({ isOpen: false, type: 'alert', message: '' });

  const isDark = theme === 'dark' || theme === 'colorful';
  const isColorful = theme === 'colorful';

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role === 'tourist')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const [sosRes, touristsRes] = await Promise.all([
          api.get('/sos/active'),
          api.get('/gps/latest')
        ]);
        setSosAlerts(sosRes.data);
        setActiveTourists(touristsRes.data);
      } catch (err) {
        console.error('Failed to fetch map data', err);
      }
    };

    if (isAuthenticated && user?.role !== 'tourist') {
      fetchMapData();
      const interval = setInterval(fetchMapData, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const triggerResolveSOS = (id: string) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      message: 'Are you sure you want to resolve this SOS alert? This will clear it from the active map.',
      onConfirm: async () => {
        setModal({ isOpen: false, type: 'alert', message: '' });
        try {
          await api.put(`/sos/${id}/resolve`, { status: 'resolved', resolutionNotes: 'Resolved from Central Map' });
          setSosAlerts(prev => prev.filter(alert => alert._id !== id));
          setSelectedSOS(null);
          setModal({ isOpen: true, type: 'alert', message: 'SOS Successfully Resolved.' });
        } catch (err) {
          setModal({ isOpen: true, type: 'alert', message: 'Failed to resolve SOS. Please try again.' });
        }
      }
    });
  };

  if (authLoading || !isLoaded) return (
    <div className={`flex-1 flex items-center justify-center font-bold uppercase tracking-widest ${isDark ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>
      Initializing Command Grid...
    </div>
  );

  return (
    <div className={`flex-1 flex flex-col relative h-[calc(100vh-64px)] ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="absolute top-24 left-6 md:left-10 z-10 w-full max-w-md pr-8 flex flex-col gap-4">
        <Button 
          variant="outline" 
          className={`w-28 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg backdrop-blur-md transition-all hover:-translate-x-1 ${isDark ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-navy'}`}
          onClick={() => router.push('/authority-dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className={`shadow-2xl backdrop-blur-xl border-t-[6px] rounded-3xl overflow-hidden transition-all ${
          isColorful ? 'bg-navy/80 border-t-red-500 border-x-white/10 border-b-white/10' : 
          (isDark ? 'bg-slate-900/80 border-t-red-500 border-x-slate-700 border-b-slate-700' : 'bg-white/95 border-t-red-600 border-x-slate-200 border-b-slate-200')
        }`}>
          <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-red-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <Navigation className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-black uppercase tracking-wider text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Authority Command Map</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {sosAlerts.length > 0 && <span className="text-red-500 mr-2 animate-pulse">{sosAlerts.length} SOS</span>}
                  {activeTourists.length} Active Tourists
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className={`flex justify-between items-center p-4 border rounded-2xl ${
              isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs uppercase font-bold tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Grid Status</span>
              <span className="text-xs font-black text-green-500 flex items-center tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                <Activity className="h-3.5 w-3.5 mr-1.5 animate-pulse" /> LIVE SYNC
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex-1 w-full relative min-h-screen">
        <div className={`absolute inset-0 border-t-4 z-10 pointer-events-none ${isColorful ? 'border-saffron' : isDark ? 'border-blue-600' : 'border-navy'}`}></div>
        <div className="absolute inset-0 z-0">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={sosAlerts.length > 0 ? { lat: sosAlerts[0].location.coordinates[1], lng: sosAlerts[0].location.coordinates[0] } : defaultCenter}
            zoom={sosAlerts.length > 0 ? 14 : 5}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: isDark ? darkMapStyle : []
            }}
          >
            {/* Standard Tourist Markers */}
            {activeTourists.map(tourist => {
              // Don't render a blue dot if they have an active SOS (to avoid overlapping)
              if (sosAlerts.some(sos => sos.tourist?._id === tourist.tourist._id)) return null;

              const position = {
                lat: tourist.location.coordinates[1],
                lng: tourist.location.coordinates[0]
              };

              return (
                <Marker 
                  key={`tourist-${tourist._id}`}
                  position={position} 
                  onClick={() => setSelectedTourist(tourist)}
                  icon={{
                    path: typeof window !== 'undefined' ? window.google.maps.SymbolPath.CIRCLE : 0,
                    scale: 6,
                    fillColor: isColorful ? '#f97316' : isDark ? '#3b82f6' : '#1e3a8a',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 1.5,
                  }} 
                />
              );
            })}

            {/* SOS Alert Markers */}
            {sosAlerts.map(alert => {
              const position = {
                lat: alert.location.coordinates[1],
                lng: alert.location.coordinates[0]
              };

              return (
                <div key={alert._id}>
                  <Marker 
                    position={position} 
                    onClick={() => { setSelectedSOS(alert); setSelectedTourist(null); }}
                    icon={{
                      path: typeof window !== 'undefined' ? window.google.maps.SymbolPath.CIRCLE : 0,
                      scale: 10,
                      fillColor: '#dc2626',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }} 
                  />
                  <Circle
                    center={position}
                    radius={300}
                    options={{
                      fillColor: '#dc2626',
                      fillOpacity: 0.15,
                      strokeColor: '#dc2626',
                      strokeOpacity: 0.6,
                      strokeWeight: 1,
                    }}
                  />
                </div>
              );
            })}

            {/* Tourist Info Window */}
            {selectedTourist && (
              <InfoWindow
                position={{
                  lat: selectedTourist.location.coordinates[1],
                  lng: selectedTourist.location.coordinates[0]
                }}
                onCloseClick={() => setSelectedTourist(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <div className="mb-2 pb-2 border-b border-slate-200">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest mb-1.5 inline-block ${isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>Active Tourist</span>
                    <h4 className="font-bold text-slate-900 uppercase text-sm truncate">{selectedTourist.tourist.firstName} {selectedTourist.tourist.lastName}</h4>
                  </div>
                  <div className="space-y-1.5 mb-2">
                    <p className="text-xs font-semibold text-slate-700 flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {selectedTourist.tourist.phone}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-100 truncate">Last Ping: {new Date(selectedTourist.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* SOS Info Window */}
            {selectedSOS && (
              <InfoWindow
                position={{
                  lat: selectedSOS.location.coordinates[1],
                  lng: selectedSOS.location.coordinates[0]
                }}
                onCloseClick={() => setSelectedSOS(null)}
              >
                <div className="p-2 min-w-[200px] max-w-[250px]">
                  <div className="mb-3 pb-3 border-b border-red-200">
                    <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest mb-1.5 inline-block">CRITICAL SOS</span>
                    <h4 className="font-bold text-slate-900 uppercase text-sm truncate">{selectedSOS.tourist?.firstName} {selectedSOS.tourist?.lastName}</h4>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-slate-700 flex items-center"><Phone className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> {selectedSOS.tourist?.phone}</p>
                    <p className="text-xs font-semibold text-slate-700 flex items-center"><Activity className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> Battery: {selectedSOS.deviceInfo?.batteryLevel}%</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-100 truncate">ID: {selectedSOS.incidentId}</p>
                  </div>
                  <Button size="sm" onClick={() => triggerResolveSOS(selectedSOS._id)} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-md h-9">
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> DISPATCH & RESOLVE
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border p-6 text-center ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <AlertTriangle className={`h-12 w-12 mx-auto mb-4 animate-bounce ${modal.type === 'alert' ? 'text-blue-500' : 'text-red-500'}`} />
            <h3 className={`text-lg font-black uppercase tracking-wider mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {modal.type === 'confirm' ? 'Confirm Action' : 'System Alert'}
            </h3>
            <p className={`text-sm font-medium mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {modal.message}
            </p>
            <div className="flex gap-3 justify-center">
              {modal.type === 'confirm' ? (
                <>
                  <Button variant="outline" className={`flex-1 rounded-xl h-12 font-bold ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : ''}`} onClick={() => setModal({ ...modal, isOpen: false })}>Cancel</Button>
                  <Button variant="destructive" className="flex-1 rounded-xl h-12 font-bold bg-green-600 hover:bg-green-700" onClick={modal.onConfirm}>Confirm</Button>
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
