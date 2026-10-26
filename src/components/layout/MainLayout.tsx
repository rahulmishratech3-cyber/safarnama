import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toast } from '../common/Toast';
import { OfflineIndicator } from '../common/OfflineIndicator';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-primary">
      <Header />
      <main className="w-full pt-20 bg-surface flex-1 flex flex-col">{children}</main>
      <Footer />
      <Toast />
      <OfflineIndicator />
    </div>
  );
};
