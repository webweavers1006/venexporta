import React from 'react';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import CompaniesCarousel from '@components/organisms/companies/OrganismsCompaniesCarousel';
import MoleculesList from '@components/molecules/MoleculesList';
import { Link } from 'react-router';
import { SquareX, SquareCheckBig } from 'lucide-react';
import { Select, Input } from 'antd';
import { useEventRequests } from './hooks/useEventRequests';


/**
 * Componente para gestionar y visualizar las solicitudes de eventos y empresas asociadas.
 * Permite filtrar, aceptar o rechazar solicitudes de empresas para eventos.
 *
 * @component
 * @example
 * // Uso básico
 * <EventRequests />
 *
 * @returns {JSX.Element}
 */
function EventRequests() {
  const {
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
  } = useEventRequests();

  return (
    <>
      <AtomsPanel
        title={'Solicitudes de Eventos'}
        subtitle={'Información sobre las solicitudes de eventos'}
      />
      <div className='p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4'>
        <CompaniesCarousel
          items={carouselItems}
          onItemClick={handleItemClick}
          aria-label="Carrusel de eventos"
        />
      </div>
      <div ref={listRef}>
        <MoleculesList
          data={filteredCompanies}
          filtersComponent={
            <>
              <Input
                placeholder="Filtrar por RIF"
                value={selectedRif}
                onChange={e => handleFilterChange('rif', e.target.value)}
                allowClear
                className="w-full"
                aria-label="Filtrar por RIF"
              />
              <Select
                placeholder="Filtrar por Estatus"
                value={selectedStatus}
                onChange={value => handleFilterChange('status', value)}
                allowClear
                options={[...new Set(associatedCompanies.map(item => item.estatus))].map(status => ({ value: status, label: status }))}
                className="w-full"
                aria-label="Filtrar por estatus"
              />
              <Select
                placeholder="Filtrar por Actividad"
                onChange={value => handleFilterChange('activity', value)}
                allowClear
                options={[...new Set(associatedCompanies.flatMap(item => item.actividades))].map(activity => ({ value: activity, label: activity }))}
                className="w-full"
                aria-label="Filtrar por actividad"
              />
              <Select
                placeholder="Filtrar por Sub sector"
                onChange={value => handleFilterChange('subSector', value)}
                allowClear
                options={[...new Set(associatedCompanies.flatMap(item => item.sub_sectores))].map(subSector => ({ value: subSector, label: subSector }))}
                className="w-full"
                aria-label="Filtrar por sub sector"
              />
              <Input
                placeholder="Filtrar por Código"
                value={selectedCode}
                onChange={e => handleFilterChange('code', e.target.value)}
                allowClear
                className="w-full"
                aria-label="Filtrar por código"
              />
            </>
          }
          onActionClick={handleActionClick}
          renderItemExtra={item => (
            <img
              width={272}
              className='mask mask-squircle size-25'
              alt="Logo de la empresa"
              src={item.img_empresa || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
              role="img"
            />
          )}
          renderItemMeta={item => ({
            avatar: (
              <img
                width={272}
                className='mask mask-squircle size-15'
                alt="Logo del evento"
                src={item.img_evento || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                role="img"
              />
            ),
            title: (
              <Link
                to={`/roundtable/companies/${item.id_empresa}/${item.id_evento}/false`}
                aria-label={`Ver detalles de ${item.nombre_empresa}`}
                tabIndex={0}
              >
                {item.nombre_empresa}
              </Link>
            ),
            description: (
              <>
                <p>Evento: {item.nombre_evento}</p>
                <p>Numero de identificación fiscal: {item.rif}</p>
                <p>Estatus: {item.estatus}</p>
                <p>Cantidad de productos: {item.productos}</p>
              </>
            ),
          })}
          actions={[
            {
              type: 'reject',
              label: 'Rechazar',
              icon: <SquareX aria-label="Rechazar solicitud" />,
              className: 'bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75',
              'aria-label': 'Rechazar solicitud',
            },
            {
              type: 'accept',
              label: 'Aceptar',
              icon: <SquareCheckBig aria-label="Aceptar solicitud" />,
              className: 'bg-green/50 text-primary hover:bg-green/80',
              'aria-label': 'Aceptar solicitud',
            },
          ]}
        />
      </div>
    </>
  );
}

EventRequests.propTypes = {};

export default EventRequests;