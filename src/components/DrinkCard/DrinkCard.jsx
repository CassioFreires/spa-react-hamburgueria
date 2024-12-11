const DrinkCard = ({ drink, addToCart }) => {
  const handleAddToCart = () => {
    // Carregar o carrinho atual do localStorage, ou inicializar com um array vazio se não houver nada
    const savedCart = JSON.parse(localStorage.getItem('drinks')) || [];

    // Adicionar o novo item ao carrinho
    const updatedCart = [...savedCart, drink];

    // Atualizar o carrinho no localStorage
    localStorage.setItem('drinks', JSON.stringify(updatedCart));

    // Chamar a função addToCart para atualizar o estado do carrinho no componente pai
    addToCart(drink);
  };

  return (
    <div>
      <div
        key={drink.id}
        className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
      >
        <img
          src={drink.imageUrl}
          alt={drink.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{drink.name}</h3>
          <p className="text-gray-500 mt-2">{`$${drink.price.toFixed(2)}`}</p>
        </div>
        <button onClick={handleAddToCart} className="w-full bg-yellow-500 text-white py-3 text-lg font-semibold rounded-b-lg hover:bg-yellow-400">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default DrinkCard;