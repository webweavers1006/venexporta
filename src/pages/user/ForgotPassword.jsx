import React from 'react';
import PropTypes from 'prop-types';
import OrganismsForgotPassword from '@components/organisms/user/OrganismsForgotPassword';
import PopoverComponent from '@components/molecules/Popover';
import ayuda from '@assets/logo/ayuda.jpg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleHelp } from 'lucide-react';
import useSEO from '@hooks/use-seo.js';
import { SEO_CONFIG } from '@config/seo.js';

/**
 * Página de recuperación de contraseña.
 * Muestra un formulario y un popover de ayuda accesible.
 *
 * @component
 * @param {object} props - Props del componente.
 * @param {string} [props.className] - Clases CSS adicionales para el contenedor principal.
 * @example
 * <ForgotPassword className="mi-clase" />
 */
function ForgotPassword({ className = '', ...props }) {
  useSEO({
    title: 'Recuperar Contraseña - Venexporta',
    description: 'Recupera el acceso a tu cuenta en Venexporta de forma rápida y segura.',
    canonical: `${SEO_CONFIG.domain}forgot-password`, // URL específica para recuperar contraseña
    og: {
      type: 'website',
      title: 'Recuperar Contraseña - Venexporta',
      description: 'Recupera el acceso a tu cuenta en Venexporta de forma rápida y segura.',
      url: `${SEO_CONFIG.domain}forgot-password`,
      image: SEO_CONFIG.media.ogImage,
      width: '1200',
      height: '630',
      site_name: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      imageAlt: SEO_CONFIG.media.ogImageAlt,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Recuperar Contraseña - Venexporta',
      description: 'Recupera el acceso a tu cuenta en Venexporta de forma rápida y segura.',
      image: SEO_CONFIG.media.ogImage,
      site: SEO_CONFIG.twitterSite || undefined,
    },
  });

  return (
    <section className={`hero is-fullheight ${className}`} {...props}>
      <div className="hero-body is-centered">
        <PopoverComponent
          trigger={
            <button
              type="button"
              aria-label="Abrir ayuda"
              title="¿Necesitas ayuda?"
              tabIndex={0}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <CircleHelp className="text-primary" aria-hidden="true" />
            </button>
          }
          role="dialog"
          aria-modal="true"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">¿Necesitas ayuda?</CardTitle>
              <CardDescription>Estamos aquí para ayudarte</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <img src={ayuda} alt="Ayuda visual" style={{ maxWidth: '100%' }} />
              </CardDescription>
            </CardContent>
          </Card>
        </PopoverComponent>
        <OrganismsForgotPassword />
      </div>
    </section>
  );
}

ForgotPassword.propTypes = {
  /** Clases CSS adicionales para el contenedor principal */
  className: PropTypes.string,
};

export default ForgotPassword;