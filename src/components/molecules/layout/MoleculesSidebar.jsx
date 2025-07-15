import React from 'react';
import logo from '@assets/logo/denominativaB.png';
import { NavLink, useNavigate } from 'react-router';
import useAuthStore from '@src/store/authStore';

const Sidebar = ({links}) => {
    const navigate = useNavigate();
    const { clearToken } = useAuthStore();

    const handleLogout = () => {
        clearToken();
        navigate('/signup');
    };

    return (
        <aside className="inset-y-0 flex-wrap items-center bg-white h-[96vh] justify-between w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 -translate-x-full bg-red border-0 shadow-xl dark:shadow-none dark:bg-red-850 max-w-[24rem] ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0" aria-expanded="false">
            <div className="h-19">
                <i className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times dark:text-white text-slate-400 xl:hidden"></i>
                <a className="inline px-8 py-6 m-0 text-base whitespace-nowrap dark:text-white text-slate-700" href="#" target="_blank">
                    <img src={logo} className="table mx-auto h-full max-w-full transition-all duration-200 dark:hidden ease-nav-brand max-h-8" alt="main_logo" />
                </a>
            </div>

            <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />

            <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
                <ul className="flex flex-col pl-0 mb-0">
                    {links.map((link, index) => (
                        <li key={index} className="mt-0.5 w-full">
                            <NavLink
                                className={`py-2.7 dark:text-white dark:opacity-80 text-base ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 text-slate-700 transition-colors ${link.disabled ? 'pointer-events-none opacity-50' : ''}`}
                                to={link.path}
                            >
                                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                                    <i className={`relative top-0 text-base leading-normal ${link.icon}`}></i>
                                </div>
                                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease text-gray-600">{link.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 absolute bottom-0 w-full">
                <button
                    className="button is-fullwidth bg-primary text-white"
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;