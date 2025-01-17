// Componente de Notificação
const NotificationLogin = ({ message, type }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? '✓' : '✖';

    return (
        <div className={`p-4 mb-4 text-white ${bgColor} rounded-lg flex items-center`}>
            <span className="text-2xl mr-3">{icon}</span>
            <p>{message}</p>
        </div>
    );
};

export default NotificationLogin