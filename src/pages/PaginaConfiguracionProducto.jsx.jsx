import { useEffect } from "react"

import { useProducto } from "../context/Producto.context";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCategoria } from "../context/Categoria.context";


function PaginaConfiguracionProducto() {
    const { register, setValue, handleSubmit } = useForm()

    const { productos, getOnlyOneProducto } = useProducto()
    const { getCategorias, categorias } = useCategoria();

    const params = useParams()
    useEffect(() => {
        getCategorias()

        if (params.id) {
            getOnlyOneProducto(params.id)


        }


    }, [])

    useEffect(() => {

        setValue('sku', productos.sku)
        setValue('nombre', productos.nombre)
        setValue('descripcion', productos.descripcion)
        setValue('precio', productos.precio)
        setValue('cantidad', productos.cantidad)
        setValue('categoria', productos.categoria || ''); // solo el id




    }, [productos])

    return (
        <div className="h-screen">
            <div className="bg-zinc-900   ">
                <form>
                    <div className="p-6 h-full flex flex-col text-bold">
                        <input
                            type="text"
                            placeholder="nombre"
                            {...register("nombre")}
                            autoFocus
                            className=" w-full  text-white px-4 py-2  my-2" />


                        <div className=" grid grid-cols-2 grid-rows-1 gap-4 ">
                            <div >
                                <div className=" py-1 sm-grid-cols-2 md:grid-cols1 gap-2  ">
                                    <label className="px-2">SKU  </label>
                                    <input
                                        type="text"
                                        placeholder="SKU"
                                        {...register("sku")}
                                        autoFocus
                                        className="   text-white px-4 py-2 rounded-md my-2 w-full" />
                                </div>
                                <div className=" sm-grid-cols-2 md:grid-cols1 gap-2  ">
                                    <label className="px-2 ">Descripcion  </label>
                                    <input
                                        type="text"
                                        placeholder="Descripcion"
                                        {...register("descripcion")}
                                        autoFocus
                                        className="    text-white px-4 py-2 rounded-md my-2 w-full" />
                                </div>

                                <div className=" sm-grid-cols-2 md:grid-cols1 gap-2  ">
                                    <label className="px-2">Precio  </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Precio"
                                        {...register("precio")}
                                        autoFocus
                                        className="    text-white px-4 py-2 rounded-md my-2 w-full" />
                                </div>

                                <div className=" sm-grid-cols-2 md:grid-cols1 gap-2  ">
                                    <label className="px-2">Cantidad  </label>
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        {...register("cantidad")}
                                        autoFocus
                                        className="    text-white px-4 py-2 rounded-md my-2 w-full" />
                                </div>
                            </div>
                            {/* Segunda tablas */}
                            <div>
                                <div className=" py-1 sm-grid-cols-2 md:grid-cols1 gap-2  ">
                                    <label className="px-2">Impuesto  </label>
                                    <input
                                        type="text"
                                        placeholder="SKU"

                                        autoFocus
                                        className="   text-white px-4 py-2 rounded-md my-2 w-full" />
                                </div>
                                <label htmlFor="categoria">Categoría</label>
                                <select
                                    {...register("categoria")}
                                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {Array.isArray(categorias) &&
                                        categorias.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.nombre}
                                            </option>
                                        ))}
                                </select>

                                <div className=" sm-grid-cols-2 md:grid-cols1 gap-2  ">
                                    <label className="px-2">Precio  </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Precio"
                                        autoFocus
                                        className="    text-white px-4 py-2 rounded-md my-2 w-full" />
                                </div>

                                <div className=" sm-grid-cols-2 md:grid-cols1 gap-2  ">
                                    <label className="px-2">Cantidad  </label>
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        autoFocus
                                        className="    text-white px-4 py-2 rounded-md my-2 w-full" />
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-indigo-500 px-3 py-2 rounded-md">
                            Guardar
                        </button>
                    </div>

                </form>




            </div>
        </div>
    )



}

export default PaginaConfiguracionProducto