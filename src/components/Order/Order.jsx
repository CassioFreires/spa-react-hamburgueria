import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import generateNotaFiscal from '../../utils/gerenateNotaFiscal';
import { getAddressByUser } from '../../services/service-address';
import { sendOrder } from '../../services/service-order';
import { useUser } from '../../contexts/UserContext';

const DELIVERY_FEE = 5; // Taxa de entrega fixa para "delivery"

// Expressão regular para validar o formato do celular
const phoneRegex = new RegExp(/^\(\d{2}\) \d{4,5}-\d{4}$/);

// Definição do esquema de validação do formulário com Zod
const orderSchema = z.object({
  nome: z.string().min(1, 'Campo Nome é obrigatório'),
  sobrenome: z.string().min(1, 'Campo Sobrenome é obrigatório'),
  email: z.string().email({ message: "Formato de email inválido" }),
  celular: z.string().refine((val) => phoneRegex.test(val), {
    message: "Formato de celular inválido (ex: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX)",
  }),
  pagamento: z.string().nullable().refine(val => val !== null && val.length > 0, {
    message: 'Escolha uma forma de pagamento',
  }),
  modoEntrega: z.string().nullable().refine(val => val !== null && val.length > 0, {
    message: 'Escolha um modo de entrega',
  }),
});

