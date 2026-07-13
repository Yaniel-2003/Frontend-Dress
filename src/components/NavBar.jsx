import { Link } from "react-router-dom";
import useLogout from "../auth/Logout";

const NavBar = () => {
    const cerrarSesion = useLogout();
        return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-green-500">
                    Dress Shopy
                </Link>

                <div className="space-x-6">
                    <Link to="/" className="relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                        Inicio
                    </Link>
                    <Link to="/catalogo" className="relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
                        Catálogo
                    </Link>
                    <Link to="/perfil" className="relative text-gray-600 hover:text-green-500 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-green-500 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100 ">
                        Perfil
                    </Link>
                </div>

                <div className="space-x-4">
                    <button
                        onClick={cerrarSesion}
                        className="relative bg-red-50 shadow-red-100 text-black px-3 py-1 rounded-xl hover:bg-red-100 transition-colors hover:text-red-700 after:absolute after:bottom-1 after:left-3 after:w-[calc(100%-24px)] after:h-0.5 after:origin-bottom-right after:scale-x-0 after:bg-red-700 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;