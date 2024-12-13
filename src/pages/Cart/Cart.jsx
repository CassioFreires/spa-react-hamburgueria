import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../../components/CartItem/CartItem';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar os carrinhos de hambúrgueres e promoções do localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedPromotionBurger = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const saveComboBurger = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const savedDrinks = JSON.parse(localStorage.getItem('drinks')) || [];

    // Combinar os dois carrinhos em um único array
    const combinedCart = [...savedCart, ...savedPromotionBurger, ...saveComboBurger, ...savedDrinks];
    setCart(combinedCart);
  }, []);

  const removeFromCart = (id, cartType) => {
    let updatedCart;

    // Atualizar o carrinho removendo o item com o id fornecido
    if (cartType === 'hamburgers') {
      updatedCart = JSON.parse(localStorage.getItem('cart')).filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedCart));  // Atualiza o carrinho de hambúrgueres
    } else if (cartType === 'promotions') {
      updatedCart = JSON.parse(localStorage.getItem('promotionBurger')).filter(item => item.id !== id);
      localStorage.setItem('promotionBurger', JSON.stringify(updatedCart));  // Atualiza o carrinho de promoções
    } else if(cartType === 'combo') {
      updatedCart = JSON.parse(localStorage.getItem('comboBurger')).filter(item => item.id !== id);
      localStorage.setItem('comboBurger', JSON.stringify(updatedCart));  // Atualiza o carrinho de combos
    } else if (cartType === 'drinks'){
      updatedCart = JSON.parse(localStorage.getItem('drinks')).filter(item => item.id !== id);
      localStorage.setItem('drinks', JSON.stringify(updatedCart));  // Atualiza o carrinho de bebidas
    }

    // Recarregar os carrinhos após a remoção e atualizar o estado
    const updatedCombinedCart = [
      ...JSON.parse(localStorage.getItem('cart')) || [],
      ...JSON.parse(localStorage.getItem('promotionBurger')) || [],
      ...JSON.parse(localStorage.getItem('comboBurger')) || [],
      ...JSON.parse(localStorage.getItem('drinks')) || []
    ];

    // Atualizar o estado
    setCart(updatedCombinedCart);
  };

  const removeAllFromCart = () => {
    const confirmRemoval = window.confirm("Você tem certeza que deseja remover todos os itens do carrinho?");
    if (confirmRemoval) {
      // Limpar todos os carrinhos
      setCart([]); // Atualiza o estado para um carrinho vazio
      localStorage.setItem('cart', JSON.stringify([]));  // Limpa o carrinho de hambúrgueres
      localStorage.setItem('promotionBurger', JSON.stringify([]));  // Limpa o carrinho de promoções
      localStorage.setItem('comboBurger', JSON.stringify([]));  // Limpa o carrinho de combos
      localStorage.setItem('drinks', JSON.stringify([])); // Limpa o carrinho de bebidas
      navigate('/promocoes');  // Redireciona para a página de Promoções
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Carrinho de Compras</h2>

      {cart.length === 0 ? (
        <p className="text-center">O seu carrinho está vazio.</p>
      ) : (
        <>
          <div>
            {cart.map((item) => (
              <CartItem 
                key={`${item.id}-${item.type}`} // Usando id e tipo para a chave única
                item={item} 
                removeFromCart={removeFromCart} 
                cartType={item.type} // Passa o tipo de carrinho correto (hamburgers ou promotions)
              />
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-xl font-semibold">Total: ${getTotal()}</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center">
            <Link
              to="/order"
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-400 mb-4 sm:mb-0"
            >
              Seguir com o pedido
            </Link>

            <button
              onClick={() => navigate('/hamburgers')}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 mb-4 sm:mb-0"
            >
              Continuar comprando
            </button>

            <button
              onClick={removeAllFromCart}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
            >
              Remover Todos do Carrinho
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
