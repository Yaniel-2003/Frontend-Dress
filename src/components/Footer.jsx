import { Link } from "react-router-dom";
import Logo from "./Logo";

const claseEnlace =
    "inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-tinta/10 bg-lienzo text-tinta/60 selection:text-tinta">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <div className="flex flex-col gap-3">
                    <Logo />
                    <p>
                        &copy; {new Date().getFullYear()} Yanielfer Paya. Todos los derechos reservados.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/soporte" className={claseEnlace}>
                        Soporte técnico
                    </Link>
                    <Link to="/privacidad" className={claseEnlace}>
                        Privacidad
                    </Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
