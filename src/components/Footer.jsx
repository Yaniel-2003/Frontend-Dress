import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-slate-200/60 bg-slate-50/50">
            <div className="mx-auto max-w-7xl px-6 h-14 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                
                <p className="text-center sm:text-left">
                    &copy; {new Date().getFullYear()} Yanielfer Paya. Todos los derechos reservados.
                </p>

                <div className="flex items-center gap-4">
                    <Link to="/soporte" className="hover:text-blue-600 transition-colors">
                        Soporte técnico
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link to="/privacidad" className="hover:text-blue-600 transition-colors">
                        Privacidad
                    </Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
