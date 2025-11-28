import { Link } from "react-router-dom";
   
function CategoriaCard({ categoria }) {
 
    return (
        <div className=" bg-zinc-800 max-w-md w-full p-6 rounded-md">
            
            <div className="grid grid-cols-2 py-2">
                            <h1 className="text-2xl font-bold text-white">{categoria.nombre}</h1>

             <p className="text-slate-300"> Codigo: {categoria.codigo}</p>
            </div>
            
                 
                <div className="flex gap-x-2">
                    <button
                        className="bg-red-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                     >
                        Desactivar
                    </button>

                    <Link
                        className="bg-blue-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        to={`/producto-configurar/${categoria._id}`}
                    >
                        Edit
                    </Link>
                </div>
         </div>
    );
}

export default CategoriaCard;
