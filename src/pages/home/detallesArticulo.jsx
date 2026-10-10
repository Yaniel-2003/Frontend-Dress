import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";

import { getOneVariante, getFotosVAriantes } from "../../services/articulo.service";
import ModalMensaje from "../../components/ModalMensajes";
import { agregarCarrito } from "../../services/carrito.service";
import { ChevronLeftIcon, ChevronRightIcon, PercentIcon, TagIcon, RulerIcon, PaletteIcon, BarcodeIcon, FolderIcon, AlignLeftIcon } from "../../components/Icons";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
            }catch(error){
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
    const {articulo, cargando, varFotos} = useDetalleArticulo(id);
    const [fotoSelecionada, setFotoSelecionada] = useState(null);
    const notificacion = useMensajeTemporal();
    const { cantidadCar } = useCarrito();

    const agregarALCarrito = async () => {
        try {
            await agregarCarrito(articulo.idvararticulo);
            await cantidadCar();
            notificacion.mostrar("Articulo agregado al carrito.", "success");
        } catch (error) {
            notificacion.mostrar("Error al agregar al carrito.", "error");
        }
    };

    if(!articulo) return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <main className="flex flex-1 items-center justify-center text-sm font-medium text-muted-foreground">
                Cargando...
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

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:pb-12">
                <Link
                    to="/home"
                    className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ChevronLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
                    Volver al catálogo
                </Link>

                <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                    {/* ───── Galería ───── */}
                    <div className="flex flex-col gap-4 sm:flex-row lg:sticky lg:top-24 lg:self-start">
                        <div className="order-2 flex flex-row flex-wrap justify-center gap-3 sm:order-1 sm:max-h-[34rem] sm:flex-col sm:flex-nowrap sm:justify-start sm:overflow-y-auto sm:pr-1">
                            {varFotos.map((f) => (
                                <img
                                    key={f.idfoto}
                                    src={f.urlfoto}
                                    alt={nombre}
                                    onClick={() => setFotoSelecionada(f.urlfoto)}
                                    className={`size-20 shrink-0 cursor-pointer rounded-xl border-2 bg-zinc-100 object-cover transition-all duration-200 hover:opacity-80 ${fotoSelecionada === f.urlfoto ? "border-emerald-600 ring-2 ring-emerald-600/20" : "border-transparent"}`}
                                />
                            ))}
                        </div>

                        <div className="relative order-1 w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm sm:order-2">
                            {hayDescuento && (
                                <Badge className="absolute left-4 top-4 z-10 gap-1 border-0 bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
                                    <PercentIcon className="size-3.5" />
                                    -{porcentajeAhorro}%
                                </Badge>
                            )}
                            {fotoSelecionada ? (
                                <img
                                    src={fotoSelecionada}
                                    alt={nombre}
                                    className="aspect-[4/5] w-full object-cover transition-opacity duration-300"
                                />
                            ):(
                                <img
                                    src={foto}
                                    alt={nombre}
                                    className="aspect-[4/5] w-full object-cover transition-opacity duration-300"
                                />
                            )}
                        </div>
                    </div>

                    {/* ───── Información de compra ───── */}
                    <div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
                                <TagIcon className="size-3" /> {marca.nombre}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1 text-xs">{genero.nombre}</Badge>
                        </div>

                        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{nombre}</h1>

                        {/* Precio */}
                        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className={`text-4xl font-bold tracking-tight tabular-nums sm:text-5xl ${hayDescuento ? "text-emerald-700" : ""}`}>
                                    $ {Number(precioMostrado).toLocaleString()}
                                </span>
                                {hayDescuento && (
                                    <span className="text-lg text-zinc-400 line-through tabular-nums">$ {Number(precio_final).toLocaleString()}</span>
                                )}
                            </div>
                            {hayDescuento && (
                                <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
                                    <PercentIcon className="size-3.5" />
                                    Ahorras $ {ahorro.toLocaleString()}
                                </p>
                            )}

                            {/* Disponibilidad */}
                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-4 text-sm">
                                <span className={`inline-flex items-center gap-2 font-medium ${stock > 10 ? "text-emerald-700" : stock > 0 ? "text-amber-600" : "text-red-600"}`}>
                                    <span className={`size-2 rounded-full ${stock > 10 ? "bg-emerald-500" : stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
                                    {stock > 10 ? `Disponible · ${stock} unidades` : stock > 0 ? `¡Date prisa! Solo quedan ${stock}` : "Agotado"}
                                </span>
                                {historial_descuentos.length > 0 && historial_descuentos.map((h) => (
                                    <span key={h.idartdescuento} className="inline-flex items-center gap-1.5 text-muted-foreground">
                                        <PercentIcon className="size-3.5 text-emerald-600" />
                                        Quedan {h.cantidad_restante} de {h.cantidad_inicial} con descuento
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Talla y color */}
                        <div className="mt-6 space-y-5">
                            <div className="flex items-center gap-4">
                                <span className="flex w-20 items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                    <RulerIcon className="size-4" /> Talla
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {[talla].map((t) => (
                                        <span
                                            key={t.idtalla}
                                            className="flex size-11 items-center justify-center rounded-xl border-2 border-zinc-950 bg-white text-sm font-bold"
                                        >
                                            {t.codigo}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="flex w-20 items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                    <PaletteIcon className="size-4" /> Color
                                </span>
                                <div className="flex flex-wrap items-center gap-3">
                                    {[color].map((c) => (
                                        <span key={c.idcolor} className="flex items-center gap-2.5">
                                            <span
                                                title={c.nombre}
                                                className="size-8 rounded-full border border-zinc-300 shadow-sm ring-2 ring-white ring-offset-2 ring-offset-zinc-300"
                                                style={{ backgroundColor: c.hex_code }}
                                            />
                                            <span className="text-sm font-medium">{c.nombre}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <Button
                                type="button"
                                size="lg"
                                onClick={() => agregarALCarrito()}
                                className="h-12 text-base hover:bg-emerald-700"
                            >
                                <ShoppingCart className="size-5" />
                                Agregar al carrito
                            </Button>
                            <Button
                                type="button"
                                size="lg"
                                className="h-12 bg-emerald-600 text-base text-white hover:bg-emerald-700"
                            >
                                Comprar ahora
                                <ChevronRightIcon className="size-5" />
                            </Button>
                        </div>

                        {/* Ficha */}
                        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                            <h2 className="border-b border-zinc-100 px-5 py-3 text-sm font-semibold">Detalles del producto</h2>
                            <dl className="divide-y divide-zinc-100 text-sm">
                                <FilaFicha icono={<TagIcon className="size-4" />} etiqueta="Marca" valor={marca.nombre} />
                                <FilaFicha icono={<FolderIcon className="size-4" />} etiqueta="Género" valor={genero.nombre} />
                                <FilaFicha icono={<RulerIcon className="size-4" />} etiqueta="Talla" valor={talla.codigo} />
                                <FilaFicha icono={<PaletteIcon className="size-4" />} etiqueta="Color" valor={color.nombre} />
                                <FilaFicha icono={<BarcodeIcon className="size-4" />} etiqueta="Referencia (SKU)" valor={sku} />
                            </dl>
                        </div>

                        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
                            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                                <AlignLeftIcon className="size-4 text-emerald-600" />
                                Descripción
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">{descripcion}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Barra de compra fija (solo móvil) */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-zinc-200 bg-white/90 py-3 pl-4 pr-24 backdrop-blur lg:hidden">
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{hayDescuento ? "Precio con descuento" : "Precio"}</p>
                    <p className={`truncate text-xl font-bold tracking-tight tabular-nums ${hayDescuento ? "text-emerald-700" : ""}`}>
                        $ {Number(precioMostrado).toLocaleString()}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => agregarALCarrito()}
                    className="shrink-0 hover:bg-emerald-700"
                >
                    <ShoppingCart className="size-4" />
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
        <div className="flex items-center justify-between gap-4 px-5 py-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
                <span className="text-zinc-400">{icono}</span>
                {etiqueta}
            </dt>
            <dd className="font-medium">{valor}</dd>
        </div>
    )
}

export default DetallesArticulos;
