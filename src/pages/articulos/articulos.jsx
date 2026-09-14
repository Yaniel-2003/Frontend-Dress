import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ModalMensaje from "../../components/ModalMensajes";
import ModalConfirmar from "../../components/ConfirmarEliminar";
import {
  TagIcon, AlignLeftIcon, DollarIcon, BookmarkIcon, FolderIcon, ScaleIcon,
  BarcodeIcon, BoxIcon, RulerIcon, PaletteIcon, ImageIcon, EditIcon, TrashIcon, SaveIcon, HashIcon
} from "../../components/Icons";

import {
  saveVariante, updateVariante, deleteArticulo, getAllVariante,
  deleteDescuento, updateDescuento, saveDescuentos
} from "../../services/articulo.service";
import { getMarca, getCategoria, getImpuesto, getTalla, getColor, getPrendas } from "../../services/catalogo.service";

// BLOQUE 1 CONFIGURACION Y UTILIDADES
//ESTADO INICIAL DEL FORMULARIO DE ARTICULO
const ESTADO_INICIAL_ARTICULO = {
  articulo: {
    marca: "", categoria: "", impuestos: "", prendas: "", nombre: "", slug: "",
    descripcion: "", precio_base: "", estado: true, fecha_creacion: "",
  },
  variantesPorTalla: {},
};

//ESTADO INICIAL DEL FORMULARIO DE DESCUENTO
const ESTADO_INICIAL_DESCUENTO = {
  iddescuento: "",
  vararticulo: "",
  cantidad_inicial: "",
  cantidad_restante: "",
  nombre: "",
  tipo: "",
  valor: "",
  valido_desde: "",
  valido_hasta: "",
  estado: true,
};

const CAMPOS_ARTICULO = [
  "marca", "categoria", "impuestos", "prendas", "nombre", "slug", "descripcion", "precio_base", "estado"
];
const CAMPOS_NUMERICOS_FORMATEADOS = ["precio_base"];

//GENERA EL SLUG A PARTIR DEL NOMBRE
const generarSlug = (texto) =>
  texto.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

//QUITA LOS PUNTOS DEL FORMATO DE MILES ANTES DE GUARDAR
const limpiarFormatoNumero = (valor) => valor.replace(/\./g, "");

//FORMATO MILES
const formatoMiles = (numero) => {
  if (!numero) return "";
  const numLimpio = numero.toString().replace(/\D/g, "");
  return numLimpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

//PASA LOS OBJETOS ANIDADOS DEL BACKEND A IDS PLANOS PARA LOS SELECT
const normalizarArticuloParaEdicion = (articulo) => ({
  ...articulo,
  marca: articulo.marca?.idmarca ?? articulo.marca,
  categoria: articulo.categoria?.idcategoria ?? articulo.categoria,
  impuestos: articulo.impuestos?.idimpuesto ?? articulo.impuestos,
  prendas: articulo.prendas?.idprenda ?? articulo.prendas,
});

//ARMA EL FORMDATA CON EL ARTICULO Y EL ARRAY DE VARIANTES
const construirFormDataVariante = (dataArticulos, varianteArray, fotos) => {
  const formData = new FormData();

  formData.append("articulo", JSON.stringify(dataArticulos.articulo));
  formData.append("variantes", JSON.stringify(varianteArray));

  fotos.forEach((foto, index) => formData.append(`foto${index}`, foto));

  return formData;
};


// BLOQUE 2 CATALOGOS Y FILTROS

//HOOK PARA TRAER LOS CATALOGOS
function useCatalogos() {
  const [marca, setMarca] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [impuesto, setImpuesto] = useState([]);
  const [talla, setTalla] = useState([]);
  const [color, setColor] = useState([]);
  const [prenda, setPrenda] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  //FUNCION PARA TRAER LOS DATOS DE LAS FOREINGKEY
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [dataMarcas, dataCategoria, dataImpuestos, dataTalla, dataColor, dataPrendas] =
        await Promise.all([getMarca(), getCategoria(), getImpuesto(), getTalla(), getColor(), getPrendas()]);

        setMarca(dataMarcas);
        setCategoria(dataCategoria);
        setImpuesto(dataImpuestos);
        setTalla(dataTalla);
        setColor(dataColor);
        setPrenda(dataPrendas);
      } catch (error) {
        console.error("Error al cargar los catálogos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarCatalogos();
  }, []);

  return { marca, categoria, impuesto, talla, color, prenda, cargando};
}

//HOOK PARA FILTRAR LAS TALLAS SEGUN LA PRENDA
function useTallasPorPrenda(prendaId) {
  const [tallasDisponibles, setTallasDisponibles] = useState([]);

  //FILTRO DE LAS TALLAS POR MEDIO DE LAS PRENDAS
  useEffect(() => {
    if (!prendaId) {
      setTallasDisponibles([]);
      return;
    }
    let cancelado = false;

    getTalla({ prenda: prendaId }).then((data) => {
      if (!cancelado) setTallasDisponibles(data);
    });

    return () => { cancelado = true; };
  }, [prendaId]);

  return tallasDisponibles;
}

//BLOQUE VARIANTES / TABLA / FILTROS

