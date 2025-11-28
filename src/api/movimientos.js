import axios from "./axios"

export const  getMovimientosRequest = async (id) => axios.get(`/movimientos/${id}`);
 