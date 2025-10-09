/**
 * @file Signup.jsx
 * @module CenterRegister
 * @description Componente de registro de centros con ayuda contextual y accesibilidad mejorada.
 *
 * @example
 * import CenterRegister from './pages/centerLogin/Signup';
 * <CenterRegister className="mi-clase" />
 */

import React from 'react';
import PropTypes from 'prop-types';
import OrganismsRegister from '@components/organisms/register/OrganismsRegister';
import PopoverComponent from '@components/molecules/Popover';
import ayuda from '@assets/logo/ayuda.jpg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleHelp } from 'lucide-react';
import { useHelpPopover } from './hooks/useHelpPopover';
import useSEO from '@hooks/use-seo.js';
import { SEO_CONFIG } from '@config/seo.js';

/**
 * Componente reutilizable y accesible para mostrar el formulario de registro de centros,
 * con ayuda contextual y soporte para personalización.
 *
 * @param {Object} props - Props del componente.
 * @param {string} [props.className] - Clase CSS adicional para el contenedor principal.
 * @returns {JSX.Element}
 */
function CenterRegister({ className = '', ...props }) {
  const { getTriggerProps } = useHelpPopover();

  useSEO({
    title: 'Crear Cuenta - Venexporta',
    description: 'Regístrate en Venexporta y comienza a gestionar tus exportaciones.',
    canonical: `${SEO_CONFIG.domain}signup`, // URL específica para registro
    og: {
      type: 'website',
      title: 'Crear Cuenta - Venexporta',
      description: 'Regístrate en Venexporta y comienza a gestionar tus exportaciones.',
      url: `${SEO_CONFIG.domain}signup`,
      image: SEO_CONFIG.media.ogImage,
      width: '1200',
      height: '630',
      site_name: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      imageAlt: SEO_CONFIG.media.ogImageAlt,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Crear Cuenta - Venexporta',
      description: 'Regístrate en Venexporta y comienza a gestionar tus exportaciones.',
      image: SEO_CONFIG.media.ogImage,
      site: SEO_CONFIG.twitterSite || undefined,
    },
  });

  return (
    <section className={`hero is-fullheight ${className}`} {...props}>
      <div className="hero-body is-centered">
        <PopoverComponent
          trigger={
            <span {...getTriggerProps()} title="Abrir ayuda">
              <CircleHelp className="text-primary" />
            </span>
          }
          aria-label="Ayuda contextual"
        >
          <Card role="dialog" aria-modal="true" aria-label="Ayuda para registro">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">¿Necesitas ayuda?</CardTitle>
              <CardDescription>Estamos aquí para ayudarte</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <img src={ayuda} alt="Ilustración de ayuda" style={{ maxWidth: '100%' }} />
              </CardDescription>
            </CardContent>
          </Card>
        </PopoverComponent>
        <OrganismsRegister />
      </div>
    </section>
  );
}

CenterRegister.propTypes = {
  /** Clase CSS adicional para el contenedor principal */
  className: PropTypes.string,
};

export default CenterRegister;