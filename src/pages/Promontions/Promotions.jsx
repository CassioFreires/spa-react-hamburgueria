import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PromotionCard from "../../components/PromotionCard/PromotionCard";
import { getAllPromotions } from "../../services/service-promotions";
import { useUser } from "../../contexts/UserContext";
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth";

const Promotion = () => {
  const [promotions, setPromotions] = useState([]); // Armazena as promoções
  const [isAdded, setIsAdded] = useState(null); // Armazena a notificação de item adicionado
  const [notification, setNotification] = useState(null); // Notificação de erro
  const { user } = useUser(); // Acesso ao usuário autenticado
  const navigate = useNavigate();

  // Função para carregar as promoções
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getAllPromotions();
        const validData = data.map((promo, index) => ({
          ...promo,
          promotion_id: promo.promotion_id || `fallback-${Math.random()}-${index}`,
        }));
        setPromotions(validData);
      } catch (error) {
        setNotification({
          message: "Erro ao carregar as promoções",
          type: "error",
        });
      }
    };

    fetchPromotions();
  }, []);

  const addToCart = (promotion) => {
    if (!user) {
      setNotification({
        message: "Você precisa estar logado para adicionar promoções ao carrinho!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 4000);
      setTimeout(() => navigate("/login"), 5000);
      return;
    }

    const cartLocalStorage = JSON.parse(localStorage.getItem("promotionBurger")) || [];
    cartLocalStorage.push(promotion); // Adiciona a promoção ao carrinho
    localStorage.setItem("promotionBurger", JSON.stringify(cartLocalStorage)); // Atualiza o localStorage

    setIsAdded(`${promotion.name} adicionado ao carrinho!`);
    setTimeout(() => setIsAdded(null), 2000); // Limpa a notificação após 2 segundos
  };

  return (
    <>
      {/* Exibe a notificação */}
      {notification && (
        <NotificationCartAuth
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Link para visualizar o carrinho */}
      <div className="mt-4 text-center">
        {user ? (
          <Link
            to="/cart"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400"
          >
            Ver Carrinho
          </Link>
        ) : (
          <span className="bg-yellow-500 text-white p-2 rounded-md">
            Você precisa estar logado para acessar o carrinho.
          </span>
        )}
      </div>

      {/* Exibe a notificação de item adicionado */}
      {isAdded && <div className="text-green-500 text-center mt-2">{isAdded}</div>}

      {/* Exibe as promoções */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {promotions.map((promotion, index) => (
          <PromotionCard key={promotion.promotion_id || `fallback-${index}`} promotion={promotion} addToCart={addToCart} />
        ))}
      </div>
    </>
  );
};

export default Promotion;
