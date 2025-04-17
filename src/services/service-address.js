import axios from 'axios';

<<<<<<< HEAD
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
=======
const BASE_URL = 'http://localhost:3000'; // URL configurável

// Função para obter endereço por ID de usuário
export const getAddressByUser = async (token) => {
  if (!token) {
    console.error('Token inválido!');
    return { error: 'Token não fornecido.' };  // Retorna um erro claro
  }

  try {
    // Fazendo a requisição para o backend com o token no header Authorization
    const { data } = await axios.get(`${BASE_URL}/address/getByUserId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verifica se a resposta contém dados esperados
    if (!data) {
      console.error('Nenhum endereço encontrado para o usuário.');
      return { error: 'Nenhum endereço encontrado.' };
    }

    return { data }; // Retorna os dados obtidos na resposta da API
  } catch (error) {
    // Log de erro mais detalhado
    console.error('Erro ao tentar obter o endereço:', error.response?.data || error.message);
    return { error: 'O usuário não possui endereço cadastrado.', endereco: [] };
  }
};



// Função para enviar o endereço para a API (simulação do serviço)
export const createAddress = async (addressData, token) => {
  const response = await axios.post(
    `${BASE_URL}/address/create`,
    addressData, // Passando os dados do endereço no corpo da requisição
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 201) {
    throw new Error('Erro ao criar o endereço');
  }

  return response.data; // Retorna os dados da resposta da API
};


export const removeAddressService = () => {

}

// Função para editar um endereço
export const updateAddressService = async (addressData, token) => {
  if (!token) {
    console.error('Token inválido!');
    throw new Error('Token não fornecido.');
  }

  try {
    // Fazendo a requisição para o backend com o token no header Authorization
    const { data } = await axios.patch(`${BASE_URL}/address/update`, addressData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Verifica se a resposta contém dados esperados
    if (!data) {
      throw new Error('Erro ao atualizar o endereço.');
    }

    return data; // Retorna os dados atualizados
  } catch (error) {
    // Log de erro mais detalhado
    console.error('Erro ao tentar atualizar o endereço:', error.response?.data || error.message);
    throw new Error('Erro ao atualizar o endereço');
  }
};
>>>>>>> main
