import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PromotionCard from "../../components/PromotionCard/PromotionCard";
import { getAllPromotions } from "../../services/service-promotions";
import { useUser } from "../../contexts/UserContext";
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth";

const Promotion = () => {
  const [state, setState] = useState({
    promotions: [],
    isAdded: null,
    loading: true,
    error: null,
    notification: null,
    cartItemCount: 0,
  });

  const { user } = useUser();
  const navigate = useNavigate();

  // ✅ Função para pegar todos os itens do carrinho
  const getCartItemsFromStorage = () => {
    const cartPromotion = JSON.parse(localStorage.getItem("promotionBurger")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCombo = JSON.parse(localStorage.getItem("comboBurger")) || [];
    const cartDrinks = JSON.parse(localStorage.getItem("drinks")) || [];
    return [...cartPromotion, ...cart, ...cartCombo, ...cartDrinks];
  };

  // ✅ Carrega as promoções da API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getAllPromotions();
        if (Array.isArray(data)) {
          setState((prevState) => ({
            ...prevState,
            promotions: data,
            loading: false,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            error: "Nenhuma promoção encontrada ou resposta inválida",
            loading: false,
          }));
        }
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          error: "Erro ao carregar as promoções",
          loading: false,
        }));
      }
    };

    fetchPromotions();
  }, []);

  // ✅ Atualiza o contador de itens no carrinho ao montar o componente
  useEffect(() => {
    const allItems = getCartItemsFromStorage();
    setState((prevState) => ({
      ...prevState,
      cartItemCount: allItems.length,
    }));
  }, []);

  // ✅ Adiciona promoção ao carrinho
  const addToCart = (promotion) => {
    if (!user) {
      setState((prevState) => ({
        ...prevState,
        notification: {
          message: "Você precisa estar logado para adicionar promoções ao carrinho!",
          type: "error",
        },
      }));
      setTimeout(() => setState((prevState) => ({ ...prevState, notification: null })), 4000);
      setTimeout(() => navigate("/login"), 5000);
      return;
    }

    const cartLocalStorage = JSON.parse(localStorage.getItem("promotionBurger")) || [];
    cartLocalStorage.push(promotion);
    localStorage.setItem("promotionBurger", JSON.stringify(cartLocalStorage));

    // ✅ Atualiza contagem total de itens no carrinho
    const allItems = getCartItemsFromStorage();
    setState((prevState) => ({
      ...prevState,
      cartItemCount: allItems.length,
      isAdded: `${promotion.name} adicionado ao carrinho!`,
    }));

    setTimeout(() => setState((prevState) => ({ ...prevState, isAdded: null })), 2000);
  };

  const { promotions, isAdded, loading, error, notification, cartItemCount } = state;

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

      {/* ✅ Botão de Ver Carrinho com a contagem corrigida */}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {promotions?.length ? (
          promotions.map((promotion) => (
            <PromotionCard key={promotion.promotion_id} promotion={promotion} addToCart={addToCart} />
          ))
        ) : (
          <div>Nenhuma promoção disponível no momento.</div>
        )}
      </div>
    </>
  );
};

export default Promotion;
