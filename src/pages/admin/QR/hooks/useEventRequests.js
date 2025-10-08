/**
 * Hook personalizado para manejar la lógica de solicitudes de eventos.
 * Extrae la lógica de carga de eventos, filtrado y acciones sobre las solicitudes.
 * @module useEventRequests
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { message, Modal } from 'antd';
import { fetchEventos, fetchCompaniesByEventAll, updateEventRequestStatus } from '@src/lib/api/apiIndex';
import { QR_BASE_URL } from '@lib/api/variables';
import appStore from '@store/appStore';
import { useStore } from 'zustand';

/**
 * Hook para manejar la lógica de solicitudes de eventos y empresas asociadas.
 * @returns {Object} Estado y handlers para EventRequests
 */
export function useEventRequests() {
  // --- STORE ---
  const idCompany = useStore(appStore, state => state.idCompany);

  // --- STATE ---
  const [carouselItems, setCarouselItems] = useState([]);
  const [associatedCompanies, setAssociatedCompanies] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedSubSector, setSelectedSubSector] = useState(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedRif, setSelectedRif] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ACEPTADO");
  const listRef = useRef(null);

  // --- DATA LOADERS ---
  const loadEventsData = useCallback(async () => {
    try {
      const data = await fetchEventos(idCompany);
      const formattedEvents = data.map((event) => ({
        id: event.id,
  url: event.img_evento || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
  nombre: event.nombre_evento,
  // mantener también los campos originales por si se requieren
  img_evento: event.img_evento,
  nombre_evento: event.nombre_evento,
        descripcion: event.descripcion_evento || "Sin descripción",
      }));
      setCarouselItems(formattedEvents);
    } catch (error) {
      console.error('loadEventsData error:', error);
      message.error('Error al cargar los eventos.');
    }
  }, [idCompany]);

  // --- EVENT HANDLERS ---
  const handleItemClick = useCallback(async (eventId) => {
    try {
      const companies = await fetchCompaniesByEventAll(eventId);
      message.success(`Se cargaron ${companies.length} empresas para solicitudes del evento`);
      setAssociatedCompanies(companies);
  setSelectedEventId(eventId);
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('handleItemClick error:', error);
      message.error('Error al obtener las empresas del evento.');
    }
  }, []);

  // --- FILTERS ---
  const filteredCompanies = useMemo(() => {
    const list = associatedCompanies.filter((item) => {
      const matchesActivity = selectedActivity ? item.actividades?.includes?.(selectedActivity) : true;
      const matchesSubSector = selectedSubSector ? item.sub_sectores?.includes?.(selectedSubSector) : true;
      const matchesCode = selectedCode
        ? item.codigos?.filter((code) => code !== null).some((code) => String(code).includes(selectedCode))
        : true;
      const matchesRif = selectedRif ? String(item.rif || '').includes(selectedRif) : true;
      const matchesStatus = selectedStatus ? item.estatus === selectedStatus : true;
      return matchesActivity && matchesSubSector && matchesCode && matchesRif && matchesStatus;
    });

    // Mapear al formato requerido para QR/consumo UI
    return list.map((item) => {
      const idEmpresa = item.id_empresa ?? item.empresa_id ?? item.idEmpresa ?? item.id;
      const idEvento = item.id_evento ?? item.evento_id ?? selectedEventId;
      const label = item.nombre_empresa ?? item.razon_social ?? item.nombre ?? item.empresa ?? item.rif ?? 'Empresa';
      const rawLogo = item.img_empresa || item.logo || item.img || item.logoSrc;
      const logoSrc = rawLogo && String(rawLogo).trim()
        ? rawLogo
        : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
      const value = `${QR_BASE_URL}/roundtable/companies/${idEmpresa}/${idEvento}/true`;
      return { value, label, logoSrc };
    });
  }, [associatedCompanies, selectedActivity, selectedSubSector, selectedCode, selectedRif, selectedStatus, selectedEventId]);

  // Evento seleccionado (para título/imagen en PDF)
  const selectedEvent = useMemo(() => {
    return carouselItems.find(ev => ev.id === selectedEventId) || null;
  }, [carouselItems, selectedEventId]);

  const selectedEventName = selectedEvent?.nombre_evento || selectedEvent?.nombre || null;
  const selectedEventImage = selectedEvent?.img_evento || selectedEvent?.url || null;

  const handleFilterChange = useCallback((type, value) => {
    if (type === 'activity') setSelectedActivity(value);
    if (type === 'subSector') setSelectedSubSector(value);
    if (type === 'code') setSelectedCode(value);
    if (type === 'rif') setSelectedRif(value);
    if (type === 'status') setSelectedStatus(value);
  }, []);

  // --- ACTIONS ---
  const handleAppointmentAction = useCallback(async (id, id_estatus) => {
    try {
      await updateEventRequestStatus(id, id_estatus);
      setAssociatedCompanies(prev => prev.map(item => item.id === id ? { ...item, estatus: id_estatus === 1 ? 'ACEPTADO' : 'RECHAZADO' } : item));
      if (id_estatus === 1) {
        message.success('Solicitud aceptada en el evento correctamente');
      } else if (id_estatus === 2) {
        message.success('Solicitud rechazada correctamente');
      }
    } catch  (error){
      message.error(error?.response?.data?.error?.message || 'Error al actualizar el estatus.');
    }
  }, []);

  const handleActionClick = useCallback((actionType, item) => {
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
  }, [handleAppointmentAction]);

  // --- EFFECTS ---
  useEffect(() => {
    loadEventsData();
  }, [loadEventsData]);

  return {
    carouselItems,
    associatedCompanies,
    filteredCompanies,
    selectedActivity,
    selectedSubSector,
    selectedCode,
    selectedRif,
    selectedStatus,
    listRef,
    handleItemClick,
    handleFilterChange,
    handleActionClick,
    setAssociatedCompanies,
    selectedEventName,
    selectedEventImage,
  };
}
