import api from "../../services/api";

export const postUsuario = async (datosUsuario) => {
    return await api.request('/login/', {
        method: 'POST',
        body: JSON.stringify(datosUsuario)
    });
}

export const olvidoPasss = async (email) => {
    return await api.request(`/password-reset/`, {
        method: 'POST',
        body: JSON.stringify({email})
    }) 
}


export const restablecerPass = async (datos) => {
    return await api.request(`/password-reset/confirm/`,{
        method: 'POST',
        body: JSON.stringify(datos)
    })
}