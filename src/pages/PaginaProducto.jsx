import { useEffect, useMemo, useState } from "react";
import { useProducto } from "../context/Producto.context";
import { Link } from "react-router-dom";

function PaginaProducto() {
  const { deleteProducto, getProductos, productos } = useProducto();

  // ------------------- ESTADO -------------------
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  // Carga inicial
  useEffect(() => {
    getProductos();
  }, []);

  // Cuando cambian query o pageSize, regresamos a la página 1
  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  // ------------------- FILTRADO -------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) => {
      return (
        (p.sku || "").toString().toLowerCase().includes(q) ||
        (p.nombre || "").toLowerCase().includes(q) ||
        (p.descripcion || "").toLowerCase().includes(q)
      );
    });
  }, [productos, query]);

  // ------------------- PAGINACIÓN -------------------
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  const gotoPage = (n) => {
    const p = Math.min(Math.max(1, n), totalPages);
    setPage(p);
  };

  // ------------------- RENDER -------------------
  return (
    <div className="h-screen">
      <div className="grid sm:grid-cols-2 md:grid-cols-1 gap-2 h-full">
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>

          <div className="flex justify-between items-center mb-4 gap-4">
            <div>
              <Link
                to="/add-producto"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Agregar Productos
              </Link>
            </div>

            {/* Buscador */}
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por SKU, nombre o descripción..."
                className="border px-3 py-2 rounded w-80"
                aria-label="Buscar productos"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="px-3 py-2 border rounded hover:bg-gray-100"
                >
                  Limpiar
                </button>
              )}

              {/* Tamaño de página */}
              <div className="flex items-center gap-2 ml-2">
                <label className="text-sm">Filas:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                  className="border rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto border border-gray-300 rounded shadow">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">SKU</th>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Descripción</th>
                  <th className="py-2 px-4 border-b">Precio</th>
                  <th className="py-2 px-4 border-b">Cantidad</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No hay productos disponibles
                    </td>
                  </tr>
                ) : (
                  paginated.map((producto) => (
                    <tr key={producto._id}>
                      <td className="py-2 px-4 border-b">{producto.sku}</td>
                      <td className="py-2 px-4 border-b">{producto.nombre}</td>
                      <td className="py-2 px-4 border-b">{producto.descripcion}</td>
                      <td className="py-2 px-4 border-b">${producto.precio}</td>
                      <td className="py-2 px-4 border-b">{producto.cantidad}</td>
                      <td>
                        <div className="flex gap-x-2 px-4 py-2 border-b">
                          <Link
                            to={`/producto/${producto._id}`}
                            className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700 transition"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => deleteProducto(producto._id)}
                            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                          >
                            Desactivar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Mostrando {total === 0 ? 0 : start + 1}-
              {Math.min(end, total)} de {total}{" "}
              {query ? <span>(filtro: "{query}")</span> : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => gotoPage(1)}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                « Primero
              </button>
              <button
                onClick={() => gotoPage(page - 1)}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                ‹ Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      (p >= page - 2 && p <= page + 2)
                  )
                  .map((p, idx, arr) => {
                    const needEllipsis =
                      idx > 0 && p - arr[idx - 1] > 1 ? true : false;
                    return (
                      <span key={p} className="flex items-center">
                        {needEllipsis && <span className="px-1">...</span>}
                        <button
                          onClick={() => gotoPage(p)}
                          className={
                            "px-2 py-1 border rounded " +
                            (p === page ? "bg-gray-200" : "")
                          }
                        >
                          {p}
                        </button>
                      </span>
                    );
                  })}
              </div>

              <button
                onClick={() => gotoPage(page + 1)}
                disabled={page === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Siguiente ›
              </button>
              <button
                onClick={() => gotoPage(totalPages)}
                disabled={page === totalPages}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Último »
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Link
              to="/productos-desactivados"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
            >
              Productos desactivados
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaProducto;
