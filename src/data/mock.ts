import { APP_CONFIG } from '../config';

export interface VehicleOption {
  id: string;
  name: string;
  category: string;
  desc: string;
  seats: number;
  bags: number;
  eta: string;
  originalPrice: number;
  basePrice: number;
  badge?: string;
  isRecommended?: boolean;
  features: string[];
}

export interface DriverDetails {
  name: string;
  phone: string;
  rating: number;
  tripsCount: string;
  languages: string;
  vehicleModel: string;
  plateNumber: string;
  tier: string;
  photoUrl: string;
  carPhotoUrl: string;
}

export interface FareCalculation {
  baseFare: number;
  driverAllowance: number;
  tollAndParking: number;
  gstAmount: number;
  discount: number;
  totalPayable: number;
  advancePayable: number;
  balancePayable: number;
}

export interface TourPackage {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  rating: number;
  reviewsCount: string;
  duration: string;
  imageUrl: string;
  overview: string;
  highlights: string[];
  inclusions: string[];
  day1Schedule: { time: string; title: string; desc: string }[];
  day2Schedule: { time: string; title: string; desc: string }[];
  basePrice: number;
  originalPrice: number;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  tier: string;
  tierExpiry: string;
  points: number;
  walletBalance: number;
  tripsTaken: number;
  riderScore: number;
  referralCode: string;
}

