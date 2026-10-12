import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CircleAlert, LoaderCircle } from "lucide-react";
import ModalMensaje from "../components/ModalMensajes";
import { useAuth } from "../context/AuthContext";

import { postUsuario } from "./services/Login.service";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "../components/Icons";
import { InputIcono } from "../components/CamposConIcono";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import AuthLayout from "../components/AuthLayout";

// Enlaces de texto con área táctil de 44px sin alterar el diseño
const claseEnlace =
    "-my-3 inline-flex items-center py-3 text-sm font-medium text-emerald-700 underline-offset-4 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function Login(){
    const { login } = useAuth();
    const navigate = useNavigate();
    const emailRef = useRef(null);

    const [formData, setFormDat] = useState({
        email: "",
        password: ""
    });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDat ({
            ...formData,
            [name] : value
        });
        if (error) setError(""); // solo UI: el aviso se oculta al corregir
    };

    // Flujo original intacto (llamada a la API, login() con los tokens, modal de éxito y redirección).
    // Solo se añadieron estados visuales: "enviando" para el botón y el error mostrado en línea.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError("");

        try{
            const respuesta = await postUsuario(formData);

            // Guadamos los token en el navegador para poder mantener la sesion

            login(respuesta)

            setMostrarModal(true);

            // Redireccionamos a la pagina principal 
            setTimeout(() => {
                setMostrarModal(false);
                navigate('/home');
            },1000);
        }catch{
            setError("Correo o contraseña incorrectos. Revísalos e inténtalo de nuevo.");
            setEnviando(false);
            emailRef.current?.focus();
        }
    }

    const campoInvalido = error ? true : undefined;

    return (
        <AuthLayout>
            <Card className="gap-0 border-0 bg-transparent p-0 shadow-none sm:border sm:bg-card sm:p-10 sm:shadow-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-balance">Inicia sesión</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Ingresa con tu correo y contraseña.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo</Label>
                        <InputIcono
                            icon={MailIcon}
                            type="email"
                            name="email"
                            id="email"
                            ref={emailRef}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="correo@ejemplo.com"
                            aria-invalid={campoInvalido}
                            aria-describedby={error ? "login-error" : undefined}
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-baseline justify-between gap-4">
                            <Label htmlFor="password">Contraseña</Label>
                            <Link to="/olvideContraseña" className={claseEnlace}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <InputIcono
                            icon={LockIcon}
                            type={mostrarPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            placeholder="Tu contraseña…"
                            aria-invalid={campoInvalido}
                            aria-describedby={error ? "login-error" : undefined}
                            accion={
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-lg"
                                    onClick={() => setMostrarPassword((v) => !v)}
                                    aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    aria-pressed={mostrarPassword}
                                    className="-mr-1 rounded-lg text-muted-foreground hover:text-foreground"
                                >
                                    {mostrarPassword ? <EyeOffIcon className="size-[18px]"/> : <EyeIcon className="size-[18px]"/>}
                                </Button>
                            }
                        />
                    </div>

                    {error && (
                        <div
                            id="login-error"
                            role="alert"
                            className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
                        >
                            <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
                            <p>{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="lg"
                        disabled={enviando}
                        aria-busy={enviando}
                        className="mt-1 w-full hover:bg-emerald-700 disabled:opacity-80"
                    >
                        {enviando && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                        {enviando ? "Iniciando sesión…" : "Iniciar sesión"}
                    </Button>
                </form>

                <p className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
                    ¿No tienes cuenta?{" "}
                    <Link to="/registro" className={`${claseEnlace} font-semibold`}>
                        Regístrate
                    </Link>
                </p>
            </Card>

            {mostrarModal && (
                <ModalMensaje
                    abierto={mostrarModal}
                    mensaje={"Inicio de sesión exitoso.\n¡Bienvenido! al sistema"}
                    tipo="success"
                />
            )}
        </AuthLayout>
    );
}

export default Login;