//HOOK PARA LOS FILTROS DINAMICOS Y LA TABLA
function useVariantesFiltradas() {
  //FILTROS DINAMICOS
  const [filtros, setFiltros] = useState({
    buscar: "", marca: "", categoria: "", estado: "", color: "", talla: "", prendas: "",
    page: 1
  });
  const [variantes, setVariantes] = useState([]);

  const [haySiguiente, setHaySiguiente] = useState(false);
  const [hayAnterior, setHayAnterior] = useState(false);
  const [seleccionados, setSelecionados] = useState([]);

  //FUNCION PARA MARCAR Y DESMARCAR LOS CHECK
  const toggleSeleccion = (idvararticulo) => {
    setSelecionados(prev => {
      if(prev.includes(idvararticulo)){
        return prev.filter(id => id !== idvararticulo);
      }else {
        return [...prev, idvararticulo];
      }
    });
  };

  const limpiarSeleccion = () => setSelecionados([]);

  //FUNCION PARA SELECIONAR TODOS 
  const toggleSelecionarTodo = () => {
    if(seleccionados.length === variantes.length && variantes.length > 0){
      limpiarSeleccion();
    }else {
      const todosLosIds = variantes.map(v => v.idvararticulo)
      setSelecionados(todosLosIds);
    }
  }

  const actualizarFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const respuesta = await getAllVariante(filtros, { signal: controller.signal });
        setVariantes(respuesta.results || []);
        setHaySiguiente(respuesta.next !== null);
        setHayAnterior(respuesta.previous !== null);
      } catch (error) {
        if (error.name !== "AbortError") console.error("Error al buscar variantes:", error);
      }
    }, 500);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [filtros]);

  //BOTONES PARA LAS PAGINA SIGUIENTE
  const paginaSiguiente = () => {
    if(haySiguiente){
      setFiltros((prev) => ({ ...prev, page: prev.page + 1}));
    }
  };

  const paginaAnterior = () => {
    if(hayAnterior){
      setFiltros((prev) => ({ ...prev, page: prev.page - 1}));
    }
  }


  //CONSTANTE PARA ACTUALZAR LA TABLA DE DATOS
  const recargar = async () => {
    const res = await getAllVariante(filtros);
    setVariantes(res.results || []);
  };

  //PARA LIMPIAR LOS DATOS BORRADOS DE LAS TABLAS
  const eliminarDelListado = (idArticulo) =>
    setVariantes((prev) => prev.filter((item) => item.articulo.idarticulo !== idArticulo));

  return { 
    filtros, actualizarFiltro, 
    variantes, recargar, 
    eliminarDelListado, paginaSiguiente, paginaAnterior,
    haySiguiente, hayAnterior, seleccionados, toggleSeleccion, limpiarSeleccion,
    toggleSelecionarTodo
  };
}

//BLOQUE MENSAJES

//HOOK PARA LOS MODALES DE EXITO/ERROR
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

// BLOQUE 3 LOGICA CORE ARTICULOS Y VARIANTES (CRUD)
//HOOK PARA TODO EL FORMULARIO DE ARTICULOS
function useFormularioArticulo({ onGuardadoExitoso, mostrarMensaje }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [dataArticulos, setDataArticulos] = useState(ESTADO_INICIAL_ARTICULO);

  //DEJA EL FORMULARIO COMO RECIEN MONTADO
  const resetear = () => {
    setDataArticulos(ESTADO_INICIAL_ARTICULO);
    setFotos([]);
  };

  //ABRE EL MODAL PARA CREAR UN ARTICULO NUEVO
  const abrirParaCrear = () => {
    resetear();
    setModalAbierto(true);
  };

  //CIERRA EL MODAL Y LIMPIA EL FORMULARIO
  const cerrar = () => {
    setModalAbierto(false);
    resetear();
  };

  //HANDLE FOTOS
  const seleccionarFotos = (e) => {
    const archivos = Array.from(e.target.files);

    if (archivos.length > 4) {
      alert("Solo puedes seleccionar hasta 4 imágenes.");
      return;
    }
    setFotos(archivos);
  };

  //FUNCION PARA ACTUALIZAR FORMULARIO VA EN EL ONCHANGE DEL FORMULARIO
  const actualizarCampo = (e) => {
    let { name, value } = e.target;

    //PARA QUE LE PONGA PUNTUACION A LOS NUMEROS
    if (CAMPOS_NUMERICOS_FORMATEADOS.includes(name)) {
      value = limpiarFormatoNumero(value);
    }

    if (CAMPOS_ARTICULO.includes(name)) {
      const articuloActualizado = { ...dataArticulos.articulo, [name]: value };

      if (name === "nombre") {
        articuloActualizado.slug = generarSlug(value);
      }

      setDataArticulos((prev) => ({ ...prev, articulo: articuloActualizado }));
    } else {
      setDataArticulos((prev) => ({ ...prev, [name]: value }));
    }
  };

  //MARCA/DESMARCA UNA TALLA Y CREA O BORRA SU FILA DE VARIANTE
  const alternarTalla = (e) => {
    const { value, checked } = e.target;

    setDataArticulos((prev) => {
      const nuevasVariantes = { ...prev.variantesPorTalla };

      if (checked) {
        nuevasVariantes[value] = nuevasVariantes[value] ?? {
          color: "", sku: "", stock: "", precio_extra: ""
        };
      } else {
        delete nuevasVariantes[value];
      }

      return { ...prev, variantesPorTalla: nuevasVariantes };
    });
  };

  //ACTUALIZA UN CAMPO DE LA FILA DE UNA TALLA ESPECIFICA
  const actualizarCampoVariante = (idTalla, campo, valor) => {
    setDataArticulos((prev) => ({
      ...prev,
      variantesPorTalla: {
        ...prev.variantesPorTalla,
        [idTalla]: { ...prev.variantesPorTalla[idTalla], [campo]: valor },
      },
    }));
  };

  //FUNCION BOTON EDITAR
  const abrirParaEditar = (variante) => {
    setDataArticulos({
      articulo: normalizarArticuloParaEdicion(variante.articulo),
      variantesPorTalla: {
        [variante.talla.idtalla]: {
          color: variante.color.idcolor,
          sku: variante.sku || "",
          stock: variante.stock || "",
          precio_extra: variante.precio_extra || ""
        }
      },
      idvararticulo: variante.idvararticulo,
    });
    setModalAbierto(true);
  };

  //SAVE ARTICULO AND UPDATE ARTICULO
  const guardar = async (e) => {
    e.preventDefault();

    const varianteArray = Object.entries(dataArticulos.variantesPorTalla).map(
      ([idTalla, datos]) => ({ talla: idTalla, ...datos })
    );

    if (varianteArray.length === 0) {
      alert("Selecciona al menos una talla");
      return;
    }

    setCargando(true);
    try {
      const formData = construirFormDataVariante(dataArticulos, varianteArray, fotos);

      if (dataArticulos.idvararticulo) {
        await updateVariante(dataArticulos.idvararticulo, formData);
        mostrarMensaje("Articulo actualizado con exito", "success");
      } else {
        await saveVariante(formData);
        mostrarMensaje("Articulo creado con exito.", "success");
      }

      await onGuardadoExitoso();
      cerrar();
    } catch (error) {
      console.error("Error al crear articulo:", error);
      mostrarMensaje("Error al crear articulo.", "error");
    } finally {
      setCargando(false);
    }
  };

  return {
    modalAbierto, cargando, fotos, dataArticulos,
    abrirParaCrear, abrirParaEditar, cerrar,
    actualizarCampo, alternarTalla, actualizarCampoVariante,
    seleccionarFotos, guardar,
  };
}

