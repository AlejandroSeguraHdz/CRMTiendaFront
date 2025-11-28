import { createContext, useContext, useState } from "react";
import { getVentasRequest, guardarVentaRequest } from "../api/Venta";

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito must be used within a CarritoProvider");
  return context;
};

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]); // cada item: { codigo, nombre, precio, cantidadEnCarrito, stock, raw }

  // cantidadToAdd: número (por defecto 1)
  const addProducto = (producto, cantidadToAdd = 1) => {
    const codigo = producto.codigo ?? producto.sku ?? producto._id;
    const stock = Number(producto.cantidad ?? producto.stock ?? producto.stock_total ?? 0); // ajusta segun tu API
    const precio = Number(producto.precio) || 0;
    const nombre = producto.nombre ?? producto.descripcion ?? producto.sku ?? "Sin nombre";
    const qtyToAdd = Number(cantidadToAdd) || 1;

    setCarrito((prev) => {
      const idx = prev.findIndex((p) => p.codigo === codigo);
      if (idx !== -1) {
        // ya existe en carrito -> sumamos pero sin superar stock
        const currentQty = Number(prev[idx].cantidadEnCarrito) || 0;
        const nuevo = Math.min(currentQty + qtyToAdd, stock);
        const newArr = [...prev];
        newArr[idx] = { ...newArr[idx], cantidadEnCarrito: nuevo };
        return newArr;
      } else {
        // nuevo item: no permitir cantidad inicial mayor al stock
        const inicial = Math.min(qtyToAdd, stock);
        return [
          ...prev,
          {
            codigo,
            nombre,
            precio,
            cantidadEnCarrito: inicial,
            stock,
            raw: producto,
          },
        ];
      }
    });
  };

  // actualizar cantidad directamente desde la tabla (respeta stock)
  const updateCantidad = (codigo, cantidad) => {
    const qty = Number(cantidad) || 0;
    setCarrito((prev) =>
      prev.map((p) => {
        if (p.codigo !== codigo) return p;
        const nueva = Math.max(0, Math.min(qty, Number(p.stock || 0)));
        return { ...p, cantidadEnCarrito: nueva };
      })
    );
  };

  const removeProducto = (codigo) => {
    setCarrito((prev) => prev.filter((p) => p.codigo !== codigo));
  };

  const clearCart = () => setCarrito([]);

  const total = carrito.reduce((acc, it) => acc + (Number(it.precio) || 0) * (Number(it.cantidadEnCarrito) || 0), 0);
  const totalItems = carrito.reduce((acc, it) => acc + (Number(it.cantidadEnCarrito) || 0), 0);

  const guardarVenta = async (datos) => {
    try {
      const res = await guardarVentaRequest(datos)
      console.log(res)
    } catch (error) {
      console.log(errors)

    }
  }

  const getVentas = async () =>{
    try {
      const res= getVentasRequest()
      return res
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        totalItems,
        addProducto,
        updateCantidad,
        removeProducto,
        clearCart,
        guardarVenta,
        getVentas
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
