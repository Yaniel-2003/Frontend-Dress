import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ModalMensaje from "../components/ModalMensajes";
import ModalConfimar from "../components/confrimarEliminar";
import { TagIcon, AlignLeftIcon, DollarIcon, BookmarkIcon, FolderIcon, ScaleIcon, BarcodeIcon, BoxIcon, RulerIcon, PaletteIcon, ImageIcon, EditIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon, SaveIcon } from "../components/Icons";

import { getOneVariante, saveVariante, updateVariante, deleteVariante, getAllArticulos, getAllVariante } from "../services/articulo.service";
import { getOneArticulos, saveArticulo, updateArticulo, deleteArticulo } from "../services/articulo.service";
import { getMarca, getCategoria, getImpuesto, getTalla, getColor, getPrendas } from "../services/catalogo.service";
import { useEffect } from "react";



function Articulos (){
    //MODALES DE EXITO
    const [openModal, setOpenModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");

    const [openModalConfirmar, setModalConfirmar] = useState(false);
    const [itemEliminar, setItemEliminar] = useState(null);

    //FILTROS DINAMICOS
    const [filtros, setFiltros] = useState({
        buscar: "",
        marca: "",
        categoria: "",
        estado: "",
        color: "",
        talla: "",
    });

    const handleFiltros = async (e) => {
        setFiltros({
            ...filtros,
            [e.target.name] : e.target.value
        })
    }

    const cargarBusqueda = async () => {
        const respuesta = await getAllVariante(filtros);

        setVariantes(respuesta);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            cargarBusqueda();
        },500);

        return () => clearTimeout(timer);
    },[filtros]);

    //TABLAS CATALOGO
    const [marca, setMarca] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [impuesto, setImpuesto] = useState([]);
    const [talla, setTalla] = useState([]);
    const [color, setColor] = useState([]);
    const [variantes, setVariantes] = useState([]);
    const [prenda, setprendas] = useState([]);

    // FUNCION PARA TRAER LOS DATOS DE LAS FOREINGKEY
    useEffect(() => {
        const cargardatos = async () =>{
            try{
                const dataMarcas = await getMarca();
                setMarca(dataMarcas);

                const dataCategoria = await getCategoria();
                setCategoria(dataCategoria);

                const dataImpuestos = await getImpuesto();
                setImpuesto(dataImpuestos);

                const dataTalla = await getTalla();
                setTalla(dataTalla);

                const dataColor = await getColor();
                setColor(dataColor);

                const dataVariantes = await getAllVariante();
                setVariantes(dataVariantes);

                const dataPrendas = await getPrendas();
                setprendas(dataPrendas);


            }catch (error){
                console.error("Error al cargar los catálogos:", error);
            }
        };
        cargardatos();
    }, []);

    // ARTICULOS 
    const [modalArticulos, setModalArticulos] = useState(false);

    const [fotos, setFotos] = useState([]);
    const [cargandoArticulos, setCargandoArticulos] = useState(false);
    const [dataArticulos, setDataArticulos] = useState({
        articulo: {
            marca: "",
            categoria: "",
            impuestos: "",
            prendas: "",
            nombre: "",
            slug: "",
            descripcion: "",
            precio_base: "",
            estado: true,
            fecha_creacion: "",
        },

        color: "",
        talla: "",
        sku: "",
        stock: "",
        precio_extra: "",
        foto: null,
    });

    //HANDLE FOTOS
    const hadleFotos = (e) => {
        const archivo = Array.from(e.target.files);

        if(archivo.length > 4){
            alert("Solo puedes seleccionar hasta 4 imágenes.");
            return;
        }

        setFotos(archivo);
    }

    const abrirModalArticulo = () => {
        setModalArticulos(true);
    }

    const cerraModalArticulos = () => {
        setModalArticulos(false);

        setDataArticulos({
            articulo: {
                marca: "", categoria: "", impuestos: "", prendas: "", nombre: "", slug: "", 
                descripcion: "", precio_base: "", estado: true, fecha_creacion: "",
            },
            
            color: "", talla: "", sku: "", stock: "", precio_extra: "", foto: null,
        });
        setFotos([]);
    }

    //SAVE ARTICULO AND UPDATE ARTICULO
    const guardarArticulo = async (e) => {
        e.preventDefault();
        setCargandoArticulos(true);
        try{

            const formData = new FormData();

            formData.append('color', dataArticulos.color);
            formData.append('talla', dataArticulos.talla);
            formData.append('sku', dataArticulos.sku);
            formData.append('stock', dataArticulos.stock);
            formData.append('precio_extra', dataArticulos.precio_extra);


            fotos.forEach((foto, index) => {
                formData.append(`foto${index}`, foto);
            });
            
            formData.append('articulo', JSON.stringify(dataArticulos.articulo));

            if(dataArticulos.idvararticulo){
                await updateVariante(dataArticulos.idvararticulo, formData);
                setMensaje("Articulo actualizado con exito");
            }else {
                await saveVariante(formData);
                setMensaje("Articulo creado con exito.");
            }

            //CONSTANTE PARA ACTUALZAR LA TABLA DE DATOS
            const dataActualizada = await getAllVariante();
            setVariantes(dataActualizada);

            setDataArticulos({
                articulo: {marca: "", categoria: "", impuestos: "", prendas: "", nombre: "", slug: "", 
                descripcion: "", precio_base: "", estado: true, fecha_creacion: "",},
                color: "", talla: "", sku: "", stock: "", precio_extra: "", foto: null,
            });


            setTipo("success");
            setOpenModal(true);
            cerraModalArticulos();

            setTimeout(() => {
                setOpenModal(false);
            },1000);

        }catch(error){
            setMensaje("Error al crear articulo.");
            setTipo("error");
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false);
            },1000);
        }finally{
            setCargandoArticulos(false);
        }
    };

    //FUNCION PARA ACTUALIZAR FORMULARIO VA EN EL ONCHANGE DEL FORMULARIO
    const actualizarFormArticulos = (e) => {
        let { name , value} = e.target;

        //PARA QUE LE PNGA PUNTUACION A LOS NUMEROS
        if(name === "precio_base" || name === "precio_extra"){
            value = value.replace(/\./g, "");
        }

        const camposArticulo = ["marca", "categoria", "impuestos", "prendas", "nombre", "slug", "descripcion", "precio_base", "estado"];
        if (camposArticulo.includes(name)){
            const updatedArticulo = {
                ...dataArticulos.articulo,
                [name]: value
            };

            if (name === "nombre") {
                updatedArticulo.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }

            setDataArticulos({
                ...dataArticulos,
                articulo: updatedArticulo
            });
        }else {
            setDataArticulos({
                ...dataArticulos,
                [name]: value
            })
        }
    };

    //FUNCION BOTON EDITAR
    const editarArticulo = (objArticulo) => {
        setDataArticulos({
            ...objArticulo,
            articulo: {
                ...objArticulo.articulo,
                marca: objArticulo.articulo.marca?.idmarca || objArticulo.articulo.marca,
                categoria: objArticulo.articulo.categoria?.idcategoria || objArticulo.articulo.categoria,
                impuestos: objArticulo.articulo.impuestos?.idimpuesto || objArticulo.articulo.impuesto,
                prendas: objArticulo.articulo.prendas?.idprenda || objArticulo.articulo.prendas,

            },
            color: objArticulo.color?.idcolor || objArticulo.color,
            talla: objArticulo.talla?.idtalla || objArticulo.talla
        });
        abrirModalArticulo();
    }

    //PREPARAR ELIMINACION
    const prepararEliminar  = (articuloSelecionado) =>{
        setItemEliminar(articuloSelecionado);
        setModalConfirmar(true);
    }

    //DELETE ARTICULO
    const eliminarArticulo = async () => {
        setCargandoArticulos(true);
        try{
            await deleteArticulo(itemEliminar.articulo.idarticulo);

            //PARA LIMPIAR LOS DATOS BORRADOS DE LAS TABLAS
            setVariantes(variantes.filter(item => item.articulo.idarticulo !== itemEliminar.articulo.idarticulo));

            setMensaje("Articulo eliminado con exito.");
            setTipo("success");
            setOpenModal(true);
            setModalConfirmar(false);

            setTimeout(() => {
                setOpenModal(false);
            },1000);

        }catch(error){
            setMensaje("Error al eliminar el articulo");
            setTipo("error");
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false);
            },1000);
        }finally{
            setCargandoArticulos(false);
        }
    }

    //FORMATO MILES 
    const formatoMiles = (numero) => {
        //SI NO ES UN NUMERO NO HACE NADA
        if(!numero) return "";

        const numLimpio = numero.toString().replace(/\D/g, "");
        
        return numLimpio.replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
    }




    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <main className="flex-1 w-full max-w-[1400px] mx-auto">
                <h2 className="text-center font-bold text-2xl tracking-tight text-slate-800 mt-6">
                    Artículos
                </h2>
                <div className="flex items-center justify-center sm:justify-end mt-5 px-4 sm:px-6">
                    <button
                        type="button"
                        onClick={abrirModalArticulo}
                        className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                        <svg 
                            className="h-4 w-4 text-white/90 group-hover:text-white transition-transform duration-200 group-hover:scale-110" 
                            viewBox="0 0 640 640" 
                            fill="currentColor"
                        >
                            <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>
                        </svg>
                        <span className="text-sm font-semibold tracking-wide">Nuevo artículo</span>
                    </button>
                </div>



                {modalArticulos && (
                    <div className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-3 sm:p-0">
                        <div className="bg-white border border-slate-200/80 shadow-sm rounded-xl w-full max-w-4xl h-auto max-h-[90vh] flex flex-col overflow-hidden">
                            <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <EditIcon className="w-4 h-4 text-blue-500" /> {dataArticulos.idvararticulo ? 'Editar Artículo' : 'Nuevo Artículo'}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">{dataArticulos.idvararticulo ? 'Modifica los valores del registro seleccionado.' : 'Completa la información para el nuevo registro.'}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={cerraModalArticulos}
                                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </header>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-slate-800 space-y-6">
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-5">
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><FolderIcon className="w-3.5 h-3.5"/> Categoria</label>
                                                <select 
                                                    name="categoria" 
                                                    value={dataArticulos.articulo.categoria}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                >
                                                    <option value="">Seleciona una categoria...</option>
                                                    {categoria.map((c) => (
                                                        <option key={c.idcategoria} value={c.idcategoria}>
                                                            {c.padre ? `${c.padre.nombre} > ${c.nombre}` : c.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><BookmarkIcon className="w-3.5 h-3.5"/> Marca</label>
                                                <select 
                                                    name="marca" 
                                                    value={dataArticulos.articulo.marca}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                >
                                                    <option value="">Seleciona una marca...</option>
                                                    {marca.map((m) => (
                                                        <option key={m.idmarca} value={m.idmarca}>
                                                            {m.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><BookmarkIcon className="w-3.5 h-3.5"/> Prenda</label>
                                                <select 
                                                    name="prendas" 
                                                    value={dataArticulos.articulo.prendas}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                >
                                                    <option value="">Selecciona una prenda...</option>
                                                    {prenda?.map((p) => (
                                                        <option key={p.idprenda} value={p.idprenda}>
                                                            {p.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><TagIcon className="w-3.5 h-3.5"/> Nombre</label>
                                                <input 
                                                    type="text" 
                                                    name="nombre"
                                                    onChange={actualizarFormArticulos}
                                                    value={dataArticulos.articulo.nombre}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                    placeholder="Ej: Camiseta básica de algodón"
                                                />
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><AlignLeftIcon className="w-3.5 h-3.5"/> Descripción</label>
                                                <input 
                                                    type="text" 
                                                    name="descripcion"
                                                    onChange={actualizarFormArticulos}
                                                    value={dataArticulos.articulo.descripcion}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                    placeholder="Ej: Camiseta cómoda 100% algodón, ideal para el verano."
                                                />
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><DollarIcon className="w-3.5 h-3.5"/> Precio base</label>
                                                <input 
                                                    type="text" 
                                                    name="precio_base"
                                                    onChange={actualizarFormArticulos}
                                                    value={formatoMiles(dataArticulos.articulo.precio_base)}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                    placeholder="Ej: 50000"
                                                />
                                            </div>
                                            <div className="relative mt-2">
                                                 <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><ScaleIcon className="w-3.5 h-3.5"/> Impuestos</label>
                                                 <select 
                                                    name="impuestos" 
                                                    value={dataArticulos.articulo.impuestos}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                >
                                                    <option value="">Seleciona un tipo de impuesto...</option>
                                                    {impuesto.map((im) => (
                                                        <option key={im.idimpuesto} value={im.idimpuesto}>
                                                            {im.nombre} - {im.porcentaje}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><PaletteIcon className="w-3.5 h-3.5"/> Color</label>
                                                <select 
                                                    name="color" 
                                                    value={dataArticulos.color}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                >
                                                    <option value="">Seleciona un color...</option>
                                                    {color.map((c) => (
                                                        <option key={c.idcolor} value={c.idcolor}>
                                                            {c.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><RulerIcon className="w-3.5 h-3.5"/> Talla</label>
                                                <select 
                                                    name="talla" 
                                                    value={dataArticulos.talla}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                >
                                                    <option value="">Seleciona una talla...</option>
                                                    {talla.map((t) => (
                                                        <option key={t.idtalla} value={t.idtalla}>
                                                            {t.tipo} : {t.codigo}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><BarcodeIcon className="w-3.5 h-3.5"/> SKU</label>
                                                <input 
                                                    type="text" 
                                                    name="sku"
                                                    value={dataArticulos.sku}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                    placeholder="Ej: CAM-BAS-BLA-M"
                                                />
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><BoxIcon className="w-3.5 h-3.5"/> Stock</label>
                                                <input 
                                                    type="number" 
                                                    name="stock"
                                                    value={dataArticulos.stock}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                    placeholder="Ej: 50"
                                                />
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><DollarIcon className="w-3.5 h-3.5"/> Precio extra</label>
                                                <input 
                                                    type="text" 
                                                    name="precio_extra"
                                                    value={formatoMiles(dataArticulos.precio_extra)}
                                                    onChange={actualizarFormArticulos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                    placeholder="Ej: 5000 (Opcional)"
                                                />
                                            </div>
                                            <div className="relative mt-2">
                                                <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1"><ImageIcon className="w-3.5 h-3.5"/> Fotos</label>
                                                <input 
                                                    type="file" 
                                                    multiple
                                                    accept="image/*"
                                                    onChange={hadleFotos}
                                                    className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <footer className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={guardarArticulo}
                                            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-sm hover:shadow transition-all cursor-pointer"
                                        >
                                            <SaveIcon className="w-4 h-4" /> <span>Guardar</span>
                                        </button>
                                    </footer>
                                </div>
                        </div>
                    </div>
                )}

                {/* BARRA DE FILTROS */}
                <div className="px-4 sm:px-6 pb-2 mt-10">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-2">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filtros de Búsqueda</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            {/* Input Buscar */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Buscar artículo</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        name="buscar"
                                        value={filtros.buscar}
                                        onChange={handleFiltros}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-slate-400"
                                        placeholder="Nombre, SKU, marca..."
                                    />
                                </div>
                            </div>
                            
                            {/* Select Marca */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Marca</label>
                                <select 
                                    name="marca"
                                    value={filtros.marca}
                                    onChange={handleFiltros} 
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="">Todas las marcas</option>
                                    {marca?.map((item) => (
                                        <option key={item.idmarca} value={item.idmarca}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Select Categoría */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Categoría</label>
                                <select 
                                    name="categoria"
                                    value={filtros.categoria}
                                    onChange={handleFiltros} 
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="">Todas las cat.</option>
                                    {categoria?.map((item) => (
                                        <option key={item.idcategoria} value={item.idcategoria}>{item.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Select Color y Talla (En un solo bloque) */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Color / Talla</label>
                                <div className="flex gap-2">
                                    <select 
                                        name="color"
                                        value={filtros.color}
                                        onChange={handleFiltros} 
                                        className="w-1/2 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer"
                                    >
                                        <option value="">Color</option>
                                        {color?.map((item) => (
                                            <option key={item.idcolor} value={item.idcolor}>{item.nombre}</option>
                                        ))}
                                    </select>
                                    <select 
                                        name="talla"
                                        value={filtros.talla}
                                        onChange={handleFiltros} 
                                        className="w-1/2 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer"
                                    >
                                        <option value="">Talla</option>
                                        {talla?.map((item) => (
                                            <option key={item.idtalla} value={item.idtalla}>{item.codigo}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Select Estado */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Estado</label>
                                <select 
                                    name="estado"
                                    value={filtros.estado}
                                    onChange={handleFiltros} 
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="">Cualquiera</option>
                                    <option value="true">Activos</option>
                                    <option value="false">Inactivos</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contenedor scrollable para la tabla (Vital para móviles) */}
                    <div className="w-full overflow-x-auto px-4 sm:px-6 pb-6">
                        <table className="w-full min-w-[800px] text-sm border-separate border-spacing-0 rounded-xl overflow-hidden shadow-sm border border-gray-200/90 mt-5">
                            <thead>
                            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b-2 border-blue-500">
                                <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Nombre / Variante</th>
                                <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Clasificación</th>
                                <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Descripción</th>
                                <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Inventario</th>
                                <th className="px-5 py-3.5 text-right font-semibold border-b-2 border-slate-200">Precios</th>
                                <th className="px-5 py-3.5 text-center font-semibold border-b-2 border-slate-200">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {variantes?.map((data, index) => (
                                <tr
                                    className={`transition-colors hover:bg-slate-50/80 ${ index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                                    key={data.idvararticulo}
                                >
                                    <td className="px-5 py-4 align-top">
                                        <p className="font-medium text-slate-900">{data.articulo.prendas?.nombre}</p>
                                        <p className="font-medium text-slate-900">{data.articulo.nombre}</p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            <span className="font-medium text-slate-500">Marca:</span> {data.articulo.marca.nombre}
                                        </p>

                                        <div className="flex flex-wrap gap-1 mt-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-700 font-medium border border-blue-100/70">
                                                <PaletteIcon className="w-3 h-3 text-blue-500" /> {data.color.nombre}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-700 font-medium border border-slate-200">
                                                <RulerIcon className="w-3 h-3 text-slate-500" /> {data.talla.codigo}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-5 py-4 align-top">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-emerald-50 text-emerald-700 font-medium border border-emerald-100 mb-1">
                                            <FolderIcon className="w-3 h-3 text-emerald-600" /> {data.articulo.categoria.nombre}
                                        </span>
                                        <p className="text-slate-400 text-xs mt-1">
                                            <span className="font-medium text-slate-500">Impuesto:</span> {data.articulo.impuestos.nombre} ({data.articulo.impuestos.porcentaje}%)
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 align-top max-w-[180px]">
                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                                            {data.articulo.descripcion || <span className="italic text-slate-300">Sin descripción</span>}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 align-top">
                                        <p className="text-slate-500 text-xs">
                                            <span className="font-medium text-slate-600">SKU:</span> <span className="font-mono text-slate-700">{data.sku}</span>
                                        </p>
                                        <p className="mt-1.5">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${ data.stock > 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : data.stock > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                <BoxIcon className="w-3 h-3" /> {data.stock} disp.
                                            </span>
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 align-top text-right">
                                        <p className="font-semibold text-slate-900 text-sm">
                                            ${Number(data.articulo.precio_con_impuesto).toLocaleString()}
                                        </p>
                                        <p className="text-slate-400 text-xs mt-0.5">
                                            Base: ${Number(data.articulo.precio_base).toLocaleString()}
                                        </p>
                                        {Number(data.precio_extra) > 0 && (
                                            <p className="text-slate-500 text-xs font-medium mt-0.5 text-amber-600">
                                                Extra: +${Number(data.precio_extra).toLocaleString()}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-5 py-4 align-top">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => editarArticulo(data)}
                                                title="Editar"
                                                className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all cursor-pointer"
                                            >
                                                <EditIcon className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => prepararEliminar(data)}
                                                title="Eliminar"
                                                className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all cursor-pointer"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>

                </div>

            </main>
                {openModalConfirmar && (
                    <ModalConfimar 
                        datosAMostrar={itemEliminar ? itemEliminar.articulo.nombre : ""}
                        onCancelar={() => setModalConfirmar(false)}
                        onConfirmar={eliminarArticulo}
                    />
                )}
                {openModal && (
                    <ModalMensaje 
                        abierto={openModal}
                        mensaje={mensaje}
                        tipo={tipo}
                    />
                )}
            <Footer/>
        </div>
    )
}

export default Articulos;