import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/registerSchema";
import { cn } from "@src/lib/utils";
import { message } from "antd";
import { Button } from "@src/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { postStepIdentification } from '@lib/api/apiIndex';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@src/components/ui/card";
import { Form } from "@src/components/ui/form";
import RegisterFormFields from "@src/components/molecules/RegisterFormFields";
import CompanyFormFields from "@src/components/molecules/CompanyFormFields";


export function RegisterForm({ className, ...props }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            id_role: "",
            identification: "",
            pass: "",
            nombreEmpresa: "",
            rif: "",
            telefono: "",
            idPais: "",
            idPaisCodigo: "",
            codigoArea: "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await postStepIdentification({
                user:{
                    name: data.name,
                    email: data.email,
                    id_role: 12,
                    identification: data.identification,
                    pass: data.pass,
                },
                empresa:{
                    nombre_empresa: data.nombreEmpresa,
                    rif: data.rif,
                    id_pais:data.idPais
                },
                telefono: '+'+data.codigoArea+data.telefono,
                
            });

            setSuccess(true);
            setTimeout(() => {
                setLoading(false);
                props.insertStep(2);
                navigate('/login');
            }, 2000);
        } catch (error) {
            setLoading(false);
            message.error(error.response.data.error.message); // Mostrar mensaje de error

        }
    };

    return (
        <div className={cn("flex flex-col gap-6 mt-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Registrar Usuario</CardTitle>
                    <CardDescription>
                        Complete el formulario para registrar un nuevo usuario
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <RegisterFormFields form={form} loading={loading} />
                            <hr className="my-6" />
                            <CompanyFormFields form={form} />
                            <Button type="submit" className="w-full mt-5" disabled={loading}>
                                {loading ? 'Registrando...' : 'Registrar'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-center text-sm text-white">
                Ya posees una cuenta?{" "}
                <Link to="/login" className="underline underline-offset-4">
                    Iniciar Sesión
                </Link>
            </div>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                Al hacer clic en Continuar, acepta nuestros Términos de servicio y Política de privacidad.
            </div>
        </div>
    );
}

export default RegisterForm;
