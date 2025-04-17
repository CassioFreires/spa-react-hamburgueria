<<<<<<< HEAD
import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

// Função para buscar o CEP via API
export async function getCep(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
        const { status, data } = await axios.get(url);
        if (status !== 200) {
            throw new Error('Erro ao buscar dados do CEP');
        }
        return data;
    } catch (error) {
        console.error('Erro ao consultar o CEP:', error.message);
        throw new Error('Erro ao consultar o CEP');
    }
}

// Esquema de validação com Zod
const addressSchema = z.object({
    usuario_id: z.string().min(1, "Usuário ID é obrigatório"),
    logradouro: z.string().min(1, "Logradouro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    cep: z.string().min(1, "CEP é obrigatório").regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    estado: z.string().min(2, "Estado é obrigatório"),
    ponto_referencia: z.string().optional(),
});

const Address = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        usuario_id: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cep: '',
        cidade: '',
        estado: '',
        ponto_referencia: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação
        const result = addressSchema.safeParse(address);
        if (!result.success) {
            setErrors(result.error.formErrors.fieldErrors);
            return;
        }

        setErrors({});
        setTimeout(() => {
            alert('Endereço salvo com sucesso');
        }, 1000);
        navigate('/order')
        // Aqui você pode processar os dados ou enviar para uma API
    };

    const handleCepSearch = async () => {
        setIsLoading(true);
        try {
            const data = await getCep(address.cep);
            setAddress({
                ...address,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
            });
            setErrors({});
        } catch (error) {
            setErrors({ cep: 'Não foi possível buscar o CEP.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setAddress({
            usuario_id: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cep: '',
            cidade: '',
            estado: '',
            ponto_referencia: '',
        });
        setErrors({});
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Formulário de Endereço</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <label htmlFor="usuario_id" className="block text-sm font-medium text-gray-700">Usuário ID</label>
                    <input
                        type="number"
                        name="usuario_id"
                        value={address.usuario_id}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.usuario_id && <span className="text-red-600 text-sm">{errors.usuario_id}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">Logradouro</label>
                    <input
                        type="text"
                        name="logradouro"
                        value={address.logradouro}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.logradouro && <span className="text-red-600 text-sm">{errors.logradouro}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número</label>
                    <input
                        type="text"
                        name="numero"
                        value={address.numero}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.numero && <span className="text-red-600 text-sm">{errors.numero}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">Complemento</label>
                    <input
                        type="text"
                        name="complemento"
                        value={address.complemento}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input
                        type="text"
                        name="bairro"
                        value={address.bairro}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.bairro && <span className="text-red-600 text-sm">{errors.bairro}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700">CEP</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            name="cep"
                            value={address.cep}
                            onChange={handleChange}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={handleCepSearch}
                            disabled={isLoading}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            {isLoading ? 'Buscando...' : 'Buscar CEP'}
                        </button>
                    </div>
                    {errors.cep && <span className="text-red-600 text-sm">{errors.cep}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input
                        type="text"
                        name="cidade"
                        value={address.cidade}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.cidade && <span className="text-red-600 text-sm">{errors.cidade}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                    <input
                        type="text"
                        name="estado"
                        value={address.estado}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.estado && <span className="text-red-600 text-sm">{errors.estado}</span>}
                </div>

                <div className="mb-6">
                    <label htmlFor="ponto_referencia" className="block text-sm font-medium text-gray-700">Ponto de Referência</label>
                    <input
                        type="text"
                        name="ponto_referencia"
                        value={address.ponto_referencia}
                        onChange={handleChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Salvar Endereço
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-full px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                    >
                        Limpar Campos
                    </button>
                </div>
            </form>
        </div>
    );
=======
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
>>>>>>> main
};

export default Address;
