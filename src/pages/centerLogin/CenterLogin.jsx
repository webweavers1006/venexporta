import { useState, useRef } from 'react';
import 'animate.css';

//✅ Components traduction
import { useTranslation } from "react-i18next";

// Componentes
import Register from '@components/centerLogin/Register';
import Login from '@components/organisms/login/OrganismsLogin';
import AtomsSelectCenter from '@components/atoms/AtomsSelectCenter';
import PopoverComponent from '@components/molecules/Popover';
import ayuda from '@assets/logo/ayuda.jpg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleHelp } from 'lucide-react';

// Helpers
import { filterComponents } from '@helpers/filters/filterComponents';

// Handlers y Configuraciones
import { useHandlers } from './handlers/handlersCenterLogin';
import { useInputConfig, useButtonConfig, useOptions } from './config/configInputs';

const CenterLoginRegister = () => {
    // Traducción
    const { t } = useTranslation();
    
    // Estado y Referencias
    const [siteCenter, insertSiteCenter] = useState('Login');
    const formRef = useRef(null);

    // Handlers
    const { handleSubmit, handleUserChange, handlePassChange } = useHandlers(formRef);

    // Configuraciones
    const inputsConfig = useInputConfig(handleUserChange, handlePassChange);
    const buttonConfig = useButtonConfig(handleSubmit);
    const options = useOptions();
    
    // Renderizado
    const Render = ({ ...rest }) => {
        return filterComponents(
            {
                Register: <Register {...rest} />,
                Login: <Login {...rest} formRef={formRef} />
            }, siteCenter);
        };

    return (
        <section className="hero is-fullheight">
            <div className="hero-body is-centered">
                <PopoverComponent trigger={<CircleHelp className='text-primary' />}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">{t("help_title")}</CardTitle>
                            <CardDescription>{t("help_description")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                <img src={ayuda} alt="ayuda" />
                            </CardDescription>
                        </CardContent>
                    </Card>
                </PopoverComponent>
                <Render SelectCenter={AtomsSelectCenter} buttonConfig={buttonConfig} inputsConfig={inputsConfig} insertSiteCenter={insertSiteCenter} options={options} />
            </div>
        </section>
    );
};

export default CenterLoginRegister;