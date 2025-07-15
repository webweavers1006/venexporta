import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentSection, setCurrentSection] = useState('Login');

    return (
        <AppContext.Provider value={{ currentSection, setCurrentSection }}>
            {children}
        </AppContext.Provider>
    );
};