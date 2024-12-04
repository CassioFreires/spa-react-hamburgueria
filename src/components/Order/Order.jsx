import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook de navegação

const Order = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [pagamento, setPagamento] = useState('cartao');
  const [modoEntrega, setModoEntrega] = useState('balcao'); // Retirada no balcão ou Delivery
  const [notificacao, setNotificacao] = useState('');
  
  const [taxaEntrega, setTaxaEntrega] = useState(0); // Taxa de entrega
  const [valorTotal, setValorTotal] = useState(50); // Valor total do pedido (Exemplo)

  const navigate = useNavigate(); // Função para navegação

  // Função para calcular a taxa de entrega dependendo do modo de entrega
  const handleModoEntregaChange = (modo) => {
    setModoEntrega(modo);
    if (modo === 'delivery') {
      setTaxaEntrega(5); // Exemplo de taxa fixa para delivery
    } else {
      setTaxaEntrega(0); // Sem taxa para retirada no balcão
    }
  };

  // Função para gerar o link do WhatsApp com todas as informações do pedido
  const generateWhatsappLink = () => {
    const numeroWhatsapp = "5521981752434"; // Substitua pelo número da sua hamburgueria (incluindo o código do país)
    
    const mensagem = `
      Pedido de ${nome} ${sobrenome}:
      Endereço: ${endereco}, ${bairro}, ${cep}
      Forma de Pagamento: ${pagamento === 'cartao' ? 'Cartão' : 'Pix'}
      Modo de Entrega: ${modoEntrega === 'balcao' ? 'Retirada no Balcão' : 'Delivery'}
      Taxa de Entrega: R$${taxaEntrega.toFixed(2)}
      Valor Total: R$${(valorTotal + taxaEntrega).toFixed(2)}
    `;

    const mensagemUrlEncode = encodeURIComponent(mensagem.trim());
    return `https://wa.me/${numeroWhatsapp}?text=${mensagemUrlEncode}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderLink = generateWhatsappLink();
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
    navigate(-1); // Retorna à página anterior
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
        
        <form onSubmit={handleSubmit}>
          {/* Campo de nome */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          
          {/* Campo de sobrenome */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="sobrenome">Sobrenome</label>
            <input
              type="text"
              id="sobrenome"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
            />
          </div>

          {/* Campos de endereço */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="bairro">Bairro</label>
            <input
              type="text"
              id="bairro"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="cep">CEP</label>
            <input
              type="text"
              id="cep"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              required
            />
          </div>

          {/* Forma de pagamento */}
          <div className="mb-4">
            <label className="block text-gray-700">Forma de Pagamento</label>
            <div className="flex items-center">
              <label htmlFor="cartao" className="mr-4">Cartão</label>
              <input
                type="radio"
                id="cartao"
                name="pagamento"
                value="cartao"
                checked={pagamento === 'cartao'}
                onChange={() => setPagamento('cartao')}
                className="mr-2"
              />
              <label htmlFor="pix" className="mr-4">Pix</label>
              <input
                type="radio"
                id="pix"
                name="pagamento"
                value="pix"
                checked={pagamento === 'pix'}
                onChange={() => setPagamento('pix')}
                className="mr-2"
              />
            </div>
          </div>

          {/* Opção de entrega */}
          <div className="mb-4">
            <label className="block text-gray-700">Modo de Entrega</label>
            <div className="flex items-center">
              <label htmlFor="balcao" className="mr-4">Retirada no Balcão</label>
              <input
                type="radio"
                id="balcao"
                name="modoEntrega"
                value="balcao"
                checked={modoEntrega === 'balcao'}
                onChange={() => handleModoEntregaChange('balcao')}
                className="mr-2"
              />
              <label htmlFor="delivery" className="mr-4">Delivery</label>
              <input
                type="radio"
                id="delivery"
                name="modoEntrega"
                value="delivery"
                checked={modoEntrega === 'delivery'}
                onChange={() => handleModoEntregaChange('delivery')}
                className="mr-2"
              />
            </div>
          </div>

          {/* Exibindo a taxa de entrega, se for delivery */}
          {modoEntrega === 'delivery' && (
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
