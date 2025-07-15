import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools((set) => {
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    const isAuthenticated = !!token;

    return {
      token: token || null,
      idUser: idUser || null,
      email: email || null,
      name: name || null,
      tipoUsuario: tipoUsuario || null,
      isAuthenticated: isAuthenticated,
      setToken: (token, idUser, email, name, tipoUsuario) => {

        localStorage.setItem('token', token);
        localStorage.setItem('idUser', idUser);
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
        localStorage.setItem('tipo_usuario', tipoUsuario);
        set({ token, idUser, email, name, tipoUsuario, isAuthenticated: true });
      },
      clearToken: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('idUser');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('tipo_usuario');
        set({ token: null, idUser: null, email: null, name: null, tipoUsuario: null, isAuthenticated: false });
      },
    };
  })
);

export default useAuthStore;