import { Link } from "react-router-dom";
import { useAuth } from "../context/Auth.context";
import { useState } from "react";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

function NavBar() {
    const { isAuthenticated, logOut, user } = useAuth();

    const [isOpen, setIsOpen] = useState(true);         // Sidebar plegable
    const [openMenu, setOpenMenu] = useState(null);     // Submenús

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (

        <>
          {isAuthenticated ? (
            <div className="flex">
                {/* Sidebar */}
                <nav
                    className={`
                    h-screen bg-zinc-800 text-white p-4 transition-all duration-300
                    ${isOpen ? "w-64" : "w-16"}
                `}
                >

                    {/* Botón plegable */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mb-4 p-2 bg-zinc-700 rounded hover:bg-zinc-600"
                    >
                        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>

                    {/* Título */}
                    {isOpen && (
                        <h1 className="text-xl font-bold mb-6">
                            Gestor de Inventario
                        </h1>
                    )}

                    <ul className="flex flex-col gap-3">


                        {/* Bienvenida */}
                        {isOpen && (
                            <li className="font-semibold">
                                Bienvenido {user.nombres}
                            </li>
                        )}

                        {/* Inventario */}
                        <li>
                            <button
                                onClick={() => toggleMenu("inventario")}
                                className="w-full flex items-center gap-2 bg-zinc-700 px-3 py-2 rounded hover:bg-zinc-600"
                            >
                                <Menu size={18} />
                                {isOpen && <>Inventario ▾</>}
                            </button>

                            {openMenu === "inventario" && isOpen && (
                                <ul className="ml-6 mt-2 flex flex-col gap-2 text-sm">
                                    <li>
                                        <Link to="/Producto" className="hover:underline">
                                            Productos
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/categorias" className="hover:underline">
                                            Categorías
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/proveedores" className="hover:underline">
                                            Proveedores
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Usuarios */}
                        <li>
                            <button
                                onClick={() => toggleMenu("usuarios")}
                                className="w-full flex items-center gap-2 bg-zinc-700 px-3 py-2 rounded hover:bg-zinc-600"
                            >
                                <Menu size={18} />
                                {isOpen && <>Usuarios ▾</>}
                            </button>

                            {openMenu === "usuarios" && isOpen && (
                                <ul className="ml-6 mt-2 flex flex-col gap-2 text-sm">
                                    <li>
                                        <Link to="/usuarios" className="hover:underline">
                                            Lista de usuarios
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/roles" className="hover:underline">
                                            Roles
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Compras */}
                        <li>
                            <button
                                onClick={() => toggleMenu("compras")}
                                className="w-full flex items-center gap-2 bg-zinc-700 px-3 py-2 rounded hover:bg-zinc-600"
                            >
                                <Menu size={18} />
                                {isOpen && <>Compras ▾</>}
                            </button>

                            {openMenu === "compras" && isOpen && (
                                <ul className="ml-6 mt-2 flex flex-col gap-2 text-sm">
                                    <li>
                                        <Link to="/compras" className="hover:underline">
                                            Realizar una venta
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/ventas" className="hover:underline">
                                            Historial
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Logout */}
                        <li>
                            <button
                                onClick={logOut}
                                className="w-full bg-red-600 px-3 py-2 rounded hover:bg-red-700 text-left"
                            >
                                {isOpen ? "Cerrar Sesión" : "X"}
                            </button>
                        </li>


                    </ul>
                </nav>

                {/* CONTENIDO A LA DERECHA */}
                <div className="flex-1 p-5">
                    {/* Aquí va el contenido principal */}
                </div>
            </div>

         ) : ( <></>)   }
        </>
    );
}

export default NavBar;
