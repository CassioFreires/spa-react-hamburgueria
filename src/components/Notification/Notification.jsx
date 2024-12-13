// Componente para exibir notificações
const Notification = ({ message, type }) => {
  return (
    <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {message}
    </div>
  );
};

export default Notification;