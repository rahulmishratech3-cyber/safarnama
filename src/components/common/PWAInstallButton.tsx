import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-sm text-label-sm shadow-sm transition-all cursor-pointer ${className}`}
        title="Install Safar Mobility App"
      >
        <span className="material-symbols-outlined text-[16px]">install_mobile</span>
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm transition-all cursor-pointer ${className}`}
          title="Install on iPhone / iPad"
        >
          <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">Install Safar App</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="mt-4 space-y-3 font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-secondary-fixed text-primary font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <span>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-secondary-fixed text-primary font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-secondary-fixed text-primary font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <span>Tap <strong>Add</strong> in the top right to complete installation.</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full h-11 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
