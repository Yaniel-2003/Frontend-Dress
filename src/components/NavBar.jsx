import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, X } from "lucide-react";
import useLogout from "../auth/Logout";
import { useCarrito } from "../context/CarritoContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import MiCarrito from "../pages/carrito/miCarrito";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

const BotonCarritoFlotante = () => {
    const { cantidad } = useCarrito();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Abrir mi carrito"
                    className="fixed right-5 bottom-5 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full bg-tinta text-white shadow-lg shadow-zinc-900/25 transition-[background-color] duration-200 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:right-6 sm:bottom-6"
                >
                    <ShoppingCart className="size-6" strokeWidth={1.75} />

                    {cantidad > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-5 justify-center rounded-full bg-esmeralda px-1.5 text-[11px] font-bold text-tinta tabular-nums ring-2 ring-white">
                            {cantidad}
                        </Badge>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent side="right" showCloseButton={false} className="gap-0 border-tinta/10 bg-lienzo p-0 text-tinta selection:text-tinta sm:max-w-md">
                <MiCarrito />
            </SheetContent>
        </Sheet>
    );
};

const ENLACES = [
    { to: "/home", etiqueta: "Inicio" },
    { to: "/articulos", etiqueta: "Artículos" },
    { to: "/perfil", etiqueta: "Perfil" },
    { to: "/carrito", etiqueta: "Carrito" },
];

// Enlace activo marcado con una línea fina de luz, como una etiqueta de vitrina
const claseEnlace = ({ isActive }) =>
    cn(
        "relative px-1 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 rounded-sm",
        "after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:origin-left after:bg-esmeralda after:transition-transform after:duration-300",
        isActive
            ? "text-tinta after:scale-x-100"
            : "text-tinta/60 hover:text-tinta after:scale-x-0"
    );

const NavBar = () => {
    const cerrarSesion = useLogout();
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <>
        <header className="sticky top-0 z-50 border-b border-tinta/10 bg-lienzo text-tinta selection:text-tinta">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
                <Link to="/home" aria-label="Dress Shopy - inicio" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600">
                    <Logo />
                </Link>

                {/* Menú de escritorio */}
                <div className="hidden items-center gap-8 md:flex">
                    {ENLACES.map((e) => (
                        <NavLink key={e.to} to={e.to} className={claseEnlace}>
                            {e.etiqueta}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden md:block">
                    <Button variant="ghost" size="sm" onClick={cerrarSesion} className="text-tinta/60 hover:bg-tinta/10 hover:text-tinta focus-visible:ring-esmeralda/50">
                        <LogOut className="size-4" />
                        Cerrar sesión
                    </Button>
                </div>

                {/* Botón del menú móvil */}
                <Button
                    variant="ghost"
                    size="icon-lg"
                    className="-mr-2 text-tinta hover:bg-tinta/10 hover:text-tinta md:hidden"
                    aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    {menuAbierto ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </nav>

            {/* Menú desplegable móvil */}
            <div
                className={cn(
                    "overflow-hidden border-tinta/10 bg-lienzo transition-[max-height,padding] duration-300 md:hidden",
                    menuAbierto ? "max-h-96 border-t py-3" : "max-h-0"
                )}
            >
                <div className="flex flex-col gap-1 px-5 [&>a]:py-3">
                    {ENLACES.map((e) => (
                        <NavLink
                            key={e.to}
                            to={e.to}
                            onClick={() => setMenuAbierto(false)}
                            className={claseEnlace}
                        >
                            {e.etiqueta}
                        </NavLink>
                    ))}
                    <button
                        onClick={cerrarSesion}
                        className="mt-2 flex min-h-11 items-center gap-2 border-t border-tinta/10 px-1 pt-4 pb-2 text-left text-sm font-medium text-tinta/60 hover:text-tinta"
                    >
                        <LogOut className="size-4" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
        <BotonCarritoFlotante />
        </>
    );
};

export default NavBar;