// BLOQUE 4 LOGICA CORE DESCUENTOS
//HOOK PARA EL FORMULARIO DE DESCUENTO POR VARIANTE
function useFormularioDescuento({ onGuardadoExitoso, mostrarMensaje }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [desplegarFormDescuento, setDesplegarFormDescuento] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [descuento, setDescuento] = useState(ESTADO_INICIAL_DESCUENTO);

  const [historial, setHistorial] = useState([]);

  const toggleFormDescuento = () => {
    setDesplegarFormDescuento(!desplegarFormDescuento);
  };

  //DEJA EL FORMULARIO DE DESCUENTO COMO RECIEN MONTADO
  const resetear = () => {
    setDescuento(ESTADO_INICIAL_DESCUENTO);
  };

  //ABRE EL MODAL DE DESCUENTO YA CON LA VARIANTE SELECCIONADA
  const abrirModalDescuento = (variante) => {
    resetear();
    setHistorial(variante.historial_descuentos || []);
    
    // Dejar listo el form para crear uno nuevo
    setDescuento((prev) => ({
      ...prev,
      vararticulo: variante.idvararticulo || "",
    }));
    
    // Si hay historial, mostrar tabla y ocultar formulario. Si no, mostrar form.
    setDesplegarFormDescuento(!(variante.historial_descuentos && variante.historial_descuentos.length > 0));
    setModalAbierto(true);
  };

  const abrirModalDescuentoMasivo = (listaIds) => {
    resetear();
    setHistorial([]);
    setDesplegarFormDescuento(true);

    setDescuento((prev) => ({
      ...prev,
      vararticulos: listaIds
    }));
    setModalAbierto(true);
  }

  const editarDescuentoHistorial = (item) => {
    setDescuento({
      iddescuento: item.iddescuento,
      idartdescuento: item.idartdescuento,
      vararticulo: descuento.vararticulo, // mantenemos el de la variante actual
      cantidad_inicial: item.cantidad_inicial || "",
      cantidad_restante: item.cantidad_restante || "",
      nombre: item.nombre || "",
      tipo: item.tipo || "",
      valor: item.valor || "",
      valido_desde: item.valido_desde ? String(item.valido_desde).split('T')[0] : "",
      valido_hasta: item.valido_hasta ? String(item.valido_hasta).split('T')[0] : "",
      estado: item.estado,
    });
    setDesplegarFormDescuento(true);
  };

  const eliminarDescuentoHistorial = async (item) => {
    if (!window.confirm("¿Seguro que deseas eliminar este descuento?")) return;
    
    setCargando(true);
    try {
      await deleteDescuento(item.idartdescuento); // FIX: usar id de la tabla intermedia
      mostrarMensaje("Descuento eliminado con éxito", "success");
      
      setHistorial(prev => prev.filter(d => d.idartdescuento !== item.idartdescuento));
      await onGuardadoExitoso(); 
    } catch (error) {
      console.error("Error al eliminar descuento:", error);
      mostrarMensaje("Error al eliminar descuento", "error");
    } finally {
      setCargando(false);
    }
  };

  const toggleEstadoDescuento = async (item) => {
    setCargando(true);
    try {
      const payload = {
        vararticulo: item.vararticulo || descuento.vararticulo, // we might need to get it from state or item
        // Wait, to do a proper PUT we need the full payload or PATCH. Assuming PUT needs full payload:
        cantidad_inicial: item.cantidad_inicial || "",
        cantidad_restante: item.cantidad_restante || "",
        descuento: {
          nombre: item.nombre,
          tipo: item.tipo,
          valor: item.valor,
          valido_desde: item.valido_desde,
          valido_hasta: item.valido_hasta,
          estado: !item.estado, // FLIP THE STATUS
        }
      };
      // If item doesn't have vararticulo, we use the one currently active in the form state
      if (!payload.vararticulo) payload.vararticulo = descuento.vararticulo;

      await updateDescuento(item.idartdescuento, payload);
      mostrarMensaje(`Descuento ${!item.estado ? 'activado' : 'inactivado'} con éxito`, "success");
      
      // Update local history array
      setHistorial(prev => prev.map(d => 
        d.idartdescuento === item.idartdescuento ? { ...d, estado: !d.estado } : d
      ));
      await onGuardadoExitoso();
    } catch (error) {
      console.error("Error al cambiar estado del descuento:", error);
      mostrarMensaje("Error al cambiar estado", "error");
    } finally {
      setCargando(false);
    }
  };

  //CIERRA EL MODAL Y LIMPIA EL FORMULARIO
  const cerrarModalDescuento = () => {
    setModalAbierto(false);
    resetear();
  };

  //FUNCION PARA ACTUALIZAR FORMULARIO DE DESCUENTO VA EN EL ONCHANGE
  const actualizarCampo = (e) => {
    const { name, value } = e.target;
    setDescuento((prev) => ({ ...prev, [name]: value }));
  };

  //SAVE DESCUENTO AND UPDATE DESCUENTO
  const guardar = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const payload = {
        cantidad_inicial: descuento.cantidad_inicial,
        cantidad_restante: descuento.idartdescuento ? descuento.cantidad_restante : descuento.cantidad_inicial,
        descuento: {
          nombre: descuento.nombre,
          tipo: descuento.tipo,
          valor: descuento.valor,
          valido_desde: descuento.valido_desde,
          valido_hasta: descuento.valido_hasta,
          estado: descuento.estado !== undefined ? descuento.estado : true, // USE STATE
        }
      };

      if (descuento.vararticulos && descuento.vararticulos.length > 0) {
        payload.vararticulos = descuento.vararticulos;
      } else {
        payload.vararticulo = descuento.vararticulo;
      }

      // FIX: usar idartdescuento
      if (descuento.idartdescuento) {
        await updateDescuento(descuento.idartdescuento, payload);
        mostrarMensaje("Descuento actualizado con éxito", "success");
      } else {
        await saveDescuentos(payload);
        mostrarMensaje("Descuento guardado con éxito", "success");
      }

      await onGuardadoExitoso();
      cerrarModalDescuento();
    } catch (error) {
      console.error("Error al guardar descuento:", error);
      mostrarMensaje("Error al guardar descuento", "error");
    } finally {
      setCargando(false);
    }
  };

  return {
    modalAbierto, cargando, descuento,
    desplegarFormDescuento, toggleFormDescuento,
    historial, editarDescuentoHistorial, eliminarDescuentoHistorial, toggleEstadoDescuento,
    abrirModalDescuento, cerrarModalDescuento,
    actualizarCampo, guardar, abrirModalDescuentoMasivo
  };
}

