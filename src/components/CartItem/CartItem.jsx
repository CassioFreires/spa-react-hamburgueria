import React from 'react';

const CartItem = ({ item, removeFromCart, cartSource }) => {
  // Aqui, o itemId foi substituído por _uniqueId vindo do Cart.jsx
  return (
    <div className="flex justify-between items-center border-b py-4">
      <div>
        <p>{item.name}</p>
        <p>{item.description}</p>
        <p>{item.price}</p>
      </div>
      <button
        onClick={() => removeFromCart(item.id, cartSource)} 
        className="text-red-500 hover:text-red-700"
      >
        Remover
      </button>
    </div>
  );
};

export default CartItem;
