import axios from 'axios';

export async function loginService(email, password_hash) {
    const url = 'http://localhost:3000/user/login';
    try {
        const dataLogin = { email, password_hash };

        // Enviar req POST para API de login
        const response = await axios.post(url, dataLogin, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { token, message } = response.data;
        if (token) {
            // Armazenar token no localStorage
            localStorage.setItem('authToken', token);
            return { success: true, message: 'Login realizado com sucesso!', token };
        }

        return { success: false, message: message || 'Erro desconhecido durante o login.' };

    } catch (error) {
        // Caso haja erro, trata de forma adequada
        if (error.response) {
            // Erro de resposta da API (ex.: 401 Unauthorized)
            return { success: false, message: 'Usuário ou senha inválidos.' };
        } else if (error.request) {
            // Se o servidor não respondeu
            return { success: false, message: 'Problema na conexão com o servidor. Tente novamente.' };
        } else {
            // Outros erros
            return { success: false, message: 'Erro inesperado. Tente novamente.' };
        }
    }
}
