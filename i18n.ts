import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';

// Create a new i18n instance
const i18n = new I18n({
  en,
  fr,
  es,
  de,
});

// Set the locale once at the beginning of your app.
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
