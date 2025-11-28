import { useEffect, useMemo, useState } from "react";
import ProductoCard from "../components/ProductoCard";
import { useProducto } from "../context/Producto.context";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/Carrito.context";
import { useForm } from "react-hook-form";

function PagePruebas() {
  const { carrito, addProducto,getVentas } = useCarrito();
    const { register, setValue, handleSubmit, reset } = useForm();
  
 
  

 
 
 
  useEffect(() => {
    console.log("Carrito actualizado:", getVentas());
  }, [ ])

  return (
    <div>   
       Pruebas
      </div>
  );
}

export default PagePruebas;
