import React from 'react';

// Este es un componente de React. Es solo una función que devuelve HTML (JSX).
function Sidebar() {
  return (
    // Estas son clases de Tailwind:
    // h-screen = altura de pantalla completa
    // w-64 = ancho de 64 unidades (16rem)
    // bg-gray-800 = un fondo gris un poco más claro que el body
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Mi Asistente</h1>
      </div>
        <nav className="p-3">
          {/* Cambiamos <a> por <button>.
            Añadimos 'w-full' (ancho completo) y 'text-left' (texto a la izquierda)
            para que se comporten y se vean exactamente como los '<a>' de antes.
          */}
          <button className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700">
            Tareas (Kanban)
          </button>
          <button className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700">
            Pomodoro
          </button>
          <button className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700">
            Finanzas
          </button>
        </nav>
    </div>
  );
}

export default Sidebar;