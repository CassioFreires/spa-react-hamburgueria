// Componente para a janela de confirmação
const ConfirmationPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Confirmar Cancelamento</h3>
        <p>Tem certeza que deseja cancelar este pedido?</p>
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Confirmar Cancelamento</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;