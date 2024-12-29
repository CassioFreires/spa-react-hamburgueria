import { useState, useEffect } from "react";
import DrinkCard from "../../components/DrinkCard/DrinkCard";
import { getAllDrinks } from "../../services/service-drinks"; // Função para buscar as bebidas
import { Link } from "react-router-dom";

const Drinks = () => {
    const [cart, setCart] = useState([]);
    const [isAdded, setIsAdded] = useState(null);
    const [drinks, setDrinks] = useState([]);  // Estado para armazenar os drinks
    const [loading, setLoading] = useState(true);  // Estado para controlar o carregamento
    const [error, setError] = useState(null);  // Estado para controlar erros da API

    // Obtendo itens do localStorage, se existirem
    const cartPromotionLocalStorage = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const cartLocalHistorage = JSON.parse(localStorage.getItem('cart')) || [];
    const cartComboBurgerLocalHistorage = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const cartDrinksLocalHistorage = JSON.parse(localStorage.getItem('drinks')) || [];

    // Combinando todos os itens do localStorage
    const allItemsLocalHistorage = [
        ...cartPromotionLocalStorage,
        ...cartLocalHistorage,
        ...cartComboBurgerLocalHistorage,
        ...cartDrinksLocalHistorage
    ];

    // Função para adicionar ao carrinho
    const addToCart = (drink) => {
        setCart((prevCart) => [...prevCart, drink]);
        setIsAdded(`${drink.name} adicionado ao carrinho!`);
        setTimeout(() => {
            setIsAdded(null);
        }, 1000);
    }

    // Usando useEffect para buscar os drinks da API
    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const data = await getAllDrinks();
                if (data && Array.isArray(data)) {
                    setDrinks(data);  // Atualiza o estado com os drinks recebidos
                } else {
                    setError("Nenhuma bebida encontrada ou resposta inválida");
                }
            } catch (error) {
                setError("Erro ao carregar as bebidas");
                console.error(error);
            } finally {
                setLoading(false);  // Termina o carregamento
            }
        };

        fetchDrinks();
    }, []); // O efeito é executado uma única vez, quando o componente for montado

    // Exibe uma mensagem de carregamento ou erro
    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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
                {drinks && drinks.length > 0 ? (
                    drinks.map((drink) => (
                        <DrinkCard key={drink.drink_id} drink={drink} addToCart={addToCart} />
                    ))
                ) : (
                    <div>Nenhuma bebida disponível no momento.</div>
                )}
            </div>
        </>
    );
}

export default Drinks;
