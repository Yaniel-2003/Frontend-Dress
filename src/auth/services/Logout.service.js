
import api from "../../services/api";

export const cerrarSesion = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    return await api.request('/logout/',{
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken })
    });
}