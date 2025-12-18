import axios from "axios";

const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function deleteToken() {
  localStorage.removeItem(TOKEN_KEY);
  return getToken() === null;
}

export function initAxiosInterceptors() {
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  axios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    response => response,
    error => {
      // Puedes manejar errores globales aquí si es necesario
      return Promise.reject(error);
    }
  );
}

// Busca un permiso por su campo `nombre` dentro del array `permissions`.
// Devuelve true si se encuentra; tolerante a estructuras inesperadas.
export function hasPermission(permissions, nombre) {
  if (!Array.isArray(permissions) || !nombre) return false;
  return permissions.some((p) => {
    if (!p) return false;
    // Algunos objetos pueden usar `nombre` o `name` o `code` según origen
    const n = p.nombre || p.name || p.nombre_permiso || p.code;
    if (!n) return false;
    return String(n).toLowerCase() === String(nombre).toLowerCase();
  });
}