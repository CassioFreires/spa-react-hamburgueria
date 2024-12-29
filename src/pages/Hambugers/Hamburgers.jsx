import { useState, useEffect } from "react";
import HamburgerCard from "../../components/HamburgerCard/HamburguerCard";
import { Link } from "react-router-dom";
import { getAllHamburgers } from "../../services/service-hamburguers.js";

const Hamburguers = () => {
    const [cart, setCart] = useState([]);
    const [isAdded, setIsAdded] = useState(null);
    const [burgers, setBurgers] = useState([]);  // Estado para armazenar os hambúrgueres
    const cartLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
    const cartPromotionLocalStorage = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const cartComboBurgerLocalHistorage = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const cartDrinksLocalHistorage = JSON.parse(localStorage.getItem('drinks')) || [];

    const allItemsLocalHistorage = [...cartLocalStorage, ...cartPromotionLocalStorage, ...cartComboBurgerLocalHistorage, ...cartDrinksLocalHistorage];

    useEffect(() => {
        // Chama a função para obter os hambúrgueres da API
        const fetchBurgers = async () => {
            const data = await getAllHamburgers();
            setBurgers(data);  // Atualiza o estado com os hambúrgueres recebidos
        };

        fetchBurgers();
    }, []); // O efeito é executado uma única vez, quando o componente for montado

    const addToCart = (burger) => {
        setCart((prevCart) => [...prevCart, burger]);
        setIsAdded(`${burger.name} adicionado ao carrinho!`);
        setTimeout(() => {
            setIsAdded(null);
        }, 1000);
    };

    return (
        <>
            {/* Link para visualizar o carrinho */}
            <div className="mt-4 text-center">
                <Link to="/cart" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400">
                    Ver Carrinho ({allItemsLocalHistorage.length})
                </Link>
            </div>
            {isAdded && (
                <div className="text-green-500 text-center mt-2">Item adicionado ao carrinho!</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {/* Mapeando os hambúrgueres para exibir os cards */}
                {burgers.map((burger) => (
                    <HamburgerCard key={burger.id} burger={burger} addToCart={addToCart} />
                ))}
            </div>
        </>
    );
};

export default Hamburguers;
