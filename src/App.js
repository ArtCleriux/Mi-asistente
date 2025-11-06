import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.js';
import Board from './components/Board.js';
import Auth from './components/Auth.js';
import Pomodoro from './components/Pomodoro.js';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Componente principal de la aplicación.
 * Gestiona la autenticación del usuario y la vista activa (Kanban o Pomodoro).
 */
function App() {
  // Estado para almacenar la información del usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para controlar el estado de carga inicial de Firebase Auth
  const [isLoading, setIsLoading] = useState(true);
  // Estado para controlar qué módulo está activo: 'kanban' (por defecto) o 'pomodoro'
  const [activeView, setActiveView] = useState('kanban'); 

  /**
   * Hook para escuchar cambios en el estado de autenticación de Firebase.
   * Se ejecuta solo una vez al montar el componente.
   */
  useEffect(() => {
    // onAuthStateChanged establece un oyente en tiempo real.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // La carga inicial ha terminado
    });
    
    // Función de limpieza: desuscribe el oyente al desmontar el componente.
    return () => unsubscribe();
  }, []);

  // Muestra un mensaje de carga mientras se determina el estado de autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Cargando Asistente...
      </div>
    );
  }

  // Si no hay usuario, muestra el componente de autenticación
  if (!user) {
    return <Auth />;
  }

  // Si hay un usuario, muestra el layout principal (Sidebar y contenido)
  return (
    <div className="flex">
      {/* Sidebar: pasa la función para cambiar la vista */}
      <Sidebar setActiveView={setActiveView} />
      
      {/* Área de contenido: renderiza el componente activo */}
      {activeView === 'kanban' ? <Board /> : <Pomodoro />}
    </div>
  );
}

export default App;