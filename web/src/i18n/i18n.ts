import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import zuCommon from './locales/zu/common.json';
import xhCommon from './locales/xh/common.json';
import veCommon from './locales/ve/common.json';
import afCommon from './locales/af/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      zu: { common: zuCommon },
      xh: { common: xhCommon },
      ve: { common: veCommon },
      af: { common: afCommon },
    },
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
