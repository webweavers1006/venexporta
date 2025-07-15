import { Suspense, lazy, useEffect, useState } from 'react';
import appStore from '@src/store/appStore';
import useAuthStore from '@src/store/authStore';
import { Spin } from 'antd';
import logo from '@assets/logo/isologoA.png';
import { fetchCompanyData, fetchRequestedAppointments } from '@src/lib/api/apiUser';
import { excludedPaths } from '@lib/data/routesRequisitos';
import { Calendar } from "lucide-react";

const RequisitosModal = lazy(() => import('@components/requisitosModal'));
const AtomsBanner = lazy(() => import('@components/atoms/AtomsBanner'));
const RoutesApp = lazy(() => import('@routes/RoutesApp'));

function App() {
  const { idUser } = useAuthStore();
  const { idCompany, setCompany } = appStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCompanyDataAsync = async () => {
      if (idUser && !idCompany) {
        try {
          const data = await fetchCompanyData(idUser);
          setCompany(data.id, data.empresa, data.id_pais);
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      }
      setIsLoading(false);
    };
    fetchCompanyDataAsync();
  }, [idUser, idCompany, setCompany]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (idCompany) {
        try {
          const citas = await fetchRequestedAppointments(idCompany, 2);
          // Filtrar solo las citas con estatus "EN REVISION"
          const citasEnRevision = (citas || []).filter(cita => cita.estatus === "EN REVISION");
          if (citasEnRevision.length > 0) {
            setPendingCount(citasEnRevision.length);
            setShowMessage(true);
          } else {
            setShowMessage(false);
          }
        } catch (error) {
          setShowMessage(false);
        }
      }
    };
    if (!isLoading && idCompany) {
      fetchAppointments();
    }
  }, [isLoading, idCompany]);

  if (isLoading) {
    return <Spin indicator={<img src={logo}/>} size="large" tip={<p className='text-primary font-bold italic font-sans'>Venexporta</p>} fullscreen/>;
  }

  return (
    <Suspense fallback={null}>
      <RequisitosModal excludedPaths={excludedPaths} />
      {showMessage && (
        <AtomsBanner
          updateLabel="Citas sin responder"
          number={pendingCount}
          Icon={Calendar}
          link="/appointmentsReceived"
        />
      )}
      <RoutesApp />
    </Suspense>
  );
}

export default App;