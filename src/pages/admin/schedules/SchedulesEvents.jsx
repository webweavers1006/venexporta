// ===================== IMPORTS =====================
import { useState, useEffect, useRef } from 'react';
import AtomsPanel from '@components/atoms/AtomsPanel';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { fetchEventos, fetchCitasByEvento, fetchScheduleBlocks } from '@src/lib/api/apiUser';
import CompaniesCarousel from "@components/organisms/companies/OrganismsCompaniesCarousel";
import MoleculesSchedulesItems from "@components/molecules/MoleculesSchedulesItems";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { message, Pagination, Select, Input } from 'antd';
import { getEstatusColors } from "@src/lib/data/estatusColors";

// ===================== COMPONENT =====================
const SchedulesEvents = () => {
  // ========== STORE ==========
  const idCompany = useStore(appStore, state => state.idCompany);

  // ========== STATE ==========
  const [carouselItems, setCarouselItems] = useState([]);
  const [groupedCitas, setGroupedCitas] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterNombre, setFilterNombre] = useState("");
  const [filterPais, setFilterPais] = useState("");
  const [scheduleBlocks, setScheduleBlocks] = useState({});
  const [filterHorario, setFilterHorario] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("");
  const [filterRif, setFilterRif] = useState("");
  const pageSize = 5;
  const listRef = useRef(null);

  // ========== DATA LOADERS ==========
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

  // ========== EVENT HANDLERS ==========
  const handleItemClick = async (eventId) => {
    try {
      const citasObj = await fetchCitasByEvento(eventId);
      message.success(`Se cargaron las citas de los eventos`);
      setGroupedCitas(citasObj);
      try {
        const blocks = await fetchScheduleBlocks(eventId, idCompany, "all");
        setScheduleBlocks(blocks);
      } catch {
        setScheduleBlocks({});
      }
      const fechas = Object.keys(citasObj);
      setSelectedDate(fechas[0] || "");
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error al obtener las citas del evento:', error);
    }
  };

  // ========== FILTERS ==========
  const getFilteredCitas = (citas) => {
    return citas.filter(item => {
      const nombreMatch =
        filterNombre.trim() === "" ||
        (item.empresa_receptora && item.empresa_receptora.toLowerCase().includes(filterNombre.toLowerCase())) ||
        (item.empresa_solicitante && item.empresa_solicitante.toLowerCase().includes(filterNombre.toLowerCase()));
      const paisMatch =
        !filterPais ||
        (item.pais_empresa_receptora && item.pais_empresa_receptora === filterPais);
      const horarioMatch =
        !filterHorario ||
        (item.fecha_solicitada && item.fecha_solicitada.split(" ")[1] === filterHorario);
      const estatusMatch =
        !filterEstatus ||
        (item.estatus && item.estatus === filterEstatus);
      const rifMatch =
        filterRif.trim() === "" ||
        (item.rif_solicitante && item.rif_solicitante.toLowerCase().includes(filterRif.toLowerCase())) ||
        (item.rif_receptora && item.rif_receptora.toLowerCase().includes(filterRif.toLowerCase()));
      return nombreMatch && paisMatch && horarioMatch && estatusMatch && rifMatch;
    });
  };

  // ========== DERIVED DATA ==========
  const horariosFromBlocks = (() => {
    const horariosSet = new Set();
    Object.values(scheduleBlocks).forEach(blocksArr => {
      blocksArr.forEach(block => {
        if (block.fecha_hora) {
          const hora = block.fecha_hora.split(" ")[1];
          horariosSet.add(hora);
        }
      });
    });
    return Array.from(horariosSet);
  })();

  const paisesFromCitas = (() => {
    const paisesSet = new Set();
    Object.values(groupedCitas).forEach(citasArr => {
      citasArr.forEach(item => {
        if (item.pais_empresa_receptora) {
          paisesSet.add(item.pais_empresa_receptora);
        }
      });
    });
    return Array.from(paisesSet);
  })();

  const estatusFromCitas = (() => {
    const estatusSet = new Set();
    Object.values(groupedCitas).forEach(citasArr => {
      citasArr.forEach(item => {
        if (item.estatus) {
          estatusSet.add(item.estatus);
        }
      });
    });
    return Array.from(estatusSet);
  })();

  // ========== ESTATUS COLORS ==========
  const estatusColors = getEstatusColors(estatusFromCitas);

  // ========== TOTAL POR ESTATUS ==========
  const totalPorEstatus = (() => {
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
  })();

  // ========== EFFECTS ==========
  useEffect(() => {
    loadEventsData();
  }, [idCompany]);

  // ========== RENDER: FILTROS ==========
  const Filtros = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-4 bg-white p-4 rounded-2xl">
      <Input
        placeholder="Buscar por nombre de empresa"
        value={filterNombre}
        onChange={e => { setFilterNombre(e.target.value); setCurrentPage(1); }}
        style={{ maxWidth: 300 }}
      />
      <Input
        placeholder="Buscar por RIF"
        value={filterRif}
        onChange={e => { setFilterRif(e.target.value); setCurrentPage(1); }}
        style={{ maxWidth: 200 }}
      />
      <Select
        allowClear
        placeholder="Filtrar por país"
        value={filterPais || undefined}
        onChange={value => { setFilterPais(value); setCurrentPage(1); }}
        style={{ minWidth: 200 }}
      >
        {paisesFromCitas.map(pais => (
          <Select.Option key={pais} value={pais}>
            {pais}
          </Select.Option>
        ))}
      </Select>
      <Select
        allowClear
        placeholder="Filtrar por horario"
        value={filterHorario || undefined}
        onChange={value => { setFilterHorario(value); setCurrentPage(1); }}
        style={{ minWidth: 200 }}
      >
        {horariosFromBlocks.map(hora => (
          <Select.Option key={hora} value={hora}>
            {hora}
          </Select.Option>
        ))}
      </Select>
      <Select
        allowClear
        placeholder="Filtrar por estatus"
        value={filterEstatus || undefined}
        onChange={value => { setFilterEstatus(value); setCurrentPage(1); }}
        style={{ minWidth: 200 }}
      >
        {estatusFromCitas.map(estatus => (
          <Select.Option key={estatus} value={estatus}>
            {estatus}
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  // ========== RENDER ==========
  return (
    <>
      <AtomsPanel title={'Solicitudes de citas'} subtitle={'Informacion sobre las solicitudes de citas'} />
      <div className='p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4'>
        <CompaniesCarousel items={carouselItems} onItemClick={handleItemClick} />
      </div>
      <Filtros />
      <div ref={listRef}>
        {Object.keys(groupedCitas).length > 0 && (
          <Tabs value={selectedDate} onValueChange={date => { setSelectedDate(date); setCurrentPage(1); }} className="w-full bg-white rounded-2xl p-4">
            <TabsList className="flex justify-center mx-auto bg-green/50 text-primary">
              {Object.keys(groupedCitas).map((date) => (
                <TabsTrigger key={date} value={date}>
                  {date}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex flex-wrap gap-4 mt-4 justify-center items-center md:flex-row flex-col">
              {Object.keys(totalPorEstatus).length > 0 ? (
                Object.entries(totalPorEstatus).map(([estatus, total]) => (
                  <div
                    key={estatus}
                    className="bg-white rounded-xl px-4 py-2 text-sm font-medium flex items-center w-full md:w-auto"
                  >
                    <span
                      className={`mr-2 px-3 py-1 rounded-md font-medium flex items-center gap-2 ${estatusColors[estatus]?.bg || 'bg-gray-300'} ${estatusColors[estatus]?.text || 'text-gray-700'}`}
                    >
                      <span>{estatus}:</span>
                      <span className="font-bold">{total}</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No hay citas para mostrar</div>
              )}
            </div>
            {Object.keys(groupedCitas).map((date) => {
              const filteredCitas = getFilteredCitas(groupedCitas[date]);
              return (
                <TabsContent key={date} value={date}>
                  <div className="flex flex-col gap-4">
                    {filteredCitas
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((item, idx) => (
                        <MoleculesSchedulesItems
                          key={item.id || idx}
                          empresaEmisoraNombre={item.empresa_solicitante || "Sin nombre"}
                          empresaEmisoraImg={item.img_empresa_solicitante}
                          empresaReceptoraNombre={item.empresa_receptora || "Sin nombre"}
                          empresaReceptoraImg={item.img_empresa_receptora}
                          estatus={item.estatus}
                          fechaSolicitada={item.fecha_solicitada}
                          pais={item.pais_empresa_receptora}
                          estatusColor={estatusColors[item.estatus]}
                        />
                      ))}
                  </div>
                  <div className="flex justify-end py-4">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredCitas.length}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </>
  );
};

export default SchedulesEvents;