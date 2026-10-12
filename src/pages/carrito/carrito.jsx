import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ModalConfirmar from "../../components/ConfirmarEliminar";
import { useCarrito } from "../../context/CarritoContext";
import { useNavigate } from "react-router-dom";

import { obtenerCarrito, actualizarParcial, eliminarItemCarrito } from "../../services/carrito.service";
import ModalMensaje from "../../components/ModalMensajes";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PercentIcon, ChevronRightIcon } from "../../components/Icons";
import { BandaFoto, PasosCompra, FotoProducto, claseBotonIdentidad } from "../../components/compra/PiezasCompra";

// Foto de la banda superior (public/imgDress), copia optimizada de 1200px
const FOTO_CARRITO = "/imgDress/imgcmisasnegras-1200.jpg";


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
            }catch{
                // sin carrito disponible: se deja la lista vacia
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
    const [itemEliminar, setItemEliminar] = useState(null);
    const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);
    const navigate = useNavigate();

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
        }catch{
            notificacion.mostrar("Error al eliminar item del carriot", "error");
        }finally{
            setModalConfirmarAbierto(false);
        }
    }

    
    const masCantidad = async (item) => {
        const nuevaCantidad = item.cantidad + 1;
        await actualizarParcial(item.iditmcarrito, {cantidad: nuevaCantidad});
        await cantidadCar();
        actualizarCantidad(item.iditmcarrito, nuevaCantidad);
    } 
    const menosCantidad = async (item) => {
        const nuevaCantida = item.cantidad - 1;
        if(nuevaCantida < 1) {
            prepararEliminarItem(item);
            return;
        }
        await actualizarParcial(item.iditmcarrito, {cantidad: nuevaCantida});
        await cantidadCar();
        actualizarCantidad(item.iditmcarrito, nuevaCantida)
    }

    return (
        <div className="flex min-h-screen flex-col bg-lienzo text-tinta selection:text-tinta">
            <NavBar />
            <main className="relative isolate flex-1">
                <BandaFoto src={FOTO_CARRITO} posicion="object-[50%_35%]" opacidad="opacity-25" />

                <div className="mx-auto w-full max-w-6xl px-5 pt-8 pb-20 sm:px-8 sm:pt-10">
                    <PasosCompra actual={1} />
                    <div className="mt-5 mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <h1 className="font-display text-4xl leading-tight font-normal sm:text-5xl">Mi carrito</h1>
                        <p className="text-sm text-tinta/60 tabular-nums">
                            {cantidadItems} {cantidadItems === 1 ? "producto" : "productos"} en tu carrito
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-10">
                        <div className="flex w-full flex-1 flex-col gap-3">
                            {cargando && datosCarrito.length === 0 && (
                                <div className="flex items-center gap-3 py-10 text-sm text-tinta/60" aria-busy="true">
                                    <span className="size-4 animate-spin rounded-full border-2 border-esmeralda/30 border-t-esmeralda motion-reduce:animate-none" aria-hidden="true" />
                                    Cargando tu carrito…
                                </div>
                            )}
                            {datosCarrito.length === 0 && !cargando && (
                                <div className="flex flex-col items-center gap-3 border-y border-tinta/10 py-16 text-center">
                                    <span className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-esmeralda/25 to-azul/25 text-emerald-700 ring-1 ring-esmeralda/30">
                                        <ShoppingCart className="size-5" aria-hidden="true" />
                                    </span>
                                    <p className="font-medium">Tu carrito está vacío</p>
                                    <p className="text-sm text-tinta/60">Explora la colección y agrega lo que más te guste.</p>
                                    <Button asChild className={`mt-2 h-11 px-5 ${claseBotonIdentidad}`}>
                                        <Link to="/home">Ver la colección</Link>
                                    </Button>
                                </div>
                            )}
                            {datosCarrito.length > 0 && (
                                <ul className="divide-y divide-tinta/[0.06] overflow-hidden rounded-3xl bg-tinta/[0.025] ring-1 ring-tinta/[0.07]">
                                    {datosCarrito.map((item) => (
                                        <FilaCarrito
                                            key={item.iditmcarrito}
                                            item={item}
                                            prepararEliminarItem={prepararEliminarItem}
                                            masCantidad={masCantidad}
                                            menosCantidad={menosCantidad}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>

                        <ResumenItemsCarrito
                            producto={cantidadItems}
                            subtotal={Number(total + descuentoTotal).toLocaleString()}
                            descuenoTotal={Number(descuentoTotal).toLocaleString()}
                            total={Number(total).toLocaleString()}
                            onClick={() => navigate('/orden')}
                        />
                    </div>
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

const claseBotonCantidad =
    "flex size-10 cursor-pointer items-center justify-center rounded-full text-tinta/70 transition-colors hover:bg-tinta/[0.08] hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

function FilaCarrito({ item, prepararEliminarItem, masCantidad, menosCantidad }){
    const { articulo: producto, foto, precio_con_descuento_activo, precio_final } = item.vararticulo;
    const { color, talla, historial_descuentos } = item.vararticulo
    // valores solo para mostrar
    const hayDescuento = precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final);
    const unitario = Number(hayDescuento ? precio_con_descuento_activo : precio_final);

    return (
        <li className="flex gap-4 p-4 sm:gap-6 sm:p-6">
            <FotoProducto src={foto} alt={producto.nombre} width={112} height={140} className="aspect-[4/5] w-24 shrink-0 rounded-2xl sm:w-28" />

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                        <p className="text-xs tracking-wide text-tinta/60">{producto.marca.nombre}</p>
                        <p className="truncate text-base text-tinta/95">{producto.nombre}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-tinta/60">
                            <span>Talla {talla.codigo}</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full ring-1 ring-tinta/30" style={{ backgroundColor: color.hex_code }} aria-hidden="true" />
                                {color.nombre}
                            </span>
                        </p>
                    </div>

                    {/* subtotal de la línea */}
                    <div className="flex flex-wrap items-baseline gap-x-2 sm:block sm:shrink-0 sm:text-right">
                        <p className="text-base font-medium tabular-nums">$ {(unitario * item.cantidad).toLocaleString()}</p>
                        <p className="text-xs text-tinta/60 tabular-nums">
                            {item.cantidad} × $ {unitario.toLocaleString()}
                        </p>
                        {hayDescuento && (
                            <p className="text-xs text-tinta/60 tabular-nums line-through">$ {Number(precio_final).toLocaleString()} c/u</p>
                        )}
                    </div>
                </div>

                {historial_descuentos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {historial_descuentos.map((h) => (
                            <span
                                key={h.idartdescuento}
                                className="inline-flex items-center gap-1 rounded-full bg-sky-400/[0.07] px-2.5 py-0.5 text-xs text-sky-700 tabular-nums"
                            >
                                <PercentIcon className="size-3" aria-hidden="true" />
                                {h.cantidad_inicial ? `Quedan ${h.cantidad_restante}/${h.cantidad_inicial} con descuento` : `Quedan ${h.cantidad_restante} con descuento`}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div className="flex items-center rounded-full bg-tinta/[0.04] p-0.5 ring-1 ring-tinta/10" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
                        <button type="button" onClick={() => menosCantidad(item)} aria-label="Quitar uno" className={claseBotonCantidad}>
                            <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{item.cantidad}</span>
                        <button type="button" onClick={() => masCantidad(item)} aria-label="Agregar uno" className={claseBotonCantidad}>
                            <Plus className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => prepararEliminarItem(item)}
                        className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-sm text-tinta/60 transition-colors hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                        <Trash2 className="size-4" aria-hidden="true" />
                        <span>Quitar<span className="sr-only"> {producto.nombre} del carrito</span></span>
                    </button>
                </div>
            </div>
        </li>
    )
}


function ResumenItemsCarrito({ producto, subtotal, descuenoTotal, total, onClick }){

    return (
        <aside className="w-full shrink-0 rounded-3xl bg-tinta/[0.025] p-6 ring-1 ring-tinta/[0.07] sm:p-7 lg:sticky lg:top-24 lg:w-96" aria-labelledby="titulo-resumen">
            <h2 id="titulo-resumen" className="font-display text-xl font-normal text-tinta/90">Resumen del pedido</h2>

            {descuenoTotal !== "0" && (
                <p className="mt-4 flex items-center gap-2 rounded-2xl bg-sky-400/[0.07] px-3.5 py-2.5 text-sm text-sky-800">
                    <PercentIcon className="size-4 shrink-0 text-sky-700" aria-hidden="true" />
                    <span>Estás ahorrando <strong className="font-semibold tabular-nums">$ {descuenoTotal}</strong> en este pedido</span>
                </p>
            )}

            <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-tinta/60">
                    <dt>Productos</dt>
                    <dd className="font-medium text-tinta tabular-nums">{producto}</dd>
                </div>
                <div className="flex justify-between text-tinta/60">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-tinta tabular-nums">$ {subtotal}</dd>
                </div>
                <div className="flex justify-between text-tinta/60">
                    <dt>Descuentos</dt>
                    <dd className="font-medium text-emerald-700 tabular-nums">- $ {descuenoTotal}</dd>
                </div>
            </dl>

            <div className="my-5 h-px bg-tinta/[0.07]" />

            <div className="flex items-end justify-between">
                <span className="text-sm text-tinta/60">Total</span>
                <span className="text-2xl font-medium tracking-tight tabular-nums sm:text-3xl">$ {total}</span>
            </div>

            <Button
                onClick={onClick}
                size="lg"
                className={`mt-6 h-12 w-full rounded-2xl text-base ${claseBotonIdentidad}`}
            >
                Continuar con la compra
                <ChevronRightIcon className="size-5" aria-hidden="true" />
            </Button>
            <Link
                to="/home"
                className="mt-2 flex min-h-11 items-center justify-center rounded-sm text-sm font-medium text-tinta/70 underline-offset-4 transition-colors hover:text-tinta hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
                Seguir comprando
            </Link>
        </aside>
    )
}

export default Carrito;
