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

// Foto del perchero (public/imgDress). Se sirve la copia optimizada de 2400px; el original está al lado.
const FOTO_PERFIL = "/imgDress/imgperfil-2400.jpg";


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


    const { nombres, apellidos } = usuarioForm.formData;
    const iniciales = `${nombres?.[0] ?? ""}${apellidos?.[0] ?? ""}`.toUpperCase();

    return (
        <div className="flex min-h-screen flex-col bg-lienzo text-tinta selection:text-tinta">
            <NavBar />
            <main className="flex-1">
                {/* ───── Encabezado: el perchero de la tienda, de noche ───── */}
                <section className="relative isolate overflow-hidden" aria-labelledby="titulo-perfil">
                    <img
                        src={FOTO_PERFIL}
                        alt=""
                        width={2400}
                        height={1601}
                        fetchPriority="high"
                        className="encender-foto absolute inset-0 -z-20 size-full object-cover object-[30%_22%] sm:object-[60%_22%]"
                    />
                    {/* velos para que el texto se lea sobre la foto */}
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-lienzo from-0% via-lienzo/30 via-30% to-transparent to-60%" />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-lienzo/45 from-0% via-lienzo/10 via-40% to-transparent to-60%" />

                    <div className="mx-auto flex min-h-[min(52svh,28rem)] w-full max-w-7xl flex-col justify-end px-5 pt-24 pb-10 sm:px-8 sm:pb-14">
                        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                            <span
                                aria-hidden="true"
                                className="flex size-16 shrink-0 items-center justify-center rounded-full bg-lienzo/55 font-display text-2xl text-tinta ring-1 ring-tinta/25 backdrop-blur-md sm:size-20 sm:text-3xl"
                            >
                                {iniciales || <UserIcon className="size-8 text-tinta/70" />}
                            </span>
                            <div className="max-w-2xl">
                                <h1
                                    id="titulo-perfil"
                                    className="font-display text-4xl leading-tight sm:text-5xl font-normal tracking-[-0.02em] text-balance"
                                >
                                    {nombres ? `Hola, ${nombres}.` : "Tu perfil"}
                                </h1>
                                <p className="mt-4 max-w-md text-base leading-relaxed text-tinta/75 sm:text-lg">
                                    Tus datos personales y tus direcciones de entrega, en un solo lugar.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto w-full max-w-7xl px-5 pt-10 pb-28 sm:px-8 sm:pt-14">
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

// Clases compartidas (vitrina nocturna)
const claseCaja = "rounded-2xl bg-superficie ring-1 ring-tinta/10";
const claseBotonCrema = "bg-tinta text-lienzo hover:bg-zinc-800 focus-visible:ring-esmeralda/50";
const claseBotonContorno =
    "border-tinta/20 bg-transparent text-tinta shadow-none hover:bg-tinta/10 hover:text-tinta focus-visible:ring-esmeralda/50";
const claseEtiqueta = "text-tinta/80";

// BLOQUE 6 COMPONENTES UI TARGETA DE USUARIOS
function TarjetaUsuario({ formData, tiposDocumento, cargando, onChange, onGuardar, onAbrirDirecciones }){
    return (
        <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
            {/* ───── Lateral ───── */}
            <aside className={`${claseCaja} p-6 lg:sticky lg:top-24`}>
                <p className="truncate text-base font-semibold tracking-tight">
                    {formData.nombres} {formData.apellidos}
                </p>
                <div className="mt-3 space-y-2 text-sm text-tinta/60">
                    <p className="flex items-center gap-2"><MailIcon className="size-4 shrink-0 text-tinta/60" aria-hidden="true" /> <span className="truncate">{formData.email}</span></p>
                    <p className="flex items-center gap-2 tabular-nums"><PhoneIcon className="size-4 shrink-0 text-tinta/60" aria-hidden="true" /> {formData.telefono}</p>
                </div>

                {/* sección activa marcada con una línea fina de luz, como en la barra de navegación */}
                <nav aria-label="Secciones del perfil" className="mt-6 grid gap-1 border-t border-tinta/10 pt-4">
                    <span
                        aria-current="page"
                        className="relative flex min-h-11 items-center gap-3 pl-4 text-sm font-medium text-tinta before:absolute before:inset-y-2.5 before:left-0 before:w-px before:bg-esmeralda"
                    >
                        <UserIcon className="size-4" aria-hidden="true" /> Datos personales
                    </span>
                    <button
                        type="button"
                        onClick={onAbrirDirecciones}
                        className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm pl-4 text-left text-sm font-medium text-tinta/60 transition-colors hover:text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                        <MapPinIcon className="size-4" aria-hidden="true" /> Mis direcciones
                    </button>
                </nav>
            </aside>

            {/* ───── Datos ───── */}
            <section aria-labelledby="titulo-datos" className={`${claseCaja} p-6 sm:p-8`}>
                <div className="mb-8 flex flex-col gap-2 border-b border-tinta/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <h2 id="titulo-datos" className="font-display text-2xl leading-tight font-normal">Datos personales</h2>
                    <p className="text-sm text-tinta/60">Actualiza tu información y guarda los cambios.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <CampoPerfil
                        label="Nombre"
                        icon={UserIcon}
                        name="nombres"
                        value={formData.nombres}
                        onChange={onChange}
                        autoComplete="given-name"
                    />
                    <CampoPerfil
                        label={"Apellido"}
                        icon={UserIcon}
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={onChange}
                        autoComplete="family-name"
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="perfil-documento" className={claseEtiqueta}>Tipo de documento</Label>
                        <SelectIcono
                            tono="noche"
                            icon={IdCardIcon}
                            id="perfil-documento"
                            name="documento"
                            value={formData.documento}
                            onChange={onChange}
                        >
                            <option value="">Selecciona una opción…</option>
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
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="3224390543"
                    />
                    <CampoPerfil
                        label="Correo electrónico"
                        icon={MailIcon}
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        type="email"
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="correo@ejemplo.com"
                    />
                </div>

                <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-tinta/10 pt-6 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onAbrirDirecciones}
                        className={claseBotonContorno}
                    >
                        <MapPinIcon className="size-4" aria-hidden="true" /> Mis direcciones
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        disabled={cargando}
                        aria-busy={cargando}
                        onClick={onGuardar}
                        className={claseBotonCrema}
                    >
                        <SaveIcon className="size-4" aria-hidden="true" />
                        <span>{cargando ? 'Guardando…' : 'Guardar cambios'}</span>
                    </Button>
                </div>
            </section>
        </div>
    );
}

