/* Identidad visual de Dress Shopy (componente visual puro).
   Marca: un vestido de línea fina con la cintura en esmeralda, sobre un cuadro negro. */

export function VestidoIcono({ className = "size-5" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {/* tirantes */}
            <path d="M8.6 2.6 9.6 8M15.4 2.6 14.4 8" stroke="currentColor" />
            {/* escote */}
            <path d="M9.6 8c1 1.3 2.1 1.9 2.4 1.9s1.4-.6 2.4-1.9" stroke="currentColor" />
            {/* cuerpo y falda con vuelo */}
            <path d="M9.6 8 10 11 4.6 21M14.4 8 14 11 19.4 21" stroke="currentColor" />
            <path d="M4.6 21c2.3-1.2 4.6-1.2 7.4 0s5.1 1.2 7.4 0" stroke="currentColor" />
            {/* cintura */}
            <path d="M10 11h4" stroke="#34d399" strokeWidth="2.4" />
        </svg>
    );
}

export function LogoMarca({ className = "size-9", claro = false }) {
    return (
        <span
            className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl ${
                claro ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"
            } ${className}`}
        >
            <span className="pointer-events-none absolute -bottom-3 -right-3 size-8 rounded-full bg-blue-500/50 blur-md" />
            <VestidoIcono className="relative size-[62%]" />
        </span>
    );
}

function Logo({ claro = false, className = "" }) {
    return (
        <span className={`flex items-center gap-2.5 ${className}`}>
            <LogoMarca claro={claro} />
            <span className={`text-lg font-semibold tracking-tight ${claro ? "text-white" : ""}`}>
                Dress <span className={claro ? "text-emerald-300" : "text-emerald-600"}>Shopy</span>
            </span>
        </span>
    );
}

export default Logo;
