import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { useCategoria } from "../context/Categoria.context";
 

function FormCategorias() {

    const { register, setValue, handleSubmit } = useForm()
    const { createCategoria, getOnlyOneCategoria,updateCategoria } = useCategoria()
    const navigate = useNavigate()
    const params = useParams()

    const onSubmit = handleSubmit((data) => {
        if (params.id) {
            updateCategoria(params.id,data)
            navigate("/categorias")
        }
        else {
            createCategoria(data);
            navigate("/categorias")
        }
    })
    
    
        useEffect(() => {
            const loadCategoria = async () => {
                if (params.id) {
                    const categoria = await getOnlyOneProducto(params.id)
                    setValue('codigo', categoria.codigo)
                    setValue('nombre', categoria.nombre)
                    setValue('descripcion', categoria.descripcion)

                }
            }
            loadCategoria()
    
        }, [])
    return (

        <div className=" flex h-[calc(100vh-100px)] items-center justify-center" >
            <div className=" bg-zinc-800 max-w-md  w-full p-10 rounded-md">
                <form onSubmit={onSubmit}>
                    <label htmlFor="sku"> Codigo</label>
                    <input
                        type="text"
                        placeholder="Codigo"
                        {...register("codigo")}
                        autoFocus
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                    <label htmlFor="nombre"> Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        {...register("nombre")}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                    <label htmlFor="descripcion"> Descripcion</label>
                    <input
                        type="text"
                        placeholder="descripcion"
                        {...register('descripcion')}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

                   
 
                    <button
                        className="bg-indigo-500 px-3 py-2 rounded-md">
                        Save
                    </button>
                </form>
            </div>
        </div>
    )

}

export default FormCategorias