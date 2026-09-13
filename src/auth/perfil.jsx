import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ModalMensaje from "../components/ModalMensajes";
import ModalConfirmar from "../components/ConfirmarEliminar";

import { obtenerUsuario, actualizarUsuario } from "./services/Registro.service"; 
import { getTipoDoc } from "../services/catalogo.service";
import { crearDireccion, actualizarDireccion, obtenerTodos, eliminarDireccion } from "../services/direcciones.service";

import { UserIcon, IdCardIcon, PhoneIcon, MailIcon, MapPinIcon, HomeIcon, BuildingIcon, GlobeIcon, HashIcon, EditIcon, TrashIcon, SaveIcon } from "../components/Icons";


// BLOQUE 1 DE CONFIGURACIONES Y UTILIDADES

const ESTADO_INICIAL_DIRECCIONES = {
    usuario: "",
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

// SOLO ESTOS CAMPOS SE PUEDEN EDITAR
const CAMPOS_USUARIOS_EDITABLES = ["nombres", "apellidos", "documento", "numero", "telefono", "email"];

const filtrarCamposUsuarios = (formData)=> {
    const payload = {};
    CAMPOS_USUARIOS_EDITABLES.forEach((campo) => {
        payload[campo] = formData[campo];
    });
    if(formData.password) payload.password = formData.password;
    return payload;
};

//BLOQUE 2 HOOK MENSAJES 

function useMensajeTemporal(duracion=1000){
    const [abierto, setAbierto] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("success");

    const mostrar = (texto, tipoMensaje) => {
        setMensaje(texto);
        setTipo(tipoMensaje);
        setAbierto(true)
        setTimeout(() => setAbierto(false), duracion);
    };
    return { abierto, mensaje, tipo, mostrar };
}

// BLOQUE 3 HOOK DE USUARIOS
function useDatosUsuario({ mostrarMensaje }){
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [formData, setFormData] = useState({
        idusuario: "", email: "", password: "", nombres: "", apellidos: "",
        numero: "", telefono: "", is_active: true, fecha_creacion: "", documento: "", perfil: "",
    });

    useEffect(() => {
        const cargarUsuario = async () => {
            try{
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                const [data, dataDoc] = await Promise.all([
                    obtenerUsuario(usuario.idusuario),
                    getTipoDoc(),
                ]);
                setFormData(data);
                setTiposDocumento(dataDoc);
            }catch(error){
                console.log("Error al cargar los datos del usuario: ", error);
            }
        };
        cargarUsuario();
    },[]);

    const actualizarCampo = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    };

    //CONSTANTE QUE SOLO ENVIA LOS CAMPOS QUE YO QUIERO EDITAR NO TODOS 
    const guardar = async (e) =>  {
        e.preventDefault();
        setCargando(true);
        try{
            const payload = filtrarCamposUsuarios(formData);
            const actualizado = await actualizarUsuario(formData.idusuario, payload);

            localStorage.setItem('usuario', JSON.stringify(actualizado));
            mostrarMensaje("Datos actualizados con exito", "success");
        }catch(error){
            mostrarMensaje("Error al actualizar datos", "error");
        }finally{
            setCargando(false);
        }
    };
    return { formData, tiposDocumento, cargando, actualizarCampo, guardar}
}

// BLOQUE 4 DIRECCIONES 

