//IMPOERTAMOS LAS RUTAS
import AppRouter from "./Router";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
//CREAMOS UNA FUNCION APP QUE ALMACENARA TODAS LAS RUTAS Y LAS RETORNARA DONDE LAS NECECITEMOS 
function App(){
    return (
    <AuthProvider>
        <CarritoProvider>
          <AppRouter />
        </CarritoProvider>
      </AuthProvider>
    );
}

export default App;