const Order = () => {
  // Contexto do usuário
  const { user, setUserInfo, clearUser } = useUser();
  
  // Estados do componente
  const [notificacao, setNotificacao] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [enderecos, setEnderecos] = useState([]);
  const [modoEntrega, setModoEntrega] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infBasicOrder, setInfBasicOrder] = useState(null);

  // Carregando os itens do carrinho a partir do localStorage
  const orderLocalHistorage = JSON.parse(localStorage.getItem('cart')) || [];
  const orderPromotionBurger = JSON.parse(localStorage.getItem('promotionBurger')) || [];
  const orderComboBurger = JSON.parse(localStorage.getItem('comboBurger')) || [];
  const orderDrinks = JSON.parse(localStorage.getItem('drinks')) || [];
  

  const navigate = useNavigate();
  
  // Hooks do React Hook Form para lidar com o formulário
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    resolver: zodResolver(orderSchema),
  });

  // Função para atualizar o modo de entrega e calcular a taxa de entrega
  const handleModoEntregaChange = (modo) => {
    setModoEntrega(modo);
    setTaxaEntrega(modo === 'delivery' ? DELIVERY_FEE : 0); // Se "delivery", taxa de entrega
  };

  // Função que gera o link do WhatsApp com a mensagem do pedido
  const generateWhatsappLink = (data) => {
    let endereco = '', bairro = '', cep = '', complemento = '', referencia = '';
  
    if (modoEntrega === 'delivery' && enderecos.length > 0) {
      const e = enderecos[0];
      endereco = `${e.street}, ${e.number}`;
      bairro = e.neighborhood;
      cep = e.zip_code;
      complemento = e.complement;
      referencia = e.reference_point;
    }
  
    const mensagem = generateNotaFiscal(
      data.nome,
      data.sobrenome,
      endereco,
      bairro,
      cep,
      complemento,
      referencia,
      data.pagamento,
      data.modoEntrega,
      taxaEntrega,
      orderLocalHistorage,
      orderPromotionBurger,
      orderComboBurger,
      orderDrinks
    );
  
    const mensagemUrlEncode = encodeURIComponent(mensagem.trim());
    const celular = data.celular.replace(/\D/g, '');
  
    return `https://wa.me/${celular}?text=${mensagemUrlEncode}`;
  };
  

  // Função que é chamada quando o pedido é enviado com sucesso
  const handlePedidoEnviado = (orderLink) => {
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

  // Função de submissão do formulário
  const onSubmit = (data) => {
    const orderLink = generateWhatsappLink(data);
  
    let enderecoInfo = {};
    if (modoEntrega === 'delivery' && enderecos.length > 0) {
      const e = enderecos[0];
      enderecoInfo = {
        endereco: `${e.street}, ${e.number}`,
        bairro: e.neighborhood,
        cep: e.zip_code,
        cidade: e.city,
        estado: e.state,
        complemento: e.complement,
        referencia: e.reference_point
      };
    }


    const order = {
      id_pedido: new Date().getTime(),
      id_endereco: enderecos[0].address_id,
      id_user: user.id,
      nome: data.nome,
      sobrenome: data.sobrenome,
      email: data.email,
      celular: data.celular,
      pagamento: data.pagamento,
      modoEntrega: data.modoEntrega,
      taxaEntrega: taxaEntrega,
      ...enderecoInfo,
      orderItems: {
        hamburgueres: orderLocalHistorage,
        promocao: orderPromotionBurger,
        combo: orderComboBurger,
        bebidas: orderDrinks,
      },
      status: "Solicitado",
    };
  
    const token = localStorage.getItem('authToken');
    sendOrder(order, token);

  
    const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidosExistentes.push(order);
    localStorage.setItem('pedidos', JSON.stringify(pedidosExistentes));
  
    handlePedidoEnviado(orderLink);
  };
  
  // Função para navegar para a página do carrinho
  const handleBack = () => {
    navigate('/cart');
  };

  // Função para navegar para a página de adicionar endereço
  const handleAddEndereco = () => {
    navigate('/address');
  };

  // Função para remover um endereço da lista
  const handleRemoveEndereco = (endereco) => {
    const newEnderecos = enderecos.filter(item => item !== endereco);
    setEnderecos(newEnderecos);
    localStorage.setItem('enderecos', JSON.stringify(newEnderecos));
  };

  // Função para editar um endereço
  const handleEditEndereco = (data) => {
    // =========================================================== parei aqui: é para guardar as informações do usuário quando ele clicar em editar e voltar para pagina
    const formValues = getValues();
    const inforOrder = localStorage.setItem('inforBasicOrder', JSON.stringify({
      nome: formValues.nome,
      sobrenome: formValues.sobrenome,
      email: formValues.email,
      celular: formValues.celular,

    }));
    setInfBasicOrder(formValues);
    navigate('/editaddress');
  };

  // Função para buscar os endereços do usuário
  const fetchAddress = async (token) => {
    setLoading(true);
    const response = await getAddressByUser(token);
    setLoading(false);

    if (response?.error) {
      setError(response.error.includes("User does not have an address registered")
        ? 'Você ainda não possui um endereço cadastrado. Clique abaixo para adicionar um novo.'
        : response.error);
    } else if (response?.data?.addresByUser) {
      setEnderecos([response.data.addresByUser]);
    }
  };

  // Efeito para buscar os endereços quando o modo de entrega é "delivery"
  useEffect(() => {
    if (modoEntrega === 'delivery') {
      const token = localStorage.getItem('authToken');
      fetchAddress(token);
    }
  }, [modoEntrega]);

  useEffect(() => {
    const storedInfo = localStorage.getItem('inforBasicOrder');
    if (storedInfo) {
      const data = JSON.parse(storedInfo);
      console.log(storedInfo)
      reset(data); // repopula o formulário
    }
  }, []);
  // Renderização do componente
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 relative">
        {/* Botão de voltar */}
        <button onClick={handleBack} className="absolute top-4 left-4 text-blue-600 hover:text-blue-800">
          &#8592; Voltar
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Finalizar Pedido</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campos de formulário para nome, sobrenome, e-mail, celular */}
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

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="sobrenome">Sobrenome</label>
            <input
              type="text"
              id="sobrenome"
              {...register('sobrenome')}
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.sobrenome && <span className="text-red-600">{errors.sobrenome.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.email && <span className="text-red-600">{errors.email.message}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="celular">Celular</label>
            <input
              type="tel"
              id="celular"
              {...register('celular')}
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            {errors.celular && <span className="text-red-600">{errors.celular.message}</span>}
          </div>

          {/* Forma de Pagamento */}
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

          {/* Modo de entrega */}
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

          {/* Endereço de entrega */}
          {modoEntrega === 'delivery' && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Selecione um endereço de entrega</h3>
              {loading ? (
                <div>Carregando endereços...</div>
              ) : error ? (
                <div className="text-red-600">
                  <div className="text-sm text-gray-600">
                    {error}
                    {error.includes("Não há endereços cadastrados") && (
                      <button
                        type="button"
                        onClick={handleAddEndereco}
                        className="text-blue-600 hover:underline ml-1"
                      >
                        Clique aqui para adicionar um endereço
                      </button>
                    )}
                  </div>
                </div>
              ) : enderecos.length > 0 ? (
                <ul className="list-disc pl-5">
                  {enderecos.map((endereco, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{endereco.street}, {endereco.number}, {endereco.city} - {endereco.state}</span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleEditEndereco}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmit(handleRemoveEndereco(endereco))}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-600">
                  Não há endereços cadastrados.
                  <button
                    type="button"
                    onClick={handleAddEndereco}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Clique aqui para adicionar um endereço
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Exibição da taxa de entrega */}
          {taxaEntrega > 0 && (
            <div className="mb-4">
              <p className="text-gray-700">Taxa de Entrega: R${taxaEntrega.toFixed(2)}</p>
            </div>
          )}

          {/* Botão de envio do pedido */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Enviar Pedido
          </button>
        </form>

        {/* Notificação de sucesso após o envio */}
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
