import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PromotionCard from "../../components/PromotionCard/PromotionCard";
import { getAllPromotions } from '../../services/service-promotions';

const Promotion = () => {
  const [cart, setCart] = useState([]);
  const [isAdded, setIsAdded] = useState(null);
  const [promotions, setPromotions] = useState([]);  // Estado para armazenar as promoções da API
  const [loading, setLoading] = useState(true);  // Estado de carregamento
  const [error, setError] = useState(null);  // Estado de erro
  
  // Carregar os dados das promoções quando o componente for montado
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getAllPromotions();
        
        // Garantir que cada promoção tenha uma chave única
        const validData = data.map((promo, index) => ({
          ...promo,
          promotion_id: promo.promotion_id || `fallback-${Math.random()}-${index}` // Garantindo uma chave única
        }));

        setPromotions(validData);
        console.log(validData);  // Atualiza o estado com as promoções da API
      } catch (error) {
        setError('Erro ao carregar as promoções');
      } finally {
        setLoading(false);  // Finaliza o carregamento
      }
    };

    fetchPromotions();
  }, []);

  const cartPromotionLocalStorage = JSON.parse(localStorage.getItem('promotionBurger')) || [];
  const cartLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
  const cartComboLocalStorage = JSON.parse(localStorage.getItem('comboBurger')) || [];
  const cartDrinksLocalStorage = JSON.parse(localStorage.getItem('drinks')) || [];

  const allItemsLocalStorage = [
    ...cartPromotionLocalStorage,
    ...cartLocalStorage,
    ...cartComboLocalStorage,
    ...cartDrinksLocalStorage
  ];

  const addToCart = (promotion) => {
    setCart((prevCart) => [...prevCart, promotion]);
    setIsAdded(`${promotion.name} adicionado ao carrinho!`);

    setTimeout(() => {
      setIsAdded(null);
    }, 1000);
  };

  if (loading) return <div>Carregando promoções...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="mt-4 text-center">
        <Link to="/cart" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400">
          Ver Carrinho ({allItemsLocalStorage.length})
        </Link>
      </div>

      {isAdded && (
        <div className="text-green-500 text-center mt-2">{isAdded}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {promotions.map((promotion, index) => (
          <PromotionCard 
            key={promotion.promotion_id || `fallback-${index}`} // Garantindo chave única
            promotion={promotion} 
            addToCart={addToCart} 
          />
        ))}
      </div>
    </>
  );
};

export default Promotion;
