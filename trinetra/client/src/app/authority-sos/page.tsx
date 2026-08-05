'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, AlertTriangle, Phone, Navigation, Search, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AuthoritySOSPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTheme = theme === 'colorful' ? 'dark' : theme;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role === 'tourist')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const res = await api.get('/sos/active');
        setSosAlerts(res.data);
      } catch (err) {
        console.error('Failed to fetch SOS alerts', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role !== 'tourist') {
      fetchSOS();
      const interval = setInterval(fetchSOS, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const resolveSOS = async (id: string, status: string) => {
    try {
      await api.put(`/sos/${id}/resolve`, { status, resolutionNotes: 'Resolved from SOS Operations' });
      setSosAlerts(prev => prev.filter(alert => alert._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to resolve SOS alert');
    }
  };

  const filteredAlerts = sosAlerts.filter(alert => 
    (alert.incidentId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (alert.tourist?.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (alert.tourist?.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (alert.tourist?.phone || '').includes(searchQuery)
  );

  if (loading || authLoading) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${activeTheme === 'dark' ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>Loading SOS Registry...</div>;
  }

  return (
    <div className={`flex-1 min-h-screen pt-20 pb-12 transition-colors duration-300 font-sans ${activeTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      <div className={`w-full border-b px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <Link href="/authority-dashboard">
            <Button variant="outline" size="sm" className={`h-8 w-8 p-0 rounded-sm ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className={`p-2 rounded-sm ${activeTheme === 'dark' ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600'}`}>
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dispatch Queue Operations</h1>
            <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Active Critical Incidents</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input 
              placeholder="Search by ID, name, or phone..." 
              className={`pl-8 rounded-sm h-9 text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-red-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-red-600'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 mt-6">
        <div className={`border rounded-sm flex flex-col min-h-[600px] ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest flex items-center ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              SOS Incident Log
            </h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${activeTheme === 'dark' ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
              {filteredAlerts.length} Critical
            </span>
          </div>
          
          <div className="flex-1 p-0 overflow-x-auto">
            {filteredAlerts.length === 0 ? (
              <div className={`p-12 flex flex-col items-center justify-center text-center ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <p className="text-lg font-bold uppercase tracking-widest">No Active Incidents</p>
                <p className="text-xs uppercase mt-2">The dispatch queue is currently clear.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className={`text-xs uppercase font-bold border-b tracking-wider ${activeTheme === 'dark' ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  <tr>
                    <th scope="col" className="px-6 py-4">Incident ID</th>
                    <th scope="col" className="px-6 py-4">Tourist Identity</th>
                    <th scope="col" className="px-6 py-4">Location (Coordinates)</th>
                    <th scope="col" className="px-6 py-4">Device Status</th>
                    <th scope="col" className="px-6 py-4">Time Elapsed</th>
                    <th scope="col" className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${activeTheme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {filteredAlerts.map(alert => {
                    const elapsed = Math.floor((Date.now() - new Date(alert.createdAt).getTime()) / 60000);
                    
                    return (
                      <tr key={alert._id} className={`transition-colors ${activeTheme === 'dark' ? 'bg-red-950/20 hover:bg-red-900/40' : 'bg-red-50/50 hover:bg-red-50'}`}>
                        <td className="px-6 py-4">
                          <span className={`font-mono text-xs px-2 py-1 rounded-sm border ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                            #{alert.incidentId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`font-bold uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{alert.tourist?.firstName} {alert.tourist?.lastName}</p>
                          <p className={`text-xs flex items-center mt-1 ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <Phone className="h-3 w-3 mr-1" /> {alert.tourist?.phone}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`p-2 rounded-sm text-xs font-mono inline-flex gap-4 border ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-blue-400' : 'bg-slate-50 border-slate-200 text-navy'}`}>
                            <span>LAT: {alert.location?.coordinates[1]?.toFixed(5) || '0.00000'}</span>
                            <span>LNG: {alert.location?.coordinates[0]?.toFixed(5) || '0.00000'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <p className={`text-xs font-bold uppercase tracking-wider flex items-center ${alert.deviceInfo?.batteryLevel < 20 ? 'text-red-500 animate-pulse' : (activeTheme === 'dark' ? 'text-green-400' : 'text-green-600')}`}>
                              BAT: {alert.deviceInfo?.batteryLevel || '--'}% | NET: {alert.deviceInfo?.networkStatus || 'Unknown'}
                            </p>
                            <p className={`text-[10px] font-bold uppercase ${alert.deviceInfo?.deviceType === 'Desktop' ? 'text-red-500' : (activeTheme === 'dark' ? 'text-blue-400' : 'text-blue-600')}`}>
                              DEV: {alert.deviceInfo?.deviceType || 'Smartphone'}
                            </p>
                            {alert.deviceInfo?.deviceType === 'Desktop' && (
                              <p className="text-[9px] font-bold text-red-600 bg-red-500/20 px-1.5 py-0.5 rounded-sm inline-block w-fit mt-0.5">
                                ⚠️ LOW GPS PRECISION (WI-FI)
                              </p>
                            )}
                            <p className={`text-[9px] truncate max-w-[200px] mt-0.5 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} title={alert.deviceInfo?.userAgent}>
                              {alert.deviceInfo?.userAgent || 'User Agent Data Not Captured'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${elapsed > 10 ? 'text-red-500 animate-pulse' : (activeTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')}`}>
                            {elapsed} MIN AGO
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-2 items-center">
                          <Button size="sm" variant="outline" className={`h-8 text-xs rounded-sm font-bold shadow-sm ${activeTheme === 'dark' ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`} onClick={() => window.open(`https://maps.google.com/?q=${alert.location?.coordinates[1]},${alert.location?.coordinates[0]}`, '_blank')}>
                            <Navigation className="h-3 w-3 mr-1.5" /> Plot
                          </Button>
                          <Button size="sm" onClick={() => resolveSOS(alert._id, 'resolved')} className={`h-8 text-xs rounded-sm font-bold shadow-sm ${activeTheme === 'dark' ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                            Resolve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => resolveSOS(alert._id, 'false_alarm')} className={`h-8 text-xs rounded-sm font-bold shadow-sm ${activeTheme === 'dark' ? 'bg-transparent border border-red-600 text-red-500 hover:bg-red-900/30' : 'bg-transparent border border-red-300 text-red-600 hover:bg-red-50'}`}>
                            Dismiss
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
