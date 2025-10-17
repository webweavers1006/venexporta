import React from 'react';
import { Button, Modal, message } from 'antd';
import { deleteActivityByCompany } from '@src/lib/api/apiIndex';

//✅Components traduction
import { useTranslation } from "react-i18next";

export const useActivitiesColumns = (loadActivitiesData) => {
// Traducción
const { t } = useTranslation();

const handleDelete = async (id) => {
  Modal.confirm({
    title: t('contactsTable.delete.confirmTitle'),
    content:  t('activitiesTable.delete.confirmContent'),
    okText: t("activitiesPanel.common.yes"),
    cancelText: t('cancel'),
    onOk: async () => {
      try {
        await deleteActivityByCompany(id);
        message.success(t('activitiesTable.delete.success'));
        loadActivitiesData();
      } catch (error) {
        message.error(t('activitiesTable.delete.error'));
      }
    },
  });
};

const getActivitiesColumn = () => ({
  title: t('activitiesPanel.fields.activity'),
  dataIndex: 'actividad_economica',
  key: 'actividad',
  sorter: (a, b) => a.actividad_economica.localeCompare(b.actividad_economica),
});

const getSectorColumn = () => ({
  title: t('activitiesPanel.fields.sector'),
  dataIndex: 'sector_productivo',
  responsive: ['md'],
  key: 'sector_productivo',
  sorter: (a, b) => a.sector_productivo.localeCompare(b.sector_productivo),
});

const getSubActivtiesColumn = () => ({
  title:  t('activitiesPanel.fields.subSector'),
  dataIndex: 'sub_sector_productivo',
  responsive: ['md'],
  key: 'sub_sector_productivo',
  sorter: (a, b) => a.sub_sector_productivo.localeCompare(b.sub_sector_productivo),
});

const getActionsColumn = (loadActivitiesData) => ({
  title:  t('contactsTable.columns.actions'),
  key: 'acciones',
  render: (text, record) => (
    <Button
      type="primary"
      danger
      onClick={() => handleDelete(record.id, loadActivitiesData)}
    >
       {t('contactsTable.columns.deleteButton')}
    </Button>
  ),
});

 return [
    getActivitiesColumn(),
    getSectorColumn(),
    getSubActivtiesColumn(),
    getActionsColumn(),
  ];
};

export default useActivitiesColumns;