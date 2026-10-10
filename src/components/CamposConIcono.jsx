import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* Componentes visuales puros: input / select con icono identificativo a la izquierda.
   Reciben exactamente las mismas props que un <input> / <select> normal. */

const claseIcono =
    "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-emerald-600";

// <InputIcono icon={MailIcon} type="email" ... accion={<Button/>} />
export function InputIcono({ icon: Icon, className, accion, ...props }) {
    return (
        <div className="group relative">
            {Icon && <Icon className={claseIcono} />}
            <Input className={cn(Icon && "pl-10", accion && "pr-11", className)} {...props} />
            {accion && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{accion}</div>}
        </div>
    );
}

export const CLASE_SELECT =
    "h-11 w-full cursor-pointer appearance-none rounded-xl border border-input bg-white px-3.5 pr-10 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

// <SelectIcono icon={TagIcon} name=... value=... onChange=...><option/></SelectIcono>
export function SelectIcono({ icon: Icon, className, children, ...props }) {
    return (
        <div className="group relative">
            {Icon && <Icon className={claseIcono} />}
            <select {...props} className={cn(CLASE_SELECT, Icon && "pl-10", className)}>
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
}
