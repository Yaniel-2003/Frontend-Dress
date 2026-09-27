import api from "./api";


export const obtenerCarrito = async () => {
    return api.request('/carritos-compras/',{
        method: 'GET'
    })
}

// PATCH / CARRITO-COMPRAS / ID ARTICULO
export const actualizarParcial = async (idvariante, dataCarrito) => {
    return api.request(`/carritos-compras/${idvariante}/`,{
        method: 'PATCH',
        body: JSON.stringify(dataCarrito)
    });
}

//POST / AGREGAR ITEM CARRITO / ID /
export const agregarCarrito = async (idvariante) => {
    return await api.request(`/agregar_item_carrito/${idvariante}/`,{
        method: 'POST'
    });
}

// DELETE / CARRITO-COMPRAS / ID
export const eliminarItemCarrito = async (idcarrito) => {
    return api.request(`/carritos-compras/${idcarrito}/`,{
        method: 'DELETE'
    })
}