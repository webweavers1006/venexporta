import { useState, useEffect, useRef } from 'react';
import AtomsPanel from '@components/atoms/AtomsPanel';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { fetchEventos, fetchCompaniesByEventAll, updateEventRequestStatus } from '@src/lib/api/apiUser';
import CompaniesCarousel from "@src/components/organisms/companies/CompaniesCarousel";
import MoleculesList from "@components/molecules/MoleculesList";
import { Link } from 'react-router';
import { SquareX, SquareCheckBig } from "lucide-react";
import { Select, Input, Modal, message } from 'antd';

const EventRequests = () => {  
  // --- STORE ---
  const idCompany = useStore(appStore, state => state.idCompany);

  // --- STATE ---
  const [carouselItems, setCarouselItems] = useState([]);
  const [associatedCompanies, setAssociatedCompanies] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedSubSector, setSelectedSubSector] = useState(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedRif, setSelectedRif] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("EN REVISION");
  const listRef = useRef(null);

  // --- DATA LOADERS ---
  const loadEventsData = async () => {
    try {
      const data = await fetchEventos(idCompany);
      const formattedEvents = data.map((event) => ({
        id: event.id,
        url: event.img_evento || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        nombre: event.nombre_evento,
        descripcion: event.descripcion_evento || "Sin descripción",
      }));
      setCarouselItems(formattedEvents);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  };

  // --- EVENT HANDLERS ---
  const handleItemClick = async (eventId) => {
    try {
      const companies = await fetchCompaniesByEventAll(eventId);
      message.success(`Se cargaron ${companies.length} empresas para solicitudes del evento`);
      setAssociatedCompanies(companies);
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error al obtener las empresas del evento:', error);
    }
  };

  // --- FILTERS ---
  const filteredCompanies = associatedCompanies.filter((item) => {
    const matchesActivity = selectedActivity ? item.actividades.includes(selectedActivity) : true;
    const matchesSubSector = selectedSubSector ? item.sub_sectores.includes(selectedSubSector) : true;
    const matchesCode = selectedCode 
      ? item.codigos?.filter(code => code !== null).some(code => code.includes(selectedCode)) 
      : true;
    const matchesRif = selectedRif ? item.rif?.includes(selectedRif) : true;
    const matchesStatus = selectedStatus ? item.estatus === selectedStatus : true;
    return matchesActivity && matchesSubSector && matchesCode && matchesRif && matchesStatus;
  });

  const handleFilterChange = (type, value) => {
    if (type === 'activity') setSelectedActivity(value);
    if (type === 'subSector') setSelectedSubSector(value);
    if (type === 'code') setSelectedCode(value);
    if (type === 'rif') setSelectedRif(value);
    if (type === 'status') setSelectedStatus(value);
  };

  // --- ACTIONS ---
  const handleAppointmentAction = async (id, id_estatus) => {
    try {
      await updateEventRequestStatus(id, id_estatus);
      setAssociatedCompanies(prev => prev.map(item => item.id === id ? { ...item, estatus: id_estatus === 1 ? 'ACEPTADO' : 'RECHAZADO' } : item));
      if (id_estatus === 1) {
        message.success('Solicitud aceptada en el evento correctamente');
      } else if (id_estatus === 2) {
        message.success('Solicitud rechazada correctamente');
      }
    } catch  (error){
      message.error(error.response.data.error.message);
    }
  };

  const handleActionClick = (actionType, item) => {
    const actionText = actionType === 'reject' ? 'rechazar' : 'aceptar';
    Modal.confirm({
      title: `¿Está seguro que desea ${actionText} esta solicitud?`,
      content: `Esta acción no se puede deshacer.`,
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        if (actionType === 'reject') {
          handleAppointmentAction(item.id, 2);
        } else if (actionType === 'accept') {
          handleAppointmentAction(item.id, 1);
        }
      },
    });
  };

  // --- EFFECTS ---
  useEffect(() => {
    loadEventsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCompany]);

  // --- RENDER ---
  return (
    <>
      <AtomsPanel title={'Solicitudes de Eventos'} subtitle={'Informacion sobre las solicitudes de eventos'} />
      <div className='p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4'>
        <CompaniesCarousel items={carouselItems} onItemClick={handleItemClick} />
      </div>
      <div ref={listRef}>
        <MoleculesList
          data={filteredCompanies}
          filtersComponent={
            <>
              <Input
                placeholder="Filtrar por RIF"
                value={selectedRif}
                onChange={(e) => handleFilterChange('rif', e.target.value)}
                allowClear
                className="w-full"
              />
              <Select
                placeholder="Filtrar por Estatus"
                value={selectedStatus}
                onChange={(value) => handleFilterChange('status', value)}
                allowClear
                options={[...new Set(associatedCompanies.map(item => item.estatus))].map(status => ({ value: status, label: status }))}
                className="w-full"
              />
              <Select
                placeholder="Filtrar por Actividad"
                onChange={(value) => handleFilterChange('activity', value)}
                allowClear
                options={[...new Set(associatedCompanies.flatMap(item => item.actividades))].map(activity => ({ value: activity, label: activity }))}
                className="w-full"
              />
              <Select
                placeholder="Filtrar por Sub sector"
                onChange={(value) => handleFilterChange('subSector', value)}
                allowClear
                options={[...new Set(associatedCompanies.flatMap(item => item.sub_sectores))].map(subSector => ({ value: subSector, label: subSector }))}
                className="w-full"
              />
              <Input
                placeholder="Filtrar por Código"
                value={selectedCode}
                onChange={(e) => handleFilterChange('code', e.target.value)}
                allowClear
                className="w-full"
              />
            </>
          }
          onActionClick={handleActionClick}
          renderItemExtra={(item) => (
            <img
              width={272}
              className='mask mask-squircle size-25'
              alt="logo"
              src={item.img_empresa || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
            />
          )}
          renderItemMeta={(item) => ({
            avatar: (
              <img
                width={272}
                className='mask mask-squircle size-15'
                alt="logo"
                src={item.img_evento || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
              />
            ),
            title: (
              <Link to={`/roundtable/companies/${item.id_empresa}/${item.id_evento}/false`}>
                {item.nombre_empresa}
              </Link>
            ),
            description: (                  
                  <>
                  <p>Evento: {item.nombre_evento}</p>
                  <p>Numero de identificacion fiscal: {item.rif}</p>
                  <p>estatus: {item.estatus}</p>
                  <p>cantidad de productos: {item.productos}</p>
                  </>)
          })}
          actions={[
            {
              type: 'reject',
              label: 'Rechazar',
              icon: <SquareX />,
              className: "bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75",
            },
            {
              type: 'accept',
              label: 'Aceptar',
              icon: <SquareCheckBig />,
              className: "bg-green/50 text-primary hover:bg-green/80",
            },
          ]}
        />
      </div>
    </>
  );
};

export default EventRequests;