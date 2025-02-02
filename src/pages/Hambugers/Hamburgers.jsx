import { useState, useEffect } from "react";
import HamburgerCard from "../../components/HamburgerCard/HamburguerCard";
import { Link, useNavigate } from "react-router-dom";
import { getAllHamburgers } from "../../services/service-hamburguers.js";
import { useUser } from "../../contexts/UserContext"; // Contexto de usuário para verificar a autenticação
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth.jsx";

const Hamburguers = () => {
    const [cart, setCart] = useState([]);
    const [isAdded, setIsAdded] = useState(null);
    const [burgers, setBurgers] = useState([]);  // Estado para armazenar os hambúrgueres
    const cartLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
    const cartPromotionLocalStorage = JSON.parse(localStorage.getItem('promotionBurger')) || [];
    const cartComboBurgerLocalHistorage = JSON.parse(localStorage.getItem('comboBurger')) || [];
    const cartDrinksLocalHistorage = JSON.parse(localStorage.getItem('drinks')) || [];

    const allItemsLocalHistorage = [...cartLocalStorage, ...cartPromotionLocalStorage, ...cartComboBurgerLocalHistorage, ...cartDrinksLocalHistorage];

    useEffect(() => {
        // Chama a função para obter os hambúrgueres da API
        const fetchBurgers = async () => {
            const data = await getAllHamburgers();
            setBurgers(data);  // Atualiza o estado com os hambúrgueres recebidos
        };

    fetchBurgers();
  }, []); // O efeito é executado uma única vez, quando o componente for montado

  // Função para adicionar o hambúrguer ao carrinho
  const addToCart = (burger) => {
    if (!user) {
      // Se o usuário não estiver logado, exibe a notificação e não faz nada com o carrinho ou localStorage
      setNotification({
        message: "Você precisa estar logado para adicionar itens ao carrinho!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 4000); // Esconde a notificação após 4 segundos
      setTimeout(() => navigate("/login"), 5000); // Redireciona para a página de login após 5 segundos
      return;
    }

    // Se o usuário estiver logado, adicionamos o item ao carrinho e persistimos no localStorage
    const cartLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
    cartLocalStorage.push(burger); // Adiciona o item ao carrinho
    localStorage.setItem("cart", JSON.stringify(cartLocalStorage)); // Atualiza o localStorage com o novo carrinho

    // Exibe a mensagem de sucesso que o item foi adicionado ao carrinho
    setIsAdded(`${burger.name} adicionado ao carrinho!`);
    setTimeout(() => setIsAdded(null), 2000); // Limpa a mensagem após 2 segundos
  };

  return (
    <>
      {/* Exibe a notificação de erro ou sucesso */}
      {notification && (
        <NotificationCartAuth
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Link para visualizar o carrinho */}
      <div className="mt-4 text-center">
        {user ? (
          <Link to="/cart" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400">
            Ver Carrinho
          </Link>
        ) : (
          <span className="bg-yellow-500 text-white p-2 rounded-md">
            Você precisa estar logado para acessar o carrinho.
          </span>
        )}
      </div>

      {/* Exibe mensagem de item adicionado */}
      {isAdded && (
        <div className="text-green-500 text-center mt-2">{isAdded}</div>
      )}

      {/* Mapeando os hambúrgueres para exibir os cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {burgers.map((burger) => (
          <HamburgerCard key={burger.id} burger={burger} addToCart={addToCart} />
        ))}
      </div>
    </>
  );
};

export default Hamburguers;
