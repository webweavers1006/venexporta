import React, { useState } from 'react';

// Importar los componentes necesarios
import StepNameL from './StepIdentification';
import Steps from '@components/molecules/steps/MoleculesSteps';
import { Link } from 'react-router';
import { filterComponents } from '@helpers/filters/filterComponents';
import ResultComponent from '@components/molecules/result/MoleculesResult';
import AtomsLink from '@components/atoms/AtomsLink';

const Register = ({ SelectCenter, insertSiteCenter, options}) => {
    const config ={
        status:"success",
        title:"Registro exitoso",
        subtitle:"Se ha registrado exitosamente su empresa",
        links:[
            <AtomsLink key={0}config={{link:"/signup", text:"Volver al inicio"}}/>
        ]
    }
    const [register, insertRegister] = useState({
        nombre: "",
        apellido: "",
        identificacion: "",
        telefono: "",
        correo: "",
        clave: "",
        id_rol: 2,
        cargo: "",
        id_empresa: ""
    });

    const [bufetes, insertBufetes] = useState({
        nombre_empresa: "",
        rif: "",
        id_tipo_actividad_empresarial: "",
        id_tipo_propiedad: "",
        id_estado: "",
        id_municipio: "",
        id_parroquia: "",
        direccion: "",
        id_user: ""
    });

    const [step, insertStep] = useState(1);

    const Render = ({ ...rest }) => {
        return filterComponents(
            {
                1: <StepNameL {...rest} />,
                2: <ResultComponent {...rest} />,
            }, step);
    };

    return (
        <React.Fragment>

            {step === 2 ? (
                <ResultComponent config={config}/>
            ) : (
                <div className="box z-index-1 animate__animated animate__fadeInRight p-[3rem]">
                    <SelectCenter insertSiteCenter={insertSiteCenter} options={options} site='Register' />
                    <div className='mb-5 mr-5 ml-5'>
                        <p className='is-size-7 has-text-centered '>Ingrese los datos solicitados para continuar con el proceso</p>
                    </div>
                    <Steps
                        number={2}
                        numberActive={step}
                        insertStep={insertStep}
                        key={step}
                        titles={{ title1: 'Usuario y Credenciales', title2:"Registro exitoso"  }}
                    />
                    <Render insertStep={insertStep} config={config} insertRegister={insertRegister} register={register} bufetes={bufetes} insertBufetes={insertBufetes} insertSiteCenter={insertSiteCenter} />
                    <div className='mb-4'>
                        <Link to="/recuperar/contrasena">
                            <p className='is-size-7 has-text-centered has-text-grey'>Recuperar contraseña</p>
                        </Link>
                    </div>
                    <div className='mb-4'>                    
                        <p className='is-size-8 has-text-centered has-text-grey'>2025 | Agencia de Promoción de Exportaciones</p>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default Register;