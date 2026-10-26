import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-auto border-t border-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Intro */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">local_taxi</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-primary">
                {APP_CONFIG.brandName}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Reliable intercity transfers, city rides, and holiday tour packages across 100+ transit corridors in India.
            </p>
          </div>

          {/* Transit Services */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Transit Services</h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant list-none p-0 m-0">
              <li>
                <Link to="/vehicles" className="hover:text-primary transition-colors no-underline">
                  City Point-to-Point
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-primary transition-colors no-underline">
                  Outstation One-Way
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-primary transition-colors no-underline">
                  Airport Express Cabs
                </Link>
              </li>
              <li>
                <Link to="/packages/mysuru-heritage" className="hover:text-primary transition-colors no-underline">
                  Curated Tour Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Customer Care</h4>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant list-none p-0 m-0">
              <li>
                <Link to="/support" className="hover:text-primary transition-colors no-underline">
                  24x7 Helpline
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-primary transition-colors no-underline">
                  Track Live Booking
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-primary transition-colors no-underline">
                  Safety Standards
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-primary transition-colors no-underline">
                  Corporate Cab Rental &amp; Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline Box */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-3">Emergency &amp; Helpline</h4>
            <div className="p-4 rounded-xl bg-surface-container-low space-y-1">
              <p className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                Direct Toll-Free
              </p>
              <a
                href={`tel:${APP_CONFIG.tollFreeHelpline}`}
                className="font-headline-sm text-headline-sm text-on-surface block hover:text-secondary transition-colors no-underline font-extrabold"
              >
                {APP_CONFIG.tollFreeHelpline}
              </a>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Instant SOS &amp; Road Assistance
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="pt-8 border-t border-surface-container-low flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant">
          <p>© 2026 {APP_CONFIG.brandName} Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/support" className="hover:text-on-surface transition-colors no-underline">
              Privacy Policy
            </Link>
            <Link to="/support" className="hover:text-on-surface transition-colors no-underline">
              Terms of Transit
            </Link>
            <Link to="/support" className="hover:text-on-surface transition-colors no-underline">
              Fare Breakdown Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
