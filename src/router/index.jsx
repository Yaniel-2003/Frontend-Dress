import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// TODAS LAS RUTAS DE TODOS ARCHIVOS QUE SEAN VIEWS
import Login from '../auth/login'
import Registro from '../auth/registro'
import Home  from '../pages/home/home';
import Perfil from '../auth/perfil';
import Articulos from '../pages/articulos/articulos';
import DetallesArticulos from '../pages/home/detallesArticulo';

// ESTE COMPONENTE PROTEJE LAS RUTAS PARA QUE SOLO EMTREN LOS USUARIOS LOGUEADOS 

const ProtecttedRoute = ({ children, requiredPermission }) => {
    //BUSCAMOS EL TOKEN EN EL ALMACENAMIENTO DEL NAVEGADOR
    const token = localStorage.getItem('access_token');

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
                <Route path='/' element={<Navigate to='/login' replace />} />
                
                <Route path='/login' element={<Login  />} />
                <Route path='/registro' element={<Registro />} />

                <Route path='/home' element={
                    <ProtecttedRoute>
                        <Home />
                    </ProtecttedRoute>
                } />
                <Route path='/perfil' element={
                    <ProtecttedRoute>
                        <Perfil />
                    </ProtecttedRoute>
                } />
                <Route path='/articulos' element={
                    <ProtecttedRoute>
                        <Articulos />
                    </ProtecttedRoute>
                } />
                <Route path='/detalles-articulos/:id' element={
                    <ProtecttedRoute>
                        <DetallesArticulos />
                    </ProtecttedRoute>
                } />

            </Routes>
        </BrowserRouter>
    );
};


export default AppRouter;