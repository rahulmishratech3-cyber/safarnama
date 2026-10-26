export const APP_CONFIG = {
  brandName: 'Safar Mobility',
  brandShort: 'SAFAR',
  tagline: 'Elevated Intercity & Airport Mobility Across India',
  primaryCity: 'Bengaluru',
  tollFreeHelpline: '1800-420-SAFAR',
  directPhone: '+91 80000 00000',
  supportEmail: 'care@safarmobility.in',
  corporateAddress: 'HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka - 560038',
  standardTollFee: 110,
  defaultOtp: '4829',
  defaultBookingId: 'SFR-849204',
};

export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}
