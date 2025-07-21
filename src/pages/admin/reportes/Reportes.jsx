
import { lazy } from 'react';

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));
const ReportesDinamicosEventosActividades = lazy(() => import('./ReportesDinamicosEventosActividad'));
const ReportesDinamicosActividades = lazy(() => import('./ReportesDinamicosActividad'));
const ReportesDinamicosPaises = lazy(() => import('./ReportesDinamicosPais'));
const ReportesDinamicosSubSector = lazy(() => import('./ReportesDinamicosSubSector'));

/**
 * Componente de reportes administrativos.
 * Permite descargar reportes generales y por evento.
 *
 * @component
 * @example
 * // Uso típico:
 * <Reportes />
 */
const Reportes = () => {
  return (
    <>
      <AtomsPanel title={'Reportes'} subtitle={'Información de las estadísticas y reportes del sistema'} />
      <ReportesDinamicosEventosActividades />
      <ReportesDinamicosActividades />
      <ReportesDinamicosPaises />
      <ReportesDinamicosSubSector/>
    </>
  );
};

Reportes.propTypes = {};

export default Reportes;