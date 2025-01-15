import axios from 'axios';

export async function getAllCombos() {
    const url = 'http://localhost:3000/combos/getAll';
    try {
        const response = await axios.get(url);
        // Garantir que a estrutura dos dados esteja correta
        if (response.data.status === 200) {
            return response.data.combos;  // Retorna apenas a lista de hambúrgueres
        } else {
            console.error('Erro ao buscar promoções:', response.data.message);
            return [];  // Retorna um array vazio em caso de erro
        }
    } catch (error) {
        console.log('Erro na requisição', error);
        return [];  // Retorna um array vazio em caso de falha na requisição
    }
}