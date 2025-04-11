import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DrinkCard from "../../components/DrinkCard/DrinkCard";
import { getAllDrinks } from "../../services/service-drinks";
import { useUser } from "../../contexts/UserContext";
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth";

const Drinks = () => {
  const [state, setState] = useState({
    drinks: [],
    isAdded: null,
    notification: null,
    cartItemCount: 0,
    loading: true,
    error: null,
  });

  const { user } = useUser();
  const navigate = useNavigate();

  // 🛠️ Função utilitária para buscar todos os itens do carrinho
  const getCartItemsFromStorage = () => {
    const cartPromotion = JSON.parse(localStorage.getItem("promotionBurger")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCombo = JSON.parse(localStorage.getItem("comboBurger")) || [];
    const cartDrinks = JSON.parse(localStorage.getItem("drinks")) || [];
    return [...cartPromotion, ...cart, ...cartCombo, ...cartDrinks];
  };

  // 🔍 Carrega as bebidas da API
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const data = await getAllDrinks();
        if (Array.isArray(data)) {
          setState((prevState) => ({
            ...prevState,
            drinks: data,
            loading: false,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            error: "Nenhuma bebida encontrada ou resposta inválida",
            loading: false,
          }));
        }
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          error: "Erro ao carregar as bebidas",
          loading: false,
        }));
      }
    };

    fetchDrinks();
  }, []);

  // 🔍 Atualiza contagem total de itens no carrinho
  useEffect(() => {
    const allItems = getCartItemsFromStorage();
    setState((prevState) => ({
      ...prevState,
      cartItemCount: allItems.length,
    }));
  }, []);

  // 🛠️ Adiciona bebida ao carrinho
  const addToCart = (drink) => {
    if (!user) {
      setState((prevState) => ({
        ...prevState,
        notification: {
          message: "Você precisa estar logado para adicionar bebidas ao carrinho!",
          type: "error",
        },
      }));
      setTimeout(() => setState((prevState) => ({ ...prevState, notification: null })), 4000);
      setTimeout(() => navigate("/login"), 5000);
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("drinks")) || [];
    savedCart.push(drink);
    localStorage.setItem("drinks", JSON.stringify(savedCart));

    // 🔍 Atualiza contagem de todos os itens no carrinho
    const allItems = getCartItemsFromStorage();
    setState((prevState) => ({
      ...prevState,
      cartItemCount: allItems.length,
      isAdded: `${drink.name} adicionado ao carrinho!`,
    }));

    setTimeout(() => setState((prevState) => ({ ...prevState, isAdded: null })), 2000);
  };

  const { drinks, isAdded, loading, error, notification, cartItemCount } = state;

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {notification && (
        <NotificationCartAuth
          message={notification.message}
          type={notification.type}
          onClose={() => setState((prevState) => ({ ...prevState, notification: null }))}
        />
      )}

      {/* 🛒 Botão Ver Carrinho com contador atualizado */}
      <div className="mt-4 text-center">
        {user ? (
          <Link to="/cart" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400">
            Ver Carrinho ({cartItemCount})
          </Link>
        ) : (
          <span className="bg-yellow-500 text-white p-2 rounded-md">
            Você precisa estar logado para acessar o carrinho.
          </span>
        )}
      </div>

      {isAdded && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
          {isAdded}
        </div>
      )}

      {/* 🍹 Lista de bebidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {drinks.map((drink) => (
          <DrinkCard key={drink.drink_id} drink={drink} addToCart={addToCart} />
        ))}
      </div>
    </>
  );
};

export default Drinks;
