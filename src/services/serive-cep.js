import axios from 'axios';

export const asyncGetCepService = async (cep) => {
    console.log(cep)
    // Validando o formato do CEP
    const cepPattern = /^[0-9]{5}-?[0-9]{3}$/;
    if (!cepPattern.test(cep)) {
        console.error('CEP inválido');
        console.log(cep)
        return null;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
        const response = await axios.get(url);

        // Verificando se a resposta não contém erro
        if (response.data.erro) {
            console.error('CEP não encontrado');
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error.message);
        return null;
    }
};
