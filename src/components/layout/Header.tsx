import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const Header: React.FC = () => {
  const { isLoggedIn, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Services', path: '/vehicles' },
    { label: 'Tour Packages', path: '/packages/mysuru-heritage' },
    { label: 'My Trips', path: '/trips' },
    { label: 'Offers', path: '/offers' },
    { label: '24x7 Support', path: '/support' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/packages')) return location.pathname.startsWith('/packages');
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 no-underline">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">local_taxi</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-tight text-primary leading-none">
                {APP_CONFIG.brandShort}
              </span>
              <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
                Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Nav (>= 1280px / xl) */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 font-label-md text-label-md rounded-lg transition-colors no-underline ${
                    active
                      ? 'bg-surface-container text-primary font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Area: Install button, Profile or Sign In, Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* PWA Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            {isLoggedIn ? (
              <Link
                to="/profile"
                className="flex items-center gap-3 bg-surface-container-low hover:bg-surface-container py-1.5 pl-3 pr-2 rounded-full cursor-pointer transition-colors no-underline"
                title="View Profile & Settings"
              >
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="font-label-md text-label-md text-on-surface leading-tight">
                    {user.name}
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <span
                      className="material-symbols-outlined text-on-tertiary-container text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      hotel_class
                    </span>
                    <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase">
                      {user.tier}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-md text-label-md transition-colors no-underline"
              >
                Sign In
              </Link>
            )}

            {/* Hamburger Button (< 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-10 h-10 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Panel */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-40 bg-primary/50 backdrop-blur-xs pt-20">
          <div className="bg-surface-container-lowest w-full max-w-sm ml-auto h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Navigation
                </span>
                <PWAInstallButton />
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const active = isLinkActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl font-label-md text-label-md transition-colors no-underline flex items-center justify-between ${
                        active
                          ? 'bg-surface-container text-primary font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </Link>
                  );
                })}
              </div>

              {isLoggedIn && (
                <div className="p-4 rounded-xl bg-surface-container-low space-y-2 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                      RS
                    </div>
                    <div>
                      <div className="font-label-lg text-label-lg text-primary">{user.name}</div>
                      <div className="text-on-tertiary-container font-label-sm text-label-sm">
                        {user.tier} • {user.points} Points
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full py-2 bg-surface-container-lowest hover:bg-surface-container rounded-lg font-label-md text-label-md text-secondary transition-colors no-underline"
                  >
                    View Full Profile
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-surface-container-low text-center font-body-sm text-body-sm text-on-surface-variant">
              <span>Need help? Call Toll-Free</span>
              <a
                href={`tel:${APP_CONFIG.tollFreeHelpline}`}
                className="block font-headline-sm text-headline-sm text-primary font-bold mt-1 no-underline"
              >
                {APP_CONFIG.tollFreeHelpline}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
