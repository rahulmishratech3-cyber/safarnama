import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatINR } from '../config';

export const Complete: React.FC = () => {
  const { currentBooking, completeRide, swapPickupDrop, user, showToast } = useApp();
  const navigate = useNavigate();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([
    'Clean & Sanitized Cab',
    'Polite Chauffeur',
    'Smooth & Safe Driving',
  ]);
  const [tip, setTip] = useState<number>(50);
  const [comment, setComment] = useState('Chauffeur Ramesh was extremely polite and drove very safely on the expressway.');
  const [submittedReview, setSubmittedReview] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (!currentBooking) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="font-headline-lg text-headline-lg text-primary">No Active Journey Found</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Abhi koi completed trip nahi hai. Please start a booking first.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md no-underline"
        >
          Book a Ride
        </Link>
      </div>
    );
  }

  const ratingLabels = [
    'Poor Experience',
    'Below Average',
    'Good Ride',
    'Great Service',
    'Exceptional Chauffeur!',
  ];

  const shoutoutChips = [
    'Clean & Sanitized Cab',
    'Polite Chauffeur',
    'Smooth & Safe Driving',
    'Perfect Route Navigation',
    'Punctual Arrival',
    'AC Comfort',
  ];

  const tipOptions = [0, 30, 50, 100];

  const toggleChip = (chip: string) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter((c) => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    completeRide({
      rating,
      feedbackChips: selectedChips,
      comment,
      tipAmount: tip,
    });
    setSubmittedReview(true);
    showToast('Review submitted! Thank you for rating Ramesh.');
  };

  const handleDownloadInvoice = () => {
    setIsGeneratingInvoice(true);
    setTimeout(() => {
      setIsGeneratingInvoice(false);
      window.print();
      showToast('Tax invoice generated successfully.');
    }, 800);
  };

  const handleEmailInvoice = () => {
    setEmailSent(true);
    showToast(`Invoice dispatched to ${user.email}`);
  };

  const handleBookReturnTrip = () => {
    swapPickupDrop();
    navigate('/vehicles');
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Completion Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 shadow-md ring-8 ring-emerald-50">
          <span className="material-symbols-outlined text-[36px]">task_alt</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Journey Concluded Safely</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
          Trip Completed &amp; Tax Invoice
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
          We hope you had an elevated travel experience with Safar Mobility. Your GST receipt and journey invoice are ready below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Invoice Card (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container-low space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-low">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                Trip Tax Invoice
              </h2>
            </div>
            <span className="font-mono font-bold text-label-md text-secondary">
              {currentBooking.bookingId}
            </span>
          </div>

          {/* Route info */}
          <div className="space-y-3 bg-surface-container-low p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary mt-1.5 shrink-0"></span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Pickup Point
                </span>
                <p className="font-label-md text-label-md text-primary">{currentBooking.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-sm bg-tertiary-container mt-1.5 shrink-0"></span>
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Drop-Off Destination
                </span>
                <p className="font-label-md text-label-md text-primary">{currentBooking.drop}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-surface-container text-xs text-on-surface-variant flex items-center justify-between">
              <span>Date: {currentBooking.dateTime}</span>
              <span>Chauffeur: {currentBooking.driver.name} ({currentBooking.driver.plateNumber})</span>
            </div>
          </div>

          {/* Itemized Fare Table */}
          <div className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
            <div className="flex justify-between">
              <span>Base Fare Package ({currentBooking.distanceKm} km)</span>
              <span className="text-primary font-medium">
                {formatINR(currentBooking.fareBreakdown.baseFare)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Chauffeur Allowance &amp; Sanitization</span>
              <span className="text-primary font-medium">
                {formatINR(currentBooking.fareBreakdown.driverAllowance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Highway Tolls &amp; FastTag Parking</span>
              <span className="text-primary font-medium">
                {formatINR(currentBooking.fareBreakdown.tollAndParking)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (CGST 2.5% + SGST 2.5%)</span>
              <span className="text-primary font-medium">
                {formatINR(currentBooking.fareBreakdown.gstAmount)}
              </span>
            </div>
            {currentBooking.fareBreakdown.discount > 0 && (
              <div className="flex justify-between text-secondary font-medium">
                <span>Discount Voucher</span>
                <span>-{formatINR(currentBooking.fareBreakdown.discount)}</span>
              </div>
            )}
            {tip > 0 && (
              <div className="flex justify-between text-on-tertiary-container font-medium">
                <span>Driver Tip</span>
                <span>+{formatINR(tip)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-surface-container-low flex items-baseline justify-between">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Total Amount Paid
              </span>
              <span className="font-headline-xl text-headline-xl text-primary font-extrabold">
                {formatINR(currentBooking.fareBreakdown.totalPayable + tip)}
              </span>
            </div>
          </div>

          {/* Invoice Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              disabled={isGeneratingInvoice}
              className="flex-1 h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
            >
              {isGeneratingInvoice ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Download Invoice</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleEmailInvoice}
              className={`flex-1 h-12 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer font-bold ${
                emailSent
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-surface-container hover:bg-surface-container-high text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {emailSent ? 'mark_email_read' : 'mail'}
              </span>
              <span>{emailSent ? 'Invoice Sent to Email ✓' : 'Email Invoice'}</span>
            </button>
          </div>

          {/* Book Return Trip CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBookReturnTrip}
              className="w-full h-12 rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">sync_alt</span>
              <span>Book Return Trip</span>
            </button>
          </div>
        </div>

        {/* Right Column: Chauffeur Rating & Compliments (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container-low space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-surface-container-low">
            <img
              src={currentBooking.driver.photoUrl}
              alt={currentBooking.driver.name}
              className="w-14 h-14 rounded-2xl object-cover shadow-sm"
            />
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Rate Chauffeur {currentBooking.driver.name.split(' ')[0]}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Your feedback directly impacts monthly chauffeur bonuses.
              </p>
            </div>
          </div>

          {submittedReview ? (
            <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-3">
              <span className="material-symbols-outlined text-[42px] text-emerald-600">
                stars
              </span>
              <h4 className="font-headline-sm text-headline-sm font-bold">Rating Recorded!</h4>
              <p className="font-body-sm text-body-sm">
                Thank you for reviewing {currentBooking.driver.name}. You earned <strong>20 Safar Reward Points</strong>!
              </p>
              <Link
                to="/trips"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md no-underline"
              >
                Go to My Trips
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Star Rating Interactive Selector */}
              <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-surface-container-low">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating !== null ? hoverRating : rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(star)}
                        className="text-tertiary-fixed-dim hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      >
                        <span
                          className={`material-symbols-outlined text-[36px] ${
                            active ? 'text-on-tertiary-container' : 'text-outline-variant'
                          }`}
                          style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </button>
                    );
                  })}
                </div>
                <span className="font-label-md text-label-md text-primary font-bold">
                  {ratingLabels[(hoverRating || rating) - 1]}
                </span>
              </div>

              {/* Shoutout compliment chips */}
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold block">
                  Give a Compliment
                </label>
                <div className="flex flex-wrap gap-2">
                  {shoutoutChips.map((chip) => {
                    const isSelected = selectedChips.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleChip(chip)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-secondary text-on-secondary shadow-xs'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Driver Tip Selector */}
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold block">
                  Add Chauffeur Tip (100% goes to driver)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {tipOptions.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTip(amount)}
                      className={`py-2 rounded-xl text-center font-label-md text-label-md transition-all cursor-pointer ${
                        tip === amount
                          ? 'bg-primary text-on-primary font-bold shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {amount === 0 ? 'No Tip' : `₹${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback comment input */}
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold block">
                  Comments (Optional)
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the driving experience..."
                  className="w-full p-3 rounded-xl bg-surface-container-low font-body-sm text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* Submit Review Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
              >
                <span>Submit Review &amp; Rating</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
