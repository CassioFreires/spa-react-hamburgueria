import { useState, useEffect } from "react";
import HamburgerCard from "../../components/HamburgerCard/HamburguerCard";
import { Link, useNavigate } from "react-router-dom";
import { getAllHamburgers } from "../../services/service-hamburguers.js";
import { useUser } from "../../contexts/UserContext"; // Contexto de usuário para verificar a autenticação
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth.jsx";

const Hamburguers = () => {
  const [burgers, setBurgers] = useState([]); // Estado para armazenar os hambúrgueres
  const [isAdded, setIsAdded] = useState(null); // Estado para notificação de item adicionado
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para controlar erros
  const [notification, setNotification] = useState(null); // Estado para notificação
  const { user } = useUser(); // Acessando o contexto de usuário
  const navigate = useNavigate();

  // Obtendo itens do localStorage
  const cartPromotionLocalStorage = JSON.parse(localStorage.getItem("promotionBurger")) || [];
  const cartLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
  const cartComboBurgerLocalStorage = JSON.parse(localStorage.getItem("comboBurger")) || [];
  const cartDrinksLocalStorage = JSON.parse(localStorage.getItem("drinks")) || [];

  // Combinando todos os itens do localStorage
  const allItemsLocalStorage = [
    ...cartPromotionLocalStorage,
    ...cartLocalStorage,
    ...cartComboBurgerLocalStorage,
    ...cartDrinksLocalStorage,
  ];

  // Função para adicionar hambúrguer ao carrinho
  const addToCart = (burger) => {
    if (!user) { // Verifica se o usuário está autenticado
      setNotification({
        message: "Você precisa estar logado para adicionar hambúrgueres ao carrinho!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 4000); // Exibe a notificação por 4 segundos
      setTimeout(() => navigate("/login"), 5000); // Redireciona para login após 5 segundos
      return;
    }

    // Adiciona hambúrguer ao carrinho no localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    savedCart.push(burger);
    localStorage.setItem("cart", JSON.stringify(savedCart)); // Atualiza localStorage

    setIsAdded(`${burger.name} adicionado ao carrinho!`);
    setTimeout(() => setIsAdded(null), 2000); // Limpa a notificação após 2 segundos
  };

  // Usando useEffect para buscar os hambúrgueres da API
  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const data = await getAllHamburgers();
        if (data && Array.isArray(data)) {
          setBurgers(data); // Atualiza o estado com os hambúrgueres recebidos
        } else {
          setError("Nenhum hambúrguer encontrado ou resposta inválida");
        }
      } catch (error) {
        setError("Erro ao carregar os hambúrgueres");
        console.error(error);
      } finally {
        setLoading(false); // Termina o carregamento
      }
    };

    fetchBurgers();
  }, []); // O efeito é executado uma única vez, quando o componente for montado

  // Exibe uma mensagem de carregamento ou erro
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          <Link
            to="/cart"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400"
          >
            Ver Carrinho ({allItemsLocalStorage.length})
          </Link>
        ) : (
          <span className="bg-yellow-500 text-white p-2 rounded-md">
            Você precisa estar logado para acessar o carrinho.
          </span>
        )}
      </div>

      {/* Exibe a notificação de item adicionado */}
      {isAdded && <div className="text-green-500 text-center mt-2">{isAdded}</div>}

      {/* Exibe os hambúrgueres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {burgers && burgers.length > 0 ? (
          burgers.map((burger) => (
            <HamburgerCard key={burger.id} burger={burger} addToCart={addToCart} />
          ))
        ) : (
          <div>Nenhum hambúrguer disponível no momento.</div>
        )}
      </div>
    </>
  );
};

export default Hamburguers;
