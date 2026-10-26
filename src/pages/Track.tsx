import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatINR, APP_CONFIG } from '../config';

export const Track: React.FC = () => {
  const { currentBooking, cancelRide, showToast } = useApp();
  const navigate = useNavigate();

  // Progress simulation state:
  // etaMinutes counts down from 8 to 0 (1 real second = 1 minute)
  const [etaMinutes, setEtaMinutes] = useState(8);
  const [tripPhase, setTripPhase] = useState<'approaching' | 'arrived' | 'in_progress'>('approaching');
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [shared, setShared] = useState(false);
  const [trafficActive, setTrafficActive] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: 'Namaste sir, I am arriving via 100ft Road. Will reach pickup point shortly.', time: '04:15 PM' },
  ]);

  useEffect(() => {
    if (!currentBooking) {
      showToast('Please start a booking first');
      navigate('/');
    }
  }, [currentBooking, navigate, showToast]);

  // Timer: 1 real second = 1 simulation minute
  useEffect(() => {
    if (tripPhase !== 'approaching') return;

    const timer = setInterval(() => {
      setEtaMinutes((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTripPhase('arrived');
          showToast('Driver Ramesh Kumar has arrived at your pickup spot!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tripPhase, showToast]);

  if (!currentBooking) return null;

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(currentBooking.otp);
    setCopiedOtp(true);
    showToast(`Trip OTP ${currentBooking.otp} copied`);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Safar Ride Status: ${currentBooking.driver.name} (${currentBooking.driver.plateNumber})`,
        text: `Track my ride from ${currentBooking.pickup} to ${currentBooking.drop}. Vehicle: ${currentBooking.driver.vehicleModel}.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShared(true);
      showToast('Live tracking link copied to clipboard');
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = { sender: 'user' as const, text: chatMessage.trim(), time: 'Just now' };
    setChatHistory((prev) => [...prev, newMsg]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'driver', text: 'Noted sir! Taking care of it.', time: 'Just now' },
      ]);
    }, 1200);
  };

  const handleStartTrip = () => {
    setTripPhase('in_progress');
    showToast('OTP verified! Trip in progress.');
  };

  const handleCompleteTrip = () => {
    navigate('/complete');
  };

  const handleConfirmCancel = () => {
    cancelRide(currentBooking.bookingId, 'Cancelled by rider during live tracking');
    setShowCancelModal(false);
    navigate('/trips');
  };

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Context & Live Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/trips"
            className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors shadow-sm no-underline"
            title="Back to trips"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase tracking-wider animate-pulse font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-on-secondary"></span> Live Tracking
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                CRN: {currentBooking.bookingId}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-0.5 font-extrabold">
              {currentBooking.packageName || 'Airport Premier Transfer'}
            </h1>
          </div>
        </div>

        {/* Quick Status Strip */}
        <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2 rounded-2xl shadow-sm border border-surface-container-low">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
              Vehicle Status
            </span>
            <span className="font-label-md text-label-md text-primary font-bold">
              {tripPhase === 'approaching'
                ? 'Driver Approaching Pickup'
                : tripPhase === 'arrived'
                ? 'Driver Arrived at Pickup Spot'
                : 'Trip in Progress (En Route)'}
            </span>
          </div>
          <span className="mx-2 text-outline-variant">|</span>
          <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
            <span className="material-symbols-outlined text-[18px] text-secondary">update</span>
            <span>Updated live</span>
          </div>
        </div>
      </div>

      {/* Main Split Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Interactive Map & Live Navigation Feed (~60% desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Live Route Map Container */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-surface-container-high aspect-[16/11] lg:min-h-[460px]">
            {/* Styled Map Canvas Visual */}
            <div className="w-full h-full bg-[#e8eef5] relative overflow-hidden">
              {/* City Map Grid Lines */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>

              {/* Highway Curves & Terrain */}
              <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="none">
                {/* Roads */}
                <path
                  d="M 60 340 C 180 300, 240 220, 340 180 S 480 120, 540 60"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 340 C 180 300, 240 220, 340 180 S 480 120, 540 60"
                  fill="none"
                  stroke="#0051d5"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={trafficActive ? '8,4' : 'none'}
                />

                {/* Pickup marker */}
                <circle cx="60" cy="340" r="14" fill="#0051d5" opacity="0.2" />
                <circle cx="60" cy="340" r="8" fill="#0051d5" />
                <circle cx="60" cy="340" r="3" fill="#ffffff" />

                {/* Moving Chauffeur Marker according to ETA */}
                <g
                  transform={`translate(${
                    tripPhase === 'approaching'
                      ? 60 + (8 - etaMinutes) * 20
                      : tripPhase === 'arrived'
                      ? 60
                      : 260
                  }, ${
                    tripPhase === 'approaching'
                      ? 340 - (8 - etaMinutes) * 15
                      : tripPhase === 'arrived'
                      ? 340
                      : 210
                  })`}
                >
                  <circle cx="0" cy="0" r="16" fill="#1e293b" />
                  <circle cx="0" cy="0" r="12" fill="#0051d5" />
                  <circle cx="0" cy="0" r="5" fill="#ffffff" />
                </g>

                {/* Drop marker */}
                <circle cx="540" cy="60" r="14" fill="#c88000" opacity="0.2" />
                <circle cx="540" cy="60" r="8" fill="#c88000" />
                <circle cx="540" cy="60" r="3" fill="#ffffff" />
              </svg>
            </div>

            {/* Top-left Floating Route Pill */}
            <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-surface-container-low">
              <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">navigation</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {tripPhase === 'approaching'
                      ? `Arriving in ${etaMinutes} mins`
                      : tripPhase === 'arrived'
                      ? 'Driver has arrived!'
                      : 'Trip in Progress'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-secondary font-bold">
                    {tripPhase === 'approaching'
                      ? `${(etaMinutes * 0.3 + 0.2).toFixed(1)} km away`
                      : tripPhase === 'arrived'
                      ? 'At Pickup Gate'
                      : 'On Expressway'}
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">
                    alt_route
                  </span>{' '}
                  Route via Outer Ring Rd &amp; Old Madras Rd
                </span>
              </div>
            </div>

            {/* Top-Right Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => showToast('GPS re-centered on chauffeur location')}
                className="w-11 h-11 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                title="Recenter Driver Location"
              >
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrafficActive(!trafficActive);
                  showToast(trafficActive ? 'Live traffic hidden' : 'Live traffic layer visible');
                }}
                className={`w-11 h-11 rounded-xl bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                  trafficActive ? 'text-secondary' : 'text-on-surface-variant'
                }`}
                title="Toggle Live Traffic"
              >
                <span className="material-symbols-outlined text-[20px]">traffic</span>
              </button>
            </div>

            {/* Bottom Floating Route Milestones Badge */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-primary/95 text-on-primary backdrop-blur-md p-3.5 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[20px]">
                    pin_drop
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                    Pickup Point
                  </span>
                  <span className="font-body-md text-body-md font-semibold text-on-primary truncate max-w-[200px] sm:max-w-xs">
                    {currentBooking.pickup}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                  Target Destination
                </span>
                <span className="font-label-md text-label-md text-on-primary">
                  {currentBooking.drop}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Progress Action Bar (Simulation Controls) */}
          {tripPhase === 'arrived' && (
            <div className="p-5 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[32px] text-on-tertiary-container">
                  hail
                </span>
                <div>
                  <h4 className="font-headline-sm text-headline-sm font-bold">
                    Chauffeur Waiting at Pickup Spot
                  </h4>
                  <p className="font-body-sm text-body-sm">
                    Verify number plate KA 01 MJ 8472 and share your 4-digit OTP.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStartTrip}
                className="w-full sm:w-auto px-6 h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all cursor-pointer shadow-lg"
              >
                Start Trip (Boarded)
              </button>
            </div>
          )}

          {tripPhase === 'in_progress' && (
            <div className="p-5 rounded-2xl bg-secondary text-on-secondary flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[32px] text-secondary-fixed">
                  moving
                </span>
                <div>
                  <h4 className="font-headline-sm text-headline-sm font-bold">
                    Trip In Progress Across Expressway
                  </h4>
                  <p className="font-body-sm text-body-sm text-secondary-fixed">
                    Estimated arrival at destination ramp: 05:15 PM.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCompleteTrip}
                className="w-full sm:w-auto px-6 h-12 rounded-xl bg-surface-container-lowest text-primary font-label-lg text-label-lg hover:bg-surface-container transition-all cursor-pointer shadow-lg font-bold"
              >
                Complete Trip &amp; View Invoice
              </button>
            </div>
          )}

          {/* Ride Itinerary & Timeline Stepper Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4">
              <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-secondary">timeline</span> Trip
                Milestones &amp; Progress
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono font-bold">
                EST. DURATION: {currentBooking.durationEst.toUpperCase()}
              </span>
            </div>

            <div className="relative pl-6 space-y-7 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
              {/* Step 1 */}
              <div className="relative flex items-start gap-4">
                <span className="absolute -left-[27px] w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h4 className="font-label-lg text-label-lg text-primary">
                      Driver Assigned &amp; Dispatched
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {currentBooking.driver.name} accepted the dispatch corridor.
                    </p>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant font-mono mt-1 sm:mt-0 font-bold">
                    04:12 PM
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-4">
                <span
                  className={`absolute -left-[27px] w-6 h-6 rounded-full flex items-center justify-center text-on-secondary shadow-md ${
                    tripPhase === 'approaching'
                      ? 'bg-secondary animate-pulse'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {tripPhase === 'approaching' ? 'directions_car' : 'check'}
                  </span>
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-label-lg text-label-lg ${
                          tripPhase === 'approaching' ? 'text-secondary font-bold' : 'text-primary'
                        }`}
                      >
                        {tripPhase === 'approaching'
                          ? 'On the way to pickup'
                          : 'Driver arrived at pickup'}
                      </h4>
                      {tripPhase === 'approaching' && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-label-sm text-secondary font-bold">
                          CURRENT PHASE
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Approaching via 100 Feet Road signal. Smooth traffic flow.
                    </p>
                  </div>
                  <span className="font-label-md text-label-md text-secondary font-bold font-mono mt-1 sm:mt-0">
                    {tripPhase === 'approaching' ? `ETA In ${etaMinutes} mins` : 'ARRIVED'}
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-4">
                <span
                  className={`absolute -left-[27px] w-6 h-6 rounded-full flex items-center justify-center ${
                    tripPhase === 'in_progress'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {tripPhase === 'in_progress' ? 'directions_car' : 'lock'}
                  </span>
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h4 className="font-label-lg text-label-lg text-on-surface">
                      Trip starts with verification OTP
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Provide the 4-digit security code before driver starts odometer.
                    </p>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant italic mt-1 sm:mt-0">
                    {tripPhase === 'in_progress' ? 'Trip Underway' : 'At Pickup'}
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-4">
                <span className="absolute -left-[27px] w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">flight_takeoff</span>
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h4 className="font-label-lg text-label-lg text-on-surface">
                      Arrive at {currentBooking.drop}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Drop-off point via elevated corridor.
                    </p>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant font-mono font-medium mt-1 sm:mt-0">
                    Est. 05:15 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Route Insights / Travel Note */}
          <div className="bg-surface-container-low rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div className="flex-1">
              <h4 className="font-label-lg text-label-lg text-primary">
                Safar Flight Delay Compensation Shield Active
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Your transit is monitored against Bangalore International Airport real-time flight departures. Free wait-time buffer included.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Driver, Security & Trip Controls (~40% desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* 1. Start Trip OTP Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">key</span>
                <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-bold">
                  Start Trip OTP
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold">
                Verification Code
              </span>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentBooking.otp.split('').map((digit, i) => (
                  <span
                    key={i}
                    className="w-12 h-14 rounded-lg bg-surface-container-lowest flex items-center justify-center font-headline-xl text-headline-xl font-bold text-primary shadow-sm tracking-wider font-mono"
                  >
                    {digit}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopyOtp}
                className="flex flex-col items-center justify-center px-4 py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-secondary transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Copy OTP"
              >
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                <span className="font-label-sm text-label-sm font-bold mt-0.5">
                  {copiedOtp ? 'COPIED!' : 'COPY'}
                </span>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">
                info
              </span>
              <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                Share this OTP with driver <strong>only after verifying</strong> vehicle number &amp; identity card.
              </p>
            </div>
          </div>

          {/* 2. Driver & Vehicle Profile Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={currentBooking.driver.photoUrl}
                    alt={currentBooking.driver.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      {currentBooking.driver.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      {currentBooking.driver.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center text-on-tertiary-container font-label-md text-label-md font-bold">
                      <span
                        className="material-symbols-outlined text-[16px] mr-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>{' '}
                      {currentBooking.driver.rating}
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      {currentBooking.driver.tripsCount}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {currentBooking.driver.languages}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <img
                  src={currentBooking.driver.carPhotoUrl}
                  alt="Vehicle"
                  className="w-20 h-14 object-contain"
                />
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {currentBooking.vehicle.name} AC
                </span>
              </div>
            </div>

            {/* High-Security Number Plate Component */}
            <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                  Registered Plate
                </span>
                <span className="font-body-md text-body-md text-primary font-bold">
                  {currentBooking.driver.vehicleModel}
                </span>
              </div>

              <div className="flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-md shadow-sm border border-outline-variant/30">
                <div className="flex flex-col items-center justify-center pr-2 mr-2 border-r border-outline-variant">
                  <span className="font-label-sm text-label-sm font-bold text-secondary">IND</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                </div>
                <span className="font-headline-sm text-headline-sm font-extrabold text-primary tracking-widest font-mono">
                  {currentBooking.driver.plateNumber}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <a
                href={`tel:${currentBooking.driver.phone}`}
                onClick={(e) => {
                  e.preventDefault();
                  showToast(`Calling chauffeur Ramesh Kumar (${currentBooking.driver.phone})...`);
                }}
                className="h-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-on-secondary flex items-center justify-center gap-1.5 font-label-md text-label-md font-bold transition-all shadow-md active:scale-95 no-underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
                <span>Call Driver</span>
              </a>

              <button
                type="button"
                onClick={() => setShowMessageModal(true)}
                className="h-12 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center gap-1.5 font-label-md text-label-md font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Message</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="h-12 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center gap-1.5 font-label-md text-label-md font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Share with Family"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
                <span>{shared ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* 3. Safety, Security & Insurance Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  Safar Safety Protocol
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[14px]">health_and_safety</span>{' '}
                Insurance Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  showToast('EMERGENCY SOS DISPATCHED: Control Room & Guardians Alerted!');
                }}
                className="h-12 rounded-2xl bg-error hover:bg-error/90 text-on-error flex items-center justify-center gap-2 font-label-lg text-label-lg font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">sos</span>
                <span>Emergency SOS</span>
              </button>

              <a
                href={`tel:${APP_CONFIG.tollFreeHelpline}`}
                onClick={(e) => {
                  e.preventDefault();
                  showToast(`Connecting to 24x7 Safety Desk: ${APP_CONFIG.tollFreeHelpline}`);
                }}
                className="h-12 rounded-2xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center gap-2 font-label-md text-label-md font-bold transition-all active:scale-95 shadow-sm no-underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  support_agent
                </span>
                <span>24x7 Safety Care</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-1 text-on-surface-variant font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  verified
                </span>{' '}
                Real-time GPS telematics monitored
              </span>
              <span className="font-mono">Policy #SAF-8491-GI</span>
            </div>
          </div>

          {/* 4. Fare & Payment Status Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Guaranteed Fare Breakdown
              </span>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                NO SURGE APPLIED
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-xl text-headline-xl font-bold text-primary">
                  {formatINR(currentBooking.fareBreakdown.totalPayable)}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                  {formatINR(currentBooking.fareBreakdown.totalPayable + 150)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  account_balance_wallet
                </span>
                <span>{currentBooking.paymentMethod.toUpperCase()} / On Drop</span>
              </div>
            </div>

            <div className="pt-3 bg-surface-container-low p-3 rounded-xl space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Base Fare ({currentBooking.distanceKm} km included)</span>
                <span className="font-medium text-on-surface font-mono">
                  {formatINR(currentBooking.fareBreakdown.baseFare)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Airport Entry &amp; Toll Plaza Fees</span>
                <span className="font-medium text-on-surface font-mono">
                  {formatINR(currentBooking.fareBreakdown.tollAndParking)}
                </span>
              </div>
              <div className="flex justify-between text-secondary font-medium">
                <span>GST &amp; Driver Welfare cess</span>
                <span className="font-bold">Included</span>
              </div>
            </div>
          </div>

          {/* 5. Manage Ride Triggers */}
          <div className="flex items-center justify-between gap-4 px-2 pt-1 pb-4">
            <button
              type="button"
              onClick={() => showToast('Chauffeur notified to update destination waypoint')}
              className="flex items-center gap-1.5 font-label-md text-label-md text-secondary hover:text-primary transition-colors py-2 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">edit_location_alt</span>
              <span>Change Drop Location</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-1.5 font-label-md text-label-md text-error hover:text-on-error-container transition-colors py-2 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
              <span>Cancel Trip (Free Cancellation)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message Chauffeur Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest shadow-2xl flex flex-col h-[480px]">
            <div className="p-4 bg-primary text-on-primary rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentBooking.driver.photoUrl}
                  alt={currentBooking.driver.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-primary">
                    {currentBooking.driver.name}
                  </h4>
                  <span className="text-secondary-fixed text-xs">Online • KA 01 MJ 8472</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container-lowest/20 flex items-center justify-center text-on-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-low">
              {chatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    item.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      item.sender === 'user'
                        ? 'bg-secondary text-on-secondary rounded-br-xs'
                        : 'bg-surface-container-lowest text-primary rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {item.text}
                  </div>
                  <span className="text-[10px] text-on-surface-variant px-1 mt-0.5">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-surface-container-lowest rounded-b-2xl border-t border-surface-container-low flex items-center gap-2"
            >
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type instructions for chauffeur..."
                className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container-low text-primary text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
              />
              <button
                type="submit"
                className="h-11 px-4 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-container transition-all cursor-pointer font-bold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Trip Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary font-bold">
              Cancel Ongoing Trip?
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel? Chauffeur {currentBooking.driver.name} is only {etaMinutes} minutes away and zero-cancellation fee protection applies.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="h-11 px-5 rounded-xl bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Keep Ride
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="h-11 px-5 rounded-xl bg-error text-on-error font-label-md text-label-md hover:bg-error/90 transition-colors cursor-pointer shadow-md"
              >
                Yes, Cancel Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