export interface SavedAddress {
  id: string;
  tag: 'Home' | 'Office' | 'Airport' | 'Other';
  label: string;
  address: string;
  city: string;
  pincode?: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface BookingRecord {
  bookingId: string;
  type: 'cab' | 'package';
  packageId?: string;
  packageName?: string;
  pickup: string;
  drop: string;
  dateTime: string;
  distanceKm: number;
  durationEst: string;
  vehicle: VehicleOption;
  driver: DriverDetails;
  otp: string;
  fareBreakdown: FareCalculation;
  paymentMethod: string;
  isSplitPayment: boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
  cancelReason?: string;
  flightNumber?: string;
  review?: {
    rating: number;
    feedbackChips: string[];
    comment: string;
    tipAmount: number;
  };
}

export const MOCK_DRIVER: DriverDetails = {
  name: 'Ramesh Kumar',
  phone: '+91 98450 99881',
  rating: 4.9,
  tripsCount: '2,400+ Safar Trips',
  languages: 'Kannada, Hindi, English',
  vehicleModel: 'Maruti Suzuki Dzire (White)',
  plateNumber: 'KA 01 MJ 8472',
  tier: 'Gold Driver',
  photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK2xYZzO-moJkKh8pYvXV6ZyPrR9RqqTl_yFjNSLZxEHI1Yg8GWsuZOS0vXqMBm0Hf5GWikkBuJzp0Z0DZpthQIaUSfspL09ztIP7OI0mTGp56_T1RG_ZlwDrXrlgyvul7AESdHQgam2HdE6s71kSZ526ZZtwa6aD0MUUpzfHW5xHkoIp10b8FUUWv-KNeHSFVYa1nSgvyEgo4nYxWKsk9R1LIrn_XmZCKAl_VY5pV11mztIj87mus',
  carPhotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8W6cU5ylbF7XkdRUsl4-xXJigLuLcIGgLuYCCpTl7iUzU-wr0S6HWhFtLOSiaNhzqHHQGSUpSI0Zi6t1mnvt26Y83mdR2AYISzkBGo14U0cBvsd4UoqVR0kcjz6UCjbhUva_3DAK1llOnrQZ5_gPKb3YgATcroKUpQh3Kdw0X02p3EPyi4VACmsrKol74bTjyiywgdL4mwOI60jB2pXbgVDY06C3Yx2pKQ5jyOhim5RptD6Pju2_S',
};

export const MOCK_VEHICLES: VehicleOption[] = [
  {
    id: 'hatchback',
    name: 'Hatchback',
    category: 'Budget Saver',
    desc: 'WagonR, Tata Tiago or similar compact cab',
    seats: 4,
    bags: 2,
    eta: '3 mins away',
    originalPrice: 720,
    basePrice: 649,
    features: ['Fast AC', 'Compact City Transit', 'Verified Chauffeur'],
  },
  {
    id: 'prime-sedan',
    name: 'Prime Sedan',
    category: 'Extra Legroom',
    desc: 'Dzire, Etios • High speed highway clearance',
    seats: 4,
    bags: 3,
    eta: 'Fast Pickup (2 mins)',
    originalPrice: 980,
    basePrice: 849,
    badge: 'RECOMMENDED • TOP RATED',
    isRecommended: true,
    features: ['Chauffeur Driven', 'Large Boot Space', 'Express Toll FastTag'],
  },
  {
    id: 'prime-suv',
    name: 'Prime SUV',
    category: 'Family Travel',
    desc: 'Ertiga, Innova Crysta • Large luggage carrier rack',
    seats: 6,
    bags: 4,
    eta: '6 mins away',
    originalPrice: 1450,
    basePrice: 1249,
    features: ['Highway Ready', 'Rear AC Vents', 'Carrier Rack'],
  },
  {
    id: 'tempo',
    name: 'Tempo Traveller',
    category: 'Group Transit',
    desc: 'Force Urbania / Winger • Recliner business seats',
    seats: 14,
    bags: 10,
    eta: 'Pre-scheduled booking',
    originalPrice: 3200,
    basePrice: 2899,
    features: ['12-16 Seats', 'Dedicated Chauffeur', 'Audio & Charging Ports'],
  },
];

export const MOCK_PACKAGES: TourPackage[] = [
  {
    id: 'mysuru-heritage',
    title: 'Mysuru Heritage & Royal Palace Tour',
    tagline: 'Heritage Circuit',
    badge: '2D / 1N All-Inclusive',
    rating: 4.8,
    reviewsCount: '1.2k',
    duration: '2 Days / 1 Night',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlSVIUJ0413Y3eY52tgL7O83zpIb7xajaan-Q0qVRUJdCZG-XwJJc4_t19VH93FtFlYz1zaxnFYB6VR834MH3GcGW0cz5R6nZfoz8rodHRqnGU9OZJVE7iEqHQshwnn6ikUqpzKvYVy-eIuPb7fLLXrtMyPSlLzVazktnGDlMBzQhwwLNoKeObdsLG3JnO2uTEmve2kx7NwZR2QgQsSZTCBTXLY4eHEq4K-tJLgpTWDL7-B6NM8x_',
    overview: 'Private Sedan or Ertiga cab, Chamundi Hill summit, illuminated Amba Vilas Palace pass, and traditional Srirangapatna ghat halts with all tolls & permits included.',
    highlights: [
      'Amba Vilas Palace evening golden illumination VIP pass',
      'Panoramic summit darshan at Chamundeshwari Temple',
      'Historic Tipu Sultan Summer Palace & Srirangapatna Fort',
      'Brindavan Gardens musical fountain evening walk'
    ],
    inclusions: ['Dedicated Chauffeur-Guide', 'All Tolls & State Border Taxes', 'AC Sedan/SUV Sanitized Vehicle', 'Heritage Hotel Stay with Breakfast'],
    day1Schedule: [
      { time: '06:00 AM', title: 'Pickup from Home/Airport', desc: 'Chauffeur arrives at your doorstep in Bengaluru with fresh mineral water and highway route clearance.' },
      { time: '08:30 AM', title: 'Authentic Bidadi Breakfast Halt', desc: 'Taste world-famous Bidadi Thatte Idli along the 10-lane Bengaluru-Mysuru Expressway.' },
      { time: '11:00 AM', title: 'Srirangapatna Heritage Enclave', desc: 'Explore Ranganathaswamy temple, Tipu Sultan death place & dungeon corridors.' },
      { time: '02:00 PM', title: 'Hotel Check-In & Mysuru Thali', desc: 'Check in to curated 4-star heritage property. Savor classic Royal Mysuru lunch.' },
      { time: '06:30 PM', title: 'Grand Palace Illumination', desc: 'Witness 100,000 bulbs lighting up the Amba Vilas Palace facade at twilight.' }
    ],
    day2Schedule: [
      { time: '07:30 AM', title: 'Chamundi Hills Ascent', desc: 'Morning hill breeze, sacred Nandi monolith sculpture and city viewpoint.' },
      { time: '11:00 AM', title: 'St. Philomena’s Cathedral & Silk Emporium', desc: 'Neo-Gothic architecture followed by authentic government GI-tagged silk shopping.' },
      { time: '04:00 PM', title: 'Return Journey to Bengaluru', desc: 'Smooth highway cruise back with drop-off at your designated pickup address by 08:30 PM.' }
    ],
    basePrice: 4499,
    originalPrice: 5200,
  },
  {
    id: 'coorg-mist',
    title: 'Coorg Coffee & Mist Trails',
    tagline: 'Hill Station & Coffee',
    badge: '3D / 2N Scenic Pass',
    rating: 4.9,
    reviewsCount: '860',
    duration: '3 Days / 2 Nights',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJsC8pT6ZE2efxVTaL3oGLLX1OaWlNZhT8xObHZtZjXh-kVamosuMjtutWX465KYqxD5PM0fCCYQcWUTU1ind-vA8mqgBPsa3HT0-2tYVyW1Zbrr3Xi364unfLZflyxm3Wk6RTPlz50zOwOaQzaORySeQH_V_LCCuhFB62KkEVFqAooJQqT4AVcYlEkxfHrpearZRuEz2H_1Qq9qpF0G2lrJ_0f-oCmPJpNNC7nzqK_DEwpdhQLt9m',
    overview: 'Abbey Falls, Raja’s Seat sunset lookout, Golden Temple Bylakuppe, and scenic plantation homestay pick & drops.',
    highlights: ['Bylakuppe Tibetan Monasteries', 'Abbey Falls nature trail', 'Organic Arabica coffee plantation walk', 'Raja Seat Sunset musical view'],
    inclusions: ['Private SUV Cab', 'State Tolls & Fuel Included', 'Local Sightseeing Permits', '2 Nights Plantation Homestay'],
    day1Schedule: [
      { time: '06:00 AM', title: 'Departure from Bengaluru', desc: 'Scenic drive passing through Kushalnagar.' },
      { time: '11:30 AM', title: 'Namdroling Golden Temple', desc: 'Serene prayer chanting and majestic Tibetan murals.' },
      { time: '03:30 PM', title: 'Coffee Homestay Welcome', desc: 'Fresh estate brewed coffee and nature estate exploration.' }
    ],
    day2Schedule: [
      { time: '08:30 AM', title: 'Abbey Falls & Madikeri Fort', desc: 'Lush greenery, mist-covered cascade paths.' },
      { time: '05:00 PM', title: 'Raja Seat Sunset', desc: 'Panoramic Western Ghats sunset with misty winds.' }
    ],
    basePrice: 7899,
    originalPrice: 8900,
  },
  {
    id: 'ooty-nilgiri',
    title: 'Ooty & Nilgiri Hills Escapade',
    tagline: 'High Altitude Escapade',
    badge: '3D / 2N Mountain Escape',
    rating: 4.7,
    reviewsCount: '940',
    duration: '3 Days / 2 Nights',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx1BjpaVv0LRQtrirIypScOnli3MbwJAzKp92f51mpOfvggwD4fmhGb5GY4y16ARbKr_XlE4PDblYS8uCC6UthL-rweo0SB3MvHvdGD6Lrxh0yebQW9rh_lBgtsJAK1qU7bI6VNibTVcpOiVi5oRzy9LTwm6iAeNMZxAHDQmgAPs68VTeuG6FUEYnFqcZcH9dCZMBUWdQ0ygZ8VWf7xk25tCxfqbcc5H6MGy41U24koSdcMcH3oCm3',
    overview: 'Bandipur Forest reserve pass, Doddabetta Peak panoramic view, botanical gardens, and Pykara lake speed boating halt.',
    highlights: ['Bandipur National Park jungle corridor', 'Doddabetta highest peak view', 'Botanical Rose Garden', 'Pykara Lake Boating'],
    inclusions: ['Ghat-Certified Expert Chauffeur', 'Interstate Permit (KA & TN)', 'Tea Estate Safari', 'Resort Stay'],
    day1Schedule: [
      { time: '05:30 AM', title: 'Bengaluru to Bandipur Safari Drive', desc: 'Catch wildlife sightings at morning border check.' },
      { time: '01:00 PM', title: 'Ooty Arrival & Tea Factory', desc: 'Chocolate tasting and fresh Nilgiri tea estates.' }
    ],
    day2Schedule: [
      { time: '09:00 AM', title: 'Doddabetta Summit & Botanical Gardens', desc: 'Spectacular misty valley vistas.' },
      { time: '03:00 PM', title: 'Pykara Lake Speedboat', desc: 'Surrounded by pine trees and waterfalls.' }
    ],
    basePrice: 8999,
    originalPrice: 10200,
  },
];

export const MOCK_USER: UserProfile = {
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  email: 'rahul.sharma@example.com',
  tier: 'Gold Member',
  tierExpiry: 'Oct 2026',
  points: 320,
  walletBalance: 250,
  tripsTaken: 24,
  riderScore: 4.9,
  referralCode: 'RAHUL150',
};

export const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    tag: 'Home',
    label: 'Home',
    address: '12th Main Road, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru, Karnataka - 560038',
    landmark: 'Floor 402, Landmark: Near Corner House Ice Cream',
    isDefault: true,
  },
  {
    id: 'addr-2',
    tag: 'Office',
    label: 'Office (Tech Hub)',
    address: 'Prestige Tech Park, Outer Ring Road, Kadubeesanahalli',
    city: 'Bengaluru, Karnataka - 560103',
    landmark: 'Building Jupiter, Tower 3, Security Gate 2 Drop-off',
    isDefault: false,
  },
  {
    id: 'addr-3',
    tag: 'Airport',
    label: 'Kempegowda International Airport',
    address: 'BLR Airport Terminal Pickup / Departures Drop',
    city: 'Devanahalli, Bengaluru - 560300',
    landmark: 'Dedicated Safar Pickup Lane 3 (T1 & T2 Express)',
    isDefault: false,
  },
];

