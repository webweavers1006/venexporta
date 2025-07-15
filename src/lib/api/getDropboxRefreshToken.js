import { Dropbox } from 'dropbox';
import { DROPBOX_CLIENT_ID, DROPBOX_CLIENT_SECRET } from './variables';

// Devuelve la URL de autorización para iniciar el flujo OAuth2
export function getDropboxAuthUrl(redirectUri) {
  return `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&token_access_type=offline`;
}

// Intercambia el code por access_token y refresh_token
export async function exchangeCodeForDropboxRefreshToken(code, redirectUri) {
  if (!code || !redirectUri) throw new Error('Code y redirectUri son requeridos');
  const dbx = new Dropbox({ clientId: DROPBOX_CLIENT_ID, clientSecret: DROPBOX_CLIENT_SECRET });
  const token = await dbx.auth.getAccessTokenFromCode(redirectUri, code);
  // token.result.refresh_token contiene el refresh_token
  return token.result;
}

// Uso típico (ejemplo):
// const authUrl = getDropboxAuthUrl('http://localhost:3000/callback');
// window.location.href = authUrl;
// ...en tu callback, obtén el code de la URL y llama a exchangeCodeForDropboxRefreshToken(code, redirectUri)
