import { useState } from "react";
import { registrarNuevoUsuario } from './services/Registro.service';
import { getTipoDoc } from "../services/catalogo.service";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-gray-100 p-4 font-sans">
            <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-xl border border-pink-50">
                <div className="text-center mb-8">
                   <Link
                        to="/login"
                        className="absolute top-6 left-6 font-sans flex justify-center gap-2 items-center shadow-xl text-sm text-gray-50 bg-gradient-to-r from-green-500 from-50%  to-blue-500 to-100% backdrop-blur-md font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-900 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-white hover:text-black before:-z-10 before:aspect-square before:hover:scale-200 before:hover:duration-500 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group w-fit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 19"
                            className="w-6 h-6 justify-end bg-gray-50 group-hover:-rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-gray-700 p-1.5 -rotate-90"
                        >
                            <path
                                className="fill-gray-800 group-hover:fill-gray-800"
                                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                            ></path>
                        </svg>
                        Volver
                    </Link>
                    
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        Únete a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">Dress Shopy</span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Crea tu cuenta y descubre las mejores colecciones.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                            <input type="text" name="nombres" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white" placeholder="Tus nombres" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Apellidos</label>
                            <input type="text" name="apellidos" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white" placeholder="Tus apellidos" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo documento</label>
                            <div className="relative">
                                <select name="documento" id="documento" onChange={handleChange} value={formData.documento} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white appearance-none cursor-pointer">
                                    <option value="" disabled>Seleccione un tipo ...</option>
                                    {tiposDocumento.map((tipo) => (
                                        <option key={tipo.idnumero} value={tipo.idnumero}>
                                            {tipo.sigla}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Número documento</label>
                            <input type="text" name="numero" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white" placeholder="Ej: 1023456789" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                            <input type="text" name="telefono" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white" placeholder="Tu número de contacto" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                            <input type="email" name="email" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white" placeholder="correo@ejemplo.com" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                        <input type="password" name="password_hash" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none text-gray-700 bg-gray-50 hover:bg-white" placeholder="Crea una contraseña segura" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Crear cuenta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registro;