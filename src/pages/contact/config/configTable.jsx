import columns from '../columns/columnsCompanyActivities';

export const getConfigTable = (data, loadActivitiesData) => ({
    title: 'Actividades Economicas',
    columns: ()=>columns(loadActivitiesData),
    data: data,
});