

import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import { getCurrentDate } from '@lib/utils';
import { fetchPaises } from '@src/lib/api/apiUser';
import { getCantSubSectorProductivo, getCantEmpresasAnualidad, getCantEventosAnualidad, getRankParticipacionEventos } from '@src/lib/api/dashboard/dashboard';
import MoleculesEmpresasCard from '@components/molecules/MoleculesEmpresasCard/MoleculesEmpresasCard';
import { useDashboardData } from './hooks/useDashboardData';
const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));
const MoleculesChartPie = lazy(() => import('@components/molecules/charts/MoleculesChartPie'));
const ChartAreaMeses = lazy(() => import('@components/molecules/charts/MoleculesChartAreaMeses'));


/**
 * Loader de estado para el dashboard.
 * @returns {JSX.Element}
 */
const Loading = () => <div role="status" aria-label="Cargando dashboard">Loading...</div>;



/**
 * Dashboard de administración
 *
 * Muestra gráficos y estadísticas de empresas, usuarios y sectores productivos.
 *
 * @component
 * @example
 * <Dashboard />
 */
function Dashboard() {
  const currentDate = getCurrentDate();
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState(95); // Venezuela por defecto
  const [cantSubSector, setCantSubSector] = useState(null);
  const [cantEmpresasAnualidad, setCantEmpresasAnualidad] = useState(null);
  const [anioEmpresas, setAnioEmpresas] = useState(new Date().getFullYear());
  const [anioEventos, setAnioEventos] = useState(new Date().getFullYear());
  const [cantEventosAnualidad, setCantEventosAnualidad] = useState(null);
  const [eventosByEmpresasRanks, setEventosByEmpresasRanks] = useState([]);

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
        const [subSector, empresasAnualidad, eventosAnualidad, ranking] = await Promise.all([
          getCantSubSectorProductivo(),
          getCantEmpresasAnualidad(anioEmpresas),
          getCantEventosAnualidad(anioEventos),
          getRankParticipacionEventos()
        ]);
        setCantSubSector(subSector);
        setCantEmpresasAnualidad(empresasAnualidad);
        setCantEventosAnualidad(eventosAnualidad);
        if (ranking && Array.isArray(ranking.eventosByEmpresasRanks)) {
          setEventosByEmpresasRanks(ranking.eventosByEmpresasRanks);
        }
      } catch {
        // Error silenciado
      }
    };
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar eventos por anualidad al cambiar año
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventos = await getCantEventosAnualidad(anioEventos);
        setCantEventosAnualidad(eventos);
      } catch {
        // Error silenciado
      }
    };
    fetchEventos();
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
      <div className="flex flex-1 flex-col gap-4 mt-4">
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
            {/* Eventos por anualidad (gráfico de área) */}
            {cantEventosAnualidad && Array.isArray(cantEventosAnualidad.eventosAnuals) && (
              <ChartAreaMeses
                data={cantEventosAnualidad.eventosAnuals.map(ev => ({
                  mes: ev.mes,
                  eventos: Number(ev.cantidad_eventos)
                }))}
                anio={String(anioEventos)}
                onChangeAnio={(anio) => {
                  setAnioEventos(anio);
                }}
                aniosDisponibles={aniosDisponibles}
                label="Eventos"
                valueKey="eventos"
                xKey="mes"
                color="var(--green)"
                title="Eventos por Mes"
                description="Total de eventos realizados por mes en el año seleccionado"
                aria-label="Gráfico de eventos por mes"
              />
            )}
          </div>
          <div className="col-span-1 md:col-span-3 h-full flex flex-col gap-4">
            {/* Empresas por anualidad */}
            {cantEmpresasAnualidad && Array.isArray(cantEmpresasAnualidad.empresasAnuals) && (
              <ChartAreaMeses
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
                label="Empresas"
                valueKey="empresas"
                xKey="mes"
                color="var(--primary)"
                title="Empresas por Mes"
                description="Total de empresas registradas por mes en el año seleccionado"
                aria-label="Gráfico de empresas por mes"
              />
            )}
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="col-span-1">
            {cantSubSector && Array.isArray(cantSubSector.actividadesEconomicasByEmpresasCants) && (
              <MoleculesChartPie
                data={cantSubSector.actividadesEconomicasByEmpresasCants.filter(item => item.sub_sector_productivo).map(item => ({
                  label: item.sub_sector_productivo,
                  value: item.total,
                  fill: item.color || undefined
                }))}
                config={cantSubSector.actividadesEconomicasByEmpresasCants.filter(item => item.sub_sector_productivo).reduce((acc, item) => {
                  acc[item.sub_sector_productivo] = {
                    label: item.sub_sector_productivo,
                    color: item.color || undefined
                  };
                  return acc;
                }, {})}
                title="Sub Sectores Productivos"
                description="Distribución por sub sector productivo"
                aria-label="Gráfico de subsectores productivos"
                showMoreThreshold={10}
                showMoreCount={15}
              />
            )}
          </div>
          {/* Ranking de participación en eventos (gráfico de pastel) */}
          <div className="col-span-1">
            <MoleculesChartPie
              data={eventosByEmpresasRanks?.map(ev => ({
                label: ev.evento,
                value: Number(ev.participantes_por_eventos),
                fill: undefined
              }))}
              config={eventosByEmpresasRanks?.reduce((acc, ev) => {
                acc[ev.evento] = {
                  label: ev.evento,
                  color: undefined
                };
                return acc;
              }, {})}
              title="Ranking de participación en eventos"
              description="Eventos con mayor número de participantes"
              aria-label="Gráfico de ranking de participación en eventos"
              showMoreThreshold={10}
              showMoreCount={15}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
}

Dashboard.propTypes = {};

export default Dashboard;