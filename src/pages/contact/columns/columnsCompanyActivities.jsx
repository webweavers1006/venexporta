import React from 'react';
import { Button, Modal, message } from 'antd';
import { deleteContact } from '@src/lib/api/apiIndex';

//✅Components traduction
import { useTranslation } from "react-i18next";

export const useContactsColumns = (loadActivitiesData) => {
  const { t } = useTranslation();

  const handleDelete = async (id) => {
    Modal.confirm({
      title: t('contactsTable.delete.confirmTitle'),
      content: t('contactsTable.delete.confirmContent'),
      okText: t('ok'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await deleteContact(id);
          message.success(t('contactsTable.delete.success'));
          if (typeof loadActivitiesData === 'function') loadActivitiesData();
        } catch (error) {
          message.error(t('contactsTable.delete.error'));
        }
      },
    });
  };

  const getActivitiesColumn = () => ({
    title: t('contactsPanel.fields.name'),
    dataIndex: 'nombre',
    key: 'nombre',
    sorter: (a, b) => a.actividad_economica.localeCompare(b.actividad_economica),
  });

  const getSectorColumn = () => ({
    title: t('contactsPanel.fields.email'),
    dataIndex: 'correo',
    responsive: ['md'],
    key: 'correo',
    sorter: (a, b) => a.sector_productivo.localeCompare(b.sector_productivo),
  });

  const getSubActivtiesColumn = () => ({
    title: t('contactsPanel.fields.phone'),
    dataIndex: 'telefono',
    responsive: ['md'],
    key: 'telefono',
    sorter: (a, b) => a.telefono.localeCompare(b.telefono),
  });

  const getCargoColumn = () => ({
    title: t('contactsPanel.fields.position'),
    dataIndex: 'cargo',
    responsive: ['md'],
    key: 'cargo',
    sorter: (a, b) => a.telefono.localeCompare(b.telefono),
  });

  const getActionsColumn = () => ({
    title: t('contactsTable.columns.actions'),
    key: 'acciones',
    render: (text, record) => (
      <Button
        type="primary"
        danger
        onClick={() => handleDelete(record.id)}
        aria-label={t('contactsTable.columns.deleteAria')}
      >
        {t('contactsTable.columns.deleteButton')}
      </Button>
    ),
  });

  return [
    getActivitiesColumn(),
    getSectorColumn(),
    getCargoColumn(),
    getSubActivtiesColumn(),
    getActionsColumn(),
  ];
};

export default useContactsColumns;