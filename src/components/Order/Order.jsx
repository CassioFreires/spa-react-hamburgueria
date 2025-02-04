import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import generateNotaFiscal from '../../utils/gerenateNotaFiscal';
import { getAddressByUser } from '../../services/service-address';

// Definindo o esquema de validação com Zod
const orderSchema = z.object({
  nome: z.string().min(1, 'Campo Nome é obrigatório'),
  sobrenome: z.string().min(1, 'Campo Sobrenome é obrigatório'),
  endereco: z.string().min(1, 'Campo Endereço é obrigatório'),
  bairro: z.string().min(1, 'Campo Bairro é obrigatório'),
  cep: z.string().min(1, 'Campo Cep é obrigatório'),
  pagamento: z.string().min(1, 'Escolha uma forma de pagamento'),
  modoEntrega: z.string().min(1, 'Escolha um modo de entrega'),
});

const Order = () => {
  const [notificacao, setNotificacao] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [address, setAddress] = useState(null);
  const [modoEntregaSelecionado, setModoEntregaSelecionado] = useState('');

  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  // Carregando os carrinhos do localStorage
  const orderLocalHistorage = JSON.parse(localStorage.getItem('cart')) || [];
  const orderPromotionBurger = JSON.parse(localStorage.getItem('promotionBurger')) || [];
  const orderComboBurger = JSON.parse(localStorage.getItem('comboBurger')) || [];
  const orderDrinks = JSON.parse(localStorage.getItem('drinks')) || [];

  // Função para carregar o endereço do usuário
  const fetchAddress = async () => {
    const addressData = await getAddressByUser(authToken);
    setAddress(addressData);
  };

  useEffect(() => {
    if (authToken) {
      console.log(address)
      fetchAddress();
    }
  }, [authToken]);

  // Função para lidar com a mudança no modo de entrega
  const handleModoEntregaChange = (modo) => {
    setModoEntregaSelecionado(modo);
    if (modo === 'delivery') {
      if (!address) {
        // Se não houver endereço, redireciona para a página de cadastro de endereço
        navigate('/address');
      } else {
        setTaxaEntrega(5); // Define a taxa de entrega para R$5
      }
    } else {
      setTaxaEntrega(0); // Não há taxa para retirada no balcão
    }
  };

  // Função para gerar o link do WhatsApp
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
      orderLocalHistorage,
      orderPromotionBurger,
      orderComboBurger,
      orderDrinks
    );

    const mensagemUrlEncode = encodeURIComponent(mensagem.trim());
    return `https://wa.me/${numeroWhatsapp}?text=${mensagemUrlEncode}`;
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
  });

  // Função para enviar o pedido
  const onSubmit = (data) => {
    if (modoEntregaSelecionado === 'delivery' && !address) {
      alert("Por favor, cadastre um endereço antes de prosseguir.");
      return;
    }

    const orderLink = generateWhatsappLink(data);

    const pedido = {
      id: new Date().getTime(),
      nome: data.nome,
      sobrenome: data.sobrenome,
      endereco: data.endereco,
      bairro: data.bairro,
      cep: data.cep,
      pagamento: data.pagamento,
      modoEntrega: data.modoEntrega,
      taxaEntrega: taxaEntrega,
      itens: {
        hamburgueres: orderLocalHistorage,
        promocao: orderPromotionBurger,
        combo: orderComboBurger,
        bebidas: orderDrinks,
      },
      status: "Solicitado",
    };

    const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidosExistentes.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosExistentes));

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

  // Função para voltar à página anterior
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
              {...register('nome')}
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.nome && <span className="text-red-600">{errors.nome.message}</span>}
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
                checked={modoEntregaSelecionado === 'balcao'}
              />
              <label htmlFor="delivery" className="mr-4">Delivery</label>
              <input
                type="radio"
                id="delivery"
                {...register('modoEntrega')}
                value="delivery"
                className="mr-2"
                onChange={() => handleModoEntregaChange('delivery')}
                checked={modoEntregaSelecionado === 'delivery'}
              />
            </div>
            {modoEntregaSelecionado === 'delivery' && !address && (
              <p
                className="text-blue-600 cursor-pointer mt-1"
                onClick={() => navigate('/address')}
              >
                Você não possui um endereço cadastrado. Clique aqui para cadastrar.
              </p>
            )}
          </div>

          {/* Exibindo a taxa de entrega, se for delivery */}
          {taxaEntrega > 0 && (
            <div className="mb-4">
              <p className="text-gray-700">Taxa de Entrega: R${taxaEntrega.toFixed(2)}</p>
            </div>
          )}

          {/* Exibindo o endereço cadastrado, se houver */}
          {address && modoEntregaSelecionado === 'delivery' && (
            <div className="mb-4">
              <label className="block text-gray-700">Endereço cadastrado</label>
              <div>
                <p>{address.street}, {address.number} - {address.neighborhood}</p>
                <p>{address.city} - {address.state}, {address.zip_code}</p>

                {/* Botões Editar e Remover (só aparecem se houver endereço) */}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => navigate('/address/edit')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => {
                      setAddress(null);
                      setTaxaEntrega(0);
                      setModoEntregaSelecionado('balcao'); // Muda para retirada no balcão ao remover o endereço
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remover
                  </button>
                </div>
              </div>
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