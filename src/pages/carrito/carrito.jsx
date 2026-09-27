import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ModalConfirmar from "../../components/ConfirmarEliminar";
import { useCarrito } from "../../context/CarritoContext";

import { obtenerCarrito, actualizarParcial, eliminarItemCarrito } from "../../services/carrito.service";
import ModalMensaje from "../../components/ModalMensajes";


function useMensajeTemporal(duracionMs = 1000){
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setmenasje] = useState("");
    const [tipo, setTipo] = useState("success");

    const mostrar = (texto, tipoMensaje) => {
        setmenasje(texto);
        setTipo(tipoMensaje);
        setAbierto(true);
        setTimeout(() => setAbierto(false), duracionMs);
    };

    return { abierto, mensaje, tipo, mostrar };
}

// HOOCK PARA SELECIONAR TODO EL CARRITO
function useCheckbox(){
    const [selecionar, setSeleccionar] = useState([]);

    // CONSTANTE PARA MARCAR Y DESMARCAR
    const seleccion = (idcarrito) => {
        setSeleccionar((prev) => {
            if(prev.includes(idcarrito)){
                return prev.filter(id => id !== idcarrito);
            }else{
                return [ ...prev, idcarrito];
            }
        });
    };

    const limpiarTodo = () => setSeleccionar([]);

    const seleccionarTodo = () => {
        if(selecionar.length === dataCarrito.length && dataCarrito.length > 0){
            limpiarTodo();
        }else {
            const todosLosIds = dataCarrito.map(v => v.idcarrito);
            setSeleccionar(todosLosIds);
        }
    }

    return {
        selecionar, seleccion, limpiarTodo, seleccionarTodo
    }
}


// HOOK PARA OBTENER LOS ARTICULOS
function useVariantesCarrito(){
    const [datosCarrito, setDatosCarrito] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const carrito = async () => {
            try{
                setCargando(true);
                const dataCarrito = await obtenerCarrito();
                setDatosCarrito(dataCarrito);
            }catch(error){
            }finally{
                setCargando(false);
            }
        }
        carrito();
    },[]);

    // CONSTANTE PARA ELIMINAR UN ITEM DEL CARRITO

    const eliminarItem = (iditmcarrito) => 
        setDatosCarrito((prev) => prev.filter((item) => item.iditmcarrito !== iditmcarrito));

    return { datosCarrito, cargando, eliminarItem }
}


function Carrito() {
    const {datosCarrito, cargando, eliminarItem} = useVariantesCarrito();
    const notificacion = useMensajeTemporal();
    const check = useCheckbox();
    const [itemEliminar, setItemEliminar] = useState(null);
    const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);

    const { cantidadCar } = useCarrito();

    const total = datosCarrito.reduce((acumulador, item) => {
        const {precio_con_descuento_activo, precio_final} = item.vararticulo;
        const hayDescuento = precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final)

        const precioUnitario = hayDescuento ? precio_con_descuento_activo : precio_final;
        return acumulador + Number(precioUnitario) * item.cantidad;
    }, 0);

    const descuentoTotal = datosCarrito.reduce(( acumulador, item ) => {
        const { precio_con_descuento_activo, precio_final } = item.vararticulo;

        const hayDescuento = precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final);

        if(!hayDescuento) return acumulador;
        return acumulador + (Number(precio_final) - Number(precio_con_descuento_activo)) * item.cantidad;
    }, 0);

    const cantidadItems = datosCarrito.reduce((acumulador, item) => {
        return acumulador + item.cantidad
    },0);

    const prepararEliminarItem = (carrito) => {
        setItemEliminar(carrito);
        setModalConfirmarAbierto(true);
    };

    const confirmarEliminarItem = async() => {
        try{
            await eliminarItemCarrito(itemEliminar.iditmcarrito);
            eliminarItem(itemEliminar.iditmcarrito)
            await cantidadCar();
            notificacion.mostrar("Item eliminado del carrito", "success");
        }catch(error){
            notificacion.mostrar("Error al eliminar item del carriot", "error");
        }finally{
            setModalConfirmarAbierto(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Mi carrito</h1>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex flex-col gap-4 flex-1 w-full">
                        {datosCarrito.map((item) => (
                            <FilaCarrito
                                key={item.iditmcarrito}
                                item={item}
                                prepararEliminarItem={prepararEliminarItem}
                            />
                        ))}
                    </div>

                    <ResumenItemsCarrito
                        producto={cantidadItems}
                        descuenoTotal={Number(descuentoTotal).toLocaleString()}
                        total={Number(total).toLocaleString()}
                    />
                </div>
            </main>
            {modalConfirmarAbierto && (
                <ModalConfirmar
                    datosAMostrar={itemEliminar?.vararticulo.articulo.nombre}
                    onConfirmar={confirmarEliminarItem}
                    onCancelar={() => setModalConfirmarAbierto(false)}
                />
            )}
            {notificacion.abierto && (
                <ModalMensaje 
                    abierto={notificacion.abierto}
                    mensaje={notificacion.mensaje}
                    tipo={notificacion.tipo}
                />
            )}
            <Footer />
        </div>
    )
}

function FilaCarrito({ item, prepararEliminarItem }){
    const { articulo: producto, foto, precio_con_descuento_activo, precio_final } = item.vararticulo;
    const { color, talla, historial_descuentos } = item.vararticulo

    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <img
                src={foto}
                alt={producto.nombre}
                className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm shrink-0 mx-auto sm:mx-0"
            />

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{producto.marca.nombre}</p>
                <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-slate-800 truncate">{producto.nombre}</p>
                    <button
                        type="button"
                        onClick={() => prepararEliminarItem(item)}
                        title="Eliminar del carrito"
                        className="shrink-0 p-1 rounded-full text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Talla {talla.codigo}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: color.hex_code }} />
                        {color.nombre}
                    </span>
                </div>

                {historial_descuentos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {historial_descuentos.map((h) => (
                            <span
                                key={h.idartdescuento}
                                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                                Quedan {h.cantidad_restante}/{h.cantidad_inicial} con descuento
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cantidad: {item.cantidad}</span>
                
                {precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final) ? (
                    <div className="flex flex-col items-center sm:items-end">
                        <span className="text-lg font-bold text-emerald-700">$ {Number(precio_con_descuento_activo).toLocaleString()}</span>
                        <span className="text-sm font-medium text-slate-400 line-through">$ {Number(precio_final).toLocaleString()}</span>
                    </div>
                ):(
                    <span className="text-lg font-bold text-slate-800">$ {Number(precio_final).toLocaleString()}</span>
                )}
            </div>
        </div>
    )
}


function ResumenItemsCarrito({ producto, descuenoTotal, total, onClick }){

    return (
        <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:sticky lg:top-10">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Resumen carrito</h3>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                    <span>Productos</span>
                    <span className="font-semibold text-slate-800">{producto}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span>Descuentos</span>
                    <span className="font-semibold text-emerald-700">- $ {descuenoTotal}</span>
                </div>
            </div>

            <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-slate-100">
                <span className="text-sm font-semibold text-slate-500">Total</span>
                <span className="text-xl font-bold text-slate-800">$ {total}</span>
            </div>

            <button
                onClick={onClick}
                className="w-full mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all cursor-pointer"
            >
                Continuar
            </button>
        </div>
    )
}

export default Carrito;