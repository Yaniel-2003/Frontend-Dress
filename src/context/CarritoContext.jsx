import { createContext, useContext, useState } from "react";
import { obtenerCarrito } from "../services/carrito.service";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }){
    const [cantidad, setCantidad] = useState(0);
    const [miCarrito, setMiCarrito] = useState([]);
    const { usuario } = useAuth();
    
    const cantidadCar = async () => {
        try{
            const respuesta = await obtenerCarrito();
            const cantidadItems = respuesta.reduce((acumulador, items) => {
                return acumulador + items.cantidad
            },0);
            setCantidad(cantidadItems)
            setMiCarrito(respuesta)
        }catch{
            // si falla la consulta se conserva el ultimo carrito conocido
        }
    };

    useEffect(() => {
        if(usuario?.idusuario){
            // eslint-disable-next-line react-hooks/set-state-in-effect -- carga del carrito al iniciar sesion
            cantidadCar();
        }
        
    },[usuario])


    return (
        <CarritoContext.Provider value={{cantidad ,cantidadCar, miCarrito}}>
            {children}
        </CarritoContext.Provider>
    )
}

export function useCarrito(){
    return useContext(CarritoContext)
}