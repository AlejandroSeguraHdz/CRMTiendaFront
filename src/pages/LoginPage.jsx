import { useForm } from "react-hook-form"

import { useAuth } from "../context/Auth.context";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { singin, isAuthenticated, registerErrors } = useAuth()
    const navigate = useNavigate()
  /*  useEffect(() => {
        if (isAuthenticated) navigate("/task");
    }, [isAuthenticated])*/

    const onSubmit = handleSubmit(async (values) => {
        singin(values)


    });

    useEffect(()=>{
            if(isAuthenticated) navigate("/producto")
    },[isAuthenticated])
    return (
        <div className=" flex h-[calc(100vh-100px)] items-center justify-center" >
            <div className=" bg-zinc-800 max-w-md  w-full p-10 rounded-md">
                {
                    registerErrors.length > 0 &&
                    registerErrors.map((err, i) => (
                        <div key={i} className="bg-red-500 p-2 text-white my-1">
                            {err}
                        </div>
                    ))
                }

                <h1 className=" text-2xl font bold">Login</h1>
                <form onSubmit={onSubmit}
                >

                    <input type="text" {...register('noEmpleado', { required: true })}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="noEmpleado" />
                    {errors.noEmpleado && <p className="text-red-500"> Numero de empleado es requerido </p>}

                    <input type="password"{...register('password', { required: true })}
                        className=" w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Password" />
                    {errors.password && <p className="text-red-500"> Password is required </p>}

                    <button type="submit" className="bg-gray-500 hover:bg-gray-600 text-white w-full h-10 rounded-md flex items-center justify-center">
                        Login</button>
                </form>
                <p className=" flex gap-x-2 justify-between">
                    Don't have an account? <Link to="/register" className="text-sky-500"> Sing Up  </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage