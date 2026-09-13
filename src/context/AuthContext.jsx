import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }){
    const [usuario, setUsuario] = useState(() => {
        try{
            return JSON.parse(localStorage.getItem('usuario'));
        }catch{
            return null;
        }
    });

    const login = (datosLogin) => {
        localStorage.setItem('access_token', datosLogin.access);
        localStorage.setItem('refresh_token', datosLogin.refresh);
        localStorage.setItem('usuario', JSON.stringify(datosLogin.usuario));
        setUsuario(datosLogin.usuario)
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('usuario')
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}