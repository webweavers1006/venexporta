
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

  return (
    <>
      <AtomsPanel title={'Rueda de Negocios'} subtitle={'Informacion sobre la rueda de negocios'} />
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
              title={'Carrusel de eventos'}
              subtitle={'Selecciona un evento para ver las empresas de la rueda de negocios'}
              aria-label="Carrusel de eventos"
              pageSize={3}
              sliderMode
              swipeThreshold={50}
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
                      <p className="text-md font-semibold text-zinc-900">Filtros de Empresa por Actividad / Sub sector</p>
                    </div>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      <Select
                        placeholder="Filtrar por Actividad"
                        onChange={setSelectedActivity}
                        allowClear
                        aria-label="Filtrar por Actividad"
                        options={[
                          ...new Set(associatedCompanies.flatMap(item => item.actividades)),
                        ].map(activity => ({ value: activity, label: activity }))}
                        className="w-full"
                      />
                      <Select
                        placeholder="Filtrar por Subsector"
                        onChange={setSelectedSubSector}
                        allowClear
                        aria-label="Filtrar por Subsector"
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
                      <p className="text-md font-semibold text-zinc-900">Filtros de Productos por Capitulo / Codigo</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                      <Select
                        placeholder="Filtrar por Capítulo"
                        onChange={setSelectedChapter}
                        allowClear
                        aria-label="Filtrar por Capítulo"
                        options={[
                          ...new Set(associatedCompanies.flatMap(item => item.capitulos || [])),
                        ].map(chapter => ({ value: chapter, label: chapter }))}
                        className="w-full"
                      />
                      <Input
                        placeholder="Filtrar por Código"
                        value={selectedCode}
                        onChange={e => setSelectedCode(e.target.value)}
                        allowClear
                        aria-label="Filtrar por Código"
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
                      <p>Rif: {item.rif || 'Sin descripción'}</p>
                      <p>Pais: {item.pais || 'No especificada'}</p>
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
              title: 'No se ha registrado en ningun evento.',
              subTitle: 'Aqui puede ver los eventos disponibles',
              links: [
                <Button key="eventos" onClick={() => navigate('/event/feed')} aria-label="Ir a Eventos">
                  Ir a Eventos
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