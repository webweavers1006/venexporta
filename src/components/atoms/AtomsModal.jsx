import { Modal } from 'antd';

const AtomsModal = ({ isActive, onClose, title, children }) => {
  return (
    <Modal
      classNames="w-full"
      title={title}
      open={isActive}
      onCancel={onClose}
      footer={null}
      width={{
        xs: '90%',
        sm: '90%',
        md: '90%',
        lg: '90%',
        xl: '90%',
        xxl: '90%',
      }}
      getContainer={false} // Asegura que el modal y sus elementos hijos se rendericen en el mismo contenedor
    >
      {children}
    </Modal>
  );
};

export default AtomsModal;