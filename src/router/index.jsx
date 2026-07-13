import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// TODAS LAS RUTAS DE TODOS ARCHIVOS QUE SEAN VIEWS
import Login from '../auth/login'
import Registro from '../auth/registro'
import Home  from '../pages/home';
import Perfil from '../auth/perfil';

// ESTE COMPONENTE PROTEJE LAS RUTAS PARA QUE SOLO EMTREN LOS USUARIOS LOGUEADOS 

const ProtecttedRoute = ({ children, requiredPermission }) => {
    //BUSCAMOS EL TOKEN EN EL ALMACENAMIENTO DEL NAVEGADOR
    const token = localStorage.getItem('access-token');

    // SI NO HAY TOKEN LO ENVIAMOS AL LOGIN

    if(!token) return <Navigate to='/Login' replace />;

    //OBTENEMOS EL USUARIOS DE MANERA SEGURA

    const usuario = (() => {
        try{
            return JSON.parse(localStorage.getItem('usuario'));
        }catch {
            return null;
        }
    })();

    // SI TODO SALIO BIEN MOSTRAMOS LA PAGINA QUE EL USUARIO SELECIONO
    return children;
};

// ESTE ES EL COMPONENTE QUE APP.JSX ESTA INTENTANDO IMPORTAL 

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/Login' element={<Login  />} />
                <Route path='/registro' element={<Registro />} />
                <Route path='/perfil' element={<Perfil />} />
            </Routes>
        </BrowserRouter>
    );
};


export default AppRouter;