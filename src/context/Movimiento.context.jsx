// src/context/Venta.context.jsx
import React, { createContext, useContext, useState } from "react";
import { getMovimientosRequest } from "../api/movimientos";

const MovimientoContext = createContext(null);

export const useMovimiento = () => {
    const context = useContext(MovimientoContext);
    if (!context) throw new Error("useMovimiento must be used within a MovimientoProvider");
    return context;
};

export function MovimientoProvider({ children }) {
    const [movimientos, setMovimiento] = useState([]);

    // Trae ventas desde la API
    const getMovimientos = async (id) => {
      try {
            const res = await getMovimientosRequest(id); // asume que devuelve datos o res.data
            // Ajusta esto si tu API devuelve { data: [...] }
            const data = res?.data ?? res;
            setMovimiento(Array.isArray(data) ? data : []);
            return data;
        } catch (error) {
            console.error("Error en getVentas:", error);
            throw error;
        }
    };

    // Guarda venta en backend y la agrega al estado local
    const guardarMovimiento = async (datosVenta) => {
       /* try {
            const res = await guardarVentaRequest(datosVenta);
            const saved = res?.data ?? res;
            // si la API devuelve el documento creado, lo agregamos al estado
            if (saved) setVentas((prev) => [saved, ...prev]);
            return saved;
        } catch (error) {
            console.error("Error en guardarVenta:", error);
            throw error;
        }*/
    };

    return (
        <MovimientoContext.Provider value={
            {
                movimientos,
                getMovimientos,
                guardarMovimiento
            }}>
            {children}
        </MovimientoContext.Provider>
    );
}
