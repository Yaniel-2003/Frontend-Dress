import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ModalMensaje from "../components/ModalMensajes";
import ModalConfirmar from "../components/ConfirmarEliminar";

import { obtenerUsuario, actualizarUsuario } from "./services/Registro.service"; 
import { getTipoDoc } from "../services/catalogo.service";
import { crearDireccion, actualizarDireccion, obtenerTodos, eliminarDireccion } from "../services/direcciones.service";

import { UserIcon, IdCardIcon, PhoneIcon, MailIcon, MapPinIcon, HomeIcon, BuildingIcon, GlobeIcon, HashIcon, EditIcon, TrashIcon, SaveIcon } from "../components/Icons";
import { Button } from "@/components/ui/button";
import { InputIcono, SelectIcono } from "../components/CamposConIcono";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";


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
        }catch{
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
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de direcciones
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
        }catch{
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
        }catch{
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
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1">
                <section className="relative overflow-hidden bg-zinc-950 text-white">
                    <div className="pointer-events-none absolute -top-24 left-[6%] size-[30rem] rounded-full bg-emerald-500/35 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-28 right-[4%] size-[30rem] rounded-full bg-blue-600/35 blur-3xl" />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                            backgroundSize: "44px 44px",
                        }}
                    />
                    <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 pb-32 pt-10 sm:flex-row sm:items-center sm:px-6 sm:pt-14 sm:pb-36">
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 shadow-xl backdrop-blur sm:size-24">
                            <UserIcon className="size-10 text-white/80 sm:size-12" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-emerald-300">Mi perfil</p>
                            <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                                Hola, <span className="text-emerald-300">{usuarioForm.formData.nombres} {usuarioForm.formData.apellidos}</span>
                            </h1>
                            <p className="mt-3 max-w-xl text-base text-white/70">
                                Esta es la vista de perfil. Gestiona tu información personal y los datos de contacto de tu cuenta.
                            </p>
                        </div>
                    </div>

                    {/* difuminado inferior: el encabezado se funde con el fondo de la página */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-background/70 to-background" />
                </section>

                <div className="relative mx-auto -mt-16 w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-12">
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
                </div>
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
        <div className="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
            {/* ───── Sidebar ───── */}
            <aside className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:sticky lg:top-24">
                <div className="relative flex flex-col px-5 py-6">
                    <p className="text-base font-semibold tracking-tight">
                        {formData.nombres} {formData.apellidos}
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2 truncate"><MailIcon className="size-4 shrink-0 text-emerald-600" /> <span className="truncate">{formData.email}</span></p>
                        <p className="flex items-center gap-2"><PhoneIcon className="size-4 shrink-0 text-emerald-600" /> {formData.telefono}</p>
                    </div>

                    <nav className="mt-6 grid w-full gap-1 border-t border-zinc-100 pt-4">
                        <span className="flex items-center gap-3 rounded-xl bg-zinc-950 px-3.5 py-2.5 text-sm font-medium text-white">
                            <UserIcon className="size-4" /> Datos personales
                        </span>
                        <button
                            type="button"
                            onClick={onAbrirDirecciones}
                            className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                        >
                            <MapPinIcon className="size-4" /> Mis direcciones
                        </button>
                    </nav>
                </div>
            </aside>

            {/* ───── Datos ───── */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold tracking-tight">Datos personales</h2>
                    <p className="text-sm text-muted-foreground">Actualiza tu información y guarda los cambios.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

                    <div className="grid gap-2">
                        <Label htmlFor="perfil-documento">Tipo de documento</Label>
                        <SelectIcono
                            icon={IdCardIcon}
                            id="perfil-documento"
                            name="documento"
                            value={formData.documento}
                            onChange={onChange}
                        >
                            <option value="">Selecciona una opción...</option>
                            {tiposDocumento?.map((tipo) => (
                                <option
                                    key={tipo.idnumero}
                                    value={tipo.idnumero}
                                >
                                    {tipo.sigla}
                                </option>
                            ))}
                        </SelectIcono>
                    </div>
                    <CampoPerfil
                        label="Número de documento"
                        icon={IdCardIcon}
                        name="numero"
                        value={formData.numero}
                        onChange={onChange}
                        inputMode="numeric"
                        placeholder="10029812342"
                    />
                    <CampoPerfil
                        label="Teléfono"
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

                <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-zinc-100 pt-6 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onAbrirDirecciones}
                    >
                        <MapPinIcon className="size-4" /> Mis direcciones
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        disabled={cargando}
                        onClick={onGuardar}
                        className="hover:bg-emerald-700"
                    >
                        <SaveIcon className="size-4" />
                        <span>{cargando ? 'Guardando...' : 'Guardar cambios'}</span>
                    </Button>
                </div>
            </section>
        </div>
    );
}

