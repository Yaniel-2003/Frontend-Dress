import api from '../services/api'

// TABLAS CATALOGO
export const getGenero = async () => {
    return await api.request('/genero/',{
        method: 'GET'
    });
}

export const getTipoDoc = async () => {
    return await api.request('/tipo-numero-documento/',{
        method: 'GET'
    });
}
export const getMarca = async () => {
    return await api.request('/marca/',{
        method: 'GET'
    });
}

export const getColor = async () => {
    return await api.request('/color/', {
        method: 'GET'
    });
}

export const getTalla = async () => {
    return await api.request('/talla/',{
        method: 'GET'
    });
}

export const getImpuesto = async () => {
    return await api.request('/impuesto/', {
        method: 'GET'
    });
}

export const getDescuento = async ()=> {
    return await api.request('/descuento/', {
        method: 'GET'
    });
}

export const getCupon = async () => {
    return await api.request('/cupon/', {
        method: 'GET'
    });
} 

export const getCategoria = async () => {
    return await api.request('/categoria/', {
        method: 'GET'
    });
}


export const getPrendas = async () => {
    return await api.request('/prendas/', {
        method: 'GET'
    });
}