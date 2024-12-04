const CartItem = ({ item, removeFromCart }) => {
    return (
      <div className="flex justify-between items-center border-b py-4">
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p>${item.price.toFixed(2)}</p>
        </div>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700"
        >
          Remover
        </button>
      </div>
    );
  };
  
  export default CartItem;
  