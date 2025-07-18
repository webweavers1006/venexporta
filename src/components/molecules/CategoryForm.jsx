import { useState, useEffect } from "react";
import { fetchProductCategories } from "@src/lib/api/apiIndex";
import { Table, Button, message } from "antd"; // Importar Button y message de Ant Design
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card";
import categoryColumns from "@src/config/categoryColumns"; // Importar las columnas

const CategoryForm = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const isMobile = window.innerWidth <= 768; // Detectar si es un teléfono móvil

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchProductCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 768) { // Validar si el ancho de la ventana es menor o igual a 768
      message.info("Es recomendable poner el teléfono en horizontal para una mejor experiencia.", 1.5); // Duración de 1.5 segundos
    }
  }, []); // Mostrar mensaje siempre que se renderice el componente

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Lista de Categorías</CardTitle>
        <div className="flex justify-end mt-2">
          <Button
            type="primary"
            href="http://spgoin.imprentanacional.gob.ve/cgi-win/be_alex.cgi?Documento=T028700046587/0&Nombrebd=spgoin&CodAsocDoc=3607&t04=1&t05=png&SFmt=&Sesion=1047923959"
            target="_blank"
            rel="noopener noreferrer"
          >
            Más información sobre este tema aquí.
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table
          className="custom-table" // Clase personalizada para estilos
          columns={categoryColumns(onCategorySelect)} // Usar las columnas importadas
          dataSource={categories}
          pagination={{
            defaultPageSize: isMobile ? 5 : 7, // Cambiar el tamaño de página según el dispositivo
            pageSizeOptions: ['5', '7', '10', '20', '30']
          }}
          scroll={{
            x: isMobile ? 1000 : undefined, // Habilitar scroll horizontal solo en móvil
            y: isMobile ? 300 : undefined, // Habilitar scroll vertical solo en móvil
          }}
          rowKey="id"
        />
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
