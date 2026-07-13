import api from '../../services/api';

export const registrarNuevoUsuario = async (datosUsuario) => {
    return await api.request('/usuario/', {
        method: 'POST',
        body: JSON.stringify(datosUsuario)
    });
}

export const obtenerUsuario = async (idusuario) => {
    return await api.request(`/usuario/${idusuario}/`,{
        method: 'GET'
    })
}

export const actualizarUsuario = async (idusuario, datosActualizados) => {
    return await api.request(`/usuario/${idusuario}/`,{
        method:'PUT',
        body: JSON.stringify(datosActualizados)
    });
};

export const eliminarUsuario = async(idusuario) => {
    return await api.request(`/usuario/${idusuario}/`,{
        method: 'DELETE'
    })
}