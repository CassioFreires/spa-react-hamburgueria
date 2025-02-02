import axios from 'axios'

export async function loginService(email, password_hash, setUserInfo) {
    const url = 'http://localhost:3000/user/login';
    try {
      const dataLogin = { email, password_hash };
  
      console.log('Dados enviados para o servidor:');
      console.log('Email:', email);
      console.log('Senha:', password_hash);
  
      const response = await axios.post(url, dataLogin, {
        headers: { 'Content-Type': 'application/json' }
      });
  
  
      const { token, message } = response.data;
     
    
      if (token) {
        // Configura o axios para enviar o token nas requisições subsequentes
        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  
        // Armazena o token e o usuário no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(response.data.response));
  
        // Atualiza as informações do usuário no contexto global
        setUserInfo(response.data.response);
  
        return { success: true, message: 'Login realizado com sucesso!', token };
      }
  
      return { success: false, message: message || 'Erro desconhecido durante o login.' };
  
    } catch (error) {
      console.error('Erro durante a requisição de login:', error);
      return { success: false, message: 'Usuário ou senha inválidos.' };
    }
  }
  