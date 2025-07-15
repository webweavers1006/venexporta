import { lazy, useEffect, useState } from 'react';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));
import ScheduleModule from '@components/organisms/schedule/OrganismsScheduleModule';
import { fetchScheduleBlocks, fetchEventosByEmpresas } from '@src/lib/api/apiUser';
import CompaniesCarousel from "@components/organisms/companies/OrganismsCompaniesCarousel";
import AtomsPopoverHelpButton from '@components/atoms/AtomsPopoverHelpButton';
import {homeHelps} from '@src/pages/home/helps/homeHelps';
import { useNavigate } from 'react-router';
import ResultComponent from '@src/components/molecules/result/MoleculesResult';
import { Button } from "@/components/ui/button"

const solicitudes = [
    { id: 1, nombre: 'Solicitud prueba 1', avatar: 'https://via.placeholder.com/40' },
    { id: 2, nombre: 'Solicitud prueba 2', avatar: 'https://via.placeholder.com/40' },
    
];

const Home = () => {    
    const [carouselItems, setCarouselItems] = useState([]); // Estado para los eventos del carrusel
    const idCompany = useStore(appStore, state => state.idCompany);
    const idPais = appStore.getState().idPais; // Obtener idPais desde appStore
    const [scheduleBlocks, setScheduleBlocks] = useState({});
    const navigate = useNavigate();
    useEffect(() => {

        loadEventsData()
    }, []);

      const handleItemClick = async (eventId) => {
        try {
            const tipo = idPais === 95 ? 2 : 3;
            const blocks = await fetchScheduleBlocks(eventId, idCompany, tipo);
            setScheduleBlocks(blocks);
        } catch (error) {
            console.error('Error al obtener las empresas del evento:', error);
        }
      };


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

    return (
        <>
            <div className="w-full">
                <AtomsPanel title={'Bienvenido a Venexporta'} subtitle={'Pantalla de inicio'} />
            </div>
            {carouselItems.length>0
            ?
                <>
                    <div className='p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4 relative'>
                        <AtomsPopoverHelpButton
                            side={homeHelps.carousel.side}
                            title={homeHelps.carousel.title}
                            className={homeHelps.carousel.className}
                            content={homeHelps.carousel.content}
                        />
                        <CompaniesCarousel items={carouselItems} onItemClick={handleItemClick} title={'Mis eventos'} subtitle={'Selecciona un evento para ver tus horarios y bloques disponibles'} />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-4 gap-y-4 ">
                        <div className="w-full bg-white flex flex-col items-center justify-center rounded-2xl p-4 xl:col-span-3">
                            <ScheduleModule
                                disableSelect={true}
                                scheduleBlocks={scheduleBlocks}
                                reloadScheduleBlocks={() => {}} 
                                className="xl:col-span-1 w-full"
                            />
                        </div>
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
    )
}   
export default Home;