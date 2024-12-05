import { useState } from "react";
import HamburgerCard from "../../components/HamburgerCard/HamburguerCard";
import burgers from '../../services/dataHamburguers.js';
import { Link } from "react-router-dom";


const Hamburguers = () => {

    const [cart, setCart] = useState([]);
    const [isAdded, setIsAdded] = useState(null);
    const cartLocalStorage = JSON.parse(localStorage.getItem('cart'));
    console.log(cartLocalStorage)

    const addToCart = () => {
        setCart((prevCart) => [...prevCart, burgers]);
        setIsAdded(`${burgers.name} adicionado ao carrinho!`);

        setTimeout(() => {
            setIsAdded(null);
          }, 1000);
    }

    return (
        <>   {/* Link para visualizar o carrinho */}
            <div className="mt-4 text-center">
                <Link to="/cart" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400">
                    Ver Carrinho ({cartLocalStorage.length})
                </Link>
            </div>
            {isAdded && (
                <div className="text-green-500 text-center mt-2">Item adicionado ao carrinho!</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {burgers.map((burger) => (<HamburgerCard key={burger.id} burger={burger} addToCart={addToCart} />))}
            </div>

        </>
    )
}

export default Hamburguers;