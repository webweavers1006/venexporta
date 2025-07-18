import { useState, useCallback } from 'react';
import { message } from 'antd';
import { fetchDocumentosByEmpresa, createDocumentoEmpresa, deleteDocumentoEmpresa } from '@src/lib/api/apiIndex';
import { uploadFileToDropbox, getDropboxSharedLink } from '@src/lib/api/dropboxApi';

/**
 * Hook personalizado para gestionar documentos de una empresa.
 * @param {string|number} companyId - ID de la empresa.
 * @returns {object} Estado y acciones para los documentos.
 */
export function useCompanyDocuments(companyId) {
  const [documentos, setDocumentos] = useState([]);
  const [documentosConLink, setDocumentosConLink] = useState([]);

  // Cargar documentos y links
  const loadDocumentos = useCallback(async () => {
    if (!companyId) return;
    const docs = await fetchDocumentosByEmpresa(companyId);
    setDocumentos(docs);
    const docsWithLinks = await Promise.all(
      docs.map(async (doc) => {
        let url = doc.url_documento;
        try {
          url = await getDropboxSharedLink(doc.url_documento);
        } catch (e) {
          // Si falla, deja la url original
        }
        return { ...doc, url_dropbox: url };
      })
    );
    setDocumentosConLink(docsWithLinks);
  }, [companyId]);

  // Subir documento
  const handleDocCompaniesSubmit = useCallback(async (data) => {
    let hideLoading;
    try {
      if (!data.archivo) {
        message.error('Debe seleccionar un archivo PDF.');
        return;
      }
      hideLoading = message.loading('Cargando archivo, por favor espere...', 0);
      const dropboxPath = `/empresas/${companyId}/${data.archivo.name || 'documento'}`;
      const val = await uploadFileToDropbox(dropboxPath, data.archivo);
      if(val.result.id) {
        await createDocumentoEmpresa({
          url_documento: val.result.id,
          id_empresa: companyId,
          id_tipo_archivo: data.tipo
        });
        message.success('El archivo se cargó correctamente');
        await loadDocumentos();
      }
    } catch (error) {
      message.error('Error al subir archivo o registrar documento');
    } finally {
      if (hideLoading) hideLoading();
    }
  }, [companyId, loadDocumentos]);

  // Eliminar documento
  const handleDeleteDocumento = useCallback(async (itemId) => {
    let hideLoading;
    try {
      hideLoading = message.loading('Borrando archivo, por favor espere...', 0);
      await deleteDocumentoEmpresa(itemId);
      message.success('Documento eliminado correctamente');
      await loadDocumentos();
    } catch (error) {
      message.error('Error al eliminar el documento');
    } finally {
      if (hideLoading) hideLoading();
    }
  }, [loadDocumentos]);

  return {
    documentos,
    documentosConLink,
    loadDocumentos,
    handleDocCompaniesSubmit,
    handleDeleteDocumento,
  };
}
