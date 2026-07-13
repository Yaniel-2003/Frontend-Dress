const BASE_URL = import.meta.env.VITE_API_URL;

const api = {
    async request(endpoint, options = {}){
        const url = `${BASE_URL}${endpoint}`;

        // CONFIGURAMOS POR DEFECTO COMO ENVIAR EL JSON

        const defaultHeaders = {
            'Content-type': 'application/json',
        };

        const token = localStorage.getItem('access_token');

        if(token && endpoint !== '/login/' && endpoint !== '/registro/'){
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        const response = await fetch(url, config);

        if(response.status === 204){
            return null;
        }

        const data = await response.json();
        
        if(!response.ok){
            throw new Error(data.message || 'Error en la peticion');
        }
        return data;
    }
};

export default api;