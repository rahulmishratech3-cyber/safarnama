import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MOCK_USER,
  MOCK_VEHICLES,
  MOCK_DRIVER,
  MOCK_ADDRESSES,
  UserProfile,
  VehicleOption,
  BookingRecord,
  SavedAddress,
  calculateTripFare,
} from '../data/mock';
import { APP_CONFIG } from '../config';

export interface SearchState {
  tripType: 'oneway' | 'round' | 'airport';
  pickup: string;
  drop: string;
  dateTime: string;
  includeFastTag: boolean;
  needLuggageCarrier: boolean;
}

export interface SelectedPackageState {
  id: string;
  name: string;
  guests: number;
  rooms: number;
  dates: string;
  vehicle: 'Sedan' | 'SUV';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

interface AppContextType {
  // Auth
  isLoggedIn: boolean;
  user: UserProfile;
  login: (phone: string) => void;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;

  // Search
  search: SearchState;
  setSearch: React.Dispatch<React.SetStateAction<SearchState>>;
  swapPickupDrop: () => void;

  // Selections
  selectedVehicle: VehicleOption;
  setSelectedVehicle: (v: VehicleOption) => void;
  selectedPackage: SelectedPackageState | null;
  setSelectedPackage: React.Dispatch<React.SetStateAction<SelectedPackageState | null>>;

  // Coupon
  coupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Payment
  paymentMethod: 'upi' | 'cards' | 'netbanking' | 'cash';
  setPaymentMethod: (pm: 'upi' | 'cards' | 'netbanking' | 'cash') => void;
  isSplitPayment: boolean;
  setIsSplitPayment: (val: boolean) => void;

  // Bookings & Trips
  currentBooking: BookingRecord | null;
  setCurrentBooking: (b: BookingRecord | null) => void;
  trips: {
    upcoming: BookingRecord[];
    completed: BookingRecord[];
    cancelled: BookingRecord[];
  };
  confirmBooking: () => BookingRecord;
  cancelRide: (bookingId: string, reason?: string) => void;
  completeRide: (reviewData?: {
    rating: number;
    feedbackChips: string[];
    comment: string;
    tipAmount: number;
  }) => void;

  // Addresses & Contacts
  savedAddresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  emergencyContacts: EmergencyContact[];
  
