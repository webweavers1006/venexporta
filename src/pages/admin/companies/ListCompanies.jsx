import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router';
import MoleculesList from "@components/molecules/MoleculesList";
import { Input } from 'antd';
import { useCompanyList } from './hooks/useCompanyList';
/**
 * ListCompanies
 * @component
 * @description Página de listado y filtrado de empresas registradas en el sistema.
 * @example
 * <Route path="/admin/companies" element={<ListCompanies />} />
 */
const ListCompanies = () => {
  const {
    listRef,
    filteredCompanies,
    selectedRif,
    setSelectedRif,
    selectedEmpresa,
    setSelectedEmpresa,
  } = useCompanyList();

  return (
    <>
      <AtomsPanel title={'Empresas'} subtitle={'Lista de empresas registradas en sistema'} />
      <div ref={listRef} className='mt-4'>
        <MoleculesList
          data={filteredCompanies}
          filtersComponent={
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Filtrar por RIF"
                aria-label="Filtrar por RIF"
                value={selectedRif}
                onChange={(e) => setSelectedRif(e.target.value)}
                allowClear
                className="w-full"
              />
              <Input
                placeholder="Filtrar por Empresa"
                aria-label="Filtrar por Empresa"
                value={selectedEmpresa}
                onChange={(e) => setSelectedEmpresa(e.target.value)}
                allowClear
                className="w-full"
              />
            </div>
          }
          onActionClick={() => {}}
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
              <p className='bg-primary p-3 rounded-full' role="img" aria-label="Empresa">
                <Building2 color="#b2e713" />
              </p>
            ),
            title: (
              <Link to={`/list/companies/${item.id}`} aria-label={`Ver detalles de ${item.empresa}`} tabIndex={0}>
                {item.empresa}
              </Link>
            ),
            description: (
              <>
                <p>Numero de identificacion fiscal: {item.rif || "Sin descripción"}</p>
                <p>Tipo de actividad empresarial: {item.tipo_actividad_empresarial || "Sin descripción"}</p>
                <p>nombre de contacto: {item.tipo_actividad_empresarial || "Sin descripción"}</p>
                <p>Pais: {item.pais || "No especificada"}</p>
              </>
            ),
          })}
          actions={[]}
        />
      </div>
    </>
  );
};
ListCompanies.propTypes = {};
export default ListCompanies;