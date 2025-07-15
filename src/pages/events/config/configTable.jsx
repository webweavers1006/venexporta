import columns from '../columns/columnsEventsCompany';
import { handleRegister } from '../handlers/handlersRegisterCompany';
import { useNavigate } from 'react-router';

export const getConfigTable = (data, idCompany, navigate) => ({
    title: 'Lista de Eventos',
    columns: columns,
    data: data,
    handleRegister: (id) => handleRegister(id,idCompany, navigate), // Pasar idCompany al handler
});