//INPUT REUSABLE DEL FORMULARIO DE USUARIOS
function CampoPerfil({ label, icon: Icon, name, value, onChange, type="text", inputMode, placeholder }){
    return (
        <div className="grid gap-2">
            <Label htmlFor={`perfil-${name}`}>{label}</Label>
            <InputIcono
                icon={Icon}
                id={`perfil-${name}`}
                type={type}
                inputMode={inputMode}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

//BLOQUE 7 COMPONENTES DE UI
function ModalDireccion ({ direccion, onCerrar, onEliminar }){
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
                <header className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                            <MapPinIcon className="size-5" />
                        </span>
                        <div>
                            <h3 className="text-lg font-semibold leading-tight tracking-tight">Mis direcciones</h3>
                            <p className="text-sm text-muted-foreground">Gestiona tus lugares de entrega y residencia.</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={onCerrar}
                        aria-label="Cerrar"
                        className="text-muted-foreground"
                    >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    {direccion.desplegarForm && <FormularioDireccion direccion={direccion} />}

                    <div className="flex flex-col gap-3">
                        {direccion.listaDirecciones.length === 0 ? (
                            <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-300 py-12 text-center">
                                <MapPinIcon className="mb-3 size-9 text-zinc-300" />
                                <p className="text-sm text-muted-foreground">No tienes direcciones guardadas.</p>
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
                <footer className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-zinc-100 bg-zinc-50/70 px-6 py-4 sm:flex-row sm:items-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={direccion.nuevaDireccion}
                        className="bg-white"
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
                    </Button>
                    <Button
                        type="button"
                        onClick={direccion.guardar}
                        disabled={direccion.cargando}
                        className="hover:bg-emerald-700"
                    >
                        <SaveIcon className="size-4" />
                        <span>{direccion ? 'Guardar': 'Guardando..'}</span>
                    </Button>
                </footer>
            </div>
        </div>
    );
}

function FormularioDireccion({ direccion }){
    const {formDirecciones: f, actualizarCampo, cerraFormulario } = direccion;

    return (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50/70 p-5">
            <h4 className="mb-5 text-sm font-semibold">
                {f.iddireccion ? 'Editar dirección': 'Nueva dirección'}
            </h4>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <CampoDireccion
                    label="Destinatario"
                    icon={UserIcon}
                    name="nombre_destinatario"
                    value={f.nombre_destinatario}
                    onChange={actualizarCampo}
                    placeholder="Juanito alimaña"
                />
                <CampoDireccion
                    label="Dirección"
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
                    label="Código postal"
                    icon={HashIcon}
                    name="codigo_postal"
                    value={f.codigo_postal}
                    onChange={actualizarCampo}
                    inputMode="numeric"
                    placeholder="050022"
                />

                <div className="flex items-center gap-3 sm:pt-7">
                    <input
                        type="checkbox"
                        name="principal"
                        id="principal_check"
                        onChange={actualizarCampo}
                        checked={f.principal}
                        className="size-4 cursor-pointer rounded border-zinc-300 accent-emerald-600"
                    />
                    <label htmlFor="principal_check" className="cursor-pointer text-sm font-medium text-zinc-700">
                        ¿Es tu dirección principal?
                    </label>
                </div>
            </div>
            <div className="mt-5 flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cerraFormulario}
                    className="bg-white"
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}

function CampoDireccion({ label, icon: Icon, name, value, onChange, inputMode, placeholder }){
    return (
        <div className="grid gap-2">
            <Label htmlFor={`dir-${name}`}>{label}</Label>
            <InputIcono
                icon={Icon}
                id={`dir-${name}`}
                type="text"
                inputMode={inputMode}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}

function TarjetaDireccion({ direccion, onEditar, onEliminar }){
    return (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
            <div className="flex gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <MapPinIcon className="size-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold">
                        {direccion.nombre_destinatario}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {direccion.direccion}, {direccion.ciudad}, {direccion.departamento}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Barrio: {direccion.barrio} · CP {direccion.codigo_postal}
                    </p>
                    {direccion.principal &&
                        <Badge variant="outline" className="mt-2 border-emerald-200 bg-emerald-50 text-emerald-700">
                            Principal
                        </Badge>
                    }
                </div>
            </div>
            <div className="flex shrink-0 gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={onEditar}
                    title="Editar"
                    aria-label="Editar"
                    className="text-zinc-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                    <EditIcon className="size-4" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={onEliminar}
                    title="Eliminar"
                    aria-label="Eliminar"
                    className="text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                    <TrashIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}

export default Perfil;
