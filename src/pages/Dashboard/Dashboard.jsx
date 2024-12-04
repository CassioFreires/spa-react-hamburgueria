const Dashboard = () => {
    // Dados de pedidos mockados
    const pedidos = [
      { id: 1, cliente: 'João Silva', data: '2024-12-03', status: 'Solicitado', total: 'R$ 120,00' },
      { id: 2, cliente: 'Maria Oliveira', data: '2024-12-02', status: 'Em andamento', total: 'R$ 250,00' },
      { id: 3, cliente: 'Carlos Pereira', data: '2024-12-01', status: 'Finalizado', total: 'R$ 80,00' },
    ];
  
    const handleStatusChange = (id, novoStatus) => {
      // Lógica para mudar o status (aqui estamos apenas mostrando no console)
      console.log(`Pedido ${id} alterado para: ${novoStatus}`);
    };
  
    return (
      <div className="bg-gray-100 min-h-screen p-6 md:p-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Gerenciamento de Pedidos</h1>
  
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Número do Pedido</th>
                <th className="py-3 px-6 text-left">Cliente</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-left">Total</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-800">{pedido.id}</td>
                  <td className="py-4 px-6 text-gray-800">{pedido.cliente}</td>
                  <td className="py-4 px-6 text-gray-800">{pedido.data}</td>
                  <td className="py-4 px-6 text-gray-800">{pedido.total}</td>
                  <td className="py-4 px-6 text-gray-800">
                    <span
                      className={`px-4 py-2 rounded-full text-white ${pedido.status === 'Solicitado' ? 'bg-yellow-500' : pedido.status === 'Em andamento' ? 'bg-blue-500' : 'bg-green-500'}`}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-x-4">
                      {pedido.status !== 'Finalizado' && (
                        <button
                          onClick={() => handleStatusChange(pedido.id, 'Em andamento')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                          Em andamento
                        </button>
                      )}
                      {pedido.status !== 'Finalizado' && (
                        <button
                          onClick={() => handleStatusChange(pedido.id, 'Finalizado')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                        >
                          Finalizar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

  export default Dashboard;