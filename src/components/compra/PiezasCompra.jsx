import { useState } from "react";
import { VestidoIcono } from "../Logo";

/* Piezas visuales compartidas por Carrito y Orden (solo presentación, sin lógica de datos). */

// Banda de foto superior que se funde con la noche
export function BandaFoto({ src, posicion = "object-center", opacidad = "opacity-100" }){
    return (
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-64 overflow-hidden sm:h-72">
            <img src={src} alt="" width={1600} height={1067} className={`size-full object-cover ${posicion} ${opacidad}`} />
            <div className="absolute inset-0 bg-linear-to-b from-lienzo/0 from-0% via-lienzo/45 via-55% to-lienzo to-100%" />
        </div>
    );
}

// Indicador de pasos de la compra: Carrito → Confirmar
export function PasosCompra({ actual }){
    const pasos = ["Carrito", "Confirmar"];
    return (
        <ol className="flex items-center gap-3 text-sm" aria-label="Pasos de la compra">
            {pasos.map((paso, i) => {
                const n = i + 1;
                const hecho = n < actual;
                const activo = n === actual;
                return (
                    <li key={paso} className="flex items-center gap-3" aria-current={activo ? "step" : undefined}>
                        <span className={`flex items-center gap-2 ${activo ? "text-tinta" : hecho ? "text-emerald-700" : "text-tinta/60"}`}>
                            <span className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${activo ? "bg-linear-to-br from-esmeralda to-azul text-tinta" : hecho ? "bg-esmeralda/15 text-emerald-700 ring-1 ring-esmeralda/40" : "ring-1 ring-tinta/25"}`}>
                                {hecho ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="size-3" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                ) : n}
                            </span>
                            {paso}
                        </span>
                        {i < pasos.length - 1 && <span aria-hidden="true" className={`h-px w-10 ${hecho ? "bg-esmeralda/60" : "bg-tinta/20"}`} />}
                    </li>
                );
            })}
        </ol>
    );
}

// Foto de producto con respaldo de silueta si no carga
export function FotoProducto({ src, alt, className = "", width = 400, height = 500 }){
    const [fallo, setFallo] = useState(false);
    if (!src || fallo) {
        return (
            <div role="img" aria-label={alt} className={`flex items-center justify-center bg-tinta/5 ring-1 ring-tinta/10 ${className}`}>
                <VestidoIcono className="size-1/3 text-tinta/60 [&_path:last-child]:stroke-current" />
            </div>
        );
    }
    return <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" onError={() => setFallo(true)} className={`bg-tinta/5 object-cover ring-1 ring-tinta/10 ${className}`} />;
}

// Clase del botón principal con la identidad esmeralda → azul
export const claseBotonIdentidad =
    "bg-linear-to-r from-esmeralda to-azul font-semibold text-tinta hover:brightness-110 focus-visible:ring-esmeralda/50 disabled:opacity-50";