//INPUT REUSABLE DEL FORMULARIO DE USUARIOS
function CampoPerfil({ label, icon: Icon, name, value, onChange, type="text", inputMode, placeholder, autoComplete, spellCheck }){
    return (
        <div className="grid gap-2">
            <Label htmlFor={`perfil-${name}`} className={claseEtiqueta}>{label}</Label>
            <InputIcono
                tono="noche"
                icon={Icon}
                id={`perfil-${name}`}
                type={type}
                inputMode={inputMode}
                autoComplete={autoComplete}
                spellCheck={spellCheck}
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-lienzo/70 text-tinta backdrop-blur-sm sm:items-center sm:p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-direcciones"
                className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-superficie shadow-xl shadow-zinc-900/10 ring-1 ring-tinta/10 selection:text-tinta sm:rounded-2xl"
            >
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-tinta/10 px-6 py-5 sm:px-8">
                    <div>
                        <h2 id="titulo-direcciones" className="font-display text-2xl leading-tight font-normal">Mis direcciones</h2>
                        <p className="mt-2 text-sm text-tinta/60">Gestiona tus lugares de entrega y residencia.</p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onCerrar}
                        aria-label="Cerrar"
                        className="-mr-2 text-tinta/60 hover:bg-tinta/10 hover:text-tinta focus-visible:ring-esmeralda/50"
                    >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </header>

                <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:px-8 [scrollbar-color:rgb(11_11_12/0.2)_transparent]">
                    {direccion.desplegarForm && <FormularioDireccion direccion={direccion} />}

                    <div className="flex flex-col gap-3">
                        {direccion.listaDirecciones.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-tinta/15 py-12 text-center">
                                <MapPinIcon className="size-9 text-tinta/60" aria-hidden="true" />
                                <p className="text-sm text-tinta/60">Aún no tienes direcciones guardadas. Añade una con «Nueva dirección».</p>
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
                <footer className="flex shrink-0 flex-col-reverse items-stretch justify-end gap-3 border-t border-tinta/10 px-6 py-4 sm:flex-row sm:items-center sm:px-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={direccion.nuevaDireccion}
                        className={claseBotonContorno}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true"
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
                        aria-busy={direccion.cargando}
                        className={claseBotonCrema}
                    >
                        <SaveIcon className="size-4" aria-hidden="true" />
                        <span>{direccion.cargando ? 'Guardando…' : 'Guardar'}</span>
                    </Button>
                </footer>
            </div>
        </div>
    );
}

