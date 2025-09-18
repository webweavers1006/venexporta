import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import ResultComponent from '@src/components/molecules/result/MoleculesResult';
import { Button } from '@/components/ui/button';
import { useHomeEvents } from './hooks/useHomeEvents';
import { useSchedules } from './hooks/useSchedules';
import appStore from '@src/store/appStore';
import MoleculesSchedulesItems from '@components/molecules/MoleculesSchedulesItems';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pagination } from 'antd';

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));
const AtomsTitle = lazy(() => import('@components/atoms/AtomsTitle'));


/**
 * @typedef {Object} Appointment
 * @property {number|string} [id] Identificador de la cita.
 * @property {string} [empresa_solicitante]
 * @property {string} [img_empresa_solicitante]
 * @property {string} [empresa_receptora]
 * @property {string} [img_empresa_receptora]
 * @property {string} [estatus]
 * @property {string} [fecha_solicitada] Fecha en formato ISO; se usa YYYY-MM-DD para agrupar.
 * @property {string} [pais_empresa_receptora]
 */

/**
 * @typedef {Object.<string, Appointment[]>} GroupedAppointments
 * Mapa de fecha (YYYY-MM-DD) a su lista de citas.
 */

/**
 * Home
 *
 * Pantalla de inicio. Muestra un panel de bienvenida y, si existen datos,
 * un conjunto de pestañas con las citas programadas agrupadas por fecha.
 * Si no hay citas, se muestra un estado informativo con acceso a "Intercambio comercial".
 *
 * Accesibilidad: usa roles ARIA en contenedores, tabs y paginación.
 *
 * @component
 * @returns {JSX.Element} Árbol JSX de la pantalla de inicio.
 * @example
 * <Home />
 */
function Home() {
  const navigate = useNavigate();
  // Inicializa eventos del home (efectos secundarios si aplica)
  useHomeEvents();
  const { idCompany } = appStore();
  const { appointments } = useSchedules(idCompany);

  // Agrupar citas por fecha (YYYY-MM-DD)
  /** @type {GroupedAppointments} */
  const groupedAppointments = useMemo(() => {
    const groups = {};
    (appointments || []).forEach((item) => {
      const raw = item?.fecha_solicitada;
      if (typeof raw === 'string' && raw.length >= 10) {
        const dateKey = raw.slice(0, 10);
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(item);
      }
    });
    return groups;
  }, [appointments]);

  /** @type {string[]} Fechas disponibles para tabs en formato YYYY-MM-DD */
  const dateKeys = useMemo(() => Object.keys(groupedAppointments), [groupedAppointments]);
  const [selectedDate, setSelectedDate] = useState(() => dateKeys[0] || null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Mantener selectedDate consistente con los grupos actuales
  useEffect(() => {
    if (!selectedDate || !dateKeys.includes(selectedDate)) {
      setSelectedDate(dateKeys[0] || null);
      setCurrentPage(1);
    }
  }, [dateKeys, selectedDate]);

  return (
    <main aria-label="Pantalla de inicio" className="w-full">
      <div className="w-full">
        <AtomsPanel title={'Bienvenido a Venexporta'} subtitle={'Pantalla de inicio'} />
      </div>
        <>
          <section className="grid grid-cols-1 xl:grid-cols-3 xl:gap-4 gap-y-4 mt-4" aria-label="Horarios de eventos">
            <div className="w-full bg-white flex flex-col items-center justify-center rounded-2xl p-4 xl:col-span-3">
              <AtomsTitle
                  title={'Citas Programadas'}
                  subtitle={'Citas programadas para los próximos días'}
                  className="mb-4"
              />
              {dateKeys.length > 0 ? (
                <Tabs
                  value={selectedDate || ''}
                  onValueChange={(date) => { setSelectedDate(date); setCurrentPage(1); }}
                  className="w-full"
                  aria-label="Fechas de citas"
                >
                  <TabsList className="flex justify-center mx-auto bg-green/50 text-primary" role="tablist">
                    {dateKeys.map((date) => (
                      <TabsTrigger key={date} value={date} role="tab" aria-label={`Ver citas del ${date}`}>
                        {date}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {dateKeys.map((date) => {
                    const list = groupedAppointments[date] || [];
                    const paged = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                    return (
                      <TabsContent key={date} value={date} role="tabpanel" aria-label={`Citas del ${date}`}>
                        <div className="flex flex-col gap-4">
                          {paged.map((item, idx) => (
                            <MoleculesSchedulesItems
                              key={item.id || idx}
                              empresaEmisoraNombre={item.empresa_solicitante || 'Sin nombre'}
                              empresaEmisoraImg={item.img_empresa_solicitante}
                              empresaReceptoraNombre={item.empresa_receptora || 'Sin nombre'}
                              empresaReceptoraImg={item.img_empresa_receptora}
                              estatus={item.estatus}
                              fechaSolicitada={item.fecha_solicitada}
                              pais={item.pais_empresa_receptora}
                              textEstatus={'SIN RESPONDER'}
                            />
                          ))}
                          {list.length === 0 && (
                            <div className="text-gray-400 text-sm">No hay citas para mostrar</div>
                          )}
                        </div>
                        {list.length > pageSize && (
                          <div className="flex justify-end py-4">
                            <Pagination
                              current={currentPage}
                              pageSize={pageSize}
                              total={list.length}
                              onChange={setCurrentPage}
                              showSizeChanger={false}
                              aria-label="Paginación de citas"
                            />
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              ) : (
                <ResultComponent
                  config={{
                    status: 'warning',
                    title: 'No tienes citas programadas',
                    subTitle: 'Aqui puede agendar tus citas e intercambios comerciales',
                    links: [
                      <Button
                        key="eventos"
                        onClick={() => navigate('/roundtable/companies')}
                        aria-label="Intercambio comercial"
                        tabIndex={0}
                      >
                        Ir a Intercambio comercial
                      </Button>,
                    ],
                    messages: [],
                  }}
                />
              )}
            </div>
          </section>
        </>
      
    </main>
  );
}

Home.propTypes = {};

export default Home;