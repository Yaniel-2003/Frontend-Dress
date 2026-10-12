import { useState } from "react";
import { useCarrito } from "@/context/CarritoContext";
import { VestidoIcono } from "@/components/Logo";

import { Link } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { PercentIcon, ChevronRightIcon } from "../../components/Icons";

// Foto de cabecera del panel (public/imgDress), copia optimizada de 1200px; el original está al lado.
const FOTO_CARRITO = "/imgDress/imgcmisasnegras-1200.jpg";


function MiCarrito(){
    const { miCarrito } = useCarrito();

    // Valores derivados solo para mostrar en el resumen
    const total = miCarrito.reduce((acumulador, item) => {
        const { precio_con_descuento_activo, precio_final } = item.vararticulo;
        const hayDescuento = precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final);
        return acumulador + Number(hayDescuento ? precio_con_descuento_activo : precio_final) * item.cantidad;
    }, 0);
    const unidades = miCarrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* ───── Cabecera con foto del perchero ───── */}
            <header className="relative isolate shrink-0 overflow-hidden px-6 pt-24 pb-5">
                <img
                    src={FOTO_CARRITO}
                    alt=""
                    width={1200}
                    height={800}
                    className="absolute inset-0 -z-20 size-full object-cover object-[50%_35%]"
                />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-lienzo via-lienzo/75 to-lienzo/10" />
                <SheetClose
                    aria-label="Cerrar mi carrito"
                    className="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-lienzo/70 text-tinta ring-1 ring-tinta/20 backdrop-blur-md transition-colors hover:bg-lienzo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                    <X className="size-4" aria-hidden="true" />
                </SheetClose>
                <SheetTitle className="font-display text-3xl leading-tight font-normal text-tinta">
                    Mis artículos
                </SheetTitle>
                <SheetDescription className="mt-2 text-sm text-tinta/70">
                    {unidades} {unidades === 1 ? "unidad" : "unidades"} en tu carrito
                </SheetDescription>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-4 [scrollbar-color:rgb(244_239_230/0.2)_transparent]">
                {miCarrito.length === 0 ? (
                    <div className="mx-2 mt-6 flex flex-col items-center gap-3 border-y border-tinta/10 py-14 text-center">
                        <span className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-esmeralda/25 to-azul/25 text-emerald-700 ring-1 ring-esmeralda/30">
                            <ShoppingCart className="size-5" aria-hidden="true" />
                        </span>
                        <p className="font-medium">Tu carrito está vacío</p>
                        <p className="text-sm text-tinta/60">Agrega prendas desde la colección y aparecerán aquí.</p>
                        <SheetClose asChild>
                            <Link to="/home" className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-emerald-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                                Ver la colección
                                <ChevronRightIcon className="size-4" aria-hidden="true" />
                            </Link>
                        </SheetClose>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {miCarrito.map((carrito) => (
                            <FilaCarrito
                                key={carrito.iditmcarrito}
                                carrito={carrito}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {miCarrito.length > 0 && (
                <footer className="shrink-0 border-t border-tinta/10 bg-superficie px-6 pt-5 pb-6">
                    <div className="flex items-end justify-between">
                        <span className="text-sm text-tinta/60">Total</span>
                        <span className="text-3xl font-semibold tracking-tight tabular-nums">$ {Number(total).toLocaleString()}</span>
                    </div>
                    <SheetClose asChild>
                        <Button asChild size="lg" className="mt-4 h-12 w-full bg-linear-to-r from-esmeralda to-azul text-base font-semibold text-tinta hover:brightness-110 focus-visible:ring-esmeralda/50">
                            <Link to="/carrito">
                                Ver carrito completo
                                <ChevronRightIcon className="size-5" aria-hidden="true" />
                            </Link>
                        </Button>
                    </SheetClose>
                </footer>
            )}
        </div>
    )
}

function FilaCarrito({ carrito }){
    const { articulo: producto, foto, precio_con_descuento_activo, precio_final } = carrito.vararticulo;
    const { color, talla, historial_descuentos } = carrito.vararticulo
    const hayDescuento = precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final);

    return (
        <li className="flex gap-3.5 rounded-2xl bg-superficie p-3 ring-1 ring-tinta/10">
            <div className="relative shrink-0">
                <FotoMini src={foto} alt={producto.nombre} />
                <span className="absolute -top-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-esmeralda px-1.5 text-[11px] font-bold text-tinta tabular-nums ring-2 ring-superficie" aria-label={`${carrito.cantidad} unidades`}>
                    {carrito.cantidad}
                </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs text-tinta/60">{producto.marca.nombre}</p>
                <p className="truncate text-sm font-medium">{producto.nombre}</p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-tinta/8 px-2.5 py-0.5 text-[11px] text-tinta/80 ring-1 ring-tinta/10">
                        Talla {talla.codigo}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-tinta/8 px-2.5 py-0.5 text-[11px] text-tinta/80 ring-1 ring-tinta/10">
                        <span className="size-2.5 rounded-full ring-1 ring-tinta/30" style={{ backgroundColor: color.hex_code }} aria-hidden="true" />
                        {color.nombre}
                    </span>
                </div>

                {historial_descuentos.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {historial_descuentos.map((h) => (
                            <span
                                key={h.idartdescuento}
                                className="inline-flex items-center gap-1 rounded-full bg-sky-400/10 px-2.5 py-0.5 text-[11px] text-sky-700 ring-1 ring-sky-400/25 tabular-nums"
                            >
                                <PercentIcon className="size-3" aria-hidden="true" />
                                Quedan {h.cantidad_restante}/{h.cantidad_inicial}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-baseline justify-end gap-2 pt-2">
                    {hayDescuento ? (
                        <>
                            <span className="text-xs text-tinta/60 tabular-nums line-through">$ {Number(precio_final).toLocaleString()}</span>
                            <span className="text-base font-semibold text-emerald-700 tabular-nums">$ {Number(precio_con_descuento_activo).toLocaleString()}</span>
                        </>
                    ):(
                        <span className="text-base font-semibold tabular-nums">$ {Number(precio_final).toLocaleString()}</span>
                    )}
                </div>
            </div>
        </li>
    )
}

// Miniatura con respaldo: si la foto no carga, muestra la silueta de la marca (solo visual)
function FotoMini({ src, alt }){
    const [fallo, setFallo] = useState(false);
    const clase = "h-[110px] w-[88px] rounded-xl bg-tinta/5 ring-1 ring-tinta/10";
    if (!src || fallo) {
        return (
            <div role="img" aria-label={alt} className={`flex items-center justify-center ${clase}`}>
                <VestidoIcono className="size-8 text-tinta/60 [&_path:last-child]:stroke-current" />
            </div>
        );
    }
    return <img src={src} alt={alt} width={88} height={110} onError={() => setFallo(true)} className={`object-cover ${clase}`} />;
}

export default MiCarrito;
