
import React from 'react';
import PropTypes from 'prop-types';
import OrganismsForgotPassword from '@components/organisms/user/OrganismsForgotPassword';
import PopoverComponent from '@components/molecules/Popover';
import ayuda from '@assets/logo/ayuda.jpg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleHelp } from 'lucide-react';

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