export const MOCK_OFFERS = [
  {
    code: 'SAFAR10',
    title: 'Get 10% OFF on your first booking',
    desc: 'Valid across Karnataka & Tamil Nadu routes. Max discount ₹150.',
    discountPercent: 10,
    maxDiscount: 150,
    badge: 'Welcome Privileges',
    validTill: '31 Dec 2026',
  },
  {
    code: 'BLRAIRPORT',
    title: 'Flat ₹100 OFF on Airport Cabs',
    desc: 'Auto-applied for direct terminal transfers to KIA T1 & T2.',
    discountFixed: 100,
    badge: 'Airport Exclusive',
    validTill: 'Ongoing',
  },
  {
    code: 'WEEKEND500',
    title: 'Flat ₹500 OFF on Tour Packages',
    desc: 'Applicable on Mysuru, Coorg, Ooty & Wayanad curated holidays.',
    discountFixed: 500,
    badge: 'Weekend Escapes',
    validTill: '30 Nov 2026',
  },
  {
    code: 'SAFARGOLD',
    title: 'Complimentary Highway Toll Pass',
    desc: 'Zero toll charge deduction up to ₹120 for Safar Gold members.',
    discountFixed: 110,
    badge: 'Gold Members Only',
    validTill: 'Oct 2026',
  },
];

