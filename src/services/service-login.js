import axios from 'axios'

export async function loginService(email, password_hash, setUserInfo) {

  // URL
  const url = `${import.meta.env.VITE_BASE_URL_API}:${import.meta.env.VITE_API_PORT}/user/login`;

  try {
    const dataLogin = { email, password_hash };

    const response = await axios.post(url, dataLogin, {
      headers: { 'Content-Type': 'application/json' }
    });


    const { token, message } = response.data;


    if (token) {
      // Configura o axios para enviar o token nas requisições subsequentes
      axios.defaults.headers['Authorization'] = `Bearer ${token}`;

      // Remover a senha do objeto de usuário antes de salvar
      const userWithoutPassword = { ...response.data.response };
      delete userWithoutPassword.password_hash; // Removendo a senha do usuário

      // Armazena o token e o usuário no localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword ));

      // Atualiza as informações do usuário no contexto global
      setUserInfo(userWithoutPassword );

      return { success: true, message: 'Login realizado com sucesso!', token };
    }

    return { success: false, message: message || 'Erro desconhecido durante o login.' };

  } catch (error) {
    console.error('Erro durante a requisição de login:', error);
    return { success: false, message: 'Usuário ou senha inválidos.' };
  }
}
