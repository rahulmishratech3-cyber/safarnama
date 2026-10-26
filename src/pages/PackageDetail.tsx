import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_PACKAGES, MOCK_VEHICLES, calculateTripFare } from '../data/mock';
import { formatINR } from '../config';

export const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedPackage, setSelectedVehicle, coupon, showToast } = useApp();

  const pkg = MOCK_PACKAGES.find((p) => p.id === id) || MOCK_PACKAGES[0];

  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [guests, setGuests] = useState<number>(2);
  const [rooms, setRooms] = useState<number>(1);
  const [vehicleType, setVehicleType] = useState<'Sedan' | 'SUV'>('Sedan');
  const [travelDate, setTravelDate] = useState('Tomorrow, 06:00 AM');

  // Pricing rules from user prompt:
  // 3 guests +1400, 4 guests +2500, extra room (rooms > 1) +3200, SUV +1800
  let guestAddon = 0;
  if (guests === 3) guestAddon = 1400;
  else if (guests >= 4) guestAddon = 2500;

  const roomAddon = (rooms - 1) * 3200;
  const vehicleAddon = vehicleType === 'SUV' ? 1800 : 0;
  const totalPackageAddon = guestAddon + roomAddon + vehicleAddon;

  const fare = calculateTripFare({
    baseVehiclePrice: pkg.basePrice,
    packageAddonPrice: totalPackageAddon,
    tollFee: 320,
    driverAllowance: 300,
    couponCode: coupon?.code,
  });

  const handleBookPackage = () => {
    // Select vehicle object corresponding to Sedan or SUV
    const veh = vehicleType === 'SUV' ? MOCK_VEHICLES[2] : MOCK_VEHICLES[1];
    setSelectedVehicle(veh);
    setSelectedPackage({
      id: pkg.id,
      name: pkg.title,
      guests,
      rooms,
      dates: travelDate,
      vehicle: vehicleType,
    });
    showToast(`Tour package booked: ${pkg.title}`);
    navigate('/checkout');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors no-underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="font-label-md text-label-md">All Packages</span>
        </Link>
        <div className="h-4 w-px bg-outline-variant/40"></div>
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
          {pkg.tagline} • Curated Tour
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Itinerary & Package Details (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Hero Image Showcase Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-md bg-primary h-72 sm:h-96">
            <img
              src={pkg.imageUrl}
              alt={pkg.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                {pkg.tagline}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold shadow-sm">
                {pkg.badge}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-on-primary space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center text-tertiary-fixed font-headline-sm text-headline-sm">
                  <span
                    className="material-symbols-outlined text-[20px] mr-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  {pkg.rating}
                </span>
                <span className="text-on-primary/80 font-body-sm text-body-sm">
                  ({pkg.reviewsCount} verified traveler reviews)
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-primary font-extrabold tracking-tight">
                {pkg.title}
              </h1>
              <p className="font-body-md text-body-md text-primary-fixed-dim line-clamp-2 max-w-2xl">
                {pkg.overview}
              </p>
            </div>
          </div>

          {/* Key Inclusions Strip */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified</span>
              Package Inclusions &amp; Safar Standards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pkg.inclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    check_circle
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">tour</span>
              Key Scenic &amp; Cultural Highlights
            </h3>
            <ul className="space-y-3 font-body-md text-body-md text-on-surface list-none p-0 m-0">
              {pkg.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary-fixed text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {i + 1}
                  </div>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day 1 / Day 2 Itinerary Switcher */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-container-low">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">calendar_month</span>
                  Detailed Day-by-Day Plan
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chauffeur accompanied throughout the route
                </p>
              </div>

              {/* Day Switcher Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-surface-container-low">
                <button
                  type="button"
                  onClick={() => setActiveDay(1)}
                  className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    activeDay === 1
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Day 1: Enroute &amp; Palace
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDay(2)}
                  className={`px-5 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    activeDay === 2
                      ? 'bg-primary text-on-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Day 2: Hills &amp; Return
                </button>
              </div>
            </div>

            {/* Stepper Timeline for Active Day */}
            <div className="pt-6 relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-surface-container">
              {(activeDay === 1 ? pkg.day1Schedule : pkg.day2Schedule).map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <span className="absolute -left-[27px] w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm text-xs font-bold">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-label-lg text-label-lg text-primary">{step.title}</h4>
                      <span className="font-mono text-label-sm text-label-sm text-secondary font-bold">
                        {step.time}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Customizer & Live Fare (4 cols) */}
        <aside className="lg:col-span-4 sticky top-28 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-surface-container-low pb-3">
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                  Tour Customizer
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary">Live Pricing</h3>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {pkg.duration}
              </span>
            </div>

            {/* Departure slot */}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
                Departure Date &amp; Slot
              </label>
              <input
                type="text"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low font-body-md text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            {/* Guests Counter */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
              <div>
                <span className="font-label-md text-label-md text-primary block font-bold">
                  Guests / Travelers
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {guests === 3
                    ? '3 Guests (+₹1,400)'
                    : guests >= 4
                    ? '4 Guests (+₹2,500)'
                    : '2 Guests (Included)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={guests <= 1}
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-primary">{guests}</span>
                <button
                  type="button"
                  disabled={guests >= 6}
                  onClick={() => setGuests((g) => Math.min(6, g + 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Hotel Rooms Counter */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
              <div>
                <span className="font-label-md text-label-md text-primary block font-bold">
                  Heritage Hotel Rooms
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {rooms > 1 ? `Extra Room (+₹3,200)` : '1 Deluxe Room (Included)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={rooms <= 1}
                  onClick={() => setRooms((r) => Math.max(1, r - 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-primary">{rooms}</span>
                <button
                  type="button"
                  disabled={rooms >= 4}
                  onClick={() => setRooms((r) => Math.min(4, r + 1))}
                  className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center font-bold hover:bg-surface-container transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Vehicle Preference */}
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-2">
                Vehicle Preference
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleType('Sedan')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    vehicleType === 'Sedan'
                      ? 'border-secondary bg-secondary/5 font-bold text-secondary ring-1 ring-secondary'
                      : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">directions_car</span>
                  <span className="font-label-md text-label-md">Prime Sedan</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Standard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleType('SUV')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    vehicleType === 'SUV'
                      ? 'border-secondary bg-secondary/5 font-bold text-secondary ring-1 ring-secondary'
                      : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">rv_hookup</span>
                  <span className="font-label-md text-label-md">Prime SUV</span>
                  <span className="font-body-sm text-[11px] text-secondary font-bold">+₹1,800</span>
                </button>
              </div>
            </div>

            {/* Fare Breakdown Summary */}
            <div className="space-y-2 pt-3 border-t border-surface-container-low font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Base Tour Package</span>
                <span className="text-primary font-medium">{formatINR(pkg.basePrice)}</span>
              </div>
              {totalPackageAddon > 0 && (
                <div className="flex justify-between">
                  <span>Selected Upgrades</span>
                  <span className="text-primary font-medium">+{formatINR(totalPackageAddon)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Highway Tolls &amp; Inter-State Taxes</span>
                <span className="text-primary font-medium">{formatINR(fare.tollAndParking)}</span>
              </div>
              <div className="flex justify-between">
                <span>Driver Tour Allowance</span>
                <span className="text-primary font-medium">{formatINR(fare.driverAllowance)}</span>
              </div>
              {fare.discount > 0 && (
                <div className="flex justify-between text-secondary font-medium">
                  <span>Coupon ({coupon?.code})</span>
                  <span>- {formatINR(fare.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Applicable GST (5%)</span>
                <span className="text-primary font-medium">{formatINR(fare.gstAmount)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-surface-container-low flex items-baseline justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block">
                  Total Tour Fare
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  All taxes, fuel &amp; stay included
                </span>
              </div>
              <span className="font-headline-xl text-headline-xl text-secondary font-extrabold">
                {formatINR(fare.totalPayable)}
              </span>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleBookPackage}
              className="w-full h-[52px] rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-bold"
            >
              <span>Book This Tour Package</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                verified_user
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                Flexible booking: Reserve with partial token or pay via corporate invoicing.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
