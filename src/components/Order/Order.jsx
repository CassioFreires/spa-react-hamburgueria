import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import generateNotaFiscal from '../../utils/gerenateNotaFiscal';

// Definindo o esquema de validação com Zod
const orderSchema = z.object({
  nome: z.string().min(1, 'Campo Nome é obrigatório'),
  sobrenome: z.string().min(1, 'Campo Sobrenome é obrigatório'),
  endereco: z.string().min(1, 'Campo Endereço é obrigatório'),
  bairro: z.string().min(1, 'Campo Bairro é obrigatório'),
  cep: z.string().min(1, 'Campo Cep é obrigatório'),
  pagamento: z.string().min(1, 'Escolha uma forma de pagamento'), // Validação para radio
  modoEntrega: z.string().min(1, 'Escolha um modo de entrega'), // Validação para radio
});

const Order = () => {
  const [notificacao, setNotificacao] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  
  // Carregando ambos os carrinhos do localStorage
  const orderLocalHistorage = JSON.parse(localStorage.getItem('cart')) || [];
  const orderPromotionBurger = JSON.parse(localStorage.getItem('promotionBurger')) || [];
  const orderComboBurger = JSON.parse(localStorage.getItem('comboBurger')) || [];
  const orderDrinks = JSON.parse(localStorage.getItem('drinks')) || [];

  const navigate = useNavigate();

  // Função para calcular a taxa de entrega com base no modo de entrega
  const handleModoEntregaChange = (modo) => {
    if (modo === 'delivery') {
      setTaxaEntrega(5); // Se for delivery, a taxa é R$5
    } else {
      setTaxaEntrega(0); // Se for balcão, não há taxa
    }
  };

  // Gerar o link do WhatsApp com os dados do pedido
  const generateWhatsappLink = (data) => {
    const numeroWhatsapp = "5521981752434"; // Número de WhatsApp

    const mensagem = generateNotaFiscal(
      data.nome,
      data.sobrenome,
      data.endereco,
      data.bairro,
      data.cep,
      data.pagamento,
      data.modoEntrega,
      taxaEntrega,
      orderLocalHistorage,  // Carrinho de hambúrgueres
      orderPromotionBurger,  // Carrinho de promoções
      orderComboBurger
    );

    const mensagemUrlEncode = encodeURIComponent(mensagem.trim());
    return `https://wa.me/${numeroWhatsapp}?text=${mensagemUrlEncode}`;
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = (data) => {
    const orderLink = generateWhatsappLink(data);
    alert("Pedido enviado com sucesso!");
    setNotificacao(
      <>
        Seu pedido foi enviado! Agora é só aguardar que iremos avisar quando estiver pronto. <br />
        <a href={orderLink} target="_blank" className="text-blue-600 underline">
          Clique aqui para visualizar e confirmar seu pedido no WhatsApp
        </a>
      </>
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-blue-600 hover:text-blue-800"
        >
          &#8592; Voltar
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Finalizar Pedido</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de nome */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              {...register('nome')}  // Registrando o campo de nome
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.nome && <span className="text-red-600">{errors.nome.message}</span>}
          </div>

          {/* Campo de sobrenome */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="sobrenome">Sobrenome</label>
            <input
              type="text"
              id="sobrenome"
              {...register('sobrenome')}  // Registrando o campo de sobrenome
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.sobrenome && <span className="text-red-600">{errors.sobrenome.message}</span>}
          </div>

          {/* Campos de endereço */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              {...register('endereco')}  // Registrando o campo de endereço
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.endereco && <span className="text-red-600">{errors.endereco.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="bairro">Bairro</label>
            <input
              type="text"
              id="bairro"
              {...register('bairro')}  // Registrando o campo de bairro
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.bairro && <span className="text-red-600">{errors.bairro.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="cep">CEP</label>
            <input
              type="text"
              id="cep"
              {...register('cep')}  // Registrando o campo de cep
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.cep && <span className="text-red-600">{errors.cep.message}</span>}
          </div>

          {/* Forma de pagamento */}
          <div className="mb-4">
            <label className="block text-gray-700">Forma de Pagamento</label>
            <div className="flex items-center">
              <label htmlFor="cartao" className="mr-4">Cartão</label>
              <input
                type="radio"
                id="cartao"
                {...register('pagamento')}
                value="cartao"
                className="mr-2"
              />
              <label htmlFor="pix" className="mr-4">Pix</label>
              <input
                type="radio"
                id="pix"
                {...register('pagamento')}
                value="pix"
                className="mr-2"
              />
            </div>
            {errors.pagamento && <span className="text-red-600">{errors.pagamento.message}</span>}
          </div>

          {/* Opção de entrega */}
          <div className="mb-4">
            <label className="block text-gray-700">Modo de Entrega</label>
            <div className="flex items-center">
              <label htmlFor="balcao" className="mr-4">Retirada no Balcão</label>
              <input
                type="radio"
                id="balcao"
                {...register('modoEntrega')}
                value="balcao"
                className="mr-2"
                onChange={() => handleModoEntregaChange('balcao')}
              />
              <label htmlFor="delivery" className="mr-4">Delivery</label>
              <input
                type="radio"
                id="delivery"
                {...register('modoEntrega')}
                value="delivery"
                className="mr-2"
                onChange={() => handleModoEntregaChange('delivery')}
              />
            </div>
            {errors.modoEntrega && <span className="text-red-600">{errors.modoEntrega.message}</span>}
          </div>

          {/* Exibindo a taxa de entrega, se for delivery */}
          {taxaEntrega > 0 && (
            <div className="mb-4">
              <p className="text-gray-700">Taxa de Entrega: R${taxaEntrega.toFixed(2)}</p>
            </div>
          )}

          {/* Botão de Enviar Pedido */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Enviar Pedido
          </button>
        </form>

        {/* Exibição da notificação após envio do pedido */}
        {notificacao && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-center">
            {notificacao}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
