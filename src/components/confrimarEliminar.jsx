import { useEffect, useState } from "react";


function ModalConfimar({datosAMostrar, onConfirmar, onCancelar, cargando = false}){
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center  bg-black/40 backdrop-blur-sm transition-opacity duration-200">
            <div className="group select-none w-[400px] flex flex-col p-4 relative items-center justify-center bg-red-50 border border-red-50 shadow-lg rounded-2xl">
            <div className="">
                <div className="text-center p-3 flex-auto justify-center">
                <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="group-hover:animate-bounce w-12 h-12 flex items-center text-black-600 fill-gray-600 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        fillRule="evenodd"
                    >
                    </path>
                </svg>
                <h2 className="text-xl font-bold py-4 text-gray-500">Estas seguro de eliminar : <span className="font-extrabold text-red-600">{datosAMostrar} ?</span></h2>
                <p className="font-bold text-sm text-gray-500 px-2">
                    Realmente deseas eliminar: <span className="font-extrabold text-red-600"> {datosAMostrar} ?</span> Este proceso no se puede deshacer.
                </p>
                </div>
                <div className="p-2 mt-2 text-center space-x-1 md:block">
                <button
                    onClick={onCancelar}
                    className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                >
                    cancelar
                </button>
                <button 
                    onClick={onConfirmar}
                    disabled={cargando}
                    className={`${cargando ? 'bg-gray-400 cursor-not-allowed border-gray-400 text-white' : 'bg-red-500 hover:bg-transparent border-red-500 hover:border-red-500 text-white hover:text-red-500 hover:shadow-lg'} px-5 ml-4 py-2 text-sm shadow-sm font-medium tracking-wider border-2 rounded-full transition ease-in duration-300`}
                >
                    {cargando ? 'Eliminando...' : 'Si, eliminar'}
                </button>
                </div>
            </div>
            </div>

        </div>
    )
}

export default ModalConfimar;