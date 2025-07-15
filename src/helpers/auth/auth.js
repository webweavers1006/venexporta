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