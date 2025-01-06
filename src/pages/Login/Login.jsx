import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Adicionar lógica de autenticação
    console.log('Login', email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Bem-vindo à Hamburgueria</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Digite seu e-mail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
          />
          <input 
            type="password" 
            placeholder="Digite sua senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
          />
          <button 
            type="submit" 
            className="w-full py-3 bg-[#EAB308] text-[#1F2937] font-semibold rounded-md hover:bg-[#CA8A04] focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
          >
            Entrar
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-[#1F2937]">
            Não tem uma conta? <Link to="/register" className="text-[#EAB308] hover:underline">Crie uma aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
