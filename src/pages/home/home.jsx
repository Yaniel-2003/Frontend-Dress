import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { GetTiendaPublica } from "../../services/home.services";
import { getTalla, getCategoria, getColor, getMarca, getPrendas } from "../../services/catalogo.service";
import { Link } from "react-router-dom";
import { SearchIcon, SlidersIcon, PercentIcon, ShoppingBagIcon, ChevronLeftIcon, ChevronRightIcon, BoxIcon, FolderIcon, BookmarkIcon, RulerIcon, TagIcon, PaletteIcon } from "../../components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VestidoIcono } from "../../components/Logo";



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
                (desc) => desc.precio_con_descuento < art.precio_final
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
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1">
                {/* ───── Hero ───── */}
                <section className="relative overflow-hidden bg-zinc-950 text-white">
                        <div className="pointer-events-none absolute -top-28 left-[6%] size-[32rem] rounded-full bg-emerald-500/35 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 right-[4%] size-[32rem] rounded-full bg-blue-600/35 blur-3xl" />
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.07]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                                backgroundSize: "44px 44px",
                            }}
                        />

                        <div className="relative mx-auto w-full max-w-7xl px-4 pb-48 pt-12 sm:px-6 sm:pt-16 sm:pb-56">
                        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
                            <div>
                                <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                                    Bienvenido a <span className="text-emerald-300">Dress Shopy</span>
                                </h1>
                                <p className="mt-4 max-w-md text-lg text-white/70">
                                    Encuentra la mejor ropa aquí. Descubre las ofertas del día y renueva tu clóset.
                                </p>

                                <div className="mt-8 grid w-full max-w-xl grid-cols-[1fr_auto] items-center gap-3">
                                    <div className="relative">
                                        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 z-10 size-[18px] -translate-y-1/2 text-white/70" />
                                        <Input
                                            type="text"
                                            name="buscar"
                                            value={filtros.buscar}
                                            onChange={actualizarFiltro}
                                            className="h-12 rounded-2xl border-white/20 bg-white/10 pl-12 text-white backdrop-blur placeholder:text-white/55 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/30"
                                            placeholder="Buscar artículos"
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setModalFiltrosAbierto(true)}
                                        className="h-12 rounded-2xl border-white/20 bg-white/10 px-5 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                                    >
                                        <SlidersIcon className="size-4" />
                                        <span className="hidden sm:inline">Filtros</span>
                                    </Button>
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

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Button asChild size="lg" className="bg-emerald-500 px-6 text-zinc-950 hover:bg-emerald-400">
                                        <a href="#ofertas">
                                            <PercentIcon className="size-4" />
                                            Ver ofertas
                                        </a>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                                        <a href="#catalogo">
                                            Explorar catálogo
                                            <ChevronRightIcon className="size-4" />
                                        </a>
                                    </Button>
                                </div>

                                <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
                                    <div>
                                        <dt className="text-xs text-white/50">Artículos</dt>
                                        <dd className="text-2xl font-bold tracking-tight">{datosArticulos.length}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-white/50">En oferta</dt>
                                        <dd className="text-2xl font-bold tracking-tight text-emerald-300">{conDescuento.length}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-white/50">Categorías</dt>
                                        <dd className="text-2xl font-bold tracking-tight">{categoria.length}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-white/50">Marcas</dt>
                                        <dd className="text-2xl font-bold tracking-tight">{marca.length}</dd>
                                    </div>
                                </dl>
                            </div>

                            <ColagePortada articulos={destacados} />
                        </div>
                        </div>

                        {/* difuminado inferior: la portada se funde con el fondo de la página */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-background/70 to-background" />
                </section>

                {/* ───── Ofertas especiales (carrusel) ───── */}
                <section id="ofertas" className="mx-auto mt-16 w-full max-w-7xl scroll-mt-24">
                    <EncabezadoSeccion
                        icono={<PercentIcon className="size-4" />}
                        titulo="Ofertas especiales"
                        descripcion="Precios rebajados ahora mismo. Aprovecha antes de que se agoten."
                    />
                    <div className="relative mx-auto w-full overflow-hidden">
                        <div
                            className="flex gap-6 px-4 py-3 transition-transform duration-500 ease-in-out sm:px-6"
                            style={{transform: `translateX(-${indiceCarrusel * 312}px)`}}
                        >
                            {conDescuento && conDescuento.length > 0 ? (
                                conDescuento.map((art) => (
                                    <div
                                        key={art.idvararticulo}
                                        className="shrink-0 w-72"
                                    >
                                        <CarruselArticulosDesceunto
                                            datos={art}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white/60 py-12 text-muted-foreground">
                                    <ShoppingBagIcon className="size-8" />
                                    <p className="text-sm font-medium">No hay artículos con descuento</p>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={irAnterior}
                            disabled={indiceCarrusel === 0}
                            aria-label="Anterior"
                            className={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2.5 shadow-lg transition-all ${indiceCarrusel === 0 ? `opacity-0 pointer-events-none` : `hover:bg-zinc-50 hover:scale-105 cursor-pointer`}`}
                        >
                            <ChevronLeftIcon className="size-5 text-zinc-800" />
                        </button>
                        <button
                            type="button"
                            onClick={irSiguiente}
                            disabled={indiceCarrusel >= conDescuento.length - 1}
                            aria-label="Siguiente"
                            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2.5 shadow-lg transition-all ${indiceCarrusel >= conDescuento.length - 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-zinc-50 hover:scale-105 cursor-pointer'}`}
                        >
                            <ChevronRightIcon className="size-5 text-zinc-800" />
                        </button>
                    </div>
                </section>

                {/* ───── Todos los artículos ───── */}
                <section id="catalogo" className="mx-auto mt-16 mb-20 w-full max-w-7xl scroll-mt-24">
                    <EncabezadoSeccion
                        icono={<BoxIcon className="size-4" />}
                        titulo="Todos los artículos"
                        descripcion={`${sinDescuento.length} ${sinDescuento.length === 1 ? "producto" : "productos"} para renovar tu clóset`}
                    />
                    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4">
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
                            <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white/60 py-12 text-muted-foreground">
                                <ShoppingBagIcon className="size-8" />
                                <p className="text-sm font-medium">No hay artículos</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

// Collage del hero: fotos reales de los productos con su etiqueta de precio (solo visual)
function ColagePortada({ articulos }){
    const posiciones = [
        "left-0 top-20 w-44 -rotate-6 z-10",
        "left-[34%] top-0 w-44 rotate-2 z-20",
        "right-0 top-32 w-44 rotate-6 z-30",
    ];

    return (
        <div className="relative mx-auto hidden h-[25rem] w-full max-w-md lg:block">
            {articulos.length === 0 ? (
                <div className="flex size-full items-center justify-center">
                    <VestidoIcono className="size-56 text-white/15" />
                </div>
            ) : (
                articulos.map((art, i) => {
                    const oferta = art.tieneDescuento;
                    const precio = oferta ? oferta.precio_con_descuento : art.precio_final;
                    return (
                        <Link
                            key={art.idvararticulo}
                            to={`/detalles-articulos/${art.idvararticulo}`}
                            className={`group absolute overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-2xl shadow-black/40 transition-transform duration-300 hover:z-40 hover:scale-105 hover:rotate-0 ${posiciones[i]}`}
                        >
                            <img
                                src={art.foto}
                                alt={art.articulos_nombre}
                                className="aspect-[4/5] w-full bg-zinc-800 object-cover"
                            />
                            <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 text-zinc-950">
                                <span className="shrink-0 text-xs font-bold text-emerald-700">$ {Number(precio).toLocaleString()}</span>
                                <span className="truncate text-xs font-medium text-zinc-600">{art.articulos_nombre}</span>
                            </div>
                        </Link>
                    );
                })
            )}
        </div>
    );
}

function EncabezadoSeccion({ icono, titulo, descripcion }){
    return (
        <div className="mb-5 flex items-center gap-3 px-4 sm:px-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                {icono}
            </span>
            <div>
                <h2 className="text-2xl font-bold leading-tight tracking-tight">{titulo}</h2>
                <p className="text-sm text-muted-foreground">{descripcion}</p>
            </div>
        </div>
    )
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
        <Link
            to={`/detalles-articulos/${datos.idvararticulo}`}
            title="Detalles articulo"
            className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/10"
        >
            <div className="relative overflow-hidden bg-zinc-100">
                <img
                    src={datos.foto}
                    alt={datos.articulos_nombre}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {porcentaje !== null && porcentaje > 0 && (
                    <Badge className="absolute top-3 left-3 gap-1 border-0 bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                        <PercentIcon className="size-3" />
                        -{porcentaje}%
                    </Badge>
                )}
                <span className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-1.5 rounded-xl bg-zinc-950/90 py-2.5 text-sm font-semibold text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Ver detalles
                    <ChevronRightIcon className="size-4" />
                </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="truncate text-base font-semibold tracking-tight">
                    {datos.articulos_nombre}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">{datos.descripcion}</p>
                <div className="mt-4">
                    {datos.descuentos_activos && datos.descuentos_activos.length > 0 ? (
                        <>
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-xl font-bold tracking-tight text-emerald-700">
                                    $ {Number(descuento.precio_con_descuento).toLocaleString()}
                                </span>
                                <span className="text-sm text-zinc-400 line-through">
                                    $ {Number(datos.precio_final).toLocaleString()}
                                </span>
                            </div>
                            {ahorro > 0 && (
                                <p className="mt-1 text-xs font-medium text-emerald-700">
                                    Ahorras $ {ahorro.toLocaleString()}
                                </p>
                            )}
                        </>
                    ) : (
                        <span className="text-xl font-bold tracking-tight text-emerald-700">$ {Number(datos.precio_con_descuento_activo).toLocaleString()}</span>
                    )}
                </div>
            </div>
        </Link>
    )
}

function CardsArticulos({ datos }){
    return (
        <Link
            to={`/detalles-articulos/${datos.idvararticulo}`}
            title="Detalles articulos"
            className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-900/10"
        >
            <div className="relative overflow-hidden bg-zinc-100">
                <img
                    src={datos.foto}
                    alt={datos.articulos_nombre}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-1.5 rounded-xl bg-zinc-950/90 py-2.5 text-sm font-semibold text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Ver detalles
                    <ChevronRightIcon className="size-4" />
                </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="truncate text-base font-semibold tracking-tight">
                    {datos.articulos_nombre}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted-foreground">{datos.descripcion}</p>
                <div className="mt-4 flex items-center justify-between">
                    {datos && (
                        <span className="text-xl font-bold tracking-tight">
                            $ {Number(datos.precio_final).toLocaleString()}
                        </span>
                    )}
                    <span className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                        <ChevronRightIcon className="size-4" />
                    </span>
                </div>
            </div>
        </Link>
    )
}

function CampoCheck({ label, name, value, onChange, checked }){
    return (
        <label className="cursor-pointer select-none rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50 has-[:checked]:font-medium has-[:checked]:text-emerald-800 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50">
            <input
                type="checkbox"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            {label}
        </label>
    )
}

function SeccionFiltro({ icono, titulo, children }){
    return (
        <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <span className="text-emerald-600">{icono}</span>
                {titulo}
            </h3>
            <div className="flex flex-wrap gap-2">
                {children}
            </div>
        </div>
    )
}

function ModalFiltros({ onClose, filtros, onChange,  marca, categoria, talla, color, prendas }){
    return(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/40 p-3 text-left text-foreground backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
                <header className="mb-5 flex shrink-0 items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                            <SlidersIcon className="size-4" />
                        </span>
                        Filtros de búsqueda
                    </h3>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={onClose}
                        aria-label="Cerrar filtros"
                        className="text-muted-foreground"
                    >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2} d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </Button>
                </header>
                <div className="flex-1 space-y-6 overflow-y-auto pr-1">
                    <SeccionFiltro icono={<FolderIcon className="size-4" />} titulo="Categorías">
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
                    <SeccionFiltro icono={<BookmarkIcon className="size-4" />} titulo="Prendas">
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
                    <SeccionFiltro icono={<RulerIcon className="size-4" />} titulo="Tallas">
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
                    <SeccionFiltro icono={<TagIcon className="size-4" />} titulo="Marcas">
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
                    <SeccionFiltro icono={<PaletteIcon className="size-4" />} titulo="Color">
                        {color?.map((colores) => (
                            <CampoCheck
                                key={colores.idcolor}
                                label={colores.nombre}
                                name="color"
                                value={colores.idcolor}
                                checked={filtros.color.includes(String(colores.idcolor))}
                                onChange={onChange}
                            />
                        ))}
                    </SeccionFiltro>
                </div>
                <footer className="mt-4 flex shrink-0 justify-end border-t border-zinc-100 pt-4">
                    <Button
                        type="button"
                        size="lg"
                        onClick={onClose}
                        className="hover:bg-emerald-700"
                    >
                        Aplicar filtros
                    </Button>
                </footer>
            </div>
        </div>
    )
};

export default Home;
