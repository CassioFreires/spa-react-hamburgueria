import React, { useState, useEffect } from 'react';
import Notification from '../../components/Notification/Notification';
import ConfirmationPopup from '../../components/ConfirmationPopup/ConfirmationPopup';

const Dashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pedidoCancelado, setPedidoCancelado] = useState(null);
  const [notification, setNotification] = useState(null);
  const date = new Date();
  const hours = date.getHours();
  const min = date.getMinutes();
  const seg = date.getSeconds();

  // Carregar os dados do localStorage
  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(pedidosSalvos);
  }, []);

  // Salvar os pedidos no localStorage
  useEffect(() => {
    if (pedidos.length > 0) {
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }
  }, [pedidos]);

  // Alterar o status do pedido
  const handleStatusChange = (id, novoStatus) => {
    const updatedPedidos = pedidos.map((pedido) =>
      pedido.id === id ? { ...pedido, status: novoStatus } : pedido
    );
    setPedidos(updatedPedidos);
    showNotification(`Pedido ${id} alterado para: ${novoStatus}`, 'success');
  };

  // Cancelar o pedido
  const handleCancelPedido = (id) => {
    setPedidoCancelado(id);
    setIsPopupOpen(true);
  };

  // Confirmar o cancelamento
  const confirmCancelamento = () => {
    const updatedPedidos = pedidos.filter((pedido) => pedido.id !== pedidoCancelado);
    setPedidos(updatedPedidos);
    localStorage.setItem('pedidos', JSON.stringify(updatedPedidos)); // Atualizando o localStorage
    setIsPopupOpen(false);
    showNotification(`Pedido ${pedidoCancelado} cancelado com sucesso!`, 'error');
  };

  // Fechar o pop-up de confirmação
  const cancelCancelamento = () => {
    setIsPopupOpen(false);
  };

  // Mostrar notificações
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Calcular o total do pedido (itens + taxa de entrega)
  const calcularTotal = (pedido) => {
    // Combinando todos os itens de diferentes categorias (hamburgueres, promocao, combo, bebidas)
    const totalItens = [
      ...pedido.itens.hamburgueres,
      ...pedido.itens.promocao,
      ...pedido.itens.combo,
      ...pedido.itens.bebidas
    ].reduce((total, item) => total + parseFloat(item.price), 0); // Garantir que item.price seja tratado como número
    
    return (totalItens + parseFloat(pedido.taxaEntrega)).toFixed(2); // Garantir que taxaEntrega seja tratada como número
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 md:p-12">
      {notification && <Notification message={notification.message} type={notification.type} />}

      <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Gerenciamento de Pedidos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white shadow-xl rounded-lg border border-gray-300 p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold text-gray-700">{`Pedido #${pedido.id}`}</h3>
                <span
                  className={`px-4 py-2 rounded-full text-white ${pedido.status === 'Solicitado'
                    ? 'bg-yellow-500'
                    : pedido.status === 'Em andamento'
                    ? 'bg-blue-500'
                    : 'bg-green-500'}`}
                >
                  {pedido.status}
                </span>
              </div>

              <div className="text-gray-700">
                <p><strong>Cliente:</strong> {pedido.nome} {pedido.sobrenome}</p>
                <p><strong>Data:</strong> {date.toLocaleDateString()} - {`${hours}h:${min}m:${seg}s`}</p>
                <p><strong>Modo de Entrega:</strong> {pedido.modoEntrega}</p>
                <p><strong>Pagamento:</strong> {pedido.pagamento}</p>
                <p><strong>Total:</strong> R${calcularTotal(pedido)}</p> {/* Total ajustado */}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="w-full">
                  <h4 className="font-semibold text-gray-700">Itens:</h4>
                  {/* Combinando todos os itens de diferentes categorias */}
                  {[...pedido.itens.hamburgueres, ...pedido.itens.promocao, ...pedido.itens.combo, ...pedido.itens.bebidas]
                    .map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover inline-block mr-2"
                        />
                        <span>{item.name} - R${parseFloat(item.price).toFixed(2)}</span> {/* Ajuste do preço de cada item */}
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                {pedido.status !== 'Finalizado' && (
                  <button
                    onClick={() => handleStatusChange(pedido.id, 'Em andamento')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    title="Marcar como Em andamento"
                  >
                    Em andamento
                  </button>
                )}
                {pedido.status !== 'Finalizado' && (
                  <button
                    onClick={() => handleStatusChange(pedido.id, 'Finalizado')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                    title="Finalizar Pedido"
                  >
                    Finalizar
                  </button>
                )}
                <button
                  onClick={() => handleCancelPedido(pedido.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                  title="Cancelar Pedido"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && <ConfirmationPopup onConfirm={confirmCancelamento} onCancel={cancelCancelamento} />}
    </div>
  );
};

export default Dashboard;
