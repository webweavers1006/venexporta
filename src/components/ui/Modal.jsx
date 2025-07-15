import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 text-primary">Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
