'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Database, ArrowLeft, Search, Edit, Settings, XCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function AuthorityTouristsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  
  const [tourists, setTourists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingTourist, setEditingTourist] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  const activeTheme = theme === 'colorful' ? 'dark' : theme;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role === 'tourist')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchTourists = async () => {
      try {
        const res = await api.get('/authority/tourists?limit=100');
        setTourists(res.data.tourists);
      } catch (err) {
        console.error('Failed to fetch tourists', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role !== 'tourist') {
      fetchTourists();
    }
  }, [isAuthenticated, user]);

  const verifyTourist = async (id: string, status: string) => {
    try {
      await api.put(`/authority/tourists/${id}/verify`, { status });
      setTourists(prev => prev.map(t => t._id === id ? { ...t, verificationStatus: status } : t));
    } catch (err) {
      alert('Failed to update tourist verification status.');
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/authority/tourists/${editingTourist._id}`, editFormData);
      setTourists(prev => prev.map(t => t._id === editingTourist._id ? { ...t, ...editFormData } : t));
      setEditingTourist(null);
      alert('Tourist record updated successfully.');
    } catch (err) {
      alert('Failed to update tourist details.');
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    try {
      await api.put(`/authority/tourists/${editingTourist._id}/password`, { newPassword });
      setNewPassword('');
      alert('Password reset successful.');
    } catch (err) {
      alert('Failed to reset password.');
    }
  };

  const filteredTourists = tourists.filter(t => 
    (t.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.phone || '').includes(searchQuery) ||
    (t.touristId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || authLoading) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${activeTheme === 'dark' ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>Loading Tourist Registry...</div>;
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
          <div className={`p-2 rounded-sm ${activeTheme === 'dark' ? 'bg-blue-900/40 text-blue-400' : 'bg-navy text-white'}`}>
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Tourist Registry Database</h1>
            <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Master Clearance Record</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input 
              placeholder="Search by ID, name, email, or phone..." 
              className={`pl-8 rounded-sm h-9 text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-navy'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 mt-6">
        <div className={`border rounded-sm flex flex-col min-h-[600px] ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex-1 p-0 overflow-x-auto">
            {filteredTourists.length === 0 ? (
              <div className={`p-12 text-center text-sm font-semibold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                No records match query parameters.
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className={`text-xs uppercase font-bold border-b tracking-wider ${activeTheme === 'dark' ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  <tr>
                    <th scope="col" className="px-6 py-4">Tourist ID & Name</th>
                    <th scope="col" className="px-6 py-4">Demographics</th>
                    <th scope="col" className="px-6 py-4">Contact</th>
                    <th scope="col" className="px-6 py-4">Clearance Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${activeTheme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {filteredTourists.map(tourist => (
                    <tr key={tourist._id} className={`transition-colors ${activeTheme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={tourist.photoUrl?.startsWith('http') ? tourist.photoUrl : '/placeholder.jpg'} alt="" className={`w-10 h-10 rounded-full object-cover border ${activeTheme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`} onError={(e) => { (e.target as any).style.display = 'none'; }} />
                          <div>
                            <p className={`font-bold uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{tourist.firstName} {tourist.lastName}</p>
                            <p className={`font-mono text-xs ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{tourist.touristId || tourist._id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-medium capitalize ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{tourist.nationality || 'Unknown'}</p>
                        <p className={`text-xs ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>DOB: {tourist.dateOfBirth ? new Date(tourist.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                      </td>
                      <td className={`px-6 py-4 font-medium ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        <p>{tourist.phone}</p>
                        <p className="text-xs text-slate-500">{tourist.user?.email || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 flex justify-end gap-2 items-center">
                        {tourist.verificationStatus === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => verifyTourist(tourist._id, 'verified')} className={`h-8 text-xs rounded-sm font-bold shadow-sm px-4 ${activeTheme === 'dark' ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => verifyTourist(tourist._id, 'rejected')} className="h-8 text-xs rounded-sm font-bold shadow-sm px-4">
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
                              nationality: tourist.nationality,
                              identificationNumber: tourist.identificationNumber,
                              verificationStatus: tourist.verificationStatus,
                              medicalDetails: tourist.medicalDetails || { bloodGroup: '', allergies: '', chronicConditions: '' },
                              emergencyContacts: tourist.emergencyContacts?.length ? tourist.emergencyContacts : [{ name: '', relation: '', phone: '', countryCode: '+91' }],
                            });
                          }} 
                          className={`h-8 text-xs rounded-sm font-bold shadow-sm px-4 bg-transparent ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}
                        >
                          <Edit className="h-3 w-3 mr-1.5" /> Full Edit
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

      {editingTourist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-4xl rounded-sm border shadow-2xl max-h-[90vh] overflow-y-auto ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                <Settings className="mr-2 h-4 w-4" /> Full Profile Modification: {editingTourist.touristId || editingTourist._id.substring(0,8)}
              </h3>
              <button onClick={() => setEditingTourist(null)} className={`${activeTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <h4 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 ${activeTheme === 'dark' ? 'text-blue-400 border-slate-700' : 'text-navy border-slate-200'}`}>Personal Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>First Name</Label>
                      <Input value={editFormData?.firstName || ''} onChange={e => setEditFormData({ ...editFormData, firstName: e.target.value })} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Last Name</Label>
                      <Input value={editFormData?.lastName || ''} onChange={e => setEditFormData({ ...editFormData, lastName: e.target.value })} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Phone</Label>
                      <div className="flex gap-2">
                        <select 
                          value={editFormData?.countryCode || '+91'} 
                          onChange={(e) => setEditFormData({ ...editFormData, countryCode: e.target.value })}
                          className={`w-24 p-2 rounded-sm text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
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
                        <Input value={editFormData?.phone || ''} onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })} className={`flex-1 rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Date of Birth</Label>
                      <Input type="date" value={editFormData?.dateOfBirth || ''} onChange={e => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 ${activeTheme === 'dark' ? 'text-blue-400 border-slate-700' : 'text-navy border-slate-200'}`}>Clearance & Identity</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Nationality</Label>
                      <Input value={editFormData?.nationality || ''} onChange={e => setEditFormData({ ...editFormData, nationality: e.target.value })} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>ID Number</Label>
                      <Input value={editFormData?.identificationNumber || ''} onChange={e => setEditFormData({ ...editFormData, identificationNumber: e.target.value })} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Verification Override</Label>
                      <select 
                        value={editFormData?.verificationStatus || 'pending'} 
                        onChange={e => setEditFormData({ ...editFormData, verificationStatus: e.target.value })}
                        className={`w-full p-2 rounded-sm text-sm border focus:ring-2 focus:ring-blue-500 outline-none ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified (Approved)</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2 border-slate-200">
                    <h4 className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-blue-400 border-slate-700' : 'text-navy'}`}>
                      Emergency Contacts
                    </h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        if (editFormData?.emergencyContacts?.length < 3) {
                          setEditFormData((prev: any) => ({
                            ...prev,
                            emergencyContacts: [...prev.emergencyContacts, { name: '', relation: '', phone: '', countryCode: '+91' }]
                          }));
                        }
                      }}
                      disabled={editFormData?.emergencyContacts?.length >= 3}
                      className={`h-6 px-3 text-[10px] font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-600'}`}
                    >
                      + Add ({editFormData?.emergencyContacts?.length || 0}/3)
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {editFormData?.emergencyContacts?.map((contact: any, index: number) => (
                      <div key={index} className={`p-3 rounded-sm border space-y-3 relative ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        {(editFormData?.emergencyContacts?.length || 0) > 1 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const newContacts = [...editFormData.emergencyContacts];
                              newContacts.splice(index, 1);
                              setEditFormData((prev: any) => ({ ...prev, emergencyContacts: newContacts }));
                            }}
                            className={`absolute top-2 right-2 p-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-red-400 hover:bg-slate-800' : 'text-red-500 hover:bg-slate-200'}`}
                          >
                            Remove
                          </button>
                        )}
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Contact #{index + 1}</p>
                        
                        <div className="space-y-1.5">
                          <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Name</Label>
                          <Input 
                            value={contact.name} 
                            onChange={(e) => {
                              const newContacts = [...editFormData.emergencyContacts];
                              newContacts[index].name = e.target.value;
                              setEditFormData((prev: any) => ({ ...prev, emergencyContacts: newContacts }));
                            }}
                            className={`rounded-sm text-sm h-8 ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} 
                          />
                        </div>
                        
                        <div className="space-y-1.5">
                          <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Relation</Label>
                          <Input 
                            value={contact.relation} 
                            onChange={(e) => {
                              const newContacts = [...editFormData.emergencyContacts];
                              newContacts[index].relation = e.target.value;
                              setEditFormData((prev: any) => ({ ...prev, emergencyContacts: newContacts }));
                            }}
                            className={`rounded-sm text-sm h-8 ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} 
                          />
                        </div>
                        
                        <div className="space-y-1.5">
                          <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Phone</Label>
                          <div className="flex gap-2">
                            <select 
                              value={contact.countryCode || '+91'} 
                              onChange={(e) => {
                                const newContacts = [...editFormData.emergencyContacts];
                                newContacts[index].countryCode = e.target.value;
                                setEditFormData((prev: any) => ({ ...prev, emergencyContacts: newContacts }));
                              }}
                              className={`w-16 p-1 rounded-sm border focus:ring-2 focus:ring-blue-500 outline-none text-[10px] transition-all ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                            >
                              <option value="+91">+91</option>
                              <option value="+1">+1</option>
                              <option value="+44">+44</option>
                              <option value="+61">+61</option>
                              <option value="+971">+971</option>
                              <option value="+65">+65</option>
                              <option value="+49">+49</option>
                              <option value="+33">+33</option>
                            </select>
                            <Input 
                              value={contact.phone} 
                              onChange={(e) => {
                                const newContacts = [...editFormData.emergencyContacts];
                                newContacts[index].phone = e.target.value;
                                setEditFormData((prev: any) => ({ ...prev, emergencyContacts: newContacts }));
                              }}
                              type="tel" maxLength={10} pattern="[0-9]{10}"
                              className={`flex-1 rounded-sm text-sm h-8 ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 ${activeTheme === 'dark' ? 'text-blue-400 border-slate-700' : 'text-navy border-slate-200'}`}>Medical Directives</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Blood Type</Label>
                    <Input value={editFormData?.medicalDetails?.bloodGroup || ''} onChange={e => setEditFormData({ ...editFormData, medicalDetails: { ...editFormData.medicalDetails, bloodGroup: e.target.value }})} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Allergies</Label>
                    <Input value={editFormData?.medicalDetails?.allergies || ''} onChange={e => setEditFormData({ ...editFormData, medicalDetails: { ...editFormData.medicalDetails, allergies: e.target.value }})} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Chronic Conditions</Label>
                    <Input value={editFormData?.medicalDetails?.chronicConditions || ''} onChange={e => setEditFormData({ ...editFormData, medicalDetails: { ...editFormData.medicalDetails, chronicConditions: e.target.value }})} className={`rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 ${activeTheme === 'dark' ? 'text-blue-400 border-slate-700' : 'text-navy border-slate-200'}`}>Security & Authentication</h4>
                <div className="grid grid-cols-1 gap-4 max-w-sm">
                  <div className="space-y-1.5 flex flex-col">
                    <Label className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Force Password Reset</Label>
                    <div className="flex gap-2">
                      <Input type="text" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`flex-1 rounded-sm text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white' : 'bg-white border-slate-300'}`} />
                      <Button onClick={handlePasswordReset} className={`rounded-sm font-bold shadow-sm px-4 uppercase tracking-widest ${activeTheme === 'dark' ? 'bg-red-900/80 hover:bg-red-800 text-red-100' : 'bg-red-600 hover:bg-red-700 text-white'}`}>Reset</Button>
                    </div>
                    <p className={`text-[9px] mt-1 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>*This will immediately overwrite the tourist's current password.</p>
                  </div>
                </div>
              </div>
              
              <div className={`flex justify-end gap-3 pt-6 border-t ${activeTheme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
                <Button variant="outline" onClick={() => setEditingTourist(null)} className={`rounded-sm font-bold shadow-sm h-10 px-6 bg-transparent ${activeTheme === 'dark' ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`}>Cancel</Button>
                <Button onClick={handleEditSave} className={`rounded-sm font-bold shadow-sm h-10 px-8 uppercase tracking-widest ${activeTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-navy hover:bg-blue-900 text-white'}`}>Save Master Record</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
