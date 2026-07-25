import { useEffect, useState } from "react";

const VARIANTES = {
  success: {
    icono: "text-green-500",
    anillo: "ring-green-100",
    texto: "text-green-700",
    barra: "from-green-500 to-blue-500",
    dibSvg: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"  />
  },
  error: {
    icono: "text-red-500",
    anillo: "ring-red-100",
    texto: "text-red-700",
    barra: "from-red-500 to-emerald-500",
    dibSvg: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  },
};

function ModalMensaje({ abierto, mensaje, tipo = "success" }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (abierto) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
  }, [abierto]);

  if (!abierto) return null;

  const v = VARIANTES[tipo] ?? VARIANTES.success;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        role="alert"
        aria-live="polite"
        className={`relative w-72 rounded-2xl bg-white p-8 text-center shadow-xl transition-all duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${v.barra}`} />

        <div className={`relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white ring-8 ${v.anillo}`}>
          <div className={`absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-transparent border-t-current animate-spin ${v.icono}`}></div>
          <svg
            className={`relative z-10 h-7 w-7 ${v.icono}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            {v.dibSvg}
          </svg>
        </div>

        <h2 className={`text-base font-semibold ${v.texto}`}>{mensaje}</h2>
      </div>
    </div>
  );
}

export default ModalMensaje;