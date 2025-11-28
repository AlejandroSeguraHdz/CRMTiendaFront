import { Link } from "react-router-dom"
import { useAuth } from "../context/Auth.context"

function AtajosVender() {
    const { isAuthenticated, logOut, user } = useAuth()
    return (
        <>
            {isAuthenticated ? (
               <nav className="  my-3 flex justify-between py-2 px-10">
                    <Link to="/">
                    </Link>
                    <ul className="flex gap-x-2">

                        <>




                            <li>
                                <Link to='/compras'
                                    className="bg-green-500 px-4 py-1 rounded-sd"> Vender</Link>
                            </li>





                        </>


                    </ul>
                </nav>
            ) : ( <></>)
            }
        </>
    )
}

export default AtajosVender