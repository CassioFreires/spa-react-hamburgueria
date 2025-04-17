const generateNotaFiscal = (
  nome, 
  sobrenome, 
  endereco = '', 
  bairro = '', 
  cep = '', 
  complemento = '', 
  referencia = '', 
  pagamento, 
  modoEntrega, 
  taxaEntrega, 
  orderLocalHistorage,  
  orderPromotionBurger,
  orderComboBurger,
  orderDrinks  
) => {
  const todosItens = [...orderLocalHistorage, ...orderPromotionBurger, ...orderComboBurger, ...orderDrinks];

  const itensPedido = todosItens.map(item => (
    `- Nome do item: ${item.name}\n- Valor: R$${parseFloat(item.price).toFixed(2)}`
  )).join('\n');

  const valorTotalPedido = todosItens.reduce((total, item) => total + parseFloat(item.price), 0);
  const valorTotalComTaxa = valorTotalPedido + parseFloat(taxaEntrega);

  const formattedTotalPedido = valorTotalPedido.toFixed(2);
  const formattedTotalComTaxa = valorTotalComTaxa.toFixed(2);

  const enderecoEntrega = modoEntrega === 'delivery' ? `
  *ENDEREÇO DE ENTREGA*
  Endereço: ${endereco}
  Bairro: ${bairro}
  CEP: ${cep}
  Complemento: ${complemento || 'N/A'}
  Referência: ${referencia || 'N/A'}
  ----------------------------------` : '';

  const mensagem = `
  ========== NOTA FISCAL ==========

  *INFORMAÇÕES DE CONTATO*
  Nome: ${nome} ${sobrenome}
  Telefone: (Insira o telefone do cliente)

  ${enderecoEntrega}

  *PEDIDO*
  Forma de Pagamento: ${pagamento === 'cartao' ? 'Cartão' : 'Pix'}
  Modo de Entrega: ${modoEntrega === 'balcao' ? 'Retirada no Balcão' : 'Delivery'}
  Taxa de Entrega: R$${parseFloat(taxaEntrega).toFixed(2)}

  ----------------------------------

  *RESUMO DO PEDIDO*
  ${itensPedido}
  Valor Total do Pedido: R$${formattedTotalPedido}
  Valor Total (com Taxa de Entrega): R$${formattedTotalComTaxa}

  ----------------------------------

  *OBSERVAÇÕES*
  (Insira aqui observações adicionais, como algum detalhe importante do pedido)

  ===================================
  Aguardamos seu retorno para confirmar o pagamento e o envio.
  Obrigado pela preferência!

  Para qualquer dúvida, entre em contato conosco pelo WhatsApp.
  `;

  return mensagem;
};

export default generateNotaFiscal;
