import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ModalMensaje from "../components/ModalMensajes";
import { useAuth } from "../context/AuthContext";

import { postUsuario } from "./services/Login.service";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "../components/Icons";
import { InputIcono } from "../components/CamposConIcono";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import AuthLayout from "../components/AuthLayout";

function Login(){
    const { login } = useAuth();
    const [mostrarModal, SetMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const navigate = useNavigate();
    const [formData, setFormDat] = useState({
        email: "",
        password: ""
    });


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDat ({
            ...formData,
            [name] : value
        });  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const respuesta = await postUsuario(formData);

            // Guadamos los token en el navegador para poder mantener la sesion

            login(respuesta)

            setMensaje("Inicio de sesión exitoso.\n¡Bienvenido! al sistema");
            setTipo("success");
            SetMostrarModal(true);

            // Redireccionamos a la pagina principal 
            setTimeout(() => {
                SetMostrarModal(false);
                navigate('/home');
            },1000);
        }catch{
            setMensaje("Usuario o contraseña incorrectos");
            setTipo("error");
            SetMostrarModal(true);

            setTimeout(() => {
                SetMostrarModal(false);
            },1000);
        }
    }


    return (
        <AuthLayout>
            <Card className="gap-0 border-white/80 bg-white/90 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur sm:p-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Bienvenido de vuelta</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Ingresa a tu cuenta para continuar.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo</Label>
                        <InputIcono
                            icon={MailIcon}
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <InputIcono
                            icon={LockIcon}
                            type={mostrarPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            accion={
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    className="text-muted-foreground"
                                >
                                    {mostrarPassword ? <EyeOffIcon className="size-4"/> : <EyeIcon className="size-4"/>}
                                </Button>
                            }
                        />
                    </div>
                    <div className="-mt-2 flex justify-end">
                        <Link
                            to='/olvideContraseña'
                            className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button type="submit" size="lg" className="mt-2 w-full hover:bg-emerald-700">
                        Iniciar sesión
                    </Button>
                </form>
            </Card>

            {mostrarModal && (
                <ModalMensaje
                    abierto={mostrarModal}
                    mensaje={mensaje}
                    tipo={tipo}
                />
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link to="/registro" className="font-semibold text-emerald-700 underline-offset-4 hover:underline">
                    Regístrate
                </Link>
            </p>
        </AuthLayout>
    );
}

export default Login;
