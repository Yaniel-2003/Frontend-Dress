import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ModalMensaje from "../../components/ModalMensajes";
import ModalConfirmar from "../../components/ConfirmarEliminar";
import {
  TagIcon, AlignLeftIcon, DollarIcon, BookmarkIcon, FolderIcon, ScaleIcon,
  BarcodeIcon, BoxIcon, RulerIcon, PaletteIcon, ImageIcon, EditIcon, TrashIcon, SaveIcon, HashIcon, SearchIcon, SlidersIcon, CheckIcon
} from "../../components/Icons";
import { InputIcono, SelectIcono as SelectNativo } from "../../components/CamposConIcono";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  saveVariante, updateVariante, deleteArticulo, getAllVariante,
  deleteDescuento, updateDescuento, saveDescuentos, getFotosVAriantes
} from "../../services/articulo.service";
import { getMarca, getCategoria, getImpuesto, getTalla, getColor, getPrendas } from "../../services/catalogo.service";

// BLOQUE 1 CONFIGURACION Y UTILIDADES
//ESTADO INICIAL DEL FORMULARIO DE ARTICULO
// Foto de cabecera (public/imgDress), copia optimizada de 2400px; el original está al lado.
const FOTO_ARTICULOS = "/imgDress/imgcloset-2400.jpg";

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
    if (!prendaId) return;
    let cancelado = false;

    getTalla({ prenda: prendaId }).then((data) => {
      if (!cancelado) setTallasDisponibles(data);
    });

    return () => { cancelado = true; };
  }, [prendaId]);

  // sin prenda seleccionada no hay tallas que mostrar
  return prendaId ? tallasDisponibles : [];
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
  const [fotosExistentes, setFotosExistentes] = useState([]);

  //DEJA EL FORMULARIO COMO RECIEN MONTADO
  const resetear = () => {
    setDataArticulos(ESTADO_INICIAL_ARTICULO);
    setFotos([]);
    setFotosExistentes([]);
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

        
  useEffect(() => {
    const cargarFotos = async () => {
      if(!dataArticulos.idvararticulo) return;
      try{
        const dataFotos = await getFotosVAriantes(dataArticulos.idvararticulo);
        setFotosExistentes(dataFotos);
      }catch(error){
        console.log("Error al cargar fotos ", error);
      }
    }
    cargarFotos();
  },[dataArticulos.idvararticulo]);
  
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
    seleccionarFotos, guardar, fotosExistentes, setFotosExistentes
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
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* ───── Cabecera con la foto del clóset de la tienda ───── */}
        <header className="relative isolate overflow-hidden rounded-3xl bg-white px-6 py-8 text-zinc-950 ring-1 ring-zinc-200 sm:px-10 sm:py-12">
          <img
            src={FOTO_ARTICULOS}
            alt=""
            width={2400}
            height={1600}
            className="absolute inset-0 -z-20 size-full object-cover object-[50%_40%]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-white from-0% via-white/85 via-45% to-white/30 sm:via-white/65 sm:via-35% sm:to-transparent sm:to-70%" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-4xl leading-tight font-normal sm:text-5xl">Artículos</h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-700 sm:text-base">
                Crea, edita y administra el inventario y los descuentos de tu tienda.
              </p>
            </div>
            <Button
              type="button"
              size="lg"
              onClick={form.abrirParaCrear}
              className="h-12 self-start bg-linear-to-r from-esmeralda to-azul px-6 font-semibold text-tinta shadow-lg shadow-emerald-900/15 hover:brightness-110 focus-visible:ring-esmeralda/50 sm:self-auto"
            >
              <Plus className="size-4" aria-hidden="true" /> Nuevo artículo
            </Button>
          </div>
        </header>

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
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/40 p-3 backdrop-blur-sm sm:p-6">
            <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
              <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-sky-100 text-emerald-700">
                    <EditIcon className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold leading-tight tracking-tight">
                      {form.dataArticulos.idvararticulo ? "Editar artículo" : "Nuevo artículo"}
                    </h3>
                    <p className="text-sm text-muted-foreground">Completa los datos y revisa la vista previa.</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={form.cerrar}
                  aria-label="Cerrar"
                  className="text-muted-foreground"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </header>

              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[1fr_21rem] lg:overflow-hidden">
                  {/* ───── Formulario (2 columnas) ───── */}
                  <div className="space-y-8 p-6 lg:overflow-y-auto">
                    <SeccionFormulario titulo="Información general">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <CampoTexto
                          label="Nombre"
                          icon={TagIcon}
                          name="nombre"
                          value={form.dataArticulos.articulo.nombre}
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

                        <div className="sm:col-span-2">
                          <CampoTexto
                            label="Descripción"
                            icon={AlignLeftIcon}
                            name="descripcion"
                            value={form.dataArticulos.articulo.descripcion}
                            onChange={form.actualizarCampo}
                            multilinea
                          />
                        </div>
                      </div>
                    </SeccionFormulario>

                    <SeccionFormulario titulo="Tallas y variantes">
                      <div className="grid grid-cols-1 gap-4">
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
                      </div>
                    </SeccionFormulario>

                    <SeccionFormulario titulo="Fotos">
                      <div className="grid gap-2">
                        <Label className="gap-1.5">
                          <ImageIcon className="size-3.5 text-muted-foreground" /> Imágenes del artículo
                        </Label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={form.seleccionarFotos}
                          className="w-full cursor-pointer rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 px-3.5 py-3 text-sm outline-none transition-colors file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-zinc-950 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:border-zinc-400 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                        {form.fotosExistentes.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-3">
                            {form.fotosExistentes.map((f, indice)=> (
                              <img
                                key={f.idfoto}
                                src={f.urlfoto}
                                alt={`Foto existente ${indice + 1}`}
                                className="size-20 rounded-xl border border-zinc-200 bg-zinc-100 object-cover shadow-sm"
                              />
                            ))}
                          </div>
                        )}
                        {form.fotos.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-3">
                            {form.fotos.map((file, indice) => (
                              <img
                                key={indice}
                                src={URL.createObjectURL(file)}
                                alt={`Foto seleccionada ${indice + 1}`}
                                className="size-20 rounded-xl border border-emerald-300 bg-zinc-100 object-cover shadow-sm"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </SeccionFormulario>
                  </div>

                  {/* ───── Vista previa ───── */}
                  <aside className="border-t border-zinc-100 bg-zinc-50/70 p-6 lg:overflow-y-auto lg:border-t-0 lg:border-l">
                    <p className="mb-3 text-sm font-semibold">Vista previa</p>
                    <VistaPreviaArticulo
                      foto={
                        form.fotos.length > 0
                          ? URL.createObjectURL(form.fotos[0])
                          : form.fotosExistentes[0]?.urlfoto
                      }
                      nombre={form.dataArticulos.articulo.nombre}
                      descripcion={form.dataArticulos.articulo.descripcion}
                      precio={formatoMiles(form.dataArticulos.articulo.precio_base)}
                      marca={catalogos.marca.find((m) => String(m.idmarca) === String(form.dataArticulos.articulo.marca))?.nombre}
                      prenda={catalogos.prenda.find((p) => String(p.idprenda) === String(form.dataArticulos.articulo.prendas))?.nombre}
                      tallas={tallasPorPrenda
                        .filter((t) => form.dataArticulos.variantesPorTalla[t.idtalla])
                        .map((t) => t.codigo)}
                    />
                  </aside>
                </div>

                <footer className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={form.cerrar}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={form.guardar}
                    disabled={form.cargando}
                    className="hover:bg-emerald-700"
                  >
                    <SaveIcon className="size-4" /> <span>{form.cargando ? "Guardando…" : "Guardar"}</span>
                  </Button>
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
          <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 to-sky-50 px-4 py-3 sm:flex-row sm:items-center">
            <p className="text-sm font-medium text-emerald-900">
              {seleccionados.length} {seleccionados.length === 1 ? "variante seleccionada" : "variantes seleccionadas"}
            </p>
            <Button
              size="sm"
              onClick={() => formDescuento.abrirModalDescuentoMasivo(seleccionados)}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Aplicar descuento a {seleccionados.length} variantes
            </Button>
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <TablaVariantes
            variantes={variantes}
            onEditar={form.abrirParaEditar}
            onEliminar={prepararEliminar}
            onAgregarDescuento={formDescuento.abrirModalDescuento}
            seleccionados={seleccionados}
            onToggleSeleccionado={toggleSeleccion}
            onToggleSelecionarTodo={toggleSelecionarTodo}
          />

          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/60 px-5 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={paginaAnterior}
              disabled={!hayAnterior}
              className="bg-white"
            >
              Anterior
            </Button>

            <span className="text-sm font-medium text-muted-foreground">
              Página {filtros.page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={paginaSiguiente}
              disabled={!haySiguiente}
              className="bg-white"
            >
              Siguiente
            </Button>
          </div>
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

//BLOQUE VISUAL PARA AGRUPAR CAMPOS DEL FORMULARIO
function SeccionFormulario({ titulo, children }) {
  return (
    <section>
      <h4 className="mb-4 border-b border-zinc-100 pb-2 text-sm font-semibold">{titulo}</h4>
      {children}
    </section>
  );
}

//TARJETA DE VISTA PREVIA (solo lee valores, no modifica nada)
function VistaPreviaArticulo({ foto, nombre, descripcion, precio, marca, prenda, tallas }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm lg:sticky lg:top-0">
      <div className="flex aspect-[4/5] items-center justify-center bg-zinc-100">
        {foto ? (
          <img src={foto} alt="Vista previa" className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <ImageIcon className="size-8" />
            <span className="text-xs">Sin foto todavía</span>
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        {(marca || prenda) && (
          <p className="text-xs font-medium text-muted-foreground">
            {[marca, prenda].filter(Boolean).join(" · ")}
          </p>
        )}
        <h5 className="truncate text-sm font-semibold uppercase tracking-wide">
          {nombre || "Nombre del artículo"}
        </h5>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {descripcion || "La descripción aparecerá aquí."}
        </p>
        <p className="text-lg font-bold tracking-tight">
          $ {precio || "0"}
        </p>
        {tallas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tallas.map((codigo) => (
              <span key={codigo} className="rounded-md border border-zinc-300 px-2 py-0.5 text-xs font-medium">
                {codigo}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//MODAL PARA APLICAR DESCUENTO A UNA VARIANTE
function ModalDescuento({ descuento, onChange, onGuardar, onCerrar, cargando, desplegarForm, onToggleForm, historial, onEditarDescuento, onEliminarDescuento, onToggleEstado }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-3 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h3 className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-sky-100 text-emerald-700">
              <TagIcon className="size-4" />
            </span>
            Gestión de descuentos
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="text-muted-foreground"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-2">
          {historial && historial.length > 0 ? (
            <div className="mb-4 overflow-hidden rounded-xl border border-zinc-200">
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <h4 className="text-sm font-semibold">Historial de descuentos</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 font-medium">Nombre</th>
                      <th className="px-4 py-2 font-medium">Valor</th>
                      <th className="px-4 py-2 font-medium">Vigencia</th>
                      <th className="px-4 py-2 font-medium">Estado</th>
                      <th className="px-4 py-2 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item) => (
                      <tr key={item.iddescuento} className="border-t border-zinc-100 hover:bg-zinc-50">
                        <td className="px-4 py-2.5 font-medium">{item.nombre}</td>
                        <td className="px-4 py-2.5 text-zinc-700">
                          {item.valor} {item.tipo === 'porcentaje' ? '%' : '$'}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {item.valido_desde} a {item.valido_hasta}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            type="button"
                            onClick={() => onToggleEstado(item)}
                            title={item.estado ? "Inactivar descuento" : "Activar descuento"}
                            className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                              item.estado
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                            }`}
                          >
                            {item.estado ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onEditarDescuento(item)}
                              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              title="Editar"
                            >
                              <EditIcon className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEliminarDescuento(item)}
                              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              title="Eliminar"
                            >
                              <TrashIcon className="size-3.5" />
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
            <div className="mb-4 rounded-xl border border-dashed border-zinc-300 p-6 text-center">
              <p className="text-sm text-muted-foreground">No hay historial de descuentos para esta variante.</p>
            </div>
          )}

          <div className="text-right">
            <button
              type="button"
              onClick={onToggleForm}
              className="cursor-pointer text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              {desplegarForm ? "Ocultar formulario" : "+ Agregar nuevo descuento"}
            </button>
          </div>
        </div>

        {desplegarForm && (
          <form onSubmit={onGuardar} className="space-y-4 border-t border-zinc-100 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CampoTexto
                label="Nombre del descuento"
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
                label="Porcentaje o valor"
                icon={DollarIcon}
                name="valor"
                value={descuento.valor}
                onChange={onChange}
                type="number"
              />
              <CampoTexto
                label="Válido desde"
                icon={HashIcon}
                name="valido_desde"
                value={descuento.valido_desde}
                onChange={onChange}
                type="date"
              />
              <CampoTexto
                label="Válido hasta"
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

            <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCerrar}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={cargando}
                className="hover:bg-emerald-700"
              >
                {cargando ? "Guardando…" : "Guardar descuento"}
              </Button>
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
    <div className="grid grid-cols-1 items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 sm:grid-cols-[4rem_1fr_1fr_7rem_8rem]">
      <span className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-zinc-950 px-3 text-sm font-semibold text-white">
        {talla.codigo}
      </span>

      <SelectNativo
        icon={PaletteIcon}
        value={datos.color}
        onChange={(e) => onChange("color", e.target.value)}
        className="h-9 rounded-lg"
      >
        <option value="">Color…</option>
        {colores.map((c) => <option key={c.idcolor} value={c.idcolor}>{c.nombre}</option>)}
      </SelectNativo>

      <InputIcono
        icon={BarcodeIcon}
        type="text" placeholder="SKU"
        value={datos.sku}
        onChange={(e) => onChange("sku", e.target.value)}
        className="h-9 rounded-lg"
      />

      <InputIcono
        icon={BoxIcon}
        type="number" placeholder="Stock"
        value={datos.stock}
        onChange={(e) => onChange("stock", e.target.value)}
        className="h-9 rounded-lg"
      />

      <InputIcono
        icon={DollarIcon}
        type="number" placeholder="Extra $"
        value={datos.precio_extra}
        onChange={(e) => onChange("precio_extra", e.target.value)}
        className="h-9 rounded-lg"
      />
    </div>
  );
}

//INPUT DE TEXTO REUSABLE PARA EL FORMULARIO
function CampoTexto({ label, icon: Icon, name, value, onChange, type = "text", multilinea = false }) {
  const id = `campo-${name}`;
  return (
    <div className="grid gap-2">
      {multilinea ? (
        <>
          <Label htmlFor={id} className="gap-1.5">
            <Icon className="size-3.5 text-emerald-600" /> {label}
          </Label>
          <Textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="rounded-xl bg-white"
          />
        </>
      ) : (
        <>
          <Label htmlFor={id}>{label}</Label>
          <InputIcono
            icon={Icon}
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
}

//SELECT REUSABLE PARA EL FORMULARIO
function CampoSelect({ label, icon: Icon, name, value, onChange, opciones, getId, getLabel }) {
  const id = `campo-${name}`;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <SelectNativo
        icon={Icon}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">Selecciona {label.toLowerCase()}…</option>
        {opciones.map((o) => (
          <option key={getId(o)} value={getId(o)}>{getLabel(o)}</option>
        ))}
      </SelectNativo>
    </div>
  );
}

//CHECKBOX MULTIPLE DE TALLAS
function SelectorTallas({ tallas, seleccionadas, prendaSeleccionada, onToggle }) {
  return (
    <div className="grid gap-2">
      <Label className="gap-1.5">
        <RulerIcon className="size-3.5 text-muted-foreground" /> Tallas disponibles
      </Label>
      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/60 p-2">
        {tallas.length > 0 ? (
          tallas.map((t) => (
            <label
              key={t.idtalla}
              className="cursor-pointer select-none rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 has-[:checked]:border-zinc-950 has-[:checked]:bg-zinc-950 has-[:checked]:text-white has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
            >
              <input
                type="checkbox"
                value={t.idtalla}
                checked={seleccionadas.includes(t.idtalla)}
                onChange={onToggle}
                disabled={!prendaSeleccionada}
                className="sr-only"
              />
              {t.codigo}
            </label>
          ))
        ) : (
          <p className="px-1 text-sm text-muted-foreground">
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
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">

      {/* ENCABEZADO Y FILTRO PRINCIPAL */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="grid w-full flex-1 gap-2">
          <Label htmlFor="filtro-buscar">Buscar artículo</Label>
          <InputIcono
            icon={SearchIcon}
              id="filtro-buscar"
              type="text"
              name="buscar"
              value={filtros.buscar}
              onChange={onChange}
                            placeholder="Buscar por nombre, SKU, marca…"
            />
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setMostrarAvanzados(!mostrarAvanzados)}
          className="shrink-0"
        >
          <SlidersIcon className="size-4" />
          {mostrarAvanzados ? "Ocultar filtros" : "Más filtros"}
        </Button>
      </div>

      {/* FILTROS AVANZADOS (OCULTOS POR DEFECTO) */}
      {mostrarAvanzados && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <SelectFiltro
            label="Marca"
            icon={TagIcon}
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
            icon={BookmarkIcon}
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
            icon={FolderIcon}
            name="categoria"
            value={filtros.categoria}
            onChange={onChange}
            opciones={catalogos.categoria}
            getId={(c) => c.idcategoria}
            getLabel={(c) => c.nombre}
            placeholderTodos="Todas las cat."
          />

          <SelectFiltro
            label="Color"
            icon={PaletteIcon}
            name="color"
            value={filtros.color}
            onChange={onChange}
            opciones={catalogos.color}
            getId={(c) => c.idcolor}
            getLabel={(c) => c.nombre}
            placeholderTodos="Todos los colores"
          />

          <SelectFiltro
            label="Talla"
            icon={RulerIcon}
            name="talla"
            value={filtros.talla}
            onChange={onChange}
            opciones={catalogos.talla}
            getId={(t) => t.idtalla}
            getLabel={(t) => t.codigo}
            placeholderTodos="Todas las tallas"
          />

          <div className="grid gap-2">
            <Label>Estado</Label>
            <SelectNativo
              icon={CheckIcon}
              name="estado"
              value={filtros.estado}
              onChange={onChange}
            >
              <option value="">Cualquiera</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </SelectNativo>
          </div>
        </div>
      )}
    </div>
  );
}

//SELECT REUSABLE PARA LA BARRA DE FILTROS
function SelectFiltro({ label, name, value, onChange, opciones, getId, getLabel, placeholderTodos }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <SelectNativo
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholderTodos}</option>
        {opciones.map((o) => <option key={getId(o)} value={getId(o)}>{getLabel(o)}</option>)}
      </SelectNativo>
    </div>
  );
}

//TABLA DE VARIANTES REGISTRADAS
function TablaVariantes({ variantes, onEditar, onEliminar, onAgregarDescuento, seleccionados, onToggleSeleccionado, onToggleSelecionarTodo }) {
  const todosSeleccionados = variantes.length > 0 && seleccionados.length === variantes.length;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[900px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="bg-zinc-50 text-xs text-muted-foreground">
            <th className="w-10 border-b border-zinc-200 px-4 py-3 text-center">
              <input
                type="checkbox"
                checked={todosSeleccionados}
                onChange={onToggleSelecionarTodo}
                className="size-4 cursor-pointer rounded border-zinc-300 accent-emerald-600"
                title="Seleccionar todos"
                aria-label="Seleccionar todas las variantes"
              />
            </th>
            <th className="border-b border-zinc-200 px-4 py-3 text-left font-medium">Foto</th>
            <th className="border-b border-zinc-200 px-4 py-3 text-left font-medium">Nombre / variante</th>
            <th className="border-b border-zinc-200 px-4 py-3 text-left font-medium">Clasificación</th>
            <th className="border-b border-zinc-200 px-4 py-3 text-left font-medium">Descripción</th>
            <th className="border-b border-zinc-200 px-4 py-3 text-left font-medium">Inventario</th>
            <th className="border-b border-zinc-200 px-4 py-3 text-right font-medium">Precios</th>
            <th className="border-b border-zinc-200 px-4 py-3 text-center font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {variantes.map((data) => (
            <FilaVariante
              key={data.idvararticulo}
              data={data}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onAgregarDescuento={onAgregarDescuento}
              seleccionados={seleccionados.includes(data.idvararticulo)}
              onToggleSeleccionado={() => onToggleSeleccionado(data.idvararticulo)}
            />
          ))}
        </tbody>
      </table>
      {variantes.length === 0 && (
        <p className="py-14 text-center text-sm text-muted-foreground">No se encontraron artículos.</p>
      )}
    </div>
  );
}

//FILA INDIVIDUAL DE LA TABLA DE VARIANTES
function FilaVariante({ data, onEditar, onEliminar, onAgregarDescuento, seleccionados, onToggleSeleccionado }) {
  const celda = "border-b border-zinc-100 px-4 py-3";
  return (
    <tr className={`transition-colors hover:bg-zinc-50 ${seleccionados ? "bg-emerald-50/50" : "bg-white"}`}>
      <td className={`${celda} text-center align-middle`}>
        <input
          type="checkbox"
          checked={seleccionados}
          onChange={onToggleSeleccionado}
          className="size-4 cursor-pointer rounded border-zinc-300 accent-emerald-600"
          aria-label={`Seleccionar ${data.articulo.nombre} talla ${data.talla.codigo}`}
        />
      </td>
      <td className={celda}>
        <img
          src={data.foto}
          alt={data.articulo.nombre}
          width={64}
          height={64}
          loading="lazy"
          className="size-16 rounded-xl border border-zinc-200 bg-zinc-100 object-cover shadow-sm"
        />
      </td>
      <td className={`${celda} align-top`}>
        <p className="text-xs font-medium text-muted-foreground">{data.articulo.prendas?.nombre}</p>
        <p className="font-semibold">{data.articulo.nombre}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-zinc-600">Marca:</span> {data.articulo.marca.nombre}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md border border-sky-100 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
            <PaletteIcon className="size-3" /> {data.color.nombre}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
            <RulerIcon className="size-3" /> {data.talla.codigo}
          </span>
        </div>
      </td>

      <td className={`${celda} align-top`}>
        <span className="mb-1 inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          <FolderIcon className="size-3" /> {data.articulo.categoria.nombre}
        </span>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-zinc-600">Impuesto:</span> {data.articulo.impuestos.nombre} ({data.articulo.impuestos.porcentaje}%)
        </p>
      </td>

      <td className={`${celda} max-w-[200px] align-top`}>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {data.articulo.descripcion || <span className="italic text-zinc-300">Sin descripción</span>}
        </p>
      </td>

      <td className={`${celda} align-top`}>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-zinc-600">SKU:</span>{" "}
          <span className="font-mono text-zinc-800">{data.sku}</span>
        </p>
        <p className="mt-1.5">
          <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${data.stock > 10 ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : data.stock > 0 ? "border border-amber-200 bg-amber-50 text-amber-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
            <BoxIcon className="size-3" /> {data.stock} disp.
          </span>
        </p>
      </td>

      <td className={`${celda} text-right align-top tabular-nums`}>
        {data.precio_con_descuento_activo && Number(data.precio_con_descuento_activo) < Number(data.precio_final) ? (
          <>
            <p className="text-sm font-bold text-emerald-700">${Number(data.precio_con_descuento_activo).toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-zinc-400 line-through">${Number(data.precio_final).toLocaleString()}</p>
          </>
        ) : (
          <p className="text-sm font-semibold">${Number(data.precio_final).toLocaleString()}</p>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">Base: ${Number(data.articulo.precio_base).toLocaleString()}</p>
        {Number(data.precio_extra) > 0 && (
           <p className="text-[11px] text-muted-foreground">+ Extra: ${Number(data.precio_extra).toLocaleString()}</p>
        )}
      </td>

      <td className={`${celda} align-top`}>
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onAgregarDescuento(data)}
            title="Agregar descuento"
            aria-label="Agregar descuento"
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-emerald-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 focus-visible:ring-[3px] focus-visible:ring-emerald-400/50 focus-visible:outline-none"
          >
            <TagIcon className="size-3.5" />
          </button>
          <button
            onClick={() => onEditar(data)}
            title="Editar"
            aria-label="Editar"
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-[3px] focus-visible:ring-sky-400/50 focus-visible:outline-none"
          >
            <EditIcon className="size-3.5" />
          </button>
          <button
            onClick={() => onEliminar(data)}
            title="Eliminar"
            aria-label="Eliminar"
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:ring-[3px] focus-visible:ring-red-400/50 focus-visible:outline-none"
          >
            <TrashIcon className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default Articulos;
