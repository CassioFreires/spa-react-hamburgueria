import { useCallback } from "react";
import imgPromotion from "/images/promotions/promotion.jpg";

const PromotionCard = ({ promotion, addToCart }) => {
  const handleAddToCart = useCallback(() => {
    addToCart(promotion); // Chama a função para adicionar a promoção ao carrinho
  }, [promotion, addToCart]); // Garantir que a função se refira à promoção e addToCart

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={imgPromotion}
        alt={promotion.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{promotion.name}</h3>
        <p className="text-lg font-semibold text-gray-600">Preço: {promotion.price}</p>
        <div className="mt-4 bg-blue-100 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Válido de:</p>
          {/* Adicionar aqui a lógica de formatação de data, se necessário */}
        </div>
        <div className="mt-2 bg-blue-100 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Até:</p>
          {/* Adicionar aqui a lógica de formatação de data, se necessário */}
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full bg-yellow-500 text-white py-3 text-lg font-semibold rounded-b-lg hover:bg-yellow-400"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default PromotionCard;
