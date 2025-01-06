import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importe o Link do React Router

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <Link to="/dashboard" className="text-white hover:text-yellow-400">Dashboard</Link>
          <div>
            <Link to="/login" className="text-white hover:text-yellow-400">Entrar</Link>
          </div>
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
        <Link to="/dashboard" className="block hover:text-yellow-400">Dashboard</Link>
        <Link to="/login" className="block hover:text-yellow-400">Entrar</Link>
      </div>
    </nav>
  );
};

export default Navbar;
