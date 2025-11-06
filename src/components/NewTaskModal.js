import React, { useState } from 'react';

// Recibimos 3 props:
// isOpen: (no lo usamos aquí, pero es bueno para futuras animaciones)
// onClose: La función para cerrar el modal (al hacer clic fuera o en Cancelar)
// onSubmit: La función que se llama al enviar el formulario
function NewTaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [earnings, setEarnings] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Llama a la función 'onSubmit' (que está en Column.js)
    // con los nuevos datos de la tarea
    onSubmit({
      title,
      earnings: parseFloat(earnings) || 0,
    });
    // Cierra el modal después de enviar
    onClose();
  };

  // Evita que el modal se muestre si no está abierto
  if (!isOpen) {
    return null;
  }

  return (
    // Fondo oscuro semi-transparente
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose} // Cierra el modal si se hace clic en el fondo
    >
      {/* Contenedor del Modal (evita que el clic se propague al fondo) */}
      <div 
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer clic dentro
      >
        <h2 className="text-2xl font-bold text-white mb-6">Nueva Tarea</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Título de la Tarea
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Diseñar el landing page"
            />
          </div>

          {/* Campo de Ganancias */}
          <div>
            <label htmlFor="earnings" className="block text-sm font-medium text-gray-300 mb-1">
              Ganancias (Opcional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
              <input
                type="number"
                id="earnings"
                value={earnings}
                onChange={(e) => setEarnings(e.target.value)}
                min="0"
                step="0.01"
                className="w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
          
          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;