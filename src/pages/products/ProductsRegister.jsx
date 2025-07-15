
import AtomsPanel from '@components/atoms/AtomsPanel';
import ProductForm from '@components/ProductForm';
const RegisterProducts = () => {  

  return (
    <>
      <AtomsPanel title={'Productos'} subtitle={'Registro de productos'} />
      <div className="flex flex-col gap-6 mt-4">
        <ProductForm />
      </div>
    </>
  );
}

export default RegisterProducts;