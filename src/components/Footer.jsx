import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-zinc-200/70 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:px-6">

                <p className="text-center sm:text-left">
                    &copy; {new Date().getFullYear()} Yanielfer Paya. Todos los derechos reservados.
                </p>

                <div className="flex items-center gap-5">
                    <Link to="/soporte" className="transition-colors hover:text-emerald-700">
                        Soporte técnico
                    </Link>
                    <Link to="/privacidad" className="transition-colors hover:text-emerald-700">
                        Privacidad
                    </Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
