import { Link } from "react-router-dom";
import { useProducto } from "../context/Producto.context";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function ProductoCard({ producto }) {
    const { deleteProducto } = useProducto();

    const imagenSrc =
        producto.imagen && typeof producto.imagen === "string"
            ? producto.imagen.startsWith("data:")
                ? producto.imagen
                : `data:image/png;base64,${producto.imagen}`
            : "https://via.placeholder.com/150?text=Sin+imagen";

    return (
        <div className="bg-zinc-800 w-full max-w-4xl p-6 rounded-md shadow-lg mx-auto">
            <header className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-700 flex items-center justify-center">
                        <img
                            src={imagenSrc}
                            alt={producto.nombre}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* BOTONES */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Desactivar */}
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        onClick={() => deleteProducto(producto._id)}
                    >
                        Desactivar
                    </button>

                    {/* Inventario */}
                    <Link
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-center"
                        to={`/inventario/${producto._id}`}
                    >
                        Inventario
                    </Link>

                    {/* Editar */}
                    <Link
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center"
                        to={`/producto/${producto._id}`}
                    >
                        Editar
                    </Link>

                    {/* Movimientos */}
                    <Link
                        className="bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-md text-center"
                        to={`/verMovimientos/${producto._id}`}
                    >
                        Movimientos
                    </Link>
                </div>
            </header>

            {/* INFO */}
            <div className="text-slate-300 space-y-1">
                <h1 className="text-2xl font-bold text-white">{producto.nombre}</h1>
                <p><strong>Codigo:</strong> {producto.codigo || "Sin Codigo"}</p>
                <p><strong>Categoría:</strong> {producto.categoria.nombre || "Sin categoría"}</p>
                <p><strong>Precio:</strong> {producto.precio}</p>
                <p><strong>Cantidad:</strong> {producto.cantidad}</p>
            </div>
        </div>
    );
}

export default ProductoCard;
