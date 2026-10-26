import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatINR } from '../config';

export const MyTrips: React.FC = () => {
  const { trips, currentBooking, setSearch } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero trip: current upcoming booking or first upcoming
  const heroTrip = trips.upcoming[0] || (currentBooking?.status === 'upcoming' ? currentBooking : null);

  const getFilteredList = () => {
    const list = trips[activeTab] || [];
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((t) => {
      const matchId = t.bookingId.toLowerCase().includes(q);
      const matchRoute =
        t.pickup.toLowerCase().includes(q) || t.drop.toLowerCase().includes(q);
      const matchDriver = t.driver?.name?.toLowerCase().includes(q);
      const matchPkg = t.packageName?.toLowerCase().includes(q);
      return matchId || matchRoute || matchDriver || matchPkg;
    });
  };

  const filteredTrips = getFilteredList();

  const handleRebook = (pickup: string, drop: string) => {
    setSearch((prev) => ({
      ...prev,
      pickup,
      drop,
    }));
    navigate('/vehicles');
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8 space-y-8">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>Transit Dashboard</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
            My Trips &amp; Bookings
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Track active highway corridors, re-download tax invoices, and rebook frequent journeys in one click.
          </p>
        </div>

        {/* Real search filter box */}
        <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-2xl shadow-sm border border-surface-container-low w-full md:w-80">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ID, route, driver..."
            className="w-full bg-transparent text-sm font-body-md text-primary placeholder:text-outline focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-on-surface-variant hover:text-primary text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Hero Active Trip Card (When upcoming exists) */}
      {heroTrip && activeTab === 'upcoming' && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  Active Upcoming Journey
                </span>
                <span className="font-mono text-primary-fixed-dim text-sm font-bold">
                  ID: {heroTrip.bookingId}
                </span>
              </div>

              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-primary font-bold">
                  {heroTrip.packageName || `${heroTrip.vehicle.name} Airport Transfer`}
                </h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim mt-1">
                  Scheduled for <strong className="text-white">{heroTrip.dateTime}</strong>
                </p>
              </div>

              <div className="flex items-center gap-6 pt-1 text-sm text-primary-fixed-dim">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-fixed text-[18px]">
                    person
                  </span>
                  <span>{heroTrip.driver.name} ({heroTrip.driver.plateNumber})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">
                    key
                  </span>
                  <span>OTP: <strong className="text-white font-mono">{heroTrip.otp}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                to="/confirmed"
                className="w-full sm:w-auto h-12 px-5 rounded-2xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all no-underline"
              >
                <span className="material-symbols-outlined text-[18px]">receipt</span>
                <span>View Voucher</span>
              </Link>

              <button
                type="button"
                onClick={() => navigate('/track')}
                className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-bold"
              >
                <span>Track Live Ride</span>
                <span className="material-symbols-outlined text-[20px]">near_me</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-surface-container-high/60 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`px-5 py-3 rounded-xl font-label-md text-label-md transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Upcoming Trips</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'upcoming'
                ? 'bg-surface-container-lowest/20 text-on-primary'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {trips.upcoming.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`px-5 py-3 rounded-xl font-label-md text-label-md transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Completed</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'completed'
                ? 'bg-surface-container-lowest/20 text-on-primary'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {trips.completed.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`px-5 py-3 rounded-xl font-label-md text-label-md transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'cancelled'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span>Cancelled</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'cancelled'
                ? 'bg-surface-container-lowest/20 text-on-primary'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {trips.cancelled.length}
          </span>
        </button>
      </div>

      {/* Trips Cards List */}
      <div className="space-y-4">
        {filteredTrips.length === 0 ? (
          /* Empty State */
          <div className="bg-surface-container-lowest rounded-3xl p-12 text-center space-y-4 shadow-sm border border-surface-container-low">
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low text-on-surface-variant mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">no_crash</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-headline-md text-headline-md text-primary font-bold">
                Abhi koi trip nahi hai
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
                {searchQuery
                  ? `No journeys matched "${searchQuery}". Try a different keyword.`
                  : `You have no ${activeTab} journeys in your dashboard.`}
              </p>
            </div>
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-md text-label-md shadow-md transition-all no-underline font-bold"
              >
                <span>Book a New Ride</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.bookingId}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Trip Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-bold text-primary bg-surface-container px-2.5 py-1 rounded-lg">
                    {trip.bookingId}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {trip.dateTime}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${
                      trip.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : trip.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-secondary-fixed text-primary'
                    }`}
                  >
                    {trip.status.toUpperCase()}
                  </span>
                  {trip.type === 'package' && (
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      Tour Package
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-label-lg text-label-lg text-primary font-bold">
                    <span>{trip.pickup}</span>
                    <span className="text-secondary">→</span>
                    <span>{trip.drop}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Vehicle: {trip.vehicle.name} • Chauffeur: {trip.driver.name}
                  </p>
                </div>

                {trip.status === 'cancelled' && trip.cancelReason && (
                  <p className="font-body-sm text-body-sm text-error italic">
                    Reason: {trip.cancelReason} (100% advance refunded)
                  </p>
                )}

                {trip.review && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low text-xs">
                    <span className="text-on-tertiary-container font-bold">
                      ★ {trip.review.rating}.0
                    </span>
                    <span className="text-on-surface-variant">“{trip.review.comment}”</span>
                  </div>
                )}
              </div>

              {/* Price & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <span className="font-body-sm text-body-sm text-on-surface-variant block">
                    Total Fare
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
                    {formatINR(trip.fareBreakdown.totalPayable)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {trip.status === 'upcoming' && (
                    <button
                      type="button"
                      onClick={() => navigate('/track')}
                      className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-container transition-colors cursor-pointer font-bold"
                    >
                      Track Ride
                    </button>
                  )}

                  {trip.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleRebook(trip.pickup, trip.drop)}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors cursor-pointer font-bold"
                    >
                      Rebook Ride
                    </button>
                  )}

                  {trip.status === 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => handleRebook(trip.pickup, trip.drop)}
                      className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-container transition-colors cursor-pointer font-bold"
                    >
                      Book Ride Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
