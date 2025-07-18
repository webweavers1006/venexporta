import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import CompaniesInfo from '@components/organisms/companies/OrganismsCompaniesInfo';
import OrganismsDocCompanies from '@components/organisms/OrganismsDocCompanies';
import MoleculesList from '@components/molecules/MoleculesList';
import { CloudUpload, Trash2 } from 'lucide-react';
import { fetchCompanyEvents, fetchActivitiesData } from '@src/lib/api/apiIndex';
import { useCompanyDocuments } from './hooks/useCompanyDocuments';

/**
 * ListCompaniesOnly
 * @component
 * @description Página de detalle de empresa: muestra información, documentos y actividades asociadas.
 * @example
 * <Route path="/admin/companies/:id" element={<ListCompaniesOnly />} />
 */

const ListCompaniesOnly = () => {
  const { id, event, renderSchedule } = useParams();
  const [companyEvents, setCompanyEvents] = useState({});
  const [economicActivities, setEconomicActivities] = useState("");
  const [subEconomicSectors, setSubEconomicSectors] = useState("");

  // Hook personalizado para documentos
  const {
    documentosConLink,
    loadDocumentos,
    handleDocCompaniesSubmit,
    handleDeleteDocumento,
  } = useCompanyDocuments(id);

  useEffect(() => {
    const loadData = async () => {
      try {
        const events = await fetchCompanyEvents(id);
        setCompanyEvents(events);
        await loadDocumentos();
        const activitiesData = await fetchActivitiesData(id);
        const activities = activitiesData.map(activity => activity.actividad_economica).join(", ");
        setEconomicActivities(activities);
        const subSectors = activitiesData.map(activity => activity.sub_sector_productivo).join(", ");
        setSubEconomicSectors(subSectors);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [id, event, loadDocumentos]);

  /**
   * Maneja las acciones de la lista de documentos.
   * @param {string} actionType - Tipo de acción ("delete").
   * @param {object} item - Documento seleccionado.
   */
  const handleActionClick = async (actionType, item) => {
    if (actionType === 'delete') {
      await handleDeleteDocumento(item.id);
    }
  };

  return (
    <>
      <AtomsPanel title={'Información de la Empresa'} subtitle={'Detalles de la empresa seleccionada.'} />
      <div className='w-full mt-4'>
        <CompaniesInfo
          companyInfo={{ ...companyEvents, subEconomicSectors, economicActivities }}
          className={renderSchedule === "true" ? "xl:col-span-2 w-full" : "xl:col-span-4 w-full"}
        />
      </div>
      <div className='bg-white mt-4 p-5 rounded-2xl'>
        <OrganismsDocCompanies
          companyId={companyEvents?.id}
          onSubmit={handleDocCompaniesSubmit}
        />
      </div>
      <div className='bg-white mt-4 rounded-2xl'>
        <MoleculesList
          data={documentosConLink}
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
              <p className='bg-primary p-3 rounded-full' role="img" aria-label="Documento">
                <CloudUpload color="#b2e713" />
              </p>
            ),
            title: item.tipo_archivo,
            description: (
              <>
                <p>Tipo de archivo: {item.tipo_archivo || 'No especificado'}</p>
                <p>
                  Ver documento: {item.url_dropbox?.shareLink ? (
                    <a
                      href={item.url_dropbox.shareLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver documento ${item.tipo_archivo}`}
                    >
                      Ver documento
                    </a>
                  ) : 'No disponible'}
                </p>
                <p>
                  Descargar documento: {item.url_dropbox?.tempLink ? (
                    <a
                      href={item.url_dropbox.tempLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Descargar documento ${item.tipo_archivo}`}
                    >
                      Descargar
                    </a>
                  ) : 'No disponible'}
                </p>
              </>
            ),
          })}
          actions={[{
            type: 'delete',
            label: 'Borrar',
            icon: <Trash2 aria-label="Borrar documento" />,
            className: "bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75",
            'aria-label': 'Borrar documento',
            tabIndex: 0,
          }]}
          onActionClick={handleActionClick}
        />
      </div>
    </>
  );
};

ListCompaniesOnly.propTypes = {};

export default ListCompaniesOnly;