// /src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Loads translations from a server
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    fallbackLng: 'en', // Use 'en' if detected language is not available
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
  });

export default i18n;
