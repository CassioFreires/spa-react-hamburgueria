import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DrinkCard from "../../components/DrinkCard/DrinkCard";
import { getAllDrinks } from "../../services/service-drinks"; // Função para buscar as bebidas
import { useUser } from "../../contexts/UserContext"; // Acesso ao contexto de usuário
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth";

const Drinks = () => {
  const [drinks, setDrinks] = useState([]); // Estado para armazenar as bebidas
  const [isAdded, setIsAdded] = useState(null); // Estado para notificação de item adicionado
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Estado para controlar erros
  const [notification, setNotification] = useState(null); // Estado para notificação
  const { user } = useUser(); // Acessando o contexto de usuário
  const navigate = useNavigate();

  // Obtendo itens do localStorage
  const cartPromotionLocalStorage = JSON.parse(localStorage.getItem("promotionBurger")) || [];
  const cartLocalHistorage = JSON.parse(localStorage.getItem("cart")) || [];
  const cartComboBurgerLocalHistorage = JSON.parse(localStorage.getItem("comboBurger")) || [];
  const cartDrinksLocalHistorage = JSON.parse(localStorage.getItem("drinks")) || [];

  // Combinando todos os itens do localStorage
  const allItemsLocalHistorage = [
    ...cartPromotionLocalStorage,
    ...cartLocalHistorage,
    ...cartComboBurgerLocalHistorage,
    ...cartDrinksLocalHistorage,
  ];

  // Função para adicionar bebida ao carrinho
  const addToCart = (drink) => {
    if (!user) { // Verifica se o usuário está autenticado
      setNotification({
        message: "Você precisa estar logado para adicionar bebidas ao carrinho!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 4000); // Exibe a notificação por 4 segundos
      setTimeout(() => navigate("/login"), 5000); // Redireciona para login após 5 segundos
      return;
    }

    // Adiciona bebida ao carrinho no localStorage
    const savedCart = JSON.parse(localStorage.getItem("drinks")) || [];
    savedCart.push(drink);
    localStorage.setItem("drinks", JSON.stringify(savedCart)); // Atualiza localStorage

    setIsAdded(`${drink.name} adicionado ao carrinho!`);
    setTimeout(() => setIsAdded(null), 2000); // Limpa a notificação após 2 segundos
  };

  // Usando useEffect para buscar as bebidas da API
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const data = await getAllDrinks();
        if (data && Array.isArray(data)) {
          setDrinks(data); // Atualiza o estado com as bebidas recebidas
        } else {
          setError("Nenhuma bebida encontrada ou resposta inválida");
        }
      } catch (error) {
        setError("Erro ao carregar as bebidas");
        console.error(error);
      } finally {
        setLoading(false); // Termina o carregamento
      }
    };

    fetchDrinks();
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
            Ver Carrinho ({allItemsLocalHistorage.length})
            {console.log(allItemsLocalHistorage)}
          </Link>
        ) : (
          <span className="bg-yellow-500 text-white p-2 rounded-md">
            Você precisa estar logado para acessar o carrinho.
          </span>
        )}
      </div>

      {/* Exibe a notificação de item adicionado */}
      {isAdded && <div className="text-green-500 text-center mt-2">{isAdded}</div>}

      {/* Exibe as bebidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {drinks && drinks.length > 0 ? (
          drinks.map((drink) => (
            <DrinkCard key={drink.drink_id} drink={drink} addToCart={addToCart} />
          ))
        ) : (
          <div>Nenhuma bebida disponível no momento.</div>
        )}
      </div>
    </>
  );
};

export default Drinks;
