// src/pages/PageUsuarios.jsx
import { useEffect, useMemo, useState } from "react";
import { useUsuario } from "../context/Usuario.context";
import { Link } from "react-router-dom";
import UsuarioCard from "../components/UsuarioCard";

function PageUsuarios() {
  const { deleteUsuario, getUsuarios, usuarios } = useUsuario();

  // estados para búsqueda y orden
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("username"); // username | email | createdAt
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

useEffect (()=>{
      getUsuarios();

},[])

  useEffect(() => {
    getUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lista filtrada, buscada y ordenada
  const usuariosVisibles = useMemo(() => {
    let list = Array.isArray(usuarios) ? [...usuarios] : [];

    // búsqueda por username o email
    if (query.trim() !== "") {
      const q = query.trim().toLowerCase();
      list = list.filter((u) => {
        const username = (u.username || "").toString().toLowerCase();
        const email = (u.email || "").toString().toLowerCase();
        return username.includes(q) || email.includes(q);
      });
    }

    // ordenamiento
    list.sort((a, b) => {
      // soporte para campos anidados o fechas
      let valA = "";
      let valB = "";

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        valA = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
        valB = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
      } else {
        valA = ((a[sortBy] || "") + "").toString().toLowerCase();
        valB = ((b[sortBy] || "") + "").toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [usuarios, query, sortBy, sortOrder]);

  return (
    <>
      {/* acciones top */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/register"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Agregar Usuario
          </Link>
        </div>

        {/* buscador + filtros */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por username o email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 rounded-md bg-zinc-700 text-white w-full sm:w-80"
            autoComplete="off"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-md bg-zinc-700 text-white"
          >
            <option value="username">Ordenar por username</option>
            <option value="email">Ordenar por email</option>
            <option value="createdAt">Ordenar por fecha (creado)</option>
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

      {/* grid de usuarios */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {usuariosVisibles.length === 0 ? (
          <div className="col-span-full">
            <h1 className="text-white text-xl">No se encontraron usuarios</h1>
            {usuarios.length === 0 && (
              <p className="text-slate-400">Aún no hay usuarios en la base de datos.</p>
            )}
          </div>
        ) : (
          usuariosVisibles.map((u) => (
            // si tu UsuarioCard espera prop 'usuario', pásalo así:
            // <UsuarioCard usuario={u} key={u._id} />
            // si espera 'producto' (por compatibilidad), pásalo con producto={u}
            <UsuarioCard usuario={u} key={u._id} deleteUsuario={() => deleteUsuario(u._id)} />
          ))
        )}
      </div>
    </>
  );
}

export default PageUsuarios;
