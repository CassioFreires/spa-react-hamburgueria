import axios from 'axios';

export async function getAddressByUser(token) {
    const url = 'http://localhost:3000/address/getByUserId';

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(response)

        return response.data.addresByUser;
    } catch (error) {
        console.log('Erro na requisição', error);
        return [];  // Retorna um array vazio em caso de falha na requisição
    }
}