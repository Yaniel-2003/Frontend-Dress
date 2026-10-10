import { useEffect, useState } from "react";

const VARIANTES = {
  success: {
    icono: "text-emerald-600",
    fondoIcono: "bg-emerald-50",
    pista: "border-emerald-100",
    texto: "text-emerald-700",
    dibSvg: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"  />
  },
  error: {
    icono: "text-red-600",
    fondoIcono: "bg-red-50",
    pista: "border-red-100",
    texto: "text-red-700",
    dibSvg: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  },
};

function ModalMensaje({ abierto, mensaje, tipo = "success" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(abierto));
    return () => cancelAnimationFrame(raf);
  }, [abierto]);

  if (!abierto) return null;

  const v = VARIANTES[tipo] ?? VARIANTES.success;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/30 backdrop-blur-[3px] transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        role="alert"
        aria-live="polite"
        className={`w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white px-8 py-9 text-center shadow-2xl shadow-zinc-900/15 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        }`}
      >
        {/* icono con la ruedita girando alrededor */}
        <div className="relative mx-auto mb-5 flex size-[4.5rem] items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-[3px] ${v.pista}`} />
          <div
            className={`absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-current [animation-duration:1.1s] ${v.icono}`}
          />
          <div className={`flex size-12 items-center justify-center rounded-full ${v.fondoIcono}`}>
            <svg
              className={`size-6 ${v.icono}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: visible ? 0 : 1,
                transition: "stroke-dashoffset 450ms cubic-bezier(0.65, 0, 0.35, 1) 200ms",
              }}
            >
              {/* pathLength=1 permite dibujar el trazo de forma uniforme */}
              {tipo === "error" ? (
                <path pathLength="1" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path pathLength="1" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              )}
            </svg>
          </div>
        </div>

        <h2 className={`whitespace-pre-line text-[15px] font-semibold leading-snug ${v.texto}`}>{mensaje}</h2>
      </div>
    </div>
  );
}

export default ModalMensaje;
