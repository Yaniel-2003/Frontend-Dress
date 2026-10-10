import { useCarrito } from "@/context/CarritoContext";

import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { PercentIcon, ChevronRightIcon } from "../../components/Icons";


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
            <div className="flex h-full min-h-0 flex-col">
                <main className="flex min-h-0 flex-1 flex-col">
                    <div className="border-b border-zinc-100 px-6 pb-4 pt-6 pr-16">
                        <SheetTitle asChild>
                            <h3 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
                                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                                    <ShoppingCart className="size-[18px]" />
                                </span>
                                Mis articulos
                            </h3>
                        </SheetTitle>
                        <SheetDescription className="mt-1.5">
                            {unidades} {unidades === 1 ? "unidad" : "unidades"} en tu carrito
                        </SheetDescription>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-50/70 px-4 py-4">
                        <div className="flex flex-col gap-3">
                            {miCarrito.length === 0 && (
                                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
                                    <span className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                                        <ShoppingCart className="size-5" />
                                    </span>
                                    <p className="font-medium">Tu carrito está vacío</p>
                                    <p className="text-sm text-muted-foreground">Agrega artículos y aparecerán aquí.</p>
                                </div>
                            )}
                            {miCarrito.map((carrito) => (
                                <FilaCarrito
                                    key={carrito.iditmcarrito}
                                    carrito={carrito}
                                />
                            ))}
                        </div>
                    </div>

                </main>

                {miCarrito.length > 0 && (
                    <footer className="border-t border-zinc-200 bg-white px-6 pb-6 pt-5 shadow-[0_-12px_24px_-16px_rgba(9,9,11,0.12)]">
                        <div className="flex items-end justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Total</span>
                            <span className="text-3xl font-bold tracking-tight tabular-nums">$ {Number(total).toLocaleString()}</span>
                        </div>
                        <SheetClose asChild>
                            <Button asChild size="lg" className="mt-4 h-12 w-full text-base hover:bg-emerald-700">
                                <Link to="/carrito">
                                    Ver carrito completo
                                    <ChevronRightIcon className="size-5" />
                                </Link>
                            </Button>
                        </SheetClose>
                    </footer>
                )}
            </div>
        </div>
    )
}

function FilaCarrito({ carrito }){
    const { articulo: producto, foto, precio_con_descuento_activo, precio_final } = carrito.vararticulo;
    const { color, talla, historial_descuentos } = carrito.vararticulo
    const hayDescuento = precio_con_descuento_activo && Number(precio_con_descuento_activo) < Number(precio_final);

    return (
        <div className="flex gap-3.5 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="relative shrink-0">
                <img
                    src={foto}
                    alt={producto.nombre}
                    className="size-20 rounded-xl border border-zinc-200 bg-zinc-100 object-cover"
                />
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-950 px-1.5 text-xs font-bold text-white ring-2 ring-white">
                    {carrito.cantidad}
                </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs font-medium text-muted-foreground">{producto.marca.nombre}</p>
                <p className="truncate text-sm font-semibold tracking-tight">{producto.nombre}</p>

                <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="px-2 py-0.5 text-[11px]">
                        Talla {talla.codigo}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5 px-2 py-0.5 text-[11px]">
                        <span className="size-2.5 rounded-full border border-zinc-300" style={{ backgroundColor: color.hex_code }} />
                        {color.nombre}
                    </Badge>
                </div>

                {historial_descuentos.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {historial_descuentos.map((h) => (
                            <Badge
                                key={h.idartdescuento}
                                variant="outline"
                                className="gap-1 border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700"
                            >
                                <PercentIcon className="size-3" />
                                Quedan {h.cantidad_restante}/{h.cantidad_inicial}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-baseline justify-end gap-2 pt-2">
                    {hayDescuento ? (
                        <>
                            <span className="text-xs tabular-nums text-zinc-400 line-through">$ {Number(precio_final).toLocaleString()}</span>
                            <span className="text-base font-bold tracking-tight tabular-nums text-emerald-700">$ {Number(precio_con_descuento_activo).toLocaleString()}</span>
                        </>
                    ):(
                        <span className="text-base font-bold tracking-tight tabular-nums">$ {Number(precio_final).toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MiCarrito;
