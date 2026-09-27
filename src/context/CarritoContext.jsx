import { createContext, useContext, useState } from "react";
import { obtenerCarrito } from "../services/carrito.service";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }){
    const [cantidad, setCantidad] = useState(0);
    const { usuario } = useAuth();
    
    const cantidadCar = async () => {
        try{
            const respuesta = await obtenerCarrito();
            const cantidadItems = respuesta.reduce((acumulador, items) => {
                return acumulador + items.cantidad
            },0);
            setCantidad(cantidadItems)
        }catch(error){
        }

    };

    useEffect(() => {
        if(usuario?.idusuario){
            cantidadCar();
        }
        
    },[usuario])

    return (
        <CarritoContext.Provider value={{cantidad ,cantidadCar}}>
            {children}
        </CarritoContext.Provider>
    )
}

export function useCarrito(){
    return useContext(CarritoContext)
}