export const MOCK_FAQS = [
  {
    q: 'How does Safar guarantee zero surge pricing?',
    a: 'Unlike algorithmic ride-hailing apps, Safar Mobility operates on transparent corridor-regulated tariff matrices. Fares are locked upfront and do not spike during rain, late night, or high-demand hours.',
  },
  {
    q: 'What is the Zero-Cancellation Guarantee option?',
    a: 'You can reserve any verified cab by paying an advance token of just ₹199. If you cancel up to 60 minutes before pickup, 100% of the advance is instantly refunded to your source payment method without questions.',
  },
  {
    q: 'How are the drivers verified and trained?',
    a: 'Every Safar chauffeur undergoes 100% police criminal background checks, commercial driving badge verification, behavioral grooming, and compulsory defensive highway driving training.',
  },
  {
    q: 'Are tolls and state border taxes included in the estimate?',
    a: 'Yes! All tolls (including Bengaluru Expressway, trumpet flyover, and state entry taxes) are calculated and itemized in your all-inclusive fare breakdown.',
  },
  {
    q: 'What happens if my flight is delayed?',
    a: 'Our telematics system monitors real-time flight radar feeds. If your flight is delayed, the chauffeur’s dispatch window adjusts automatically with up to 60 minutes of complimentary wait time.',
  },
];

/**
 * SINGLE SOURCE OF TRUTH:
 * Calculate fare deterministically across all screens
 */
export function calculateTripFare(params: {
  baseVehiclePrice: number;
  tollFee?: number;
  driverAllowance?: number;
  couponCode?: string | null;
  packageAddonPrice?: number;
}): FareCalculation {
  const baseFare = params.baseVehiclePrice + (params.packageAddonPrice || 0);
  const driverAllowance = params.driverAllowance !== undefined ? params.driverAllowance : 50;
  const tollAndParking = params.tollFee !== undefined ? params.tollFee : APP_CONFIG.standardTollFee;
  
  // GST 5% on base + allowance
  const subtotalBeforeTax = baseFare + driverAllowance;
  const gstAmount = Math.round(subtotalBeforeTax * 0.05);

  let discount = 0;
  if (params.couponCode) {
    const code = params.couponCode.toUpperCase().trim();
    if (code === 'SAFAR10') {
      discount = Math.min(Math.round(subtotalBeforeTax * 0.1), 150);
    } else if (code === 'BLRAIRPORT') {
      discount = 100;
    } else if (code === 'WEEKEND500') {
      discount = 500;
    } else if (code === 'SAFARGOLD') {
      discount = 110;
    }
  }

  // Total payable
  const totalPayable = Math.max(0, subtotalBeforeTax + tollAndParking + gstAmount - discount);
  // Split payment policy: ₹199 advance, rest on drop
  const advancePayable = Math.min(199, totalPayable);
  const balancePayable = Math.max(0, totalPayable - advancePayable);

  return {
    baseFare,
    driverAllowance,
    tollAndParking,
    gstAmount,
    discount,
    totalPayable,
    advancePayable,
    balancePayable,
  };
}
