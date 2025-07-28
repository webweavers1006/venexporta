

// import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
// import { getCurrentDate } from '@lib/utils';
// import { fetchPaises } from '@src/lib/api/apiIndex';
// import { getCantSubSectorProductivo, getCantEmpresasAnualidad, getCantEventosAnualidad, getRankParticipacionEventos } from '@src/lib/api/apiIndex';
// import MoleculesEmpresasCard from '@components/molecules/MoleculesEmpresasCard/MoleculesEmpresasCard';
// import { useDashboardData } from './hooks/useDashboardData';
// const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));
// const MoleculesChartPie = lazy(() => import('@components/molecules/charts/MoleculesChartPie'));
// const ChartAreaMeses = lazy(() => import('@components/molecules/charts/MoleculesChartAreaMeses'));


// /**
//  * Loader de estado para el dashboard.
//  * @returns {JSX.Element}
//  */
// const Loading = () => <div role="status" aria-label="Cargando dashboard">Loading...</div>;



// /**
//  * Dashboard de administración
//  *
//  * Muestra gráficos y estadísticas de empresas, usuarios y sectores productivos.
//  *
//  * @component
//  * @example
//  * <Dashboard />
//  */
// function Dashboard() {
//   ...existing code...
// }

// Dashboard.propTypes = {};

// export default Dashboard;

// COMPONENTE EN MANTENIMIENTO
function Dashboard() {
  return (
    <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#888' }}>
      Este módulo se encuentra en mantenimiento.
    </div>
  );
}

export default Dashboard;