'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Users, Activity, CheckCircle, XCircle, ShieldAlert, Navigation, Phone, MapPin, Search, Edit, Settings, Database, Server, X, MessageSquare, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function AuthorityDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [tourists, setTourists] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTourist, setEditingTourist] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [modalMessage, setModalMessage] = useState<{title: string, message: string, type: 'error' | 'success'} | null>(null);

  // Dashboards strictly enforce Light/Dark to maintain data legibility
  const activeTheme = theme === 'colorful' ? 'dark' : theme;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role === 'tourist')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sosRes, touristsRes, supportRes] = await Promise.all([
          api.get('/authority/dashboard'),
          api.get('/sos/active'),
          api.get('/authority/tourists?limit=50'),
          api.get('/support')
        ]);
        setStats(statsRes.data);
        setSosAlerts(sosRes.data);
        setTourists(touristsRes.data.tourists);
        setSupportTickets(supportRes.data.data.filter((t: any) => t.status === 'open'));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role !== 'tourist') {
      fetchData();
      // Poll every 10 seconds for active SOS
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const resolveSOS = async (id: string, status: string) => {
    try {
      await api.put(`/sos/${id}/resolve`, { status, resolutionNotes: 'Resolved from dashboard' });
      setSosAlerts(prev => prev.filter(alert => alert._id !== id));
      setStats((prev: any) => ({ ...prev, activeSOS: Math.max(0, prev.activeSOS - 1) }));
      setModalMessage({ title: 'Success', message: `SOS Alert marked as ${status.replace('_', ' ')}.`, type: 'success' });
    } catch (err) {
      setModalMessage({ title: 'Action Failed', message: 'Failed to resolve SOS alert. Please try again.', type: 'error' });
    }
  };

  const verifyTourist = async (id: string, status: string) => {
    try {
      await api.put(`/authority/tourists/${id}/verify`, { status });
      setTourists(prev => prev.map(t => t._id === id ? { ...t, verificationStatus: status } : t));
      setStats((prev: any) => ({
        ...prev,
        verifiedTourists: status === 'verified' ? prev.verifiedTourists + 1 : prev.verifiedTourists,
        pendingTourists: prev.pendingTourists > 0 ? prev.pendingTourists - 1 : 0
      }));
    } catch (err) {
      setModalMessage({ title: 'Action Failed', message: 'Failed to update tourist verification status.', type: 'error' });
    }
  };

  const handleEditSave = async () => {
    try {
      const res = await api.put(`/authority/tourists/${editingTourist._id}`, editFormData);
      setTourists(prev => prev.map(t => t._id === editingTourist._id ? { ...t, ...editFormData } : t));
      setEditingTourist(null);
      setModalMessage({ title: 'Success', message: 'Tourist profile updated successfully.', type: 'success' });
    } catch (err) {
      setModalMessage({ title: 'Action Failed', message: 'Failed to update tourist details.', type: 'error' });
    }
  };

  const resolveSupportTicket = async (id: string) => {
    try {
      await api.put(`/support/${id}/resolve`);
      setSupportTickets(prev => prev.filter(t => t._id !== id));
      setModalMessage({ title: 'Success', message: 'Support ticket resolved.', type: 'success' });
    } catch (err) {
      setModalMessage({ title: 'Action Failed', message: 'Failed to resolve support ticket.', type: 'error' });
    }
  };

  const filteredTourists = tourists.filter(t => 
    (t.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.phone || '').includes(searchQuery) ||
    (t.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || authLoading) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${activeTheme === 'dark' ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>Connecting to Dispatch Core...</div>;
  }

  // Edge-to-edge NOC (Network Operations Center) layout, but using app's consistent color palette
  return (
    <div className={`flex-1 min-h-screen pt-20 pb-12 transition-colors duration-300 font-sans ${activeTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* Edge-to-Edge Control Ribbon */}
      <div className={`w-full border-b px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-lg' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-sm ${activeTheme === 'dark' ? 'bg-blue-900/40 text-blue-400' : 'bg-navy text-white'}`}>
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-navy'}`}>Command Operations Center</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Live Data Stream: Connected</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className={`flex items-center px-3 py-1.5 border rounded-sm font-mono text-xs font-bold uppercase ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
            <Database className="mr-2 h-3 w-3" />
            Node: Master-1
          </div>
          <Link href="/authority-logs">
            <Button variant="outline" className={`w-full md:w-auto font-bold uppercase tracking-widest rounded-sm ${activeTheme === 'dark' ? 'border-slate-500 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
              <FileText className="mr-2 h-4 w-4" /> Audit Logs
            </Button>
          </Link>
          <Link href="/authority-visibility">
            <Button variant="outline" className={`w-full md:w-auto font-bold uppercase tracking-widest rounded-sm ${activeTheme === 'dark' ? 'border-blue-500 text-blue-400 hover:bg-blue-900/30' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}>
              <Activity className="mr-2 h-4 w-4" /> NOC Visibility
            </Button>
          </Link>
          <Link href="/authority-map" className="w-full md:w-auto">
            <Button className={`w-full font-bold uppercase tracking-widest rounded-sm shadow-md ${activeTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-navy hover:bg-blue-900 text-white'}`}>
              <Navigation className="mr-2 h-3 w-3" /> Launch Map Grid
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 mt-6 space-y-6">
        
        {/* Dense Stats Row - Sharp edges, minimal padding */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 border rounded-sm flex flex-col justify-between h-24 ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start">
              <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Network Users</p>
              <Users className={`h-4 w-4 ${activeTheme === 'dark' ? 'text-blue-400' : 'text-navy'}`} />
            </div>
            <h3 className={`text-3xl font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats?.totalTourists || 0}</h3>
          </div>
          
          <div className={`p-4 border rounded-sm flex flex-col justify-between h-24 relative overflow-hidden ${stats?.activeSOS > 0 ? (activeTheme === 'dark' ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-300') : (activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm')}`}>
            {stats?.activeSOS > 0 && <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />}
            <div className="flex justify-between items-start">
              <p className={`text-xs font-bold uppercase tracking-widest ${stats?.activeSOS > 0 ? 'text-red-500' : (activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500')}`}>Critical Incidents</p>
              <AlertTriangle className={`h-4 w-4 ${stats?.activeSOS > 0 ? 'text-red-500 animate-bounce' : (activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`} />
            </div>
            <h3 className={`text-3xl font-bold ${stats?.activeSOS > 0 ? 'text-red-500' : (activeTheme === 'dark' ? 'text-white' : 'text-slate-900')}`}>{stats?.activeSOS || 0}</h3>
          </div>
          
          <div className={`p-4 border rounded-sm flex flex-col justify-between h-24 ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start">
              <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Cleared Access</p>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <h3 className={`text-3xl font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats?.verifiedTourists || 0}</h3>
          </div>
          
          <Link href="/authority-tourists" className="block">
            <div className={`p-4 border rounded-sm flex flex-col justify-between h-24 transition-colors hover:shadow-md ${activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-start">
                <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Pending Review</p>
                <Shield className="h-4 w-4 text-yellow-500" />
              </div>
              <h3 className={`text-3xl font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats?.pendingTourists || 0}</h3>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Active SOS Panel (takes up 1 column on XL screens) */}
          <div className={`xl:col-span-1 border rounded-sm flex flex-col ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`p-3 border-b flex items-center justify-between ${activeTheme === 'dark' ? (sosAlerts.length > 0 ? 'bg-red-950/50 border-red-900' : 'bg-slate-900/50 border-slate-700') : (sosAlerts.length > 0 ? 'bg-red-700 border-red-800' : 'bg-slate-50 border-slate-200')}`}>
              <h2 className={`text-xs font-bold uppercase tracking-widest flex items-center ${activeTheme === 'dark' ? (sosAlerts.length > 0 ? 'text-red-400' : 'text-slate-300') : (sosAlerts.length > 0 ? 'text-white' : 'text-slate-700')}`}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Dispatch Queue
              </h2>
              <div className="flex items-center gap-2">
                {sosAlerts.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${activeTheme === 'dark' ? 'bg-red-900 text-white' : 'bg-white text-red-700'}`}>
                    {sosAlerts.length} Active
                  </span>
                )}
                <Link href="/authority-sos" className={`text-[10px] font-bold uppercase tracking-widest hover:underline ${activeTheme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-black'}`}>
                  See All
                </Link>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[600px] p-0">
              {sosAlerts.length === 0 ? (
                <div className={`p-8 flex flex-col items-center justify-center text-center h-48 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  <CheckCircle className="h-8 w-8 mb-2" />
                  <p className="text-sm font-bold uppercase tracking-widest">Queue Clear</p>
                </div>
              ) : (
                <div className={`divide-y ${activeTheme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {sosAlerts.map(alert => (
                    <div key={alert._id} className={`p-4 transition-colors ${activeTheme === 'dark' ? 'bg-slate-900/50 hover:bg-slate-800' : 'bg-white hover:bg-red-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-mono text-xs px-1.5 py-0.5 rounded-sm border ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                          #{alert.incidentId}
                        </span>
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-sm animate-pulse uppercase">
                          Action Required
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        <p className={`font-bold text-base uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{alert.tourist?.firstName} {alert.tourist?.lastName}</p>
                        <p className={`text-sm flex items-center ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}><Phone className="h-3 w-3 mr-1" /> {alert.tourist?.phone}</p>
                        
                        <div className={`mt-2 p-2 rounded-sm text-xs font-mono flex flex-col gap-1 ${activeTheme === 'dark' ? 'bg-slate-900 border border-slate-700 text-blue-400' : 'bg-slate-50 border border-slate-200 text-navy'}`}>
                          <span>LAT: {alert.location?.coordinates[1].toFixed(5)}</span>
                          <span>LNG: {alert.location?.coordinates[0].toFixed(5)}</span>
                          <span className={alert.deviceInfo?.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}>
                            BAT: {alert.deviceInfo?.batteryLevel}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className={`w-full rounded-sm font-bold shadow-sm text-xs h-8 ${activeTheme === 'dark' ? 'border-slate-600 text-white hover:bg-slate-700 bg-transparent' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`} onClick={() => window.open(`https://maps.google.com/?q=${alert.location?.coordinates[1]},${alert.location?.coordinates[0]}`, '_blank')}>
                          Plot Coordinates
                        </Button>
                        <div className="flex gap-2">
                          <Button size="sm" className={`flex-1 rounded-sm font-bold shadow-sm text-xs h-8 ${activeTheme === 'dark' ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`} onClick={() => resolveSOS(alert._id, 'resolved')}>
                            Resolve
                          </Button>
                          <Button variant="outline" size="sm" className={`flex-1 rounded-sm font-bold shadow-sm text-xs h-8 ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`} onClick={() => resolveSOS(alert._id, 'false_alarm')}>
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Database Table (takes up 2 columns on XL screens) */}
          <div className={`xl:col-span-2 border rounded-sm flex flex-col ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`p-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h2 className={`text-xs font-bold uppercase tracking-widest flex items-center shrink-0 ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Database className="mr-2 h-4 w-4" />
                Tourist Registry Database
              </h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                  <Input 
                    placeholder="Query database..." 
                    className={`pl-8 rounded-sm h-8 text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-navy'}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link href="/authority-tourists" className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hover:underline ${activeTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-navy hover:text-blue-700'}`}>
                  See All
                </Link>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto p-0">
              {filteredTourists.length === 0 ? (
                <div className={`p-12 text-center text-sm font-semibold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  No records match query parameters.
                </div>
              ) : (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className={`text-xs uppercase font-bold border-b tracking-wider ${activeTheme === 'dark' ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    <tr>
                      <th scope="col" className="px-4 py-3">Identity</th>
                      <th scope="col" className="px-4 py-3">Contact</th>
                      <th scope="col" className="px-4 py-3">Clearance Status</th>
                      <th scope="col" className="px-4 py-3 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${activeTheme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                    {filteredTourists.map(tourist => (
                      <tr key={tourist._id} className={`transition-colors ${activeTheme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <p className={`font-bold uppercase ${activeTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{tourist.firstName} {tourist.lastName}</p>
                          <p className={`font-mono text-xs ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{tourist._id.substring(0, 8)}...</p>
                        </td>
                        <td className={`px-4 py-3 font-medium ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <p>{tourist.phone}</p>
                          <p className="text-xs text-slate-500">{tourist.user?.email || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-3">
                          {tourist.verificationStatus === 'verified' && (
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-sm uppercase tracking-wider border ${activeTheme === 'dark' ? 'bg-green-900/30 text-green-400 border-green-800' : 'text-green-700 bg-green-50 border-green-200'}`}>
                              Approved
                            </span>
                          )}
                          {tourist.verificationStatus === 'pending' && (
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-sm uppercase tracking-wider border ${activeTheme === 'dark' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'text-yellow-700 bg-yellow-50 border-yellow-200'}`}>
                              Pending
                            </span>
                          )}
                          {tourist.verificationStatus === 'rejected' && (
                            <span className={`px-2 py-0.5 text-xs font-bold rounded-sm uppercase tracking-wider border ${activeTheme === 'dark' ? 'bg-red-900/30 text-red-400 border-red-800' : 'text-red-700 bg-red-50 border-red-200'}`}>
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex justify-end gap-2 items-center">
                          {tourist.verificationStatus === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => verifyTourist(tourist._id, 'verified')} className={`h-7 text-xs rounded-sm font-bold shadow-sm px-3 ${activeTheme === 'dark' ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => verifyTourist(tourist._id, 'rejected')} className="h-7 text-xs rounded-sm font-bold shadow-sm px-3">
                                Reject
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingTourist(tourist);
                              setEditFormData({
                                firstName: tourist.firstName,
                                lastName: tourist.lastName,
                                phone: tourist.phone,
                                dateOfBirth: tourist.dateOfBirth ? tourist.dateOfBirth.split('T')[0] : '',
                                medicalDetails: tourist.medicalDetails || { bloodGroup: '', allergies: '', chronicConditions: '' },
                                emergencyContacts: tourist.emergencyContacts || []
                              });
                            }} 
                            className={`h-7 text-xs rounded-sm font-bold shadow-sm px-3 bg-transparent ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}
                          >
                            Edit Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Command Level Visibility Panel (1 column on XL screens) */}
          <div className={`xl:col-span-1 border rounded-sm flex flex-col ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`p-3 border-b flex items-center justify-between ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h2 className={`text-xs font-bold uppercase tracking-widest flex items-center ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <Activity className="mr-2 h-4 w-4" />
                Command Visibility
              </h2>
              <Link href="/authority-visibility" className={`text-[10px] font-bold uppercase tracking-widest hover:underline ${activeTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-navy hover:text-blue-700'}`}>
                See All
              </Link>
            </div>
            
            <div className="flex-1 p-4 space-y-6">
              {/* Network Load */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Network Load</span>
                  <span className={`text-xs font-mono font-bold ${activeTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>42%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${activeTheme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className="h-full bg-green-500 w-[42%]"></div>
                </div>
              </div>

              {/* Server Latency */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Server Ping</span>
                  <span className={`text-xs font-mono font-bold ${activeTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>14ms</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${activeTheme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div className="h-full bg-blue-500 w-[14%]"></div>
                </div>
              </div>
              
              {/* Active Field Units */}
              <div className={`mt-4 p-3 border rounded-sm ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Active Field Units</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className={`text-xs font-semibold ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Alpha Team (North Sector)</span>
                    </div>
                    <span className={`text-[10px] font-mono ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>ON-GRID</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className={`text-xs font-semibold ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Bravo Team (Border Check)</span>
                    </div>
                    <span className={`text-[10px] font-mono ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>ON-GRID</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                      <span className={`text-xs font-semibold ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Charlie Team (High Alt)</span>
                    </div>
                    <span className={`text-[10px] font-mono ${activeTheme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'}`}>WEAK-SIG</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className={`mt-4 pt-4 border-t ${activeTheme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Quick Directives</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className={`h-8 text-[10px] font-bold tracking-widest rounded-sm ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                    INITIATE SWEEP
                  </Button>
                  <Button variant="outline" size="sm" className={`h-8 text-[10px] font-bold tracking-widest rounded-sm ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>
                    BROADCAST ALERT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Inquiries Panel */}
        <div className={`border rounded-sm flex flex-col ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className={`p-3 border-b flex items-center justify-between ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h2 className={`text-xs font-bold uppercase tracking-widest flex items-center ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Support Inquiries
            </h2>
            <div className="flex items-center gap-3">
              {supportTickets.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${activeTheme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {supportTickets.length} Open
                </span>
              )}
              <Link href="/authority-support" className={`text-[10px] font-bold uppercase tracking-widest hover:underline ${activeTheme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-navy hover:text-blue-700'}`}>
                See All
              </Link>
            </div>
          </div>
          <div className="p-0 overflow-x-auto">
            {supportTickets.length === 0 ? (
              <div className={`p-8 text-center text-sm font-semibold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                No open support inquiries.
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className={`text-xs uppercase font-bold border-b tracking-wider ${activeTheme === 'dark' ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  <tr>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3 w-1/2">Message</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${activeTheme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {supportTickets.map(ticket => (
                    <tr key={ticket._id} className={`transition-colors ${activeTheme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-4 py-3">
                        <p className={`font-bold ${activeTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{ticket.firstName} {ticket.lastName}</p>
                        <p className={`text-xs ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{ticket.email}</p>
                      </td>
                      <td className={`px-4 py-3 max-w-md truncate whitespace-normal ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {ticket.message}
                      </td>
                      <td className={`px-4 py-3 text-xs ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(ticket.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" onClick={() => resolveSupportTicket(ticket._id)} className={`h-7 text-xs rounded-sm font-bold shadow-sm px-3 ${activeTheme === 'dark' ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                          Mark Resolved
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Message/Error Modal */}
      {modalMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-sm shadow-2xl overflow-hidden border-2 ${activeTheme === 'dark' ? 'bg-slate-900' : 'bg-white'} ${modalMessage.type === 'error' ? 'border-red-500/50' : 'border-green-500/50'}`}>
            <div className={`p-4 flex justify-between items-center ${modalMessage.type === 'error' ? (activeTheme === 'dark' ? 'bg-red-950/50' : 'bg-red-50') : (activeTheme === 'dark' ? 'bg-green-950/50' : 'bg-green-50')}`}>
              <div className={`flex items-center gap-2 font-bold uppercase tracking-wider ${modalMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {modalMessage.type === 'error' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                {modalMessage.title}
              </div>
              <button onClick={() => setModalMessage(null)} className={`${activeTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className={`text-base font-medium mb-6 ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {modalMessage.message}
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setModalMessage(null)} className={`rounded-sm font-bold ${activeTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-navy hover:bg-blue-900 text-white'}`}>Acknowledge</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Overlay */}
      {editingTourist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-sm border shadow-2xl max-h-[90vh] overflow-y-auto ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Settings className="mr-2 h-4 w-4" /> Modify Record: {editingTourist._id.substring(0,8)}
              </h3>
              <button onClick={() => setEditingTourist(null)} className={`${activeTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className={`text-xs uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>First Name</Label>
                  <Input 
                    value={editFormData?.firstName || ''} 
                    onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className={`text-xs uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Last Name</Label>
                  <Input 
                    value={editFormData?.lastName || ''} 
                    onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <Label className={`text-xs uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Contact Number</Label>
                  <Input 
                    value={editFormData?.phone || ''} 
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                  />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <Label className={`text-xs uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Date of Birth</Label>
                  <Input 
                    type="date"
                    value={editFormData?.dateOfBirth || ''} 
                    onChange={e => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                    className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                  />
                </div>
              </div>
              
              <div className={`border-t pt-4 ${activeTheme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Medical Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className={`text-xs uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Blood Type</Label>
                    <Input 
                      value={editFormData?.medicalDetails?.bloodGroup || ''} 
                      onChange={e => setEditFormData({ 
                        ...editFormData, 
                        medicalDetails: { ...editFormData.medicalDetails, bloodGroup: e.target.value }
                      })}
                      className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={`text-xs uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Allergies</Label>
                    <Input 
                      value={editFormData?.medicalDetails?.allergies || ''} 
                      onChange={e => setEditFormData({ 
                        ...editFormData, 
                        medicalDetails: { ...editFormData.medicalDetails, allergies: e.target.value }
                      })}
                      className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={`text-xs uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Conditions</Label>
                    <Input 
                      value={editFormData?.medicalDetails?.chronicConditions || ''} 
                      onChange={e => setEditFormData({ 
                        ...editFormData, 
                        medicalDetails: { ...editFormData.medicalDetails, chronicConditions: e.target.value }
                      })}
                      className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className={`flex justify-end gap-3 pt-4 border-t ${activeTheme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <Button variant="outline" onClick={() => setEditingTourist(null)} className={`rounded-sm font-bold shadow-sm h-9 bg-transparent ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>Cancel</Button>
                <Button onClick={handleEditSave} className={`rounded-sm font-bold shadow-sm h-9 ${activeTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-navy hover:bg-blue-900 text-white'}`}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
