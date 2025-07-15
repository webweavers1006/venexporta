import { useEffect, useState, lazy } from 'react';
import { fetchEventos } from '@src/lib/api/apiUser';
import { Select, message } from 'antd';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import AtomsTitle from '@components/atoms/AtomsTitle';
const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));

const Reportes = () => {
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const idCompany = useStore(appStore, state => state.idCompany);

  useEffect(() => {
    // cargar eventos
    const loadEventos = async () => {
      try {
        const data = await fetchEventos(idCompany);
        setEventos(data);
      } catch (error) {
        message.error('Error al cargar eventos');
      }
    };
    loadEventos();
  }, [idCompany]);

  return (
    <>
      <AtomsPanel title={'Reportes'} subtitle={'Información de las estadisticas y reportes del sistema'} />
      <div className="mb-4 mt-4 bg-white p-4 rounded-2xl">
        <AtomsTitle title={'Reporte de Empresas registradas'} subtitle={'descargue el reporte de todas las empresas registradas en sistema'} className='mb-4' />
        <a
          className="block w-full text-center bg-primary text-white py-2 px-4 rounded-xl"
          href="https://back.venexporta-rn.com/empresas/csv"
        >
          Descargar Reporte
        </a>
      </div>
      <div className="flex flex-col gap-2 mb-4 mt-4 bg-white p-4 rounded-2xl w-full">
        <AtomsTitle title="Reportes por Evento" subtitle="debe seleccionar un evento" />
        <div className="mb-2 font-semibold text-lg text-gray-700"></div>
        <Select
          placeholder="Seleccione un evento"
          style={{ width: '100%' }}
          value={selectedEvento}
          onChange={setSelectedEvento}
          options={eventos.map(ev => ({
            value: ev.id,
            label: ev.nombre_evento
          }))}
          allowClear
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
          >
            Descargar empresas
          </a>
        </div>
      </div>
    </>
  );
};

export default Reportes;