// src/components/UsuarioCard.jsx
import { Link } from "react-router-dom";
import { useUsuario } from "../context/Usuario.context";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function UsuarioCard({ usuario }) {
  const { deleteUsuario } = useUsuario();

  if (!usuario) return null;

 

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Eliminar al usuario "${usuario.username}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    try {
      await deleteUsuario(usuario._id);
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      alert("No se pudo eliminar el usuario. Revisa la consola.");
    }
  };

  const initials = (usuario.username || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-zinc-800 w-full max-w-4xl p-6 rounded-md shadow-lg mx-auto">
      <header className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-4">
 
         

          <div>
            <h1 className="text-2xl font-bold text-white">{usuario.noEmpleado}</h1>
            <p className="text-slate-300">{usuario.nombres+" "+usuario.apellidoP+" "+usuario.apellidoM}</p>
        
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={handleDelete}
          >
            Desactivar
          </button>

          <Link
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center"
            to={`/edit-usuario/${usuario._id}`}
          >
            Editar
          </Link>
        </div>
      </header>

      {/* info extra si la quieres */}
      <div className="text-slate-300 space-y-1">
        {/* Añade aquí más campos si los tienes, por ejemplo rol, estado, etc. */}
      </div>
    </div>
  );
}

export default UsuarioCard;
