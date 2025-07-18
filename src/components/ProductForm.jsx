import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@src/components/ui/card";
import ProductFormFields from "@src/components/molecules/ProductFormFields";
import { message } from "antd";
import { postProduct } from "@src/lib/api/apiIndex";
import appStore from "@src/store/appStore";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const ProductForm = ({ onSubmit }) => {
  const idCompany = appStore.getState().idCompany; // Obtener idCompany desde AppStore
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id_producto: data.categoria_producto, // Cambiar categoria_producto por id_producto
        id_empresa: idCompany, // Agregar id_empresa desde AppStore
        img: data.img || "no hay imagen cargada", // Manejar caso en que img esté vacío
      };
      delete payload.categoria_producto; // Eliminar categoria_producto del payload

      await postProduct(payload);
      message.success("Producto creado satisfactoriamente"); // Mostrar mensaje de éxito
      navigate("/company"); // Redirigir a /company
    } catch (error) {
      console.error("Error al registrar el producto:", error);
      message.error("Error al registrar el producto"); // Mostrar mensaje de error
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Registro de Producto</CardTitle>
        <CardDescription>Complete los campos requeridos</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductFormFields submit={handleSubmit} />
      </CardContent>
    </Card>
  );
};

export default ProductForm;
