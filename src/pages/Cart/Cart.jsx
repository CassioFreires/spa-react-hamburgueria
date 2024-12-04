import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../../components/CartItem/CartItem';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();  // Usado para navegação programática

  useEffect(() => {
    // Carregar o carrinho salvo no localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    setCart(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Persistir no localStorage
  };

  const removeAllFromCart = () => {
    // Alerta de confirmação antes de remover todos os itens do carrinho
    const confirmRemoval = window.confirm("Você tem certeza que deseja remover todos os itens do carrinho?");
    if (confirmRemoval) {
      setCart([]);  // Limpar o carrinho
      localStorage.setItem('cart', JSON.stringify([]));  // Persistir carrinho vazio no localStorage
      navigate('/hamburgers');  // Redirecionar para a página de Hamburguers
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
            {cart.map(item => (
              <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
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
              Finalizar Compra
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
