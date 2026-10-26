import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { calculateTripFare } from '../data/mock';
import { formatINR } from '../config';

export const Checkout: React.FC = () => {
  const {
    search,
    selectedVehicle,
    selectedPackage,
    coupon,
    removeCoupon,
    paymentMethod,
    setPaymentMethod,
    isSplitPayment,
    setIsSplitPayment,
    confirmBooking,
    user,
    showToast,
  } = useApp();

  const navigate = useNavigate();

  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(true);
  const [flightNote, setFlightNote] = useState('Flight at 07:15 PM, please be on time near Gate 3.');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Recalculate fare dynamically from single source
  const fare = calculateTripFare({
    baseVehiclePrice: selectedPackage ? 4499 : selectedVehicle.basePrice,
    packageAddonPrice: selectedPackage
      ? (selectedPackage.guests > 2 ? 1400 : 0) +
        (selectedPackage.rooms > 1 ? 3200 : 0) +
        (selectedPackage.vehicle === 'SUV' ? 1800 : 0)
      : 0,
    tollFee: selectedPackage ? 320 : 110,
    driverAllowance: selectedPackage ? 300 : 50,
    couponCode: coupon?.code,
  });

  const getButtonText = () => {
    if (isProcessing) return 'Securing Ride...';
    if (paymentMethod === 'cash') {
      return `Confirm Ride (Pay ${formatINR(fare.totalPayable)} on Drop)`;
    }
    if (isSplitPayment) {
      return `Confirm & Pay ${formatINR(fare.advancePayable)}`;
    }
    return `Confirm & Pay ${formatINR(fare.totalPayable)}`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confirmBooking();
      navigate('/confirmed');
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8">
      {/* Step / Breadcrumb Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={selectedPackage ? `/packages/${selectedPackage.id}` : '/vehicles'}
          className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors no-underline"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
              Step 3 of 3 • Review &amp; Pay
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Instant Confirmation
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-extrabold">
            Booking Summary &amp; Checkout
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Quality Guarantee Ribbon */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary p-5 text-on-primary shadow-md">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-surface-container-lowest font-bold">
                      {selectedPackage ? 'Safar Tour Quality Guarantee' : 'Airport On-Time Guarantee'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[13px]">bolt</span> FAST-TRACK
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-surface-container-high mt-0.5">
                    {selectedPackage
                      ? 'Complimentary chauffeur refreshment allowance, hotel check-in concierge, and zero detour surcharge.'
                      : 'Driver reaches 15 mins prior. If delayed by >5 mins, enjoy 100% cashback on airport toll fees.'}
                  </p>
                </div>
              </div>
              <div className="shrink-0 bg-surface-container-lowest/10 px-3 py-1.5 rounded-lg border border-surface-container-lowest/15 font-label-md text-label-md text-surface-container-lowest flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  {selectedPackage ? 'hotel' : 'flight_takeoff'}
                </span>{' '}
                Priority Dispatch
              </div>
            </div>
          </div>

          {/* Trip Route & Vehicle Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">route</span>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {selectedPackage ? 'Tour Itinerary & Vehicle' : 'Trip Route & Vehicle'}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-md text-label-md text-primary font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                {selectedPackage ? '145 km • 2 Days Tour' : '38.5 km • Est. 55 mins'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center mt-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-secondary-fixed/40"></span>
                    <span className="w-0.5 h-12 bg-surface-container-highest my-1"></span>
                    <span className="w-3.5 h-3.5 rounded-sm bg-tertiary-container ring-4 ring-tertiary-fixed/40"></span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block font-bold">
                        Pickup Address
                      </span>
                      <p className="font-label-lg text-label-lg text-primary">{search.pickup}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Near CMH Hospital Junction, East Bengaluru
                      </p>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-wider block font-bold">
                        Destination
                      </span>
                      <p className="font-label-lg text-label-lg text-primary">
                        {selectedPackage ? selectedPackage.name : search.drop}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {selectedPackage
                          ? 'Curated multi-stop itinerary with hotel stay'
                          : 'Departures Ramp, Commercial Vehicle Bay 4'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      calendar_today
                    </span>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block font-medium">
                        Pickup Scheduled For
                      </span>
                      <span className="font-label-lg text-label-lg text-primary">
                        {search.dateTime}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/vehicles"
                    className="font-label-md text-label-md text-secondary hover:text-primary transition-colors no-underline font-bold"
                  >
                    Edit
                  </Link>
                </div>
              </div>

              <div className="md:col-span-5 bg-surface-container-low rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                      Vehicle Class
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold">
                      {selectedVehicle.name}
                    </span>
                  </div>
                  <div className="my-3 flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[32px]">directions_car</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                        {selectedVehicle.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {selectedVehicle.desc.split('•')[0]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-container flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span>{' '}
                    {selectedVehicle.seats} seats
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">luggage</span>{' '}
                    {selectedVehicle.bags} Large bags
                  </span>
                  <span className="flex items-center gap-1 text-secondary font-label-md text-label-md font-bold">
                    <span className="material-symbols-outlined text-[16px]">ac_unit</span> Top Rated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger & Airport Note */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Passenger &amp; Airport Note
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingNote(!isEditingNote)}
                className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer font-bold"
              >
                {isEditingNote ? 'Done' : 'Change'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <div className="min-w-0">
                  <p className="font-label-lg text-label-lg text-primary truncate">{user.name}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{user.phone}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3">
                <span className="material-symbols-outlined text-on-tertiary-container text-[20px] mt-0.5">
                  flight
                </span>
                <div className="flex-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                    Driver Flight Instructions
                  </span>
                  {isEditingNote ? (
                    <input
                      type="text"
                      value={flightNote}
                      onChange={(e) => setFlightNote(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1 rounded bg-surface-container-lowest text-primary text-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  ) : (
                    <p className="font-body-md text-body-md text-primary mt-0.5">“{flightNote}”</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Zero-Cancellation Guarantee Option (Split Payment) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[22px]">savings</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Zero-Cancellation Guarantee Option
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-semibold">
                      Flexible
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
                    Pay just{' '}
                    <span className="font-label-lg text-label-lg text-primary font-bold">
                      {formatINR(fare.advancePayable)}
                    </span>{' '}
                    now to reserve this cab. The remaining{' '}
                    <span className="font-label-lg text-label-lg text-primary font-bold">
                      {formatINR(fare.balancePayable)}
                    </span>{' '}
                    can be paid directly to the driver upon drop-off.
                  </p>
                  <p className="font-body-sm text-body-sm text-secondary mt-1 flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span> 100%
                    refund if cancelled up to 60 mins before pickup.
                  </p>
                </div>
              </div>

              {/* Split Toggle */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={isSplitPayment}
                  onChange={(e) => setIsSplitPayment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  account_balance_wallet
                </span>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Payment Method
                </h2>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[15px] text-secondary">lock</span>
                256-bit Bank Grade Encrypted
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: UPI */}
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-secondary/5 ring-2 ring-secondary'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment_method"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-4 h-4 text-secondary focus:ring-secondary accent-secondary"
                  />
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-secondary text-[24px]">
                      qr_code_2
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">
                        UPI Instant Transfer
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm font-bold">
                        Recommended
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Google Pay, PhonePe, Paytm, BHIM
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="font-label-sm text-label-sm font-bold bg-surface-container px-2 py-0.5 rounded">
                    GPay
                  </span>
                  <span className="font-label-sm text-label-sm font-bold bg-surface-container px-2 py-0.5 rounded">
                    PhonePe
                  </span>
                  <span className="font-label-sm text-label-sm font-bold bg-surface-container px-2 py-0.5 rounded">
                    Paytm
                  </span>
                </div>
              </label>

              {/* UPI Sub-Input (Visible when UPI selected) */}
              {paymentMethod === 'upi' && (
                <div className="pl-14 pr-4 py-3 bg-surface-container-low rounded-xl flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiVerified(false);
                      }}
                      placeholder="Enter UPI ID (e.g. rahul@okaxis)"
                      className="w-full h-11 px-3.5 rounded-lg bg-surface-container-lowest font-body-md text-primary placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUpiVerified(true);
                      showToast(`Verified UPI handle: ${upiId}`);
                    }}
                    className={`w-full sm:w-auto h-11 px-5 rounded-lg font-label-md text-label-md transition-colors shrink-0 cursor-pointer ${
                      upiVerified
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary text-on-primary hover:bg-primary-container'
                    }`}
                  >
                    {upiVerified ? '✓ Verified VPA' : 'Verify VPA'}
                  </button>
                </div>
              )}

              {/* Option 2: Credit/Debit Card */}
              <label
                onClick={() => setPaymentMethod('cards')}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cards'
                    ? 'bg-secondary/5 ring-2 ring-secondary'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cards"
                    checked={paymentMethod === 'cards'}
                    onChange={() => setPaymentMethod('cards')}
                    className="w-4 h-4 text-secondary focus:ring-secondary accent-secondary"
                  />
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">
                      credit_card
                    </span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      Credit or Debit Card
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Visa, Mastercard, RuPay &amp; Diners Club
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span className="font-label-sm text-label-sm font-bold">All Cards</span>
                </div>
              </label>

              {/* Option 3: Net Banking */}
              <label
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-secondary/5 ring-2 ring-secondary'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment_method"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="w-4 h-4 text-secondary focus:ring-secondary accent-secondary"
                  />
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">
                      account_balance
                    </span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      Net Banking
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      HDFC, ICICI, SBI, Axis &amp; 40+ banks
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                  chevron_right
                </span>
              </label>

              {/* Option 4: Cash to Driver on Drop */}
              <label
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-secondary/5 ring-2 ring-secondary'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="w-4 h-4 text-secondary focus:ring-secondary accent-secondary"
                  />
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">
                      payments
                    </span>
                  </div>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      Cash to Driver on Drop
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Pay full amount {formatINR(fare.totalPayable)} after completing journey
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                  attach_money
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sticky Checkout Summary (4 Cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
          {/* Coupon Applied Box */}
          {coupon ? (
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    confirmation_number
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-sm text-headline-sm text-primary uppercase font-bold">
                        {coupon.code}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm font-bold">
                        Applied
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Promotional discount unlocked
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                    -{formatINR(fare.discount)}
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="block font-label-sm text-label-sm text-error hover:underline mt-0.5 ml-auto cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Have a coupon code?
              </span>
              <button
                type="button"
                onClick={() => navigate('/offers')}
                className="font-label-md text-label-md text-secondary hover:underline cursor-pointer font-bold"
              >
                Browse Offers
              </button>
            </div>
          )}

          {/* Fare Breakdown Breakdown */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Fare Breakdown
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                All-Inclusive
              </span>
            </div>

            <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span>Base Fare {selectedPackage ? '(Tour Package)' : '(38.5 km package)'}</span>
                <span className="text-primary font-medium">{formatINR(fare.baseFare)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Driver &amp; Night Allowance
                  <span
                    className="material-symbols-outlined text-[14px] text-outline"
                    title="Scheduled operational charges"
                  >
                    info
                  </span>
                </span>
                <span className="text-primary font-medium">
                  {formatINR(fare.driverAllowance)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Airport Toll &amp; Parking Fee
                  <span
                    className="material-symbols-outlined text-[14px] text-outline"
                    title="Trumpet Flyover Toll + T2 Airport Parking"
                  >
                    info
                  </span>
                </span>
                <span className="text-primary font-medium">
                  {formatINR(fare.tollAndParking)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Applicable GST (5%)</span>
                <span className="text-primary font-medium">{formatINR(fare.gstAmount)}</span>
              </div>

              {fare.discount > 0 && (
                <div className="flex items-center justify-between text-secondary">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px]">local_offer</span>{' '}
                    Coupon ({coupon?.code})
                  </span>
                  <span className="font-bold">-{formatINR(fare.discount)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-surface-container">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    Total Trip Fare
                  </span>
                  <span className="block font-body-sm text-body-sm text-on-surface-variant">
                    Includes taxes, fuel &amp; toll
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-body-sm text-body-sm text-outline line-through block">
                    {formatINR(fare.totalPayable + (fare.discount || 84))}
                  </span>
                  <span className="font-headline-xl text-headline-xl text-primary font-black">
                    {formatINR(fare.totalPayable)}
                  </span>
                </div>
              </div>

              {/* Split Pricing Indicator */}
              {isSplitPayment && paymentMethod !== 'cash' && (
                <div className="p-4 rounded-xl bg-surface-container-low space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-secondary flex items-center gap-1.5 font-bold">
                      <span className="material-symbols-outlined text-[18px]">verified</span> Pay
                      Now (Advance)
                    </span>
                    <span className="font-headline-md text-headline-md text-secondary font-bold">
                      {formatINR(fare.advancePayable)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container-highest text-on-surface-variant">
                    <span className="font-body-sm text-body-sm">Balance on Drop-off</span>
                    <span className="font-label-md text-label-md text-primary font-bold">
                      {formatINR(fare.balancePayable)}
                    </span>
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full h-[52px] rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer font-bold"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      progress_activity
                    </span>
                    <span>Securing Ride...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <span>{getButtonText()}</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">
                check_circle
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                <strong className="text-primary font-semibold">Free cancellation</strong> up to 60
                mins before pickup (03:30 PM). 100% advance refunded directly to your payment source.
              </p>
            </div>
          </div>

          {/* Trust strip */}
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex items-center justify-around text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[22px]">shield</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Ride Insured
              </span>
            </div>
            <div className="w-px h-8 bg-surface-container"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[22px]">
                support_agent
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                24/7 Helpline
              </span>
            </div>
            <div className="w-px h-8 bg-surface-container"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[22px]">star</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                4.9/5 Chauffeurs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
