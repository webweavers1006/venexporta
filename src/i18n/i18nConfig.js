import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa tus archivos de traducción
import es from './espanol/es.json';
import en from './ingles/en.json';
import zh from './chino/zh.json';

// Configuración base
i18n
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('idioma') || 'es', // idioma por defecto o guardado
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React ya hace el escape
    },
    resources: {
      es: { translation: es },
      en: { translation: en },
      zh: { translation: zh },
    },
  });

export default i18n;