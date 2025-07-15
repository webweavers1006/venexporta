
import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import { getCurrentDate, transformData } from '@lib/utils';
import { fetchUserEstadis, fetchPaises } from '@src/lib/api/apiUser';
import { fetchCompanyEstadis, getCantSubSectorProductivo, getCantEmpresasAnualidad } from '@src/lib/api/dashboard/dashboard';
import MoleculesEmpresasCard from "@components/molecules/MoleculesEmpresasCard/MoleculesEmpresasCard";
import MoleculesChartPieSubSector from "@components/molecules/charts/MoleculesChartPieSubSector";
import MoleculesChartAreaEmpresasAnualidad  from "@components/molecules/charts/MoleculesChartAreaEmpresasAnualidad";
const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));

const Loading = () => <div>Loading...</div>;

// Hook personalizado para cargar datos principales del dashboard
function useDashboardData(selectedPais) {
  const [firstApiData, setFirstApiData] = useState(null);
  const [secondApiData, setSecondApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstData = await fetchCompanyEstadis(selectedPais);
        const transformedFirstData = transformData(firstData, 'empresas_registradas', 'var(--color-safari)');
        setFirstApiData(transformedFirstData);
        const secondData = await fetchUserEstadis();
        const transformedSecondData = transformData(secondData, 'cantidad_usuarios', 'var(--color-chrome)');
        setSecondApiData(transformedSecondData);
      } catch {
        // Error silenciado
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPais]);

  return { firstApiData, secondApiData, loading, setFirstApiData };
}


/**
 * Componente principal del Dashboard de administración.
 * Muestra gráficos y estadísticas de empresas, usuarios y sectores productivos.
 */

const Dashboard = () => {
  const currentDate = getCurrentDate();
  const [paises, setPaises] = useState([]);
  const [selectedPais, setSelectedPais] = useState(95); // Venezuela por defecto
  const [cantSubSector, setCantSubSector] = useState(null);
  const [cantEmpresasAnualidad, setCantEmpresasAnualidad] = useState(null);
  const [anioEmpresas, setAnioEmpresas] = useState(new Date().getFullYear());

  // Hook para datos principales
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

  // Cargar datos de subsectores y empresas por anualidad
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subSector, empresasAnualidad] = await Promise.all([
          getCantSubSectorProductivo(),
          getCantEmpresasAnualidad(new Date().getFullYear())
        ]);
        setCantSubSector(subSector);
        setCantEmpresasAnualidad(empresasAnualidad);
      } catch {
        // Error silenciado
      }
    };
    fetchDashboardData();
  }, []);

  // Años disponibles para el selector de anualidad (últimos 6 años)
  const aniosDisponibles = useMemo(() => {
    const actual = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => actual - i);
  }, []);

  // Maneja el cambio de país
  const handleSelectPais = async (value) => {
    setSelectedPais(value);
    // Si quieres recargar empresas solo al cambiar país, puedes hacerlo aquí si es necesario
    // const firstData = await fetchCompanyEstadis(value);
    // const transformedFirstData = transformData(firstData, 'empresas_registradas', 'var(--color-safari)');
    // setFirstApiData(transformedFirstData);
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
            />
          </div>
          <div className="col-span-1 md:col-span-2 h-full">
            {cantEmpresasAnualidad && Array.isArray(cantEmpresasAnualidad.empresasAnuals) && (
              <MoleculesChartAreaEmpresasAnualidad
                data={cantEmpresasAnualidad.empresasAnuals}
                anio={String(anioEmpresas)}
                onChangeAnio={(anio) => {
                  setAnioEmpresas(anio);
                  getCantEmpresasAnualidad(anio).then(setCantEmpresasAnualidad);
                }}
                aniosDisponibles={aniosDisponibles}
              />
            )}
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="col-span-1">
            {cantSubSector && Array.isArray(cantSubSector.actividadesEconomicasByEmpresasCants) && (
              <MoleculesChartPieSubSector
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
              />
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Dashboard;