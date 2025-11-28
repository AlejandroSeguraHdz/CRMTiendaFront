import { useEffect } from "react"

import { useCategoria } from "../context/Categoria.context";
import CategoriaCard from "../components/CategoriaCard";
import { Link } from "react-router-dom";


function PageCategorias() {
  const { getCategorias, categorias } = useCategoria();

  useEffect(() => {
    getCategorias()
  }, [])


  if (categorias.length == 0) return (<h1 > No Categorias</h1>)
  return (

    <>
      <div className="mb-4  flex justify-end">
        <Link
          to="/add-categoria"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Agregar Categorias
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        {categorias.map((p) => (
          <CategoriaCard categoria={p} key={p._id} />
        ))}
      </div>
    </>
  )



}

export default PageCategorias