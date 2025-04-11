// 📁 src/components/StatusUpdatePopup/StatusUpdatePopup.jsx

const StatusUpdatePopup = ({ currentStatus, onSelect, onCancel }) => {
    const statusOptions = ['SOLICITADO', 'PENDENTE', 'ANDAMENTO', 'FINALIZADO'];
  
    return (
      <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">📌 Alterar Status do Pedido</h3>
          <p className="mb-2">Status atual: <strong>{currentStatus}</strong></p>
  
          <div className="flex flex-col gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => onSelect(status)}
                disabled={status === currentStatus}
                className={`px-4 py-2 rounded-md font-medium ${
                  status === currentStatus
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
  
          <div className="mt-4 text-right">
            <button onClick={onCancel} className="text-sm text-gray-500 hover:underline">Cancelar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default StatusUpdatePopup;
  