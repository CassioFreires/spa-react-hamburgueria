import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Lógica para registrar o usuário
    console.log('Cadastro', name, email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Crie sua conta</h2>
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Digite seu nome" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
          />
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
            Cadastrar
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-[#1F2937]">
            Já tem uma conta? <Link to="/login" className="text-[#EAB308] hover:underline">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
