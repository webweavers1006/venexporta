/**
 * Hook personalizado para la lógica de eventos y citas en SchedulesEvents.
 * Separa la carga de datos, manejo de filtros y estados derivados.
 * @module useSchedulesEvents
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { fetchEventos } from '@src/lib/api/apiIndex';
import {fetchCitasByEvento, fetchScheduleBlocks} from '@src/lib/api/schedules/schedules';
import { getEstatusColors } from '@src/lib/data/estatusColors';

/**
 * Hook para manejar la lógica de eventos y citas en la página de SchedulesEvents.
 * @param {string} idCompany - ID de la compañía actual.
 * @returns {object} Estados, handlers y datos derivados para el componente SchedulesEvents.
 */
export default function useSchedulesEvents(idCompany) {
  const [carouselItems, setCarouselItems] = useState([]);
  const [groupedCitas, setGroupedCitas] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterNombre, setFilterNombre] = useState('');
  const [filterPais, setFilterPais] = useState('');
  const [scheduleBlocks, setScheduleBlocks] = useState({});
  const [filterHorario, setFilterHorario] = useState('');
  const [filterEstatus, setFilterEstatus] = useState('');
  const [filterRif, setFilterRif] = useState('');
  const pageSize = 5;
  const listRef = useRef(null);

  // Carga de eventos
  const loadEventsData = useCallback(async () => {
    try {
      const data = await fetchEventos(idCompany);
      const formattedEvents = data.map((event) => ({
        id: event.id,
        url: event.img_evento || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
        nombre: event.nombre_evento,
        descripcion: event.descripcion_evento || 'Sin descripción',
      }));
      setCarouselItems(formattedEvents);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  }, [idCompany]);

  // Manejo de click en evento
  const handleItemClick = useCallback(async (eventId) => {
    try {
      const citasObj = await fetchCitasByEvento(eventId);
      message.success('Se cargaron las citas de los eventos');
      setGroupedCitas(citasObj);
      try {
        const blocks = await fetchScheduleBlocks(eventId, idCompany, 'all');
        setScheduleBlocks(blocks);
      } catch {
        setScheduleBlocks({});
      }
      const fechas = Object.keys(citasObj);
      setSelectedDate(fechas[0] || '');
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error al obtener las citas del evento:', error);
    }
  }, [idCompany]);

  // Filtros
  const getFilteredCitas = useCallback((citas) => {
    return citas.filter(item => {
      const nombreMatch =
        filterNombre.trim() === '' ||
        (item.empresa_receptora && item.empresa_receptora.toLowerCase().includes(filterNombre.toLowerCase())) ||
        (item.empresa_solicitante && item.empresa_solicitante.toLowerCase().includes(filterNombre.toLowerCase()));
      const paisMatch =
        !filterPais ||
        (item.pais_empresa_receptora && item.pais_empresa_receptora === filterPais);
      const horarioMatch =
        !filterHorario ||
        (item.fecha_solicitada && item.fecha_solicitada.split(' ')[1] === filterHorario);
      const estatusMatch =
        !filterEstatus ||
        (item.estatus && item.estatus === filterEstatus);
      const rifMatch =
        filterRif.trim() === '' ||
        (item.rif_solicitante && item.rif_solicitante.toLowerCase().includes(filterRif.toLowerCase())) ||
        (item.rif_receptora && item.rif_receptora.toLowerCase().includes(filterRif.toLowerCase()));
      return nombreMatch && paisMatch && horarioMatch && estatusMatch && rifMatch;
    });
  }, [filterNombre, filterPais, filterHorario, filterEstatus, filterRif]);

  // Datos derivados
  const horariosFromBlocks = useMemo(() => {
    const horariosSet = new Set();
    Object.values(scheduleBlocks).forEach(blocksArr => {
      blocksArr.forEach(block => {
        if (block.fecha_hora) {
          const hora = block.fecha_hora.split(' ')[1];
          horariosSet.add(hora);
        }
      });
    });
    return Array.from(horariosSet);
  }, [scheduleBlocks]);

  const paisesFromCitas = useMemo(() => {
    const paisesSet = new Set();
    Object.values(groupedCitas).forEach(citasArr => {
      citasArr.forEach(item => {
        if (item.pais_empresa_receptora) {
          paisesSet.add(item.pais_empresa_receptora);
        }
      });
    });
    return Array.from(paisesSet);
  }, [groupedCitas]);

  const estatusFromCitas = useMemo(() => {
    const estatusSet = new Set();
    Object.values(groupedCitas).forEach(citasArr => {
      citasArr.forEach(item => {
        if (item.estatus) {
          estatusSet.add(item.estatus);
        }
      });
    });
    return Array.from(estatusSet);
  }, [groupedCitas]);

  const estatusColors = useMemo(() => getEstatusColors(estatusFromCitas), [estatusFromCitas]);

  const totalPorEstatus = useMemo(() => {
    const conteo = {};
    if (selectedDate && groupedCitas[selectedDate]) {
      const citasFiltradas = getFilteredCitas(groupedCitas[selectedDate]);
      citasFiltradas.forEach(item => {
        if (item.estatus) {
          conteo[item.estatus] = (conteo[item.estatus] || 0) + 1;
        }
      });
    }
    return conteo;
  }, [selectedDate, groupedCitas, getFilteredCitas]);

  useEffect(() => {
    loadEventsData();
  }, [loadEventsData]);

  return {
    carouselItems,
    groupedCitas,
    selectedDate,
    setSelectedDate,
    currentPage,
    setCurrentPage,
    filterNombre,
    setFilterNombre,
    filterPais,
    setFilterPais,
    scheduleBlocks,
    setScheduleBlocks,
    filterHorario,
    setFilterHorario,
    filterEstatus,
    setFilterEstatus,
    filterRif,
    setFilterRif,
    pageSize,
    listRef,
    loadEventsData,
    handleItemClick,
    getFilteredCitas,
    horariosFromBlocks,
    paisesFromCitas,
    estatusFromCitas,
    estatusColors,
    totalPorEstatus
  };
}
