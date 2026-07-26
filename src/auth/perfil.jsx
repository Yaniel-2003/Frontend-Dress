import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { obtenerUsuario, actualizarUsuario } from "./services/Registro.service";
import { getTipoDoc } from "../services/catalogo.service";
import ModalMensaje from "../components/ModalMensajes";
import ModalConfimar from "../components/confrimarEliminar";
import { crearDireccion } from "../services/direcciones.service";
import { actualizarDireccion } from "../services/direcciones.service";
import { obtenerTodos } from "../services/direcciones.service";
import { eliminarDireccion } from "../services/direcciones.service";
import { UserIcon, IdCardIcon, PhoneIcon, MailIcon, MapPinIcon, HomeIcon, BuildingIcon, GlobeIcon, HashIcon, EditIcon, TrashIcon, SaveIcon } from "../components/Icons";

function Perfil(){

    // BLOQUE DE MODALES Y MENSAJES

    const [openModal, setOpenModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");

    const [openModalConfirmar, setOpenModalConfirmar] = useState(false);
    const [itemEliminar, setItemEliminar] = useState(null);

    // BLOQUE DE USUARIO (DATOS Y ACTUALIZACIÓN)

    const [tipoDocumento, setTipoDocumento] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [formData, setFormData] = useState({
        idusuario: "",
        email: "",
        password_hash: "",
        nombres: "",
        apellidos: "",
        numero: "",
        telefono: "",
        activo: true,
        fecha_creacion: "",
        documento: "",
        perfil: "",
    });

    const actualizarFormularioUsuario = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value //Actualiza el campo dinamicamnete
        });
    };

    const guardarCambiosPerfil = async (e) => {
        e.preventDefault();
        setCargando(true);
        try{
            const payload = { ...formData, };
            const actualizar = await actualizarUsuario(formData.idusuario, payload);

            //actualizar el localstorage
            localStorage.setItem('usuario', JSON.stringify(actualizar));

            setMensaje("Datos actualizados con exito");
            setTipo("success");
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false);
            }, 1000);

        }catch(error){
            setMensaje("Error al actualizar datos");
            setTipo("error");
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false);
            }, 1000);
        }finally{
            setCargando(false);
        }
    };


    // BLOQUE DE DIRECCIONES

    const [modalUbicacion, setModalUbicacion] = useState(false);
    const [desplegarDireccion, setDesplegarDireccion] = useState(false);
    const [listaDirecciones, setListaDirecciones] = useState([]);
    const [cargandoDirecciones, setCargandoDirecciones] = useState(false);
    
    const formDireccionInicial = {
        usuario: JSON.parse(localStorage.getItem('usuario'))?.idusuario || "",
        nombre_destinatario: "",
        direccion: "",
        residencia: "",
        barrio: "",
        ciudad: "",
        departamento: "",
        pais: "Colombia",
        codigo_postal: "",
        principal: true,
    };

    const [formDirecciones, setFormDirecciones] = useState({
        usuario: JSON.parse(localStorage.getItem('usuario'))?.idusuario || "",
        nombre_destinatario: "",
        direccion: "",
        residencia: "",
        barrio: "",
        ciudad: "",
        departamento: "",
        pais: "Colombia",
        codigo_postal: "",
        principal: true,
    });

    const nuevadDireccion = () => {
        setFormDirecciones(formDireccionInicial);
        setDesplegarDireccion(true);
    };

    const cerrarFormulario = () => {
        setDesplegarDireccion(false);
    };

    const editarDireccion = (direccion) => {
        setFormDirecciones({
            ...direccion,
            usuario: direccion.usuario.idusuario || direccion.usuario
        });
        setDesplegarDireccion(true);
    };

    const actualizarFormularioDireccion = (e) => {
        let { name, value, type, checked } = e.target;

        if(value === "true") value = true ;
        if(value === "false") value = false;

        setFormDirecciones({
            ...formDirecciones,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const guardarNuevaDireccion = async (e) => {
        e.preventDefault();
        setCargandoDirecciones(true);
        try{
            if(formDirecciones.iddireccion){
                await actualizarDireccion(formDirecciones.iddireccion, formDirecciones);
                setMensaje("Direccion actualizada");
            }else {
                await crearDireccion(formDirecciones);
                setMensaje("Direccion creada con exito")
            }

            const todasLasdirecciones = await obtenerTodos();
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            const misDirecciones = todasLasdirecciones.filter((dir) => dir.usuario.idusuario === usuario.idusuario);
            setListaDirecciones(misDirecciones);
            
            setMensaje("Direccion guardada con exito");
            setTipo("success");
            setOpenModal(true);
            setModalUbicacion(false);

            setTimeout(() => {
                setOpenModal(false)
            },1000);
            
        }catch(error){
            setMensaje("Error al crear la direccion");
            setTipo("error");
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false)
            },1000);
        }finally{
            setCargandoDirecciones(false);
        }
    };

    //PREPARAR ELIMINACION
    const prepararEliminar = (direccionSelecionada) => {
        setItemEliminar(direccionSelecionada);
        setOpenModalConfirmar(true);
    }

    const borrarDireccion = async () => {
        setCargandoDirecciones(true);
        try{
            const iddir = itemEliminar.iddireccion;

            await eliminarDireccion(iddir);

            const nuevasDirecciones = listaDirecciones.filter((dir) => String(dir.iddireccion) !== String(iddir));

            setListaDirecciones(nuevasDirecciones);

            setMensaje("Dirección eliminada con éxito");
            setTipo("success");
            setOpenModal(true);
            setOpenModalConfirmar(false);

            setTimeout(() => {
                setOpenModal(false);
            },1000);
        }catch(error){
            setMensaje("Error al eliminar la dirección");
            setTipo("error");
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false);
            },1000);
        }finally{
            setCargandoDirecciones(false);
        }
    };


    // EFECTOS (CARGA INICIAL DE LA VISTA)

    useEffect(() => {
        const cargarPerfil = async () => {
            try{
                //Trae los datos de usuarios y tipo documentos
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                const data = await obtenerUsuario(usuario.idusuario);
                setFormData(data);

                const dataDoc = await getTipoDoc();
                setTipoDocumento(dataDoc);

                const todasLasdirecciones = await obtenerTodos();
                const misDirecciones = todasLasdirecciones.filter(
                    (dir) => dir.usuario.idusuario === usuario.idusuario
                );

                setListaDirecciones(misDirecciones);

                // Si quieres que el formulario se llene con la primera por defecto (opcional)
                if(misDirecciones.length > 0){
                    setFormDirecciones({
                        ...misDirecciones[0],
                        usuario: misDirecciones[0].usuario.idusuario
                    });
                }

            } catch (error){
                console.error("Error al cargar los datos del usuario:", error);
            }
        };
        cargarPerfil();
    },[]); // Los corchetes significan cargar una vez al abrir la pagina


    return (
        <div className="flex flex-col min-h-screen gap-4">
            <NavBar />
                <div className="py-6 px-4">
                    <h2 className="text-center font-bold text-2xl tracking-tight text-slate-800">
                        Hola <span className="text-blue-600 font-extrabold">{formData.nombres}{" "}{formData.apellidos}</span>, esta es la vista de perfil
                    </h2>
                    <p className="text-center text-xs text-slate-500 mt-1">
                        Gestiona tu información personal y datos de contacto de la cuenta.
                    </p>
                </div>
            <main className="grow flex items-start justify-center p-4 w-full max-w-5xl mx-auto">
                <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-1/3 bg-slate-50/60 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                        <div className="relative w-36 h-36 rounded-full border-2 border-blue-500/20 bg-slate-100 flex items-center justify-center shadow-inner group transition-all">
                            <svg 
                                className="w-20 h-20 text-slate-400 group-hover:text-blue-500 transition-colors duration-200"
                                viewBox="0 0 640 640"
                                fill="currentColor"
                            >
                                <path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z"/>
                            </svg>
                        </div>
                        <span className="mt-4 text-center text-slate-800 text-sm font-semibold tracking-wide uppercase">
                            {formData.nombres} {formData.apellidos}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">Usuario del Sistema</span>
                    </div>

                    {openModal && (
                        <ModalMensaje 
                            abierto={openModal}
                            mensaje={mensaje}
                            tipo={tipo}
                        />
                    )}

                    <div className="w-full md:w-2/3 p-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative mt-2">
                                <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                                    <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Nombre
                                </label>
                                <input 
                                    type="text" 
                                    name="nombres" 
                                    value={formData.nombres}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                    placeholder="Camila"
                                />
                            </div>

                            <div className="relative mt-2">
                                <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                                    <UserIcon className="w-3.5 h-3.5 text-slate-400" /> Apellido
                                </label>
                                <input 
                                    type="text" 
                                    name="apellidos" 
                                    value={formData.apellidos}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white"
                                    placeholder="Pardo"
                                />
                            </div>

                            <div className="relative mt-2">
                                <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                                    <IdCardIcon className="w-3.5 h-3.5 text-slate-400" /> Tipo documento
                                </label>
                                <select
                                    name="documento"
                                    value={formData.documento}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white cursor-pointer"
                                >
                                    <option value="">Selecciona una opción...</option>
                                    {tipoDocumento.map((tipo) => (
                                        <option key={tipo.idnumero} value={tipo.idnumero}>
                                            {tipo.sigla}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative mt-2">
                                <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                                    <IdCardIcon className="w-3.5 h-3.5 text-slate-400" /> Número de documento
                                </label>
                                <input 
                                    type="number" 
                                    name="numero" 
                                    value={formData.numero} 
                                    onChange={actualizarFormularioUsuario} 
                                    className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white" 
                                    placeholder="1002659847" 
                                />
                            </div>

                            <div className="relative mt-2">
                                <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                                    <PhoneIcon className="w-3.5 h-3.5 text-slate-400" /> Teléfono
                                </label>
                                <input 
                                    type="number" 
                                    name="telefono" 
                                    value={formData.telefono} 
                                    onChange={actualizarFormularioUsuario} 
                                    className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white" 
                                    placeholder="3224592478" 
                                />
                            </div>

                            <div className="relative mt-2">
                                <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                                    <MailIcon className="w-3.5 h-3.5 text-slate-400" /> Correo electrónico
                                </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={actualizarFormularioUsuario} 
                                    className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white" 
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                type="button"
                                onClick={() => setModalUbicacion(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                            >
                                <MapPinIcon className="w-4 h-4" /> Mis direcciones
                            </button>
                            <button
                                type="button"
                                disabled={cargando}
                                onClick={guardarCambiosPerfil}
                                className={`group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white active:scale-[0.98] shadow-sm hover:shadow transition-all cursor-pointer ${cargando ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                <SaveIcon className="w-4 h-4" />
                                <span>{cargando ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MODAL DIRECCIONES */}
                {modalUbicacion && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                        <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col animate-scale-up max-h-[90vh]">

                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <MapPinIcon className="w-5 h-5 text-emerald-600" /> Mis direcciones
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Gestiona tus lugares de entrega y residencia.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setModalUbicacion(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {openModalConfirmar && (
                                <ModalConfimar
                                    datosAMostrar={itemEliminar ? itemEliminar.direccion : ""}
                                    onCancelar={() => setOpenModalConfirmar(false)}
                                    onConfirmar={borrarDireccion}
                                    cargando={cargandoDirecciones}
                                />
                            )}

                            <div className="flex-1 overflow-y-auto p-6">
                                {desplegarDireccion && (
                                    <div className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
                                        <h4 className="text-sm font-bold text-gray-700 mb-5 uppercase tracking-wider">
                                            {formDirecciones.iddireccion ? 'Editar dirección' : 'Nueva dirección'}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><UserIcon className="w-3 h-3" /> Destinatario</label>
                                                <input type="text" name="nombre_destinatario" onChange={actualizarFormularioDireccion} value={formDirecciones.nombre_destinatario} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: Juan Pérez" />
                                            </div>
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><MapPinIcon className="w-3 h-3" /> Dirección</label>
                                                <input type="text" name="direccion" onChange={actualizarFormularioDireccion} value={formDirecciones.direccion} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: Calle 123 #45-67" />
                                            </div>
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><HomeIcon className="w-3 h-3" /> Residencia</label>
                                                <input type="text" name="residencia" onChange={actualizarFormularioDireccion} value={formDirecciones.residencia} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: Apto 401" />
                                            </div>
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><MapPinIcon className="w-3 h-3" /> Barrio</label>
                                                <input type="text" name="barrio" onChange={actualizarFormularioDireccion} value={formDirecciones.barrio} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: El Poblado" />
                                            </div>
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><BuildingIcon className="w-3 h-3" /> Ciudad</label>
                                                <input type="text" name="ciudad" onChange={actualizarFormularioDireccion} value={formDirecciones.ciudad} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: Medellín" />
                                            </div>
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><BuildingIcon className="w-3 h-3" /> Departamento</label>
                                                <input type="text" name="departamento" onChange={actualizarFormularioDireccion} value={formDirecciones.departamento} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: Antioquia" />
                                            </div>
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><GlobeIcon className="w-3 h-3" /> País</label>
                                                <input type="text" name="pais" onChange={actualizarFormularioDireccion} value={formDirecciones.pais} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: Colombia" />
                                            </div>
                                            <div className="relative">
                                                <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10"><HashIcon className="w-3 h-3" /> Código postal</label>
                                                <input type="number" name="codigo_postal" onChange={actualizarFormularioDireccion} value={formDirecciones.codigo_postal} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white" placeholder="Ej: 050022" />
                                            </div>
                                            <div className="flex items-center gap-3 pt-2">
                                                <input type="checkbox" name="principal" id="principal_check" onChange={actualizarFormularioDireccion} checked={formDirecciones.principal} className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                                                <label htmlFor="principal_check" className="text-sm font-medium text-slate-600 cursor-pointer">¿Es tu dirección principal?</label>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button type="button" onClick={cerrarFormulario} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    {listaDirecciones.length === 0 ? (
                                        <div className="text-center py-12">
                                            <MapPinIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-400 text-sm">No tienes direcciones guardadas.</p>
                                        </div>
                                    ) : (
                                        listaDirecciones.map((dir) => (
                                            <div key={dir.iddireccion} className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-start gap-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                                                        <MapPinIcon className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 text-sm">{dir.nombre_destinatario}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{dir.direccion}, {dir.ciudad}, {dir.departamento}</p>
                                                        <p className="text-xs text-gray-500">Barrio: {dir.barrio} · CP {dir.codigo_postal}</p>
                                                        {dir.principal && <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">Principal</span>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <button onClick={() => editarDireccion(dir)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow transition-all cursor-pointer">
                                                        <EditIcon className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => prepararEliminar(dir)} title="Eliminar" className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-all cursor-pointer">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={nuevadDireccion}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                    Nueva dirección
                                </button>
                                <button
                                    type="button"
                                    onClick={guardarNuevaDireccion}
                                    disabled={cargandoDirecciones}
                                    className={`group inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white active:scale-[0.98] shadow-sm hover:shadow transition-all cursor-pointer ${cargandoDirecciones ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                >
                                    <SaveIcon className="w-4 h-4" />
                                    <span>{cargandoDirecciones ? 'Guardando...' : 'Guardar dirección'}</span>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}

export default Perfil;