import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_VEHICLES, calculateTripFare, VehicleOption } from '../data/mock';
import { formatINR } from '../config';

export const VehicleSelect: React.FC = () => {
  const {
    search,
    selectedVehicle,
    setSelectedVehicle,
    setSelectedPackage,
    coupon,
    applyCoupon,
    showToast,
  } = useApp();
  const navigate = useNavigate();

  const [flightNo, setFlightNo] = useState('6E 2134');
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [editPickup, setEditPickup] = useState(search.pickup);
  const [editDrop, setEditDrop] = useState(search.drop);

  const handleSelectCab = (vehicle: VehicleOption) => {
    setSelectedVehicle(vehicle);
    showToast(`Selected ${vehicle.name} (${vehicle.eta})`);
  };

  const handleContinue = () => {
    // Cab selected, so clear selectedPackage
    setSelectedPackage(null);
    navigate('/checkout');
  };

  const liveFare = calculateTripFare({
    baseVehiclePrice: selectedVehicle.basePrice,
    couponCode: coupon?.code,
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      {/* Breadcrumb / Step Indicator */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors no-underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="font-label-md text-label-md">Back to Search</span>
        </Link>
        <div className="h-4 w-px bg-outline-variant/40"></div>
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
          Step 2 of 4 • Cab Selection
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Left Section: Route & Cab Cards */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {/* Route Overview Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            {isEditingRoute ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
                  <h3 className="font-headline-sm text-headline-sm text-primary">Edit Route</h3>
                  <button
                    onClick={() => setIsEditingRoute(false)}
                    className="font-label-md text-label-md text-on-surface-variant hover:text-primary"
                  >
                    Cancel
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Pickup Spot
                    </label>
                    <input
                      type="text"
                      value={editPickup}
                      onChange={(e) => setEditPickup(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Drop Destination
                    </label>
                    <input
                      type="text"
                      value={editDrop}
                      onChange={(e) => setEditDrop(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary mt-1"
                    />
                  </div>
                  <button
                    onClick={() => {
                      search.pickup = editPickup;
                      search.drop = editDrop;
                      setIsEditingRoute(false);
                      showToast('Route updated');
                    }}
                    className="h-10 px-5 rounded-xl bg-primary text-on-primary font-label-md text-label-md"
                  >
                    Save Route
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center pt-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-secondary/20"></span>
                    <span className="w-0.5 h-10 bg-surface-container-high my-1"></span>
                    <span className="w-3.5 h-3.5 rounded-sm bg-on-tertiary-container ring-4 ring-on-tertiary-container/20"></span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                          Pickup Spot
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded-full font-bold">
                          Terminal 2 Express Corridor
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        {search.pickup}
                      </h3>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                          Destination
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        {search.drop}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-6 sm:border-l border-surface-container gap-3 shrink-0">
                  <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:gap-0.5 text-left sm:text-right">
                    <div className="flex items-center gap-1.5 text-on-surface font-label-lg text-label-lg">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        near_me
                      </span>
                      <span>38.5 km</span>
                    </div>
                    <div className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                        timer
                      </span>
                      <span>Approx 55 mins</span>
                    </div>
                    <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-md bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                      One-Way Direct
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditingRoute(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary transition-colors font-label-md text-label-md cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_location_alt</span>
                    <span>Edit Route</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Select your ride</h2>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  24 Cabs nearby
                </span>
              </div>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
              Fares inclusive of toll &amp; airport surcharge
            </span>
          </div>

          {/* Vehicle List */}
          <div className="flex flex-col gap-4">
            {MOCK_VEHICLES.map((vehicle) => {
              const isSelected = selectedVehicle.id === vehicle.id;
              return (
                <div
                  key={vehicle.id}
                  onClick={() => handleSelectCab(vehicle)}
                  className={`cab-option group relative bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-secondary bg-surface-container-low/30 shadow-md shadow-secondary/5'
                      : ''
                  }`}
                >
                  {vehicle.badge && (
                    <div className="absolute -top-3 left-6 flex items-center gap-1 px-3 py-0.5 rounded-full bg-secondary text-on-secondary shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">hotel_class</span>
                      <span className="font-label-sm text-label-sm tracking-wide uppercase font-bold">
                        {vehicle.badge}
                      </span>
                    </div>
                  )}

                  <div className={`flex flex-col md:flex-row md:items-center justify-between gap-5 ${vehicle.badge ? 'mt-1' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-20 h-20 rounded-xl flex items-center justify-center p-2 shrink-0 ${
                          isSelected ? 'bg-secondary-fixed/50' : 'bg-surface-container-low'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[44px] ${
                            isSelected ? 'text-secondary' : 'text-primary'
                          }`}
                        >
                          {vehicle.id === 'tempo'
                            ? 'directions_bus'
                            : vehicle.id === 'prime-suv'
                            ? 'rv_hookup'
                            : vehicle.id === 'prime-sedan'
                            ? 'airport_shuttle'
                            : 'directions_car'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-headline-sm text-headline-sm text-on-surface">
                            {vehicle.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                              isSelected
                                ? 'bg-secondary-fixed text-on-secondary-fixed'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {vehicle.category}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                          {vehicle.desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              airline_seat_recline_normal
                            </span>{' '}
                            {vehicle.seats} Seats
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">luggage</span>{' '}
                            {vehicle.bags} Bags
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">verified</span>{' '}
                            {vehicle.features[0]}
                          </span>
                          <span className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>{' '}
                            {vehicle.eta}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 gap-1 shrink-0">
                      <div className="text-right">
                        <span className="font-body-sm text-body-sm line-through text-on-surface-variant block">
                          {formatINR(vehicle.originalPrice)}
                        </span>
                        <span
                          className={`font-headline-lg text-headline-lg font-bold ${
                            isSelected ? 'text-secondary' : 'text-on-surface'
                          }`}
                        >
                          {formatINR(vehicle.basePrice)}
                        </span>
                      </div>

                      {isSelected ? (
                        <div className="select-indicator flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-label-sm bg-secondary text-on-secondary shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Selected</span>
                        </div>
                      ) : (
                        <span className="select-indicator px-3 py-1 rounded-full text-label-sm font-label-sm bg-surface-container text-on-surface-variant font-semibold">
                          Select
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantees & Promo Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-gradient-to-r from-surface-container-high to-surface-container-low rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                  Transparent Fare Guarantee
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  No peak surge or hidden night tolls. Toll charges of ₹110 for Bengaluru Airport Expressway are included.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-tertiary-fixed-dim/30 to-tertiary-fixed/20 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-on-tertiary-container text-surface-container-lowest flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">local_offer</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg text-label-lg text-on-tertiary-container uppercase tracking-wide font-bold">
                      BLRAIRPORT
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-on-tertiary-container/10 font-label-sm text-label-sm text-on-tertiary-container font-bold">
                      ₹100 Off
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Auto-applied for direct airport transfers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => applyCoupon('BLRAIRPORT')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container shadow-sm transition-colors cursor-pointer"
              >
                {coupon?.code === 'BLRAIRPORT' ? 'Applied' : 'Apply'}
              </button>
            </div>
          </div>

          {/* Flight Number Banner */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[24px]">
                flight_takeoff
              </span>
              <div>
                <span className="font-label-md text-label-md text-on-surface block font-bold">
                  Add Flight Number for On-time Driver Adjustment
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  We track terminal traffic &amp; flight schedule delays
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={flightNo}
                onChange={(e) => setFlightNo(e.target.value.toUpperCase())}
                placeholder="e.g. 6E 2134"
                className="px-3.5 py-2 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary w-full sm:w-36 uppercase font-mono font-bold"
              />
              <button
                type="button"
                onClick={() => showToast(`Flight number ${flightNo} recorded for radar tracking`)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm shrink-0 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </section>

        {/* Right Sticky Sidebar Console */}
        <aside className="lg:col-span-4 sticky top-28 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
            {/* Styled Map Placeholder Visual (No Google Maps Key Required) */}
            <div className="relative w-full h-48 bg-surface-container-high overflow-hidden">
              {/* CSS vector-styled road and route simulation */}
              <div className="absolute inset-0 bg-[#eef3f8]">
                {/* Simulated highway grid lines */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#b0c4de_1px,transparent_1px)] [background-size:16px_16px]"></div>
                {/* Simulated route curve */}
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  {/* Road backdrop */}
                  <path
                    d="M 40 160 Q 150 120 220 80 T 360 40"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Route stroke */}
                  <path
                    d="M 40 160 Q 150 120 220 80 T 360 40"
                    fill="none"
                    stroke="#0051d5"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="6,4"
                  />
                  {/* Pickup Pin */}
                  <circle cx="40" cy="160" r="8" fill="#0051d5" />
                  <circle cx="40" cy="160" r="4" fill="#ffffff" />
                  {/* Drop Pin */}
                  <circle cx="360" cy="40" r="8" fill="#c88000" />
                  <circle cx="360" cy="40" r="4" fill="#ffffff" />
                </svg>
              </div>

              {/* Overlay info strip */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-end p-4 text-surface-container-lowest">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label-sm text-label-sm bg-surface-container-lowest/20 backdrop-blur-md px-2 py-0.5 rounded text-surface-container-lowest uppercase tracking-wider font-bold">
                    Fastest Route
                  </span>
                  <span className="font-label-md text-label-md text-surface-container-lowest font-medium">
                    Via Bellary Road
                  </span>
                </div>
                <div className="flex items-center justify-between text-surface-container-lowest/90 text-body-sm font-body-sm">
                  <span>Indiranagar → Hebbal → T2</span>
                  <span className="text-emerald-400 font-label-md font-label-md flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Smooth Traffic
                  </span>
                </div>
              </div>

              <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-sm text-primary flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  navigation
                </span>
                <span className="font-label-sm text-label-sm">Live GPS</span>
              </div>
            </div>

            {/* Sidebar Pricing & CTA */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-surface-container-low pb-3">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Selected Cab
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {selectedVehicle.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-secondary uppercase block font-bold">
                    Est. Arrival
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {selectedVehicle.eta}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-body-sm font-body-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Base Fare (38.5 km package)</span>
                  <span className="text-on-surface font-medium">
                    {formatINR(liveFare.baseFare)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Airport Expressway Toll</span>
                  <span className="text-on-surface font-medium">
                    {formatINR(liveFare.tollAndParking)}
                  </span>
                </div>
                {liveFare.discount > 0 && (
                  <div className="flex justify-between text-secondary font-medium">
                    <span>Coupon ({coupon?.code})</span>
                    <span>- {formatINR(liveFare.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes &amp; GST (5%)</span>
                  <span className="text-on-surface font-medium">
                    {formatINR(liveFare.gstAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container-low flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block">
                    Total Payable
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    All taxes included
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-headline-xl text-headline-xl text-secondary font-black">
                    {formatINR(liveFare.totalPayable)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-[52px] rounded-2xl bg-secondary text-on-secondary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg shadow-secondary/25 hover:bg-secondary/95 active:scale-[0.99] transition-all cursor-pointer font-bold"
              >
                <span>Continue to Booking</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <div className="flex items-center justify-center gap-2 pt-1 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                  check_circle
                </span>
                <span>Free cancellation up to 5 mins after driver confirms</span>
              </div>
            </div>
          </div>

          {/* Help Assist Card */}
          <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface shrink-0">
              <span className="material-symbols-outlined text-[20px] text-secondary">
                support_agent
              </span>
            </div>
            <div className="flex-1">
              <p className="font-label-md text-label-md text-on-surface font-bold">
                Need help with Airport Luggage?
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Airport assist desk available at Gate 4
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
