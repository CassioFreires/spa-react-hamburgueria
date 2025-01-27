import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUserInfo, clearUser } = useUser(); // Consome o contexto de usuário
  const navigate = useNavigate();
  useEffect(() => {
    const userToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    // Verifique se o 'userData' existe e é uma string válida antes de tentar fazer o parse
    if (userToken && userData && userData !== 'undefined' && userData !== 'null') {
      try {
        const parsedUser = JSON.parse(userData); // Tenta fazer o parse
        setUserInfo(parsedUser); // Atualiza o contexto com as informações do usuário
      } catch (error) {
        console.error('Erro ao fazer parse do usuário:', error);
      }
    }
  }, []); // Depende apenas da montagem do componente, evitando loops

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    clearUser(); // Limpa o usuário no contexto global
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo ou nome do site */}
        <div className="text-white font-bold text-lg">Minha Loja</div>

        {/* Menu para telas grandes */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-yellow-400">Home</Link>
          <Link to="/hamburgers" className="text-white hover:text-yellow-400">Hamburgers</Link>
          <Link to="/promocoes" className="text-white hover:text-yellow-400">Promoções</Link>
          <Link to="/combos" className="text-white hover:text-yellow-400">Combos</Link>
          <Link to="/bebidas" className="text-white hover:text-yellow-400">Bebidas</Link>
          
          {/* Mostrar Dashboard apenas se o usuário for autenticado e for funcionario ou administrador */}
          {user && (user.name === 'Funcionário' || user.name === 'Administrador') && (
            <Link to="/dashboard" className="text-white hover:text-yellow-400">Dashboard</Link>
          )}

          {/* Condição para exibir Entrar ou as informações do usuário */}
          {user ? (
            <div className="text-white">
              <span>Bem-vindo, {user.name}</span>
              <button onClick={handleLogout} className="ml-4 text-red-500">Sair</button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="text-white hover:text-yellow-400">Entrar</Link>
            </div>
          )}
        </div>

        {/* Ícone de hambúrguer para telas pequenas */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">
            &#9776;
          </button>
        </div>
      </div>

      {/* Menu para telas pequenas */}
      <div
        className={`md:hidden bg-gray-800 text-white space-y-4 p-4 ${isMenuOpen ? "block" : "hidden"}`}
      >
        <Link to="/" className="block hover:text-yellow-400">Home</Link>
        <Link to="/hamburgers" className="block hover:text-yellow-400">Hamburgers</Link>
        <Link to="/promocoes" className="block hover:text-yellow-400">Promoções</Link>
        <Link to="/combos" className="block hover:text-yellow-400">Combos</Link>
        <Link to="/bebidas" className="block hover:text-yellow-400">Bebidas</Link>

        {/* Mostrar Dashboard apenas se o usuário for autenticado e for funcionario ou administrador */}
        {user && (user.name === 'Funcionário' || user.name === 'Administrador') && (
          <Link to="/dashboard" className="block hover:text-yellow-400">Dashboard</Link>
          
        )}

        {/* Exibe a opção de login ou informações do usuário */}
        {user ? (
          <div className="block">
            <span>Bem-vindo, {user.name}</span>
            <button onClick={handleLogout} className="ml-4 text-red-500">Sair</button>
          </div>
        ) : (
          <Link to="/login" className="block hover:text-yellow-400">Entrar</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
