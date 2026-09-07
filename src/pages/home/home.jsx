import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { GetTiendaPublica } from "../../services/home.services";
import { getTalla, getCategoria, getColor, getCupon, getDescuento, getMarca, getGenero, getImpuesto, getPrendas } from "../../services/catalogo.service";
import { getAllVariante } from "../../services/articulo.service";
import { use } from "react";



//CONST FORMATO MILES
const formatoMiles = (numero) => {
    if(!numero) return "";
    const numLimpio = numero.toString().replace(/\D/g, "");
    return numLimpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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

    const articulosConDescuento = datosArticulos.filter((art) => {
        return art.descuentos_activos?.find(
            (desc) => desc.precio_con_descuento < art.precio_final
        );
    });

    const articulosSinDescuento = datosArticulos.filter((art) => {
        return !articulosConDescuento.includes(art);
    })

    const [indiceCarrusel, setIndiceCarrusel] = useState(0);

    const irSiguiente = () => {
        if(indiceCarrusel < articulosConDescuento.length - 1){
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
                <div className="grow p-4 flex flex-col justify-center items-center text-center bg-emerald-700">
                    <h1 className="text-3xl font-bold text-gray-100">
                        Bienvenido a Dress Shopy
                    </h1>
                    <p className="mt-2 text-gray-100">
                        Encuentra la mejor ropa aquí.
                    </p>
                    <div className="w-full max-w-2xl mt-10 grid grid-cols-[1fr_auto] gap-3 items-center">
                        <input 
                            type="text"
                            name="buscar"
                            value={filtros.buscar}
                            onChange={actualizarFiltro}
                            className="w-full px-4 py-2 text-white border border-white rounded-2xl text-sm outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors" 
                            placeholder="Buscar articulos"
                        />

                        <button
                            type="button"
                            onClick={() => setModalFiltrosAbierto(true)}
                            className="text-white border border-white rounded-xl py-1.5 px-4 cursor-pointer hover:bg-white/10 hover:border-white transition-all duration-200"
                        >
                            Filtros
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
                </div>
                <div className="relative overflow-hidden w-full max-w-7xl flex justify-center items-center">
                    <div 
                        className="flex gap-6 px-4 transition-transform duration-500 ease-in-out"
                        style={{transform: `translateX(-${indiceCarrusel * 312}px)`}}
                    >
                        {articulosConDescuento && articulosConDescuento.length > 0 ? (
                            articulosConDescuento.map((art) => (
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
                            <p className="text-green-800 font-semibold">No hay artículos con descuento</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={irAnterior}
                        disabled={indiceCarrusel === 0}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white/80 rounded-full shadow-lg ${indiceCarrusel === 0 ? `opacity-50 cursor-not-allowed` : `hover:bg-white cursor-pointer`}`}
                    >
                        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={irSiguiente}
                        disabled={indiceCarrusel >= datosArticulos.length - 1}
                        className={`absolute right-0 top-1/2 p-3 -translate-y-1/2 bg-white/80 rounded-full shadow-lg ${indiceCarrusel >= indiceCarrusel.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white cursor-pointer'}`}
                    >
                         <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
                <div className="relative overflow-hidden w-full max-w-7xl mx-auto mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
                        {articulosSinDescuento && articulosSinDescuento.length > 0 ? (
                            articulosSinDescuento.map((art2) => (
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
                            <p className="text-green-800 font-semibold">No hay artículos</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

function CarruselArticulosDesceunto({ datos }){
    return(
        <div className="shadow-2xl rounded-xl py-6 px-4 w-full bg-green-50 flex flex-col h-full">
            <div className="">
                <h3 className="text-green-950 font-semibold text-center uppercase mb-3">
                    {datos.articulos_nombre}
                </h3>
                <div className=" shadow-xl p-2 w-full flex justify-center items-center">
                    <img 
                        src={datos.foto} 
                        alt={datos.articulos_nombre} 
                        className="w-full h-64 object-cover "
                    />
                </div>
                <div className="mt-auto pt-4">
                    <div className="flex text-start">
                        <p className="font-semibold text-gray-800">{datos.descripcion}</p>
                    </div>
                    <div className="flex justify-between mt-5">
                        <p className="font-semibold text-gray-500">Color: <span className="text-black">{datos.color_nombre}</span> </p>
                        <p className="font-semibold text-gray-500">Talla: <span className="text-black">{datos.tallas_nombre}</span> </p>
                    </div>
                </div>
                <div className="mt-2">
                    {datos.descuentos_activos && datos.descuentos_activos.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-500">
                                Precio: 
                                <span className="text-gray-400 line-through text-sm ml-1">
                                    $ {Number(datos.precio_final).toLocaleString()}
                                </span>
                            </p>
                            <span className="text-green-700 font-bold text-lg">
                                $ {Number(datos.descuentos_activos[0].precio_con_descuento).toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <p className="font-semibold text-gray-500">Precio: <span className="text-green-700">$ {Number(datos.precio_con_descuento_activo).toLocaleString()}</span></p>
                    )}
                </div>
            </div>

        </div>
    )
}

function CardsArticulos({ datos }){
    return (
        <div className="shadow-2xl rounded-xl py-6 px-4 w-full bg-green-50 flex flex-col h-full">
            <div className="">
                <h3 className="text-green-950 font-semibold text-center uppercase mb-3">
                    {datos.articulos_nombre}
                </h3>
                <div className=" shadow-xl p-2 w-full flex justify-center items-center">
                    <img 
                        src={datos.foto} 
                        alt={datos.articulos_nombre} 
                        className="w-full h-64 object-cover "
                    />
                </div>
                <div className="mt-auto pt-4">
                    <div className="flex text-start">
                        <p className="font-semibold text-gray-800">{datos.descripcion}</p>
                    </div>
                    <div className="flex justify-between mt-5">
                        <p className="font-semibold text-gray-500">
                            Color: <span className="text-black">{datos.color_nombre}</span> 
                        </p>
                        <p className="font-semibold text-gray-500">
                            Talla: <span className="text-black">{datos.tallas_nombre}</span> 
                        </p>
                    </div>
                </div>
                <div className="mt-2">
                    {datos && (
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-500">
                                Precio: 
                                <span className="text-green-700 text-lg ml-1 font-bold">
                                    $ {Number(datos.precio_final).toLocaleString()}
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}

function ModalFiltros({ onClose, filtros, onChange,  marca, categoria, impuesto, talla, color, prendas }){
    return(
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-3">
            <div className="bg-white rounded-xl w-full max-w-3xl p-6 max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="text-green-900 uppercase font-bold text-[20px]">Filtros de busqueda</h3>
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
                        <h3 className="flex justify-start text-[20px] font-semibold text-green-900 cursor-pointer hover:text-green-600">
                            Categorias
                        </h3>
                        <div className="bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                            <div className="flex flex-row flex-wrap gap-2">
                                {categoria?.map((cat) => (
                                    <label 
                                        key={cat.idcategoria}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/20 p-1 rounded-md transition-colors"
                                    >
                                        <input 
                                            type="checkbox" 
                                            name="categoria"
                                            value={cat.idcategoria}
                                            checked={filtros.categoria.includes(String(cat.idcategoria))}
                                            onChange={onChange}
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="text-[14px] text-gray-700">{cat.nombre}</span>

                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex justify-start text-[20px] font-semibold text-green-900 cursor-pointer hover:text-green-600">
                            Prendas
                        </h3>
                            <div className=" bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
                                    {prendas?.map((prenda) => (
                                        <label 
                                            key={prenda.idprenda}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/50 p-1 rounded-md transition-colors"
                                        >
                                            <input 
                                                type="checkbox"
                                                name="prendas"
                                                value={prenda.idprenda}
                                                checked={filtros.prendas.includes(String(prenda.idprenda))}
                                                onChange={onChange} 
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-[14px] text-gray-700">{prenda.nombre}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex justify-start text-[20px] font-semibold text-green-900 cursor-pointer hover:text-green-600">
                            Tallas
                        </h3>
                            <div className=" bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
                                    {talla?.map((tallas) => (
                                        <label
                                            key={tallas.idtalla}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/20 p-1 rounded-md transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                name="talla"
                                                value={tallas.idtalla}
                                                checked={filtros.talla.includes(String(tallas.idtalla))}
                                                onChange={onChange}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-[14px] text-gray-700">{tallas.codigo}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex justify-start text-[20px] font-semibold text-green-900 cursor-pointer hover:text-green-600">
                            Marcas
                        </h3>
                            <div className="w-[270] bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
                                    {marca?.map((marcas) => (
                                        <label 
                                            key={marcas.idmarca}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/20 p-1 rounded-md transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                name="marca"
                                                value={marcas.idmarca}
                                                checked={filtros.marca.includes(String(marcas.idmarca))}
                                                onChange={onChange}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                                <span className="text-[14px] text-gray-700">{marcas.nombre}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                    </div>
                    <div className="relative">
                        <h3 className="flex justify-start text-[20px] font-semibold text-green-900 cursor-pointer hover:text-green-600">
                            Color
                        </h3>
                            <div className="bg-gray-100 rounded-xl p-2 border border-gray-200 mt-2 flex flex-col gap-2">
                                <div className="flex flex-row flex-wrap gap-2">
                                    {color?.map((colores) => (
                                        <label 
                                            key={colores.idcolor}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/20 p-1 rounded-md transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                name="color"
                                                value={colores.idcolor}
                                                checked={filtros.color.includes(String(colores.idcolor))}
                                                onChange={onChange}
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                                <span className="text-[14px] text-gray-700">{colores.nombre}</span>
                                        </label>
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
                            className="text-green-200 font-semibold bg-green-800 rounded-xl py-1 px-4 border-green-900 hover:text-green-900 hover:bg-green-300 cursor-pointer"
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