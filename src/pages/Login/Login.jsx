import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginService } from '../../services/service-login';
import NotificationLogin from '../../components/NotificationLogin/NotificationLogin';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password_hash, setPasswordHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await loginService(email, password_hash);

    if (response.success) {
      // Exibe a notificação de sucesso
      setSuccess(response.message);
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 3000);  // Limpa a mensagem após 3 segundos
    } else {
      // Exibe a notificação de erro
      setError(response.message);
      setTimeout(() => setError(''), 3000);  // Limpa a mensagem após 3 segundos
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Bem-vindo à Hamburgueria</h2>
        
        {/* Exibindo as mensagens de sucesso ou erro */}
        {error && <NotificationLogin message={error} type="error" />}
        {success && <NotificationLogin message={success} type="success" />}

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
            value={password_hash}
            onChange={(e) => setPasswordHash(e.target.value)}
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
