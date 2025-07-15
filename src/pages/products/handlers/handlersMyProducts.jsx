import { Modal, message } from 'antd';
import { deleteProductById } from '@src/lib/api/apiUser';

export const handleDeleteProduct = async (id, loadProductsData) => {
  Modal.confirm({
    title: 'Confirmación',
    content: '¿Está seguro de que desea eliminar este producto?',
    okText: 'Sí',
    cancelText: 'No',
    onOk: async () => {
      try {
        await deleteProductById(id);
        message.success('Producto eliminado exitosamente');
        loadProductsData();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        message.error(error.response.data.error.message);
      }
    },
  });
};
