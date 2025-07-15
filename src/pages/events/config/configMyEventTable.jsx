import columns from '../columns/columnsMyEventCompany';
import { handleRegister } from '../handlers/handlersRegisterCompany';

export const getConfigTable = (data, idCompany, loadEventsData) => ({
    title: 'Lista de Eventos',
    columns: () =>columns(handleRegister, idCompany, loadEventsData),
    data: data
});