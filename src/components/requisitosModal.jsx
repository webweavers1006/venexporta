import { useEffect, useState } from 'react';
import { Modal, Badge, Button } from 'antd';
import { fetchRequisitos } from '@src/lib/api/apiIndex';
import ResultComponent from '@src/components/molecules/result/MoleculesResult';
import OrganismsUpdateCompanyDialog from '@components/organisms/company/OrganismsUpdateCompanyDialog';
import { Dialog } from '@/components/ui/dialog';
import { useCompanyData } from '@src/pages/company/hooks/useCompanyData';
import { useNavigate, useLocation } from 'react-router';
import useAuthStore from '@src/store/authStore';
import appStore from '@src/store/appStore'; // Importar appStore

const RequisitosModal = ({ excludedPaths }) => {
  const { idUser } = useAuthStore();
  const { idCompany } = appStore(); // Obtener idCompany desde appStore
  const [requisitos, setRequisitos] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { companyData, reloadCompany } = useCompanyData(idUser, idCompany);

  useEffect(() => {
    const fetchRequisitosAsync = async () => {
      try {
        const requisitosData = await fetchRequisitos(idUser);
        setRequisitos(requisitosData);
        if (
          !excludedPaths.includes(location.pathname) &&
          requisitosData.length > 0 && // Verificar que el array no esté vacío
          requisitosData.some(item => !item.valor) // Mostrar modal si algún valor es false
        ) {
          setIsModalVisible(true);
        } else {
          setIsModalVisible(false);
        }
      } catch (error) {
        console.error('Error fetching requisitos:', error);
      }
    };

    if (idUser) {
      fetchRequisitosAsync();
    }
  }, [idUser, location.pathname]);

  useEffect(() => {
    if (excludedPaths.includes(location.pathname)) {
      setIsModalVisible(false); // Ocultar el modal si está en una ruta excluida
    }
  }, [location.pathname]);

  const config = {
    status: 'warning',
    title: 'Información Incompleta',
    subTitle: 'Por favor complete la siguiente información:',
    messages: [],
    links: [
      <Button
        type="primary"
        key="empresa"
        onClick={() => navigate(idCompany ? '/company' : '/company/register')} // Usar idCompany para la validación
      >
        Ir a {idCompany ? 'Empresa' : 'Registrar Empresa'}
      </Button>
    ]
  };

  if (requisitos) {
    requisitos.forEach((item, index) => {
      if (!item.valor) {
        config.messages.push(
          <Badge key={index} color="#f5222d" text={item.mensaje} />
        );
      }
    });
  }

  // Mostrar el diálogo de actualización solo si el requisito de ubicación está incompleto
  useEffect(() => {
    const ubicacionIncompleta = requisitos && requisitos.some(item => item.mensaje === 'Debe terminar de llenar la ubicacion de la empresa (Estado-Municipio-Parroquia)' && item.valor === false);
    if (ubicacionIncompleta) {
      setMessage('Debe terminar de completar la informacion de la empresa');
      setShowUpdateDialog(true);
      setIsModalVisible(false); // Cierra el modal de requisitos
    } else {
      setShowUpdateDialog(false);
    }
  }, [requisitos]);

  return (
    <>
      {isModalVisible && (
        <Modal
          visible={isModalVisible}
          footer={null}
          closable={false}
        >
          <ResultComponent config={config} />
        </Modal>
      )}
      {companyData && (
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <OrganismsUpdateCompanyDialog
            companyData={companyData}
            onClose={() => setShowUpdateDialog(false)}
            onUpdate={reloadCompany}
            message={message}
          />
        </Dialog>
      )}
    </>
  );
};

export default RequisitosModal;