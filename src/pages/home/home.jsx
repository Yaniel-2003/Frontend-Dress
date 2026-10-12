import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { GetTiendaPublica } from "../../services/home.services";
import { getTalla, getCategoria, getColor, getMarca, getPrendas } from "../../services/catalogo.service";
import { Link } from "react-router-dom";
import { SearchIcon, SlidersIcon, ChevronLeftIcon, ChevronRightIcon } from "../../components/Icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VestidoIcono } from "../../components/Logo";

// Foto del escaparate (public/imgDress). Se sirve la copia optimizada de 2400px; el original está al lado.
const FOTO_ESCAPARATE = "/imgDress/imghome-2400.jpg";



//FUNCION PARA TRAER LOS CATALOGOS (MARCAS, TALLAS Y DEMAS )
function useCatalogo(){
    const [marca, setMarca] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [talla, setTalla] = useState([]);
    const [color, setColor] = useState([]);
    const [prendas, setPrendas] = useState([]);

    //FUNCION PARA TRAER LOS DATOS
    useEffect(() =>{
        const catalogo = async () => {
            try{
               const [
                    dataMarca,
                    dataCategoria,
                    dataTalla,
                    dataColor,
                    dataPrendas
                ] = await Promise.all([
                    getMarca(),
                    getCategoria(),
                    getTalla(),
                    getColor(),
                    getPrendas()
                ]);

                setMarca(dataMarca || []);
                setCategoria(dataCategoria || []);
                setTalla(dataTalla || []);
                setColor(dataColor || []);
                setPrendas(dataPrendas || []);
            }catch(error){
                console.log("Error al cargar los catalogos", error);
            }
        };
        catalogo();
    },[]);

    return { marca, categoria, talla, color, prendas };

}


//FUNCION PARA TRAER LOS DATOS PRINCIPALES
function useTiendaPublica(filtros){
    const [datosArticulos, setDatosArticulos] = useState([]);
    const [cargandoDatos, setCargadonDatos] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try{
                setCargadonDatos(true);
                const data = await GetTiendaPublica(filtros, { signal: controller.signal });
                setDatosArticulos(data.results || []);
            }catch(error){
                if(error.name !== "AbortError") console.log("Error al cargar datos: ", error)
            }finally{
                setCargadonDatos(false);
            }
        }, 400);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [filtros]);
    return { datosArticulos, cargandoDatos };
}


function useFiltrosBusqueda(){
    //FILTROS DINAMICOS
    const [filtros, setFiltros] = useState({
        buscar: "",
        marca: [],
        categoria: [],
        color: [],
        talla: [],
        prendas: []
    });


    const actualizarFiltro = (e) => {
        const { name, value, type, checked } = e.target;

        setFiltros((prev) => {
            if (type === "checkbox"){
                const actual = prev[name];
                return {
                    ...prev,
                    [name]: checked ? [...actual, value] : actual.filter((v) => v !== value),
                };
            }
            return { ...prev, [name]: value };
        });
    };
    return { filtros, actualizarFiltro };
}

