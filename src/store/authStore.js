import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools((set, get) => {
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('idUser');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    const isAuthenticated = !!token;
    const permissions = [];

    return {
      token: token || null,
      idUser: idUser || null,
      email: email || null,
      name: name || null,
      tipoUsuario: tipoUsuario || null,
      permissions: permissions || [],
      isAuthenticated: isAuthenticated,
      setToken: (token, idUser, email, name, tipoUsuario, permissions = []) => {

        localStorage.setItem('token', token);
        localStorage.setItem('idUser', idUser);
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
        localStorage.setItem('tipo_usuario', tipoUsuario);
        // permissions are set in-memory only; caller must pass them when logging in
        set({ token, idUser, email, name, tipoUsuario, permissions, isAuthenticated: true });
      },
      clearToken: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('idUser');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('tipo_usuario');
        // do not touch localStorage for permissions (permissions are in-memory)
        set({ token: null, idUser: null, email: null, name: null, tipoUsuario: null, permissions: [], isAuthenticated: false });
      },
      setPermissions: (perms) => {
        const next = perms || [];
        // store permissions only in memory
        set({ permissions: next });
      },
      addPermission: (perm) =>
        set((state) => {
          const next = Array.isArray(state.permissions) ? [...state.permissions] : [];
          if (!next.includes(perm)) next.push(perm);
          return { permissions: next };
        }),
      removePermission: (perm) =>
        set((state) => {
          const next = (state.permissions || []).filter((p) => p !== perm);
          return { permissions: next };
        }),
      hasPermission: (perm) => {
        const state = get();
        return Array.isArray(state.permissions) && state.permissions.includes(perm);
      },
    };
  })
);

export default useAuthStore;