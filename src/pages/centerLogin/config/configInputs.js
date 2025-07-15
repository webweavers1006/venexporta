import { useMemo } from 'react';

export const useInputConfig = () => {
    return useMemo(() => [
        {
            type: 'text',
            name: 'user',
            text: 'Correo',
            icon: 'fas fa-user'
        },
        {
            type: 'password',
            name: 'pass',
            text: 'Contraseña',
            icon: 'fas fa-user'
        },
    ], []);
};

export const useButtonConfig = (handleSubmit) => {
    return useMemo(() => ({
        text: 'Ingresar',
        event: handleSubmit
    }), [handleSubmit]);
};

export const useOptions = () => {
    return useMemo(() => [
        { label: 'Ingresar', value: 'Login' },
        { label: 'Registrar', value: 'Register' }
    ], []);
};