function Home() {
    const [modalFiltrosAbierto, setModalFiltrosAbierto] = useState(false);
    const {filtros, actualizarFiltro} = useFiltrosBusqueda();
    const { datosArticulos } = useTiendaPublica(filtros);
    const { marca, categoria, talla, color, prendas} = useCatalogo();

    const [conDescuento, sinDescuento] = datosArticulos.reduce(
        (acumulador, art) => {
            const tieneDescuento = art.descuentos_activos?.find(
                (desc) => Number(desc.precio_con_descuento) < Number(art.precio_final)
            );
            if(tieneDescuento){
                acumulador[0].push({ ...art, tieneDescuento });
            }else {
                acumulador[1].push(art);
            }
            return acumulador;
        },
        [[],[]]
    );

    const [indiceCarrusel, setIndiceCarrusel] = useState(0);

    const irSiguiente = () => {
        if(indiceCarrusel < conDescuento.length - 1){
            setIndiceCarrusel(indiceCarrusel + 1);
        }
    };

    const irAnterior = () => {
        if(indiceCarrusel > 0){
            setIndiceCarrusel(indiceCarrusel - 1);
        }
    };

    



    // Productos que se muestran en el collage del hero (solo lectura)
    const destacados = (conDescuento.length > 0 ? conDescuento : sinDescuento).slice(0, 3);

    return (
        <div className="flex min-h-screen flex-col bg-lienzo text-tinta selection:text-tinta">
            <NavBar />
            <main className="flex-1">
                {/* ───── Escaparate: la tienda vista desde la calle, de noche ───── */}
                <section className="relative isolate overflow-hidden" aria-labelledby="titulo-superficie">
                    <img
                        src={FOTO_ESCAPARATE}
                        alt="Perchero de la tienda con prendas en tonos crema, camel y oliva bajo luz cálida"
                        width={2400}
                        height={1600}
                        fetchPriority="high"
                        className="encender-foto absolute inset-0 -z-20 size-full object-cover object-[50%_30%]"
                    />
                    {/* velos para que el texto se lea sobre la foto */}
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-lienzo from-0% via-lienzo/55 via-30% to-transparent to-65%" />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-linear-to-r from-lienzo/60 from-0% via-lienzo/15 via-40% to-transparent to-60% lg:block" />

                    <div className="mx-auto flex min-h-[min(80svh,50rem)] w-full max-w-7xl flex-col justify-end px-5 pt-40 pb-12 sm:px-8 sm:pb-16">
                        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
                            <div className="max-w-2xl">
                                <h1
                                    id="titulo-superficie"
                                    className="font-display text-[clamp(3rem,7.5vw,5.5rem)] leading-[0.98] font-normal tracking-[-0.02em] text-balance"
                                >
                                    La colección,<br />a la vista.
                                </h1>
                                <p className="mt-5 max-w-md text-base leading-relaxed text-tinta/75 sm:text-lg">
                                    Prendas elegidas una a una. Busca por nombre o filtra por talla, color y marca.
                                </p>

                                <div className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl bg-white/85 p-1.5 pl-4 shadow-[inset_0_1px_0_rgb(244_239_230/0.14),0_18px_48px_-24px_rgb(24_24_27/0.12)] ring-1 ring-tinta/20 backdrop-blur-md transition-[box-shadow] focus-within:ring-2 focus-within:ring-esmeralda/70 focus-within:shadow-[inset_0_1px_0_rgb(244_239_230/0.14),0_0_0_6px_rgb(52_211_153/0.12),0_0_48px_-12px_rgb(96_165_250/0.45)]">
                                    <SearchIcon className="size-[18px] shrink-0 text-emerald-700" aria-hidden="true" />
                                    <label htmlFor="buscar" className="sr-only">Buscar prendas</label>
                                    <input
                                        id="buscar"
                                        type="search"
                                        name="buscar"
                                        value={filtros.buscar}
                                        onChange={actualizarFiltro}
                                        autoComplete="off"
                                        enterKeyHint="search"
                                        className="h-12 min-w-0 flex-1 bg-transparent text-base text-tinta outline-none placeholder:text-tinta/50 sm:text-[15px] [&::-webkit-search-cancel-button]:cursor-pointer"
                                        placeholder="Busca una prenda…"
                                    />
                                    <BotonFiltros filtros={filtros} onClick={() => setModalFiltrosAbierto(true)} />
                                    {modalFiltrosAbierto && (
                                        <ModalFiltros
                                            onClose={() => setModalFiltrosAbierto(false)}
                                            filtros={filtros}
                                            onChange={actualizarFiltro}
                                            marca={marca}
                                            categoria={categoria}
                                            talla={talla}
                                            color={color}
                                            prendas={prendas}
                                        />
                                    )}
                                </div>

                                <a
                                    href="#catalogo"
                                    className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-tinta/80 underline-offset-[6px] transition-colors hover:text-tinta hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
                                >
                                    Ver toda la colección
                                    <ChevronRightIcon className="size-4 rotate-90" aria-hidden="true" />
                                </a>
                            </div>

                            <ColagePortada articulos={destacados} />
                        </div>
                    </div>
                </section>

                {/* ───── En oferta (carrusel): solo aparece cuando hay prendas rebajadas ───── */}
                {conDescuento.length > 0 && (
                <section id="ofertas" className="mx-auto mt-20 w-full max-w-7xl scroll-mt-24" aria-labelledby="titulo-ofertas">
                    <EncabezadoSeccion
                        id="titulo-ofertas"
                        titulo="En oferta"
                        descripcion="Precios rebajados ahora mismo."
                    />
                    {(
                        <div className="relative mx-auto w-full overflow-hidden">
                            <div
                                className="flex gap-6 px-5 py-3 transition-transform duration-500 ease-out sm:px-8"
                                style={{transform: `translateX(-${indiceCarrusel * 312}px)`}}
                            >
                                {conDescuento.map((art) => (
                                    <div
                                        key={art.idvararticulo}
                                        className="w-72 shrink-0"
                                    >
                                        <CarruselArticulosDesceunto
                                            datos={art}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={irAnterior}
                                disabled={indiceCarrusel === 0}
                                aria-label="Ver ofertas anteriores"
                                className={`absolute top-[40%] left-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-tinta text-lienzo shadow-lg shadow-zinc-900/10 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${indiceCarrusel === 0 ? "pointer-events-none opacity-0" : "cursor-pointer hover:bg-zinc-800"}`}
                            >
                                <ChevronLeftIcon className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={irSiguiente}
                                disabled={indiceCarrusel >= conDescuento.length - 1}
                                aria-label="Ver más ofertas"
                                className={`absolute top-[40%] right-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-tinta text-lienzo shadow-lg shadow-zinc-900/10 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${indiceCarrusel >= conDescuento.length - 1 ? "pointer-events-none opacity-0" : "cursor-pointer hover:bg-zinc-800"}`}
                            >
                                <ChevronRightIcon className="size-5" />
                            </button>
                        </div>
                    )}
                </section>
                )}

                {/* ───── La colección ───── */}
                <section id="catalogo" className="mx-auto mt-16 mb-28 w-full max-w-7xl scroll-mt-24" aria-labelledby="titulo-catalogo">
                    <EncabezadoSeccion
                        id="titulo-catalogo"
                        titulo="La colección"
                        descripcion={`${sinDescuento.length} ${sinDescuento.length === 1 ? "prenda" : "prendas"} en la colección`}
                    />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-5 sm:grid-cols-3 sm:gap-x-6 sm:px-8 lg:grid-cols-4">
                        {sinDescuento && sinDescuento.length > 0 ? (
                            sinDescuento.map((art2) => (
                                <div
                                    key={art2.idvararticulo}
                                    className="min-w-0"
                                >
                                    <CardsArticulos
                                        datos={art2}
                                    />
                                </div>
                            ))
                        ): (
                            <div className="col-span-full flex flex-col items-center gap-3 border-y border-tinta/10 py-16 text-center text-tinta/60">
                                <VestidoIcono className="size-10 text-tinta/60 [&_path:last-child]:stroke-current" />
                                <p className="text-sm">No hay prendas que coincidan. Prueba con otra búsqueda o quita filtros.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

// Foto del producto con respaldo: si la imagen no carga, se muestra la silueta de la marca (solo visual)
function FotoPrenda({ src, alt, className = "" }){
    const [fallo, setFallo] = useState(false);

    if (!src || fallo) {
        return (
            <div role="img" aria-label={alt} className={`flex items-center justify-center bg-superficie ${className}`}>
                <VestidoIcono className="size-1/3 text-tinta/60 [&_path:last-child]:stroke-current" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            width={400}
            height={500}
            onError={() => setFallo(true)}
            className={`object-cover ${className}`}
        />
    );
}

// Prendas "en vitrina" dentro del escaparate: productos reales enlazados a su detalle (solo visual)
function ColagePortada({ articulos }){
    if (articulos.length === 0) return null;

    return (
        <div className="hidden lg:block">
            <p className="mb-3 text-sm text-tinta/70">En vitrina</p>
            <ul className="flex gap-3">
                {articulos.map((art) => {
                    const oferta = art.tieneDescuento;
                    const precio = oferta ? oferta.precio_con_descuento : art.precio_final;
                    return (
                        <li key={art.idvararticulo} className="w-32">
                            <Link
                                to={`/detalles-articulos/${art.idvararticulo}`}
                                className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
                            >
                                <FotoPrenda
                                    src={art.foto}
                                    alt={art.articulos_nombre}
                                    className="aspect-[4/5] w-full rounded-xl ring-1 ring-tinta/20 transition-[filter,box-shadow] duration-300 group-hover:brightness-110 group-hover:ring-esmeralda/60"
                                />
                                <p className="mt-2 truncate text-xs text-tinta/80">{art.articulos_nombre}</p>
                                <p className="text-xs font-semibold tabular-nums">$ {Number(precio).toLocaleString()}</p>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function EncabezadoSeccion({ id, titulo, descripcion }){
    return (
        <div className="mx-5 mb-8 flex flex-col gap-2 border-b border-tinta/10 pb-5 sm:mx-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 id={id} className="font-display text-3xl leading-tight font-normal sm:text-4xl">{titulo}</h2>
            <p className="text-sm text-tinta/60">{descripcion}</p>
        </div>
    )
}

// Botón de filtros dentro del buscador; el contador solo lee los filtros elegidos (solo visual)
function BotonFiltros({ filtros, onClick }){
    const activos = ["categoria", "prendas", "talla", "marca", "color"].reduce((n, k) => n + filtros[k].length, 0);
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={activos > 0 ? `Filtros, ${activos} activos` : "Filtros"}
            className="relative inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-tinta px-4 text-sm font-semibold text-lienzo transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
            <SlidersIcon className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Filtros</span>
            {activos > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-esmeralda px-1.5 text-[11px] font-bold text-tinta tabular-nums">
                    {activos}
                </span>
            )}
        </button>
    );
}

// Clases compartidas por las tarjetas de vitrina
const claseTarjeta =
    "group flex h-full flex-col rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600";
// marco con degradado esmeralda → azul que se enciende al pasar el cursor
const claseMarco =
    "relative rounded-2xl bg-tinta/10 p-px " +
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-br before:from-esmeralda/85 before:via-esmeralda/20 before:to-azul/85 " +
    "before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100 group-focus-visible:before:opacity-100";
const claseCaja =
    "relative overflow-hidden rounded-[15px] bg-superficie " +
    "after:pointer-events-none after:absolute after:inset-0 " +
    "after:bg-[radial-gradient(90%_55%_at_15%_0%,rgb(52_211_153/0.18),transparent_70%),radial-gradient(80%_50%_at_100%_100%,rgb(96_165_250/0.16),transparent_70%)] " +
    "after:mix-blend-multiply after:opacity-60 after:transition-opacity after:duration-300 group-hover:after:opacity-100";

// Píldora "Ver detalle" que aparece sobre la foto (solo visual)
function VerDetalle(){
    return (
        <span className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-lienzo/75 px-3.5 py-2.5 text-sm font-medium text-tinta opacity-0 ring-1 ring-tinta/15 backdrop-blur-md transition-[opacity,translate] duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:translate-y-2 motion-safe:group-hover:translate-y-0">
            Ver detalle
            <ChevronRightIcon className="size-4 text-emerald-700" aria-hidden="true" />
        </span>
    );
}

function CarruselArticulosDesceunto({ datos }){
    const descuento = datos.tieneDescuento;
    const porcentaje = descuento
        ? Math.round((1 - Number(descuento.precio_con_descuento) / Number(datos.precio_final)) * 100)
        : null;
    const ahorro = descuento
        ? Number(datos.precio_final) - Number(descuento.precio_con_descuento)
        : 0;

    return(
        <Link to={`/detalles-articulos/${datos.idvararticulo}`} className={claseTarjeta}>
            <div className={claseMarco}>
                <div className={claseCaja}>
                    <FotoPrenda
                        src={datos.foto}
                        alt={datos.articulos_nombre}
                        className="aspect-[4/5] w-full"
                    />
                    {porcentaje !== null && porcentaje > 0 && (
                        <Badge className="absolute top-3 left-3 z-10 border-0 bg-linear-to-r from-esmeralda to-azul px-2.5 py-1 text-xs font-bold text-tinta tabular-nums shadow-lg shadow-zinc-900/10">
                            -{porcentaje}%
                        </Badge>
                    )}
                    <VerDetalle />
                </div>
            </div>
            <div className="mt-4 flex flex-1 flex-col px-0.5">
                <h3 className="truncate text-[15px] font-medium">{datos.articulos_nombre}</h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-tinta/60">{datos.descripcion}</p>
                <div className="mt-2">
                    {descuento ? (
                        <>
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-lg font-semibold text-emerald-700 tabular-nums">
                                    $ {Number(descuento.precio_con_descuento).toLocaleString()}
                                </span>
                                <span className="text-sm text-tinta/60 tabular-nums line-through">
                                    $ {Number(datos.precio_final).toLocaleString()}
                                </span>
                            </div>
                            {ahorro > 0 && (
                                <p className="mt-0.5 text-xs text-sky-700 tabular-nums">
                                    Ahorras $ {ahorro.toLocaleString()}
                                </p>
                            )}
                        </>
                    ) : (
                        <span className="text-lg font-semibold tabular-nums">$ {Number(datos.precio_final).toLocaleString()}</span>
                    )}
                </div>
            </div>
        </Link>
    )
}

function CardsArticulos({ datos }){
    return (
        <Link to={`/detalles-articulos/${datos.idvararticulo}`} className={claseTarjeta}>
            <div className={claseMarco}>
                <div className={claseCaja}>
                    <FotoPrenda
                        src={datos.foto}
                        alt={datos.articulos_nombre}
                        className="aspect-[4/5] w-full"
                    />
                    <VerDetalle />
                </div>
            </div>
            <div className="mt-4 flex flex-1 flex-col px-0.5">
                <h3 className="truncate text-[15px] font-medium">{datos.articulos_nombre}</h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-tinta/60">{datos.descripcion}</p>
                {datos && (
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                        <p className="text-lg font-semibold tabular-nums">
                            $ {Number(datos.precio_final).toLocaleString()}
                        </p>
                        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tinta/8 text-tinta/70 ring-1 ring-tinta/10 transition-colors group-hover:bg-esmeralda group-hover:text-tinta group-hover:ring-esmeralda">
                            <ChevronRightIcon className="size-4" />
                        </span>
                    </div>
                )}
            </div>
        </Link>
    )
}

function CampoCheck({ label, name, value, onChange, checked, muestra }){
    return (
        <label className="group/chip inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-tinta/15 bg-tinta/[0.03] px-4 text-sm text-tinta/80 transition-colors select-none hover:border-tinta/35 hover:text-tinta has-[:checked]:border-esmeralda/70 has-[:checked]:bg-esmeralda/15 has-[:checked]:text-tinta has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-esmeralda/50">
            <input
                type="checkbox"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            {muestra && (
                <span aria-hidden="true" className="size-3.5 rounded-full ring-1 ring-tinta/30" style={{ backgroundColor: muestra }} />
            )}
            {label}
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="hidden size-3.5 text-emerald-700 group-has-[:checked]/chip:block">
                <path d="M5 13l4 4L19 7" />
            </svg>
        </label>
    )
}

function SeccionFiltro({ titulo, elegidos = 0, children }){
    return (
        <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-sm font-semibold">
                {titulo}
                {elegidos > 0 && (
                    <span className="rounded-full bg-esmeralda/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 tabular-nums">{elegidos}</span>
                )}
            </legend>
            <div className="flex flex-wrap gap-2">
                {children}
            </div>
        </fieldset>
    )
}

function ModalFiltros({ onClose, filtros, onChange,  marca, categoria, talla, color, prendas }){
    // Se monta en <body> para quedar por encima de la barra y del botón del carrito (solo visual)
    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-zinc-950/40 text-left text-tinta backdrop-blur-sm sm:items-center sm:p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-filtros"
                className="flex max-h-[88dvh] w-full max-w-2xl flex-col rounded-t-2xl bg-superficie p-6 text-tinta selection:text-tinta shadow-xl shadow-zinc-900/10 ring-1 ring-tinta/10 sm:rounded-2xl sm:p-8"
            >
                <header className="mb-6 flex shrink-0 items-center justify-between">
                    <div>
                        <h2 id="titulo-filtros" className="font-display text-3xl leading-none font-normal">
                            Filtrar la colección
                        </h2>
                        <p className="mt-2 text-sm text-tinta/60">Elige una o varias opciones; los resultados se actualizan al momento.</p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-lg"
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                        className="-mr-2 text-tinta/60 hover:bg-tinta/10 hover:text-tinta focus-visible:ring-esmeralda/50"
                    >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2} d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </Button>
                </header>
                <div className="flex-1 space-y-7 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:rgb(11_11_12/0.2)_transparent]">
                    <SeccionFiltro titulo="Categorías" elegidos={filtros.categoria.length}>
                        {categoria?.map((cat) => (
                            <CampoCheck
                                key={cat.idcategoria}
                                label={cat.nombre}
                                name="categoria"
                                value={cat.idcategoria}
                                checked={filtros.categoria.includes(String(cat.idcategoria))}
                                onChange={onChange}
                            />
                        ))}
                    </SeccionFiltro>
                    <SeccionFiltro titulo="Prendas" elegidos={filtros.prendas.length}>
                        {prendas?.map((prenda) => (
                            <CampoCheck
                                key={prenda.idprenda}
                                label={prenda.nombre}
                                name="prendas"
                                value={prenda.idprenda}
                                checked={filtros.prendas.includes(String(prenda.idprenda))}
                                onChange={onChange}
                            />
                        ))}
                    </SeccionFiltro>
                    <SeccionFiltro titulo="Tallas" elegidos={filtros.talla.length}>
                        {talla?.map((tallas) => (
                            <CampoCheck
                                key={tallas.idtalla}
                                label={tallas.codigo}
                                name="talla"
                                value={tallas.idtalla}
                                checked={filtros.talla.includes(String(tallas.idtalla))}
                                onChange={onChange}
                            />
                        ))}
                    </SeccionFiltro>
                    <SeccionFiltro titulo="Marcas" elegidos={filtros.marca.length}>
                        {marca?.map((marcas) => (
                            <CampoCheck
                                key={marcas.idmarca}
                                label={marcas.nombre}
                                name="marca"
                                value={marcas.idmarca}
                                checked={filtros.marca.includes(String(marcas.idmarca))}
                                onChange={onChange}
                            />
                        ))}
                    </SeccionFiltro>
                    <SeccionFiltro titulo="Color" elegidos={filtros.color.length}>
                        {color?.map((colores) => (
                            <CampoCheck
                                key={colores.idcolor}
                                label={colores.nombre}
                                name="color"
                                value={colores.idcolor}
                                checked={filtros.color.includes(String(colores.idcolor))}
                                onChange={onChange}
                                muestra={colores.hex_code}
                            />
                        ))}
                    </SeccionFiltro>
                </div>
                <footer className="mt-6 flex shrink-0 justify-end border-t border-tinta/10 pt-5">
                    <Button
                        type="button"
                        size="lg"
                        onClick={onClose}
                        className="w-full bg-linear-to-r from-esmeralda to-azul font-semibold text-tinta hover:brightness-110 focus-visible:ring-esmeralda/50 sm:w-auto"
                    >
                        Ver resultados
                    </Button>
                </footer>
            </div>
        </div>,
        document.body
    )
};

export default Home;
