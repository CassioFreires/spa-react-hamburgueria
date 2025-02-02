import React from "react";

const NotificationCartAuth = ({ message, type, onClose }) => {
  const backgroundColor = type === "error" ? "bg-red-500" : "bg-green-500";
  const icon = type === "error" ? "❌" : "✅";

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 max-w-lg w-full rounded-md shadow-lg ${backgroundColor} text-white flex items-center justify-between z-50`}>
      <div className="flex items-center space-x-2">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-xl font-bold bg-transparent border-0 text-white hover:text-gray-200"
      >
        &times;
      </button>
    </div>
  );
};

export default NotificationCartAuth;
