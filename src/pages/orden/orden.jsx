import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ModalMensaje from "@/components/ModalMensajes";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BandaFoto, PasosCompra, FotoProducto, claseBotonIdentidad } from "@/components/compra/PiezasCompra";

// Foto de la banda superior (public/imgDress), copia optimizada de 1600px
const FOTO_ORDEN = "/imgDress/imgarticulos-1600.jpg";

import { obtenerTodos } from "@/services/direcciones.service";
import { crearOrden } from "@/services/orden.service";
import { useAuth } from "@/context/AuthContext";
import { useCarrito } from "@/context/CarritoContext";

function useMensajeTemporal(duracionMs = 2500){
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setmenasje] = useState("");
    const [tipo, setTipo] = useState("");

    const mostrar = (texto, tipoMensaje) => {
        setmenasje(texto);
        setTipo(tipoMensaje);
        setAbierto(true);
        setTimeout(() => setAbierto(false), duracionMs);
    };
    return { abierto, mensaje, tipo, mostrar };
}


function textoError(error){
    const data = error?.data;
    if(Array.isArray(data)) return data[0];
    if(data && typeof data === 'object'){
        const primero = Object.values(data)[0];
        return Array.isArray(primero) ? primero[0] : String(primero);
    }
    return error?.message || "No se pudo crear la orden";
}


const precioUnitario = (item) => {
    const { precio_con_descuento_activo, precio_final } = item.vararticulo;
    const hayDescuento = precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final);
    return Number(hayDescuento ? precio_con_descuento_activo : precio_final);
}