function useDirecciones({ mostrarMensaje }){
    const [listaDirecciones, setListaDirecciones] = useState([])
    const [cargando, setCargando] = useState(false);
    const [desplegarForm, setDesplegarForm] = useState(false);
    const [formDirecciones, setFormDirecciones] = useState(ESTADO_INICIAL_DIRECCIONES);

    const cargarDirecciones = async () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const todas = await obtenerTodos();
        const propias = todas.filter((dir) => dir.usuario.idusuario === usuario.idusuario);
        setListaDirecciones(propias); 
    }

    useEffect(() => {
        cargarDirecciones().catch((error)=>
            console.error("Error al cargar las direcciones: ", error)
        );
    },[])

    const nuevaDireccion = () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        setFormDirecciones({ ...ESTADO_INICIAL_DIRECCIONES, usuario: usuario?.idusuario || ""});
        setDesplegarForm(true);
    };

    const cerraFormulario = () => setDesplegarForm(false);

    const editarDireccion = (direccion) => {
        setFormDirecciones({
            ...direccion,
            usuario: direccion.usuario.idusuario || direccion.usuario,
        });
        setDesplegarForm(true);
    };


    const actualizarCampo = (e) => {
        let { name, value, type, checked } = e.target;
        if(value === "true") value = true;
        if(value === "false") value = false;

        setFormDirecciones((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const guardar = async (e) => {
        e.preventDefault();
        setCargando(true);
        try{
            if(formDirecciones.iddireccion){
                await actualizarDireccion(formDirecciones.iddireccion, formDirecciones);
            }else{
                await crearDireccion(formDirecciones);
            }
            await cargarDirecciones();
            mostrarMensaje("Direccion guardada con exito", "success");
            setDesplegarForm(false);
        }catch(error){
            mostrarMensaje("Error al guardar direcciones", "error"),
            setDesplegarForm(false);
        }finally{
            setCargando(false);
        }
    };

    const eliminar = async (iddireccion) => {
        setCargando(true);
        try{
            await eliminarDireccion(iddireccion);
            setListaDirecciones((prev) => prev.filter((dir) => dir.iddireccion !== iddireccion));
            mostrarMensaje("Direccion eliminada con exito", "success");
        }catch(error){
            mostrarMensaje("Error al eliminar direccion", "error");
        }finally{
            setCargando(false);
        }
    };

    return { listaDirecciones, cargando, desplegarForm, formDirecciones,
        nuevaDireccion, cerraFormulario, editarDireccion, actualizarCampo, guardar, eliminar,
    };
}

// BLOQUE 5 COMPONENTE PRINCIPAL 
function Perfil(){
    const notificacion = useMensajeTemporal();
    const usuarioForm = useDatosUsuario({ mostrarMensaje: notificacion.mostrar })
    const direccion = useDirecciones({ mostrarMensaje: notificacion.mostrar })

    const [modalUbicacion, setModalUbicacion] = useState(false);
    const [itemEliminar, setItemEliminar] = useState(null);
    const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);

    const prepararEliminar = (direccion) => {
        setItemEliminar(direccion);
        setModalConfirmarAbierto(true);
    };

    const confirmarEliminacion = async () => {
        await direccion.eliminar(itemEliminar.iddireccion);
        setModalConfirmarAbierto(false);
    };

    return (
        <div className="flex flex-col min-h-screen gap-4">
            <NavBar />
            <div className="py-6 px-4">
                <h2 className="text-center font-bold text-2xl tracking-tight text-slate-800">
                    Hola <span className="text-blue-600 font-bold">{usuarioForm.formData.nombres} {usuarioForm.formData.apellidos}</span> esta es la vista
                    de perfil
                </h2>
                <p className="text-center text-xs text-slate-500 mt-1">
                    Gestiona tu informacion personal y datos de contacto de la cuenta
                </p>
            </div>

            <main className="grow flex items-start justify-center p-4 w-full max-w-5xl mx-auto">
                <TarjetaUsuario
                    formData={usuarioForm.formData}
                    tiposDocumento={usuarioForm.tiposDocumento}
                    cargando={usuarioForm.cargando}
                    onChange={usuarioForm.actualizarCampo}
                    onGuardar={usuarioForm.guardar}
                    onAbrirDirecciones={() => setModalUbicacion(true)}
                />

                {modalUbicacion && (
                    <ModalDireccion 
                        direccion={direccion}
                        onCerrar={() => setModalUbicacion(false)}
                        onEliminar={prepararEliminar}
                    />
                )}

                {modalConfirmarAbierto && (
                    <ModalConfirmar 
                        datosAMostrar={itemEliminar ? itemEliminar.direccion : ""}
                        onCancelar={() => setModalConfirmarAbierto(false)}
                        onConfirmar={confirmarEliminacion}
                        cargando={direccion.cargando}

                    /> 
                )}
            </main>

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

// BLOQUE 6 COMPONENTES UI TARGETA DE USUARIOS
function TarjetaUsuario({ formData, tiposDocumento, cargando, onChange, onGuardar, onAbrirDirecciones }){
    return (
        <div className="w-full bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/3 bg-slate-50/60 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                <div className="relative w-36 h-36 rounded-full border-2 border-blue-500/20 bg-slate-100 flex items-center justify-center shadow-inner group transition-all">
                    <svg className="w-20 h-20 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" viewBox="0 0 640 640" fill="currentColor">
                        <path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z"/>
                    </svg>
                </div>
                <span className="mt-4 text-center text-slate-800 text-sm font-semibold tracking-wide uppercase">
                    {formData.nombres} {formData.apellidos}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">Usuario del Sistema</span>
            </div>

            <div className="w-full md:w-2/3 p-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CampoPerfil 
                        label="Nombre"
                        icon={UserIcon}
                        name="nombres"
                        value={formData.nombres}
                        onChange={onChange}
                    />
                    <CampoPerfil 
                        label={"Apellido"}
                        icon={UserIcon}
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={onChange}
                    />

                    <div className="relative mt-2">
                        <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                            <IdCardIcon className="w-3.5 h-3.5 text-slate-400" /> Tipo documento
                        </label>
                        <select 
                            name="documento"
                            value={formData.documento}
                            onChange={onChange}
                            className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white cursor-pointer" 
                        >
                            <option value="">Seleciona una opcion...</option>
                            {tiposDocumento?.map((tipo) => (
                                <option
                                    key={tipo.idnumero}
                                    value={tipo.idnumero}
                                >
                                    {tipo.sigla}
                                </option>
                            ))}
                        </select>
                    </div>
                    <CampoPerfil 
                        label="Numero de documento"
                        icon={IdCardIcon}
                        name="numero"
                        value={formData.numero}
                        onChange={onChange}
                        inputMode="numeric"
                        placeholder="10029812342"
                    />
                    <CampoPerfil
                        label="Telefono"
                        icon={PhoneIcon}
                        name="telefono"
                        value={formData.telefono}
                        onChange={onChange}
                        inputMode="numeric"
                        placeholder="3224390543"
                    />
                    <CampoPerfil 
                        label="Correo electrónico"
                        icon={MailIcon}
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        type="email"
                        placeholder="prueba@gamil.com"
                    />
                </div>

                <div className="flex justify-end mt-6 gap-3">
                    <button
                        type="button"
                        onClick={onAbrirDirecciones}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                    >
                        <MapPinIcon className="w-4 h-4" /> Mis direcciones
                    </button>
                    <button
                        type="button"
                        disabled={cargando}
                        onClick={onGuardar}
                        className={`group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white active:scale-[0.98] shadow-sm hover:shadow transition-all cursor-pointer ${cargando ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        <SaveIcon className="w-4 h-4" />
                        <span>{cargando ? 'Guardando...' : 'Guardar'}</span>
                    </button>
                </div>
            </div>
        </div>  
    );
}

//INPUT REUSABLE DEL FORMULARIO DE USUARIOS
function CampoPerfil({ label, icon: Icon, name, value, onChange, type="text", inputMode, placeholder }){
    return (
        <div className="relative mt-2">
            <label className="absolute flex items-center gap-1 left-3 -top-2.5 bg-white px-1.5 text-xs font-medium text-slate-500 z-10">
                <Icon className="w-3.5 h-3.5 text-slate-400" /> {label}
            </label>
            <input 
                type={type}
                inputMode={inputMode}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-slate-50/50 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white" 
            />
        </div>
    );
}

//BLOQUE 7 COMPONENTES DE UI
function ModalDireccion ({ direccion, onCerrar, onEliminar }){
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col animate-scale-up max-h-[90vh]">
                <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <MapPinIcon className="w-5 h-5 text-emerald-600" /> Mis direcciones
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">Gestiona tus lugares de entrega y residencia.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onCerrar}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {direccion.desplegarForm && <FormularioDireccion direccion={direccion} />}
                    
                    <div className="flex flex-col gap-3">
                        {direccion.listaDirecciones.length === 0 ? (
                            <div className="text-center py-12">
                                <MapPinIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">No tienes direcciones guardadas.</p>
                            </div>
                        ):(
                            direccion.listaDirecciones.map((dir) => (
                                <TarjetaDireccion
                                    key={dir.iddireccion}
                                    direccion={dir}
                                    onEditar={() => direccion.editarDireccion(dir)}
                                    onEliminar={() => onEliminar(dir)}
                                />
                            ))
                        )}
                    </div>
                </div>
                <footer className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={direccion.nuevaDireccion}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2"
                    >
                        <svg    
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M5 12h14"/>
                            <path d="M12 5v14"/>
                        </svg>
                        Nueva dirección
                    </button>
                    <button 
                        type="button"
                        onClick={direccion.guardar}
                        disabled={direccion.cargando}
                        className={`group inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white active:scale-[0.98] shadow-sm hover:shadow transition-all cursor-pointer ${direccion.cargando ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        <SaveIcon className="w-4 h-4" />
                        <span>{direccion ? 'Guardar': 'Guardando..'}</span>
                    </button>
                </footer>
            </div>
        </div>
    );
}

function FormularioDireccion({ direccion }){
    const {formDirecciones: f, actualizarCampo, cerraFormulario } = direccion;

    return (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-gray-700 mb-5 uppercase tracking-wider">
                {f.iddireccion ? 'Editar direccion': 'Nueva direccion'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <CampoDireccion 
                    label="Destinatario"
                    icon={UserIcon}
                    name="nombre_destinatario"
                    value={f.nombre_destinatario}
                    onChange={actualizarCampo}
                    placeholder="Juanito alimaña"
                />
                <CampoDireccion 
                    label="Direccion"
                    icon={MapPinIcon}
                    name="direccion"
                    value={f.direccion}
                    onChange={actualizarCampo}
                    placeholder="Calle 5 # 1b - 35"
                />
                <CampoDireccion 
                    label="Residencia"
                    icon={HomeIcon}
                    name="residencia"
                    value={f.residencia}
                    onChange={actualizarCampo}
                    placeholder="Apto 401"
                />
                <CampoDireccion 
                    label="Barrio"
                    icon={MapPinIcon}
                    name="barrio"
                    value={f.barrio}
                    onChange={actualizarCampo}
                    placeholder="Santa Rita"
                />
                <CampoDireccion 
                    label="Ciudad"
                    icon={BuildingIcon}
                    name="ciudad"
                    value={f.ciudad}
                    onChange={actualizarCampo}
                    placeholder="Medellin"
                />
                <CampoDireccion 
                    label="Departamento"
                    icon={BuildingIcon}
                    name="departamento"
                    value={f.departamento}
                    onChange={actualizarCampo}
                    placeholder="Cundinamarca"
                />
                <CampoDireccion
                    label="País"
                    icon={GlobeIcon}
                    name="pais"
                    value={f.pais}
                    onChange={actualizarCampo}
                    placeholder="Colombia"
                />
                <CampoDireccion 
                    label="Codigo postal"
                    icon={HashIcon}
                    name="codigo_postal"
                    value={f.codigo_postal}
                    onChange={actualizarCampo}
                    inputMode="numeric"
                    placeholder="050022"
                />

                <div className="flex items-center gap-3 pt-2">
                    <input 
                        type="checkbox"
                        name="principal"
                        id="principal_check"
                        onChange={actualizarCampo}
                        checked={f.principal}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="principal_check" className="text-sm font-medium text-slate-600 cursor-pointer">
                        ¿Es tu dirección principal?
                    </label>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={cerraFormulario}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

function CampoDireccion({ label, icon: Icon, name, value, onChange, inputMode, placeholder }){
    return (
        <div className="relative">
            <label className="absolute flex items-center gap-1 left-4 -top-3 bg-gray-50 px-2 text-xs font-semibold text-slate-500 z-10">
                <Icon className="w-3 h-3" />{label}
            </label>
            <input 
                type="text"
                inputMode={inputMode}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                placeholder={placeholder} 
            />
        </div>
    )
}

function TarjetaDireccion({ direccion, onEditar, onEliminar }){
    return (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-start gap-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPinIcon className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800 text-sm">
                        {direccion.nombre_destinatario}
                    </p>
                    <p className="text-xs text-gray-500">
                        {direccion.direccion}, {direccion.ciudad}, {direccion.departamento}
                    </p>
                    <p className="text-xs text-gray-500">
                        Barrio: {direccion.barrio} · CP {direccion.codigo_postal}
                    </p>
                    {direccion.principal && 
                        <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                            Principal
                        </span>
                    }
                </div>
            </div>
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={onEditar}
                        title="Editar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onEliminar}
                        title="Eliminar"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-all cursor-pointer"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
        </div>
    );
}

export default Perfil;