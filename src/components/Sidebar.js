import React from 'react';
import { auth } from '../firebase.js';
import { signOut } from "firebase/auth";

// 1. Recibimos 'setActiveView' como prop
function Sidebar({ setActiveView }) {

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Mi Asistente</h1>
      </div>
        
      <nav className="p-3 flex-1">
          {/* 2. Añadimos el onClick para cambiar la vista a 'kanban' */}
          <button 
            onClick={() => setActiveView('kanban')}
            className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
          >
            Tareas (Kanban)
          </button>
          {/* 3. Añadimos el onClick para cambiar la vista a 'pomodoro' */}
          <button 
            onClick={() => setActiveView('pomodoro')}
            className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
          >
            Pomodoro
          </button>
        </nav>

      <div className="p-3 mt-auto">
        <button 
          onClick={handleLogout}
          className="block w-full text-left py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;