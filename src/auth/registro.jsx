import { useState, useEffect } from "react";
import { registrarNuevoUsuario } from './services/Registro.service';
import { getTipoDoc } from "../services/catalogo.service";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, ChevronLeftIcon, UserIcon, IdCardIcon, PhoneIcon, MailIcon, LockIcon } from "../components/Icons";
import { InputIcono, SelectIcono } from "../components/CamposConIcono";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import AuthLayout from "../components/AuthLayout";

function Registro(){
    const navigate = useNavigate();
    const [formData, setFormDat] = useState({
        documento: "",
        email: "",
        password: "",
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
                is_active: true
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
        <AuthLayout
            anchoContenido="max-w-2xl"
            titulo={<>Crea tu cuenta<br />y estrena estilo.</>}
            texto="Regístrate en minutos para comprar, guardar tus datos de envío y seguir tus pedidos."
        >
            <Link
                to="/login"
                className="group mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <ChevronLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
                Volver al inicio de sesión
            </Link>

            <Card className="gap-0 border-white/80 bg-white/90 p-8 shadow-xl shadow-zinc-900/5 backdrop-blur sm:p-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Únete a Dress Shopy</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Crea tu cuenta y descubre las mejores colecciones.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="nombres">Nombre</Label>
                            <InputIcono icon={UserIcon} id="nombres" type="text" name="nombres" onChange={handleChange} required placeholder="Tus nombres" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="apellidos">Apellidos</Label>
                            <InputIcono icon={UserIcon} id="apellidos" type="text" name="apellidos" onChange={handleChange} required placeholder="Tus apellidos" />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="documento">Tipo de documento</Label>
                            <SelectIcono
                                icon={IdCardIcon}
                                name="documento"
                                id="documento"
                                onChange={handleChange}
                                value={formData.documento}
                                required
                            >
                                <option value="" disabled>Selecciona un tipo</option>
                                {tiposDocumento.map((tipo) => (
                                    <option key={tipo.idnumero} value={tipo.idnumero}>
                                        {tipo.sigla}
                                    </option>
                                ))}
                            </SelectIcono>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="numero">Número de documento</Label>
                            <InputIcono icon={IdCardIcon} id="numero" type="text" name="numero" onChange={handleChange} required placeholder="Ej: 1023456789" />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <InputIcono icon={PhoneIcon} id="telefono" type="text" name="telefono" onChange={handleChange} required placeholder="Tu número de contacto" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <InputIcono icon={MailIcon} id="email" type="email" name="email" onChange={handleChange} required placeholder="correo@ejemplo.com" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <InputIcono
                            icon={LockIcon}
                            id="password"
                            type={mostrarPassword ? "text" : "password"}
                            name="password"
                            onChange={handleChange}
                            required
                            placeholder="Crea una contraseña segura"
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

                    <Button type="submit" size="lg" className="mt-2 w-full hover:bg-emerald-700">
                        Crear cuenta
                    </Button>
                </form>
            </Card>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="font-semibold text-emerald-700 underline-offset-4 hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </AuthLayout>
    );
}

export default Registro;
