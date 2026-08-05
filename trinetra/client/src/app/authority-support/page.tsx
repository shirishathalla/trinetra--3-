'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AuthoritySupportPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');

  const activeTheme = theme === 'colorful' ? 'dark' : theme;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role === 'tourist')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const res = await api.get('/support');
        setSupportTickets(res.data.data);
      } catch (err) {
        console.error('Failed to fetch support tickets', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role !== 'tourist') {
      fetchSupport();
    }
  }, [isAuthenticated, user]);

  const resolveSupportTicket = async (id: string) => {
    try {
      await api.put(`/support/${id}/resolve`);
      setSupportTickets(prev => prev.map(t => t._id === id ? { ...t, status: 'resolved' } : t));
    } catch (err) {
      alert('Failed to resolve support ticket.');
    }
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = 
      (ticket.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && ticket.status === filterStatus;
  });

  if (loading || authLoading) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${activeTheme === 'dark' ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>Loading Support Hub...</div>;
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
          <div className={`p-2 rounded-sm ${activeTheme === 'dark' ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Support Operations Hub</h1>
            <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Citizen Inquiry Management</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className={`flex p-1 rounded-sm border ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm ${filterStatus === 'all' ? (activeTheme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm') : (activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500')}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('open')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm ${filterStatus === 'open' ? (activeTheme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm') : (activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500')}`}
            >
              Open
            </button>
            <button 
              onClick={() => setFilterStatus('resolved')}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm ${filterStatus === 'resolved' ? (activeTheme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm') : (activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500')}`}
            >
              Resolved
            </button>
          </div>
          <div className="relative w-full md:w-72">
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input 
              placeholder="Search inquiries..." 
              className={`pl-8 rounded-sm h-9 text-sm ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-navy'}`}
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
              <MessageSquare className="mr-2 h-4 w-4" />
              Inquiry Log
            </h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${activeTheme === 'dark' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {supportTickets.filter(t => t.status === 'open').length} Action Required
            </span>
          </div>
          
          <div className="flex-1 p-0 overflow-x-auto">
            {filteredTickets.length === 0 ? (
              <div className={`p-12 flex flex-col items-center justify-center text-center ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <p className="text-lg font-bold uppercase tracking-widest">No Inquiries Found</p>
                <p className="text-xs uppercase mt-2">No tickets match your current filters.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className={`text-xs uppercase font-bold border-b tracking-wider ${activeTheme === 'dark' ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  <tr>
                    <th scope="col" className="px-6 py-4">Status & Time</th>
                    <th scope="col" className="px-6 py-4">Sender Profile</th>
                    <th scope="col" className="px-6 py-4 w-1/2">Message Log</th>
                    <th scope="col" className="px-6 py-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${activeTheme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {filteredTickets.map(ticket => (
                    <tr key={ticket._id} className={`transition-colors ${activeTheme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          {ticket.status === 'resolved' ? (
                            <span className={`inline-flex items-center w-fit px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider border ${activeTheme === 'dark' ? 'bg-green-900/30 text-green-400 border-green-800' : 'text-green-700 bg-green-50 border-green-200'}`}>
                              <CheckCircle className="h-3 w-3 mr-1" /> Resolved
                            </span>
                          ) : (
                            <span className={`inline-flex items-center w-fit px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider border ${activeTheme === 'dark' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' : 'text-yellow-700 bg-yellow-50 border-yellow-200'}`}>
                              <Clock className="h-3 w-3 mr-1" /> Open
                            </span>
                          )}
                          <span className={`text-xs ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {new Date(ticket.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className={`font-bold uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{ticket.firstName} {ticket.lastName}</p>
                        <p className={`text-xs mt-1 ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {ticket.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`p-3 rounded-sm border ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          {ticket.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                        {ticket.status === 'open' ? (
                          <Button size="sm" onClick={() => resolveSupportTicket(ticket._id)} className={`h-8 text-xs rounded-sm font-bold shadow-sm ${activeTheme === 'dark' ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                            Resolve Ticket
                          </Button>
                        ) : (
                          <Button size="sm" disabled variant="outline" className={`h-8 text-xs rounded-sm font-bold shadow-sm ${activeTheme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                            Archived
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
