// src/pages/PageCompras.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useProducto } from "../context/Producto.context";
import { useCarrito } from "../context/Carrito.context";
import { useAuth } from "../context/Auth.context";

function PageCompras() {
  const { isAuthenticated, logOut, user } = useAuth();

  const { carrito, addProducto, updateCantidad, removeProducto, clearCart, total, totalItems, guardarVenta } =
    useCarrito();

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { codigo: "", cantidad: 1, metodoPago: "efectivo" },
  });

  const { productos, getProductos, getProductoXCodigo } = useProducto();

  // Refs para manejo de foco y scroll
  const codigoInputRef = useRef(null);
  const buscarInputRef = useRef(null);
  const itemsRef = useRef([]);

  // -------------------------------
  // MODAL GRANEL
  // -------------------------------
  const [modalGranelOpen, setModalGranelOpen] = useState(false);
  const [productoGranel, setProductoGranel] = useState(null);
  const [gramosInput, setGramosInput] = useState("");

  // -------------------------------
  // MODAL BUSCAR PRODUCTO
  // -------------------------------
  const [modalBuscarOpen, setModalBuscarOpen] = useState(false);
  const [filtroBuscar, setFiltroBuscar] = useState("");

  // Navegación por teclado
  const cursorRef = useRef(0);
  const [cursor, setCursor] = useState(0);

  // Estado para proceso de venta
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Cargar productos al iniciar
  useEffect(() => {
    getProductos();
  }, []);

  // Productos filtrados
  const productosFiltrados = productos.filter((p) =>
    `${p.codigo} ${p.nombre}`.toLowerCase().includes(filtroBuscar.toLowerCase())
  );

  // Cuando se abre el modal de búsqueda
  useEffect(() => {
    if (modalBuscarOpen) {
      cursorRef.current = 0;
      setCursor(0);
      setTimeout(() => buscarInputRef.current?.focus(), 50);
    }
  }, [modalBuscarOpen]);

  // Mantener el elemento seleccionado visible al cambiar cursor
  useEffect(() => {
    if (!modalBuscarOpen) return;
    const el = itemsRef.current?.[cursor];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  }, [cursor, modalBuscarOpen]);

  // Manejo de teclado en el input del modal
  useEffect(() => {
    if (!modalBuscarOpen) return;

    const handleKeyDown = (e) => {
      const max = productosFiltrados.length - 1;
      if (max < 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          cursorRef.current = Math.min(cursorRef.current + 1, max);
          setCursor(cursorRef.current);
          break;
        case "ArrowUp":
          e.preventDefault();
          cursorRef.current = Math.max(cursorRef.current - 1, 0);
          setCursor(cursorRef.current);
          break;
        case "Enter":
          e.preventDefault();
          const seleccionado = productosFiltrados[cursorRef.current];
          if (seleccionado) {
            reset({
              codigo: seleccionado.codigo,
              cantidad: 1,
              metodoPago: watch("metodoPago"),
            });
            setModalBuscarOpen(false);
            setFiltroBuscar("");
            cursorRef.current = 0;
            setCursor(0);
            setTimeout(() => codigoInputRef.current?.focus(), 50);
          }
          break;
        case "Escape":
          e.preventDefault();
          setModalBuscarOpen(false);
          setFiltroBuscar("");
          cursorRef.current = 0;
          setCursor(0);
          setTimeout(() => codigoInputRef.current?.focus(), 50);
          break;
        default:
          break;
      }
    };

    buscarInputRef.current?.addEventListener("keydown", handleKeyDown);
    return () => buscarInputRef.current?.removeEventListener("keydown", handleKeyDown);
  }, [modalBuscarOpen, productosFiltrados, reset, watch]);

  // -------------------------------
  // SUBMIT PRINCIPAL
  // -------------------------------
  const onSubmit = handleSubmit(async (data) => {
    try {
      const codigo = data.codigo?.trim();
      let cantidad = Number(data.cantidad) || 1;
      if (!codigo) return;

      const p = await getProductoXCodigo(codigo);
      const producto = Array.isArray(p) ? p[0] : p;

      if (!producto) {
        alert("Producto no encontrado: " + codigo);
        return;
      }

      if (producto.tipoVenta === "granel") {
        setProductoGranel(producto);
        setGramosInput("");
        setModalGranelOpen(true);
        return;
      }

      const stock = Number(producto.cantidad ?? 0);
      if (stock <= 0) {
        alert("Producto sin stock disponible.");
        return;
      }

      if (cantidad > stock) {
        if (!window.confirm(`Solo hay ${stock} en stock. ¿Agregar ${stock}?`)) return;
        cantidad = stock;
      }

      addProducto(producto, cantidad);
      reset({ codigo: "", cantidad: 1, metodoPago: watch("metodoPago") });
    } catch (err) {
      console.error(err);
      alert("Error buscando producto.");
    }
  });

  // ---------------------------------------
  // CONFIRMAR VENTA A GRANEL
  // ---------------------------------------
  const confirmarGranel = () => {
    const gramos = Number(gramosInput);
    if (!gramos || gramos <= 0) {
      alert("Ingresa gramos válidos.");
      return;
    }

    const producto = productoGranel;
    const stockKg = Number(producto.cantidad || 0);

    if (stockKg <= 0) {
      alert("Producto sin stock.");
      return;
    }

    const kgSolicitados = gramos / 1000;

    if (kgSolicitados > stockKg) {
      alert(`Stock insuficiente. Disponible: ${stockKg} kg`);
      return;
    }

    const precioPorGramo = producto.precio / 1000;

    addProducto(
      {
        ...producto,
        nombre: `${producto.nombre} (${gramos}g)`,
        precio: precioPorGramo,
      },
      gramos
    );

    setModalGranelOpen(false);
    setProductoGranel(null);
    reset({ codigo: "", cantidad: 1, metodoPago: watch("metodoPago") });
  };

  // -------------------------------
  // GENERAR ITEMS PARA LA VENTA
  // -------------------------------
  const buildCartItemsForVenta = () => {
    return carrito
      .map((it) => {
        const productoId = (it.raw && (it.raw._id || it.raw.id)) || it._id || it.productoId || null;
        const cantidad = Number(it.cantidadEnCarrito ?? it.cantidad ?? 0);
        const precioUnitario = Number(it.precio || 0);

        return productoId
          ? {
              productoId,
              codigo: it.raw?.codigo || it.codigo || "",
              nombre: it.nombre || "Sin nombre",
              precioUnitario,
              cantidad,
              subtotal: precioUnitario * cantidad,
            }
          : null;
      })
      .filter(Boolean);
  };

  // -------------------------------
  // CHECKOUT
  // -------------------------------
  const handleCheckout = async () => {
    setErrorMsg(null);
    setCheckoutResult(null);

    if (!carrito || carrito.length === 0) {
      setErrorMsg("El carrito está vacío.");
      return;
    }

    const metodoPago = watch("metodoPago") || "efectivo";
    const items = buildCartItemsForVenta();
    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);

    const datosVenta = {
      items,
      subtotal,
      impuesto: 0,
      descuento: 0,
      total: subtotal,
      metodoPago,
      pagoRef: null,
      notas: "",
    };

    try {
      setLoadingCheckout(true);
      await guardarVenta(datosVenta);
      setCheckoutResult({ success: true });
      clearCart();
    } catch (err) {
      console.error("Error en guardar venta:", err);
      setErrorMsg("Error al procesar la venta.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  // =====================================
  // =========== RENDER PAGE =============
  // =====================================
  return (
    <div className="p-4 text-white">
      {/* FORMULARIO PRINCIPAL */}
      <form onSubmit={onSubmit} className="mb-6 flex gap-2 flex-wrap">
        <input
          ref={codigoInputRef}
          type="text"
          placeholder="Código del producto"
          {...register("codigo")}
          className="w-1/2 bg-zinc-700 px-4 py-2 rounded-md"
        />
        <button
          type="button"
          onClick={() => setModalBuscarOpen(true)}
          className="bg-blue-600 px-4 py-2 rounded-md"
        >
          Buscar 🔍
        </button>
        <input
          type="number"
          min="1"
          {...register("cantidad", { valueAsNumber: true })}
          className="w-20 bg-zinc-700 px-4 py-2 rounded-md"
        />
        <button type="submit" className="bg-green-600 px-4 py-2 rounded-md">
          Agregar
        </button>
        <button type="button" onClick={() => clearCart()} className="bg-rose-600 px-4 py-2 rounded-md">
          Vaciar
        </button>
      </form>

      {/* MÉTODO DE PAGO */}
      <div className="mb-4">
        <label className="mr-2">Método de pago:</label>
        <select {...register("metodoPago")} className="bg-zinc-700 px-2 py-1 rounded text-black">
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <h2 className="text-lg font-semibold mb-2">🛒 Carrito</h2>
      {errorMsg && <div className="mb-2 text-red-400">{errorMsg}</div>}
      {checkoutResult && (
        <div className="mb-2 p-2 bg-green-800 rounded">
          <strong>Venta creada correctamente</strong>
        </div>
      )}

      {/* TABLA DEL CARRITO */}
      {carrito.length === 0 ? (
        <p className="text-gray-400">No hay productos en el carrito.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-zinc-800 rounded-md p-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Precio</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Subtotal</th>
                  <th className="px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => {
                  const codigo = item.codigo;
                  const precio = Number(item.precio) || 0;
                  const cantidadEnCarrito = Number(item.cantidadEnCarrito) || 0;
                  const stock = Number(item.stock) || 0;

                  return (
                    <tr key={codigo} className="border-t border-zinc-700">
                      <td className="px-3 py-2 align-top">{codigo}</td>
                      <td className="px-3 py-2 align-top">{item.nombre}</td>
                      <td className="px-3 py-2 align-top">{precio.toFixed(2)}</td>
                      <td className="px-3 py-2 align-top">{stock}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          max={stock}
                          value={cantidadEnCarrito}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            if (val > stock) {
                              alert(`Máximo disponible: ${stock}`);
                              updateCantidad(codigo, stock);
                            } else {
                              updateCantidad(codigo, val);
                            }
                          }}
                          className="w-20 bg-zinc-700 px-2 py-1 rounded"
                        />
                      </td>
                      <td className="px-3 py-2 align-top">{(precio * cantidadEnCarrito).toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => removeProducto(codigo)}
                          className="bg-red-600 px-3 py-1 rounded text-white"
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="px-3 py-2 text-right font-semibold">
                    Total:
                  </td>
                  <td className="px-3 py-2 font-semibold">{Number(total).toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={handleCheckout}
              disabled={loadingCheckout}
              className="bg-indigo-600 px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loadingCheckout ? "Procesando..." : `Pagar (${totalItems || 0} items)`}
            </button>
            <button onClick={() => clearCart()} className="bg-rose-600 px-4 py-2 rounded-md">
              Vaciar carrito
            </button>
          </div>
        </>
      )}

      {/* MODAL GRANEL */}
      {modalGranelOpen && productoGranel && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Venta a granel: {productoGranel.nombre}</h2>
            <label className="block mb-2">Ingresa los gramos:</label>
            <input
              type="number"
              min="1"
              value={gramosInput}
              onChange={(e) => setGramosInput(e.target.value)}
              className="w-full bg-zinc-700 px-3 py-2 rounded mb-4"
              placeholder="Ej. 250"
            />
            <div className="flex justify-between mt-4">
              <button onClick={() => setModalGranelOpen(false)} className="bg-gray-500 px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={confirmarGranel} className="bg-green-600 px-4 py-2 rounded">
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BUSCAR PRODUCTO */}
      {modalBuscarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Buscar producto</h2>
            <input
              ref={buscarInputRef}
              type="text"
              placeholder="Buscar por nombre o código..."
              value={filtroBuscar}
              onChange={(e) => {
                setFiltroBuscar(e.target.value);
                cursorRef.current = 0;
                setCursor(0);
              }}
              className="w-full bg-zinc-700 px-3 py-2 rounded mb-4"
            />
            <div className="space-y-2">
              {productosFiltrados.map((p, i) => (
                <div
                  key={p._id}
                  ref={(el) => (itemsRef.current[i] = el)}
                  className={`p-3 bg-zinc-700 rounded cursor-pointer ${
                    cursor === i ? "bg-zinc-500" : "hover:bg-zinc-600"
                  }`}
                  onClick={() => {
                    reset({
                      codigo: p.codigo,
                      cantidad: 1,
                      metodoPago: watch("metodoPago"),
                    });
                    setModalBuscarOpen(false);
                    setTimeout(() => codigoInputRef.current?.focus(), 50);
                  }}
                >
                  <div className="font-semibold">{p.nombre}</div>
                  <div className="text-sm text-gray-300">Código: {p.codigo}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setModalBuscarOpen(false);
                  setTimeout(() => codigoInputRef.current?.focus(), 50);
                }}
                className="bg-gray-500 px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageCompras;
