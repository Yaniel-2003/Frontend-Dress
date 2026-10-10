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
        }catch(error){
        }
    };

    useEffect(() => {
        if(usuario?.idusuario){
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