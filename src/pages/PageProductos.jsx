import { useEffect, useMemo, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { useProducto } from "../context/Producto.context";
import { Link } from "react-router-dom";

function PageProductos() {
  const { deleteProducto, getProductos, productos } = useProducto();

  // estados para búsqueda, filtro y orden
  const [query, setQuery] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("all"); // "all" = sin filtro
  const [sortBy, setSortBy] = useState("nombre"); // "nombre" o "categoria"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  useEffect(() => {
    getProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // obtener lista única de categorías a partir de productos
  const categorias = useMemo(() => {
  // console.log(productos)

    const setCats = new Set();
    productos.forEach((p) => {
       if (p.categoria) setCats.add(p.categoria.nombre);
    });
    return ["all", ...Array.from(setCats)];
  }, [productos]);

  // lista filtrada, buscada y ordenada
  const productosVisibles = useMemo(() => {
    // copia para no mutar original
    let list = Array.isArray(productos) ? [...productos] : [];

    // filtro por categoría
    if (categoriaFilter !== "all") {
      list = list.filter(
        (p) =>
          p.categoria.nombre &&
          p.categoria.nombre.toString().toLowerCase() ===
            categoriaFilter.toString().toLowerCase()
      );
    }

    // búsqueda (por nombre, sku y descripción)
    if (query.trim() !== "") {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => {
        const nombre = (p.nombre || "").toString().toLowerCase();
        const sku = (p.sku || "").toString().toLowerCase();
        const descripcion = (p.descripcion || "").toString().toLowerCase();
        return (
          nombre.includes(q) ||
          sku.includes(q) ||
          descripcion.includes(q)
        );
      });
    }

    // ordenamiento
    list.sort((a, b) => {
      const keyA = ((a[sortBy] || "") + "").toString().toLowerCase();
      const keyB = ((b[sortBy] || "") + "").toString().toLowerCase();

      if (keyA < keyB) return sortOrder === "asc" ? -1 : 1;
      if (keyA > keyB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [productos, categoriaFilter, query, sortBy, sortOrder]);

  return (
    <>
      {/* acciones top */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/add-producto"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Agregar Productos
          </Link>
        </div>

        {/* buscador + filtros */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o descripción..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 rounded-md bg-zinc-700 text-white w-full sm:w-80"
            autoComplete="off"
          />

          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-zinc-700 text-white"
          >
            {categorias.map((c) => (
              <option value={c} key={c}>
                {c === "all" ? "Todas las categorías" : c}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-md bg-zinc-700 text-white"
          >
            <option value="nombre">Ordenar por nombre</option>
            <option value="categoria">Ordenar por categoría</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 rounded-md bg-zinc-700 text-white"
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      {/* grid de productos */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {productosVisibles.length === 0 ? (
          <div className="col-span-full">
            <h1 className="text-white text-xl">No se encontraron productos</h1>
            {productos.length === 0 && (
              <p className="text-slate-400">Aún no hay productos en la base de datos.</p>
            )}
          </div>
        ) : (
          productosVisibles.map((p) => (
            <ProductoCard producto={p} key={p._id} />
          ))
        )}
      </div>
    </>
  );
}

export default PageProductos;
