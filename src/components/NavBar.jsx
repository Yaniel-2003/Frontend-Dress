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
                    className="fixed bottom-6 right-6 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg shadow-zinc-900/20 ring-1 ring-white/10 transition-all duration-200 hover:bg-emerald-700 hover:shadow-xl"
                >
                    <ShoppingCart className="size-6" strokeWidth={1.75} />

                    {cantidad > 0 && (
                        <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold text-white ring-2 ring-background">
                            {cantidad}
                        </Badge>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-0 p-0">
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

const claseEnlace = ({ isActive }) =>
    cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
            ? "bg-zinc-950 text-white"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
    );

const NavBar = () => {
    const cerrarSesion = useLogout();
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <>
        <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-lg">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <Link to="/home" aria-label="Dress Shopy - inicio">
                    <Logo />
                </Link>

                {/* Menú de escritorio */}
                <div className="hidden items-center gap-1 md:flex">
                    {ENLACES.map((e) => (
                        <NavLink key={e.to} to={e.to} className={claseEnlace}>
                            {e.etiqueta}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden md:block">
                    <Button variant="outline" size="sm" onClick={cerrarSesion} className="text-zinc-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                        <LogOut className="size-4" />
                        Cerrar sesión
                    </Button>
                </div>

                {/* Botón del menú móvil */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
                    onClick={() => setMenuAbierto(!menuAbierto)}
                >
                    {menuAbierto ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </nav>

            {/* Menú desplegable móvil */}
            <div
                className={cn(
                    "overflow-hidden border-zinc-200/70 bg-white transition-all duration-300 md:hidden",
                    menuAbierto ? "max-h-96 border-t py-3" : "max-h-0"
                )}
            >
                <div className="flex flex-col gap-1 px-4">
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
                        className="mt-2 flex items-center gap-2 rounded-lg border-t border-zinc-100 px-3 pt-4 pb-2 text-left text-sm font-medium text-red-600"
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
