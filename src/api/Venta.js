import axios from "./axios"

export const  guardarVentaRequest = async (datos) => axios.post(`/venta`,datos);
export const  getVentasRequest = async () => axios.get(`/venta`);
 