
import { lazy, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import AtomsTitle from '@components/atoms/AtomsTitle';
import useEventos from './hooks/useEventos';
const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));


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
  const idCompany = useStore(appStore, state => state.idCompany);
  const { eventos, loading } = useEventos(idCompany);
  const [selectedEvento, setSelectedEvento] = useState(null);

  // Accesibilidad: IDs y ARIA
  const selectId = 'evento-select';

  return (
    <>
      <AtomsPanel title={'Reportes'} subtitle={'Información de las estadísticas y reportes del sistema'} />
      <div className="mb-4 mt-4 bg-white p-4 rounded-2xl">
        <AtomsTitle
          title={'Reporte de Empresas registradas'}
          subtitle={'Descargue el reporte de todas las empresas registradas en sistema'}
          className="mb-4"
        />
        <a
          className="block w-full text-center bg-primary text-white py-2 px-4 rounded-xl"
          href="https://back.venexporta-rn.com/empresas/csv"
          role="button"
          aria-label="Descargar reporte de empresas registradas"
          tabIndex={0}
        >
          Descargar Reporte
        </a>
      </div>
      <div className="flex flex-col gap-2 mb-4 mt-4 bg-white p-4 rounded-2xl w-full">
        <AtomsTitle title="Reportes por Evento" subtitle="Debe seleccionar un evento" />
        <label htmlFor={selectId} className="mb-2 font-semibold text-lg text-gray-700">
          Seleccione un evento
        </label>
        <Select
          id={selectId}
          aria-label="Selector de evento"
          placeholder="Seleccione un evento"
          style={{ width: '100%' }}
          value={selectedEvento}
          onChange={setSelectedEvento}
          options={eventos.map(ev => ({
            value: ev.id,
            label: ev.nombre_evento
          }))}
          allowClear
          loading={loading}
        />
        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <a
            href={selectedEvento ? `https://back.venexporta-rn.com/citas/csv/${selectedEvento}` : undefined}
            className={`block w-full text-center py-2 px-4 rounded-xl transition-colors duration-200 ${
              selectedEvento
                ? 'bg-primary text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
            rel="noopener noreferrer"
            role="button"
            aria-disabled={!selectedEvento}
            tabIndex={selectedEvento ? 0 : -1}
            aria-label="Descargar citas del evento seleccionado"
            title={selectedEvento ? 'Descargar citas' : 'Seleccione un evento para descargar'}
          >
            Descargar citas
          </a>
          <a
            href={selectedEvento ? `https://back.venexporta-rn.com/empresas/reporte/evento/${selectedEvento}` : undefined}
            className={`block w-full text-center py-2 px-4 rounded-xl transition-colors duration-200 ${
              selectedEvento
                ? 'bg-primary text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
            rel="noopener noreferrer"
            role="button"
            aria-disabled={!selectedEvento}
            tabIndex={selectedEvento ? 0 : -1}
            aria-label="Descargar empresas del evento seleccionado"
            title={selectedEvento ? 'Descargar empresas' : 'Seleccione un evento para descargar'}
          >
            Descargar empresas
          </a>
        </div>
      </div>
    </>
  );
};

Reportes.propTypes = {};

export default Reportes;