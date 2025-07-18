import { useEffect, useState } from 'react';
import { Modal, Badge, Button } from 'antd';
import { fetchRequisitos } from '@src/lib/api/apiIndex';
import ResultComponent from '@src/components/molecules/result/MoleculesResult';
import { useNavigate, useLocation } from 'react-router';
import useAuthStore from '@src/store/authStore';
import appStore from '@src/store/appStore'; // Importar appStore

const RequisitosModal = ({ excludedPaths }) => {
  const { idUser } = useAuthStore();
  const { idCompany } = appStore(); // Obtener idCompany desde appStore
  const [requisitos, setRequisitos] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    isModalVisible && (
      <Modal
        visible={isModalVisible}
        footer={null}
        closable={false}
      >
        <ResultComponent config={config} />
      </Modal>
    )
  );
};

export default RequisitosModal;