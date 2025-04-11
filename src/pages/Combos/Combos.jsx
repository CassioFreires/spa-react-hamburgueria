import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ComboCard from "../../components/ComboCard/ComboCard";
import { getAllCombos } from "../../services/service-combos";
import { useUser } from "../../contexts/UserContext";
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth";

const Combos = () => {
  const [state, setState] = useState({
    combos: [],
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

  // 🔍 Carrega combos da API
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const data = await getAllCombos();
        if (Array.isArray(data)) {
          setState((prevState) => ({
            ...prevState,
            combos: data,
            loading: false,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            error: "Nenhum combo encontrado ou resposta inválida",
            loading: false,
          }));
        }
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          error: "Erro ao carregar os combos",
          loading: false,
        }));
      }
    };

    fetchCombos();
  }, []);

  // 🔍 Atualiza contagem total de itens no carrinho
  useEffect(() => {
    const allItems = getCartItemsFromStorage();
    setState((prevState) => ({
      ...prevState,
      cartItemCount: allItems.length,
    }));
  }, []);

  // 🛠️ Adiciona combo ao carrinho
  const addToCart = (combo) => {
    if (!user) {
      setState((prevState) => ({
        ...prevState,
        notification: {
          message: "Você precisa estar logado para adicionar combos ao carrinho!",
          type: "error",
        },
      }));
      setTimeout(() => setState((prevState) => ({ ...prevState, notification: null })), 4000);
      setTimeout(() => navigate("/login"), 5000);
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("comboBurger")) || [];
    savedCart.push(combo);
    localStorage.setItem("comboBurger", JSON.stringify(savedCart));

    // 🔍 Atualiza contagem de todos os itens no carrinho
    const allItems = getCartItemsFromStorage();
    setState((prevState) => ({
      ...prevState,
      cartItemCount: allItems.length,
      isAdded: `${combo.name} adicionado ao carrinho!`,
    }));

    setTimeout(() => setState((prevState) => ({ ...prevState, isAdded: null })), 2000);
  };

  const { combos, isAdded, loading, error, notification, cartItemCount } = state;

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

      {/* 🍔 Lista de combos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {combos.map((combo) => (
          <ComboCard key={combo.combo_id} combo={combo} addToCart={addToCart} />
        ))}
      </div>
    </>
  );
};

export default Combos;
