const DrinkCard = ({ drink, addToCart }) => {
  const handleAddToCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('drinks')) || [];
      const updatedCart = [...savedCart, drink];
      localStorage.setItem('drinks', JSON.stringify(updatedCart));
      addToCart(drink);
  };

  return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
          <img src={drink.imageUrl} alt={drink.name} className="w-full h-48 object-cover" />
          <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{drink.name}</h3>
              <p className="text-gray-500 mt-2">{`$${drink.price}`}</p>
          </div>
          <button onClick={handleAddToCart} className="w-full bg-yellow-500 text-white py-3 text-lg font-semibold rounded-b-lg hover:bg-yellow-400">
              Adicionar ao Carrinho
          </button>
      </div>
  );
}

export default DrinkCard;
