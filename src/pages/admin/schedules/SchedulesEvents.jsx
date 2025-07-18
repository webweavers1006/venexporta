// ===================== IMPORTS =====================
import React from 'react';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import CompaniesCarousel from '@components/organisms/companies/OrganismsCompaniesCarousel';
import MoleculesSchedulesItems from '@components/molecules/MoleculesSchedulesItems';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Pagination, Select, Input } from 'antd';
import useSchedulesEvents from './hooks/useSchedulesEvents';

/**
 * Componente para mostrar y gestionar las solicitudes de citas agrupadas por evento y fecha.
 * Incluye filtros, paginación y resumen por estatus.
 *
 * @component
 * @example
 * <SchedulesEvents />
 *
 * @returns {JSX.Element}
 */
const SchedulesEvents = () => {
  // Store global
  const idCompany = useStore(appStore, state => state.idCompany);
  // Hook personalizado para la lógica de eventos y citas
  const {
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
    filterHorario,
    setFilterHorario,
    filterEstatus,
    setFilterEstatus,
    filterRif,
    setFilterRif,
    pageSize,
    listRef,
    handleItemClick,
    getFilteredCitas,
    horariosFromBlocks,
    paisesFromCitas,
    estatusFromCitas,
    estatusColors,
    totalPorEstatus
  } = useSchedulesEvents(idCompany);


  /**
   * Renderiza los filtros de búsqueda y selección.
   * @returns {JSX.Element}
   */
  const Filtros = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-4 bg-white p-4 rounded-2xl" role="search" aria-label="Filtros de búsqueda de citas">
      <Input
        placeholder="Buscar por nombre de empresa"
        value={filterNombre}
        onChange={e => { setFilterNombre(e.target.value); setCurrentPage(1); }}
        style={{ maxWidth: 300 }}
        aria-label="Buscar por nombre de empresa"
      />
      <Input
        placeholder="Buscar por RIF"
        value={filterRif}
        onChange={e => { setFilterRif(e.target.value); setCurrentPage(1); }}
        style={{ maxWidth: 200 }}
        aria-label="Buscar por RIF"
      />
      <Select
        allowClear
        placeholder="Filtrar por país"
        value={filterPais || undefined}
        onChange={value => { setFilterPais(value); setCurrentPage(1); }}
        style={{ minWidth: 200 }}
        aria-label="Filtrar por país"
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
        aria-label="Filtrar por horario"
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
        aria-label="Filtrar por estatus"
      >
        {estatusFromCitas.map(estatus => (
          <Select.Option key={estatus} value={estatus}>
            {estatus}
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  // Render principal
  return (
    <>
      <AtomsPanel title={'Solicitudes de citas'} subtitle={'Información sobre las solicitudes de citas'} />
      <div className="p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4">
        <CompaniesCarousel
          items={carouselItems}
          onItemClick={handleItemClick}
          aria-label="Carrusel de eventos"
        />
      </div>
      <Filtros />
      <div ref={listRef}>
        {Object.keys(groupedCitas).length > 0 && (
          <Tabs
            value={selectedDate}
            onValueChange={date => { setSelectedDate(date); setCurrentPage(1); }}
            className="w-full bg-white rounded-2xl p-4"
            aria-label="Fechas de citas"
          >
            <TabsList className="flex justify-center mx-auto bg-green/50 text-primary" role="tablist">
              {Object.keys(groupedCitas).map((date) => (
                <TabsTrigger key={date} value={date} role="tab" aria-label={`Ver citas del ${date}`}>{date}</TabsTrigger>
              ))}
            </TabsList>
            <div className="flex flex-wrap gap-4 mt-4 justify-center items-center md:flex-row flex-col">
              {Object.keys(totalPorEstatus).length > 0 ? (
                Object.entries(totalPorEstatus).map(([estatus, total]) => (
                  <div
                    key={estatus}
                    className="bg-white rounded-xl px-4 py-2 text-sm font-medium flex items-center w-full md:w-auto"
                    aria-label={`Total de citas con estatus ${estatus}`}
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
                <TabsContent key={date} value={date} role="tabpanel" aria-label={`Citas del ${date}`}> 
                  <div className="flex flex-col gap-4">
                    {filteredCitas
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((item, idx) => (
                        <MoleculesSchedulesItems
                          key={item.id || idx}
                          empresaEmisoraNombre={item.empresa_solicitante || 'Sin nombre'}
                          empresaEmisoraImg={item.img_empresa_solicitante}
                          empresaReceptoraNombre={item.empresa_receptora || 'Sin nombre'}
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
                      aria-label="Paginación de citas"
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

SchedulesEvents.propTypes = {};

export default SchedulesEvents;