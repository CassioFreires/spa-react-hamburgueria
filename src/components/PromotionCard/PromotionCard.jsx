import React from 'react';
import imgPromotion from '/images/promotions/promotion.jpg'

const PromotionCard = ({ promotion, addToCart }) => {
  const handleAddToCart = () => {
    // Carregar o carrinho atual do localStorage ou inicializar com um array vazio
    const savedCart = JSON.parse(localStorage.getItem('promotionBurger')) || [];

    // Adicionar o novo item ao carrinho
    const updatedCart = [...savedCart, promotion];

    // Atualizar o carrinho no localStorage
    localStorage.setItem('promotionBurger', JSON.stringify(updatedCart));

    // Chamar a função addToCart para atualizar o estado do carrinho no componente pai
    addToCart(promotion);
  };

  // Função para formatar as datas
  // const formatDate = (dateString) => {
  //   const dateObj = new Date(dateString);
  //   return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  // };

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

        {/* Layout melhorado para exibição das datas */}
        <div className="mt-4 bg-blue-100 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Válido de:</p>
          {/* <p className="text-lg font-semibold text-blue-700">{formatDate(promotion.valid_from)}</p> */}
        </div>

        <div className="mt-2 bg-blue-100 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Até:</p>
          {/* <p className="text-lg font-semibold text-blue-700">{formatDate(promotion.valid_to)}</p> */}
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
