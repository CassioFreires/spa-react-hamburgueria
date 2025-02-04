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
};

export default Address;
