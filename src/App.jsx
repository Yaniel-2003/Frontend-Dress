//IMPOERTAMOS LAS RUTAS
import AppRouter from "./Router";
import { AuthProvider } from "./context/AuthContext";
//CREAMOS UNA FUNCION APP QUE ALMACENARA TODAS LAS RUTAS Y LAS RETORNARA DONDE LAS NECECITEMOS 
function App(){
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;