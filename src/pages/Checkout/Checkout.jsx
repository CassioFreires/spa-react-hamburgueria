// CheckoutPage.jsx
import React from 'react';
import Order from '../../components/Order/Order';
const Checkout = () => {
  return (
    <div className="container mx-auto">
      <Order /> {/* Componente de pedido */}
      {/* Outras seções de checkout podem ir aqui */}
    </div>
  );
};

export default Checkout;
