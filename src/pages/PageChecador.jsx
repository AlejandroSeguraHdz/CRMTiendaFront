// src/pages/PageChecador.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useProducto } from "../context/Producto.context";

function PageChecador() {
  const { productos, getProductos, getProductoXCodigo } = useProducto();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { codigo: "" } });

  const [resultado, setResultado] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [modalBuscarOpen, setModalBuscarOpen] = useState(false);
  const [filtroBuscar, setFiltroBuscar] = useState("");
  const [cursor, setCursor] = useState(0);
  const itemsRef = useRef([]);
  const buscarInputRef = useRef(null);
  const codigoInputRef = useRef(null);

  useEffect(() => {
    getProductos();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const codigo = data.codigo?.trim();
      if (!codigo) return;

      const p = await getProductoXCodigo(codigo);
      const producto = Array.isArray(p) ? p[0] : p;

      if (!producto) {
        setResultado(null);
        setErrorMsg("Producto no encontrado");
        return;
      }

      setResultado(producto);
      setErrorMsg(null);
      reset({ codigo: "" });
    } catch (err) {
      console.error(err);
      setErrorMsg("Error buscando producto");
      setResultado(null);
    }
  });

  const productosFiltrados = productos.filter((p) =>
    `${p.codigo} ${p.nombre}`.toLowerCase().includes(filtroBuscar.toLowerCase())
  );

  // Foco automático en modal
  useEffect(() => {
    if (modalBuscarOpen) setTimeout(() => buscarInputRef.current?.focus(), 50);
  }, [modalBuscarOpen]);

  useEffect(() => {
    if (!modalBuscarOpen) return;
    const el = itemsRef.current?.[cursor];
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cursor, modalBuscarOpen]);

  // Navegación con teclado
  useEffect(() => {
    if (!modalBuscarOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((prev) => Math.min(prev + 1, productosFiltrados.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const seleccionado = productosFiltrados[cursor] ?? productosFiltrados[0];
        if (seleccionado) {
          setResultado(seleccionado);
          setModalBuscarOpen(false);
          setFiltroBuscar("");
          setCursor(0);
          setTimeout(() => codigoInputRef.current?.focus(), 50);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setModalBuscarOpen(false);
        setFiltroBuscar("");
        setCursor(0);
        setTimeout(() => codigoInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalBuscarOpen, cursor, productosFiltrados]);

  return (
    <div className="p-6 bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400 tracking-wide">💻 Checador de Precios</h1>

      <form onSubmit={onSubmit} className="flex gap-3 w-full max-w-lg mb-6">
        <input
          ref={codigoInputRef}
          type="text"
          placeholder="Ingresa código del producto"
          {...register("codigo")}
          className="flex-1 bg-zinc-700/80 backdrop-blur-sm px-5 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="button"
          onClick={() => setModalBuscarOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          Buscar
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          Consultar
        </button>
      </form>

      {errorMsg && <div className="text-red-400 mb-4">{errorMsg}</div>}

      {resultado && (
        <div className="bg-zinc-800/90 w-full max-w-md rounded-xl p-6 shadow-lg border border-cyan-500 transition transform hover:scale-105">
          <div className="text-xl font-bold text-cyan-400 mb-2">{resultado.nombre}</div>
          <div className="text-gray-300 mb-1">Código: {resultado.codigo}</div>
          <div className="text-green-400 text-2xl font-extrabold mb-1">Precio: ${resultado.precio.toFixed(2)}</div>
          <div className="text-yellow-400 font-semibold">Stock: {resultado.cantidad ?? 0}</div>
        </div>
      )}

      {/* Modal de búsqueda */}
      {modalBuscarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-2xl border border-cyan-500 animate-fadeIn">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Buscar producto</h2>

            <input
              ref={buscarInputRef}
              type="text"
              placeholder="Buscar por nombre o código..."
              value={filtroBuscar}
              onChange={(e) => {
                setFiltroBuscar(e.target.value);
                setCursor(0);
              }}
              className="w-full bg-zinc-800 px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md"
            />

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {productosFiltrados.map((p, i) => (
                <div
                  key={p._id}
                  ref={(el) => (itemsRef.current[i] = el)}
                  className={`p-3 rounded-lg cursor-pointer border-l-4 transition ${
                    cursor === i
                      ? "bg-zinc-700 border-cyan-400"
                      : "bg-zinc-800 border-transparent hover:bg-zinc-700"
                  }`}
                  onClick={() => {
                    setResultado(p);
                    setModalBuscarOpen(false);
                    setFiltroBuscar("");
                    setCursor(0);
                    setTimeout(() => codigoInputRef.current?.focus(), 50);
                  }}
                >
                  <div className="font-bold text-cyan-400">{p.nombre}</div>
                  <div className="text-gray-300 text-sm">Código: {p.codigo}</div>
                  <div className="text-green-400 font-semibold">Precio: ${p.precio.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setModalBuscarOpen(false);
                  setFiltroBuscar("");
                  setCursor(0);
                  setTimeout(() => codigoInputRef.current?.focus(), 50);
                }}
                className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg font-semibold shadow-md"
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

export default PageChecador;
