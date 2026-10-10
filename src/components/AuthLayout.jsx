import Logo from "./Logo";
import { ShoppingBagIcon, RulerIcon, UserIcon } from "./Icons";

// Mensajes que van apareciendo en el panel (solo visual)
const MENSAJES = [
    { icono: ShoppingBagIcon, titulo: "Tu carrito te espera", texto: "Termina tu compra cuando quieras." },
    { icono: RulerIcon, titulo: "Encuentra tu talla", texto: "Filtra por talla, color y marca." },
    { icono: UserIcon, titulo: "Compra más rápido", texto: "Guarda tus datos y direcciones en tu perfil." },
];

/* Componente visual puro: marco compartido por Login y Registro.
   Izquierda: panel de marca (solo escritorio). Derecha: el contenido (children). */
function AuthLayout({
    children,
    anchoContenido = "max-w-md",
    titulo = <>La mejor ropa,<br />a un clic de ti.</>,
    texto = "Entra para ver las ofertas del día, guardar tus favoritos y completar tu pedido sin filas.",
}) {
    return (
        <div className="relative min-h-screen grid lg:grid-cols-[1.05fr_1fr] overflow-hidden bg-background">
            {/* ───── Decoración del fondo (cubre toda la página, así no hay cortes entre columnas) ───── */}
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-emerald-400/20 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-[44%] size-[30rem] rounded-full bg-blue-400/20 blur-3xl" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.5]"
                style={{
                    backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />

            {/* ───── Fondo de marca (solo escritorio) ─────
                Es una capa oscura con máscara: se vuelve transparente poco a poco hacia la derecha,
                así se mezcla directamente con el fondo de la página, sin ningún corte. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[68%] overflow-hidden bg-zinc-950 lg:block"
                style={{
                    maskImage:
                        "linear-gradient(to right, #000 0%, #000 50%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.58) 70%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.1) 90%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to right, #000 0%, #000 50%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.58) 70%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.1) 90%, transparent 100%)",
                }}
            >
                {/* luces de identidad: esmeralda + azul */}
                <div className="absolute -top-32 -left-24 size-[28rem] rounded-full bg-emerald-500/35 blur-3xl" />
                <div className="absolute -bottom-40 left-[30%] size-[30rem] rounded-full bg-blue-600/35 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }}
                />
                <svg
                    viewBox="0 0 200 140"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-[37%] top-[44%] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-white/20"
                >
                    <path d="M100 34c0-8 6-12 12-12 7 0 12 5 12 11 0 7-6 10-12 13l-12 8" />
                    <path d="M100 55 14 108c-5 3-3 11 3 11h166c6 0 8-8 3-11L100 55Z" />
                </svg>
            </div>

            {/* ───── Contenido de marca (solo escritorio) ───── */}
            <aside className="relative z-20 hidden lg:flex flex-col justify-between p-12 pr-24 text-white">
                <Logo claro className="relative" />

                {/* etiquetas flotantes + mensajes que van apareciendo */}
                <div className="relative mx-auto my-10 w-full max-w-sm">
                    <div className="relative h-48">
                        <div className="absolute left-0 top-2 -rotate-6">
                            <div className="animar-flotar rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
                                <span className="mb-3 block size-2 rounded-full bg-white/60" />
                                <p className="text-xs text-white/60">Ofertas especiales</p>
                                <p className="mt-1 text-3xl font-bold tracking-tight">-50%</p>
                            </div>
                        </div>
                        <div className="absolute right-0 top-20 rotate-3">
                            <div className="animar-flotar rounded-2xl border border-emerald-300/25 bg-emerald-400/15 px-5 py-4 backdrop-blur-md" style={{ animationDelay: "-3s" }}>
                                <span className="mb-3 block size-2 rounded-full bg-emerald-300/80" />
                                <p className="text-xs text-emerald-100/70">Nueva colección</p>
                                <p className="mt-1 text-xl font-semibold tracking-tight">Camisas, pantalones y más</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-2 h-[4.25rem]">
                        {MENSAJES.map(({ icono: Icono, titulo, texto }, i) => (
                            <div
                                key={titulo}
                                className="animar-notif absolute inset-0 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 backdrop-blur-md"
                                style={{ animationDelay: `${i * 4}s` }}
                            >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                                    <Icono className="size-[18px]" />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">{titulo}</p>
                                    <p className="truncate text-xs text-white/60">{texto}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative max-w-md">
                    <h2 className="text-4xl font-bold leading-[1.1] tracking-tight">{titulo}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-white/60">{texto}</p>
                </div>
            </aside>

            {/* ───── Contenido ───── */}
            <main className="relative flex items-center justify-center p-4 sm:p-8">
                <div className={`relative w-full ${anchoContenido}`}>
                    <Logo className="mb-8 lg:hidden" />

                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;
