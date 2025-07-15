import CategoryForm from '@src/components/molecules/CategoryForm';
import { message } from 'antd';

const RegisterCategory = () => {
  const handleSubmit = async (data) => {
    try {
      console.log('Datos enviados:', data);
      message.success('Categoría registrada correctamente');
    } catch (error) {
      console.error('Error registrando la categoría:', error);
      message.error('Error al registrar la categoría');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Categoría</h1>
      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
};

export default RegisterCategory;
