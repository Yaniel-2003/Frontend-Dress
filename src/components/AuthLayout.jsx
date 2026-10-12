import { useState } from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

// Foto editorial del panel (public/imgDress). Se sirve la copia optimizada de 1400px;
// el original está al lado. Va en lazy: en móvil el panel está oculto y no se descarga.
// Si la foto falta, el panel se queda tipográfico.
const FOTO_COLECCION = "/imgDress/imglogin-1400.jpg";

/* Componente visual puro: marco compartido por las pantallas de acceso.
   Escritorio: panel editorial a la izquierda + contenido a la derecha.
   Móvil: solo el contenido, alineado arriba para que el teclado no tape el formulario.
   En el DOM el contenido va primero, así lectores de pantalla y teclado llegan directo al formulario. */
function AuthLayout({
    children,
    anchoContenido = "max-w-md",
    titulo = <>Prendas elegidas,<br />una a una.</>,
    texto = "Inicia sesión para ver la colección, guardar tus datos de envío y seguir tus pedidos.",
}) {
    const [hayFoto, setHayFoto] = useState(true);

    return (
        <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* ───── Contenido ───── */}
            <main className="flex min-h-dvh flex-col px-5 pt-8 pb-10 sm:px-8 sm:pt-12 md:justify-center md:py-12 lg:col-start-2 lg:row-start-1">
                <div className={cn("mx-auto w-full", anchoContenido)}>
                    <Logo className="mb-10 lg:hidden" />

                    {children}
                </div>
            </main>

            {/* ───── Panel editorial (solo escritorio) ───── */}
            <aside className="hidden lg:col-start-1 lg:row-start-1 lg:block lg:p-3">
                <div className="sticky top-3 isolate flex h-[calc(100dvh-1.5rem)] min-h-[34rem] flex-col justify-between overflow-hidden rounded-2xl bg-zinc-950 p-10 text-white xl:p-12">
                    {hayFoto && (
                        <>
                            <img
                                src={FOTO_COLECCION}
                                alt=""
                                width={1400}
                                height={1972}
                                loading="lazy"
                                decoding="async"
                                onError={() => setHayFoto(false)}
                                className="absolute inset-0 -z-10 size-full object-cover object-top"
                            />
                            {/* velo para que el texto se lea sobre cualquier foto */}
                            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-zinc-950/85 via-zinc-950/15 to-zinc-950/55" />
                        </>
                    )}

                    <Logo claro />

                    <div className="max-w-md">
                        <h2 className="font-display text-5xl leading-[1.04] font-normal tracking-[-0.02em] text-balance xl:text-6xl">
                            {titulo}
                        </h2>
                        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/75">{texto}</p>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default AuthLayout;
