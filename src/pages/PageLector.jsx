import { useEffect, useMemo } from "react";
import { useProducto } from "../context/Producto.context";
import { useForm } from "react-hook-form";

function PageLector() {
  const { getProductoXCodigo, producto } = useProducto();
  const { register, setValue, handleSubmit, reset } = useForm();

  const onSubmit = handleSubmit((data) => {
    // llama la acción que carga el producto en el contexto
    getProductoXCodigo(data.codigo);
    // limpiar input
    setValue("codigo", "");
  });

  // normalizar producto: puede venir como array o como objeto
  const productoL = useMemo(() => {
    if (!producto) return null;
    if (Array.isArray(producto)) return producto[0] || null;
    return producto;
  }, [producto]);

  // construir src válido para <img>
  const imagenSrc = useMemo(() => {
    if (!productoL || !productoL.imagen) return null;

    // si ya viene con prefijo data: lo usamos tal cual
    if (typeof productoL.imagen === "string" && productoL.imagen.startsWith("data:")) {
      return productoL.imagen;
    }

    // si viene sólo base64 (sin data:) lo preparamos (asumimos PNG si no hay mime)
    if (typeof productoL.imagen === "string") {
      return `data:image/png;base64,${productoL.imagen}`;
    }

    // si por alguna razón viene como Buffer convertido a objeto (no esperado en front),
    // podrías necesitar que el backend ya devuelva la dataURL. Aquí asumimos que no pasa.
    return null;
  }, [productoL]);

  // formato para fechas y precio
  const formatoFecha = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={onSubmit} className="mb-4">
        <input
          type="text"
          placeholder="codigo"
          autoComplete="off"
          {...register("codigo")}
          autoFocus
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        />
      </form>

      {/* Botón para limpiar la vista */}
      <div className="mb-4">
        <button
          className="px-3 py-1 bg-red-600 text-white rounded mr-2"
          onClick={() => {
            // si tu contexto tiene función para limpiar, úsala; si no, con reset limpiamos el input
            reset();
          }}
        >
          Limpiar búsqueda
        </button>
      </div>

      {/* Mostrar el producto si existe */}
      {productoL ? (
        <div className="p-4 border rounded-md shadow">
          <div className="flex gap-4 items-start">
            <div>
              {imagenSrc ? (
                <img
                  src={imagenSrc}
                  alt={productoL.nombre || "Producto"}
                  className="w-48 h-auto mt-2 rounded-md border"
                />
              ) : (
                <div className="w-48 h-32 mt-2 rounded-md border flex items-center justify-center text-sm text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{productoL.nombre || "—"}</h2>
              <p className="text-sm text-gray-600 mb-2">{productoL.descripcion || "—"}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>SKU:</strong> {productoL.sku ?? "-"}</div>
                <div><strong>Código:</strong> {productoL.codigo ?? "-"}</div>

                <div>
                  <strong>Precio:</strong>{" "}
                  {productoL.precio != null ? Number(productoL.precio).toLocaleString() : "-"}
                </div>

                <div><strong>Cantidad:</strong> {productoL.cantidad ?? "-"}</div>

                <div><strong>Categoría:</strong> {productoL.categoria ?? "-"}</div>
                <div><strong>Activo:</strong> {productoL.activo ? "Sí" : "No"}</div>

                <div><strong>Creado:</strong> {formatoFecha(productoL.createdAt)}</div>
                <div><strong>Actualizado:</strong> {formatoFecha(productoL.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No hay producto seleccionado.</p>
      )}
    </div>
  );
}

export default PageLector;
