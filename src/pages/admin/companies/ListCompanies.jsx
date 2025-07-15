import { useState, useEffect, useRef } from 'react';
import appStore from '@store/appStore';
import AtomsPanel from '@components/atoms/AtomsPanel';
import { useStore } from 'zustand';
import { Building2 } from 'lucide-react'; // Cambiar el ícono a lucide-react
import { Link } from 'react-router';
import MoleculesList from "@components/molecules/MoleculesList";
import { Select, Input, message } from 'antd';
import AtomsPopoverHelpButton from '@components/atoms/AtomsPopoverHelpButton';
import {companiesHelps} from '@src/pages/roundtable/helps/companiesHelps';
import { fetchCompaniestAll } from '@lib/api/apiUser'; // Importar la función fetchCompaniestAll

const ListCompanies = () => {  
  const idCompany = useStore(appStore, state => state.idCompany);
  const [associatedCompanies, setAssociatedCompanies] = useState([]); // Nuevo estado para las empresas asociadas
  const [selectedRif, setSelectedRif] = useState(""); // Estado para el filtro de RIF
  const [selectedEmpresa, setSelectedEmpresa] = useState(""); // Nuevo estado para el filtro de empresa
  const listRef = useRef(null);

  // Llamar a fetchCompaniestAll al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companies = await fetchCompaniestAll();
        setAssociatedCompanies(companies);
      } catch (error) {
        message.error('Error al cargar las empresas');
      }
    };
    fetchData();
  }, []);

  // Filtrar empresas por RIF y empresa
  const filteredCompanies = associatedCompanies.filter((item) => {
    const matchesRif = selectedRif ? item.rif?.includes(selectedRif) : true;
    const matchesEmpresa = selectedEmpresa ? item.empresa?.toLowerCase().includes(selectedEmpresa.toLowerCase()) : true;
    return matchesRif && matchesEmpresa;
  });

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
                  value={selectedRif}
                  onChange={(e) => setSelectedRif(e.target.value)}
                  allowClear
                  className="w-full"
                />
                <Input
                  placeholder="Filtrar por Empresa"
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
                <p className='bg-primary p-3 rounded-full'>
                    <Building2 color="#b2e713" />
                </p>
                ),
                title: (
                <Link to={`/list/companies/${item.id}`}>
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
}

export default ListCompanies;