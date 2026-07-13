import api from "../../services/api";

export const postUsuario = async (datosUsuario) => {
    return await api.request('/login/', {
        method: 'POST',
        body: JSON.stringify(datosUsuario)
    });
}