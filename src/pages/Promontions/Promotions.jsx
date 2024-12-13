import dataPromotionBurgers from '../../services/dataPromotions'
import PromotionCard from "../../components/PromotionCard/PromotionCard";
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Promotion = () => {
    const [cart, setCart] = useState([]);
    const [isAdded, setIsAdded] = useState(null);
    const cartPromotionLocalStorage = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const cartLocalHistorage = JSON.parse(localStorage.getItem('cart')) || [];
    const cartComboBurgerLocalHistorage = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const cartDrinksLocalHistorage = JSON.parse(localStorage.getItem('drinks')) || [];
    
    const allItemsLocalHistorage = [...cartPromotionLocalStorage, ...cartLocalHistorage, ...cartComboBurgerLocalHistorage, ...cartDrinksLocalHistorage]; // expalhando todos os itens do localhistorage

    const addToCart = () => {
        setCart((prevCart) => [...prevCart, dataPromotionBurgers]);
        setIsAdded(`${dataPromotionBurgers.name} adicionado ao carrinho!`);

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
                {dataPromotionBurgers.map((burger) => (<PromotionCard key={burger.id} burger={burger} addToCart={addToCart} />))}
            </div>
        </>

    )
}

export default Promotion;