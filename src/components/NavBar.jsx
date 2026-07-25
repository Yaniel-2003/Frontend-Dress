import { Link } from "react-router-dom";
import useLogout from "../auth/Logout";

const NavBar = () => {
    const cerrarSesion = useLogout();
        return (
        <nav className="bg-white shadow-md p-4 md:flex">
            <div className="container mx-auto flex justify-between items-center">
                <Link 
                    to="/" 
                    className="text-2xl font-bold text-green-500"
                >
                    Dress Shopy
                </Link>

                <div className="space-x-6">
                    <Link 
                        to="/" 
                        className="relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100"
                    >
                        Inicio
                    </Link>
                    <Link 
                        to="/catalogo" 
                        className="relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100"
                    >
                        Catálogo
                    </Link>
                    <Link 
                        to="/perfil" 
                        className="relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 "
                    >
                        Perfil
                    </Link>
                    <Link 
                        to="/articulos" 
                        className="relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 "
                    >
                        Articulos
                    </Link>
                </div>

                <div className="space-x-4">
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
        </nav>
    );
};

export default NavBar;