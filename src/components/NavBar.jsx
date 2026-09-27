import { useState } from "react";
import { Link } from "react-router-dom";
import useLogout from "../auth/Logout";
import { useCarrito } from "../context/CarritoContext";

const BotonCarritoFlotante = () => {
    const { cantidad } = useCarrito();

    return (
        <Link
            to="/carrito"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.87-4.788 2.202-7.402.052-.406-.278-.75-.687-.75H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
            </svg>

            {cantidad > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white">
                    {cantidad}
                </span>
            )}
        </Link>
    );
};

const NavBar = () => {
    const cerrarSesion = useLogout();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const botonMenuWeb = 'relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100';
    const botonMenuMovil = 'relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100';

    return (
        <>
        <nav className="bg-white shadow-md p-4 relative z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link
                    to="/home"
                    className="text-2xl font-bold text-green-500"
                >
                    Dress Shopy
                </Link>

                {/* Botón de Menú para Móviles */}
                <button 
                    className="md:hidden text-gray-600 hover:text-green-500 focus:outline-none"
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuAbierto ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Menú de Desktop */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link 
                        to="/home" 
                        className={botonMenuWeb}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/home"
                        className={botonMenuWeb}
                    >
                        Productos
                    </Link>
                    <Link 
                        to="/perfil" 
                        className={botonMenuWeb}
                    >
                        Perfil
                    </Link>
                    <Link 
                        to="/articulos" 
                        className={botonMenuWeb}
                    >
                        Articulos
                    </Link>

                    <Link 
                        to="/carrito"
                        className={botonMenuWeb}
                        >
                        Carrito
                    </Link>
                </div>

                <div className="hidden md:block">
                    <button
                        onClick={cerrarSesion}
                        className="group flex items-center justify-start w-11 h-11 bg-red-50 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                    >
                        <div
                            className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="red">
                            <path
                                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                            ></path>
                            </svg>
                        </div>
                        <div
                            className="absolute right-5 transform translate-x-full opacity-0 text-red-600 text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        >
                            Cerrar
                        </div>
                    </button>
                </div>
            </div>

            {/* Menú Desplegable para Móviles */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col overflow-hidden transition-all duration-300 ${menuAbierto ? "max-h-64 py-4" : "max-h-0"}`}>
                <div className="flex flex-col px-6 space-y-4">
                    <Link
                        to="/home"
                        onClick={() => setMenuAbierto(false)}
                        className={botonMenuMovil}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/home"
                        onClick={() => setMenuAbierto(false)}
                        className={botonMenuMovil}
                    >
                        Catálogo
                    </Link>
                    <Link 
                        to="/perfil" 
                        onClick={() => setMenuAbierto(false)} 
                        className={botonMenuMovil}
                    >
                        Perfil
                    </Link>
                    <Link 
                        to="/articulos" 
                        onClick={() => setMenuAbierto(false)} 
                        className={botonMenuMovil}
                    >
                        Articulos
                    </Link>
                    <Link
                        to="/carrito"
                        onClick={() => setMenuAbierto(false)}
                        className={botonMenuMovil}
                    >
                        Carrito
                    </Link>
                    <div className="pt-2 border-t border-gray-100">
                        <button 
                            onClick={cerrarSesion} 
                            className="flex items-center gap-2 text-red-500 font-medium w-full text-left"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">
                                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <BotonCarritoFlotante />
        </>
    );
};

export default NavBar;