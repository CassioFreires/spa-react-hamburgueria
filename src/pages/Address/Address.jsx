import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { createAddress, getAddressByUser } from '../../services/service-address';
import { z } from 'zod';
import { asyncGetCepService } from '../../services/serive-cep';

// Esquema de validação Zod
const addressSchema = z.object({
  street: z.string().min(1, 'O campo rua é obrigatório'),
  number: z.string().min(1, 'O campo número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'O campo bairro é obrigatório'),
  zip_code: z.string().min(1, 'O campo CEP é obrigatório').length(8, 'O CEP precisa ter 9 caracteres'),
  city: z.string().min(1, 'O campo cidade é obrigatório'),
  state: z.string().length(2, 'O estado precisa ter 2 caracteres'),
  reference_point: z.string().optional(),
});

const Address = ({ userId }) => {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAuthToken = () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('O token não existe');
        throw new Error('O token não existe');
      }
      setAuthToken(token);
    };
    getAuthToken();
  }, []);

  const onSubmit = async (data) => {
    try {
      await createAddress(data, authToken);
      setStatusMessage('Endereço cadastrado com sucesso!');

      setTimeout(() => {
        navigate(-1);  // Volta para a página anterior
      }, 2000);
    } catch (error) {
      console.log(error);
      setStatusMessage('Erro ao cadastrar o endereço.');
    }
  };

  const buscarCep = async (e) => {
    const cep = e.target.value; // Pega o valor diretamente do evento
    setLoading(true);
    
    // Remover qualquer formatação do CEP antes de realizar a requisição
    const cepFormatado = cep.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cepFormatado.length !== 8) {
      setStatusMessage('CEP inválido. O CEP deve ter 8 dígitos.');
      setLoading(false);
      return;
    }
  
    // Atualiza o campo 'zip_code' imediatamente
    setValue('zip_code', cepFormatado); 
  
    try {
      const dadosCep = await asyncGetCepService(cepFormatado);
      setLoading(false);
  
      if (dadosCep) {
        // Preenche os campos com os dados do CEP
        setValue('street', dadosCep.logradouro || '');
        setValue('neighborhood', dadosCep.bairro || '');
        setValue('city', dadosCep.localidade || '');
        setValue('state', dadosCep.uf || '');
        setValue('reference_point', dadosCep.complemento || '');
        setStatusMessage('CEP encontrado com sucesso!');
      } else {
        setStatusMessage('CEP não encontrado ou erro na busca.');
      }
    } catch (error) {
      setLoading(false);
      setStatusMessage('Erro ao buscar o CEP. Tente novamente.');
      console.error(error); // Log do erro para depuração
    }
  };
  
  
  

  const formatCep = (value) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/^(\d{5})(\d{3})$/, '$1-$2'); // Aplica o formato 12345-678
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Cadastrar Endereço</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Rua */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              {...register('street')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              disabled // Tornando o campo não editável
            />
            {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
          </div>

          {/* Campo Número */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              {...register('number')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
            />
            {errors.number && <p className="text-red-500 text-xs">{errors.number.message}</p>}
          </div>

          {/* Campo Complemento */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              {...register('complement')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
            />
          </div>

          {/* Campo Bairro */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <input
              {...register('neighborhood')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              disabled // Tornando o campo não editável
            />
            {errors.neighborhood && <p className="text-red-500 text-xs">{errors.neighborhood.message}</p>}
          </div>

          {/* Campo CEP */}
          <div className="mb-4 flex items-center">
            <label className="block text-sm font-medium text-gray-700 w-1/2">CEP</label>
            <input
              {...register('zip_code')}
              onBlur={buscarCep}  // Chama a função ao perder o foco
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              maxLength="10" // Para garantir o formato do CEP
              onChange={(e) => e.target.value = formatCep(e.target.value)} // Formatação do CEP
            />
            <button
              type="button"
              onClick={buscarCep}
              className="ml-2 bg-blue-600 text-white p-2 rounded-md"
            >
              Buscar
            </button>
            {errors.zip_code && <p className="text-red-500 text-xs">{errors.zip_code.message}</p>}
          </div>

          {/* Campo Cidade */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              {...register('city')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              disabled // Tornando o campo não editável
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
          </div>

          {/* Campo Estado */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              {...register('state')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              maxLength="2"
              disabled // Tornando o campo não editável
            />
            {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
          </div>

          {/* Campo Ponto de Referência */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ponto de Referência</label>
            <input
              {...register('reference_point')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
            />
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Cadastrar Endereço
          </button>
        </form>

        {/* Exibição da mensagem de status */}
        {statusMessage && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-center">
            {statusMessage}
          </div>
        )}

        {loading && <div className="mt-4 text-center text-blue-600">Buscando...</div>}
      </div>
    </div>
  );
};

export default Address;
