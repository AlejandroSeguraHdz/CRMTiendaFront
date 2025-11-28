import { CartProvider } from "./context/Cart.context";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  const productos = [
    { _id: "1", nombre: "Producto A", descripcion: "Desc A", precio: 100 },
    { _id: "2", nombre: "Producto B", descripcion: "Desc B", precio: 200 },
    { _id: "3", nombre: "Producto C", descripcion: "Desc C", precio: 150 },
  ];

  return (
    <CartProvider>
      <div className="flex gap-4 p-4">
        <div className="flex-1">
          <ProductList productos={productos} />
        </div>
        <div className="w-96">
          <Cart />
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
