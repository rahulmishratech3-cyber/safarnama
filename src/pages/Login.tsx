import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../config';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState('9876543210');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['7', '4', '2', '9']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handlePhoneSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      login(phone);
      setTimeout(() => {
        navigate('/');
      }, 700);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between">
      {/* Top Simple Header for Login */}
      <header className="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] py-4 px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[24px]">local_taxi</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md tracking-tight text-primary leading-none">
              {APP_CONFIG.brandShort}
            </span>
            <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
              Mobility Portal
            </span>
          </div>
        </Link>
        <Link
          to="/"
          className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1 no-underline"
        >
          <span>Explore Without Sign In</span>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </Link>
      </header>

      {/* Main Authentication Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8 lg:py-14 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl bg-surface-container-lowest w-full">
          {/* Left Panel: Brand Showcase & Trust Credentials */}
          <div className="lg:col-span-6 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-primary text-on-primary overflow-hidden min-h-[620px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-primary opacity-95 pointer-events-none"></div>
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-tertiary-fixed-dim/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Header & Status Tag */}
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed">
                  India's Premier Highway Transit
                </span>
              </div>
              <div className="space-y-4 max-w-lg">
                <h1 className="font-headline-xl text-headline-xl text-on-primary tracking-tight leading-tight">
                  Elevated Intercity &amp; Airport Mobility Across India.
                </h1>
                <p className="font-body-lg text-body-lg text-primary-fixed-dim leading-relaxed">
                  Experience premium chauffeurs, guaranteed on-time airport transfers, and curated holiday tour packages with transparent all-inclusive fares.
                </p>
              </div>
            </div>

            {/* Transit Image Snapshot Card */}
            <div className="relative z-10 my-8 rounded-xl overflow-hidden shadow-lg bg-primary-container/80">
              <div className="relative h-44 w-full">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4r19OGdAm9dU17KEryUpJftFR0Tq0kUN2D5ebzp-Ws1aBzdYu6m2PaXsazbnGIYogpOVabGe9tTo3HV7n6bDdvwpYst10Oo2_bFrvpvYUxr5bEVc7dtLSQ2LWsrqKybgH5HM0vf-F8stl-6TYOZLUe2zDsSYgbIoUPvNA7fl9Aa780Vn9pdip9a8T5K5BppxDO8gc_sO4omAHGBMc_S33EWdWUTiNeCGl1YCww70pZevQYXkMfeGf"
                  alt="Sedan on modern expressway at dusk"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-on-primary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                      verified
                    </span>
                    <span className="font-label-md text-label-md">Direct Corridor Express</span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container-lowest/20 backdrop-blur-sm">
                    Tier-1 Fleet
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Highlights List */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center shrink-0 text-secondary-fixed">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-primary">
                    100% Police-Verified &amp; Chauffeur Trained Drivers
                  </p>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                    Thorough background checks, behavioral grooming &amp; defensive driving certifications.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center shrink-0 text-secondary-fixed">
                  <span className="material-symbols-outlined text-[18px]">price_check</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-primary">
                    Zero Surge Pricing &amp; Transparent Corridor Toll Rates
                  </p>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                    Fixed upfront estimates. Zero hidden state road tax or unexpected night surcharges.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center shrink-0 text-secondary-fixed">
                  <span className="material-symbols-outlined text-[18px]">emergency</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-primary">
                    24x7 SOS Telematics &amp; Dedicated Trip Support Desk
                  </p>
                  <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                    Real-time GPS boundary alerts, speed sensors &amp; instantaneous live responder support.
                  </p>
                </div>
              </div>

              {/* Social Proof Pill */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest/10 backdrop-blur-sm text-on-primary">
                  <div className="flex -space-x-1.5 items-center">
                    <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold">
                      R
                    </span>
                    <span className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-[10px] font-bold">
                      A
                    </span>
                    <span className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold">
                      P
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-tertiary-fixed-dim leading-none">
                      4.9★
                    </span>
                    <span className="font-body-sm text-body-sm text-primary-fixed-dim leading-tight">
                      Over 500,000+ highway &amp; airport journeys completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Authentication Card */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-surface-container-lowest">
            <div className="max-w-md w-full mx-auto space-y-6">
              {/* Brand Wordmark & Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">local_taxi</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md tracking-tight text-primary leading-none">
                    {APP_CONFIG.brandShort}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
                    Mobility Portal
                  </span>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-xl bg-surface-container-low p-1.5 gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2.5 rounded-lg font-label-md text-label-md transition-all text-center cursor-pointer ${
                    mode === 'signin'
                      ? 'text-primary bg-surface-container-lowest shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 rounded-lg font-label-md text-label-md transition-all text-center cursor-pointer ${
                    mode === 'signup'
                      ? 'text-primary bg-surface-container-lowest shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Welcome Messaging */}
              <div className="space-y-1">
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  {mode === 'signin' ? 'Welcome back' : 'Create your Safar Account'}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {mode === 'signin'
                    ? 'Enter your mobile phone number to sign in or get started.'
                    : 'Join thousands enjoying verified drivers & zero surge tariffs.'}
                </p>
              </div>

              {/* Step 1: Phone Entry */}
              {step === 'phone' ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
                      <span>Mobile Number</span>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">
                        Auto-detects OTP
                      </span>
                    </label>

                    {/* Phone Input Group */}
                    <div className="flex items-center rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:shadow-[0_0_0_2px] focus-within:shadow-secondary transition-all h-[52px] overflow-hidden px-3 gap-2">
                      <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-outline-variant/30">
                        <span className="text-base select-none">🇮🇳</span>
                        <span className="font-label-md text-label-md text-primary font-bold">+91</span>
                        <span className="material-symbols-outlined text-[16px] text-outline">
                          expand_more
                        </span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none tracking-wide"
                      />
                    </div>
                    {errorMsg && (
                      <p className="font-body-sm text-body-sm text-error">{errorMsg}</p>
                    )}
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 pt-1">
                      <span className="material-symbols-outlined text-[15px] text-secondary">
                        mark_chat_read
                      </span>
                      Instant verification link and OTP sent via WhatsApp &amp; SMS.
                    </p>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    className="w-full h-[52px] rounded-xl bg-secondary hover:bg-secondary-container active:scale-[0.99] text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0_8px_18px_-4px_rgba(0,81,213,0.35)] transition-all cursor-pointer"
                  >
                    <span>Get OTP &amp; Continue</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </form>
              ) : (
                /* Step 2: OTP Verification */
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Sent code to
                      </span>
                      <span className="font-headline-sm text-headline-sm text-primary">
                        +91 {phone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="font-label-md text-label-md text-secondary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* OTP Input 4-Box Row */}
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface">
                      Enter 4-Digit One-Time Password
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={inputRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="h-14 text-center font-headline-md text-headline-md text-primary bg-surface-container-low rounded-xl focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px] focus:shadow-secondary focus:outline-none transition-all"
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Resend OTP in <strong className="text-primary font-bold">0:45s</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => alert('OTP resent to ' + phone)}
                        className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary uppercase tracking-wider cursor-pointer"
                      >
                        Resend via WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || verifiedSuccess}
                    className={`w-full h-[52px] rounded-xl text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0_8px_18px_-4px_rgba(0,81,213,0.35)] transition-all cursor-pointer ${
                      verifiedSuccess
                        ? 'bg-primary'
                        : isVerifying
                        ? 'bg-secondary/80'
                        : 'bg-secondary hover:bg-secondary-container active:scale-[0.99]'
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">
                          progress_activity
                        </span>
                        <span>Authenticating...</span>
                      </>
                    ) : verifiedSuccess ? (
                      <>
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>Authenticated! Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">lock_open</span>
                        <span>Verify &amp; Access Trips</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="relative flex items-center justify-center py-2">
                <div className="w-full border-t border-surface-container-high"></div>
                <span className="absolute bg-surface-container-lowest px-3 font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  Or continue with
                </span>
              </div>

              {/* 1-Click Alternate Authentications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    login(phone);
                    navigate('/');
                  }}
                  className="h-12 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container-high/40 shadow-xs flex items-center justify-center gap-2.5 transition-all text-on-surface cursor-pointer group"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-label-md text-label-md group-hover:text-primary">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    login(phone);
                    navigate('/');
                  }}
                  className="h-12 px-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low border border-surface-container-high/40 shadow-xs flex items-center justify-center gap-2 transition-all text-on-surface cursor-pointer group"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">domain</span>
                  <span className="font-label-md text-label-md group-hover:text-primary">
                    Corporate SSO
                  </span>
                </button>
              </div>

              {/* Trust Badges & Policies */}
              <div className="pt-3 space-y-3">
                <div className="flex items-center justify-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    security
                  </span>
                  <span className="font-label-sm text-label-sm">
                    256-Bit Bank-Grade Transit Telematics Encryption
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline text-center leading-relaxed">
                  By continuing, you agree to Safar Mobility's{' '}
                  <Link to="/support" className="text-secondary hover:underline">
                    Terms of Service
                  </Link>
                  ,{' '}
                  <Link to="/support" className="text-secondary hover:underline">
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link to="/support" className="text-secondary hover:underline">
                    Corridor Transit Standards
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer for Login */}
      <footer className="w-full bg-surface-container-lowest py-4 px-6 text-center font-body-sm text-body-sm text-on-surface-variant border-t border-surface-container-low">
        <p>© 2026 {APP_CONFIG.brandName} Private Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};
