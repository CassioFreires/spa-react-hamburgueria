import { useState, useEffect } from "react";
import HamburgerCard from "../../components/HamburgerCard/HamburguerCard";
import { Link, useNavigate } from "react-router-dom";
import { getAllHamburgers } from "../../services/service-hamburguers.js";
import { useUser } from "../../contexts/UserContext"; 
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth.jsx";

// Componente principal que exibe a lista de hambúrgueres
const Hamburguers = () => {
  
  // Definindo o estado do componente
  const [state, setState] = useState({
    burgers: [], // Lista de hambúrgueres
    isAdded: null, // Mensagem de notificação quando um hambúrguer for adicionado ao carrinho
    loading: true, // Controla o estado de carregamento
    error: null, // Controla erros durante a busca dos hambúrgueres
    notification: null, // Controla a notificação de erro/sucesso
  });

  const { user } = useUser(); // Acessa o contexto de usuário para verificar se o usuário está autenticado
  const navigate = useNavigate(); // Função de navegação para redirecionar o usuário

  // Buscando os itens do carrinho armazenados no localStorage
  const getCartItemsFromStorage = () => {
    const cartPromotion = JSON.parse(localStorage.getItem("promotionBurger")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCombo = JSON.parse(localStorage.getItem("comboBurger")) || [];
    const cartDrinks = JSON.parse(localStorage.getItem("drinks")) || [];
    return [...cartPromotion, ...cart, ...cartCombo, ...cartDrinks];
  };

  const allItemsLocalStorage = getCartItemsFromStorage(); // Combina todos os itens do carrinho armazenados

  // Função para adicionar um hambúrguer ao carrinho
  const addToCart = (burger) => {
    if (!user) {
      // Se o usuário não estiver autenticado, exibe uma notificação de erro
      showNotification("Você precisa estar logado para adicionar hambúrgueres ao carrinho!", "error");
      setTimeout(() => navigate("/login"), 4000); // Redireciona para a tela de login após 4 segundos
      return;
    }

    // Adiciona o hambúrguer ao carrinho no localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    savedCart.push(burger);
    localStorage.setItem("cart", JSON.stringify(savedCart)); // Atualiza o carrinho no localStorage

    // Exibe uma notificação de sucesso após a adição ao carrinho
    showNotification(`${burger.name} adicionado ao carrinho!`, "success");
  };

  // Função para exibir notificações
  const showNotification = (message, type) => {
    setState((prevState) => ({
      ...prevState,
      notification: { message, type },
    }));
    setTimeout(() => {
      setState((prevState) => ({ ...prevState, notification: null })); // Remove a notificação após 4 segundos
    }, 4000);
  };

  // Função para buscar os hambúrgueres da API
  const fetchBurgers = async () => {
    try {
      const data = await getAllHamburgers();
      if (Array.isArray(data)) {
        setState((prevState) => ({ ...prevState, burgers: data, loading: false }));
      } else {
        setState((prevState) => ({
          ...prevState,
          error: "Nenhum hambúrguer encontrado ou resposta inválida",
          loading: false,
        }));
      }
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: "Erro ao carregar os hambúrgueres",
        loading: false,
      }));
      console.error(error);
    }
  };

  // Carrega os hambúrgueres quando o componente é montado
  useEffect(() => {
    fetchBurgers();
  }, []);

  const { burgers, isAdded, loading, error, notification } = state;

  // Se estiver carregando, exibe uma mensagem de carregamento
  if (loading) return <div>Carregando...</div>;

  // Se houver um erro, exibe a mensagem de erro
  if (error) return <div>{error}</div>;

  return (
    <>
      {/* Exibe a notificação de erro ou sucesso */}
      {notification && (
        <NotificationCartAuth
          message={notification.message}
          type={notification.type}
          onClose={() => setState((prevState) => ({ ...prevState, notification: null }))}
        />
      )}

      {/* Exibe o link para visualizar o carrinho, ou uma mensagem informando que é necessário estar logado */}
      <CartLink user={user} cartLength={allItemsLocalStorage.length} />

      {/* Exibe a notificação de item adicionado ao carrinho */}
      {isAdded && <div className="text-green-500 text-center mt-2">{isAdded}</div>}

      {/* Exibe os hambúrgueres em uma grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {burgers?.length ? (
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

// Componente reutilizável para o link do carrinho
const CartLink = ({ user, cartLength }) => (
  <div className="mt-4 text-center">
    {user ? (
      <Link to="/cart" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400">
        Ver Carrinho ({cartLength})
      </Link>
    ) : (
      <span className="bg-yellow-500 text-white p-2 rounded-md">
        Você precisa estar logado para acessar o carrinho.
      </span>
    )}
  </div>
);

export default Hamburguers;
