import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";

import { getOneVariante, getFotosVAriantes } from "../../services/articulo.service";
import ModalMensaje from "../../components/ModalMensajes";
import { agregarCarrito } from "../../services/carrito.service";
import { ChevronLeftIcon, ChevronRightIcon, PercentIcon, TagIcon, RulerIcon, PaletteIcon, BarcodeIcon, FolderIcon } from "../../components/Icons";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Foto de la banda superior (public/imgDress), copia optimizada de 1600px; el original está al lado.
const FOTO_DETALLE = "/imgDress/imgarticulos-1600.jpg";

function useMensajeTemporal(duracionMs = 1000) {
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("success");

    const mostrar = (texto, tipoMensaje) => {
    setMensaje(texto);
    setTipo(tipoMensaje);
    setAbierto(true);
    setTimeout(() => setAbierto(false), duracionMs);
    };

    return { abierto, mensaje, tipo, mostrar };
}


function useDetalleArticulo(id){
    const [articulo, setArticulo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [varFotos, setvarFotos] = useState([]);


    useEffect(() => {
        const detallesArticulos = async () => {
            try{
                setCargando(true);
                const [dataFotos, datosArticulos] = await Promise.all([getFotosVAriantes(id), getOneVariante(id)]);
                setvarFotos(dataFotos);
                setArticulo(datosArticulos);
            }catch{
                // sin datos del articulo: se mantiene el estado de carga
            }finally{
                setCargando(false);
            }
        }
        detallesArticulos();
    },[id]);


    return { articulo, cargando, varFotos }
}


function DetallesArticulos(){
    const {id} = useParams();
    const {articulo, varFotos} = useDetalleArticulo(id);
    const [fotoSelecionada, setFotoSelecionada] = useState(null);
    const notificacion = useMensajeTemporal();
    const { cantidadCar } = useCarrito();

    const agregarALCarrito = async () => {
        try {
            await agregarCarrito(articulo.idvararticulo);
            await cantidadCar();
            notificacion.mostrar("Articulo agregado al carrito.", "success");
        } catch {
            notificacion.mostrar("Error al agregar al carrito.", "error");
        }
    };

    if(!articulo) return (
        <div className="flex min-h-screen flex-col bg-lienzo text-tinta">
            <NavBar/>
            <main className="flex flex-1 items-center justify-center gap-3 text-sm text-tinta/60" aria-busy="true">
                <span className="size-4 animate-spin rounded-full border-2 border-esmeralda/30 border-t-esmeralda motion-reduce:animate-none" aria-hidden="true" />
                Cargando la prenda…
            </main>
            <Footer/>
        </div>
    );



    const {articulo: producto, color, talla, sku, historial_descuentos, stock, foto, precio_final} = articulo
    const {marca, categoria, descripcion, nombre } = producto;
    const { genero } = categoria;

    const hayDescuento = articulo.precio_con_descuento_activo && Number(articulo.precio_con_descuento_activo) < Number(precio_final);

    // Valores derivados solo para mostrar
    const ahorro = hayDescuento ? Number(precio_final) - Number(articulo.precio_con_descuento_activo) : 0;
    const porcentajeAhorro = hayDescuento ? Math.round((ahorro / Number(precio_final)) * 100) : 0;
    const precioMostrado = hayDescuento ? articulo.precio_con_descuento_activo : precio_final;

    const disponibilidad = stock > 10
        ? { texto: `Disponible · ${stock} unidades`, punto: "bg-emerald-400", color: "text-emerald-700" }
        : stock > 0
            ? { texto: `Últimas unidades · quedan ${stock}`, punto: "bg-sky-400", color: "text-sky-700" }
            : { texto: "Agotado", punto: "bg-red-400", color: "text-red-600" };

    return (
        <div className="flex min-h-screen flex-col bg-lienzo text-tinta selection:text-tinta">
            <NavBar/>
            <main className="relative isolate flex-1">
                {/* banda de foto: el perchero frente a la pared verde azulada */}
                <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-72 overflow-hidden sm:h-80">
                    <img src={FOTO_DETALLE} alt="" width={1600} height={2000} className="size-full object-cover object-top opacity-80" />
                    <div className="absolute inset-0 bg-linear-to-b from-lienzo/20 via-lienzo/70 to-lienzo" />
                </div>

                <div className="mx-auto w-full max-w-6xl px-5 pt-6 pb-32 sm:px-8 sm:pt-8 lg:pb-16">
                    <Link
                        to="/home"
                        className="group mb-8 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-tinta/75 transition-colors hover:text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                        <ChevronLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                        Volver a la colección
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                        {/* ───── Galería ───── */}
                        <div className="flex flex-col gap-4 sm:flex-row lg:sticky lg:top-24 lg:self-start">
                            {varFotos.length > 0 && (
                                <ul className="order-2 flex flex-row gap-3 overflow-x-auto pb-1 sm:order-1 sm:max-h-[36rem] sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pr-1 sm:pb-0" aria-label="Fotos de la prenda">
                                    {varFotos.map((f, i) => (
                                        <li key={f.idfoto} className="shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setFotoSelecionada(f.urlfoto)}
                                                aria-label={`Ver foto ${i + 1}`}
                                                aria-pressed={fotoSelecionada === f.urlfoto}
                                                className={`block cursor-pointer rounded-xl p-px transition-[background-color,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${fotoSelecionada === f.urlfoto ? "bg-linear-to-br from-esmeralda to-azul" : "bg-tinta/10 opacity-70 hover:opacity-100"}`}
                                            >
                                                <img src={f.urlfoto} alt="" width={80} height={100} loading="lazy" className="h-[100px] w-20 rounded-[11px] bg-superficie object-cover" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="order-1 w-full rounded-3xl bg-linear-to-br from-esmeralda/60 via-tinta/10 to-azul/60 p-px sm:order-2">
                                <div className="relative overflow-hidden rounded-[23px] bg-superficie">
                                    {hayDescuento && (
                                        <Badge className="absolute top-4 left-4 z-10 gap-1 border-0 bg-linear-to-r from-esmeralda to-azul px-3 py-1.5 text-sm font-bold text-tinta tabular-nums shadow-lg shadow-zinc-900/10">
                                            <PercentIcon className="size-3.5" aria-hidden="true" />
                                            -{porcentajeAhorro}%
                                        </Badge>
                                    )}
                                    <img
                                        src={fotoSelecionada || foto}
                                        alt={nombre}
                                        width={800}
                                        height={1000}
                                        fetchPriority="high"
                                        className="aspect-[4/5] w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ───── Información de compra ───── */}
                        <div>
                            <p className="flex flex-wrap items-center gap-x-2 text-sm text-tinta/70">
                                <span className="inline-flex items-center gap-1.5"><TagIcon className="size-3.5 text-emerald-700" aria-hidden="true" /> {marca.nombre}</span>
                                <span aria-hidden="true">·</span>
                                <span>{genero.nombre}</span>
                            </p>

                            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl font-normal tracking-[-0.015em] text-balance">{nombre}</h1>

                            {/* Precio y disponibilidad */}
                            <div className="mt-7 rounded-2xl bg-superficie p-5 ring-1 ring-tinta/10">
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <span className={`text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl ${hayDescuento ? "text-emerald-700" : ""}`}>
                                        $ {Number(precioMostrado).toLocaleString()}
                                    </span>
                                    {hayDescuento && (
                                        <span className="text-lg text-tinta/60 tabular-nums line-through">$ {Number(precio_final).toLocaleString()}</span>
                                    )}
                                </div>
                                {hayDescuento && (
                                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3 py-1 text-sm font-medium text-sky-700 ring-1 ring-sky-400/25 tabular-nums">
                                        <PercentIcon className="size-3.5" aria-hidden="true" />
                                        Ahorras $ {ahorro.toLocaleString()}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-tinta/10 pt-4 text-sm">
                                    <span className={`inline-flex items-center gap-2 font-medium ${disponibilidad.color}`}>
                                        <span className={`size-2 rounded-full ${disponibilidad.punto}`} aria-hidden="true" />
                                        {disponibilidad.texto}
                                    </span>
                                    {historial_descuentos.length > 0 && historial_descuentos.map((h) => (
                                        <span key={h.idartdescuento} className="inline-flex items-center gap-1.5 text-tinta/60 tabular-nums">
                                            <PercentIcon className="size-3.5 text-emerald-700" aria-hidden="true" />
                                            {h.cantidad_inicial ? `Quedan ${h.cantidad_restante} de ${h.cantidad_inicial} con descuento` : `Quedan ${h.cantidad_restante} con descuento`}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Talla y color */}
                            <dl className="mt-7 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-superficie p-4 ring-1 ring-tinta/10">
                                    <dt className="flex items-center gap-1.5 text-xs text-tinta/60"><RulerIcon className="size-3.5" aria-hidden="true" /> Talla</dt>
                                    <dd className="mt-2 flex size-11 items-center justify-center rounded-xl bg-tinta text-sm font-bold text-lienzo">{talla.codigo}</dd>
                                </div>
                                <div className="rounded-2xl bg-superficie p-4 ring-1 ring-tinta/10">
                                    <dt className="flex items-center gap-1.5 text-xs text-tinta/60"><PaletteIcon className="size-3.5" aria-hidden="true" /> Color</dt>
                                    <dd className="mt-2 flex min-h-11 items-center gap-2.5">
                                        <span className="size-8 rounded-full ring-2 ring-tinta/20 ring-offset-2 ring-offset-superficie" style={{ backgroundColor: color.hex_code }} aria-hidden="true" />
                                        <span className="text-sm font-medium">{color.nombre}</span>
                                    </dd>
                                </div>
                            </dl>

                            {/* Acciones */}
                            <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                <Button
                                    type="button"
                                    size="lg"
                                    onClick={() => agregarALCarrito()}
                                    className="h-12 bg-linear-to-r from-esmeralda to-azul text-base font-semibold text-tinta hover:brightness-110 focus-visible:ring-esmeralda/50"
                                >
                                    <ShoppingCart className="size-5" aria-hidden="true" />
                                    Agregar al carrito
                                </Button>
                                <Button
                                    type="button"
                                    size="lg"
                                    variant="outline"
                                    className="h-12 border-tinta/25 bg-transparent text-base text-tinta hover:bg-tinta/10 hover:text-tinta focus-visible:ring-esmeralda/50"
                                >
                                    Comprar ahora
                                    <ChevronRightIcon className="size-5" aria-hidden="true" />
                                </Button>
                            </div>

                            {/* Descripción */}
                            {descripcion && (
                                <section className="mt-10" aria-labelledby="titulo-descripcion">
                                    <h2 id="titulo-descripcion" className="font-display text-2xl font-normal">Descripción</h2>
                                    <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-tinta/70">{descripcion}</p>
                                </section>
                            )}

                            {/* Ficha */}
                            <section className="mt-10" aria-labelledby="titulo-ficha">
                                <h2 id="titulo-ficha" className="font-display text-2xl font-normal">Detalles del producto</h2>
                                <dl className="mt-3 divide-y divide-tinta/10 border-y border-tinta/10 text-sm">
                                    <FilaFicha icono={<TagIcon className="size-4" />} etiqueta="Marca" valor={marca.nombre} />
                                    <FilaFicha icono={<FolderIcon className="size-4" />} etiqueta="Género" valor={genero.nombre} />
                                    <FilaFicha icono={<RulerIcon className="size-4" />} etiqueta="Talla" valor={talla.codigo} />
                                    <FilaFicha icono={<PaletteIcon className="size-4" />} etiqueta="Color" valor={color.nombre} />
                                    <FilaFicha icono={<BarcodeIcon className="size-4" />} etiqueta="Referencia (SKU)" valor={sku} />
                                </dl>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Barra de compra fija (solo móvil) */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-tinta/10 bg-lienzo/95 pt-4 pb-5 pr-24 pl-5 backdrop-blur-md lg:hidden">
                <div className="min-w-0">
                    <p className="text-xs text-tinta/60">{hayDescuento ? "Precio con descuento" : "Precio"}</p>
                    <p className={`truncate text-xl font-semibold tracking-tight tabular-nums ${hayDescuento ? "text-emerald-700" : ""}`}>
                        $ {Number(precioMostrado).toLocaleString()}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => agregarALCarrito()}
                    className="h-11 shrink-0 bg-linear-to-r from-esmeralda to-azul font-semibold text-tinta hover:brightness-110 focus-visible:ring-esmeralda/50"
                >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                    Agregar
                </Button>
            </div>

            <Footer/>

            {notificacion.abierto && (
                <ModalMensaje
                    abierto={notificacion.abierto}
                    mensaje={notificacion.mensaje}
                    tipo={notificacion.tipo}
                />
            )}
        </div>
    )
}

function FilaFicha({ icono, etiqueta, valor }){
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <dt className="flex items-center gap-2 text-tinta/60">
                <span className="text-tinta/60" aria-hidden="true">{icono}</span>
                {etiqueta}
            </dt>
            <dd className="font-medium">{valor}</dd>
        </div>
    )
}

export default DetallesArticulos;
