'use client';

import { useThemeStore } from '@/store/themeStore';

export default function TermsOfServicePage() {
  const { theme } = useThemeStore();
  return (
    <div className={`relative flex-1 pt-32 pb-24 min-h-screen overflow-hidden ${
      theme === 'colorful' ? 'bg-navy' : (theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50')
    }`}>
      {theme === 'colorful' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-saffron/10 blur-[120px]"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        </div>
      )}
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className={`p-8 md:p-16 rounded-3xl shadow-2xl border ${
          theme === 'colorful' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 
          (theme === 'dark' ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white border-slate-100 shadow-navy/5')
        }`}>
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-8 border-b pb-6 ${
            theme === 'colorful' ? 'text-white border-white/10' : 
            (theme === 'dark' ? 'text-white border-slate-700' : 'text-navy border-slate-200')
          }`}>
            Terms of Service
          </h1>
          
          <div className={`space-y-10 text-lg leading-relaxed ${
            theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-700')
          }`}>
            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using the TRINETRA Tourist Safety Monitoring & Emergency Response System (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
              <p>
                Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>2. Description of Service</h2>
              <p className="mb-4">
                TRINETRA provides tourists with a comprehensive platform for live location tracking and emergency SOS signaling. The service is provided in partnership with the Ministry of Tourism, Government of India, and is intended strictly for personal safety, coordination of emergency responses, and the facilitation of secure tourism across the nation.
              </p>
              <p>
                The Service includes, but is not limited to, real-time GPS tracking, a digital identity card generator (QR), and a direct dispatch link to local and national emergency authorities.
              </p>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. User Obligations and Conduct</h2>
              <p className="mb-4">As a registered user of TRINETRA, you agree to the following obligations:</p>
              <ul className="list-disc pl-8 space-y-3">
                <li>You will provide accurate, current, and complete information during the registration process and update such information to keep it accurate, current, and complete.</li>
                <li>You are solely responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
                <li>You will use the SOS emergency feature strictly for genuine emergencies involving immediate threats to life, health, or property.</li>
                <li>You will not engage in any activity that interferes with or disrupts the Service (or the servers and networks which are connected to the Service).</li>
                <li>You will not attempt to gain unauthorized access to any portion of the TRINETRA system, or any other systems or networks connected to the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>4. Misuse of the SOS Feature</h2>
              <p className="mb-4">
                The TRINETRA SOS feature is directly linked to national emergency dispatch centers. Intentionally triggering false SOS alerts, testing the system without authorization, or misusing the emergency response system in any way is strictly prohibited.
              </p>
              <p>
                Violation of this clause will result in immediate suspension of your account, and may subject you to severe legal penalties, fines, and prosecution under the applicable laws of the Government of India.
              </p>
            </section>
            
            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5. Intellectual Property Rights</h2>
              <p className="mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of TRINETRA and its licensors, in conjunction with the Ministry of Tourism. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of TRINETRA.
              </p>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>6. Disclaimer of Warranties and Liability</h2>
              <p className="mb-4">
                While TRINETRA strives to ensure maximum safety and rapid emergency response, the platform cannot guarantee the absolute prevention of harm. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
              </p>
              <p>
                TRINETRA makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein. You expressly agree that your use of these services, their content, and any services or items obtained from us is at your sole risk.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
