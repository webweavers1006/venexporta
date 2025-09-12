import { lazy } from 'react';
import PropTypes from 'prop-types';
import ScheduleModule from '@components/organisms/schedule/OrganismsScheduleModule';
import CompaniesCarousel from '@components/organisms/companies/OrganismsCompaniesCarousel';
import AtomsPopoverHelpButton from '@components/atoms/AtomsPopoverHelpButton';
import { homeHelps } from '@src/pages/home/helps/homeHelps';
import { useNavigate } from 'react-router';
import ResultComponent from '@src/components/molecules/result/MoleculesResult';
import { Button } from '@/components/ui/button';
import { useHomeEvents } from './hooks/useHomeEvents';

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));

//✅Components traduction
import { useTranslation } from "react-i18next";



/**
 * Componente principal de la pantalla de inicio de Venexporta.
 * Muestra el panel de bienvenida, el carrusel de eventos y el módulo de horarios.
 * Si no hay eventos, muestra un mensaje de advertencia y un botón para navegar a eventos.
 *
 * @component
 * @example
 * // Uso típico:
 * <Home />
 */
function Home() {
   // Traducción
    const { t } = useTranslation();
  const navigate = useNavigate();
  const { carouselItems, scheduleBlocks, handleItemClick } = useHomeEvents();

  return (
    <main aria-label={t("home.subtitle")} className="w-full">
      <div className="w-full">
        <AtomsPanel title={t("home.welcome")} subtitle={t("home.subtitle")} />
      </div>
      {carouselItems.length > 0 ? (
        <>
          <section
            className="p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4 relative"
            aria-label="Carrusel de eventos"
          >
            <AtomsPopoverHelpButton
              side={homeHelps.carousel.side}
              title={homeHelps.carousel.title}
              className={homeHelps.carousel.className}
              content={homeHelps.carousel.content}
              aria-label="Ayuda sobre el carrusel"
            />
            <CompaniesCarousel
              items={carouselItems}
              onItemClick={handleItemClick}
              title={t("home.carousel.title")}
              subtitle={t("home.carousel.subtitle")}
              aria-label="Carrusel de eventos de la empresa"
            />
          </section>
          <section className="grid grid-cols-1 xl:grid-cols-3 xl:gap-4 gap-y-4 " aria-label="Horarios de eventos">
            <div className="w-full bg-white flex flex-col items-center justify-center rounded-2xl p-4 xl:col-span-3">
              <ScheduleModule
                disableSelect={true}
                scheduleBlocks={scheduleBlocks}
                reloadScheduleBlocks={() => {}}
                className="xl:col-span-1 w-full"
                aria-label="Módulo de horarios"
              />
            </div>
          </section>
        </>
      ) : (
        <section className="bg-white p-5 rounded-2xl mt-4 mb-4 relative" aria-label="Sin eventos registrados">
          <ResultComponent
            config={{
              status: 'warning',
              title: t("home.noEvents.title"),
              subTitle: t("home.noEvents.subtitle"),
              links: [
                <Button
                  key="eventos"
                  onClick={() => navigate('/event/feed')}
                  aria-label="Ir a Eventos"
                  tabIndex={0}
                >
                  {t("home.noEvents.button")}

                </Button>,
              ],
              messages: [],
            }}
          />
        </section>
      )}
    </main>
  );
}

Home.propTypes = {};

export default Home;