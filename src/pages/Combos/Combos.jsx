import ComboCard from "../../components/ComboCard/ComboCard";
import dataComboBurger from '../../services/dataCombos';
import { useState } from "react";
import { Link } from "react-router-dom";

const Combos = () => {
    const [cart, setCart] = useState([]);
    const [isAdded, setIsAdded] = useState(null);

    // Obtendo itens do localStorage, se existirem
    const cartPromotionLocalStorage = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const cartLocalHistorage = JSON.parse(localStorage.getItem('cart')) || [];
    const cartComboBurgerLocalHistorage = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const cartDrinksLocalHistorage = JSON.parse(localStorage.getItem('drinks')) || [];
    
    // Combinando todos os itens do localStorage
    const allItemsLocalHistorage = [...cartPromotionLocalStorage, ...cartLocalHistorage, ...cartComboBurgerLocalHistorage, ...cartDrinksLocalHistorage]; 

    const addToCart = () => {
        // Atualizando o estado do carrinho
        setCart((prevCart) => [...prevCart, dataComboBurger]);
        setIsAdded(`${dataComboBurger.name} adicionado ao carrinho!`);

        setTimeout(() => {
            setIsAdded(null);
        }, 1000);
    }

    return (
        <>
            <div className="mt-4 text-center">
                <Link to="/cart" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400">
                    Ver Carrinho ({allItemsLocalHistorage.length})
                </Link>
            </div>
            {isAdded && (
                <div className="text-green-500 text-center mt-2">Item adicionado ao carrinho!</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {dataComboBurger.map((burger) => (
                    <ComboCard key={burger.id} burger={burger} addToCart={addToCart} />
                ))}
            </div>
        </>
    );
}

export default Combos;
