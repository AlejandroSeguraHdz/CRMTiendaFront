import axios from "./axios"

export const  getUsuariosRequest = async () => axios.get(`/usuario`);
export const  getUsuarioRequest = async (id) => axios.get(`/usuario/${id}`);

export const  deleteUsuarioRequest = async (id) => axios.delete(`/usuario/${id}`);

export const  getUsuariosDesactivadosRequest = async (id) => axios.get(`/usuario-desactivados`);
export const  activarUsuariooRequest = async (id) => axios.delete(`/activar-usuario/${id}`);


export const createUsuarioRequest = async (formData) =>  axios.post("/usuario", formData);

export const updateUsuarioRequest = (id, formData) => {
  return axios.put(`usuario/${id}`, formData);
};