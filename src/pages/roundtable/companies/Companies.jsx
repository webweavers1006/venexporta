
import AtomsPanel from '@components/atoms/AtomsPanel';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import CompaniesCarousel from '@components/organisms/companies/OrganismsCompaniesCarousel';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router';
import MoleculesList from '@components/molecules/MoleculesList';
import { Select, Input } from 'antd';
import AtomsPopoverHelpButton from '@components/atoms/AtomsPopoverHelpButton';
import { companiesHelps } from '@src/pages/roundtable/helps/companiesHelps';
import ResultComponent from '@src/components/molecules/result/MoleculesResult';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { useAssociatedCompanies } from './hooks/useAssociatedCompanies';

//✅Components traduction
import { useTranslation } from "react-i18next";

/**
 * Componente Companies
 * Muestra los eventos de la rueda de negocios y permite filtrar y visualizar empresas asociadas a cada evento.
 *
 * @component
 * @example
 * return (
 *   <Companies />
 * )
 */
const Companies = () => {
  const idCompany = useStore(appStore, state => state.idCompany);
  const navigate = useNavigate();
  const {
    carouselItems,
    associatedCompanies,
    selectedActivity,
    setSelectedActivity,
    selectedSubSector,
    setSelectedSubSector,
    selectedCode,
    setSelectedCode,
    selectedChapter,
    setSelectedChapter,
    error,
    listRef,
    handleItemClick,
    filteredCompanies,
  } = useAssociatedCompanies(idCompany);
  // Traducción
    const { t } = useTranslation();

  return (
    <>
      <AtomsPanel title={t("roundtable.title")} subtitle={t("roundtable.subtitle")} />
      {carouselItems.length > 0 ? (
        <>
          <div className="p-5 rounded-2xl md:col-span-2 bg-white mt-4 mb-4 relative">
            <AtomsPopoverHelpButton
              side={companiesHelps.carousel.side}
              title={companiesHelps.carousel.title}
              className={companiesHelps.carousel.className}
              content={companiesHelps.carousel.content}
            />
            <div className="clear-both"></div>
            <CompaniesCarousel
              items={carouselItems}
              onItemClick={handleItemClick}
              title={t("home.carousel.title")}
              subtitle={t("roundtable.carouselSubtitle")}

              aria-label="Carrusel de eventos"
            />
          </div>
          <div ref={listRef}>
            {error ? (
              <div className="bg-white p-5 rounded-2xl mt-4 mb-4 relative">
                <ResultComponent
                  config={{
                    status: 'warning',
                    title: error,
                    subTitle: '',
                    links: [],
                    messages: [],
                  }}
                />
              </div>
            ) : (
              <MoleculesList
                data={filteredCompanies}
                filtersComponent={
                  <div className="bg-zinc-100/50 p-4 rounded-lg">
                    <div className="mb-2 relative">
                      <AtomsPopoverHelpButton
                        side={companiesHelps.filtersCompany.side}
                        title={companiesHelps.filtersCompany.title}
                        className={companiesHelps.filtersCompany.className}
                        content={companiesHelps.filtersCompany.content}
                      />
                      <p className="text-md font-semibold text-zinc-900">{t("roundtable.filters.activityTitle")}</p>
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      <Select
                        placeholder={t("roundtable.filters.activityPlaceholder")}
                        onChange={setSelectedActivity}
                        allowClear
                        aria-label={t("roundtable.filters.activityPlaceholder")}
                        options={[
                          ...new Set(associatedCompanies.flatMap(item => item.actividades)),
                        ].map(activity => ({ value: activity, label: activity }))}
                        className="w-full"
                      />
                      <Select
                        placeholder={t("roundtable.filters.subsectorPlaceholder")}
                        onChange={setSelectedSubSector}
                        allowClear
                        aria-label={t("roundtable.filters.subsectorPlaceholder")}
                        options={[
                          ...new Set(associatedCompanies.flatMap(item => item.sub_sectores)),
                        ].map(subSector => ({ value: subSector, label: subSector }))}
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
                      <p className="text-md font-semibold text-zinc-900">{t("roundtable.filters.productTitle")}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      <Select
                        placeholder={t("roundtable.filters.chapterPlaceholder")}
                        onChange={setSelectedChapter}
                        allowClear
                        aria-label={t("roundtable.filters.chapterPlaceholder")}
                        options={[
                          ...new Set(associatedCompanies.flatMap(item => item.capitulos || [])),
                        ].map(chapter => ({ value: chapter, label: chapter }))}
                        className="w-full"
                      />
                      <Input
                        placeholder={t("roundtable.filters.codePlaceholder")}
                        value={selectedCode}
                        onChange={e => setSelectedCode(e.target.value)}
                        allowClear
                        aria-label={t("roundtable.filters.codePlaceholder")}
                        className="w-full"
                      />
                    </div>
                  </div>
                }
                onActionClick={() => {}}
                renderItemExtra={item => (
                  <img
                    width={272}
                    className="mask mask-squircle size-25"
                    alt="logo de empresa"
                    src={item.img_empresa || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
                  />
                )}
                renderItemMeta={item => ({
                  avatar: (
                    <p className="bg-primary p-3 rounded-full" aria-label="Ícono empresa">
                      <Building2 color="#b2e713" />
                    </p>
                  ),
                  title: (
                    <Link
                      to={`/roundtable/companies/${item.id_empresa}/${item.id_evento}/${item.mostrar_citas}`}
                      tabIndex={0}
                      aria-label={`Ver detalles de ${item.nombre_empresa}`}
                    >
                      {item.nombre_empresa}
                    </Link>
                  ),
                  description: (
                    <>
                      <p>{t("roundtable.company.rif")}: {item.rif || t("roundtable.company.noDescription")}</p>
                      <p>{t("roundtable.company.country")}: {item.pais || t("roundtable.company.noCountry")}</p>

                    </>
                  ),
                })}
                actions={[]}
              />
            )}
          </div>
        </>
      ) : (
        <div className="bg-white p-5 rounded-2xl mt-4 mb-4 relative">
          <ResultComponent
            config={{
              status: 'warning',
              title:  t("roundtable.noEvents.title"),
              subTitle: t("roundtable.noEvents.subtitle"),
              links: [
                <Button key="eventos" onClick={() => navigate('/event/feed')} aria-label="Ir a Eventos">
                  {t("roundtable.noEvents.button")}
                </Button>,
              ],
              messages: [],
            }}
          />
        </div>
      )}
    </>
  );
};

Companies.propTypes = {};

export default Companies;