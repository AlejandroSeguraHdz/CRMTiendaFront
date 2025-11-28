import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovimiento } from "../context/Movimiento.context"; // tu contexto de movimientos

// Helpers
const formatDate = (raw) => {
  if (!raw) return "";
  try { return new Date(raw).toLocaleString("es-MX"); }
  catch { return String(raw); }
};

const formatMoney = (n) => Number(n || 0).toFixed(2);

function PageMovimientos() {
  const { id } = useParams();                     // ID del producto
  const { movimientos, getMovimientos } = useMovimiento();

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(false);

  // cargar movimientos al montar
  useEffect(() => {
    (async () => {
      setLoading(true);
      await getMovimientos(id);
      setLoading(false);
    })();
  }, [id]);

  // Filtrar movimientos
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movimientos || [];

    return (movimientos || []).filter((m) =>
      [
        m.tipo,
        String(m.cantidad),
        String(m.cantidadAnterior),
        String(m.cantidadNueva),
        formatDate(m.createdAt)
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [movimientos, query]);

  const totalPages = Math.max(1, Math.ceil((filtered || []).length / perPage));
  const pageItems = (filtered || []).slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Movimientos del producto</h2>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por tipo o cantidad"
          className="px-3 py-2 border rounded bg-white/5"
        />
      </div>

      <div className="overflow-x-auto bg-zinc-900 rounded p-2">
        <table className="min-w-full text-sm">
          <thead className="text-zinc-400">
            <tr className="text-left">
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Cantidad</th>
              <th className="px-3 py-2">Antes</th>
              <th className="px-3 py-2">Después</th>
              <th className="px-3 py-2">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No hay movimientos.
                </td>
              </tr>
            ) : (
              pageItems.map((m) => (
                <tr key={m._id} className="border-t border-zinc-700">
                  <td className="px-3 py-2">{formatDate(m.createdAt)}</td>
                  <td className="px-3 py-2 capitalize">{m.tipo}</td>
                  <td className="px-3 py-2">{m.cantidad}</td>
                  <td className="px-3 py-2">{m.cantidadAnterior}</td>
                  <td className="px-3 py-2">{m.cantidadNueva}</td>
                  <td className="px-3 py-2">{m.comentario || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Mostrando{" "}
          {(filtered.length === 0) ? 0 : (page - 1) * perPage + 1} -{" "}
          {Math.min(page * perPage, filtered.length)} de {filtered.length}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded"
          >
            Anterior
          </button>

          <div className="px-3 py-1 border rounded">
            {page} / {totalPages}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageMovimientos;
