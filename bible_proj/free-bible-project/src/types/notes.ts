export interface VerseNote {
  id: string;
  bookName: string;
  chapter: number;
  verse: number;
  verseText: string;
  note: string;
  timestamp: number;
  version: string;
}

export interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];
