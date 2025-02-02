import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ComboCard from "../../components/ComboCard/ComboCard";
import { getAllCombos } from "../../services/service-combos"; // Função para buscar os combos
import { useUser } from "../../contexts/UserContext"; // Acesso ao contexto de usuário
import NotificationCartAuth from "../../components/NotificationCartAuth/NotificationCartAuth";

const Combos = () => {
  const [combos, setCombos] = useState([]); // Estado para armazenar os combos
  const [isAdded, setIsAdded] = useState(null); // Estado para a notificação de item adicionado
  const [notification, setNotification] = useState(null); // Estado para a notificação
  const { user } = useUser(); // Acessa o usuário autenticado
  const navigate = useNavigate();

  // Obtendo itens do localStorage, se existirem
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

  // Função para adicionar ao carrinho
  const addToCart = (combo) => {
    if (!user) { // Verifica se o usuário está autenticado
      setNotification({
        message: "Você precisa estar logado para adicionar combos ao carrinho!",
        type: "error",
      });
      setTimeout(() => setNotification(null), 4000); // Exibe a notificação por 4 segundos
      setTimeout(() => navigate("/login"), 5000); // Redireciona para login após 5 segundos
      return;
    }

    // Atualiza o estado do carrinho
    const savedCart = JSON.parse(localStorage.getItem("comboBurger")) || [];
    savedCart.push(combo);
    localStorage.setItem("comboBurger", JSON.stringify(savedCart)); // Atualiza o localStorage

    setIsAdded(`${combo.name} adicionado ao carrinho!`);
    setTimeout(() => setIsAdded(null), 2000); // Limpa a notificação após 2 segundos
  };

  // Usando useEffect para buscar os combos da API
  useEffect(() => {
    const fetchCombos = async () => {
      const data = await getAllCombos();
      setCombos(data); // Atualiza o estado com os combos recebidos
    };

    fetchCombos();
  }, []); // O efeito é executado uma única vez, quando o componente for montado

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
          </Link>
        ) : (
          <span className="bg-yellow-500 text-white p-2 rounded-md">
            Você precisa estar logado para acessar o carrinho.
          </span>
        )}
      </div>

      {/* Exibe a notificação de item adicionado */}
      {isAdded && <div className="text-green-500 text-center mt-2">{isAdded}</div>}

      {/* Exibe os combos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {combos.map((combo) => (
          <ComboCard key={combo.combo_id} burger={combo} addToCart={addToCart} />
        ))}
      </div>
    </>
  );
};

export default Combos;
