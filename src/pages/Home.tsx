import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_PACKAGES } from '../data/mock';
import { formatINR } from '../config';

export const Home: React.FC = () => {
  const { search, setSearch, swapPickupDrop, applyCoupon, showToast, user } = useApp();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'hills' | 'heritage'>('all');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleTripTypeChange = (type: 'oneway' | 'round' | 'airport') => {
    setSearch((prev) => ({ ...prev, tripType: type }));
  };

  const handleFindCabs = () => {
    navigate('/vehicles');
  };

  const handleApplyPromo = () => {
    navigator.clipboard?.writeText('SAFAR10');
    applyCoupon('SAFAR10');
    setCouponApplied(true);
    setTimeout(() => setCouponApplied(false), 3000);
  };

  const filteredPackages = MOCK_PACKAGES.filter((pkg) => {
    if (filter === 'hills') return pkg.tagline.toLowerCase().includes('hill') || pkg.tagline.toLowerCase().includes('altitude');
    if (filter === 'heritage') return pkg.tagline.toLowerCase().includes('heritage');
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Banner & Interactive Booking Command Hero */}
      <section className="relative w-full overflow-hidden bg-surface-container-low px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
        {/* Subtle Ambient Backdrop Highlights */}
        <div className="absolute -top-32 right-12 w-96 h-96 rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-surface-container-high opacity-60 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
          {/* Greeting, SOS Ribbon, and Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Hello, {user.name.split(' ')[0]} 👋
                </span>
                <span className="text-on-surface-variant/40">|</span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                  Karnataka Express Corridor Active
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
                Where do you want to travel today?
              </h1>
            </div>

            {/* 24x7 SOS Active Indicator Badge */}
            <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-2xl shadow-sm self-start lg:self-auto">
              <div className="w-8 h-8 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    24x7 SOS Protected
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Live telemetry &amp; emergency response
                </span>
              </div>
            </div>
          </div>

          {/* Prominent Desktop Booking Search Widget */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-md">
            {/* Trip Type Tabs & Trip Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-surface-container-low">
              <div className="inline-flex p-1 rounded-xl bg-surface-container-low">
                <button
                  type="button"
                  onClick={() => handleTripTypeChange('oneway')}
                  className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    search.tripType === 'oneway'
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  One-Way Transit
                </button>
                <button
                  type="button"
                  onClick={() => handleTripTypeChange('round')}
                  className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    search.tripType === 'round'
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => handleTripTypeChange('airport')}
                  className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    search.tripType === 'airport'
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Airport Transfer
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-tertiary-container bg-tertiary-fixed/30 px-2.5 py-1 rounded-full font-bold">
                  ⚡ Instant Confirmation &amp; Toll Inclusive
                </span>
              </div>
            </div>

            {/* Inputs Row Grid */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFindCabs();
              }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-6 items-center"
            >
              {/* Pickup Location Field */}
              <div className="md:col-span-4 flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
                  <span>Pickup Point</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch((prev) => ({
                        ...prev,
                        pickup: 'Indiranagar 100ft Road, Bengaluru',
                      }));
                      showToast('GPS: Location set to Indiranagar');
                    }}
                    className="text-secondary font-bold inline-flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span className="material-symbols-outlined text-[13px]">my_location</span>{' '}
                    Current GPS
                  </button>
                </label>
                <div className="relative flex items-center h-[52px] bg-surface-container-low hover:bg-surface-container focus-within:bg-surface-container-lowest rounded-xl px-4 transition-all">
                  <span className="w-3 h-3 rounded-full bg-secondary shrink-0 mr-3 shadow-[0_0_8px_rgba(0,81,213,0.5)]"></span>
                  <input
                    type="text"
                    value={search.pickup}
                    onChange={(e) =>
                      setSearch((prev) => ({ ...prev, pickup: e.target.value }))
                    }
                    placeholder="Enter pickup address"
                    className="w-full bg-transparent font-body-lg text-body-lg text-on-surface outline-none truncate"
                  />
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-fixed text-on-secondary-fixed shrink-0 ml-2">
                    Home
                  </span>
                </div>
              </div>

              {/* Trip Inverter Button */}
              <div className="hidden md:flex md:col-span-1 justify-center pt-5">
                <button
                  type="button"
                  onClick={swapPickupDrop}
                  title="Swap pickup & drop"
                  className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                </button>
              </div>

              {/* Destination Location Field */}
              <div className="md:col-span-4 flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Destination
                </label>
                <div className="relative flex items-center h-[52px] bg-surface-container-low hover:bg-surface-container focus-within:bg-surface-container-lowest rounded-xl px-4 transition-all">
                  <span className="w-3 h-3 rounded-xs bg-tertiary-fixed-dim shrink-0 mr-3 shadow-[0_0_8px_rgba(255,185,95,0.7)]"></span>
                  <input
                    type="text"
                    value={search.drop}
                    onChange={(e) =>
                      setSearch((prev) => ({ ...prev, drop: e.target.value }))
                    }
                    placeholder="Enter drop destination"
                    className="w-full bg-transparent font-body-lg text-body-lg text-on-surface outline-none truncate"
                  />
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 ml-2">
                    flight_takeoff
                  </span>
                </div>
              </div>

              {/* Departure Slot */}
              <div className="md:col-span-3 flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Departure Slot
                </label>
                <div className="relative flex items-center h-[52px] bg-surface-container-low hover:bg-surface-container focus-within:bg-surface-container-lowest rounded-xl px-4 transition-all">
                  <span className="material-symbols-outlined text-secondary text-[20px] mr-2 shrink-0">
                    calendar_today
                  </span>
                  <input
                    type="text"
                    value={search.dateTime}
                    onChange={(e) =>
                      setSearch((prev) => ({ ...prev, dateTime: e.target.value }))
                    }
                    className="w-full bg-transparent font-body-lg text-body-lg text-on-surface outline-none cursor-pointer"
                  />
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Extra Quick Options Bar & Bade Button */}
              <div className="md:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-container-low">
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={search.includeFastTag}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          includeFastTag: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                    />
                    <span>Include FastTag &amp; State Border Tolls</span>
                  </label>
                  <span className="text-surface-dim">•</span>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={search.needLuggageCarrier}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          needLuggageCarrier: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                    />
                    <span>Need Luggage Carrier (Suv / Innova)</span>
                  </label>
                </div>

                {/* Bade Action CTA */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 h-[52px] rounded-2xl bg-secondary hover:bg-secondary/90 active:scale-[0.99] text-on-secondary font-label-lg text-label-lg shadow-[0_8px_20px_-4px_rgba(0,81,213,0.4)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <span>Find Cabs</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Explore Services Strip (5 Cards Across Desktop Bento) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
              Transit Ecosystem
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Explore Services</h2>
          </div>
          <button
            onClick={() => navigate('/vehicles')}
            className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Mobility Modes</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Outstation */}
          <div
            onClick={() => {
              setSearch((prev) => ({ ...prev, tripType: 'oneway' }));
              navigate('/vehicles');
            }}
            className="group bg-surface-container-lowest hover:bg-primary transition-all duration-300 rounded-2xl p-5 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between h-48"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-primary-container text-secondary group-hover:text-secondary-fixed flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[24px]">rv_hookup</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed group-hover:bg-secondary text-primary group-hover:text-on-secondary uppercase">
                Intercity
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-on-primary transition-colors">
                Outstation Cabs
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-primary-container mt-1 transition-colors">
                Door-to-door one way &amp; return intercity routes
              </p>
            </div>
          </div>

          {/* Card 2: City Taxi */}
          <div
            onClick={() => {
              setSearch((prev) => ({ ...prev, tripType: 'oneway' }));
              navigate('/vehicles');
            }}
            className="group bg-surface-container-lowest hover:bg-primary transition-all duration-300 rounded-2xl p-5 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between h-48"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-primary-container text-secondary group-hover:text-secondary-fixed flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[24px]">local_taxi</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-high group-hover:bg-primary-container text-on-surface group-hover:text-on-primary uppercase">
                &lt; 3 Min Pickup
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-on-primary transition-colors">
                City Taxi
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-primary-container mt-1 transition-colors">
                Fast city hops with verified meter transparent billing
              </p>
            </div>
          </div>

          {/* Card 3: Airport Ride */}
          <div
            onClick={() => {
              setSearch((prev) => ({ ...prev, tripType: 'airport' }));
              navigate('/vehicles');
            }}
            className="group bg-surface-container-lowest hover:bg-primary transition-all duration-300 rounded-2xl p-5 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between h-48"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-primary-container text-secondary group-hover:text-secondary-fixed flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed-dim text-on-secondary-fixed uppercase">
                Guaranteed Time
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-on-primary transition-colors">
                Airport Ride
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-primary-container mt-1 transition-colors">
                Flight delay buffer tracking and terminal drop-offs
              </p>
            </div>
          </div>

          {/* Card 4: Tour Packages */}
          <div
            onClick={() => navigate('/packages/mysuru-heritage')}
            className="group bg-surface-container-lowest hover:bg-primary transition-all duration-300 rounded-2xl p-5 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between h-48"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-primary-container text-tertiary-fixed-dim group-hover:text-tertiary-fixed flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[24px]">landscape</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed uppercase">
                Holiday Deals
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-on-primary transition-colors">
                Tour Packages
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-primary-container mt-1 transition-colors">
                Curated multi-day road trips with driver-guide
              </p>
            </div>
          </div>

          {/* Card 5: Hourly Rentals */}
          <div
            onClick={() => {
              setSearch((prev) => ({ ...prev, tripType: 'round' }));
              navigate('/vehicles');
            }}
            className="group bg-surface-container-lowest hover:bg-primary transition-all duration-300 rounded-2xl p-5 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between h-48"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-primary-container text-secondary group-hover:text-secondary-fixed flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-high group-hover:bg-primary-container text-on-surface group-hover:text-on-primary uppercase">
                Flexible Stops
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-on-primary transition-colors">
                Hourly Rentals
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-primary-container mt-1 transition-colors">
                Keep the cab &amp; chauffeur as long as you need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner: 10% First Booking Promo */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary p-6 sm:p-8 lg:p-10 text-on-primary shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-secondary/30 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center text-tertiary-fixed shrink-0">
              <span className="material-symbols-outlined text-[36px]">percent</span>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-tertiary-fixed text-on-tertiary-fixed uppercase tracking-wider">
                  Welcome Privileges
                </span>
                <span className="font-body-sm text-body-sm text-on-primary-container">
                  Valid across Karnataka &amp; Tamil Nadu routes
                </span>
              </div>
              <h3 className="font-headline-lg text-headline-lg font-extrabold text-on-primary">
                Get 10% OFF on your first booking
              </h3>
              <p className="font-body-md text-body-md text-on-primary-container">
                Experience sanitised cabins, complimentary highway toll guidance, and professional chauffeurs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 bg-surface-container-lowest/10 border-2 border-dashed border-secondary-fixed/50 px-4 py-2.5 rounded-xl font-headline-sm text-headline-sm text-on-primary tracking-wider">
              <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                confirmation_number
              </span>
              <span>SAFAR10</span>
            </div>
            <button
              type="button"
              onClick={handleApplyPromo}
              className={`h-12 px-6 rounded-xl font-label-lg text-label-lg shadow-md transition-all whitespace-nowrap cursor-pointer ${
                couponApplied
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-tertiary-fixed hover:bg-tertiary-fixed/90 text-on-tertiary-fixed'
              }`}
            >
              {couponApplied ? 'Applied!' : 'Apply Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Curated Tour Packages Showcase Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
              Driver-Guide Included
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Curated Tour Packages
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Handcrafted road adventures with all-inclusive fuel, toll passes, and vetted scenic stops.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant">Filter by:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer transition-all ${
                filter === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Weekenders
            </button>
            <button
              onClick={() => setFilter('hills')}
              className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer transition-all ${
                filter === 'hills'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Hill Stations
            </button>
            <button
              onClick={() => setFilter('heritage')}
              className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm cursor-pointer transition-all ${
                filter === 'heritage'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Heritage
            </button>
          </div>
        </div>

        {/* Package Cards 3-Column Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold shadow-sm">
                  {pkg.badge}
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-on-primary">
                  <span className="font-label-sm text-label-sm uppercase tracking-wide bg-primary/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {pkg.tagline}
                  </span>
                  <div className="flex items-center gap-1 bg-surface-container-lowest/20 backdrop-blur-md px-2 py-0.5 rounded-lg text-tertiary-fixed">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-label-md text-label-md text-on-primary font-bold">
                      {pkg.rating}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-primary/80">
                      ({pkg.reviewsCount})
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                <div className="space-y-2">
                  <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {pkg.overview}
                  </p>
                  <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        local_gas_station
                      </span>{' '}
                      Fuel &amp; Tolls Paid
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        directions_car
                      </span>{' '}
                      Private Cab
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-container-low flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Total per vehicle
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-headline-md text-headline-md text-primary">
                        {formatINR(pkg.basePrice)}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                        {formatINR(pkg.originalPrice)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/packages/${pkg.id}`)}
                    className="h-11 px-5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-label-md text-label-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Trip</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Intercity Corridors Data Visualization Band */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                Live Transit Insights
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">
              Real-time Corridor Efficiency
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Track transit predictability and peak fleet deployment over top intercity routes this afternoon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto flex-1">
            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">
                  BLR → MYS Expressway
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  1h 45m
                </span>
                <span className="font-body-sm text-body-sm text-secondary flex items-center">
                  <span className="material-symbols-outlined text-[14px]">speed</span> 98% On-Time
                </span>
              </div>
              <svg className="w-16 h-8 text-secondary shrink-0" fill="none" viewBox="0 0 64 32">
                <path
                  d="M0 24 L16 18 L32 20 L48 8 L64 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">
                  BLR → Airport T2
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  42m Avg
                </span>
                <span className="font-body-sm text-body-sm text-on-tertiary-container flex items-center">
                  <span className="material-symbols-outlined text-[14px]">traffic</span> Normal Flow
                </span>
              </div>
              <svg
                className="w-16 h-8 text-on-tertiary-container shrink-0"
                fill="none"
                viewBox="0 0 64 32"
              >
                <path
                  d="M0 12 L16 16 L32 8 L48 14 L64 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">
                  BLR → Chennai
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  4h 50m
                </span>
                <span className="font-body-sm text-body-sm text-secondary flex items-center">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Toll
                  Tag Synced
                </span>
              </div>
              <svg className="w-16 h-8 text-secondary shrink-0" fill="none" viewBox="0 0 64 32">
                <path
                  d="M0 20 L16 22 L32 14 L48 10 L64 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Safar Mobility Trust & Safety Promise Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-12 mb-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
            Uncompromising Quality
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            The Safar Trust &amp; Safety Promise
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Engineered for peace of mind across urban roads and remote state highways with rigorous background audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Verified Drivers */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-primary flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">badge</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm mb-3">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
              100% Police Verified
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Verified Drivers</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Comprehensive criminal history checks, commercial badge certifications, and compulsory highway safety driving training before first trip assignment.
            </p>
          </div>

          {/* Card 2: 24/7 Roadside Assistance */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-high text-secondary flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">support_agent</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm mb-3">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              15-Min Response Guarantee
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
              24/7 Roadside Assistance
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Dedicated panic assist team, tire puncture support, instant vehicle replacement protocol, and uninterrupted call operator monitoring on long routes.
            </p>
          </div>

          {/* Card 3: No Surge Guaranteed Fares */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">price_check</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed/40 text-on-tertiary-container font-label-sm text-label-sm mb-3">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Zero Hidden Charges
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
              No Surge Guaranteed Fares
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              What you see is what you pay. Transparent per-kilometer breakdown, fixed night driver allowance rules, and zero rain or peak rush gouging.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
