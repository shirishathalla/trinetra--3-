'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Activity, ArrowLeft, Server, Cpu, Database, Wifi, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function AuthorityVisibilityPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const router = useRouter();

  const [metrics, setMetrics] = useState({
    cpuUsage: 42,
    memoryUsage: 68,
    activeConnections: 1205,
    latency: 14,
    uptime: '45d 12h 30m',
  });

  const activeTheme = theme === 'colorful' ? 'dark' : theme;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role === 'tourist')) {
      router.push('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    // Simulate real-time metrics changing slightly
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(0, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(0, prev.memoryUsage + (Math.random() * 4 - 2))),
        activeConnections: Math.max(1000, prev.activeConnections + Math.floor(Math.random() * 20 - 10)),
        latency: Math.max(5, prev.latency + Math.floor(Math.random() * 4 - 2)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (authLoading) {
    return <div className={`flex-1 min-h-screen flex items-center justify-center font-bold tracking-widest uppercase ${activeTheme === 'dark' ? 'bg-slate-900 text-blue-400' : 'bg-slate-50 text-navy'}`}>Establishing Secure Connection...</div>;
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
          <div className={`p-2 rounded-sm ${activeTheme === 'dark' ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700'}`}>
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight uppercase ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Network Operations Center</h1>
            <p className={`text-xs font-bold uppercase tracking-widest flex items-center ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="flex h-1.5 w-1.5 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              System Architecture Visibility
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center px-3 py-1.5 border rounded-sm font-mono text-xs font-bold uppercase ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
            <ShieldCheck className="mr-2 h-3 w-3 text-green-500" />
            Encryption: AES-256
          </div>
          <div className={`flex items-center px-3 py-1.5 border rounded-sm font-mono text-xs font-bold uppercase ${activeTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
            <Clock className="mr-2 h-3 w-3" />
            Uptime: {metrics.uptime}
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric Cards */}
        <Card className={`p-6 border rounded-sm shadow-sm flex flex-col justify-between ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>CPU Allocation</h3>
            <Cpu className={`h-4 w-4 ${activeTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div className="space-y-2">
            <h4 className={`text-3xl font-mono font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{metrics.cpuUsage.toFixed(1)}%</h4>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${activeTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <div className={`h-full transition-all duration-500 ${metrics.cpuUsage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${metrics.cpuUsage}%` }}></div>
            </div>
          </div>
        </Card>
        
        <Card className={`p-6 border rounded-sm shadow-sm flex flex-col justify-between ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Memory Pool</h3>
            <Database className={`h-4 w-4 ${activeTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div className="space-y-2">
            <h4 className={`text-3xl font-mono font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{metrics.memoryUsage.toFixed(1)}%</h4>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${activeTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
              <div className={`h-full transition-all duration-500 bg-purple-500`} style={{ width: `${metrics.memoryUsage}%` }}></div>
            </div>
          </div>
        </Card>
        
        <Card className={`p-6 border rounded-sm shadow-sm flex flex-col justify-between ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Active Grid Connections</h3>
            <Wifi className={`h-4 w-4 ${activeTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
          </div>
          <h4 className={`text-3xl font-mono font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{metrics.activeConnections.toLocaleString()}</h4>
          <p className={`text-xs uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Nodes online</p>
        </Card>
        
        <Card className={`p-6 border rounded-sm shadow-sm flex flex-col justify-between ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Edge Latency</h3>
            <Server className={`h-4 w-4 ${activeTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </div>
          <h4 className={`text-3xl font-mono font-bold ${activeTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{metrics.latency}ms</h4>
          <p className={`text-xs uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Avg Ping to Sector 1</p>
        </Card>
        
        <div className={`lg:col-span-4 border rounded-sm min-h-[400px] ${activeTheme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
           <div className={`p-4 border-b ${activeTheme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
             <h3 className={`text-sm font-bold uppercase tracking-widest ${activeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>System Terminal Log</h3>
           </div>
           <div className={`p-6 font-mono text-xs leading-relaxed overflow-y-auto max-h-[400px] ${activeTheme === 'dark' ? 'text-green-400 bg-black' : 'text-slate-700 bg-slate-100'}`}>
             <p>[{new Date().toISOString()}] SYSTEM BOOT: Initialization sequence complete.</p>
             <p>[{new Date().toISOString()}] NETWORK: Establishing secure tunnels to 4 regional nodes.</p>
             <p>[{new Date().toISOString()}] AUTH: Handshake accepted. RSA keys verified.</p>
             <p>[{new Date().toISOString()}] DB: Connection established to MongoDB Cluster (Atlas-Primary).</p>
             <p>[{new Date().toISOString()}] CRON: Background tasks scheduled (GPS ping verification: 30s interval).</p>
             <p>[{new Date().toISOString()}] ALERT: Sector 7 reported weak signal. Failover triggered.</p>
             <p className="opacity-70 mt-4">_ Awaiting further operational input...</p>
           </div>
        </div>

      </div>
    </div>
  );
}
