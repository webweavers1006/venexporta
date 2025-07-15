import AtomsPanel from '@components/atoms/AtomsPanel';
import StepSignature from '@components/centerLogin/StepSignature';

const CompanyRegister = () => {
  return (
    <>
      <AtomsPanel title={'Empresa'} subtitle={'Registro de empresa'} />
      <div className="box">
        <StepSignature />
      </div>
    </>
  );
};

export default CompanyRegister;