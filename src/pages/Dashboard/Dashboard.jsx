import React, { useEffect, useState } from 'react';
import Notification from '../../components/Notification/Notification';
import StatusUpdatePopup from '../../components/StatusUpdatePopup/StatusUpdatePopup';
import {
  getAllOrdersService,
  updateOrderStatusService,
  // cancelOrderService
} from '../../services/service-order';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrdersService(token);
        setOrders(res.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatusService(selectedOrder.order_id, newStatus, token);
      setNotification({ type: 'success', message: '✅ Status atualizado com sucesso!' });

      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === selectedOrder.order_id
            ? { ...order, status_do_pedido: newStatus }
            : order
        )
      );
      setSelectedOrder(null);
    } catch (err) {
      setNotification({ type: 'error', message: err.message || '❌ Erro ao atualizar status.' });
    }
  };

  // const handleCancelOrder = async (orderId) => {
  //   if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) return;

  //   try {
  //     await cancelOrderService(orderId, token);
  //     setNotification({ type: 'success', message: '🚫 Pedido cancelado com sucesso.' });

  //     setOrders((prev) =>
  //       prev.map((order) =>
  //         order.order_id === orderId ? { ...order, status_do_pedido: 'CANCELADO' } : order
  //       )
  //     );
  //   } catch (err) {
  //     setNotification({ type: 'error', message: err.message || '❌ Erro ao cancelar pedido.' });
  //   }
  // };

  return (
    <div className="bg-gray-50 min-h-screen p-8 md:p-12">
      <h1 className="text-2xl font-bold mb-6">Painel de Pedidos</h1>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {error && (
        <div className="text-red-500 font-semibold mb-4">
          ⚠️ Erro: {error}
        </div>
      )}

      {loading && <p>🔄 Carregando pedidos...</p>}

      {!loading && !error && orders.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">📋 Lista de Pedidos:</h2>
          <ul className="space-y-6">
            {orders.map((order) => (
              <li key={order.order_id} className="p-6 bg-white shadow rounded-md space-y-2">
                <p><strong>📄 ID Pedido:</strong> {order.order_id}</p>
                <p><strong>👤 Cliente:</strong> {order.nome} {order.sobrenome}</p>
                <p><strong>📧 Email:</strong> {order.user?.email}</p>
                <p><strong>📞 Telefone:</strong> {order.user?.telefone}</p>
                {order.endereco && (
                  <p>
                    <strong>🏠 Endereço:</strong> {order.endereco.rua}, {order.endereco.numero} - {order.endereco.bairro}, {order.endereco.cidade} - {order.endereco.estado}, {order.endereco.cep}
                  </p>
                )}
                <p><strong>💰 Total:</strong> R$ {order.total_value}</p>
                <p><strong>📌 Status:</strong> {order.status_do_pedido}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ✏️ Alterar Status
                  </button>

                  <button
                    onClick={() => handleCancelOrder(order.order_id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    ❌ Cancelar Pedido
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-600">📭 Nenhum pedido encontrado.</p>
      )}

      {selectedOrder && (
        <StatusUpdatePopup
          currentStatus={selectedOrder.status_do_pedido}
          onSelect={handleStatusChange}
          onCancel={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