function FormularioDireccion({ direccion }){
    const {formDirecciones: f, actualizarCampo, cerraFormulario } = direccion;

    return (
        <div className="mb-6 rounded-xl bg-lienzo/40 p-5 ring-1 ring-tinta/10">
            <h3 className="mb-5 text-sm font-semibold">
                {f.iddireccion ? 'Editar dirección': 'Nueva dirección'}
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <CampoDireccion
                    label="Destinatario"
                    icon={UserIcon}
                    name="nombre_destinatario"
                    value={f.nombre_destinatario}
                    onChange={actualizarCampo}
                    autoComplete="name"
                    placeholder="Quién recibe"
                />
                <CampoDireccion
                    label="Dirección"
                    icon={MapPinIcon}
                    name="direccion"
                    value={f.direccion}
                    onChange={actualizarCampo}
                    autoComplete="address-line1"
                    placeholder="Calle 5 # 1b - 35"
                />
                <CampoDireccion
                    label="Residencia"
                    icon={HomeIcon}
                    name="residencia"
                    value={f.residencia}
                    onChange={actualizarCampo}
                    autoComplete="address-line2"
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
                    autoComplete="address-level2"
                    placeholder="Medellín"
                />
                <CampoDireccion
                    label="Departamento"
                    icon={BuildingIcon}
                    name="departamento"
                    value={f.departamento}
                    onChange={actualizarCampo}
                    autoComplete="address-level1"
                    placeholder="Antioquia"
                />
                <CampoDireccion
                    label="País"
                    icon={GlobeIcon}
                    name="pais"
                    value={f.pais}
                    onChange={actualizarCampo}
                    autoComplete="country-name"
                    placeholder="Colombia"
                />
                <CampoDireccion
                    label="Código postal"
                    icon={HashIcon}
                    name="codigo_postal"
                    value={f.codigo_postal}
                    onChange={actualizarCampo}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="050022"
                />

                <label htmlFor="principal_check" className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-tinta/80 sm:mt-6">
                    <input
                        type="checkbox"
                        name="principal"
                        id="principal_check"
                        onChange={actualizarCampo}
                        checked={f.principal}
                        className="size-4 cursor-pointer accent-esmeralda"
                    />
                    ¿Es tu dirección principal?
                </label>
            </div>
            <div className="mt-5 flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cerraFormulario}
                    className={claseBotonContorno}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}

function CampoDireccion({ label, icon: Icon, name, value, onChange, inputMode, placeholder, autoComplete }){
    return (
        <div className="grid gap-2">
            <Label htmlFor={`dir-${name}`} className={claseEtiqueta}>{label}</Label>
            <InputIcono
                tono="noche"
                icon={Icon}
                id={`dir-${name}`}
                type="text"
                inputMode={inputMode}
                autoComplete={autoComplete}
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
        <div className="flex items-start justify-between gap-4 rounded-xl bg-lienzo/40 p-4 ring-1 ring-tinta/10 transition-shadow hover:ring-tinta/25">
            <div className="flex min-w-0 gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-tinta/60" aria-hidden="true" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold">
                        {direccion.nombre_destinatario}
                    </p>
                    <p className="text-sm text-tinta/60">
                        {direccion.direccion}, {direccion.ciudad}, {direccion.departamento}
                    </p>
                    <p className="text-sm text-tinta/60">
                        Barrio: {direccion.barrio} · CP <span className="tabular-nums">{direccion.codigo_postal}</span>
                    </p>
                    {direccion.principal &&
                        <Badge variant="outline" className="mt-2 border-tinta/25 text-tinta/80">
                            Principal
                        </Badge>
                    }
                </div>
            </div>
            <div className="flex shrink-0 gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    onClick={onEditar}
                    title="Editar"
                    aria-label={`Editar dirección de ${direccion.nombre_destinatario}`}
                    className="text-tinta/60 hover:bg-tinta/10 hover:text-tinta focus-visible:ring-esmeralda/50"
                >
                    <EditIcon className="size-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    onClick={onEliminar}
                    title="Eliminar"
                    aria-label={`Eliminar dirección de ${direccion.nombre_destinatario}`}
                    className="text-tinta/60 hover:bg-red-500/10 hover:text-red-600 focus-visible:ring-esmeralda/50"
                >
                    <TrashIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}

export default Perfil;
