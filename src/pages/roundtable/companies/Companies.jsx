import { useState, useEffect, useRef } from 'react';
import AtomsPanel from '@components/atoms/AtomsPanel';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { fetchEventosByEmpresas, fetchCompaniesByEvent } from '@src/lib/api/apiUser';
import CompaniesCarousel from "@src/components/organisms/companies/CompaniesCarousel";
import { Building2 } from 'lucide-react'; // Cambiar el ícono a lucide-react
import { Link } from 'react-router';
import MoleculesList from "@components/molecules/MoleculesList";
import { Select, Input, message } from 'antd';
import AtomsPopoverHelpButton from '@components/atoms/AtomsPopoverHelpButton';
import {companiesHelps} from '@src/pages/roundtable/helps/companiesHelps';
import ResultComponent from '@src/components/molecules/result/MoleculesResult';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router';

const Companies = () => {  
  const idCompany = useStore(appStore, state => state.idCompany);

  const [carouselItems, setCarouselItems] = useState([]); // Estado para los eventos del carrusel
  const [associatedCompanies, setAssociatedCompanies] = useState([]); // Nuevo estado para las empresas asociadas
  const [selectedActivity, setSelectedActivity] = useState(null); // Estado para el filtro de actividades
  const [selectedSubSector, setSelectedSubSector] = useState(null); // Estado para el filtro de subsectores
  const [selectedCode, setSelectedCode] = useState(""); // Estado para el filtro de códigos
  const [selectedChapter, setSelectedChapter] = useState(null); // Estado para el filtro de capítulos
  const listRef = useRef(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadEventsData = async () => {
    try {
      const data = await fetchEventosByEmpresas(idCompany);


      // Formatear los datos para el carrusel
      const formattedEvents = data.map((event) => ({
        id: event.id_evento,
        url: event.img_evento || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", // Imagen por defecto si no hay imagen
        nombre: event.nombre_evento,
        descripcion: event.descripcion_evento || "Sin descripción", // Descripción opcional
      }));
      setCarouselItems(formattedEvents);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  };

  const handleItemClick = async (eventId) => {
    console.log(eventId);
    try {
      const companies = await fetchCompaniesByEvent(eventId);
      console.log('Empresas asociadas al evento:', companies); // Mostrar las empresas en la consola
      message.success(`Se cargaron ${companies.length} empresas de la rueda de negocio`); // Mostrar mensaje de éxito
      setAssociatedCompanies(companies);
      // Hacer scroll al componente de la lista después de cargar empresas
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Pequeño delay para asegurar que el render se complete
    } catch (error) {
      console.error('Error al obtener las empresas del evento:', error);
      message.error(error.response.data.error.message); // Mostrar mensaje de éxito
      setError(error.response.data.error.message);
    }
  };

  useEffect(() => {
    loadEventsData();
  }, [idCompany]);

  const filteredCompanies = associatedCompanies.filter((item) => {
    const matchesActivity = selectedActivity ? item.actividades.includes(selectedActivity) : true;
    const matchesSubSector = selectedSubSector ? item.sub_sectores.includes(selectedSubSector) : true;
    const matchesChapter = selectedChapter ? item.capitulos?.includes(selectedChapter) : true; // Nuevo filtro de capítulos
    const matchesCode = selectedCode 
      ? item.codigos?.filter(code => code !== null).some(code => code.includes(selectedCode)) 
      : true;
    return matchesActivity && matchesSubSector && matchesChapter && matchesCode;
  });

  return (
    <>
      <AtomsPanel title={'Rueda de Negocios'} subtitle={'Informacion sobre la rueda de negocios'} />
      {carouselItems.length>0
        ? 
          <>
            <div className='p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4 relative'> 
                <AtomsPopoverHelpButton
                  side={companiesHelps.carousel.side}
                  title={companiesHelps.carousel.title}
                  className={companiesHelps.carousel.className}
                  content={companiesHelps.carousel.content}
                />
              <div className="clear-both"></div>
              <CompaniesCarousel items={carouselItems} onItemClick={handleItemClick} title={'Mis eventos'} subtitle={'Selecciona un evento para ver las empresas de la rueda de negocios'} />
            </div>
            <div ref={listRef}>
              { error ? 
                <div className="bg-white p-5 rounded-2xl mt-4 mb-4 relative">
                  <ResultComponent
                  config={{
                      status: "warning",
                      title: error,
                      subTitle: "",
                      links: [
                          
                      ],
                      messages: [],
                    }}
                  />
                </div>
              :
                <MoleculesList
                  data={filteredCompanies}
                  filtersComponent={
                    <div className='bg-zinc-100/50 p-4 rounded-lg'>
                      <div className="mb-2 relative">  
                        <AtomsPopoverHelpButton
                          side={companiesHelps.filtersCompany.side}
                          title={companiesHelps.filtersCompany.title}
                          className={companiesHelps.filtersCompany.className}
                          content={companiesHelps.filtersCompany.content}
                        />
                        <p className="text-md font-semibold text-zinc-900">Filtros de Empresa por Actividad / Sub sector</p> 
                      </div>
                      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <Select
                          placeholder="Filtrar por Actividad"
                          onChange={(value) => setSelectedActivity(value)}
                          allowClear
                          options={[...new Set(associatedCompanies.flatMap(item => item.actividades))].map(activity => ({ value: activity, label: activity }))}
                          className="w-full"
                        />
                        <Select
                          placeholder="Filtrar por Subsector"
                          onChange={(value) => setSelectedSubSector(value)}
                          allowClear
                          options={[...new Set(associatedCompanies.flatMap(item => item.sub_sectores))].map(subSector => ({ value: subSector, label: subSector }))}
                          className="w-full"
                        />
                      </div>
                      <div className="mb-2">
                        <AtomsPopoverHelpButton
                          side={companiesHelps.filtersProducts.side}
                          title={companiesHelps.filtersProducts.title}
                          className={companiesHelps.filtersProducts.className}
                          content={companiesHelps.filtersProducts.content}
                        />
                        <p className="text-md font-semibold text-zinc-900">Filtros de Productos por Capitulo / Codigo</p> 
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <Select
                          placeholder="Filtrar por Capítulo"
                          onChange={(value) => setSelectedChapter(value)}
                          allowClear
                          options={[...new Set(associatedCompanies.flatMap(item => item.capitulos || []))].map(chapter => ({ value: chapter, label: chapter }))}
                          className="w-full"
                        />
                        <Input
                          placeholder="Filtrar por Código"
                          value={selectedCode}
                          onChange={(e) => setSelectedCode(e.target.value)}
                          allowClear
                          className="w-full"
                        />
                      </div>
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
                      <p className='bg-primary p-3 rounded-full'>
                        <Building2 color="#b2e713" />
                      </p>
                    ),
                    title: (
                      <Link to={`/roundtable/companies/${item.id_empresa}/${item.id_evento}/${item.mostrar_citas}`}>
                        {item.nombre_empresa}
                      </Link>
                    ),
                    description: (
                      <>
                        <p>Rif: {item.rif || "Sin descripción"}</p>
                        <p>Pais: {item.pais || "No especificada"}</p>
                      </>
                    ),
                  })}
                  actions={[]}
                />
              }
            </div>
          </>
        :
          <div className="bg-white p-5 rounded-2xl mt-4 mb-4 relative">
              <ResultComponent
                config={{
                    status: "warning",
                    title: "No se ha registrado en ningun evento.",
                    subTitle: "Aqui puede ver los eventos disponibles",
                    links: [
                        <Button key="eventos" onClick={() => navigate('/event/feed')}> 
                            Ir a Eventos
                        </Button>
                    ],
                    messages: [],
                }}
              />
          </div>
      }
    </>
  );
}

export default Companies;