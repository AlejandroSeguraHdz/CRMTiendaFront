import axios from "./axios"

export const  getCategoriasRequest = async () => axios.get(`/categoria`);
export const  getCategoriaRequest = async (id) => axios.get(`/categoria/${id}`);
export const  createCategoriaRequest = async (producto) => axios.post(`/categoria`,producto);
export const  updateCategoriaRequest = async (id,producto) => axios.put(`/categoria/${id}`,producto);
export const  deleteCategoriaRequest = async (id) => axios.delete(`/categoria/${id}`);

 