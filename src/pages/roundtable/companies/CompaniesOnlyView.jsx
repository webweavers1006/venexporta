/**
 * @fileoverview Componente CompaniesOnly para mostrar información detallada de una empresa, sus productos y agenda de eventos.
 * @module CompaniesOnly
 *
 * @description
 * Este componente muestra la información de una empresa seleccionada, incluyendo sus productos, eventos asociados, documentos y bloques de agenda si corresponde.
 *
 * La documentación extendida en formato Markdown debe ubicarse en la carpeta `docs` dentro de la página correspondiente (por ejemplo: `src/pages/roundtable/companies/docs/CompaniesOnlyInfo.md`).
 *
 * @example
 * // Uso típico en una ruta:
 * <Route path="/roundtable/companies/:id/:event/:renderSchedule" element={<CompaniesOnly />} />
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Archive } from 'lucide-react';
import { Image } from 'antd';
import AtomsPanel from '@components/atoms/AtomsPanel';
import CompaniesInfo from '@components/organisms/companies/OrganismsCompaniesInfo';
import ScheduleModule from '@components/organisms/schedule/OrganismsScheduleModule';
import MoleculesList from '@components/molecules/MoleculesList';

/**
 * Renderiza la lista de productos de la empresa.
 * @param {Array} productsCompany - Lista de productos de la empresa.
 * @returns {JSX.Element}
 */
export function ProductsList({ productsCompany }) {
  return (
    <div className="bg-white pt-5 pb-5 px-5 rounded-2xl md:col-span-2 mt-4">
      <h2 className="text-lg font-semibold text-zinc-700 text-center mb-4">Productos</h2>
      <MoleculesList
        data={productsCompany}
        onFilterChange={() => {}}
        onActionClick={() => {}}
        renderItemExtra={(item) => (
          <Image
            width={200}
            src={
              !item.img || item.img === 'no hay imagen cargada'
                ? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                : item.img
            }
            alt={item.nombre_producto || 'Imagen de producto'}
            aria-label="Imagen del producto"
          />
        )}
        renderItemMeta={(item) => ({
          avatar: (
            <p className="bg-primary p-3 rounded-full" aria-label="Ícono de producto">
              <Archive color="#b2e713" />
            </p>
          ),
          title: <p>{item.nombre_producto}</p>,
          description: (
            <>
              <p>Código Arancelario: {item.codigo_arancelario || 'Sin código'}</p>
              <p>Capitulo: {item.capitulo || 'sin capítulo'}</p>
              <p>Descripción de la mercancia: {item.descripcion || 'Sin descripción'}</p>
            </>
          ),
        })}
        actions={[]}
      />
    </div>
  );
}

ProductsList.propTypes = {
  productsCompany: PropTypes.arrayOf(PropTypes.object).isRequired,
};

/**
 * CompaniesOnly muestra la información de una empresa, sus productos y agenda.
 *
 * @component
 * @returns {JSX.Element}
 */
function CompaniesOnlyView({
  renderSchedule,
  scheduleBlocks,
  reloadScheduleBlocks,
  id,
  event,
  companyEvents,
  subEconomicSectors,
  economicActivities,
  companyDocuments,
  productsCompany,
}) {
  return (
    <>
      <AtomsPanel title={"Información de la Empresa"} subtitle={"Detalles de la empresa seleccionada."} />
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 xl:gap-4 gap-y-4">
        {renderSchedule === 'true' && (
          <ScheduleModule
            scheduleBlocks={scheduleBlocks}
            reloadScheduleBlocks={reloadScheduleBlocks}
            className="xl:col-span-1 w-full"
            id_empresa_receptora={id}
            id_evento={event}
          />
        )}
        <CompaniesInfo
          companyInfo={{ ...companyEvents, subEconomicSectors, economicActivities }}
          docs={companyDocuments}
          className={renderSchedule === 'true' ? 'xl:col-span-2 w-full' : 'xl:col-span-4 w-full'}
        />
      </div>
      <ProductsList productsCompany={productsCompany} />
    </>
  );
}

CompaniesOnlyView.propTypes = {
  renderSchedule: PropTypes.string,
  scheduleBlocks: PropTypes.object,
  reloadScheduleBlocks: PropTypes.func,
  id: PropTypes.string,
  event: PropTypes.string,
  companyEvents: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  subEconomicSectors: PropTypes.string,
  economicActivities: PropTypes.string,
  companyDocuments: PropTypes.arrayOf(PropTypes.object),
  productsCompany: PropTypes.arrayOf(PropTypes.object),
};

export default CompaniesOnlyView;
