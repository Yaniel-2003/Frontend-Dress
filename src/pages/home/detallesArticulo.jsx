import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";

import { getOneVariante, getFotosVAriantes } from "../../services/articulo.service";
import ModalMensaje from "../../components/ModalMensajes";

function useDetalleArticulo(id){
    const [articulo, setArticulo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [varFotos, setvarFotos] = useState([]);


    useEffect(() => {
        const detallesArticulos = async () => {
            try{
                setCargando(true);
                const [dataFotos, datosArticulos] = await Promise.all([getFotosVAriantes(id), getOneVariante(id)]);
                setvarFotos(dataFotos);
                setArticulo(datosArticulos);
            }catch(error){
                console.log("Error al cargar articulo ", error);
            }finally{
                setCargando(false);
            }
        }
        detallesArticulos();
    },[id]);


    return { articulo, cargando, varFotos }
}


function DetallesArticulos(){
    const {id} = useParams();
    const {articulo, cargando, varFotos} = useDetalleArticulo(id); 
    if(!articulo) return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <main className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
                Cargando...
            </main>
            <Footer/>
        </div>
    );

    const {articulo: producto, color, talla, sku, historial_descuentos, stock, foto, precio_final} = articulo
    const {marca, categoria, descripcion, nombre } = producto;
    const { genero } = categoria;

    const hayDescuento = articulo.precio_con_descuento_activo && Number(articulo.precio_con_descuento_activo) < Number(precio_final);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">
                <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start justify-center">
                    <div className="flex flex-row sm:flex-col gap-4 order-2 sm:order-1">
                        {varFotos.map((f) => (
                            <img
                                key={f.idfoto}
                                src={f.urlfoto}
                                alt={nombre}
                                className="w-20 h-20 rounded-2xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        ))}
                    </div>

                    <div className="order-1 sm:order-2 w-full max-w-md rounded-2xl overflow-hidden shadow-xl bg-white">
                        <img
                            src={foto}
                            alt={nombre}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                </div>

                <div className="mt-10 max-w-2xl mx-auto text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-slate-800">{nombre}</h1>

                    <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{marca.nombre}</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{genero.nombre}</span>
                    </div>

                    <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 w-14">Talla</span>
                            <div className="flex flex-wrap gap-2">
                                {[talla].map((t) => (
                                    <span
                                        key={t.idtalla}
                                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700"
                                    >
                                        {t.codigo}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 w-14">Color</span>
                            <div className="flex flex-wrap gap-2">
                                {[color].map((c) => (
                                    <span
                                        key={c.idcolor}
                                        title={c.nombre}
                                        className="w-7 h-7 rounded-full border border-slate-200 shadow-sm"
                                        style={{ backgroundColor: c.hex_code }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-baseline gap-3 justify-center sm:justify-start">
                        {hayDescuento ? (
                            <>
                                <span className="text-3xl font-bold text-emerald-700">$ {Number(articulo.precio_con_descuento_activo).toLocaleString()}</span>
                                <span className="text-lg text-slate-400 line-through">$ {Number(precio_final).toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-slate-800">$ {Number(precio_final).toLocaleString()}</span>
                        )}
                    </div>

                    <div className="flex gap-3 mt-8 justify-center sm:justify-start">
                        <button
                            type="button"
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 bg-white border border-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                        >
                            Agregar al carrito
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all cursor-pointer"
                        >
                            Comprar
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-left">
                        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-2">Descripción</h2>
                        <p className="text-slate-600 leading-relaxed">{descripcion}</p>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}

export default DetallesArticulos;