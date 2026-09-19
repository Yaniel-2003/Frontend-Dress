import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { GetTiendaPublica } from "../../services/home.services";
import { getTalla, getCategoria, getColor, getCupon, getDescuento, getMarca, getGenero, getImpuesto, getPrendas } from "../../services/catalogo.service";
import { getAllVariante } from "../../services/articulo.service";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { SearchIcon, SlidersIcon, PercentIcon, ShoppingBagIcon, ChevronLeftIcon, ChevronRightIcon, BoxIcon, FolderIcon, BookmarkIcon, RulerIcon, TagIcon, PaletteIcon } from "../../components/Icons";



//FUNCION PARA TRAER LOS CATALOGOS (MARCAS, TALLAS Y DEMAS )
function useCatalogo(){
    const [marca, setMarca] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [impuesto, setImpuesto] = useState([]);
    const [talla, setTalla] = useState([]);
    const [color, setColor] = useState([]);
    const [prendas, setPrendas] = useState([]);
    const [cargando, setCargando] = useState(true);

    //FUNCION PARA TRAER LOS DATOS
    useEffect(() =>{
        const catalogo = async () => {
            try{
               const [
                    dataMarca,
                    dataCategoria,
                    dataImpuesto,
                    dataTalla,
                    dataColor,
                    dataPrendas
                ] = await Promise.all([
                    getMarca(),
                    getCategoria(),
                    getImpuesto(),
                    getTalla(),
                    getColor(),
                    getPrendas()
                ]);

                setMarca(dataMarca || []);
                setCategoria(dataCategoria || []);
                setImpuesto(dataImpuesto || []);
                setTalla(dataTalla || []);
                setColor(dataColor || []);
                setPrendas(dataPrendas || []);
            }catch(error){
                console.log("Error al cargar los catalogos", error);
            }finally{
                setCargando(false);
            }
        };
        catalogo();
    },[]);

    return { marca, categoria, impuesto, talla, color, prendas };

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
    const [variantes, setVariantes] = useState([]);
    const [selecionar, setSeleccionar] = useState([]);
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
    const { marca, categoria, impuesto, talla, color, prendas} = useCatalogo();

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

    


    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main>
                <div className="relative grow p-4 h-70 flex flex-col justify-center items-center text-center bg-gradient-to-br from-emerald-600 to-emerald-800 overflow-hidden">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Bienvenido a Dress Shopy
                    </h1>
                    <p className="mt-2 text-emerald-50">
                        Encuentra la mejor ropa aquí.
                    </p>
                    <div className="w-full max-w-2xl mt-10 grid grid-cols-[1fr_auto] gap-3 items-center">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
                            <input
                                type="text"
                                name="buscar"
                                value={filtros.buscar}
                                onChange={actualizarFiltro}
                                className="w-full pl-11 pr-4 py-2.5 text-white bg-white/10 border border-white/30 rounded-2xl text-sm outline-none placeholder:text-white/60 focus:border-white focus:ring-1 focus:ring-white transition-colors"
                                placeholder="Buscar articulos"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setModalFiltrosAbierto(true)}
                            className="flex items-center gap-2 text-white border border-white/30 bg-white/10 rounded-2xl py-2.5 px-4 cursor-pointer hover:bg-white/20 transition-all duration-200"
                        >
                            <SlidersIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Filtros</span>
                        </button>
                        {modalFiltrosAbierto && (
                            <ModalFiltros 
                                onClose={() => setModalFiltrosAbierto(false)}
                                filtros={filtros}
                                onChange={actualizarFiltro}
                                marca={marca}
                                categoria={categoria}
                                impuesto={impuesto}
                                talla={talla}
                                color={color}
                                prendas={prendas}
                            />
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-white/60 to-white pointer-events-none" />
                </div>
                <div className="w-full max-w-7xl mx-auto px-4 mt-10 mb-3 flex items-center gap-2">
                    <PercentIcon className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-800">Ofertas especiales</h2>
                </div>
                <div className="relative overflow-hidden w-full max-w-7xl flex justify-center items-center">
                    <div
                        className="flex gap-6 px-4 transition-transform duration-500 ease-in-out"
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
                            <div className="flex flex-col items-center gap-2 text-slate-400 py-10 w-full">
                                <ShoppingBagIcon className="w-8 h-8" />
                                <p className="font-medium text-sm">No hay artículos con descuento</p>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={irAnterior}
                        disabled={indiceCarrusel === 0}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow-lg border border-slate-100 ${indiceCarrusel === 0 ? `opacity-40 cursor-not-allowed` : `hover:bg-slate-50 cursor-pointer`}`}
                    >
                        <ChevronLeftIcon className="w-5 h-5 text-slate-700" />
                    </button>
                    <button
                        type="button"
                        onClick={irSiguiente}
                        disabled={indiceCarrusel >= conDescuento.length - 1}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow-lg border border-slate-100 ${indiceCarrusel >= conDescuento.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`}
                    >
                        <ChevronRightIcon className="w-5 h-5 text-slate-700" />
                    </button>
                </div>
                <div className="w-full max-w-7xl mx-auto px-4 mt-10 mb-3 flex items-center gap-2">
                    <BoxIcon className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-800">Todos los artículos</h2>
                </div>
                <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2 px-4">
                        {sinDescuento && sinDescuento.length > 0 ? (
                            sinDescuento.map((art2) => (
                                <div
                                    key={art2.idvararticulo}
                                    className="shrink-0 w-72"
                                >
                                    <CardsArticulos
                                        datos={art2}
                                    />
                                </div>
                            ))
                        ): (
                            <div className="col-span-full flex flex-col items-center gap-2 text-slate-400 py-10">
                                <ShoppingBagIcon className="w-8 h-8" />
                                <p className="font-medium text-sm">No hay artículos</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

function CarruselArticulosDesceunto({ datos }){
    const descuento = datos.tieneDescuento;
    const porcentaje = descuento
        ? Math.round((1 - Number(descuento.precio_con_descuento) / Number(datos.precio_final)) * 100)
        : null;

    return(
        <Link
            to={`/detalles-articulos/${datos.idvararticulo}`}
            title="Detalles articulo"
            className="group block w-full overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
        >
            <div className="relative overflow-hidden">
                <img
                    src={datos.foto}
                    alt={datos.articulos_nombre}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {porcentaje !== null && porcentaje > 0 && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        <PercentIcon className="w-3 h-3" />
                        -{porcentaje}%
                    </span>
                )}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-slate-800 font-semibold uppercase text-sm mb-1 truncate">
                    {datos.articulos_nombre}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 flex-1">{datos.descripcion}</p>
                <div className="mt-3">
                    {datos.descuentos_activos && datos.descuentos_activos.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-emerald-700 font-bold text-lg">
                                $ {Number(descuento.precio_con_descuento).toLocaleString()}
                            </span>
                            <span className="text-slate-400 line-through text-sm">
                                $ {Number(datos.precio_final).toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <span className="text-emerald-700 font-bold text-lg">$ {Number(datos.precio_con_descuento_activo).toLocaleString()}</span>
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
            className="group block w-full overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
        >
            <div className="overflow-hidden">
                <img
                    src={datos.foto}
                    alt={datos.articulos_nombre}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-slate-800 font-semibold uppercase text-sm mb-1 truncate">
                    {datos.articulos_nombre}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 flex-1">{datos.descripcion}</p>
                <div className="mt-3">
                    {datos && (
                        <span className="text-emerald-700 font-bold text-lg">
                            $ {Number(datos.precio_final).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

function CampoCheck({ label, name, value, onChange, checked }){
    return (
        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/20 p-1 rounded-md transition-colors">
            <input 
                type="checkbox"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
            />
            <span className="text-[14px] text-gray-700">{label}</span>
        </label>
    )
}

function ModalFiltros({ onClose, filtros, onChange,  marca, categoria, impuesto, talla, color, prendas }){
    return(
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-3">
            <div className="bg-white rounded-xl w-full max-w-3xl p-6 max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="flex items-center gap-2 text-emerald-900 uppercase font-bold text-[20px]">
                        <SlidersIcon className="w-5 h-5" />
                        Filtros de busqueda
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
                        placeholder="Buscar artículo"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} d="M6 18L18 6M6 6l12 12" 
                            />
                        </svg>
                    </button>
                </header>
                <div className="overflow-y-auto flex-1 pr-1 space-y-4">
                    <div className="relative">
                        <h3 className="flex items-center gap-2 text-[20px] font-semibold text-emerald-900">
                            <FolderIcon className="w-4 h-4 text-emerald-600" />
                            Categorias
                        </h3>
                        <div className="bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                            <div className="flex flex-row flex-wrap gap-2">
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
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex items-center gap-2 text-[20px] font-semibold text-emerald-900">
                            <BookmarkIcon className="w-4 h-4 text-emerald-600" />
                            Prendas
                        </h3>
                            <div className=" bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
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
                                </div>
                            </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex items-center gap-2 text-[20px] font-semibold text-emerald-900">
                            <RulerIcon className="w-4 h-4 text-emerald-600" />
                            Tallas
                        </h3>
                            <div className=" bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
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
                                </div>
                            </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex items-center gap-2 text-[20px] font-semibold text-emerald-900">
                            <TagIcon className="w-4 h-4 text-emerald-600" />
                            Marcas
                        </h3>
                            <div className="w-[270] bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
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
                                </div>
                            </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex items-center gap-2 text-[20px] font-semibold text-emerald-900">
                            <PaletteIcon className="w-4 h-4 text-emerald-600" />
                            Color
                        </h3>
                            <div className="bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
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
                                </div>
                            </div>
                    </div>
                </div>
                <footer className="shrink-0 pt-4 mt-2 border-t border-slate-100">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all cursor-pointer"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </footer>

            </div>
        </div>
    )
};

export default Home;