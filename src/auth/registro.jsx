import { useState, useEffect } from "react";
import { registrarNuevoUsuario } from './services/Registro.service';
import { getTipoDoc } from "../services/catalogo.service";
import { useNavigate, Link } from "react-router-dom";
import { UserIcon, IdCardIcon, PhoneIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "../components/Icons";

function Registro(){
    const navigate = useNavigate();
    const [formData, setFormDat] = useState({
        documento: "",
        email: "",
        password_hash: "",
        nombres: "",
        apellidos: "",
        numero: "",
        telefono: ""
    });
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    useEffect(() => {
        const cargarDocumentos = async () => {
            try{
                const data = await getTipoDoc();
                setTiposDocumento(data);
            }catch(error){
                console.error("Error al cargar tipos de documento", error)
            }
        };
        cargarDocumentos();
    },[]);

    // FUNCION PARA MANEJAR LOS CAMBIOS EN LOS INPUTS 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDat({
            ...formData,
            [name]: value
        });
    };

    //FUNCION SUBMIT REGISTRARSE
    const handleSubmit = async (e) => {
        e.preventDefault(); //EVITA QUE LA PAGINA SE RECARGUE

        try{
            // ANTES DE ENVIAR PREPARAMOS LOS DATOS 
            const payload = {
                ...formData,
                activo: true
            };

            const respuesta = await registrarNuevoUsuario(payload);
            alert("¡Usuario registrado con éxito!");
            console.log(respuesta)
            navigate('/login');
        }catch(error) {
            alert("Hubo un error al registrar: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 p-4 font-sans">
            <div className="w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden z-[100] relative shrink-0 py-8 px-5 sm:pl-8 sm:pr-16 bg-white flex flex-col gap-3 transition-all duration-300 border border-green-100">
                
                <p className="hidden sm:block text-green-600/15 hover:text-green-600/40 translate-x-[46%] -rotate-90 tracking-[15px] transition-all duration-500 -translate-y-1/2 font-semibold text-5xl absolute right-0 top-1/2 select-none cursor-default">
                    Regístrate
                </p>

                <div className="w-full z-10 relative">
                    <div className="mb-2">
                        <Link
                            to="/login"
                            className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 w-fit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                            Volver
                        </Link>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight pb-1 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                            Únete a Dress Shopy
                        </h1>
                        <p className="text-sm text-gray-500 pb-2">Crea tu cuenta y descubre las mejores colecciones.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-start w-full relative">
                                <label className="text-sm text-green-800 font-bold flex items-center gap-1"><UserIcon className="w-4 h-4" /> Nombre</label>
                                <input type="text" name="nombres" onChange={handleChange} required className="w-full py-2 pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors" placeholder="Tus nombres" />
                            </div>
                            <div className="flex flex-col items-start w-full relative">
                                <label className="text-sm text-green-800 font-bold flex items-center gap-1"><UserIcon className="w-4 h-4" /> Apellidos</label>
                                <input type="text" name="apellidos" onChange={handleChange} required className="w-full py-2 pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors" placeholder="Tus apellidos" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-start w-full relative">
                                <label className="text-sm text-green-800 font-bold flex items-center gap-1"><IdCardIcon className="w-4 h-4" /> Tipo documento</label>
                                <div className="relative w-full">
                                    <select name="documento" id="documento" onChange={handleChange} value={formData.documento} required className="w-full py-2 pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 text-gray-800 transition-colors appearance-none cursor-pointer">
                                        <option value="" disabled className="text-gray-400">Seleccione un tipo ...</option>
                                        {tiposDocumento.map((tipo) => (
                                            <option key={tipo.idnumero} value={tipo.idnumero} className="text-gray-800 bg-white">
                                                {tipo.sigla}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start w-full relative">
                                <label className="text-sm text-green-800 font-bold flex items-center gap-1"><IdCardIcon className="w-4 h-4" /> Número documento</label>
                                <input type="text" name="numero" onChange={handleChange} required className="w-full py-2 pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors" placeholder="Ej: 1023456789" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-start w-full relative">
                                <label className="text-sm text-green-800 font-bold flex items-center gap-1"><PhoneIcon className="w-4 h-4" /> Teléfono</label>
                                <input type="text" name="telefono" onChange={handleChange} required className="w-full py-2 pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors" placeholder="Tu número de contacto" />
                            </div>
                            <div className="flex flex-col items-start w-full relative">
                                <label className="text-sm text-green-800 font-bold flex items-center gap-1"><MailIcon className="w-4 h-4" /> Correo Electrónico</label>
                                <input type="email" name="email" onChange={handleChange} required className="w-full py-2 pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors" placeholder="correo@ejemplo.com" />
                            </div>
                        </div>

                        <div className="flex flex-col items-start w-full relative">
                            <label className="text-sm text-green-800 font-bold flex items-center gap-1"><LockIcon className="w-4 h-4" /> Contraseña</label>
                            <div className="relative w-full">
                                <input type={mostrarPassword ? "text" : "password"} name="password_hash" onChange={handleChange} required className="w-full py-2 pl-0 pr-8 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors" placeholder="Crea una contraseña segura" />
                                <button 
                                    type="button" 
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors focus:outline-none pr-2"
                                >
                                    {mostrarPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-medium bg-green-700 text-white hover:bg-green-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-center">
                                Crear cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registro;