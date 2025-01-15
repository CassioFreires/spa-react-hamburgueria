const generateNotaFiscal = (
  nome, 
  sobrenome, 
  endereco, 
  bairro, 
  cep, 
  pagamento, 
  modoEntrega, 
  taxaEntrega, 
  orderLocalHistorage,  // Carrinho de hambúrgueres
  orderPromotionBurger,
  orderComboBurger,
  orderDrinks  // Carrinho de promoções
) => {
  // Combinação de ambos os carrinhos
  const todosItens = [...orderLocalHistorage, ...orderPromotionBurger, ...orderComboBurger, ...orderDrinks];

  // Criação do resumo dos itens
  const itensPedido = todosItens.map(item => {
    return `- Nome do item: ${item.name}\n- Valor: R$${parseFloat(item.price).toFixed(2)}`; // Garantir que price seja um número
  }).join('\n');  // Junta os itens com uma quebra de linha

  // Cálculo do valor total do pedido
  const valorTotalPedido = todosItens.reduce((total, item) => total + parseFloat(item.price), 0); // Garantir que price seja um número
  const valorTotalComTaxa = valorTotalPedido + parseFloat(taxaEntrega); // Garantir que taxaEntrega seja um número

  // Formatação dos valores para exibição com 2 casas decimais
  const formattedTotalPedido = valorTotalPedido.toFixed(2);
  const formattedTotalComTaxa = valorTotalComTaxa.toFixed(2);

  const mensagem = `
  ========== NOTA FISCAL ==========

  *INFORMAÇÕES DE CONTATO*
  Nome: ${nome} ${sobrenome}
  Telefone: (Insira o telefone do cliente)

  ----------------------------------

  *ENDEREÇO DE ENTREGA*
  Endereço: ${endereco}
  Bairro: ${bairro}
  CEP: ${cep}

  ----------------------------------

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
