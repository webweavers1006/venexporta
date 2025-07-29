

import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getCurrentDate } from '@lib/utils';
import { fetchPaises } from '@src/lib/api/apiIndex';
import { getCantSubSectorProductivo, getCantEmpresasAnualidad, getCantEventosAnualidad, getRankParticipacionEventos } from '@src/lib/api/apiIndex';
import MoleculesEmpresasCard from '@components/molecules/MoleculesEmpresasCard/MoleculesEmpresasCard';
import { useDashboardData } from './hooks/useDashboardData';
const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));
const MoleculesChartPie = lazy(() => import('@components/molecules/charts/MoleculesChartPie'));
const MoleculesChartBarMultiple = lazy(() => import('@components/molecules/charts/MoleculesChartBarMultiple'));
// const ChartAreaMeses = lazy(() => import('@components/molecules/charts/MoleculesChartAreaMeses'));
const MoleculesEmpresasBarChart = lazy(() => import('@components/molecules/charts/MoleculesEmpresasBarChart'));


/**
 * Loader de estado para el dashboard.
 * @returns {JSX.Element}
 */
const Loading = () => <div role="status" aria-label="Cargando dashboard">Loading...</div>;



/**
 * Dashboard de administración
 *
 * Muestra gráficos y estadísticas de empresas, usuarios y sectores productivos.
 * Utiliza componentes reutilizables y helpers para transformar datos de manera escalable.
 *
 * @component
 * @example
 * <Dashboard />
 */

// Helpers para transformar datos y configs de los gráficos de torta
function mapPieData(array, {
  labelKey,
  valueKey,
  colorKey = 'color',
  extra = () => ({}),
  filter = () => true
}) {
  return (array || [])
    .filter(filter)
    .map(item => ({
      label: item[labelKey],
      value: item[valueKey],
      fill: item[colorKey] || undefined,
      ...extra(item)
    }));
}

function pieConfig(array, {
  labelKey,
  colorKey = 'color',
  filter = () => true
}) {
  return (array || [])
    .filter(filter)
    .reduce((acc, item) => {
      acc[item[labelKey]] = {
        label: item[labelKey],
        color: item[colorKey] || undefined
      };
      return acc;
    }, {});
}

// Renderizador por defecto para el seleccionado
/**
 * Renderizador por defecto para el segmento seleccionado en el gráfico de torta.
 * @param {Object} props
 * @param {string} props.selected - Label seleccionado.
 * @param {Object} props.item - Objeto de datos seleccionado.
 * @param {number} props.total - Total general.
 * @param {string} [props.labelTotal] - Etiqueta para el total.
 */
function DefaultPieSelected({ selected, item, total, labelTotal = 'Total' }) {
DefaultPieSelected.propTypes = {
  selected: PropTypes.string,
  item: PropTypes.object,
  total: PropTypes.number,
  labelTotal: PropTypes.string
};
  if (!item) return null;
  return (
    <div className="text-center w-full flex flex-col items-center gap-2">
      <span className="font-medium text-base" style={{ color: '#6b7280' }}>
        <span className="font-bold" style={{ color: '#364153' }}>Seleccionado:</span> {selected}
      </span>
      <span
        className="text-foreground font-bold px-4 py-1 rounded"
        style={{ background: item?.fill || '#eee', color: '#fff', display: 'inline-block', minWidth: 60 }}
        aria-label={`Valor de ${selected}`}
      >
        {labelTotal ? `${labelTotal}: ` : ''}{item?.value?.toLocaleString()}
        {total > 0 && (
          <span className="ml-2 text-xs text-white/80">
            ({(((item?.value || 0) / total) * 100).toFixed(2)}%)
          </span>
        )}
      </span>
    </div>
  );
}



import { useDashboardColors } from './hooks/useDashboardColors';
import { SubSectoresTable } from '@components/molecules/SubSectoresTable';

