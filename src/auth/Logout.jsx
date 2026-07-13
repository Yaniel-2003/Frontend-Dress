import { cerrarSesion } from "./services/Logout.service"
import { Navigate, useNavigate } from "react-router-dom"

function useLogout(){
    const navigate = useNavigate();

    const cerrarSesionLocal = async () => {
        try{
            await cerrarSesion();
        }catch(error){
            console.error("El token ya estaba muerto o hubo un error, pero igual cerramos sesión localmente", error);
        }finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('usuario');

            navigate('/login');
        }
    };
    return cerrarSesionLocal;
}

export default useLogout;