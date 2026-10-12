import api from "./api";

export const crearOrden = async (datosOrden) => {
    return api.request(`/orden-compra/`,{
        method: 'POST',
        body: JSON.stringify(datosOrden)
    });
}

export const obtenerOrden = async () => {
    return api.request(`/orden-compra/`,{
        method: 'GET'
    });
}