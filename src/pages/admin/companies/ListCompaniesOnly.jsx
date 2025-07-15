import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import AtomsPanel from '@components/atoms/AtomsPanel';
import { fetchProductsByCompany, fetchCompanyEvents, fetchScheduleBlocks, fetchActivitiesData, fetchDocumentosByEmpresa } from '@src/lib/api/apiUser';
import CompaniesInfo from '@components/organisms/companies/OrganismsCompaniesInfo';
import OrganismsDocCompanies from '@components/organisms/OrganismsDocCompanies';
import { uploadFileToDropbox, getDropboxSharedLink } from '@src/lib/api/dropboxApi';
import { createDocumentoEmpresa, deleteDocumentoEmpresa } from '@src/lib/api/apiUser';
import { message } from 'antd';
import MoleculesList from '@components/molecules/MoleculesList';
import { CloudUpload, Trash2 } from 'lucide-react';
import { Button } from "@components/ui/button";


const ListCompaniesOnly = () => {  
  const { id, event, renderSchedule } = useParams(); // Obtener el id y evento de la URL
  const [companyEvents, setCompanyEvents] = useState([]); // Estado para los eventos de la empresa
  const [economicActivities, setEconomicActivities] = useState(""); // Estado para las actividades económicas
  const [subEconomicSectors, setSubEconomicSectors] = useState(""); // Estado para los subsectores económicos
  const [documentos, setDocumentos] = useState([]);  
  const [documentosConLink, setDocumentosConLink] = useState([]); // Documentos con link compartido

  // Nueva función para cargar documentos y links
  const loadDocumentos = async (empresaId) => {
    const docs = await fetchDocumentosByEmpresa(empresaId);
    setDocumentos(docs);

    const docsWithLinks = await Promise.all(
      docs.map(async (doc) => {
        let url = doc.url_documento;
        try {
          url = await getDropboxSharedLink(doc.url_documento);
        } catch (e) {
          // Si falla, deja la url original
        }
        return { ...doc, url_dropbox: url };
      })
    );
    setDocumentosConLink(docsWithLinks);
  };

  useEffect(() => {

    const loadData = async () => {
      try {

        const events = await fetchCompanyEvents(id); // Obtener eventos
        setCompanyEvents(events);

        await loadDocumentos(id);

        const activitiesData = await fetchActivitiesData(id); // Obtener actividades
        console.log(activitiesData);

        const activities = activitiesData.map(activity => activity.actividad_economica).join(", "); // Convertir actividades a string
        setEconomicActivities(activities);

        const subSectors = activitiesData
          .map(activity => activity.sub_sector_productivo) // Convertir a mayúsculas
          .join(", "); // Convertir subsectores a string
        setSubEconomicSectors(subSectors);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [id, event]);

  // Handler para subir archivo a Dropbox desde DocCompanies
  const handleDocCompaniesSubmit = async (data) => {
    let hideLoading;
    try {
      if (!data.archivo) {
        message.error('Debe seleccionar un archivo PDF.');
        return;
      }
      hideLoading = message.loading('Cargando archivo, por favor espere...', 0);
      const dropboxPath = `/empresas/${id}/${data.archivo.name || 'documento'}`;
      const val = await uploadFileToDropbox(dropboxPath, data.archivo);
      if(val.result.id) {
          await createDocumentoEmpresa({
            url_documento: val.result.id,
            id_empresa: id,
            id_tipo_archivo: data.tipo
          });
          message.success('El archivo se cargó correctamente');
          // Volver a cargar los documentos después de éxito
          await loadDocumentos(id);
      }
    } catch (error) {
      message.error('Error al subir archivo o registrar documento');
      console.error('Error al subir archivo o registrar documento:', error);
    } finally {
      if (hideLoading) hideLoading();
    }
  };

  // Handler para eliminar documento
  const handleActionClick = async (actionType, item) => {
    if (actionType === 'delete') {
      let hideLoading;
      try {
        hideLoading = message.loading('Borrando archivo, por favor espere...', 0);
        await deleteDocumentoEmpresa(item.id);
        message.success('Documento eliminado correctamente');
        await loadDocumentos(id);
      } catch (error) {
        message.error('Error al eliminar el documento');
      } finally {
        if (hideLoading) hideLoading();
      }
    }
  };


  return (
    <>
      <AtomsPanel title={'Información de la Empresa'} subtitle={'Detalles de la empresa seleccionada.'} />
      <div className='w-full mt-4'>
        <CompaniesInfo 
          companyInfo={{ ...companyEvents, subEconomicSectors, economicActivities }} 
          className={renderSchedule == "true" ? "xl:col-span-2 w-full" : "xl:col-span-4 w-full"} 
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
                <p className='bg-primary p-3 rounded-full'>
                  <CloudUpload color="#b2e713" />
                </p>
              ),
              title: item.tipo_archivo,
              description: (
                  <>
                  <p>Tipo de archivo: {item.tipo_archivo || 'No especificado'}</p>
                  <p>Ver documento: <a href={item.url_dropbox.shareLink} target="_blank" rel="noopener noreferrer">Ver documento</a></p>
                  <p>Descargar documento: <a href={item.url_dropbox.tempLink} target="_blank" rel="noopener noreferrer">Descargar</a></p>
                  </>
              ),
            })}
            actions={[{
            type: 'delete',
            label: 'Borrar',
            icon: <Trash2 />,
            className: "bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75",
          }]}
          onActionClick={handleActionClick}
        />
      </div>
    </>
  );
};

export default ListCompaniesOnly;