// BLOQUE 5 COMPONENTE PRINCIPAL
function Articulos() {
  const catalogos = useCatalogos();
  const { 
          filtros, 
          actualizarFiltro, 
          variantes, 
          recargar, 
          eliminarDelListado,
          paginaSiguiente, 
          haySiguiente, 
          paginaAnterior, 
          hayAnterior,
          seleccionados,
          toggleSeleccion,
          toggleSelecionarTodo
  } = useVariantesFiltradas();

  const notificacion = useMensajeTemporal();

  const form = useFormularioArticulo({
    onGuardadoExitoso: recargar,
    mostrarMensaje: notificacion.mostrar,
  });

  const formDescuento = useFormularioDescuento({
    onGuardadoExitoso: recargar,
    mostrarMensaje: notificacion.mostrar,
  });

  const tallasPorPrenda = useTallasPorPrenda(form.dataArticulos?.articulo?.prendas);

  //MODAL CONFIRMAR ELIMINAR
  const [itemEliminar, setItemEliminar] = useState(null);
  const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);

  //PREPARAR ELIMINACION
  const prepararEliminar = (variante) => {
    setItemEliminar(variante);
    setModalConfirmarAbierto(true);
  };

  //DELETE ARTICULO
  const confirmarEliminacion = async () => {
    try {
      await deleteArticulo(itemEliminar.articulo.idarticulo);
      eliminarDelListado(itemEliminar.articulo.idarticulo);
      notificacion.mostrar("Articulo eliminado con exito.", "success");
    } catch (error) {
      console.error("Error al eliminar el articulo:", error);
      notificacion.mostrar("Error al eliminar el articulo", "error");
    } finally {
      setModalConfirmarAbierto(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        <h2 className="text-center font-bold text-2xl tracking-tight text-slate-800 mt-6">
          Artículos
        </h2>

        <div className="flex items-center justify-center sm:justify-end mt-5 px-4 sm:px-6">
          <button
            type="button"
            onClick={form.abrirParaCrear}
            className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <span className="text-sm font-semibold tracking-wide">Nuevo artículo</span>
          </button>
        </div>

        {formDescuento.modalAbierto && (
          <ModalDescuento
            descuento={formDescuento.descuento}
            onChange={formDescuento.actualizarCampo}
            onGuardar={formDescuento.guardar}
            onCerrar={formDescuento.cerrarModalDescuento}
            cargando={formDescuento.cargando}
            desplegarForm={formDescuento.desplegarFormDescuento}
            onToggleForm={formDescuento.toggleFormDescuento}
            historial={formDescuento.historial}
            onEditarDescuento={formDescuento.editarDescuentoHistorial}
            onEliminarDescuento={formDescuento.eliminarDescuentoHistorial}
            onToggleEstado={formDescuento.toggleEstadoDescuento}
          />
        )}

        {form.modalAbierto && (
          <div className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-3 sm:p-0">
            <div className="bg-white border border-slate-200/80 shadow-sm rounded-xl w-full max-w-4xl h-auto max-h-[90vh] flex flex-col overflow-hidden">
              <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <EditIcon className="w-4 h-4 text-blue-500" />
                    {form.dataArticulos.idvararticulo ? "Editar Artículo" : "Nuevo Artículo"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={form.cerrar}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </header>

              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 text-slate-800 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <CampoSelect
                      label="Categoria"
                      icon={FolderIcon}
                      name="categoria"
                      value={form.dataArticulos.articulo.categoria}
                      onChange={form.actualizarCampo}
                      opciones={catalogos.categoria}
                      getId={(c) => c.idcategoria}
                      getLabel={(c) => c.padre ? `${c.padre.nombre} > ${c.nombre}` : c.nombre}
                    />

                    <CampoSelect
                      label="Marca"
                      icon={BookmarkIcon}
                      name="marca"
                      value={form.dataArticulos.articulo.marca}
                      onChange={form.actualizarCampo}
                      opciones={catalogos.marca}
                      getId={(m) => m.idmarca}
                      getLabel={(m) => m.nombre}
                    />

                    <CampoTexto
                      label="Nombre"
                      icon={TagIcon}
                      name="nombre"
                      value={form.dataArticulos.articulo.nombre}
                      onChange={form.actualizarCampo}
                    />

                    <CampoTexto
                      label="Descripción"
                      icon={AlignLeftIcon}
                      name="descripcion"
                      value={form.dataArticulos.articulo.descripcion}
                      onChange={form.actualizarCampo}
                    />

                    <CampoTexto
                      label="Precio base"
                      icon={DollarIcon}
                      name="precio_base"
                      value={formatoMiles(form.dataArticulos.articulo.precio_base)}
                      onChange={form.actualizarCampo}
                    />

                    <CampoSelect
                      label="Prenda"
                      icon={BookmarkIcon}
                      name="prendas"
                      value={form.dataArticulos.articulo.prendas}
                      onChange={form.actualizarCampo}
                      opciones={catalogos.prenda}
                      getId={(p) => p.idprenda}
                      getLabel={(p) => p.nombre}
                    />

                    <SelectorTallas
                      tallas={tallasPorPrenda}
                      seleccionadas={Object.keys(form.dataArticulos.variantesPorTalla)}
                      prendaSeleccionada={form.dataArticulos.articulo.prendas}
                      onToggle={form.alternarTalla}
                    />

                    {tallasPorPrenda
                      .filter((t) => form.dataArticulos.variantesPorTalla[t.idtalla])
                      .map((t) => (
                        <FilaVarianteTalla
                          key={t.idtalla}
                          talla={t}
                          datos={form.dataArticulos.variantesPorTalla[t.idtalla]}
                          colores={catalogos.color}
                          onChange={(campo, valor) => form.actualizarCampoVariante(t.idtalla, campo, valor)}
                        />
                      ))
                    }

                    <CampoSelect
                      label="Impuestos"
                      icon={ScaleIcon}
                      name="impuestos"
                      value={form.dataArticulos.articulo.impuestos}
                      onChange={form.actualizarCampo}
                      opciones={catalogos.impuesto}
                      getId={(i) => i.idimpuesto}
                      getLabel={(i) => `${i.nombre} - ${i.porcentaje}`}
                    />

                    <div className="relative mt-2">
                      <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Fotos
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={form.seleccionarFotos}
                        className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <footer className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={form.guardar}
                    disabled={form.cargando}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition-all cursor-pointer"
                  >
                    <SaveIcon className="w-4 h-4" /> <span>{form.cargando ? "Guardando..." : "Guardar"}</span>
                  </button>
                </footer>
              </div>
            </div>
          </div>
        )}

        {/* BARRA DE FILTROS */}
        <FiltrosBar 
          filtros={filtros} 
          onChange={actualizarFiltro} 
          catalogos={catalogos} 
        />

        {seleccionados.length > 0 &&(
          <div className="px-6 pb-2">
            <button
              onClick={() => formDescuento.abrirModalDescuentoMasivo(seleccionados)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
            >
              Aplicar descuento a {seleccionados.length} variantes
            </button>
          </div>
        )}

        <TablaVariantes
          variantes={variantes}
          onEditar={form.abrirParaEditar}
          onEliminar={prepararEliminar}
          onAgregarDescuento={formDescuento.abrirModalDescuento}
          seleccionados={seleccionados}
          onToggleSeleccionado={toggleSeleccion}
          onToggleSelecionarTodo={toggleSelecionarTodo}
        />

        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200 rounded-b-xl shadow-sm">
          <button
            onClick={paginaAnterior}
            disabled={!hayAnterior}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          <span className="text-sm font-medium text-slate-600">
            Pagina {filtros.page}
          </span>
          <button
            onClick={paginaSiguiente}
            disabled={!haySiguiente}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      </main>

      {modalConfirmarAbierto && (
        <ModalConfirmar
          datosAMostrar={itemEliminar ? itemEliminar.articulo.nombre : ""}
          onCancelar={() => setModalConfirmarAbierto(false)}
          onConfirmar={confirmarEliminacion}
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
  );
}

// BLOQUE 6 COMPONENTES DE UI MODALES Y FORMULARIOS
//MODAL PARA APLICAR DESCUENTO A UNA VARIANTE
function ModalDescuento({ descuento, onChange, onGuardar, onCerrar, cargando, desplegarForm, onToggleForm, historial, onEditarDescuento, onEliminarDescuento, onToggleEstado }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-3">
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-emerald-600" />
            Gestión de Descuentos
          </h3>
          <button type="button" onClick={onCerrar} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            ✕
          </button>
        </header>

        <div className="overflow-y-auto flex-1 p-6 pb-2">
          {historial && historial.length > 0 ? (
            <div className="bg-emerald-50 rounded-lg border border-emerald-100 overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-emerald-100 bg-emerald-100/50">
                <h4 className="text-emerald-800 font-bold">Historial de Descuentos</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-emerald-800 uppercase bg-emerald-100/30">
                    <tr>
                      <th className="px-4 py-2">Nombre</th>
                      <th className="px-4 py-2">Valor</th>
                      <th className="px-4 py-2">Vigencia</th>
                      <th className="px-4 py-2">Estado</th>
                      <th className="px-4 py-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item) => (
                      <tr key={item.iddescuento} className="border-b border-emerald-50/50 hover:bg-emerald-100/30">
                        <td className="px-4 py-2 font-medium text-emerald-900">{item.nombre}</td>
                        <td className="px-4 py-2 text-emerald-700">
                          {item.valor} {item.tipo === 'porcentaje' ? '%' : '$'}
                        </td>
                        <td className="px-4 py-2 text-emerald-700 text-xs">
                          {item.valido_desde} a {item.valido_hasta}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => onToggleEstado(item)}
                            title={item.estado ? "Inactivar descuento" : "Activar descuento"}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              item.estado 
                                ? 'bg-emerald-200 text-emerald-800 hover:bg-emerald-300' 
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {item.estado ? 'ACTIVO' : 'INACTIVO'}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onEditarDescuento(item)}
                              className="text-blue-500 hover:text-blue-700 p-1 bg-white rounded shadow-sm border border-slate-200 cursor-pointer"
                              title="Editar"
                            >
                              <EditIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEliminarDescuento(item)}
                              className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm border border-slate-200 cursor-pointer"
                              title="Eliminar"
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
          ) : (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 text-center">
              <p className="text-sm text-slate-500">No hay historial de descuentos para esta variante.</p>
            </div>
          )}

          <div className="text-right">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 underline cursor-pointer"
            >
              {desplegarForm ? "Ocultar formulario" : "+ Agregar nuevo descuento"}
            </button>
          </div>
        </div>
        
        {desplegarForm && (
          <form onSubmit={onGuardar} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <CampoTexto 
                label="Nombre Descuento"
                icon={TagIcon}
                name="nombre"
                value={descuento.nombre}
                onChange={onChange}
                type="text"
              />
              <CampoTexto 
                label="Tipo (ej. porcentaje)"
                icon={AlignLeftIcon}
                name="tipo"
                value={descuento.tipo}
                onChange={onChange}
                type="text"
              />
              <CampoTexto 
                label="Porcentaje o Valor"
                icon={DollarIcon}
                name="valor"
                value={descuento.valor}
                onChange={onChange}
                type="number"
              />
              <CampoTexto
                label="Válido Desde" 
                icon={HashIcon} 
                name="valido_desde"    
                value={descuento.valido_desde} 
                onChange={onChange} 
                type="date"
              />
              <CampoTexto
                label="Válido Hasta" 
                icon={HashIcon} 
                name="valido_hasta"    
                value={descuento.valido_hasta} 
                onChange={onChange} 
                type="date"
              />
              <CampoTexto
                label="Cantidad de artículos" 
                icon={BoxIcon} 
                name="cantidad_inicial"
                value={descuento.cantidad_inicial} 
                onChange={onChange} 
                type="number"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button" 
                onClick={onCerrar}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                Cancelar
              </button>
              <button
                type="submit" 
                disabled={cargando}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50"
                >
                {cargando ? "Guardando..." : "Guardar Descuento"}
              </button>
            </div>
        </form>
      )}
      </div>
    </div>
  );
}

//FILA DE INPUTS PARA UNA TALLA MARCADA (sku, color, stock, precio extra)
function FilaVarianteTalla({ talla, datos, colores, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3 border border-slate-200 rounded-lg bg-slate-50/40 items-center">
      <span className="text-sm font-semibold text-slate-600 self-center">
        Talla {talla.codigo}
      </span>

      <select
        value={datos.color}
        onChange={(e) => onChange("color", e.target.value)}
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
      >
        <option value="">Color...</option>
        {colores.map((c) => <option key={c.idcolor} value={c.idcolor}>{c.nombre}</option>)}
      </select>

      <input
        type="text" placeholder="SKU"
        value={datos.sku}
        onChange={(e) => onChange("sku", e.target.value)}
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
      />

      <input
        type="number" placeholder="Stock"
        value={datos.stock}
        onChange={(e) => onChange("stock", e.target.value)}
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
      />

      <input
        type="number" placeholder="Precio Extra"
        value={datos.precio_extra}
        onChange={(e) => onChange("precio_extra", e.target.value)}
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
      />
    </div>
  );
}

//INPUT DE TEXTO REUSABLE PARA EL FORMULARIO
function CampoTexto({ label, icon: Icon, name, value, onChange, type = "text" }) {
  return (
    <div className="relative mt-2">
      <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
      />
    </div>
  );
}

//SELECT REUSABLE PARA EL FORMULARIO
function CampoSelect({ label, icon: Icon, name, value, onChange, opciones, getId, getLabel }) {
  return (
    <div className="relative mt-2">
      <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
      >
        <option value="">Selecciona {label.toLowerCase()}...</option>
        {opciones.map((o) => (
          <option key={getId(o)} value={getId(o)}>{getLabel(o)}</option>
        ))}
      </select>
    </div>
  );
}

//CHECKBOX MULTIPLE DE TALLAS
function SelectorTallas({ tallas, seleccionadas, prendaSeleccionada, onToggle }) {
  return (
    <div className="relative mt-2">
      <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-xs font-semibold text-slate-500 z-10 flex items-center gap-1">
        <RulerIcon className="w-3.5 h-3.5" /> Tallas
      </label>
      <div className="w-full bg-slate-50/30 rounded-lg border border-slate-200 px-3 py-2 flex flex-wrap gap-2 min-h-[42px] items-center">
        {tallas.length > 0 ? (
          tallas.map((t) => (
            <label
              key={t.idtalla}
              className="flex items-center gap-2 text-sm text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-100"
            >
              <input
                type="checkbox"
                value={t.idtalla}
                checked={seleccionadas.includes(t.idtalla)}
                onChange={onToggle}
                disabled={!prendaSeleccionada}
                className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium">{t.codigo}</span>
            </label>
          ))
        ) : (
          <p className="text-xs text-slate-400">
            {prendaSeleccionada
              ? "No hay tallas registradas para esta prenda."
              : "Selecciona primero una prenda para ver sus tallas."}
          </p>
        )}
      </div>
    </div>
  );
}

// BLOQUE 7 COMPONENTES DE UI TABLAS
function FiltrosBar({ filtros, onChange, catalogos }) {
  const [mostrarAvanzados, setMostrarAvanzados] = useState(false);

  return (
    <div className="px-4 sm:px-6 pb-2 mt-10">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-2 transition-all">
        
        {/* ENCABEZADO Y FILTRO PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 ml-1">Buscar Artículo</label>
            <input
              type="text"
              name="buscar"
              value={filtros.buscar}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-colors"
              placeholder="Buscar por Nombre, SKU, marca..."
            />
          </div>
          <button
            onClick={() => setMostrarAvanzados(!mostrarAvanzados)}
            className="flex-shrink-0 px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {mostrarAvanzados ? "Ocultar Avanzados ▲" : "Filtros Avanzados ▼"}
          </button>
        </div>

        {/* FILTROS AVANZADOS (OCULTOS POR DEFECTO) */}
        {mostrarAvanzados && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5 pt-5 border-t border-slate-100">
            <SelectFiltro
              label="Marca" 
              name="marca" 
              value={filtros.marca} 
              onChange={onChange}
              opciones={catalogos.marca} 
              getId={(m) => m.idmarca} 
              getLabel={(m) => m.nombre}
              placeholderTodos="Todas las marcas"
            />

            <SelectFiltro
              label="Prendas" 
              name="prendas" 
              value={filtros.prendas} 
              onChange={onChange}
              opciones={catalogos.prenda} 
              getId={(p) => p.idprenda} 
              getLabel={(p) => p.nombre}
              placeholderTodos="Todas las prendas"
            />

            <SelectFiltro
              label="Categoría" 
              name="categoria" 
              value={filtros.categoria} 
              onChange={onChange}
              opciones={catalogos.categoria} 
              getId={(c) => c.idcategoria} 
              getLabel={(c) => c.nombre}
              placeholderTodos="Todas las cat."
            />

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Color / Talla</label>
              <div className="flex gap-2">
                <select
                  name="color" 
                  value={filtros.color} 
                  onChange={onChange}
                  className="w-1/2 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500"
                >
                  <option value="">Color</option>
                  {catalogos.color.map((c) => <option key={c.idcolor} value={c.idcolor}>{c.nombre}</option>)}
                </select>

                <select
                  name="talla" 
                  value={filtros.talla} 
                  onChange={onChange}
                  className="w-1/2 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500"
                >
                  <option value="">Talla</option>
                  {catalogos.talla.map((t) => <option key={t.idtalla} value={t.idtalla}>{t.codigo}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Estado</label>
              <select
                name="estado" 
                value={filtros.estado} 
                onChange={onChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500"
              >
                <option value="">Cualquiera</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

//SELECT REUSABLE PARA LA BARRA DE FILTROS
function SelectFiltro({ label, name, value, onChange, opciones, getId, getLabel, placeholderTodos }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">{label}</label>
      <select
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500"
      >
        <option value="">{placeholderTodos}</option>
        {opciones.map((o) => <option key={getId(o)} value={getId(o)}>{getLabel(o)}</option>)}
      </select>
    </div>
  );
}

//TABLA DE VARIANTES REGISTRADAS
function TablaVariantes({ variantes, onEditar, onEliminar, onAgregarDescuento, seleccionados, onToggleSeleccionado, onToggleSelecionarTodo }) {
  const todosSeleccionados = variantes.length > 0 && seleccionados.length === variantes.length;

  return (
    <div className="w-full overflow-x-auto px-4 sm:px-6 pb-6">
      <table className="w-full min-w-[800px] text-sm border-separate border-spacing-0 rounded-xl overflow-hidden shadow-sm border border-gray-200/90 mt-5">
        <thead>
          <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <th className="px-4 py-3.5 w-10 text-center border-b-2 border-slate-200">
              <input 
                type="checkbox" 
                checked={todosSeleccionados}
                onChange={onToggleSelecionarTodo}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 cursor-pointer"
                title="Seleccionar todos"
              />
            </th>
            <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Nombre / Variante</th>
            <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Clasificación</th>
            <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Descripción</th>
            <th className="px-5 py-3.5 text-left font-semibold border-b-2 border-slate-200">Inventario</th>
            <th className="px-5 py-3.5 text-right font-semibold border-b-2 border-slate-200">Precios</th>
            <th className="px-5 py-3.5 text-center font-semibold border-b-2 border-slate-200">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {variantes.map((data, index) => (
            <FilaVariante
              key={data.idvararticulo}
              data={data}
              index={index}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onAgregarDescuento={onAgregarDescuento}
              seleccionados={seleccionados.includes(data.idvararticulo)}
              onToggleSeleccionado={() => onToggleSeleccionado(data.idvararticulo)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

//FILA INDIVIDUAL DE LA TABLA DE VARIANTES
function FilaVariante({ data, index, onEditar, onEliminar, onAgregarDescuento, seleccionados, onToggleSeleccionado }) {
  return (
    <tr className={`transition-colors hover:bg-slate-50/80 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
      <td className="px-4 py-2 text-center aling-middle">
        <input 
          type="checkbox" 
          checked={seleccionados}
          onChange={onToggleSeleccionado}
          className="w-4 h-4 text-emerald-600 rounded border-slate-300 cursor-pointer"
        />
      </td>
      <td className="px-4 py-2 align-top">
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

      <td className="px-4 py-2 align-top">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-emerald-50 text-emerald-700 font-medium border border-emerald-100 mb-1">
          <FolderIcon className="w-3 h-3 text-emerald-600" /> {data.articulo.categoria.nombre}
        </span>
        <p className="text-slate-400 text-xs mt-1">
          <span className="font-medium text-slate-500">Impuesto:</span> {data.articulo.impuestos.nombre} ({data.articulo.impuestos.porcentaje}%)
        </p>
      </td>

      <td className="px-4 py-2 align-top max-w-[180px]">
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
          {data.articulo.descripcion || <span className="italic text-slate-300">Sin descripción</span>}
        </p>
      </td>

      <td className="px-4 py-2 align-top">
        <p className="text-slate-500 text-xs">
          <span className="font-medium text-slate-600">SKU:</span>{" "}
          <span className="font-mono text-slate-700">{data.sku}</span>
        </p>
        <p className="mt-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${data.stock > 10 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : data.stock > 0 ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            <BoxIcon className="w-3 h-3" /> {data.stock} disp.
          </span>
        </p>
      </td>

      <td className="px-4 py-2 align-top text-right">
        {data.precio_con_descuento_activo && Number(data.precio_con_descuento_activo) < Number(data.precio_final) ? (
          <>
            <p className="font-bold text-emerald-600 text-sm">${Number(data.precio_con_descuento_activo).toLocaleString()}</p>
            <p className="text-slate-400 text-xs line-through mt-0.5">${Number(data.precio_final).toLocaleString()}</p>
          </>
        ) : (
          <p className="font-semibold text-slate-900 text-sm">${Number(data.precio_final).toLocaleString()}</p>
        )}
        <p className="text-slate-400 text-[10px] mt-1">Base: ${Number(data.articulo.precio_base).toLocaleString()}</p>
        {Number(data.precio_extra) > 0 && (
           <p className="text-slate-400 text-[10px]">+ Extra: ${Number(data.precio_extra).toLocaleString()}</p>
        )}
      </td>

      <td className="px-4 py-2 align-top">
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onAgregarDescuento(data)}
            title="Agregar descuento"
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
          >
            <TagIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEditar(data)}
            title="Editar"
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all cursor-pointer"
          >
            <EditIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEliminar(data)}
            title="Eliminar"
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all cursor-pointer"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default Articulos;