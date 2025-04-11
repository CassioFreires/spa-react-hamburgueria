import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../../components/CartItem/CartItem';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar os carrinhos de hambúrgueres, promoções, combos e drinks do localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedPromotionBurger = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const savedComboBurger = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const savedDrinks = JSON.parse(localStorage.getItem('drinks')) || [];

    // Combine os carrinhos com informações adicionais sobre a origem dos dados
    const combinedCart = [
      ...savedCart.map(item => ({
        ...item,
        cartSource: 'cart',
        _uniqueId: `cart-${item.id || item.burger_id || item.name || Math.random()}`
      })),
      ...savedPromotionBurger.map(item => ({
        ...item,
        cartSource: 'promotionBurger',
        _uniqueId: `promotionBurger-${item.id || item.promotion_id || item.name || Math.random()}`
      })),
      ...savedComboBurger.map(item => ({
        ...item,
        cartSource: 'comboBurger',
        _uniqueId: `comboBurger-${item.id || item.combo_id || item.name || Math.random()}`
      })),
      ...savedDrinks.map(item => ({
        ...item,
        cartSource: 'drinks',
        _uniqueId: `drinks-${item.id || item.drink_id || item.name || Math.random()}`
      }))
    ];

    setCart(combinedCart); // Atualiza o estado do carrinho
  }, []);

  const removeFromCart = (id, cartSource) => {
    // Determinar qual carrinho foi passado e atualizar o localStorage correspondente
    let updatedCart;
    const storageKey = cartSource === 'cart' ? 'cart' :
                        cartSource === 'promotionBurger' ? 'promotionBurger' :
                        cartSource === 'comboBurger' ? 'comboBurger' :
                        cartSource === 'drinks' ? 'drinks' : '';

    if (storageKey) {
      updatedCart = JSON.parse(localStorage.getItem(storageKey)).filter(item => 
        item.id !== id && item.burger_id !== id && item.combo_id !== id && item.promotion_id !== id && item.drink_id !== id
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedCart));  // Atualiza o localStorage do carrinho
    }

    // Recarregar todos os carrinhos após a remoção e atualizar o estado
    const updatedCombinedCart = [
      ...JSON.parse(localStorage.getItem('cart') || "[]").map(item => ({ ...item, cartSource: 'cart', _uniqueId: `cart-${item.id || item.burger_id || item.name || Math.random()}` })),
      ...JSON.parse(localStorage.getItem('promotionBurger') || "[]").map(item => ({ ...item, cartSource: 'promotionBurger', _uniqueId: `promotionBurger-${item.id || item.promotion_id || item.name || Math.random()}` })),
      ...JSON.parse(localStorage.getItem('comboBurger') || "[]").map(item => ({ ...item, cartSource: 'comboBurger', _uniqueId: `comboBurger-${item.id || item.combo_id || item.name || Math.random()}` })),
      ...JSON.parse(localStorage.getItem('drinks') || "[]").map(item => ({ ...item, cartSource: 'drinks', _uniqueId: `drinks-${item.id || item.drink_id || item.name || Math.random()}` }))
    ];

    setCart(updatedCombinedCart); // Atualiza o estado do carrinho com a nova lista
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
      navigate('/');  // Redireciona para a página inicial ou outra página desejada
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Carrinho de Compras</h2>

      {cart.length === 0 ? (
        <p className="text-center">O seu carrinho está vazio.</p>
      ) : (
        <>
          <div>
            {cart.map((item) => {
              return (
                <CartItem
                  key={item._uniqueId}  // Usando a chave única
                  item={item}
                  removeFromCart={removeFromCart}
                  cartSource={item.cartSource}
                />
              );
            })}
          </div>

          <div className="mt-6 text-right">
            <p className="text-xl font-semibold">Total: ${getTotal().toFixed(2)}</p>
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
