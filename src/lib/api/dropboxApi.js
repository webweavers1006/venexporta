// Archivo: src/lib/api/dropboxApi.js
// Conexión a Dropbox usando el SDK oficial y el token apiKeyArchivos
import { Dropbox } from 'dropbox';
import { apiKeyArchivos, DROPBOX_CLIENT_ID, DROPBOX_CLIENT_SECRET, DROPBOX_REFRESH_TOKEN, DROPBOX_ACCESS_TOKEN } from './variables';

let currentAccessToken = DROPBOX_ACCESS_TOKEN;

// Devuelve una nueva instancia de Dropbox autenticada con el token actual
export function dbx() {
  return new Dropbox({
    accessToken: currentAccessToken,
    fetch: window.fetch.bind(window),
  });
}

// Refresca el access token usando el refresh token
export async function refreshDropboxAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', DROPBOX_REFRESH_TOKEN);
  params.append('client_id', DROPBOX_CLIENT_ID);
  params.append('client_secret', DROPBOX_CLIENT_SECRET);

  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  if (!response.ok) throw new Error('No se pudo refrescar el access token de Dropbox');
  const data = await response.json();
  currentAccessToken = data.access_token;
  // Ya no se usa setAccessToken, solo se actualiza currentAccessToken
  return currentAccessToken;
}

// Función para asegurar que el access token es válido antes de cada llamada
async function ensureDropboxTokenValid() {
  // Dropbox tokens duran 4 horas, pero aquí podrías agregar lógica para refrescar si falla una petición
  // Por simplicidad, refrescamos si alguna petición devuelve 401
}

// Ejemplo de función para subir un archivo
export async function uploadFileToDropbox(path, file) {
  try {
    const response = await dbx().filesUpload({
      path,
      contents: file,
    });
    return response;
  } catch (error) {
    // Si el error es de autenticación, intenta refrescar el token y reintenta una vez
    if (error?.status === 401 || error?.error?.error_summary?.includes('expired_access_token')) {
      await refreshDropboxAccessToken();
      try {
        const response = await dbx().filesUpload({
          path,
          contents: file,
        });
        return response;
      } catch (err) {
        console.log('Error al subir archivo a Dropbox tras refrescar token:', err);
        throw err;
      }
    }
    console.log('Error al subir archivo a Dropbox:', error);
    throw error;
  }
}

// Ejemplo de función para listar archivos en una carpeta
export async function listFilesInDropboxFolder(folderPath = '') {
  try {
    const response = await dbx().filesListFolder({ path: folderPath });
    return response.entries;
  } catch (error) {
    if (error?.status === 401 || error?.error?.error_summary?.includes('expired_access_token')) {
      await refreshDropboxAccessToken();
      try {
        const response = await dbx().filesListFolder({ path: folderPath });
        return response.entries;
      } catch (err) {
        throw err;
      }
    }
    throw error;
  }
}

export async function getDropboxSharedLink(fileId) {
  try {
    let tempLinkResponse = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: fileId })
    });
    if (tempLinkResponse.status === 401) {
      await refreshDropboxAccessToken();
      tempLinkResponse = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: fileId })
      });
    }
    if (!tempLinkResponse.ok) throw new Error('Error al obtener temporary link de Dropbox');
    const tempLinkData = await tempLinkResponse.json();
    const tempLink = tempLinkData.link;
    const path_display = tempLinkData.metadata.path_display;

    // 2. Obtener el enlace compartido (share link) para vista previa
    let shareLink = null;
    let shareResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: path_display })
    });
    if (shareResponse.status === 401) {
      await refreshDropboxAccessToken();
      shareResponse = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: path_display })
      });
    }
    if (shareResponse.ok) {
      const shareData = await shareResponse.json();
      shareLink = shareData.url;
    } else {
      // Si ya existe, buscar el enlace existente
      let listResponse = await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: path_display, direct_only: true })
      });
      if (listResponse.status === 401) {
        await refreshDropboxAccessToken();
        listResponse = await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: path_display, direct_only: true })
        });
      }
      if (listResponse.ok) {
        const listData = await listResponse.json();
        if (listData.links && listData.links.length > 0) {
          shareLink = listData.links[0].url;
        }
      }
    }
    return { tempLink, shareLink };
  } catch (error) {
    console.error('Error al obtener enlaces de Dropbox:', error);
    throw error;
  }
}
