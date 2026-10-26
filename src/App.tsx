/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { VehicleSelect } from './pages/VehicleSelect';
import { PackageDetail } from './pages/PackageDetail';
import { Checkout } from './pages/Checkout';
import { Confirmed } from './pages/Confirmed';
import { Track } from './pages/Track';
import { Complete } from './pages/Complete';
import { MyTrips } from './pages/MyTrips';
import { Profile } from './pages/Profile';
import { Offers } from './pages/Offers';
import { Support } from './pages/Support';

// Protect routes that require login
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Protect routes that require active booking state
const RequireBooking: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentBooking, showToast } = useApp();
  if (!currentBooking) {
    showToast('Please start a booking first');
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Login Screen (Custom Layout) */}
      <Route path="/login" element={<Login />} />

      {/* Main Pages in MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <MainLayout>
              <VehicleSelect />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/packages/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PackageDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Checkout />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/confirmed"
        element={
          <ProtectedRoute>
            <RequireBooking>
              <MainLayout>
                <Confirmed />
              </MainLayout>
            </RequireBooking>
          </ProtectedRoute>
        }
      />

      <Route
        path="/track"
        element={
          <ProtectedRoute>
            <RequireBooking>
              <MainLayout>
                <Track />
              </MainLayout>
            </RequireBooking>
          </ProtectedRoute>
        }
      />

      <Route
        path="/complete"
        element={
          <ProtectedRoute>
            <RequireBooking>
              <MainLayout>
                <Complete />
              </MainLayout>
            </RequireBooking>
          </ProtectedRoute>
        }
      />

      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MyTrips />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Offers />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Support />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
