'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, CheckCircle, Activity, FileText, UserCheck, UserX, ShieldAlert, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function AuthorityLogsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();
  
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTheme = theme === 'colorful' ? 'dark' : theme;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role === 'tourist')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/authority/logs');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role !== 'tourist') {
      fetchLogs();
    }
  }, [isAuthenticated, user]);

  const filteredLogs = logs.filter(log => {
    const searchString = `
      ${log.action} 
      ${log.performedBy?.firstName} 
      ${log.performedBy?.lastName} 
      ${log.performedBy?.email} 
      ${log.targetModel}
    `.toLowerCase();
    
    return searchString.includes(searchQuery.toLowerCase());
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'TOURIST_VERIFIED': return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'TOURIST_REJECTED': return <UserX className="h-4 w-4 text-red-500" />;
      case 'TOURIST_PROFILE_EDITED': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'SOS_RESOLVED': return <ShieldAlert className="h-4 w-4 text-orange-500" />;
      case 'TICKET_RESOLVED': return <FileText className="h-4 w-4 text-teal-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string, isDark: boolean) => {
    switch (action) {
      case 'TOURIST_VERIFIED': return isDark ? 'bg-green-900/30 text-green-400 border-green-800' : 'text-green-700 bg-green-50 border-green-200';
      case 'TOURIST_REJECTED': return isDark ? 'bg-red-900/30 text-red-400 border-red-800' : 'text-red-700 bg-red-50 border-red-200';
      case 'TOURIST_PROFILE_EDITED': return isDark ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'text-blue-700 bg-blue-50 border-blue-200';
      case 'SOS_RESOLVED': return isDark ? 'bg-orange-900/30 text-orange-400 border-orange-800' : 'text-orange-700 bg-orange-50 border-orange-200';
      case 'TICKET_RESOLVED': return isDark ? 'bg-teal-900/30 text-teal-400 border-teal-800' : 'text-teal-700 bg-teal-50 border-teal-200';
      default: return isDark ? 'bg-gray-900/30 text-gray-400 border-gray-800' : 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (loading || authLoading) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${activeTheme === 'dark' ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>Loading Audit Logs...</div>;
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
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>System Audit Logs</h1>
            <p className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Administrative Activity History</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input 
              placeholder="Search logs by action or authority..." 
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
              <FileText className="mr-2 h-4 w-4" />
              Event History
            </h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${activeTheme === 'dark' ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
              {filteredLogs.length} Records
            </span>
          </div>
          
          <div className="flex-1 p-0 overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className={`p-12 flex flex-col items-center justify-center text-center ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
                <p className="text-lg font-bold uppercase tracking-widest">No Logs Found</p>
                <p className="text-xs uppercase mt-2">No activity matches your current filters.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className={`text-xs uppercase font-bold border-b tracking-wider ${activeTheme === 'dark' ? 'bg-slate-900 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  <tr>
                    <th scope="col" className="px-6 py-4">Timestamp</th>
                    <th scope="col" className="px-6 py-4">Action</th>
                    <th scope="col" className="px-6 py-4">Authority</th>
                    <th scope="col" className="px-6 py-4">Device & Origin</th>
                    <th scope="col" className="px-6 py-4">Target Details</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${activeTheme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
                  {filteredLogs.map(log => (
                    <tr key={log._id} className={`transition-colors ${activeTheme === 'dark' ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-bold ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {new Date(log.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center w-fit px-2 py-1 text-[10px] font-bold rounded-sm uppercase tracking-wider border ${getActionColor(log.action, activeTheme === 'dark')}`}>
                          {getActionIcon(log.action)} <span className="ml-1.5">{log.action.replace(/_/g, ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.performedBy ? (
                          <>
                            <p className={`font-bold uppercase text-xs ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {log.performedBy.firstName} {log.performedBy.lastName}
                            </p>
                            <p className={`text-[10px] uppercase tracking-widest mt-0.5 ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {log.performedBy.email}
                            </p>
                          </>
                        ) : (
                          <span className="text-xs italic text-slate-500">System</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-bold ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            IP: {log.ipAddress || 'Unknown'}
                          </span>
                          <span className={`text-[9px] uppercase font-bold tracking-widest truncate max-w-[150px] ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} title={log.userAgent}>
                            {log.userAgent || 'Unknown Device'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${activeTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            MODEL: {log.targetModel}
                          </span>
                          <div className={`text-xs p-2 rounded-sm mt-1 border ${activeTheme === 'dark' ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                            {log.details?.changesMade ? (
                              <div className="space-y-1">
                                <p className="font-bold text-[10px] uppercase text-blue-500">Modifications:</p>
                                {Object.entries(log.details.changesMade).map(([key, val]: any) => (
                                  <div key={key} className="text-[10px]">
                                    <span className="font-bold capitalize">{key}: </span>
                                    {typeof val === 'object' && val !== null && val.old !== undefined ? (
                                      <span><span className="line-through text-red-400">{val.old}</span> → <span className="text-green-400">{val.new}</span></span>
                                    ) : (
                                      <span>{JSON.stringify(val)}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <pre className="whitespace-pre-wrap overflow-x-auto text-[10px]">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
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
