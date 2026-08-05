'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, AlertCircle, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error: authError, clearError, isAuthenticated, user } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    // If user is already authenticated on mount, redirect them
    // But we don't put isAuthenticated in the dependency array to avoid race conditions during registration
    if (useAuthStore.getState().isAuthenticated) {
      if (useAuthStore.getState().user?.role === 'authority' || useAuthStore.getState().user?.role === 'admin') {
        router.push('/authority-dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, []); // Only run on mount

  useEffect(() => {
    clearError();
  }, [clearError]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+91',
    idDocumentUrl: 'pending_upload', // Placeholder for actual cloudinary integration
    dateOfBirth: '',
    nationality: 'India',
    gender: 'Male',
    identificationNumber: '',
    medicalDetails: {
      bloodGroup: '',
      allergies: '',
      chronicConditions: ''
    },
    emergencyContacts: [
      { name: '', relation: '', phone: '', countryCode: '+91' }
    ]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEmergencyContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
  };

  const addEmergencyContact = () => {
    if (formData.emergencyContacts.length < 3) {
      setFormData(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, { name: '', relation: '', phone: '', countryCode: '+91' }]
      }));
    }
  };

  const removeEmergencyContact = (index: number) => {
    if (formData.emergencyContacts.length > 1) {
      const newContacts = [...formData.emergencyContacts];
      newContacts.splice(index, 1);
      setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      return setLocalError('Passwords do not match');
    }

    try {
      // Register User and Create Tourist Profile in one step
      await register({
        email: formData.email,
        password: formData.password,
        role: 'tourist',
        profileData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          countryCode: formData.countryCode,
          idDocumentUrl: formData.idDocumentUrl,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          gender: formData.gender,
          identificationNumber: formData.identificationNumber,
          medicalDetails: formData.medicalDetails,
          emergencyContacts: formData.emergencyContacts,
          travelInformation: {}
        }
      });

      router.push('/dashboard');
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Failed to complete registration');
    }
  };

  const isDark = theme === 'dark' || theme === 'colorful';

  const inputClass = `h-12 rounded-xl border-2 transition-all duration-300 font-medium ${
    isDark 
      ? 'bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:border-blue-500 focus-visible:ring-0 focus-visible:bg-slate-900' 
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-navy focus-visible:ring-0 focus-visible:bg-white'
  }`;

  const labelClass = `text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
  const sectionTitleClass = `text-lg font-bold mb-5 flex items-center gap-3 ${
    isDark ? 'text-white' : 'text-slate-900'
  }`;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      
      <div className="hidden lg:block lg:w-[40%] xl:w-[45%] relative bg-navy">
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        {theme === 'colorful' ? (
          <>
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" alt="Himalayas" className="absolute inset-0 w-full h-full object-cover object-center opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-navy/60 to-saffron/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"></div>
          </>
        ) : theme === 'dark' ? (
          <>
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" alt="Himalayas" className="absolute inset-0 w-full h-full object-cover object-center opacity-50 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-950/90"></div>
          </>
        ) : (
          <>
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80" alt="Himalayas" className="absolute inset-0 w-full h-full object-cover object-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-navy/70 to-blue-900/80"></div>
          </>
        )}
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center gap-3 text-white group">
              <div className="transition-all group-hover:scale-105">
                <img src="/logo-dark.png" alt="Trinetra" className="h-14 w-auto object-contain drop-shadow-lg" />
              </div>
              <span className="text-3xl font-extrabold tracking-widest uppercase drop-shadow-md">Trinetra</span>
            </Link>
          </motion.div>
          
          <motion.div 
            className="max-w-md space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1]">
              Create Your <span className="text-saffron">Identity.</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed">
              Register for official access to the region. Your verified profile ensures safety, quick emergency responses, and seamless clearances.
            </p>

            <ul className="space-y-4 pt-6 border-t border-white/20">
              {[
                'Instant Emergency SOS Dispatch',
                'Seamless Checkpost Clearances',
                'Localized Alert Broadcasting',
                'Verified Digital Identity'
              ].map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-3 text-slate-200 font-medium"
                >
                  <CheckCircle2 className="h-5 w-5 text-saffron" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:flex-1 flex justify-center items-start p-6 sm:p-12 lg:p-16 relative min-h-screen">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-6 left-6 lg:hidden z-10 bg-inherit w-full pr-12 pb-4">
          <Link href="/" className={`inline-flex items-center gap-2 ${isDark ? 'text-white' : 'text-navy'}`}>
            <img src={isDark ? '/logo-dark.png' : '/logo-light.png'} alt="Trinetra" className="h-8 w-auto object-contain" />
            <span className="text-xl font-extrabold tracking-widest uppercase">Trinetra</span>
          </Link>
        </div>

        <motion.div 
          className="w-full max-w-2xl mt-12 lg:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3 mb-10">
            <h2 className={`text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Registration Profile</h2>
            <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Please provide accurate details for official verification.
            </p>
          </div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {(authError || localError) && (
              <motion.div 
                variants={itemVariants}
                className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center text-sm border border-red-500/20 shadow-sm"
              >
                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="font-medium">{authError || localError}</span>
              </motion.div>
            )}

            {/* Account Information */}
            <motion.div variants={itemVariants} className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-900/50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <h3 className={sectionTitleClass}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-navy/10 text-navy'}`}>1</span>
                Account Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-2.5 md:col-span-2">
                  <Label htmlFor="email" className={labelClass}>Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="name@example.com" required onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-2.5 group relative">
                  <Label htmlFor="password" className={labelClass}>Password</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required onChange={handleChange} className={`${inputClass} pr-12`} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300 group-focus-within:text-blue-500' : 'text-slate-400 hover:text-slate-600 group-focus-within:text-navy'}`}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2.5 group relative">
                  <Label htmlFor="confirmPassword" className={labelClass}>Confirm Password</Label>
                  <div className="relative">
                    <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required onChange={handleChange} className={`${inputClass} pr-12`} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 focus:outline-none transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300 group-focus-within:text-blue-500' : 'text-slate-400 hover:text-slate-600 group-focus-within:text-navy'}`}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal Details */}
            <motion.div variants={itemVariants} className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-900/50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <h3 className={sectionTitleClass}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-navy/10 text-navy'}`}>2</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-2.5">
                  <Label htmlFor="firstName" className={labelClass}>First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" required onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className={`text-xs uppercase tracking-widest font-bold flex items-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Phone Number <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <select 
                      value={formData.countryCode} 
                      onChange={(e) => handleChange({ target: { name: 'countryCode', value: e.target.value } } as any)}
                      className={`w-24 p-3 rounded-sm border focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
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
                    <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} className={`flex-1 h-12 rounded-sm border-0 focus-visible:ring-1 focus-visible:ring-offset-0 ${isDark ? 'bg-slate-900 focus-visible:ring-blue-500' : 'bg-white focus-visible:ring-navy'}`} placeholder="Enter 10 digit number" type="tel" maxLength={10} pattern="[0-9]{10}" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="idDocumentUrl" className={labelClass}>Gov ID Upload</Label>
                  <Input id="idDocumentUrl" name="idDocumentUrl" type="file" className={`${inputClass} cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:tracking-wide file:uppercase ${isDark ? 'file:bg-blue-500/10 file:text-blue-400' : 'file:bg-navy/10 file:text-navy'} hover:file:bg-transparent pt-2`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2.5">
                  <Label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" required onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="gender" className={labelClass}>Gender</Label>
                  <select 
                    id="gender"
                    name="gender"
                    required
                    onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                    className={`flex w-full items-center justify-between rounded-xl border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${inputClass}`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="nationality" className={labelClass}>Nationality</Label>
                  <Input id="nationality" name="nationality" placeholder="e.g. India" required value={formData.nationality} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="identificationNumber" className={labelClass}>ID Number (Passport / Aadhaar)</Label>
                  <Input id="identificationNumber" name="identificationNumber" placeholder="ID Number" required onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </motion.div>

            {/* Medical Information */}
            <motion.div variants={itemVariants} className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-900/50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <h3 className={sectionTitleClass}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-navy/10 text-navy'}`}>3</span>
                Medical Profile <span className={`text-xs font-medium ml-2 uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>(Optional)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="space-y-2.5">
                  <Label htmlFor="medicalDetails.bloodGroup" className={labelClass}>Blood Group</Label>
                  <Input id="medicalDetails.bloodGroup" name="medicalDetails.bloodGroup" placeholder="e.g. O+" onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="medicalDetails.allergies" className={labelClass}>Allergies</Label>
                  <Input id="medicalDetails.allergies" name="medicalDetails.allergies" placeholder="e.g. Penicillin" onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="medicalDetails.chronicConditions" className={labelClass}>Conditions</Label>
                  <Input id="medicalDetails.chronicConditions" name="medicalDetails.chronicConditions" placeholder="e.g. Asthma" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div variants={itemVariants} className={`p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg ${isDark ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-900/50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Emergency Contacts
                  </h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addEmergencyContact}
                    disabled={formData.emergencyContacts.length >= 3}
                    className={`h-8 text-xs font-bold uppercase tracking-widest ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-600'}`}
                  >
                    + Add ({formData.emergencyContacts.length}/3)
                  </Button>
                </div>

                {formData.emergencyContacts.map((contact, index) => (
                  <div key={index} className={`p-4 rounded-sm border space-y-4 relative ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    {formData.emergencyContacts.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeEmergencyContact(index)}
                        className={`absolute top-2 right-2 p-1 rounded-full text-xs font-bold uppercase tracking-widest ${isDark ? 'text-red-400 hover:bg-slate-800' : 'text-red-500 hover:bg-slate-200'}`}
                      >
                        Remove
                      </button>
                    )}
                    <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Contact #{index + 1}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className={`text-xs uppercase tracking-widest font-bold flex items-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Name <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input required value={contact.name} onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)} className={`h-10 text-sm rounded-sm border-0 focus-visible:ring-1 focus-visible:ring-offset-0 ${isDark ? 'bg-slate-900 focus-visible:ring-blue-500' : 'bg-white focus-visible:ring-navy'}`} placeholder="Full Name" />
                      </div>
                      <div className="space-y-2">
                        <Label className={`text-xs uppercase tracking-widest font-bold flex items-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Relationship <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input required value={contact.relation} onChange={(e) => handleEmergencyContactChange(index, 'relation', e.target.value)} className={`h-10 text-sm rounded-sm border-0 focus-visible:ring-1 focus-visible:ring-offset-0 ${isDark ? 'bg-slate-900 focus-visible:ring-blue-500' : 'bg-white focus-visible:ring-navy'}`} placeholder="e.g. Spouse, Parent" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-xs uppercase tracking-widest font-bold flex items-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <select 
                          value={contact.countryCode} 
                          onChange={(e) => handleEmergencyContactChange(index, 'countryCode', e.target.value)}
                          className={`w-24 p-2 rounded-sm border focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
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
                        <Input required value={contact.phone} onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)} className={`flex-1 h-10 text-sm rounded-sm border-0 focus-visible:ring-1 focus-visible:ring-offset-0 ${isDark ? 'bg-slate-900 focus-visible:ring-blue-500' : 'bg-white focus-visible:ring-navy'}`} placeholder="10 digit number" type="tel" maxLength={10} pattern="[0-9]{10}" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                type="submit" 
                className={`w-full h-14 rounded-xl text-lg font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none group relative overflow-hidden ${
                  theme === 'colorful' ? 'bg-saffron hover:bg-orange-600 text-white shadow-[0_8px_20px_-8px_rgba(245,158,11,0.6)]' : 
                  (theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.6)]' : 'bg-navy hover:bg-slate-800 text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.6)]')
                }`} 
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    Complete Registration
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                )}
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-4 pb-12 text-center">
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Already have an official account?{' '}
                <Link href="/login" className={`font-bold tracking-wide hover:underline transition-colors ${
                  theme === 'colorful' ? 'text-saffron hover:text-orange-400' : 
                  (theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-navy hover:text-blue-800')
                }`}>
                  Sign in securely
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
