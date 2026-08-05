import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-auto w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-saffron" />
              <span className="text-xl font-bold text-white tracking-tight">TRINETRA</span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed mb-4">
              A modern private-public initiative in partnership with the Ministry of Tourism, ensuring absolute safety for global and domestic travelers across India.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-saffron transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-saffron transition-colors">About Us</Link></li>
              <li><Link href="/guidelines" className="hover:text-saffron transition-colors">Safety Guidelines</Link></li>
              <li><Link href="/contact" className="hover:text-saffron transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-saffron transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-saffron transition-colors">Terms of Service</Link></li>
              <li><Link href="/data-protection" className="hover:text-saffron transition-colors">Data Protection</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>&copy; {new Date().getFullYear()} TRINETRA Security Systems. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Developed in partnership with Ministry of Tourism, Govt of India.</p>
        </div>
      </div>
    </footer>
  );
}
