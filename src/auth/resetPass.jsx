import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import ModalMensaje from "../components/ModalMensajes";

import { restablecerPass } from "./services/Login.service";
import { LockIcon, EyeIcon, EyeOffIcon, ChevronLeftIcon } from "../components/Icons";
import { InputIcono } from "../components/CamposConIcono";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import AuthLayout from "../components/AuthLayout";


function ResetPassword(){
    const navigate = useNavigate();
    const [buscarParametros] = useSearchParams();
    const uid = buscarParametros.get("uid");
    const token = buscarParametros.get("token");

    const [mostrarModal, SetMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const [dataReset, setDataReset] = useState({
        new_password: "",
        confirmar: ""
    });

    const mostrarMensaje = (texto, tipoMensaje, ms) => {
        setMensaje(texto);
        setTipo(tipoMensaje);
        SetMostrarModal(true);

        setTimeout(() => {
            SetMostrarModal(false);
        }, ms);
    };

    const handleChange = async (e) => {
        const { name, value} = e.target;

        setDataReset({
            ...dataReset,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!uid || !token){
            mostrarMensaje("El enlace no es válido. Solicita uno nuevo.", "error", 3000);
            return;
        }

        if(dataReset.new_password !== dataReset.confirmar){
            mostrarMensaje("Las contraseñas no coinciden.", "error", 2500);
            return;
        }

        try{
            await restablecerPass({ uid, token, new_password: dataReset.new_password });
            mostrarMensaje("Contraseña actualizada correctamente. Ya puedes iniciar sesión.", "success", 3000);

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        }catch{
            mostrarMensaje("No se pudo cambiar la contraseña. El enlace pudo expirar o la contraseña es muy débil.", "error", 4000);
        }
    }

    const botonOjo = (
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
    );

    const enlaceInvalido = !uid || !token;

    return (
        <AuthLayout
            titulo={<>Crea una nueva<br />contraseña.</>}
            texto="Elige una contraseña segura que no uses en otros sitios. Después podrás iniciar sesión con ella."
        >
            <Card className="gap-0 border-white/80 bg-white/90 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur sm:p-10">
                {enlaceInvalido ? (
                    <div>
                        <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-red-50 text-destructive">
                            <LockIcon className="size-5" />
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight">Enlace no válido</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Este enlace está incompleto o ya expiró. Solicita uno nuevo para restablecer tu contraseña.
                        </p>
                        <Button asChild size="lg" className="mt-8 w-full hover:bg-emerald-700">
                            <Link to="/olvideContraseña">Solicitar nuevo enlace</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <LockIcon className="size-5" />
                            </span>
                            <h1 className="text-3xl font-bold tracking-tight">Nueva contraseña</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Escríbela dos veces para confirmar que es correcta.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="new_password">Nueva contraseña</Label>
                                <InputIcono
                                    icon={LockIcon}
                                    type={mostrarPassword ? "text" : "password"}
                                    name="new_password"
                                    id="new_password"
                                    value={dataReset.new_password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    accion={botonOjo}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Mínimo 8 caracteres. Evita claves muy comunes o solo números.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="confirmar">Confirmar contraseña</Label>
                                <InputIcono
                                    icon={LockIcon}
                                    type={mostrarPassword ? "text" : "password"}
                                    name="confirmar"
                                    id="confirmar"
                                    value={dataReset.confirmar}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button type="submit" size="lg" className="mt-2 w-full hover:bg-emerald-700">
                                Cambiar contraseña
                            </Button>
                        </form>
                    </>
                )}
            </Card>

            {mostrarModal && (
                <ModalMensaje
                    abierto={mostrarModal}
                    mensaje={mensaje}
                    tipo={tipo}
                />
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 underline-offset-4 hover:underline"
                >
                    <ChevronLeftIcon className="size-4" />
                    Volver a iniciar sesión
                </Link>
            </p>
        </AuthLayout>
    )
}

export default ResetPassword;