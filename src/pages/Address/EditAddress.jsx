import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { getAddressByUser, updateAddressService } from '../../services/service-address';  // Funções de serviço
import axios from 'axios';

// Validação do CEP com regex
const cepRegex = /^[0-9]{5}-?[0-9]{3}$/;

const addressSchema = z.object({
  street: z.string().min(1, 'O campo rua é obrigatório').optional(),
  number: z.string().min(1, 'O campo número é obrigatório').optional(),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'O campo bairro é obrigatório').optional(),
  zip_code: z.string()
    .min(1, 'O campo CEP é obrigatório')
    .length(8, 'O CEP precisa ter 8 caracteres')
    .regex(cepRegex, 'Formato de CEP inválido')
    .optional(),
  city: z.string().min(1, 'O campo cidade é obrigatório').optional(),
  state: z.string().length(2, 'O estado precisa ter 2 caracteres').optional(),
  reference_point: z.string().optional(),
});

const EditAddress = () => {
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusColor, setStatusColor] = useState('');
  const [isCepLoading, setIsCepLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setStatusMessage('Token não encontrado! Faça login novamente.');
        setStatusColor('bg-red-500');
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await getAddressByUser(token);

      if (error) {
        setStatusMessage(error);
        setStatusColor('bg-red-500');
      } else {
        setAddressData(data);
        setValue('street', data?.addresByUser.street || '');
        setValue('number', data?.addresByUser.number || '');
        setValue('complement', data?.addresByUser.complement || '');
        setValue('neighborhood', data?.addresByUser.neighborhood || '');
        setValue('zip_code', data?.addresByUser.zip_code || '');
        setValue('city', data?.addresByUser.city || '');
        setValue('state', data?.addresByUser.state || '');
        setValue('reference_point', data?.addresByUser.reference_point || '');
        setStatusMessage('Endereço carregado com sucesso.');
        setStatusColor('bg-green-500');
      }

      setLoading(false);
    };

    fetchAddress();
  }, [setValue]);

  const onSubmit = async (data) => {
    if (
      data.street === addressData?.street &&
      data.number === addressData?.number &&
      data.complement === addressData?.complement &&
      data.neighborhood === addressData?.neighborhood &&
      data.zip_code === addressData?.zip_code &&
      data.city === addressData?.city &&
      data.state === addressData?.state &&
      data.reference_point === addressData?.reference_point
    ) {
      setStatusMessage('Nenhuma alteração detectada. Atualize pelo menos um campo.');
      setStatusColor('bg-red-500');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setStatusMessage('Token inválido! Faça login novamente.');
        setStatusColor('bg-red-500');
        return;
      }

      const updatedAddress = await updateAddressService(data, token);

      setStatusMessage('Endereço atualizado com sucesso!');
      setStatusColor('bg-green-500');
    } catch (error) {
      setStatusMessage('Erro ao atualizar o endereço. Tente novamente.');
      setStatusColor('bg-red-500');
    }
  };

  // Função para buscar os dados do CEP
  const fetchCepData = async (cep) => {
    if (!cepRegex.test(cep)) {
      setError('zip_code', { type: 'manual', message: 'CEP inválido' });
      return;
    }

    setIsCepLoading(true); // Inicia o carregamento da pesquisa do CEP

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);

      if (response.data.erro) {
        setStatusMessage('CEP não encontrado.');
        setStatusColor('bg-red-500');
        setIsCepLoading(false);
        return;
      }

      // Preenche os campos com os dados retornados do CEP
      setValue('street', response.data.logradouro || '');
      setValue('neighborhood', response.data.bairro || '');
      setValue('city', response.data.localidade || '');
      setValue('state', response.data.uf || '');
      setStatusMessage('Dados preenchidos com sucesso!');
      setStatusColor('bg-green-500');
    } catch (error) {
      setStatusMessage('Erro ao buscar dados do CEP. Tente novamente.');
      setStatusColor('bg-red-500');
    }

    setIsCepLoading(false); // Finaliza o carregamento da pesquisa do CEP
  };

  if (loading) {
    return <div className="text-center">Carregando endereço...</div>;
  }

  if (!addressData) {
    return <div className="text-center text-red-500">Nenhum endereço cadastrado.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Editar Endereço</h2>

        {/* Mensagem de Status */}
        {statusMessage && (
          <div className={`${statusColor} text-white p-3 rounded-md text-center mb-4`}>
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Rua */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Rua</label>
            <input
              {...register('street')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
          </div>

          {/* Campo Número */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <input
              {...register('number')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.number && <p className="text-red-500 text-xs">{errors.number.message}</p>}
          </div>

          {/* Campo Complemento */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <input
              {...register('complement')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
          </div>

          {/* Campo Bairro */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <input
              {...register('neighborhood')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.neighborhood && <p className="text-red-500 text-xs">{errors.neighborhood.message}</p>}
          </div>

          {/* Campo CEP */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <div className="flex items-center">
              <input
                {...register('zip_code')}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                maxLength="9"
                onBlur={(e) => fetchCepData(e.target.value)} // Pesquisa quando o campo perde o foco
              />
              <button
                type="button"
                onClick={() => fetchCepData(getValues('zip_code'))}
                disabled={isCepLoading}
                className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                {isCepLoading ? 'Carregando...' : 'Buscar CEP'}
              </button>
            </div>
            {errors.zip_code && <p className="text-red-500 text-xs">{errors.zip_code.message}</p>}
          </div>

          {/* Campo Cidade */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              {...register('city')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
          </div>

          {/* Campo Estado */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <input
              {...register('state')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              maxLength="2"
            />
            {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
          </div>

          {/* Botão Voltar */}
          <button
            type="button"
            onClick={() => navigate('/order')}
            className="w-full bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500 mb-4"
          >
            Voltar para Pedidos
          </button>

          {/* Botão de Atualização */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Atualizar Endereço
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAddress;
