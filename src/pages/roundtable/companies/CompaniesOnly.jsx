import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import AtomsPanel from '@components/atoms/AtomsPanel';
import { fetchProductsByCompany, fetchCompanyEvents, fetchScheduleBlocks, fetchActivitiesData, fetchDocumentosByEmpresa } from '@src/lib/api/apiUser';
import { Archive} from 'lucide-react';
import { Image } from 'antd';
import CompaniesInfo from '@components/organisms/companies/CompaniesInfo';
import ScheduleModule from "@components/organisms/schedule/ScheduleModule";
import MoleculesList from "@components/molecules/MoleculesList";

const CompaniesOnly = () => {  
  const { id, event, renderSchedule } = useParams(); // Obtener el id y evento de la URL
  const [productsCompany, setProductsCompany] = useState([]); // Estado para los productos de la empresa
  const [companyEvents, setCompanyEvents] = useState([]); // Estado para los eventos de la empresa
  const [scheduleBlocks, setScheduleBlocks] = useState({}); // Estado para los bloques horarios agrupados por fecha
  const [economicActivities, setEconomicActivities] = useState(""); // Estado para las actividades económicas
  const [subEconomicSectors, setSubEconomicSectors] = useState(""); // Estado para los subsectores económicos
  const [companyDocuments, setCompanyDocuments] = useState([]); // Estado para los documentos de la empresa

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchProductsByCompany(id); // Obtener productos
        setProductsCompany(products);

        const events = await fetchCompanyEvents(id); // Obtener eventos
        setCompanyEvents(events);

        if (event) {
          const blocks = await fetchScheduleBlocks(event, id, 1); // Obtener bloques horarios
          setScheduleBlocks(blocks);
        }

        const activitiesData = await fetchActivitiesData(id); // Obtener actividades
        console.log(activitiesData);

        const activities = activitiesData.map(activity => activity.actividad_economica).join(", "); // Convertir actividades a string
        setEconomicActivities(activities);

        const subSectors = activitiesData
          .map(activity => activity.sub_sector_productivo) // Convertir a mayúsculas
          .join(", "); // Convertir subsectores a string
        setSubEconomicSectors(subSectors);

        // Consultar documentos de la empresa
        const documentos = await fetchDocumentosByEmpresa(id);
        setCompanyDocuments(documentos);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [id, event]);

  const reloadScheduleBlocks = async () => {
    if (event) {
      const blocks = await fetchScheduleBlocks(event, id, 1); // Reload schedule blocks
      setScheduleBlocks(blocks);
    }
  };

  return (
    <>
      <AtomsPanel title={'Información de la Empresa'} subtitle={'Detalles de la empresa seleccionada.'} />
      <div className='mt-4 grid grid-cols-1 xl:grid-cols-3 xl:gap-4 gap-y-4'>
        {renderSchedule == "true" && (
          <ScheduleModule
            scheduleBlocks={scheduleBlocks}
            reloadScheduleBlocks={reloadScheduleBlocks} // Pass reload function
            className="xl:col-span-1 w-full"
            id_empresa_receptora={id}
            id_evento={event}
          />
        )}
        <CompaniesInfo 
          companyInfo={{ ...companyEvents, subEconomicSectors, economicActivities }} 
          docs={companyDocuments}
          className={renderSchedule == "true" ? "xl:col-span-2 w-full" : "xl:col-span-4 w-full"} 
        />
      </div>
      <div className='bg-white pt-5 pb-5 px-5 rounded-2xl md:col-span-2 mt-4'>
        <h2 className="text-lg font-semibold text-zinc-700 text-center mb-4">Productos</h2>
        <MoleculesList
          data={productsCompany}
          onFilterChange={() => {}}
          onActionClick={() => {}}
          renderItemExtra={(item) => (
            <Image
              width={200}
              src={
                !item.img || item.img === "no hay imagen cargada"
                  ? "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  : item.img
              }
            />
          )}
          renderItemMeta={(item) => ({
            avatar: (
              <p className='bg-primary p-3 rounded-full'>
                <Archive color="#b2e713" />
              </p>
            ),
            title: <p>{item.nombre_producto}</p>,
            description: (
              <>
                <p>Código Arancelario: {item.codigo_arancelario || "Sin código"}</p>
                <p>Capitulo: {item.capitulo || "sin capítulo"}</p>
                <p>Descripción de la mercancia: {item.descripcion || "Sin descripción"}</p>
              </>
            ),
          })}
          actions={[]}
        />
      </div>
    </>
  );
};

export default CompaniesOnly;