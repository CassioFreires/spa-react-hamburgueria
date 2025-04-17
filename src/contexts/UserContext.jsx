import React, { createContext, useState, useContext, useEffect } from "react";

// Criação do contexto
const UserContext = createContext(null);

// Hook personalizado
export const useUser = () => useContext(UserContext);

// Provedor do contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // <-- adiciona loading

    useEffect(() => {
        const userToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (userToken && userData && userData !== 'undefined' && userData !== 'null') {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Erro ao fazer parse do usuário:', error);
            }
        }

        setLoading(false); // <-- fim da checagem
    }, []);

    const setUserInfo = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
    }

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    return (
        <UserContext.Provider value={{ user, setUserInfo, clearUser, loading }}>
            {!loading && children} {/* <-- só renderiza filhos quando checado */}
        </UserContext.Provider>
    );
}
