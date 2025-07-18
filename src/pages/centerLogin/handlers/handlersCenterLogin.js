import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import { loginUser } from '@src/lib/api/apiIndex';
import useAuthStore from '@src/store/authStore';

export const useHandlers = () => {
    const navigate = useNavigate();
    const { setToken } = useAuthStore();

    const handleSubmit = useCallback(async (data) => {
        const datas = {
            user: data.user,
            pass: data.pass
        };
        try {
            const response = await loginUser({ ...datas });
            const { token, id, email, name, tipo_usuario } = response;
            setToken(token, id, email, name, tipo_usuario);
            message.success('Login exitoso');
            navigate('/'); // Redirigir al usuario a la ruta '/'
        } catch (error) {
            message.error(error.response.data.error.message);
        }
    }, [navigate, setToken]);

    return {
        handleSubmit
    };
};