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
                    <Link to="/" className="text-gray-600 hover:text-green-500 transition-color">
                        Inicio
                    </Link>
                    <Link to="/catalogo" className="text-gray-600 hover:text-green-500 transition-color">
                        Catálogo
                    </Link>
                    <Link to="/perfil" className="text-gray-600 hover:text-green-500 transition-colors">
                        Perfil
                    </Link>
                </div>

                <div className="space-x-4">
                    <button
                        onClick={cerrarSesion}
                        className="bg-red-500 shadow-red-600 text-black px-3 py-1 rounded-xl hover:bg-red-600 transition-color hover:text-white"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;