import React, { createContext, useState, useContext, useEffect } from "react";

// Criação do contexto que irá armazenar as informações do usuário
const UserContext = createContext(null);

// Hook personalizado para acessar o contexto de forma fácil
export const useUser = () => {
    return useContext(UserContext);
}

// Provedor de contexto (UserProvider) que irá fornecer o estado global para os componentes filhos
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Efeito para pegar as informações do usuário quando a página for carregada
    useEffect(() => {
        const userToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        // Verifique se o 'userData' existe e é uma string válida antes de tentar fazer o parse
        if (userToken && userData && userData !== 'undefined' && userData !== 'null') {
            try {
                const parsedUser = JSON.parse(userData); // Tenta fazer o parse
                setUser(parsedUser); // Atualiza o estado com as informações do usuário
            } catch (error) {
                console.error('Erro ao fazer parse do usuário:', error);
            }
        }
    }, []);

    // Função para atualizar o usuário (ex: após login)
    const setUserInfo = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo)); // Armazena as informações do usuário no localStorage
    }

    // Função para limpar o usuário (ex: após logout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('user'); // Limpa do localStorage
        localStorage.removeItem('authToken'); // Limpa o token
    };

    return (
        <UserContext.Provider value={{ user, setUserInfo, clearUser }}>
            {children}
        </UserContext.Provider>
    );
}
