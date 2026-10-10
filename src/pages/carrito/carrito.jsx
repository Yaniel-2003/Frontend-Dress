import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ModalConfirmar from "../../components/ConfirmarEliminar";
import { useCarrito } from "../../context/CarritoContext";

import { obtenerCarrito, actualizarParcial, eliminarItemCarrito } from "../../services/carrito.service";
import ModalMensaje from "../../components/ModalMensajes";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PercentIcon, ChevronRightIcon } from "../../components/Icons";


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

    const actualizarCantidad = (iditmcarrito, nuevaCantidad) => {
        setDatosCarrito(prev => 
            prev.map(item =>
                item.iditmcarrito === iditmcarrito ? { ...item, cantidad: nuevaCantidad } : item
            )
        );
    }

    // CONSTANTE PARA ELIMINAR UN ITEM DEL CARRITO

    const eliminarItem = (iditmcarrito) => 
        setDatosCarrito((prev) => prev.filter((item) => item.iditmcarrito !== iditmcarrito));

    return { datosCarrito, cargando, eliminarItem, actualizarCantidad }
}


function Carrito() {
    const {datosCarrito, cargando, eliminarItem, actualizarCantidad} = useVariantesCarrito();
    const notificacion = useMensajeTemporal();
    const check = useCheckbox();
    const [itemEliminar, setItemEliminar] = useState(null);
    const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);

    const [cantidadCarrito, setCantidaCarrito] = useState();

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

    
    const masCantidad = async (item) => {
        const nuevaCantidad = item.cantidad + 1;
        const cantidades = await actualizarParcial(item.iditmcarrito, {cantidad: nuevaCantidad});
        await cantidadCar();
        actualizarCantidad(item.iditmcarrito, nuevaCantidad);
    } 
    const menosCantidad = async (item) => {
        const nuevaCantida = item.cantidad - 1;
        if(nuevaCantida < 1) {
            prepararEliminarItem(item);
            return;
        }
        const cantidades = await actualizarParcial(item.iditmcarrito, {cantidad: nuevaCantida});
        await cantidadCar();
        actualizarCantidad(item.iditmcarrito, nuevaCantida)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Mi carrito</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {cantidadItems} {cantidadItems === 1 ? "producto" : "productos"} en tu carrito
                    </p>
                </div>

                <div className="flex flex-col items-start gap-8 lg:flex-row">
                    <div className="flex w-full flex-1 flex-col gap-4">
                        {datosCarrito.length === 0 && !cargando && (
                            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white/60 py-16 text-center">
                                <span className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                                    <ShoppingCart className="size-5" />
                                </span>
                                <p className="font-medium">Tu carrito está vacío</p>
                                <p className="text-sm text-muted-foreground">Explora el catálogo y agrega lo que más te guste.</p>
                                <Button asChild className="mt-2 hover:bg-emerald-700">
                                    <Link to="/home">Ver artículos</Link>
                                </Button>
                            </div>
                        )}
                        {datosCarrito.map((item) => (
                            <FilaCarrito
                                key={item.iditmcarrito}
                                item={item}
                                prepararEliminarItem={prepararEliminarItem}
                                masCantidad={masCantidad}
                                menosCantidad={menosCantidad}
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

function FilaCarrito({ item, prepararEliminarItem, masCantidad, menosCantidad }){
    const { articulo: producto, foto, precio_con_descuento_activo, precio_final } = item.vararticulo;
    const { color, talla, historial_descuentos } = item.vararticulo

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <img
                src={foto}
                alt={producto.nombre}
                className="mx-auto size-24 shrink-0 rounded-xl border border-zinc-200 bg-zinc-100 object-cover sm:mx-0"
            />

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">{producto.marca.nombre}</p>
                <div className="flex items-center gap-2">
                    <p className="truncate text-base font-semibold tracking-tight">{producto.nombre}</p>
                    <button
                        type="button"
                        onClick={() => prepararEliminarItem(item)}
                        title="Eliminar del carrito"
                        aria-label="Eliminar del carrito"
                        className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="px-2.5 py-1">
                        Talla {talla.codigo}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                        <span className="size-3 rounded-full border border-zinc-300" style={{ backgroundColor: color.hex_code }} />
                        {color.nombre}
                    </Badge>
                </div>

                {historial_descuentos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {historial_descuentos.map((h) => (
                            <Badge
                                key={h.idartdescuento}
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700"
                            >
                                Quedan {h.cantidad_restante}/{h.cantidad_inicial} con descuento
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
                    <button
                        type="button"
                        onClick={() => menosCantidad(item)}
                        aria-label="Quitar uno"
                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-white hover:text-emerald-700 hover:shadow-sm"
                    >
                        −
                    </button>
                    <span className="w-7 text-center text-sm font-semibold tabular-nums">{item.cantidad}</span>
                    <button
                        type="button"
                        onClick={() => masCantidad(item)}
                        aria-label="Agregar uno"
                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-white hover:text-emerald-700 hover:shadow-sm"
                    >
                        +
                    </button>
                </div>

                {precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final) ? (
                    <div className="flex flex-col items-end">
                        <span className="text-lg font-bold tracking-tight tabular-nums text-emerald-700">$ {Number(precio_con_descuento_activo).toLocaleString()}</span>
                        <span className="text-sm tabular-nums text-zinc-400 line-through">$ {Number(precio_final).toLocaleString()}</span>
                    </div>
                ):(
                    <span className="text-lg font-bold tracking-tight tabular-nums">$ {Number(precio_final).toLocaleString()}</span>
                )}
            </div>
        </div>
    )
}


function ResumenItemsCarrito({ producto, descuenoTotal, total, onClick }){

    return (
        <aside className="w-full shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:sticky lg:top-24 lg:w-96">
            <div className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                    <ShoppingCart className="size-5 text-emerald-600" />
                    Resumen del pedido
                </h3>

                {descuenoTotal !== "0" && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-800">
                        <PercentIcon className="size-4 shrink-0" />
                        Estás ahorrando $ {descuenoTotal} en este pedido
                    </div>
                )}

                <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <span>Productos</span>
                        <span className="font-medium text-foreground tabular-nums">{producto}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Descuentos</span>
                        <span className="font-medium text-emerald-700 tabular-nums">- $ {descuenoTotal}</span>
                    </div>
                </div>

                <Separator className="my-5" />

                <div className="flex items-end justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Total</span>
                    <span className="text-3xl font-bold tracking-tight tabular-nums">$ {total}</span>
                </div>

                <Button
                    onClick={onClick}
                    size="lg"
                    className="mt-6 h-12 w-full text-base hover:bg-emerald-700"
                >
                    Continuar con la compra
                    <ChevronRightIcon className="size-5" />
                </Button>
                <Link
                    to="/home"
                    className="mt-3 block text-center text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-emerald-700 hover:underline"
                >
                    Seguir comprando
                </Link>
            </div>
        </aside>
    )
}

export default Carrito;
