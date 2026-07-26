import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ModalMensaje from "../components/ModalMensajes";

import { postUsuario } from "./services/Login.service";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "../components/Icons";

function Login(){
    const [mostrarModal, SetMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const navigate = useNavigate();
    const [formData, setFormDat] = useState({
        email: "",
        password_hash: ""
    });
    const [error, setError] = useState("");


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDat ({
            ...formData,
            [name] : value
        });  
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const respuesta = await postUsuario(formData);

            // Guadamos los token en el navegador para poder mantener la sesion

            localStorage.setItem('access_token', respuesta.access);
            localStorage.setItem('refresh_token', respuesta.refresh);

            // Guardamos los datos del usuario 

            localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

            setMensaje("Inicio de sesión exitoso.\n¡Bienvenido! al sistema");
            setTipo("success");
            SetMostrarModal(true);

            // Redireccionamos a la pagina principal 
            setTimeout(() => {
                SetMostrarModal(false);
                navigate('/home');
            },1000);
        }catch(err){
            setMensaje("Usuario o contraseña incorrectos");
            setTipo("error");
            SetMostrarModal(true);

            setTimeout(() => {
                SetMostrarModal(false);
            },1000);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 p-4 sm:p-6 md:p-8 font-sans">
            <div className="w-full max-w-[420px] rounded-xl shadow-2xl overflow-hidden z-[100] relative snap-start shrink-0 p-6 sm:py-8 sm:pl-8 sm:pr-14 bg-white flex flex-col items-center justify-center gap-3 transition-all duration-300 border border-green-100">
                
                <p className="hidden sm:block text-green-600/15 hover:text-green-600/40 translate-x-[46%] -rotate-90 tracking-[15px] transition-all duration-500 -translate-y-1/2 font-semibold text-5xl absolute right-0 top-1/2 select-none cursor-default">
                    Bienvenido
                </p>

                <div className="w-full z-10 relative">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight pb-1 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                        Dress shopy
                    </h1>
                    <p className="text-sm text-gray-500 pb-8">Ingresa a tu cuenta para continuar.</p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                        {mostrarModal && (
                            <div className="absolute top-0 left-0 w-full z-50">
                                <ModalMensaje 
                                    abierto={mostrarModal}
                                    mensaje={mensaje}
                                    tipo={tipo}
                                />
                            </div>
                        )}

                        <div className="flex flex-col items-start w-full relative">
                            <label htmlFor="email" className="text-sm text-green-800 font-bold flex items-center gap-1">
                                <MailIcon className="w-4 h-4"/> Correo
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="correo@ejemplo.com"
                                className="w-full py-2 pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors"
                            />
                        </div>

                        <div className="flex flex-col items-start w-full relative">
                            <label htmlFor="password_hash" className="text-sm text-green-800 font-bold flex items-center gap-1">
                                <LockIcon className="w-4 h-4"/> Contraseña
                            </label>
                            <div className="relative w-full">
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    name="password_hash"
                                    id="password_hash"
                                    value={formData.password_hash}
                                    onChange={handleChange}
                                    required
                                    placeholder="********"
                                    className="w-full py-2 pl-0 pr-8 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-green-300 focus:border-green-600 placeholder:text-gray-400 text-gray-800 placeholder:text-sm transition-colors"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors focus:outline-none"
                                >
                                    {mostrarPassword ? <EyeOffIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-start w-full mt-2">
                            <p className="text-gray-700 text-[13px]">
                                No tienes cuenta registrate <span className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"><Link to="/registro" >aquí →</Link> </span>
                            </p>
                        </div>

                        <div className="mt-4 w-full">
                            <button
                                type="submit"
                                className="w-full px-2 focus:outline-none focus:scale-105 font-bold text-sm py-3 rounded-lg hover:scale-105 transition-all text-white bg-green-600 shadow-green-600/30 shadow-lg text-center"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;