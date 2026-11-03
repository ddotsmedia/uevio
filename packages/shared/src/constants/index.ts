export const EMIRATES = [
  { code: 'AUH', nameEn: 'Abu Dhabi', nameAr: 'أبوظبي' },
  { code: 'DXB', nameEn: 'Dubai', nameAr: 'دبي' },
  { code: 'SHJ', nameEn: 'Sharjah', nameAr: 'الشارقة' },
  { code: 'AJM', nameEn: 'Ajman', nameAr: 'عجمان' },
  { code: 'UAQ', nameEn: 'Umm Al Quwain', nameAr: 'أم القيوين' },
  { code: 'RAK', nameEn: 'Ras Al Khaimah', nameAr: 'رأس الخيمة' },
  { code: 'FUJ', nameEn: 'Fujairah', nameAr: 'الفجيرة' },
] as const;

export const LOCALES = ['en', 'ar'] as const;
export type SupportedLocale = typeof LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const REVIEW_MIN_RATING = 1;
export const REVIEW_MAX_RATING = 5;

export const CURRENCIES = {
  AED: { symbol: 'د.إ', nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي' },
} as const;
