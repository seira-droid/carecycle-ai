import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  HeartHandshake,
  HelpCircle,
  Accessibility,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, register, forgotPassword, resetPassword } = useAuth();

  // Mode: 'signin' | 'register' | 'forgot' | 'reset'
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot' | 'reset'>('signin');

  // Form Fields
  const [email, setEmail] = useState('elena.vance@carecycle.health');
  const [password, setPassword] = useState('CareCycle2026!');
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('she/they');
  const [age, setAge] = useState<number>(18);
  const [neurodiversity, setNeurodiversity] = useState('Autism Spectrum Disorder');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  const clearFeedback = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!name.trim()) {
      setErrorMessage('Please enter your preferred or legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the CareCycle confidentiality and medical disclaimer.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name,
      email,
      password,
      pronouns,
      age,
      neurodiversity: [neurodiversity],
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed. Please try a different email.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const res = await forgotPassword(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      if (res.demoToken) {
        setDemoToken(res.demoToken);
        setResetToken(res.demoToken);
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    if (!resetToken.trim()) {
      setErrorMessage('Please provide your reset code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(email, resetToken, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setPassword(newPassword);
      setTimeout(() => setMode('signin'), 1500);
    } else {
      setErrorMessage(res.error || 'Failed to reset password.');
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('CareCycle2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF8FD] text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Desktop Split Screen Container */}
      <div className="w-full flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Authentication Form (Takes 55% on lg) */}
        <div className="w-full lg:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-2xl mx-auto lg:mx-0">
          {/* Brand Header */}
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">
                  CareCycle <span className="text-purple-600">AI</span>
                </span>
                <span className="block text-[11px] font-semibold text-slate-400 tracking-wide">
                  Disability-Aware Menstrual Health
                </span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-100/80 rounded-2xl mb-8 border border-slate-200/60 max-w-md">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  clearFeedback();
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  clearFeedback();
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  clearFeedback();
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'forgot' || mode === 'reset'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Recovery
              </button>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-5 animate-in fade-in">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Sign in to check your cycle predictions, symptoms, and care guidance.
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. elena.vance@carecycle.health"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        clearFeedback();
                      }}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                      Authenticating securely...
                    </>
                  ) : (
                    <>
                      Sign In to CareCycle
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Demo Profiles for Rapid Evaluation */}
                <div className="pt-4 border-t border-slate-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Quick Clinical Demo Logins
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillDemo('elena.vance@carecycle.health')}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-white text-left transition-colors"
                    >
                      <p className="text-xs font-bold text-slate-800">Elena Vance</p>
                      <p className="text-[10px] text-slate-500">Autism Profile (Preset)</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillDemo('demo@carecycle.health')}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-white text-left transition-colors"
                    >
                      <p className="text-xs font-bold text-slate-800">Clinical Demo</p>
                      <p className="text-[10px] text-slate-500">ADHD Profile (Preset)</p>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 2. REGISTRATION FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                    Create your account
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Join CareCycle AI for personalized, sensory-safe cycle support.
                  </p>
                </div>

                {/* Full Name & Pronouns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Pronouns
                    </label>
                    <input
                      type="text"
                      value={pronouns}
                      onChange={(e) => setPronouns(e.target.value)}
                      placeholder="she/they"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@carecycle.health"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Create Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Disability / Neurodivergence Preference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Disability or Neurodivergence (Optional)
                  </label>
                  <select
                    value={neurodiversity}
                    onChange={(e) => setNeurodiversity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm"
                  >
                    <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
                    <option value="ADHD / Executive Functioning">ADHD / Executive Functioning</option>
                    <option value="Intellectual Disability">Intellectual Disability</option>
                    <option value="Sensory Processing Sensitivity">Sensory Processing Sensitivity</option>
                    <option value="Specific Learning Disability">Specific Learning Disability</option>
                    <option value="Physical / Mobility Disability">Physical / Mobility Disability</option>
                    <option value="General Health / Neurotypical">General / Non-disclosed</option>
                  </select>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 accent-purple-600 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 leading-snug cursor-pointer">
                    I understand that CareCycle AI provides personalized educational estimations and non-pharmacological wellness guidance, not certified medical diagnoses.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Creating secure profile...' : 'Create Account & Continue'}
                </button>
              </form>
            )}

            {/* 3. PASSWORD RECOVERY FORM */}
            {(mode === 'forgot' || mode === 'reset') && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                    Recover your password
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your email address to receive password reset instructions.
                  </p>
                </div>

                {mode === 'forgot' ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@carecycle.health"
                        required
                        className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Generating recovery code...' : 'Send Recovery Instructions'}
                    </button>

                    {demoToken && (
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                        <p className="text-xs font-bold text-purple-900">
                          Demo Mode: Code generated for testing
                        </p>
                        <p className="text-xs text-purple-700 font-mono bg-white p-2 rounded-xl border border-purple-200">
                          {demoToken}
                        </p>
                        <button
                          type="button"
                          onClick={() => setMode('reset')}
                          className="text-xs font-bold text-purple-700 underline"
                        >
                          Proceed to enter code & set new password →
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Reset Code
                      </label>
                      <input
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="e.g. RESET-ABC12"
                        required
                        className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        New Password (min 6 characters)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new secure password"
                        required
                        className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-600 outline-none shadow-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Resetting password...' : 'Confirm New Password'}
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      clearFeedback();
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Confidentiality Guarantee Footer */}
          <div className="pt-8 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              100% Confidential & Encrypted
            </span>
            <span>CareCycle AI Healthcare · v1.2</span>
          </div>
        </div>

        {/* Right Side: Reassuring Healthcare Experience Panel (Desktop) */}
        <div className="hidden lg:flex lg:w-[48%] bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill */}
          <div className="relative z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-purple-200 border border-white/10 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              Disability-Inclusive Menstrual Healthcare
            </span>
          </div>

          {/* Centerpiece Reassurance Content */}
          <div className="relative z-10 space-y-6 max-w-lg">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight font-['Outfit'] leading-tight">
              Compassionate, accessible care for every stage of your cycle.
            </h2>

            <p className="text-purple-200/90 text-sm leading-relaxed">
              CareCycle AI is built from the ground up for individuals with autism, ADHD, sensory sensitivities, and communication needs. Every prediction, tip, and alert is designed to be gentle, plain-spoken, and transparent.
            </p>

            {/* Feature Highlights Grid */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
                  <Accessibility className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Neurodivergent Accommodations</h4>
                  <p className="text-[11px] text-purple-200/80 mt-0.5">
                    Low-stimulation mode, plain language words, and dyslexic-friendly typography.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Silent Pain & Distress Safeguards</h4>
                  <p className="text-[11px] text-purple-200/80 mt-0.5">
                    Trained on UNBC-McMaster and BioVid scales to detect discomfort even when verbal reporting is limited.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">User-Controlled Caregiver Sharing</h4>
                  <p className="text-[11px] text-purple-200/80 mt-0.5">
                    You decide what is shared. No records are ever broadcast without your explicit consent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Academic Quote */}
          <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-purple-300/80">
            "Empowering menstrual autonomy through explainable AI and trauma-informed design."
          </div>
        </div>
      </div>
    </div>
  );
};
