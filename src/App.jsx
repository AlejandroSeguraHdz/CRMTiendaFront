import { BrowserRouter, Routes, Route } from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"

import { AuthProvider } from "./context/Auth.context"
import TaskPage from "./pages/TaskPage"
import TaskFormPage from "./pages/TaskFormPage"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./protectetRoute"
import LoginPage from "./pages/LoginPage"
import { TaskProvider } from "./context/Task.context"
import NavBar from "./components/Navbar"
import PaginaProducto from "./pages/PaginaProducto"
import { ProductoProvider } from "./context/Producto.context"
import FormProductos from "./pages/FormProductos"
import PaginaProductosDesactivados from "./pages/PaginaProductosDesactivados"
import PageProductos from "./pages/PageProductos"
import PaginaConfiguracionProducto from "./pages/PaginaConfiguracionProducto.jsx"
import PageCategorias from "./pages/PageCategorias.jsx"
import { CategoriaProvider } from "./context/Categoria.context.jsx"
import FormCategorias from "./pages/FormCategorias.jsx"
import PageLector from "./pages/PageLector.jsx"
import PageUsuarios from "./pages/PageUsuarios.jsx"
import { UsuarioProvider } from "./context/Usuario.context.jsx"
import { CarritoProvider } from "./context/Carrito.context.jsx"
import PageCompras from "./pages/PageCompras.jsx"
import PagePruebas from "./pages/PagePruebas.jsx"
import PageVentas from "./pages/PageVentas.jsx"
import { VentaProvider } from "./context/Venta.context.jsx"
import PageMovimientos from "./pages/PageMovimientos.jsx";
import { MovimientoProvider } from "./context/Movimiento.context.jsx";
import AtajosVender from "./components/AtajosVender.jsx";

import FormInventario from "./pages/FormInventario.jsx";
import  PageChecador  from "./pages/PageChecador.jsx";
function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <UsuarioProvider>
          <ProductoProvider>
            <CategoriaProvider>
              <VentaProvider>
                <TaskProvider>
                     <MovimientoProvider>

                      <CarritoProvider>
                        <div className="flex">

                          {/* SIDEBAR IZQUIERDO */}
                          <NavBar />

                          {/* CONTENIDO DE LA APP */}
                          <main className="flex-1 p-5">
                            <AtajosVender />
                            <Routes>
                              <Route path="/" element={<HomePage />} />
                              <Route path="/login" element={<LoginPage />} />

                              <Route element={<ProtectedRoute />}>
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/task" element={<TaskPage />} />
                                <Route path="/add-task" element={<TaskFormPage />} />
                                <Route path="/task/:id" element={<TaskFormPage />} />
                                <Route path="/profile" element={<ProfilePage />} />

                                <Route path="/producto" element={<PageProductos />} />
                                <Route path="/add-producto" element={<FormProductos />} />
                                <Route path="/producto/:id" element={<FormProductos />} />
                                <Route path="/productos-desactivados" element={<PaginaProductosDesactivados />} />
                                <Route path="/producto-tabla" element={<PaginaProducto />} />
                                <Route path="/producto-configurar/:id" element={<PaginaConfiguracionProducto />} />
                                <Route path="/verMovimientos/:id" element={<PageMovimientos />} />
                                <Route path="/inventario/:id" element={<FormInventario />} />

                                <Route path="/categorias" element={<PageCategorias />} />
                                <Route path="/add-categoria" element={<FormCategorias />} />
                                <Route path="/categorias/:id" element={<FormCategorias />} />

                                <Route path="/Lector" element={<PageLector />} />
                                <Route path="/Usuarios" element={<PageUsuarios />} />

                                <Route path="/compras" element={<PageCompras />} />
                                <Route path="/pruebas" element={<PagePruebas />} />
                                <Route path="/ventas" element={<PageVentas />} />

                                <Route path="/checador" element={<PageChecador />} />


                              </Route>

                            </Routes>
                          </main>

                        </div>

                      </CarritoProvider>
                    </MovimientoProvider>
                </TaskProvider>
              </VentaProvider>
            </CategoriaProvider>
          </ProductoProvider>
        </UsuarioProvider>
      </AuthProvider>
    </BrowserRouter>

  )
}

export default App


