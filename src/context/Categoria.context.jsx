import { createContext, useContext, useState } from "react";
import { createCategoriaRequest, deleteCategoriaRequest, getCategoriaRequest, getCategoriasRequest, updateCategoriaRequest } from "../api/Categoria";
const categoriaContext = createContext();

export const useCategoria = () => {
    try {
        const context = useContext(categoriaContext);

        if (!context) {
            throw new Error("useTask must be used widthin a categoriaProvider")
        }
        return context;

    } catch (error) {
        console.log("errores de useProducto", error)
    }
}

export function CategoriaProvider({ children }) {
    const [categorias, setCategorias] = useState([]);

    const createCategoria = async (categoria) => {
        {
            try {
                const res = await createCategoriaRequest(categoria)
            } catch (error) {
                console.log(error)

            }
        }
    }

    const getCategorias = async () => {
        try {
            const res = await getCategoriasRequest()
            setCategorias(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    /*  const getCategoriaDesactivados = async () => {
      try {
          const res = await getProductosDesactivadosRequest()
          console.log(res)
           setProductos(res.data)
      } catch (error) {
          console.log(error)
      }
  }
*/

    const deleteCategoria = async (id) => {

        try {
            const res = await deleteCategoriaRequest(id)
            if (res.status == 204) setCategorias(categorias.filter(categoria => categoria._id != id))
        } catch (error) {
            console.log(error)
        }

    }


    /*const activarProducto = async (id) => {

        try {
            const res = await activarProductoRequest(id)
            if (res.status == 204) setProductos(productos.filter(prducto => prducto._id != id))
        } catch (error) {
            console.log(error)
        }

    }*/


    const getOnlyOneCategoria = async (id) => {
        try {
            const res = await getCategoriaRequest(id)
            setCategorias(res.data)

        } catch (error) {
            console.log(error)

        }
    }
    const updateCategoria = async (id, categoria) => {
        try {
            await updateCategoriaRequest(id, categoria);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <categoriaContext.Provider
            value={{
                categorias,
                createCategoria,
                getCategorias,
                deleteCategoria,
                getOnlyOneCategoria,
                updateCategoria,
            }}
        >
            {children}
        </categoriaContext.Provider>
    )
}