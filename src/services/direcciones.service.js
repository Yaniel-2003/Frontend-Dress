import api from "./api";

export const obtenerTodos = async () => {
    return await api.request('/direcciones/', {
        method: 'GET'
    });
} 

export const obtenerDireccion = async (iddireccion) => {
    return await api.request(`/direcciones/${iddireccion}/`, {
        method: 'GET'
    });
}

export const crearDireccion = async (datosDireccion) => {
    return await api.request('/direcciones/', {
        method: 'POST',
        body: JSON.stringify(datosDireccion)
    });
}

export const actualizarDireccion = async (iddireccion, dirActualizadas) => {
    return await api.request(`/direcciones/${iddireccion}/`, {
        method: 'PUT',
        body: JSON.stringify(dirActualizadas)
    });
}

export const eliminarDireccion = async (iddireccion) => {
    return await api.request(`/direcciones/${iddireccion}/`, {
        method: 'DELETE'
    });
}