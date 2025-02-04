
import axios from 'axios';



export async function getCep(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
   

    try {

        console.log(`Consultando CEP: ${cep}`);  // Log para depuração

        const {status, data} = await axios.get(url);  
        console.log('passei aqui')// Desestruturando a resposta

        if (status !== 200) {
            console.error(`Erro na resposta: Status code ${status}`);  // Log para erro de status
            throw new Error('Erro ao buscar dados do CEP');
        }

        console.log(`Resposta recebida para o CEP ${cep}:`, data);  // Log para dados recebidos
        return data;  // Retorna apenas os dados necessários da resposta
    } catch (error) {
        // Log detalhado do erro
        console.error(`Erro ao consultar o CEP ${cep}:`, error.message);
        throw new Error(`Erro ao consultar o CEP ${cep}: ${error.message}`);
    }
}