  // Language & UI
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEY = 'safar_mobility_state_v1';

const defaultSearch: SearchState = {
  tripType: 'airport',
  pickup: 'Indiranagar 100ft Road, Bengaluru',
  drop: "Kempegowda Int'l Airport (BLR) - Terminal 2",
  dateTime: 'Today, 04:30 PM (IST)',
  includeFastTag: true,
  needLuggageCarrier: false,
};

const defaultInitialBooking: BookingRecord = {
  bookingId: APP_CONFIG.defaultBookingId,
  type: 'cab',
  pickup: '12th Main Road, HAL 2nd Stage, Indiranagar',
  drop: "Kempegowda Int'l Airport (BLR) - Terminal 2",
  dateTime: 'Today, 04:30 PM (IST)',
  distanceKm: 38.5,
  durationEst: '55 mins',
  vehicle: MOCK_VEHICLES[1], // Prime Sedan
  driver: MOCK_DRIVER,
  otp: APP_CONFIG.defaultOtp,
  fareBreakdown: calculateTripFare({
    baseVehiclePrice: MOCK_VEHICLES[1].basePrice,
    couponCode: 'SAFAR10',
  }),
  paymentMethod: 'upi',
  isSplitPayment: true,
  status: 'upcoming',
  flightNumber: '6E 2134',
};

const defaultEmergencyContacts: EmergencyContact[] = [
  {
    id: 'em-1',
    name: 'Pooja Sharma',
    relation: 'Spouse',
    phone: '+91 98450 11223',
  },
  {
    id: 'em-2',
    name: 'Amit Sharma',
    relation: 'Brother',
    phone: '+91 98200 44556',
  },
];

const defaultTrips = {
  upcoming: [defaultInitialBooking],
  completed: [
    {
      bookingId: 'SFR-721094',
      type: 'cab' as const,
      pickup: 'Indiranagar 100ft Road, Bengaluru',
      drop: 'Electronic City Phase 1, Toll Gate',
      dateTime: '21 Oct 2026, 09:30 AM',
      distanceKm: 24.2,
      durationEst: '42 mins',
      vehicle: MOCK_VEHICLES[1],
      driver: { ...MOCK_DRIVER, name: 'Anand Murthy', plateNumber: 'KA 03 AB 4120' },
      otp: '7721',
      fareBreakdown: calculateTripFare({ baseVehiclePrice: 680, tollFee: 60 }),
      paymentMethod: 'upi',
      isSplitPayment: false,
      status: 'completed' as const,
      review: {
        rating: 5,
        feedbackChips: ['Clean Cab', 'Polite Chauffeur', 'Smooth Route'],
        comment: 'Great on-time pickup through the silk board flyover.',
        tipAmount: 50,
      },
    },
    {
      bookingId: 'SFR-659821',
      type: 'package' as const,
      packageName: 'Mysuru Heritage & Royal Palace Tour',
      pickup: 'Indiranagar HAL 2nd Stage, Bengaluru',
      drop: 'Mysuru Palace Heritage Gate, Mysuru',
      dateTime: '14 Oct 2026, 06:00 AM',
      distanceKm: 145,
      durationEst: '2 Days',
      vehicle: MOCK_VEHICLES[2],
      driver: { ...MOCK_DRIVER, name: 'Suresh Gowda', plateNumber: 'KA 09 TR 9912' },
      otp: '5192',
      fareBreakdown: calculateTripFare({ baseVehiclePrice: 4499, tollFee: 320 }),
      paymentMethod: 'cards',
      isSplitPayment: false,
      status: 'completed' as const,
      review: {
        rating: 5,
        feedbackChips: ['Expert Guide', 'Comfortable Driving'],
        comment: 'Unforgettable palace illumination view with family.',
        tipAmount: 100,
      },
    },
  ],
  cancelled: [
    {
      bookingId: 'SFR-542190',
      type: 'cab' as const,
      pickup: 'Koramangala 4th Block, Bengaluru',
      drop: "Kempegowda Int'l Airport T1",
      dateTime: '02 Oct 2026, 03:00 PM',
      distanceKm: 41,
      durationEst: '60 mins',
      vehicle: MOCK_VEHICLES[0],
      driver: MOCK_DRIVER,
      otp: '3104',
      fareBreakdown: calculateTripFare({ baseVehiclePrice: 649 }),
      paymentMethod: 'upi',
      isSplitPayment: true,
      status: 'cancelled' as const,
      cancelReason: 'Flight was rescheduled by airline to next morning.',
    },
  ],
};

export interface TripsState {
  upcoming: BookingRecord[];
  completed: BookingRecord[];
  cancelled: BookingRecord[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const savedData = (() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  })();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(savedData?.isLoggedIn ?? true);
  const [user, setUser] = useState<UserProfile>(savedData?.user ?? MOCK_USER);
  const [search, setSearch] = useState<SearchState>(savedData?.search ?? defaultSearch);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(
    savedData?.selectedVehicle ?? MOCK_VEHICLES[1]
  );
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackageState | null>(
    savedData?.selectedPackage ?? null
  );
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(
    savedData?.coupon ?? { code: 'SAFAR10', discount: 84 }
  );
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cards' | 'netbanking' | 'cash'>(
    savedData?.paymentMethod ?? 'upi'
  );
  const [isSplitPayment, setIsSplitPayment] = useState<boolean>(
    savedData?.isSplitPayment ?? true
  );
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(
    savedData?.currentBooking ?? defaultInitialBooking
  );
  const [trips, setTrips] = useState<TripsState>(savedData?.trips ?? defaultTrips);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(
    savedData?.savedAddresses ?? MOCK_ADDRESSES
  );
  const [emergencyContacts] = useState<EmergencyContact[]>(
    savedData?.emergencyContacts ?? defaultEmergencyContacts
  );
  const [language, setLanguage] = useState<'en' | 'hi'>(savedData?.language ?? 'en');
  const [toast, setToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isLoggedIn,
          user,
          search,
          selectedVehicle,
          selectedPackage,
          coupon,
          paymentMethod,
          isSplitPayment,
          currentBooking,
          trips,
          savedAddresses,
          emergencyContacts,
          language,
        })
      );
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [
    isLoggedIn,
    user,
    search,
    selectedVehicle,
    selectedPackage,
    coupon,
    paymentMethod,
    isSplitPayment,
    currentBooking,
    trips,
    savedAddresses,
    emergencyContacts,
    language,
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const login = (phone: string) => {
    setIsLoggedIn(true);
    setUser((prev) => ({ ...prev, phone: '+91 ' + phone.trim() }));
    showToast(`Signed in successfully as ${user.name}`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Signed out of all devices');
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Profile updated successfully');
  };

  const swapPickupDrop = () => {
    setSearch((prev) => ({
      ...prev,
      pickup: prev.drop,
      drop: prev.pickup,
    }));
    showToast('Pickup and drop locations swapped');
  };

  const applyCoupon = (code: string) => {
    const clean = code.toUpperCase().trim();
    if (clean === 'SAFAR10') {
      setCoupon({ code: 'SAFAR10', discount: 84 });
      showToast('Coupon SAFAR10 applied: 10% discount!');
      return true;
    } else if (clean === 'BLRAIRPORT') {
      setCoupon({ code: 'BLRAIRPORT', discount: 100 });
      showToast('Coupon BLRAIRPORT applied: ₹100 flat off!');
      return true;
    } else if (clean === 'WEEKEND500') {
      setCoupon({ code: 'WEEKEND500', discount: 500 });
      showToast('Coupon WEEKEND500 applied: ₹500 tour discount!');
      return true;
    } else if (clean === 'SAFARGOLD') {
      setCoupon({ code: 'SAFARGOLD', discount: 110 });
      showToast('Coupon SAFARGOLD applied: Free toll clearance!');
      return true;
    } else {
      showToast(`Invalid or expired coupon code: ${code}`);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed');
  };

  const confirmBooking = (): BookingRecord => {
    const newId = `SFR-${Math.floor(100000 + Math.random() * 900000)}`;
    const fare = calculateTripFare({
      baseVehiclePrice: selectedVehicle.basePrice,
      couponCode: coupon?.code,
      packageAddonPrice: selectedPackage
        ? (selectedPackage.guests > 2 ? 1400 : 0) +
          (selectedPackage.rooms > 1 ? 3200 : 0) +
          (selectedPackage.vehicle === 'SUV' ? 1800 : 0)
        : 0,
    });

    const newBooking: BookingRecord = {
      bookingId: newId,
      type: selectedPackage ? 'package' : 'cab',
      packageId: selectedPackage?.id,
      packageName: selectedPackage?.name,
      pickup: search.pickup,
      drop: search.drop,
      dateTime: search.dateTime,
      distanceKm: selectedPackage ? 145 : 38.5,
      durationEst: selectedPackage ? '2 Days' : '55 mins',
      vehicle: selectedVehicle,
      driver: MOCK_DRIVER,
      otp: APP_CONFIG.defaultOtp,
      fareBreakdown: fare,
      paymentMethod,
      isSplitPayment,
      status: 'upcoming',
      flightNumber: '6E 2134',
    };

    setCurrentBooking(newBooking);
    setTrips((prev: TripsState) => ({
      ...prev,
      upcoming: [newBooking, ...prev.upcoming],
    }));

    return newBooking;
  };

  const cancelRide = (bookingId: string, reason?: string) => {
    const target = trips.upcoming.find((t: BookingRecord) => t.bookingId === bookingId) || currentBooking;
    if (target) {
      const cancelledItem: BookingRecord = {
        ...target,
        status: 'cancelled',
        cancelReason: reason || 'Cancelled by passenger before departure',
      };
      setTrips((prev: TripsState) => ({
        ...prev,
        upcoming: prev.upcoming.filter((t: BookingRecord) => t.bookingId !== bookingId),
        cancelled: [cancelledItem, ...prev.cancelled],
      }));
      if (currentBooking?.bookingId === bookingId) {
        setCurrentBooking(cancelledItem);
      }
      showToast(`Booking ${bookingId} cancelled. 100% advance refunded.`);
    }
  };

  const completeRide = (reviewData?: {
    rating: number;
    feedbackChips: string[];
    comment: string;
    tipAmount: number;
  }) => {
    if (!currentBooking) return;
    const completedItem: BookingRecord = {
      ...currentBooking,
      status: 'completed',
      review: reviewData,
    };
    setCurrentBooking(completedItem);
    setTrips((prev: TripsState) => ({
      ...prev,
      upcoming: prev.upcoming.filter((t: BookingRecord) => t.bookingId !== currentBooking.bookingId),
      completed: [
        completedItem,
        ...prev.completed.filter((t: BookingRecord) => t.bookingId !== currentBooking.bookingId),
      ],
    }));
    showToast('Trip completed! Thank you for choosing Safar.');
  };

  const addAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setSavedAddresses((prev) => [...prev, newAddr]);
    showToast('Address saved to frequent hubs');
  };

  const deleteAddress = (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed');
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        updateUser,
        search,
        setSearch,
        swapPickupDrop,
        selectedVehicle,
        setSelectedVehicle,
        selectedPackage,
        setSelectedPackage,
        coupon,
        applyCoupon,
        removeCoupon,
        paymentMethod,
        setPaymentMethod,
        isSplitPayment,
        setIsSplitPayment,
        currentBooking,
        setCurrentBooking,
        trips,
        confirmBooking,
        cancelRide,
        completeRide,
        savedAddresses,
        addAddress,
        deleteAddress,
        emergencyContacts,
        language,
        setLanguage,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
