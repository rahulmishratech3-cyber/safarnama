import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-primary text-on-primary shadow-2xl border border-surface-container-high/30 animate-bounce duration-300">
      <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-on-secondary shrink-0">
        <span className="material-symbols-outlined text-[18px]">info</span>
      </div>
      <span className="font-body-md text-body-md text-on-primary font-medium">{toast}</span>
    </div>
  );
};
