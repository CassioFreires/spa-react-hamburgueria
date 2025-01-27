import { useCallback } from "react";
import imgBurger from "/images/hamburgers/hamburguer.jpg";

const HamburgerCard = ({ burger, addToCart }) => {
  // Função de adição ao carrinho (não mexe diretamente no localStorage)
  const handleAddToCart = useCallback(() => {
    addToCart(burger);  // Chama a função passada pelo componente pai para atualizar o carrinho
  }, [burger, addToCart]); // Dependência no burger e addToCart

  return (
    <div>
      <div
        key={burger.id}
        className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
      >
        <img
          src={imgBurger}
          alt={burger.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{burger.name}</h3>
          <p className="text-gray-500 mt-2">{`$${parseFloat(burger.price).toFixed(2)}`}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-yellow-500 text-white py-3 text-lg font-semibold rounded-b-lg hover:bg-yellow-400"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default HamburgerCard;
