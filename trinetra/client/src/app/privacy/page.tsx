'use client';

import { useThemeStore } from '@/store/themeStore';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          
          <div className={`space-y-10 text-lg leading-relaxed ${
            theme === 'colorful' ? 'text-slate-300' : (theme === 'dark' ? 'text-slate-400' : 'text-slate-700')
          }`}>
            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. Introduction</h2>
              <p className="mb-4">
                Welcome to TRINETRA. We respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information through the TRINETRA portal and mobile application, operated in partnership with the Ministry of Tourism, Government of India.
              </p>
              <p>
                This policy complies with the highest standards of data protection and outlines your rights regarding the personal data we hold about you. Please read this Privacy Policy carefully to understand our views and practices regarding your personal data and how we will treat it.
              </p>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>2. The Data We Collect About You</h2>
              <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-8 space-y-3">
                <li><strong>Identity Data:</strong> includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Location Data:</strong> live GPS telemetry, altitude, speed, and heading when the tracking module is explicitly engaged by the user.</li>
                <li><strong>Medical Data:</strong> voluntarily provided medical information (e.g., blood group, allergies, chronic conditions) used strictly for emergency dispatch.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. How We Use Your Personal Data</h2>
              <p className="mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-8 space-y-3">
                <li><strong>Service Delivery:</strong> To register you as a new user in the TRINETRA tourist database and to manage our relationship with you.</li>
                <li><strong>Emergency Response:</strong> To provide live tracking and safety monitoring when requested, and to dispatch emergency services via the Central Command Center when an SOS is triggered.</li>
                <li><strong>System Improvement:</strong> To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data).</li>
                <li><strong>Legal Obligations:</strong> To comply with a legal or regulatory obligation as mandated by the Government of India.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>4. Disclosures of Your Personal Data</h2>
              <p className="mb-4">
                We may have to share your personal data with the parties set out below for the purposes outlined in Section 3:
              </p>
              <ul className="list-disc pl-8 space-y-3">
                <li><strong>Internal Third Parties:</strong> Other agencies or departments within the Government of India acting as joint controllers or processors.</li>
                <li><strong>External Third Parties:</strong> Emergency response units, local law enforcement, medical first responders, and certified service providers acting as processors who provide IT and system administration services.</li>
                <li><strong>Third parties to whom we may choose to sell, transfer, or merge parts of our business or our assets.</strong> Alternatively, we may seek to acquire other businesses or merge with them. If a change happens to our business, then the new owners may use your personal data in the same way as set out in this privacy notice.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5. Data Security</h2>
              <p className="mb-4">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
              </p>
              <p>
                We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
              </p>
            </section>
            
            <section>
              <h2 className={`text-3xl font-bold mb-6 ${theme === 'colorful' || theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>6. Data Retention</h2>
              <p className="mb-4">
                We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. 
              </p>
              <p>
                To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorised use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal requirements.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
