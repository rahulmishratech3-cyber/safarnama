import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatINR } from '../config';

export const Profile: React.FC = () => {
  const {
    user,
    updateUser,
    logout,
    savedAddresses,
    addAddress,
    deleteAddress,
    setSearch,
    language,
    setLanguage,
    showToast,
  } = useApp();

  const navigate = useNavigate();

  // Modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Edit profile form
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  // Add address form
  const [addressTag, setAddressTag] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('Bengaluru');
  const [addressPincode, setAddressPincode] = useState('560038');
  const [addressLandmark, setAddressLandmark] = useState('');

  // Controlled notification toggles
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [flightAlerts, setFlightAlerts] = useState(true);

  // Top up simulator
  const [walletBalance, setWalletBalance] = useState(user.walletBalance);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: editName,
      email: editEmail,
    });
    setShowEditProfileModal(false);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) return;

    addAddress({
      tag: addressTag,
      label: addressTag === 'Home' ? 'Home' : addressTag === 'Office' ? 'Office' : 'Saved Place',
      address: addressLine,
      city: `${addressCity}, Karnataka - ${addressPincode}`,
      landmark: addressLandmark ? `Landmark: ${addressLandmark}` : undefined,
      isDefault: false,
    });

    setAddressLine('');
    setAddressLandmark('');
    setShowAddAddressModal(false);
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(user.referralCode);
    setCopiedReferral(true);
    showToast(`Referral code ${user.referralCode} copied`);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleBookFromAddress = (addrText: string) => {
    setSearch((prev) => ({
      ...prev,
      drop: addrText,
    }));
    navigate('/vehicles');
  };

  const handleTopUp = () => {
    setWalletBalance((prev) => prev + 500);
    showToast('₹500 added to Safar Cash Wallet!');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 relative">
      {/* Subtle ambient blur highlights */}
      <div className="absolute top-12 left-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-48 right-12 w-80 h-80 bg-on-tertiary-container/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header & Breadcrumb Context Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-secondary">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold">
              Account Settings &amp; Preferences
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-extrabold">
            Profile &amp; Saved Places
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            Manage your verified credentials, frequent pickup points, one-tap payment mandates, and Safar Gold transit privileges.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/support"
            className="h-12 px-5 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-2 shadow-xs transition-all duration-200 no-underline font-bold"
          >
            <span className="material-symbols-outlined text-[20px] text-secondary">support_agent</span>
            <span>Help Desk</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setEditName(user.name);
              setEditEmail(user.email);
              setShowEditProfileModal(true);
            }}
            className="h-12 px-6 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-2 shadow-[0_8px_18px_-4px_rgba(9,20,38,0.3)] hover:shadow-lg transition-all duration-200 cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2-Column Responsive Architecture (5 Cols / 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Profile, Tier, Stats, Referrals & Safety (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* User Identity Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-surface-container-high rounded-full opacity-60 pointer-events-none"></div>
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-headline-lg text-headline-lg shadow-md font-bold">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <span
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm"
                  title="Identity Verified"
                >
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                    {user.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm inline-flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[12px]">verified</span> Verified
                    Rider
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px] text-outline">call</span>
                    <span className="font-medium text-on-surface">{user.phone}</span>
                    <span className="text-on-tertiary-container font-label-sm text-label-sm bg-surface-container-low px-1.5 py-0.5 rounded font-bold">
                      Primary
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm truncate">
                    <span className="material-symbols-outlined text-[16px] text-outline">mail</span>
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifetime Stats Mosaic Bar */}
            <div className="mt-6 pt-5 bg-surface-container-low/70 rounded-xl p-4 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  {user.tripsTaken}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide font-bold">
                  Trips Taken
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border-x-0">
                <div className="flex items-center gap-1">
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    {user.riderScore}
                  </span>
                  <span
                    className="material-symbols-outlined text-[18px] text-on-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide font-bold">
                  Rider Score
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md text-secondary font-bold">
                  {user.points}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide font-bold">
                  Points ({formatINR(user.points)})
                </span>
              </div>
            </div>
          </div>

          {/* Safar Gold Member Tier Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-tertiary-container via-primary-container to-primary text-on-primary shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-on-tertiary-container/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-on-tertiary-container/30 flex items-center justify-center text-on-tertiary-fixed shadow-inner">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    hotel_class
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-tertiary-fixed-dim uppercase tracking-widest block font-bold">
                    VIP Membership
                  </span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                    Safar Gold Member
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-on-primary font-label-sm text-label-sm font-bold">
                Exp: {user.tierExpiry}
              </span>
            </div>
            <p className="mt-4 font-body-sm text-body-sm text-primary-fixed leading-relaxed">
              Zero cancellation charges on intercity cabs, dedicated express chauffeurs, and complimentary fast-lane highway toll clearance.
            </p>
            <div className="mt-5 pt-4 bg-surface-container-lowest/10 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">
                  verified
                </span>
                <span className="font-label-sm text-label-sm text-surface-container-lowest font-bold">
                  Priority Helpline 24x7
                </span>
              </div>
              <Link
                to="/packages/mysuru-heritage"
                className="font-label-md text-label-md text-tertiary-fixed hover:text-white flex items-center gap-1 transition-colors no-underline font-bold"
              >
                <span>View Privileges</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* Referral & Earn Section */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">redeem</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Refer &amp; Earn ₹150
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Both you and your friend get ₹150 ride credits.
                </p>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Share your personal invite code. Valid for their first booked airport taxi or weekend outstation tour package.
            </p>

            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 pl-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                  Code:
                </span>
                <span className="font-headline-sm text-headline-sm font-extrabold tracking-wider text-primary font-mono">
                  {user.referralCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyReferral}
                className="h-12 px-5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-md text-label-md shadow-[0_8px_18px_-4px_rgba(0,81,213,0.35)] transition-all flex items-center justify-center cursor-pointer font-bold"
              >
                {copiedReferral ? 'COPIED!' : 'Copy Code'}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Share instantly via:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  aria-label="Share on WhatsApp"
                  className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  aria-label="Share via Email"
                  className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  aria-label="Share Link"
                  className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preferences & Safety Controls */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)] space-y-6">
            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-secondary text-[22px]">tune</span>
              Ride &amp; Safety Controls
            </h3>

            {/* Language Selector */}
            <div className="flex items-center justify-between gap-4 py-1">
              <div>
                <span className="font-label-lg text-label-lg text-primary block font-bold">
                  App Language
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Display voice &amp; receipt prompts
                </span>
              </div>
              <div className="inline-flex rounded-xl bg-surface-container p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    showToast('App language changed to English');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer transition-all ${
                    language === 'en'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('hi');
                    showToast('ऐप भाषा हिन्दी सेट की गई');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer transition-all ${
                    language === 'hi'
                      ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="p-4 rounded-xl bg-surface-container-low space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                  </div>
                  <div>
                    <h4 className="font-label-lg text-label-lg text-primary font-bold">
                      Trusted SOS Contacts
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      2 active emergency guardians
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Emergency contacts guardian sync verified')}
                  className="font-label-md text-label-md text-secondary hover:underline h-8 px-2 flex items-center cursor-pointer font-bold"
                >
                  Manage
                </button>
              </div>

              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  contact_phone
                </span>
                <span className="font-semibold">Pooja Sharma</span>
                <span className="text-on-surface-variant">(Spouse) • +91 98450 11223</span>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2">
              <span className="font-label-md text-label-md text-primary uppercase tracking-wide block font-bold">
                Transit Alerts
              </span>
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="font-body-md text-body-md text-on-surface">
                  WhatsApp Driver &amp; Route Sharing
                </span>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-5 h-5 accent-secondary cursor-pointer rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="font-body-md text-body-md text-on-surface">
                  SMS OTP &amp; Trip Fare Breakdown
                </span>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-5 h-5 accent-secondary cursor-pointer rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="font-body-md text-body-md text-on-surface">
                  Flight Delay Alerts for Airport Cabs
                </span>
                <input
                  type="checkbox"
                  checked={flightAlerts}
                  onChange={(e) => setFlightAlerts(e.target.checked)}
                  className="w-5 h-5 accent-secondary cursor-pointer rounded"
                />
              </label>
            </div>

            {/* Sign Out CTA */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full h-12 rounded-2xl bg-error-container hover:bg-error/20 text-on-error-container font-label-lg text-label-lg flex items-center justify-center gap-2 transition-colors cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Sign Out from All Devices</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Saved Places, Wallet, Payment Methods & Support (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* SECTION 1: Saved Addresses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold">
                  Saved Places &amp; Frequent Hubs
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Quick 1-tap bookings without re-entering pickup markers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(true)}
                className="h-12 px-5 rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center gap-2 shadow-[0_8px_18px_-4px_rgba(0,81,213,0.35)] transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                <span>Add New Address</span>
              </button>
            </div>

            {/* Render savedAddresses from context */}
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)] hover:shadow-md transition-shadow relative"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        addr.tag === 'Airport'
                          ? 'bg-secondary-fixed text-secondary'
                          : 'bg-surface-container-low text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {addr.tag === 'Home'
                          ? 'home'
                          : addr.tag === 'Office'
                          ? 'domain'
                          : addr.tag === 'Airport'
                          ? 'flight_takeoff'
                          : 'location_on'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                          {addr.label}
                        </h3>
                        {addr.isDefault && (
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold">
                            Default Pickup
                          </span>
                        )}
                        {addr.tag === 'Airport' && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                            T1 &amp; T2 Express Route
                          </span>
                        )}
                        {addr.tag === 'Office' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                            Corporate Drop
                          </span>
                        )}
                      </div>

                      <p className="font-body-md text-body-md text-on-surface font-semibold">
                        {addr.address}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {addr.city}
                      </p>
                      {addr.landmark && (
                        <p className="font-body-sm text-body-sm text-outline-variant flex items-center gap-1.5 pt-1">
                          <span className="material-symbols-outlined text-[16px] text-outline">
                            apartment
                          </span>
                          <span>{addr.landmark}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-2 self-end md:self-start">
                    <button
                      type="button"
                      onClick={() => showToast(`Address ${addr.label} is active`)}
                      className="w-10 h-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Address"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="w-10 h-10 rounded-xl bg-surface-container-low hover:bg-error-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete Address"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bade CTA Bar */}
                <div className="mt-5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      local_taxi
                    </span>
                    <span>
                      Average Cab ETA:{' '}
                      <strong className="text-primary font-bold">3 mins away</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookFromAddress(addr.address)}
                    className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-colors cursor-pointer font-bold"
                  >
                    <span>Book Cab to {addr.tag}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 2: Payment Methods & Safar Wallet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold">
                  Payments &amp; Safar Wallet
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Seamless post-ride auto debit &amp; business billing.
                </p>
              </div>
              <Link
                to="/trips"
                className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1 no-underline font-bold"
              >
                <span>Payment History</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </div>

            {/* Safar Cash Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px]">
                    account_balance_wallet
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-bold">
                    Safar Cash Balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-xl text-headline-xl text-primary font-black">
                      {formatINR(walletBalance)}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded font-bold">
                      Active 1-Tap
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Instant checkout without bank redirects
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleTopUp}
                  className="h-12 px-6 rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0_8px_18px_-4px_rgba(0,81,213,0.35)] transition-all w-full md:w-auto cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Top Up (+₹500)</span>
                </button>
              </div>
            </div>

            {/* Saved Instruments List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Saved UPI */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">contactless</span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                        PhonePe UPI
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        safar.rahul@okhdfcbank
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm font-bold">
                    Active Auto-Pay
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-2">
                  <span className="flex items-center gap-1 text-on-tertiary-container font-semibold">
                    <span className="material-symbols-outlined text-[16px]">bolt</span> Instant
                    mandate up to ₹5,000
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast('Mandate configuration updated')}
                    className="text-secondary font-label-md text-label-md hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>

              {/* Saved Credit Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">credit_card</span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                        HDFC Regalia Credit Card
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        •••• •••• •••• 4821 (Exp 08/27)
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
                    Default
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-2">
                  <span className="flex items-center gap-1 text-outline">
                    <span className="material-symbols-outlined text-[16px]">lock</span> Zero-CVV Fast
                    Booking Enabled
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast('Card security settings active')}
                    className="text-secondary font-label-md text-label-md hover:underline cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Corporate GSTIN Tile */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Corporate GSTIN &amp; Tax Receipts
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Add business details for automated monthly GST input tax credit invoices.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Enter 15-digit GSTIN in company billing profile')}
                className="h-12 px-5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md shrink-0 transition-colors cursor-pointer font-bold"
              >
                + Add GST Number
              </button>
            </div>
          </div>

          {/* SECTION 3: Account Support Shortcuts */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0px_4px_20px_-2px_rgba(15,23,42,0.06)]">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 font-bold">
              Quick Legal &amp; Help Desk Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/support"
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-2 no-underline"
              >
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  contact_support
                </span>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  24x7 Help Center
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Recent tickets, driver feedback
                </span>
              </Link>

              <Link
                to="/trips"
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-2 no-underline"
              >
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  history
                </span>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  Past Trip Receipts
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Download PDF invoices &amp; tolls
                </span>
              </Link>

              <Link
                to="/support"
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-2 no-underline"
              >
                <span className="material-symbols-outlined text-secondary text-[24px]">policy</span>
                <span className="font-label-lg text-label-lg text-primary font-bold">
                  Terms &amp; Safety Policy
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Passenger charter &amp; refund guidelines
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Add New Address */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-low">
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Add New Saved Place
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 pt-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                  Place Tag
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Office', 'Other'] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setAddressTag(tag)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl font-label-md text-label-md cursor-pointer transition-all ${
                        addressTag === tag
                          ? 'bg-surface-container text-primary font-bold ring-2 ring-secondary'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {tag === 'Home' ? 'home' : tag === 'Office' ? 'domain' : 'star'}
                      </span>
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                  Complete Address / GPS Location
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="House / Flat No., Street Name, Area"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary text-primary font-body-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-primary font-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={addressPincode}
                    onChange={(e) => setAddressPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-primary font-body-md focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                  Landmark / Driver Directions
                </label>
                <input
                  type="text"
                  value={addressLandmark}
                  onChange={(e) => setAddressLandmark(e.target.value)}
                  placeholder="e.g. Opposite Metro Pillar 142"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-primary font-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-low">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="h-12 px-5 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg shadow-md cursor-pointer font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Profile */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-low">
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Edit Rider Details
              </h3>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-primary font-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                  Mobile Number (Requires OTP verification to change)
                </label>
                <input
                  type="text"
                  disabled
                  value={user.phone}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container text-outline font-body-md cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-1 font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-low text-primary font-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-low">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="h-12 px-5 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md cursor-pointer font-bold"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
