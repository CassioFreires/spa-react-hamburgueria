import imgCombos from '/images/combos/combos.jpg';

const ComboCard = ({ burger, addToCart }) => {
  const handleAddToCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('comboBurger')) || [];
      const updatedCart = [...savedCart, burger];
      localStorage.setItem('comboBurger', JSON.stringify(updatedCart));
      addToCart(burger);  // Chama a função do componente pai
  };

  return (
      <div>
          <div
              key={burger.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
              <img
                  src={imgCombos}
                  alt={burger.name}
                  className="w-full h-48 object-cover"
              />
              <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{burger.name}</h3>
                  <p className="text-gray-500 mt-2">{`$${burger.price}`}</p>
              </div>
              <button onClick={handleAddToCart} className="w-full bg-yellow-500 text-white py-3 text-lg font-semibold rounded-b-lg hover:bg-yellow-400">
                  Adicionar ao Carrinho
              </button>
          </div>
      </div>
  );
};

export default ComboCard;
