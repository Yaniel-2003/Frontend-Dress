import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* Componentes visuales puros: input / select con icono identificativo a la izquierda.
   Reciben exactamente las mismas props que un <input> / <select> normal. */

const claseIconoBase = "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 transition-colors";

// tono "claro" (por defecto): páginas de día · tono "noche": superficies de la vitrina nocturna (foco esmeralda)
const TONOS_ICONO = {
    claro: "text-zinc-400 group-focus-within:text-emerald-600",
    noche: "text-tinta/60 group-focus-within:text-emerald-700",
};
const claseIcono = (tono) => cn(claseIconoBase, TONOS_ICONO[tono] ?? TONOS_ICONO.claro);

// Campo sobre noche: fondo oscuro translúcido, borde de crema, foco esmeralda
export const CLASE_CAMPO_NOCHE =
    "border-tinta/15 bg-lienzo/60 text-tinta shadow-none placeholder:text-tinta/50 focus-visible:border-esmeralda focus-visible:ring-esmeralda/30";

// <InputIcono icon={MailIcon} type="email" ... accion={<Button/>} />
export function InputIcono({ icon: Icon, className, accion, tono = "claro", ...props }) {
    return (
        <div className="group relative">
            {Icon && <Icon className={claseIcono(tono)} />}
            <Input className={cn(Icon && "pl-10", accion && "pr-11", tono === "noche" && CLASE_CAMPO_NOCHE, className)} {...props} />
            {accion && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{accion}</div>}
        </div>
    );
}

export const CLASE_SELECT =
    "h-11 w-full cursor-pointer appearance-none rounded-xl border border-input bg-white px-3.5 pr-10 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

// <SelectIcono icon={TagIcon} name=... value=... onChange=...><option/></SelectIcono>
export function SelectIcono({ icon: Icon, className, children, tono = "claro", ...props }) {
    return (
        <div className="group relative">
            {Icon && <Icon className={claseIcono(tono)} />}
            <select {...props} className={cn(CLASE_SELECT, Icon && "pl-10", tono === "noche" && CLASE_CAMPO_NOCHE, className)}>
                {children}
            </select>
            <ChevronDown className={cn("pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2", tono === "noche" ? "text-tinta/60" : "text-muted-foreground")} />
        </div>
    );
}
