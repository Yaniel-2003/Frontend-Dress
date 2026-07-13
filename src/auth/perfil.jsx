import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { obtenerUsuario, actualizarUsuario } from "./services/Registro.service";
import { getTipoDoc } from "../services/catalogo.service";
import ModalMensaje from "../components/ModalMensajes";
import { crearDireccion } from "../services/direcciones.service";
import { actualizarDireccion } from "../services/direcciones.service";
import { obtenerTodos } from "../services/direcciones.service";
import { eliminarDireccion } from "../services/direcciones.service";

function Perfil(){

    // BLOQUE DE MODALES Y MENSAJES

    const [openModal, setOpenModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");


    // BLOQUE DE USUARIO (DATOS Y ACTUALIZACIÓN)

    const [tipoDocumento, setTipoDocumento] = useState([]);
    
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
        };
    };


    // BLOQUE DE DIRECCIONES

    const [modalUbicacion, setModalUbicacion] = useState(false);
    const [desplegarDireccion, setDesplegarDireccion] = useState(false);
    const [listaDirecciones, setListaDirecciones] = useState([]);
    
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
        };
    };

    const borrarDireccion = async (iddireccion) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta dirección?");

        if(!confirmar) return;

        try{
            await eliminarDireccion(iddireccion);

            const nuevasDirecciones = listaDirecciones.filter((dir) => String(dir.iddireccion) !== String(iddireccion));

            setListaDirecciones(nuevasDirecciones);

            setMensaje("Dirección eliminada con éxito");
            setTipo("success");
            setOpenModal(true);

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
                <div className="text-green-800">
                    <h2 className="text-center font-black text-[30px]">Hola {formData.nombres}, esta es la vista de perfil</h2>
                </div>
            <main className="grow flex items-center justify-center gap-1 w-full">
                <div className="flex gap-1">
                    <div className="bg-blue-100 rounded-l-2xl border border-green-100 shadow-xl p-8 text-green-800 ">
                        <div className="relative w-40 h-40 rounded-full border-4 border-green-500 bg-gray-100 flex items-center justify-center shadow-lg">
                            <svg 
                                viewBox="0 0 640 640">
                                <path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z"/>
                            </svg>
                        </div>
                        <span className="flex items-center justify-center text-green-800 uppercase font-extrabold">{formData.nombres} {formData.apellidos}</span>
                    </div>
                    {openModal && (
                        <ModalMensaje 
                            abierto={openModal}
                            mensaje={mensaje}
                            tipo={tipo}
                        />
                    )}
                    <div className="bg-blue-100 rounded-r-2xl border border-green-100 shadow-xl p-8 text-green-800 ">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Nombre </label>
                                <input 
                                    type="text" 
                                    name="nombres" 
                                    value={formData.nombres}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                    placeholder="Camila "
                                />
                            </div>
                            <div className="relative">
                                <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10 ">Apellido </label>
                                <input 
                                    type="text" 
                                    name="apellidos" 
                                    value={formData.apellidos}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                    placeholder="Pardo "
                                />
                            </div>
                            <div className="relative">
                                <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Tipo documento </label>
                                <select
                                    name="documento"
                                    value={formData.documento}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                >
                                    <option value="">Selecciona una opcion...</option>
                                    {tipoDocumento.map((tipo) => (
                                        <option key={tipo.idnumero} value={tipo.idnumero}>
                                            {tipo.sigla}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative">
                                <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Numero doc </label>
                                <input 
                                    type="number"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20 "
                                    placeholder="1002659847" 
                                />
                            </div>
                            <div className="relative">
                                <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Telefono </label>
                                <input 
                                    type="number"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20" 
                                    placeholder="3224592478"
                                /> 
                            </div>
                            <div className="relative">
                                <label className="absolute left-4 -top-3 bg-blue-100 text-sm font-semibold text-slate-600 z-10">E-mail </label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={actualizarFormularioUsuario}
                                    className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20" 
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-3">
                            <button
                                type="button"
                                onClick={guardarCambiosPerfil}
                                className="cursor-pointer uppercase bg-white px-3 py-1 rounded-l active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#3AD22D,-0.5rem_-0.5rem_#00BCD4] transition"
                            >
                                <span className="inline-block">Editar</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setModalUbicacion(true)}
                                className="cursor-pointer uppercase bg-white px-3 py-1 rounded-l active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#3AD22D,-0.5rem_-0.5rem_#00BCD4] transition"
                            >
                                <span className="inline-block">Direcciónes 🡪</span>
                            </button>
                        </div>
                    </div>
                </div>

                {modalUbicacion && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="relative bg-blue-100 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                            
                            <header className="px-6 py-4 border-b bg-blue-200 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800 flex">
                                    Direcciones
                                </h3>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setModalUbicacion(false)}
                                        className="bg-blue-100 rounded-xl px-2 py-1 text-2xl  hover:bg-red-200 hover:text-black flex items-center justify-center"
                                    >
                                        ⛌
                                    </button>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-6">
                                {desplegarDireccion && (
                                    <div className="mb-6 border-b-2 border-slate-200 pb-6">
                                        <h4 className="text-lg font-bold text-gray-700 mb-4">Nueva dirección</h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Nombre de destinatario</label>
                                            <input 
                                                type="text" 
                                                name="nombre_destinatario"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.nombre_destinatario}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: Juan Pérez"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Direccion </label>
                                            <input 
                                                type="text" 
                                                name="direccion"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.direccion}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: Calle 123 #45-67"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Residencia</label>
                                            <input 
                                                type="text" 
                                                name="residencia"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.residencia}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: Apto 401, Conjunto Los Pinos"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Barrio</label>
                                            <input 
                                                type="text" 
                                                name="barrio"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.barrio}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: El Poblado"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Ciudad</label>
                                            <input 
                                                type="text" 
                                                name="ciudad"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.ciudad}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: Medellín"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Departamento</label>
                                            <input 
                                                type="text" 
                                                name="departamento"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.departamento}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: Antioquia"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Pais</label>
                                            <input 
                                                type="text" 
                                                name="pais"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.pais}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: Colombia"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="absolute left-4 -top-3 bg-blue-100 px-2 text-sm font-semibold text-slate-600 z-10">Codigo postal</label>
                                            <input 
                                                type="number" 
                                                name="codigo_postal"
                                                onChange={actualizarFormularioDireccion}
                                                value={formDirecciones.codigo_postal}
                                                className="w-full rounded-xl border border-slate-400 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                                                placeholder="Ej: 050022"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                                <input 
                                                    type="checkbox" 
                                                    name="principal"
                                                    id="principal_check"
                                                    onChange={actualizarFormularioDireccion}
                                                    checked={formDirecciones.principal}
                                                    className="w-5 h-5 text-green-600 bg-white border-slate-400 rounded focus:ring-green-600 focus:ring-2"
                                                />
                                                <label htmlFor="principal_check" className="text-sm font-semibold text-slate-600 cursor-pointer">
                                                    ¿Es tu dirección principal?
                                                </label>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={cerrarFormulario}
                                                className="cursor-pointer uppercase bg-white px-3 py-1 rounded-l active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#3AD22D,-0.5rem_-0.5rem_#00BCD4] transition"
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    {listaDirecciones.length === 0 ? (
                                        <p className="text-center text-slate-500">No tienes direcciones guardadas.</p>
                                    ) : (
                                        listaDirecciones.map((dir) => (
                                            <div key={dir.iddireccion} className="bg-white p-4 rounded-xl shadow border border-slate-200 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-800">{dir.nombre_destinatario}</p>
                                                    <p className="text-sm text-gray-600">{dir.direccion}, {dir.ciudad}, {dir.departamento}</p>
                                                    <p className="text-sm text-gray-600"><span className="text-gray-800 font-bold">Barrio:</span>  {dir.barrio}, {dir.codigo_postal} </p>
                                                    {dir.principal && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded mt-1 inline-block">Principal</span>}
                                                </div>
                                                <div className="flex flex-col gap-2 items-end">
                                                    <button onClick={() => editarDireccion(dir)} className="text-blue-600 hover:underline text-sm font-bold">
                                                        Editar
                                                    </button>
                                                    <button onClick={() => borrarDireccion(dir.iddireccion)} className="text-red-600 hover:underline text-sm font-bold">
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            
                            <footer className="px-6 py-4 border-t border-gray-200 bg-blue-200 flex justify-end gap-2">
                                <button 
                                    type="button" 
                                    onClick={guardarNuevaDireccion}
                                    className="cursor-pointer uppercase bg-white px-3 py-1 rounded-l active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#3AD22D,-0.5rem_-0.5rem_#00BCD4] transition"
                                >
                                    Guardar
                                </button>
                                
                                <button 
                                    type="button" 
                                    onClick={nuevadDireccion}
                                    className="cursor-pointer uppercase bg-white px-3 py-1 rounded-l active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#3AD22D,-0.5rem_-0.5rem_#00BCD4] transition"
                                >
                                    Nueva
                                </button>
                            </footer>
                        </div>
                        
                    </div>
                )}

            </main>
            <Footer />
        </div>
    )
}

export default Perfil;