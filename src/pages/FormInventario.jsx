import { useForm } from "react-hook-form"
import { useProducto } from "../context/Producto.context";
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc";
import { useCategoria } from "../context/Categoria.context";
dayjs.extend(utc);

function FormInventario() {
    const { register, setValue, handleSubmit, watch } = useForm()
    const { inventario, getOnlyOneProducto, updateProducto, producto, } = useProducto()
    const { getCategorias, categorias } = useCategoria();

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        const loadProducto = async () => {

            if (params.id) {
                await getOnlyOneProducto(params.id)
            }
        }
        loadProducto()
        getCategorias()
    }, [])


    useEffect(() => {



        if (params.id) {

            setValue('nombre', producto.nombre)
            setValue('cantidad', producto.cantidad)
            setValue('codigo', producto.codigo)

        }

    }, [producto])


    const onSubmit = handleSubmit(async (data) => {

       
        await inventario(data)
        navigate("/producto")

    })


    return (
        <div className=" flex h-[calc(100vh-100px)] items-center justify-center" >
            <div className=" bg-zinc-800 max-w-md  w-full p-10 rounded-md">
                <form onSubmit={onSubmit} encType="multipart/form-data">

                    <label htmlFor="codigo"> Codigo</label>
                    <input readOnly type="text" placeholder="codigo" {...register("codigo")}
                        className="w-full bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md my-2 border border-zinc-600 cursor-not-allowed"
                    />


                    <label htmlFor="nombre"> Nombre</label>
                    <input readOnly type="text" placeholder="Nombre" {...register("nombre")}
                        className="w-full bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md my-2 border border-zinc-600 cursor-not-allowed"
                    />


                    <label htmlFor="cantidad"> Cantidad Actual</label>
                    <input readOnly type="number" placeholder="Cantidad" {...register("cantidad")}
                        className="w-full bg-zinc-800 text-zinc-400 px-4 py-2 rounded-md my-2 border border-zinc-600 cursor-not-allowed"
                    />


                    <label htmlFor="nuevaCantidad"> Nueva Cantidad </label>
                    <input type="number" placeholder="Cantidad" {...register("nuevaCantidad")} className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />


                    <label htmlFor="comentarios">Comentarios</label>
                    <textarea
                        placeholder="Comentarios"
                        {...register("comentarios")}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 h-28 resize-none"
                    ></textarea>



                    <button className="bg-indigo-500 px-3 py-2 rounded-md">
                        Save
                    </button>
                </form>
            </div>
        </div>
    )
}

export default FormInventario
