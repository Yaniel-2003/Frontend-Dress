import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ModalMensaje from "../components/ModalMensajes";

import { olvidoPasss } from "./services/Login.service";
import { MailIcon, LockIcon, ChevronLeftIcon } from "../components/Icons";
import { InputIcono } from "../components/CamposConIcono";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import AuthLayout from "../components/AuthLayout";

function ForgotPassword(){
    const [mostrarModal, SetMostrarModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [tipo, setTipo] = useState("");
    const navigate = useNavigate();

    const [formData, setFormdata] = useState({
        email: "",
    });

    const handleChange  = (e) => {
        const { name, value } = e.target;

        setFormdata({
            ...formData,
            [name]: value
        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await olvidoPasss(formData.email);

            setMensaje("Si el correo existe, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.");
            setTipo("success");
            SetMostrarModal(true);

            setTimeout(() => {
                SetMostrarModal(false);
                navigate('/login');
            },6000);

        }catch{
            setMensaje("No se pudo enviar la solicitud. Intenta de nuevo en unos minutos.");
            setTipo("error");
            SetMostrarModal(true);

            setTimeout(() => {
                SetMostrarModal(false);
            },2500);
        }
    }


    return (
        <AuthLayout
            titulo={<>Recupera el acceso<br />a tu cuenta.</>}
            texto="Te enviaremos un enlace seguro a tu correo para que puedas crear una nueva contraseña."
        >
            <Card className="gap-0 border-white/80 bg-white/90 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur sm:p-10">
                <div className="mb-8">
                    <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <LockIcon className="size-5" />
                    </span>
                    <h1 className="text-3xl font-bold tracking-tight">¿Olvidaste tu contraseña?</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        No te preocupes. Ingresa el correo de tu cuenta y te enviaremos las instrucciones para restablecerla.
                    </p>
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

                    <Button type="submit" size="lg" className="mt-2 w-full hover:bg-emerald-700">
                        Enviar enlace
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

export default ForgotPassword;