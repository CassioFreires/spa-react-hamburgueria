import { useState, useEffect } from "react";
import { getAllCombos } from "../../services/service-combos"; // Função para buscar os combos
import { Link } from "react-router-dom";
import ComboCard from "../../components/ComboCard/ComboCard";

const Combos = () => {
    const [cart, setCart] = useState([]);
    const [isAdded, setIsAdded] = useState(null);
    const [combos, setCombos] = useState([]);  // Estado para armazenar os combos

    // Obtendo itens do localStorage, se existirem
    const cartPromotionLocalStorage = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const cartLocalHistorage = JSON.parse(localStorage.getItem('cart')) || [];
    const cartComboBurgerLocalHistorage = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const cartDrinksLocalHistorage = JSON.parse(localStorage.getItem('drinks')) || [];
    
    // Combinando todos os itens do localStorage
    const allItemsLocalHistorage = [...cartPromotionLocalStorage, ...cartLocalHistorage, ...cartComboBurgerLocalHistorage, ...cartDrinksLocalHistorage]; 

    // Função para adicionar ao carrinho
    const addToCart = (combo) => {
        setCart((prevCart) => [...prevCart, combo]);
        setIsAdded(`${combo.name} adicionado ao carrinho!`);
        setTimeout(() => {
            setIsAdded(null);
        }, 1000);
    }

    // Usando useEffect para buscar os combos da API
    useEffect(() => {
        const fetchCombos = async () => {
            const data = await getAllCombos();
            setCombos(data);
        };

        fetchCombos();
    }, []); // O efeito é executado uma única vez, quando o componente for montado

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
                {combos.map((combo) => (
                    <ComboCard key={combo.combo_id} burger={combo} addToCart={addToCart} />
                ))}
            </div>
        </>
    );
}

export default Combos;
