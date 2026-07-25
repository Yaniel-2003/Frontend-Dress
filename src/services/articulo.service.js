import api from "./api";

//CRUD TABLAS DE ARTICULOS

// GET / ARTICULOS / 
export const getAllArticulos = async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();

    const url = params ? `/articulos/?${params}` : '/articulos/';
    
    return await api.request(url,{
        method: 'GET'
    });
}

// GET ONE / ARTICULOS / ID 
export const getOneArticulos = async (idarticulo) => {
    return await api.request(`/articulos/${idarticulo}/`,{
        method: 'GET'
    });
}

// POST / ARTICULOS /
export const saveArticulo = async (datosArticulos) => {
    return await api.request(`/articulos/`,{
        method: 'POST',
        body: JSON.stringify(datosArticulos)
    });
}

// PUT / ARTICULOS / ID
export const updateArticulo = async (idarticulo, datosArticulos) => {
    return await api.request(`/articulos/${idarticulo}/`,{
        method: 'PUT',
        body: JSON.stringify(datosArticulos)
    });
}

// DELETE /ARTICULO / ID 
export const deleteArticulo = async (idarticulo) => {
    return await api.request(`/articulos/${idarticulo}/`,{
        method: 'DELETE'
    });
}



// TABLA DE VARIANTE DE ARTICULOS 

// GET / VARIANTE ARTICULOS
export const getAllVariante = async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    const url = params ? `/variantes-articulos/?${params}` : '/variantes-articulos/';

    return await api.request(url,{
        method: 'GET'
    });
}


// GET / variantes-articulos / ID
export const getOneVariante = async (idvariante) => {
    return await api.request(`/variantes-articulos/${idvariante}/`,{
        method: 'GET'
    });
}


// POST / variantes-articulos /
export const saveVariante = async (formDataVariante) => {
    return await api.request(`/variantes-articulos/`,{
        method: 'POST',
        body: formDataVariante,
    });
}

// PUT / variantes-articulos / ID
export const updateVariante = async (idvariante, formDataVariante) => {
    return await api.request(`/variantes-articulos/${idvariante}/`,{
        method: 'PUT',
        body: formDataVariante,
    });
}

// DELETE / variantes-articulos / ID
export const deleteVariante = async (idvariante) => {
    return await api.request(`/variantes-articulos/${idvariante}/`,{
        method: 'DELETE'
    })

}