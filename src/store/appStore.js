import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const appStore = create(
  devtools((set) => ({
    currentSection: 'Login',
    idCompany: null,
    nameCompany: null,
    idPais:null,
    setCurrentSection: (section) => set({ currentSection: section }),
    setCompany: (idCompany, nameCompany, idPais) => set({ idCompany, nameCompany, idPais: parseInt(idPais, 10) }),
    setIdCompany: (idCompany) => set({ idCompany }),
    setNameCompany: (nameCompany) => set({ nameCompany }),
    clearCompany: () => set({ idCompany: null, nameCompany: null, idPais: null }), 
    clearIdCompany: () => set({ idCompany: null }),
    clearNameCompany: () => set({ nameCompany: null }),
    setIdPais: (idPais) => set({ idPais }),
  }))
);

export default appStore;