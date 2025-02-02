import { useCallback } from "react";
import imgCombos from "/images/combos/combos.jpg";

const ComboCard = ({ burger, addToCart }) => {
  const handleAddToCart = useCallback(() => {
    addToCart(burger); // Chama a função para adicionar o combo ao carrinho
  }, [burger, addToCart]); // Garante que a função se refira ao combo e addToCart

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={imgCombos}
        alt={burger.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{burger.name}</h3>
        <p className="text-gray-500 mt-2">{`$${burger.price}`}</p>
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

export default ComboCard;
