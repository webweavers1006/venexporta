// Centralización de variables SEO y de marca
// Puedes ajustar estos valores sin tocar las vistas ni el hook SEO

/**
 * @typedef {Object} SeoConfig
 * @property {string} domain Dominio absoluto (con slash final)
 * @property {string} siteName Nombre del sitio/organización
 * @property {string|null} twitterSite Handle de Twitter/X (opcional, por ejemplo "@venexporta")
 * @property {string} locale Locale OG (por ejemplo "es_VE")
 * @property {{ name: string, logo: string, sameAs: string[] }} organization Datos de la organización
 * @property {{ ogImage: string, ogImageAlt: string, bgHero: string }} media Rutas de medios
 * @property {{ title: string, description: string }} defaults Título y descripción por defecto
 * @property {{ home: string, login: string, register: string, extra: string[] }} routes Rutas clave
 */

export const SEO_CONFIG = /** @type {SeoConfig} */ ({
  domain: 'https://venexporta-rn.com/',
  siteName: 'Venexporta',
  twitterSite: null, // Ej: '@venexporta' si lo tienes
  locale: 'es_VE',
  organization: {
    name: 'Venexporta',
    logo: 'https://venexporta-rn.com/512.png',
    sameAs: [], // Agrega tus redes oficiales cuando las tengas
  },
  media: {
    ogImage: 'https://venexporta-rn.com/og-home.jpg',
    ogImageAlt: 'Venexporta — Plataforma de gestión y promoción exportadora',
    bgHero: '/bg-home.webp',
  },
  defaults: {
    title: 'Venexporta — Plataforma de gestión y promoción exportadora',
    description:
      'Fortalece y promociona tus exportaciones no petroleras con la plataforma Venexporta. Registro simplificado, acceso a eventos y soporte integral.',
  },
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    extra: [],
  },
});
