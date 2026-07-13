import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ModalMensaje from "../components/ModalMensajes";

import { postUsuario } from "./services/Login.service";

function Login(){
    const [mostrarModal, SetMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");

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
                navigate('/');
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
        <div className="min-h-screen flex items-center justify-center from-green-50 to-gray-100 p-4 font-sans">
            <div className="bg-gray-100 w-full max-w-md p-8 rounded-2xl shadow-xl border border-green-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">
                        Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">Dress shopy </span>
                    </h1>
                    <p className="text-black mt-2 text-sm">Ingresa a tu cuenta para continuar.</p>
                </div>
                <form onSubmit={handleSubmit} className="apace-y-6">
                    {mostrarModal && (
                        <ModalMensaje 
                            abierto={mostrarModal}
                            mensaje={mensaje}
                            tipo={tipo}
                        />
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1"> Correo electronico</label>
                        <input 
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white" 
                            placeholder="Correo@gmail.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-black mb-1">Contraseña</label>
                        <input 
                            type="password"
                            name="password_hash"
                            onChange={handleChange} 
                            value={formData.password_hash}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg.white"
                            placeholder="*********"
                        />

                    </div>
                    <div className="pt-4 mt-3">
                        <button 
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                    <div>
                        <p className="text-black text-[14px] mt-8">
                            No tienes cuenta registrate <span className="text-[14px] text-blue-500"><Link to="/registro" >aquí →</Link> </span>
                            
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;