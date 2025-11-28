import { useForm } from "react-hook-form"

import { useAuth } from "../context/Auth.context";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { singup, isAuthenticated, registerErrors } = useAuth()
    const navigate = useNavigate()

    const onSubmit = handleSubmit(async (values) => {
        try {
            singup(values)
            navigate("/usuarios")

        } catch (error) {

        }
    });


    return (
        <center>
            <div className=" flex h-[calc(100vh-100px)] items-center justify-center" >
                <div className=" bg-zinc-800 max-w-md  w-full p-10 rounded-md">
                    {
                        registerErrors.length > 0 &&
                        registerErrors.map((err, i) => (
                            <div key={i} className="bg-red-500 p-2 text-white ">
                                {err}
                            </div>
                        ))
                    }
                    <h1 className=" text-2xl font bold">Registrar Usuario</h1>

                    <form onSubmit={onSubmit}
                    >
                        <input type="text" {...register('noEmpleado', { required: true })}
                            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder="Numero de empleado" />
                        {errors.username && <p className="text-red-500"> noEmleado is requerido </p>}
                        
                         <input type="text" {...register('nombres', { required: true })}
                            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder="Nombres" />
                        {errors.username && <p className="text-red-500"> Los nombres son requeridos </p>}

                         <input type="text" {...register('apellidoP', { required: true })}
                            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder="Apellido paterno" />
                        {errors.username && <p className="text-red-500"> Apellido paterno es requerido </p>}

                         <input type="text" {...register('apellidoM', { required: true })}
                            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder="Apellido materno" />
                        {errors.username && <p className="text-red-500"> Apellido materno es requerido </p>}

                        <input type="email" {...register('email', { required: true })}
                            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder="Email" />
                        {errors.email && <p className="text-red-500"> Email es requiredo </p>}

                        <input type="password"{...register('password', { required: true })}
                            className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                            placeholder="Contraseña" />
                        {errors.password && <p className="text-red-500"> Contraseña es requireda </p>}

                        <button type="submit" className="bg-gray-500 hover:bg-gray-600 text-white w-full h-10 rounded-md flex items-center justify-center">
                            Registrar</button>
                    </form>

                </div>
            </div>
        </center>
    )
}

export default RegisterPage