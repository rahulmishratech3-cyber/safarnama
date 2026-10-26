import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_OFFERS } from '../data/mock';

export const Offers: React.FC = () => {
  const { coupon, applyCoupon, removeCoupon, showToast } = useApp();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code: string) => {
    applyCoupon(code);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px]">local_offer</span>
            <span>Promotions &amp; Corridor Discounts</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
            Exclusive Offers &amp; Tariffs
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Save on outstation journeys, guaranteed airport transfers, and holiday tours with transparent promo codes.
          </p>
        </div>

        {coupon && (
          <div className="bg-surface-container-lowest p-3.5 px-5 rounded-2xl shadow-sm border border-secondary/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              check_circle
            </span>
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold block">
                Active Promo
              </span>
              <span className="font-headline-sm text-headline-sm text-primary font-mono font-bold">
                {coupon.code}
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-error font-label-sm text-label-sm hover:underline ml-2 cursor-pointer font-bold"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Grid of 4 coupon cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_OFFERS.map((offer) => {
          const isApplied = coupon?.code === offer.code;
          return (
            <div
              key={offer.code}
              className={`bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all border flex flex-col justify-between gap-6 relative overflow-hidden ${
                isApplied ? 'border-secondary ring-2 ring-secondary/40' : 'border-surface-container-low'
              }`}
            >
              {/* Decorative dash line */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                      {offer.badge}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Valid till {offer.validTill}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {offer.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {offer.desc}
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-secondary shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[30px]">confirmation_number</span>
                </div>
              </div>

              {/* Code Box & Buttons */}
              <div className="pt-4 border-t border-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-dashed border-secondary/40 font-mono font-bold text-primary tracking-wider text-base w-full sm:w-auto justify-center sm:justify-start">
                  <span>{offer.code}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(offer.code)}
                    className="text-secondary hover:text-primary transition-colors cursor-pointer ml-1"
                    title="Copy Code"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedCode === offer.code ? 'done' : 'content_copy'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleApply(offer.code)}
                    className={`h-11 px-5 rounded-xl font-label-md text-label-md transition-all cursor-pointer font-bold ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-secondary hover:bg-secondary-container text-on-secondary shadow-sm'
                    }`}
                  >
                    {isApplied ? '✓ Applied' : 'Apply Promo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      applyCoupon(offer.code);
                      navigate('/vehicles');
                    }}
                    className="h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors cursor-pointer"
                  >
                    Use in Ride
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