function Dashboard() {
  const currentDate = getCurrentDate();
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState(95); // Venezuela por defecto
  const [cantSubSector, setCantSubSector] = useState(null);
  const [cantEmpresasAnualidad, setCantEmpresasAnualidad] = useState(null);
  const [anioEmpresas, setAnioEmpresas] = useState(new Date().getFullYear());
  const [anioEventos, setAnioEventos] = useState(new Date().getFullYear());
  // const [cantEventosAnualidad, setCantEventosAnualidad] = useState(null); // Eliminado porque no se usa
  const [eventosByEmpresasRanks, setEventosByEmpresasRanks] = useState([]);
  // Estado para la actividad económica seleccionada
  const [selectedActividadId, setSelectedActividadId] = useState(null);
  // Estado para el sector económico seleccionado
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  // Estado para recordar la última actividad seleccionada
  const [lastActividadId, setLastActividadId] = useState(null);


  // Hook para colores y degradados
  const {
    ACTIVIDAD_COLORS,
    sectoresPalette,
    subSectoresPalette
  } = useDashboardColors(cantSubSector, selectedActividadId, selectedSectorId);

  // Seleccionar automáticamente el primer sector económico solo si cambia la actividad
  useEffect(() => {
    if (
      cantSubSector &&
      Array.isArray(cantSubSector.sectoresEconomicos) &&
      selectedActividadId &&
      selectedActividadId !== lastActividadId
    ) {
      const sectoresFiltrados = cantSubSector.sectoresEconomicos.filter(
        item => item.id_actividad_economica_sector === selectedActividadId
      );
      if (sectoresFiltrados.length > 0) {
        setSelectedSectorId(sectoresFiltrados[0].id_sector_productivo);
      } else {
        setSelectedSectorId(null);
      }
      setLastActividadId(selectedActividadId);
    }
    if (!selectedActividadId && lastActividadId !== null) {
      setSelectedSectorId(null);
      setLastActividadId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActividadId, cantSubSector]);

  // Datos principales del dashboard
  const { firstApiData, secondApiData, loading } = useDashboardData(selectedPais);

  // Cargar países al montar
  useEffect(() => {
    const loadPaises = async () => {
      try {
        const paisesData = await fetchPaises();
        setPaises(paisesData);
      } catch {
        // Error silenciado
      }
    };
    loadPaises();
  }, []);

  // Cargar datos de subsectores, empresas y eventos por anualidad, y ranking de participación
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subSector, empresasAnualidad, , ranking] = await Promise.all([
          getCantSubSectorProductivo(),
          getCantEmpresasAnualidad(anioEmpresas),
          getCantEventosAnualidad(anioEventos),
          getRankParticipacionEventos(anioEventos)
        ]);
        setCantSubSector(subSector);
        setCantEmpresasAnualidad(empresasAnualidad);
        if (ranking && Array.isArray(ranking.eventosByEmpresasRanks)) {
          setEventosByEmpresasRanks(ranking.eventosByEmpresasRanks);
        } else {
          setEventosByEmpresasRanks([]);
        }
      } catch {
        setEventosByEmpresasRanks([]);
      }
    };
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anioEventos]);



  // Años disponibles para el selector de anualidad (últimos 6 años)
  const aniosDisponibles = useMemo(() => {
    const actual = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => actual - i);
  }, []);

  // Maneja el cambio de país
  const handleSelectPais = (value) => {
    setSelectedPais(value);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <AtomsPanel title={'Dashboard'} subtitle={'Graficos del sistema'} />
      <div className="flex flex-1 flex-col gap-8 mt-4">
        {/* Indicadores de empresas */}
        <section className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Indicadores de empresas</h2>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 items-stretch">
            <div className="col-span-1 h-full">
              <MoleculesEmpresasCard
                currentDate={currentDate}
                paises={paises}
                selectedPais={selectedPais}
                onSelectPais={handleSelectPais}
                firstApiData={firstApiData}
                secondApiData={secondApiData}
                aria-label="Tarjeta de empresas"
              />
            </div>
            <div className="col-span-1 md:col-span-2 h-full flex flex-col gap-4">
              {/* Empresas por anualidad (Barra) */}
              {cantEmpresasAnualidad && Array.isArray(cantEmpresasAnualidad.empresasAnuals) && (
                <MoleculesEmpresasBarChart
                  data={cantEmpresasAnualidad.empresasAnuals.map(ev => ({
                    mes: ev.mes,
                    empresas: Number(ev.cantidad_empresa)
                  }))}
                  anio={String(anioEmpresas)}
                  onChangeAnio={(anio) => {
                    setAnioEmpresas(anio);
                    getCantEmpresasAnualidad(anio).then(setCantEmpresasAnualidad);
                  }}
                  aniosDisponibles={aniosDisponibles}
                  title="Empresas por Mes"
                  description="Total de empresas registradas por mes en el año seleccionado"
                  aria-label="Gráfico de empresas por mes"
                />
              )}
            </div>
          </div>
        </section>

        {/* Segmentación de Actividades Económicas */}
        <section className='bg-gray-50 p-4 rounded-lg shadow'>
          <h2 className="text-lg font-semibold mb-2">Indicadores de Actividades Económicas</h2>
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="col-span-1">
              {cantSubSector && Array.isArray(cantSubSector.actividadesEconomicas) && (
                <MoleculesChartPie
                  data={mapPieData(cantSubSector.actividadesEconomicas, {
                    labelKey: 'actividad_economica',
                    valueKey: 'total',
                    extra: item => ({ id_actividad_economica: item.id_actividad_economica }),
                    filter: item => !!item.actividad_economica
                  })}
                  config={pieConfig(cantSubSector.actividadesEconomicas, {
                    labelKey: 'actividad_economica',
                    filter: item => !!item.actividad_economica
                  })}
                  title="Actividades Economicas"
                  description="Distribución por actividad economica"
                  labelTotal="Total de Empresas"
                  aria-label="Gráfico de actividades economicas"
                  showMoreThreshold={10}
                  showMoreCount={15}
                  // Asignar colores únicos a cada actividad
                  colors={ACTIVIDAD_COLORS}
                  assignColors={(data, colors) => data.map((d, i) => ({ ...d, fill: colors[i % colors.length] }))}
                  onSelect={item => {
                    if (item && item.id_actividad_economica !== selectedActividadId) {
                      setSelectedActividadId(item.id_actividad_economica);
                    }
                  }}
                  renderSelected={(selected, item, total) => (
                    <DefaultPieSelected selected={selected} item={item} total={total} labelTotal="Total de Empresas" />
                  )}
                />
              )}
            </div>
            <div className="col-span-1">
              {cantSubSector && Array.isArray(cantSubSector.sectoresEconomicos) && (
                <MoleculesChartPie
                  data={mapPieData(cantSubSector.sectoresEconomicos, {
                    labelKey: 'sector_productivo',
                    valueKey: 'total',
                    extra: item => ({
                      id_actividad_economica_sector: item.id_actividad_economica_sector,
                      id_sector_economico: item.id_sector_economico,
                      id_sector_productivo: item.id_sector_productivo
                    }),
                    filter: item => item.sector_productivo && (!selectedActividadId || item.id_actividad_economica_sector === selectedActividadId)
                  })}
                  config={pieConfig(cantSubSector.sectoresEconomicos, {
                    labelKey: 'sector_productivo',
                    filter: item => item.sector_productivo && (!selectedActividadId || item.id_actividad_economica_sector === selectedActividadId)
                  })}
                  title="Sectores Economicos"
                  description="Distribución por sector productivo"
                  labelTotal="Total de Empresas"
                  aria-label="Gráfico de sectores productivos"
                  showMoreThreshold={10}
                  showMoreCount={15}
                  // Asignar degradados monocromáticos según la actividad seleccionada
                  colors={sectoresPalette}
                  assignColors={(data, colors) => data.map((d, i) => ({ ...d, fill: colors[i % colors.length] }))}
                  onSelect={item => {
                    if (item && item.id_sector_productivo !== selectedSectorId) {
                      setSelectedSectorId(item.id_sector_productivo);
                    }
                  }}
                  renderSelected={(selected, item, total) => (
                    <DefaultPieSelected selected={selected} item={item} total={total} labelTotal="Total de Empresas" />
                  )}
                />
              )}
            </div>
            <div className="col-span-2">
              {cantSubSector && Array.isArray(cantSubSector.subSectoresEconomicos) && selectedSectorId && (
                (() => {
                  const subSectoresData = mapPieData(cantSubSector.subSectoresEconomicos, {
                    labelKey: 'sub_sector_productivo',
                    valueKey: 'total',
                    extra: item => ({
                      id_actividad_economica_sub_sector: item.id_actividad_economica_sub_sector,
                      id_sector_productivo_sub: item.id_sector_productivo_sub
                    }),
                    filter: item => item.sub_sector_productivo && selectedActividadId && item.id_sector_productivo_sub === selectedSectorId
                  });
                  return (
                    <MoleculesChartPie
                      data={subSectoresData}
                      config={pieConfig(cantSubSector.subSectoresEconomicos, {
                        labelKey: 'sub_sector_productivo',
                        filter: item => item.sub_sector_productivo && selectedActividadId && item.id_actividad_economica_sub_sector === selectedActividadId && item.id_sector_productivo_sub === selectedSectorId
                      })}
                      title="Sub Sectores Productivos"
                      description="Distribución por sub sector productivo"
                      labelTotal="Total de Empresas"
                      aria-label="Gráfico de subsectores productivos"
                      showMoreThreshold={10}
                      showMoreCount={15}
                      // Asignar degradados monocromáticos según el sector seleccionado
                      colors={subSectoresPalette}
                      assignColors={(data, colors) => data.map((d, i) => ({ ...d, fill: colors[i % colors.length] }))}
                      renderSelected={(selected, item, total) => (
                        <DefaultPieSelected selected={selected} item={item} total={total} labelTotal="Total de Empresas" />
                      )}
                    />
                  );
                })()
              )}
            </div>
            {/* Tabla de subsectores productivos fuera del gráfico */}
            {cantSubSector && Array.isArray(cantSubSector.subSectoresEconomicos) && selectedSectorId && (() => {
              const subSectoresData = mapPieData(cantSubSector.subSectoresEconomicos, {
                labelKey: 'sub_sector_productivo',
                valueKey: 'total',
                extra: item => ({
                  sub_sector_productivo: item.sub_sector_productivo,
                  total: item.total,
                  id_actividad_economica_sub_sector: item.id_actividad_economica_sub_sector,
                  id_sector_productivo_sub: item.id_sector_productivo_sub
                }),
                filter: item => item.sub_sector_productivo && selectedActividadId && item.id_sector_productivo_sub === selectedSectorId
              });
              // Asignar los mismos colores que el gráfico
              const subSectoresDataWithColors = subSectoresData.map((d, i) => ({
                ...d,
                fill: subSectoresPalette[i % subSectoresPalette.length]
              }));
              return (
                <div className="col-span-2">
                  <SubSectoresTable data={subSectoresDataWithColors} />
                </div>
              );
            })()}
          </div>
        </section>

        {/* Eventos */}
        <section className='bg-gray-50 p-4 rounded-lg'>
          <h2 className="text-lg font-semibold mb-2">Indicadores de Eventos</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4 mb-2">
              <label htmlFor="anioEventos" className="font-medium">Año:</label>
              <select
                id="anioEventos"
                value={anioEventos}
                onChange={e => setAnioEventos(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {aniosDisponibles.map(anio => (
                  <option key={anio} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="col-span-1">
                <MoleculesChartBarMultiple
                  data={eventosByEmpresasRanks}
                  title="Participación en Eventos"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  );
}

Dashboard.propTypes = {};

export default Dashboard;