function Orden(){
    const navigate = useNavigate();
    const {usuario} = useAuth();
    const { miCarrito, cantidadCar } = useCarrito();
    const notificacion = useMensajeTemporal();

    const [direcciones, setDirecciones] = useState([]);
    const [direccionSelecionada, setDireccionSelecionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        const cargarDireccion = async () => {
            try{
                const todas = await obtenerTodos();
                
                const propias = todas.filter((dir) => dir.usuario.idusuario === usuario.idusuario);
                setDirecciones(propias);


                const princpal = propias.find((dir) => dir.principal) ?? propias[0];
                setDireccionSelecionada(princpal?.iddireccion ?? null);
            }catch(error){
                console.log("Error al cargar las dirtecciones: ", error);
            }finally{
                setCargando(false);
            }
        }
        cargarDireccion();
    },[usuario?.idusuario]);

    const total = miCarrito.reduce((acumulador, item) => acumulador + precioUnitario(item) * item.cantidad, 0);
    const unidades = miCarrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);

    const confirmarCompra = async () => {
        if(!direccionSelecionada || enviado) return;

        setEnviado(true);
        try{
            await crearOrden({ direccion: direccionSelecionada, cupon: null });
            await cantidadCar();

            notificacion.mostrar("¡Compra realizada con éxito!", "success");
            setTimeout(() => navigate('/home'), 2500);
        }catch(error){
            notificacion.mostrar(textoError(error), "error");
            setEnviado(false);   
        }

    }

    return (
        <div className="flex min-h-screen flex-col bg-lienzo text-tinta selection:text-tinta">
            <NavBar />
            <main className="relative isolate flex-1">
                <BandaFoto src={FOTO_ORDEN} posicion="object-top" opacidad="opacity-55" />

                <div className="mx-auto w-full max-w-4xl px-5 pt-8 pb-16 sm:px-8 sm:pt-10">
                    <PasosCompra actual={2} />
                    <header className="mt-5 mb-8">
                        <h1 className="font-display text-4xl leading-tight font-normal sm:text-5xl">Confirmar pedido</h1>
                        <p className="mt-2 text-sm text-tinta/70">Revisa tu pedido y elige dónde quieres recibirlo.</p>
                    </header>

                    {/* ───── Recibo: cada sección es una fila del documento ───── */}
                    <div className="border-t border-tinta/15">
                        <SeccionRecibo titulo="Enviar a" id="titulo-envio">
                            {cargando && (
                                <p className="flex items-center gap-3 text-sm text-tinta/60" aria-busy="true">
                                    <span className="size-4 animate-spin rounded-full border-2 border-esmeralda/30 border-t-esmeralda motion-reduce:animate-none" aria-hidden="true" />
                                    Cargando tus direcciones…
                                </p>
                            )}

                            {!cargando && direcciones.length === 0 && (
                                <div className="text-sm text-tinta/70">
                                    <p>No tienes direcciones guardadas.</p>
                                    <Link to="/perfil" className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-sm font-medium text-emerald-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                        Agregar una dirección en tu perfil
                                    </Link>
                                </div>
                            )}

                            {direcciones.length > 0 && (
                                <div role="radiogroup" aria-labelledby="titulo-envio" className="-my-2 divide-y divide-tinta/10">
                                    {direcciones.map((dir) => (
                                        <FilaDireccion
                                            key={dir.iddireccion}
                                            direccion={dir}
                                            seleccionada={dir.iddireccion === direccionSelecionada}
                                            onSeleccionar={() => setDireccionSelecionada(dir.iddireccion)}
                                        />
                                    ))}
                                </div>
                            )}
                        </SeccionRecibo>

                        <SeccionRecibo titulo="Tu pedido" id="titulo-pedido" detalle={`${unidades} ${unidades === 1 ? "unidad" : "unidades"}`}>
                            {miCarrito.length === 0 ? (
                                <div className="text-sm text-tinta/70">
                                    <p>Tu carrito está vacío.</p>
                                    <Link to="/home" className="mt-1 inline-flex min-h-11 items-center rounded-sm font-medium text-emerald-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                        Ver la colección
                                    </Link>
                                </div>
                            ) : (
                                <ul className="-my-2 max-h-56 divide-y divide-tinta/10 overflow-y-auto overscroll-contain [scrollbar-color:rgb(11_11_12/0.2)_transparent]">
                                    {miCarrito.map((item) => (
                                        <FilaResumen key={item.iditmcarrito} item={item} />
                                    ))}
                                </ul>
                            )}
                        </SeccionRecibo>

                        {/* Cierre del recibo: total y confirmación */}
                        <section className="grid gap-4 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:gap-8" aria-labelledby="titulo-total">
                            <h2 id="titulo-total" className="font-display text-xl font-normal text-tinta/80">Total</h2>
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <p className="font-display text-4xl leading-none font-normal tabular-nums">
                                    $ {total.toLocaleString()}
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <Button
                                        type="button"
                                        size="lg"
                                        onClick={confirmarCompra}
                                        disabled={!direccionSelecionada || enviado || miCarrito.length === 0}
                                        aria-busy={enviado}
                                        className={`h-12 px-7 text-base sm:min-w-56 ${claseBotonIdentidad}`}
                                    >
                                        {enviado && <span className="size-4 animate-spin rounded-full border-2 border-tinta/30 border-t-tinta motion-reduce:animate-none" aria-hidden="true" />}
                                        {enviado ? "Procesando…" : "Confirmar compra"}
                                    </Button>
                                    <Link
                                        to="/carrito"
                                        className="inline-flex min-h-11 items-center justify-center rounded-sm px-2 text-sm font-medium text-tinta/70 underline-offset-4 transition-colors hover:text-tinta hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                    >
                                        Volver al carrito
                                    </Link>
                                </div>
                            </div>
                            {!direccionSelecionada && !cargando && miCarrito.length > 0 && (
                                <p className="text-sm text-tinta/60 sm:col-start-2">Elige una dirección de envío para continuar.</p>
                            )}
                        </section>
                    </div>
                </div>
            </main>

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


// Fila del recibo: nombre de la sección en serif a la izquierda, contenido a la derecha
function SeccionRecibo({ titulo, id, detalle, children }){
    return (
        <section className="grid gap-3 border-b border-tinta/15 py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8" aria-labelledby={id}>
            <div>
                <h2 id={id} className="font-display text-xl font-normal text-tinta/80">{titulo}</h2>
                {detalle && <p className="mt-1 text-sm text-tinta/60 tabular-nums">{detalle}</p>}
            </div>
            <div>{children}</div>
        </section>
    )
}


function FilaDireccion({ direccion, seleccionada, onSeleccionar }){
    return (
        <button
            type="button"
            role="radio"
            aria-checked={seleccionada}
            onClick={onSeleccionar}
            className="group flex w-full cursor-pointer items-start gap-4 py-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600"
        >
            <span
                aria-hidden="true"
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full transition-colors ${seleccionada ? "bg-linear-to-br from-esmeralda to-azul" : "ring-1 ring-tinta/35 group-hover:ring-tinta/60"}`}
            >
                {seleccionada && <span className="size-2 rounded-full bg-lienzo" />}
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={`text-base font-medium ${seleccionada ? "text-tinta" : "text-tinta/80"}`}>{direccion.nombre_destinatario}</span>
                    {direccion.principal && (
                        <span className="text-xs tracking-wide text-emerald-700">Principal</span>
                    )}
                </span>
                <span className={`mt-0.5 block text-sm ${seleccionada ? "text-tinta/75" : "text-tinta/60"}`}>
                    {direccion.direccion}, {direccion.ciudad}, {direccion.departamento} · Barrio {direccion.barrio} · CP {direccion.codigo_postal}
                </span>
            </span>
        </button>
    )
}


function FilaResumen({ item }){
    const { articulo: producto, foto, color, talla } = item.vararticulo;

    return (
        <li className="flex items-center gap-4 py-2.5">
            <FotoProducto src={foto} alt={producto.nombre} width={40} height={50} className="h-[50px] w-10 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium">{producto.nombre}</p>
                <p className="text-sm text-tinta/60 tabular-nums">Talla {talla.codigo} · {color.nombre} · {item.cantidad} × $ {precioUnitario(item).toLocaleString()}</p>
            </div>
            <span className="text-[15px] font-medium tabular-nums">
                $ {(precioUnitario(item) * item.cantidad).toLocaleString()}
            </span>
        </li>
    )
}

export default Orden;
