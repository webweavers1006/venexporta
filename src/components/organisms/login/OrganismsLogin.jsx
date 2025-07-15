import { LoginForm } from "@src/components/login-form"

const OrganismsLogin = ({ SelectCenter, insertSiteCenter, options, inputsConfig, buttonConfig, formRef, handleSubmit }) => {
    return (
        <div
            className="bg-login flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <LoginForm handleSubmit={handleSubmit} />
            </div>
            <div className="fixed text-sm bottom-0 left-0 right-0 flex h-10 text-white items-center justify-start bg-white/10  pl-4" style={{background: 'linear-gradient(to right, rgb(47 23 91) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 100%)'}}>
                <span className="mr-2">Desarrollado por:</span>
                <span className="font-bold mr-2">web.weavers.ea@gmail.com</span>
                <span className="text-green">{' V1.0'}</span>
            </div>
        </div>
    );
};

export default OrganismsLogin;