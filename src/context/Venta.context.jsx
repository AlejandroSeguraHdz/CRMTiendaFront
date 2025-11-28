// src/context/Venta.context.jsx
import React, { createContext, useContext, useState } from "react";
import { getVentasRequest, guardarVentaRequest } from "../api/Venta";

const VentaContext = createContext(null);

export const useVenta = () => {
    const context = useContext(VentaContext);
    if (!context) throw new Error("useVenta must be used within a VentaProvider");
    return context;
};

export function VentaProvider({ children }) {
    const [ventas, setVentas] = useState([]);

    // Trae ventas desde la API
    const getVentas = async () => {
        try {
            const res = await getVentasRequest(); // asume que devuelve datos o res.data
            // Ajusta esto si tu API devuelve { data: [...] }
            const data = res?.data ?? res;
            setVentas(Array.isArray(data) ? data : []);
            return data;
        } catch (error) {
            console.error("Error en getVentas:", error);
            throw error;
        }
    };

    // Guarda venta en backend y la agrega al estado local
    const guardarVenta = async (datosVenta) => {
        try {
            const res = await guardarVentaRequest(datosVenta);
            const saved = res?.data ?? res;
            // si la API devuelve el documento creado, lo agregamos al estado
            if (saved) setVentas((prev) => [saved, ...prev]);
            return saved;
        } catch (error) {
            console.error("Error en guardarVenta:", error);
            throw error;
        }
    };

    return (
        <VentaContext.Provider value={
            {
                ventas,
                getVentas,
                guardarVenta
            }}>
            {children}
        </VentaContext.Provider>
    );
}
