import { cerrarSesion } from "./services/Logout.service"
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom"

function useLogout(){
    const navigate = useNavigate();
    const { logout } = useAuth();

    const cerrarSesionLocal = async () => {
        try{
            await cerrarSesion();
        }catch(error){
            console.error("El token ya estaba muerto o hubo un error, pero igual cerramos sesión localmente", error);
        }finally {
            logout();

            navigate('/login');
        }
    };
    return cerrarSesionLocal;
}

export default useLogout;