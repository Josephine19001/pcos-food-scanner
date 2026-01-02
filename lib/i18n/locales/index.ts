import en from './en';
import es from './es';
import fr from './fr';
import tr from './tr';
import de from './de';
// import ar from './ar';
// import pt from './pt';
// import hi from './hi';
// import it from './it';

export const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  tr: { translation: tr },
  de: { translation: de },
  // ar: { translation: ar },
  // pt: { translation: pt },
  // hi: { translation: hi },
  // it: { translation: it },
};

export type Language = keyof typeof resources;

export const SUPPORTED_LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  // { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  // { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  // { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  // { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];
