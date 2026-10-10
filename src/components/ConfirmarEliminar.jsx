import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";


function ModalConfirmar({datosAMostrar, onConfirmar, onCancelar, cargando = false}){
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm transition-opacity duration-200">
            <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-xl">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/60">
                    <Trash2 className="size-5" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight">
                    ¿Eliminar <span className="text-red-600">{datosAMostrar}</span>?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Este proceso no se puede deshacer.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" size="lg" onClick={onCancelar}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={onConfirmar}
                        disabled={cargando}
                    >
                        {cargando ? 'Eliminando...' : 'Sí, eliminar'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ModalConfirmar;
