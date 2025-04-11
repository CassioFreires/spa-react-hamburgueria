import axios from 'axios';

export async function getAllPromotions() {
    const url = `${import.meta.env.VITE_BASE_URL_API}:${import.meta.env.VITE_API_PORT}/promotions/getAll`;
    try {
        const response = await axios.get(url);
        // Garantir que a estrutura dos dados esteja correta
        if (response.data.status === 200) {
            return response.data.promotions;  // Retorna apenas a lista de hambúrgueres
        } else {
            console.error('Erro ao buscar hambúrgueres:', response.data.message);
            return [];  // Retorna um array vazio em caso de erro
        }
    } catch (error) {
        console.log('Erro na requisição', error);
        return [];  // Retorna um array vazio em caso de falha na requisição
    }
}