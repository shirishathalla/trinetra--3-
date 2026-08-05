'use client';

import { useThemeStore } from '@/store/themeStore';

export default function DataProtectionPage() {
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
            Data Protection Policy
          </h1>
          
          <div className={`space-y-10 text-lg leading-relaxed ${
            theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-700')
          }`}>
            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. Commitment to Data Security</h2>
              <p className="mb-4">
                The TRINETRA system, operating in partnership with the Ministry of Tourism, is profoundly committed to safeguarding the digital identity, location telemetry, and sensitive medical information of every registered traveler. 
              </p>
              <p>
                We recognize that the trust placed in our platform requires the highest standard of data protection. All data is managed in strict compliance with the Information Technology Act, 2000, the Digital Personal Data Protection Act, and applicable national and international data protection frameworks.
              </p>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>2. Encryption & Storage Protocols</h2>
              <p className="mb-4">We employ military-grade, industry-standard encryption protocols to protect data continuously, both in transit and at rest:</p>
              <ul className="list-disc pl-8 space-y-3">
                <li><strong>In Transit:</strong> All communications between the TRINETRA mobile application, web portal, and the Central Command servers are secured via Transport Layer Security (TLS) 1.3 encryption, ensuring that intercepted data remains entirely unreadable.</li>
                <li><strong>At Rest:</strong> Personally Identifiable Information (PII), medical profiles, and historical GPS telemetry are encrypted in our highly secure databases using Advanced Encryption Standard (AES-256) encryption.</li>
                <li><strong>Key Management:</strong> Cryptographic keys are managed through secure, hardware-backed Key Management Systems (KMS) that isolate key access from application logic.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. Authorized Access and Auditing</h2>
              <p className="mb-4">
                Access to live tracking data and medical profiles is strictly limited to verified, authenticated emergency response personnel, certified dispatchers, and Central Command authorities. 
              </p>
              <p>
                We operate on a "Principle of Least Privilege" (PoLP). Every query made to our databases is electronically logged, time-stamped, and tied to the specific authority personnel's ID. These access logs are audited periodically by independent security teams to prevent misuse or unauthorized data surveillance.
              </p>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>4. Data Retention and Destruction</h2>
              <p className="mb-4">
                TRINETRA follows strict data minimization principles. We do not hold data longer than is necessary to ensure your safety:
              </p>
              <ul className="list-disc pl-8 space-y-3">
                <li><strong>Live Telemetry:</strong> Live tracking data is retained only for the duration of the active journey. Historical location data is automatically purged after 30 days unless required by law enforcement for an ongoing, active investigation.</li>
                <li><strong>Incident Logs:</strong> Records of SOS triggers and emergency dispatch logs are securely archived for 7 years as required by federal regulations.</li>
                <li><strong>Account Data:</strong> Medical profiles and identity data are retained as long as the user account remains active. Upon account deletion, all associated personal data is irrevocably destroyed within 90 days.</li>
              </ul>
            </section>
            
            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5. Your Digital Rights</h2>
              <p className="mb-4">
                As a user of the TRINETRA platform, you possess significant rights regarding your data:
              </p>
              <ul className="list-disc pl-8 space-y-3">
                <li><strong>Right to Access:</strong> You may request a complete export of all personal data held by TRINETRA.</li>
                <li><strong>Right to Rectification:</strong> You may immediately correct any inaccurate or incomplete medical or contact information via your dashboard.</li>
                <li><strong>Right to Erasure:</strong> You may request the deletion of your account and the destruction of all associated data at any time, provided there are no active legal holds.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
