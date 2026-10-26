import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatINR, APP_CONFIG } from '../config';

export const Confirmed: React.FC = () => {
  const { currentBooking, cancelRide, showToast } = useApp();
  const navigate = useNavigate();

  const [copiedId, setCopiedId] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!currentBooking) {
      showToast('Please start a booking first');
      navigate('/');
    }
  }, [currentBooking, navigate, showToast]);

  if (!currentBooking) return null;

  const handleCopyId = () => {
    navigator.clipboard?.writeText(currentBooking.bookingId);
    setCopiedId(true);
    showToast(`Booking ID ${currentBooking.bookingId} copied`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(currentBooking.otp);
    setCopiedOtp(true);
    showToast(`Trip OTP ${currentBooking.otp} copied`);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleDownloadVoucher = () => {
    showToast('Preparing PDF Voucher...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleAddCalendar = () => {
    showToast('Trip schedule synced to your calendar');
  };

  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: `Safar Mobility Booking: ${currentBooking.bookingId}`,
        text: `My trip from ${currentBooking.pickup} to ${currentBooking.drop} is confirmed. Driver: ${currentBooking.driver.name} (${currentBooking.driver.plateNumber}).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Tracking link copied to clipboard');
    }
  };

  const handleConfirmCancel = () => {
    cancelRide(currentBooking.bookingId, 'Cancelled from confirmation voucher');
    setShowCancelModal(false);
    navigate('/trips');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Success Hero Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 shadow-lg ring-8 ring-emerald-50 mb-2">
          <span className="material-symbols-outlined text-[42px]">check_circle</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>100% Guaranteed Confirmation</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-extrabold">
          Booking Confirmed &amp; Chauffeur Assigned!
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
          Your ride is locked with verified chauffeur {currentBooking.driver.name}. A confirmation SMS &amp; WhatsApp ticket has been dispatched.
        </p>

        {/* Booking Reference Pill */}
        <div className="inline-flex items-center gap-3 bg-surface-container-lowest px-5 py-2.5 rounded-2xl shadow-sm border border-surface-container mt-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
            Booking ID:
          </span>
          <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold tracking-wider">
            {currentBooking.bookingId}
          </span>
          <button
            type="button"
            onClick={handleCopyId}
            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold transition-all cursor-pointer"
          >
            {copiedId ? 'Copied!' : 'Copy ID'}
          </button>
        </div>
      </div>

      {/* Main Voucher Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl border border-surface-container-low space-y-8">
        {/* OTP High Visibility Section */}
        <div className="bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">key</span>
              <span className="font-label-md text-label-md text-tertiary-fixed font-bold uppercase tracking-wider">
                Start Trip OTP
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-primary">
              Share only after boarding vehicle
            </h3>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim">
              Driver will enter this 4-digit code into his terminal to start billing.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-lowest/15 backdrop-blur-md p-3 rounded-2xl border border-surface-container-lowest/20">
            <div className="flex items-center gap-2">
              {currentBooking.otp.split('').map((char, i) => (
                <span
                  key={i}
                  className="w-12 h-14 rounded-xl bg-surface-container-lowest text-primary font-headline-xl text-headline-xl font-bold flex items-center justify-center shadow-md font-mono"
                >
                  {char}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={handleCopyOtp}
              className="h-14 px-4 rounded-xl bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold flex flex-col items-center justify-center hover:bg-surface-container transition-all cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              <span>{copiedOtp ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Chauffeur & Vehicle Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
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
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {currentBooking.driver.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                  {currentBooking.driver.tier}
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mt-0.5">
                <span className="flex items-center text-on-tertiary-container font-bold">
                  <span
                    className="material-symbols-outlined text-[15px] mr-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  {currentBooking.driver.rating}
                </span>
                <span>•</span>
                <span>{currentBooking.driver.tripsCount}</span>
                <span>•</span>
                <span>{currentBooking.driver.languages}</span>
              </div>
            </div>
          </div>

          {/* Number plate pill */}
          <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
              {currentBooking.driver.vehicleModel}
            </span>
            <div className="flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-lg border border-outline-variant/40 shadow-xs">
              <div className="flex flex-col items-center justify-center pr-2 mr-2 border-r border-outline-variant">
                <span className="font-label-sm text-[10px] font-bold text-secondary">IND</span>
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              </div>
              <span className="font-headline-sm text-headline-sm font-extrabold text-primary font-mono tracking-widest">
                {currentBooking.driver.plateNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Route Details Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-secondary-fixed/40 mt-1 shrink-0"></span>
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
                  Pickup Location
                </span>
                <p className="font-label-lg text-label-lg text-primary">{currentBooking.pickup}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {currentBooking.dateTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-3.5 h-3.5 rounded-sm bg-tertiary-container ring-4 ring-tertiary-fixed/40 mt-1 shrink-0"></span>
              <div>
                <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase font-bold">
                  Destination
                </span>
                <p className="font-label-lg text-label-lg text-primary">{currentBooking.drop}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Est. Distance: {currentBooking.distanceKm} km ({currentBooking.durationEst})
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low space-y-2.5 font-body-sm text-body-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Total Guaranteed Fare</span>
              <span className="font-bold text-primary">
                {formatINR(currentBooking.fareBreakdown.totalPayable)}
              </span>
            </div>
            {currentBooking.isSplitPayment ? (
              <>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Advance Token Paid</span>
                  <span>{formatINR(currentBooking.fareBreakdown.advancePayable)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant pt-2 border-t border-surface-container">
                  <span>Balance Payable to Chauffeur</span>
                  <span className="font-bold text-primary font-headline-sm">
                    {formatINR(currentBooking.fareBreakdown.balancePayable)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Payment Status</span>
                <span>Paid via {currentBooking.paymentMethod.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="pt-4 border-t border-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadVoucher}
              className="h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Voucher</span>
            </button>
            <button
              type="button"
              onClick={handleAddCalendar}
              className="h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">event</span>
              <span>Add to Calendar</span>
            </button>
            <button
              type="button"
              onClick={handleShareTrip}
              className="h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share Trip</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="h-12 px-5 rounded-2xl bg-surface-container-low hover:bg-error-container text-error font-label-md text-label-md transition-colors cursor-pointer"
            >
              Cancel Ride
            </button>

            <button
              type="button"
              onClick={() => navigate('/track')}
              className="h-12 px-7 rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-bold"
            >
              <span>Track My Ride</span>
              <span className="material-symbols-outlined text-[20px]">near_me</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">Cancel This Booking?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel booking {currentBooking.bookingId}? Since it is before the 60-minute window, 100% of your advance will be refunded to your original payment method.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="h-11 px-5 rounded-xl bg-surface-container text-primary font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="h-11 px-5 rounded-xl bg-error text-on-error font-label-md text-label-md hover:bg-error/90 transition-colors cursor-pointer shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
