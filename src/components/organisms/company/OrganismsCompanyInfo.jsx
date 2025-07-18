import AtomsPanel from '@components/atoms/AtomsPanel';
import { Image } from 'antd';
import MoleculesTable from '@components/molecules/tables/MoleculesTable';
import { Descriptions, Badge, Button, Image as Img } from 'antd';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import UpdateCompanyDialog from "@components/organisms/company/OrganismsUpdateCompanyDialog";
import { useState, useEffect } from 'react';
import ImageUpload from '@components/molecules/upload/MoleculesImageUpload';
import { Link } from 'react-router';
import { fetchProductsByCompany } from '@src/lib/api/apiIndex';
import appStore from '@store/appStore';
import MoleculesList from "@components/molecules/MoleculesList";

const CompanyInfo = ({ companyData, configTableContact, configTable, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]); // Estado para los productos del carrusel
  const idCompany = appStore.getState().idCompany; // Obtener idCompany desde appStore
  const idPais = appStore.getState().idPais; // Obtener idPais desde appStore

  useEffect(() => {
    if (idPais === null || idPais === undefined || idPais === 95) {
      const loadProducts = async () => {
        try {
          const products = await fetchProductsByCompany(idCompany);
          const formattedProducts = products.map((product) => ({
            url: product.img === "no hay imagen cargada" 
              ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5F52ynaRIN577hgyivShpnSw6iHDH_dDAg&s" 
              : product.img, // Usar imagen por defecto si el valor es "no hay imagen cargada"
            nombre: product.nombre_producto,
            codigo_arancelario: product.codigo_arancelario || "Sin descripción", 
            capitulo: product.capitulo || "No especificado", // Dato adicional opcional
          }));
          setCarouselItems(formattedProducts);
        } catch (error) {
          console.error('Error loading products:', error);
        }
      };

      loadProducts();
    }
  }, [idCompany, idPais]);

  const items = [
    {
      label: 'Nombre',
      children: companyData.empresa,
    },
    {
      label: 'Rif',
      span: 'filled',
      children: companyData.rif,
    },
    {
      label: 'Actividad Empresarial',
      span: 'filled',
      children: <Badge status="processing" text={companyData.tipo_actividad_empresarial} />,
    },
    {
      label: 'Tipo Propiedad',
      span: 'filled',
      children: <Badge color='green' text={companyData.tipo_propiedad} />,
    },
    // Solo mostrar estos campos si idPais === 95
    ...(idPais === 95 ? [
      {
        label: 'Estado',
        children: companyData.estado,
      },
      {
        label: 'Municipio',
        children: companyData.municipio,
      },
      {
        label: 'Parroquia',
        children: companyData.parroquia,
      },
    ] : []),
    {
      label: 'Dirección',
      span: 1,
      children: companyData.direccion,
    },
  ];

  return (
    <>
      <AtomsPanel title={'Empresa'} subtitle={'Información de la empresa registrada'}>
        {companyData.img_empresa ? (
          <Image src={companyData.img_empresa} alt="imagen" width={100} />
        ) : (
          <ImageUpload
            companyId={companyData.id}
            fileType={["image/png", "image/jpeg"]}
            fileNameType="PNG - JPG"
            fileNumber={1}
            sendImage={true}
            color={'#fff'}
          />
        )}
      </AtomsPanel>
      <div className="box bg-white rounded-2xl mt-4 p-4">
        <Dialog open={open} onOpenChange={setOpen} className="bg-white">
          <DialogTrigger asChild className="float-right">
            <Button type="primary" onClick={() => setOpen(true)}>Editar Empresa</Button>
          </DialogTrigger>
          <UpdateCompanyDialog companyData={companyData} onClose={() => setOpen(false)} onUpdate={onUpdate} />
        </Dialog>
        <Descriptions bordered title="Empresa" items={items} />
      </div>
      {idPais === null || idPais === undefined || idPais === 95 ? (
        <div className="box bg-white rounded-2xl mt-4 p-4">
          <Link to="/products" className='float-right'>
            <Button type="primary">Mis productos</Button>
          </Link>
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Productos</h2>
          {/* Mostrar los productos como lista en vez de carrusel */}
          <MoleculesList
            pageSize={3}
            data={carouselItems}
            renderItemMeta={(item) => ({
              title: item.nombre,
              description: (
                <>
                  <p>codigo arancelario: {item.codigo_arancelario || "Sin codigo"}</p>
                  <p>Capitulo: {item.capitulo || "No especificada"}</p>
                </>
              ),
            })}
            renderItemExtra={(item) => (
              <Img
                src={item.url}
                alt={item.nombre} 
                className='mask mask-squircle'
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
              />
            )}
            actions={[]}
          />
        </div>
      ) : null}
      <div className="box bg-white rounded-2xl mt-4 p-4">
      <h2 className="text-xl font-semibold text-zinc-900">Contactos</h2>
        <Link to="/contacts" className='float-right'>
          <Button type="primary">Agregar Contacto</Button>
        </Link>
        <MoleculesTable config={configTableContact} />
      </div>
      <div className="box bg-white rounded-2xl mt-4 p-4">
        <h2 className="text-xl font-semibold text-zinc-900">Actividades Economicas</h2>
        <Link to="/activities" className='float-right'>
          <Button type="primary">Agregar Actividad Economica</Button>
        </Link>
        <MoleculesTable config={configTable} />
      </div>
    </>
  );
};

export default CompanyInfo;