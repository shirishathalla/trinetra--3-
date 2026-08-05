'use client';

import { useEffect, useState, use } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, XCircle, User, Phone, Activity, ShieldAlert, CheckCircle } from 'lucide-react';

export default function QRVerification({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [tourist, setTourist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTourist = async () => {
      try {
        const res = await api.get(`/tourists/qr/${unwrappedParams.id}`);
        setTourist(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Tourist not found');
      } finally {
        setLoading(false);
      }
    };
    if (unwrappedParams.id) {
      fetchTourist();
    }
  }, [unwrappedParams.id]);

  if (loading) return <div className="flex-1 flex items-center justify-center font-bold text-gray-700 uppercase tracking-wider">Accessing Central Database...</div>;

  if (error || !tourist) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-4 pt-32 pb-12">
        <div className="mb-6 text-center">
          <ShieldAlert className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-gray-800 uppercase">TRINETRA Verification System</h1>
        </div>
        <Card className="w-full max-w-md border-red-500 border-2 shadow-2xl rounded-2xl overflow-hidden bg-white">
          <div className="bg-red-600 p-4 text-center">
            <XCircle className="h-12 w-12 mx-auto text-white mb-2" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Verification Failed</h2>
          </div>
          <CardContent className="p-8 text-center bg-red-50">
            <p className="text-red-800 font-semibold mb-4">{error || 'Invalid or unregistered QR code detected.'}</p>
            <p className="text-xs text-red-600 uppercase font-bold tracking-widest border-t border-red-200 pt-4">Action required: Confiscate ID / Contact Support</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-4 pt-32 pb-12">
      <div className="mb-4 text-center">
        <div className="h-12 w-10 mx-auto bg-gray-200 border border-gray-300 shadow-inner text-[6px] text-center font-bold text-gray-500 flex flex-col items-center justify-center overflow-hidden mb-2">
          <span>EMBLEM</span>
        </div>
        <h1 className="text-sm font-bold text-gray-800 uppercase tracking-widest">TRINETRA Central Database</h1>
        <p className="text-xs font-semibold text-gray-500 uppercase">Verification Portal</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-t-[6px] border-t-saffron overflow-hidden rounded-2xl bg-white">
        <div className="bg-green-700 p-6 text-white text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-10">
            <ShieldCheck className="h-32 w-32" />
          </div>
          <CheckCircle className="h-12 w-12 mb-2 z-10" />
          <h2 className="text-2xl font-bold tracking-widest uppercase z-10">Verified Authentic</h2>
          <p className="text-green-200 text-xs font-bold uppercase tracking-widest z-10">Digital Tourist Identity Valid</p>
        </div>
        
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white border border-gray-300 rounded-sm flex items-center justify-center text-gray-400 shadow-sm overflow-hidden shrink-0">
                <User className="h-8 w-8" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Subject Name</p>
                <h3 className="text-xl font-extrabold text-gray-900 uppercase">{tourist.firstName} {tourist.lastName}</h3>
                <p className="text-xs text-navy font-mono font-bold mt-1">ID: {tourist.touristId}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-navy flex items-center uppercase mb-3 tracking-widest border-b border-gray-200 pb-1">
                <Activity className="h-4 w-4 mr-2" /> Critical Medical Data
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-500">Blood Group</span>
                  <span className="font-extrabold text-red-600 text-lg">{tourist.medicalDetails?.bloodGroup || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-500">Allergies</span>
                  <span className="font-semibold text-gray-900">{tourist.medicalDetails?.allergies || 'None'}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] uppercase font-bold text-gray-500">Chronic Conditions</span>
                  <span className="font-semibold text-gray-900">{tourist.medicalDetails?.chronicConditions || 'None reported'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-navy flex items-center uppercase mb-3 tracking-widest border-b border-gray-200 pb-1">
                <Phone className="h-4 w-4 mr-2" /> Emergency Dispatch Contacts
              </h4>
              <div className="space-y-2">
                {tourist.emergencyContacts?.length > 0 ? (
                  tourist.emergencyContacts.map((contact: any, i: number) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 p-3 rounded-sm flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-900 block">{contact.name}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-500">{contact.relation}</span>
                      </div>
                      <a href={`tel:${contact.phone}`} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-sm font-bold text-sm shadow-sm flex items-center">
                        <Phone className="h-3 w-3 mr-1" /> CALL
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No emergency contacts listed.</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-3 text-center border-t border-gray-200">
            <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">
              Information accessed by official authority node. Logged securely.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
