import api from "./api";


// OBTENER TODOS LOS ARTICULOS 
export const GetTiendaPublica = async (filtros={}, { signal } = {}) => {
    const params = new URLSearchParams(filtros).toString();

    const url = params ? `/tienda-publica/?${params}` : `/tienda-publica/`;

    return await api.request(url, {
        method: 'GET',
        signal,
    })
}

// HACER POST 