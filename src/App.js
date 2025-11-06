import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.js';
import Board from './components/Board.js';
import Auth from './components/Auth.js';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
// 1. Importamos el nuevo componente
import Pomodoro from './components/Pomodoro.js';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // 2. Añadimos estado para controlar la vista activa
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' o 'pomodoro'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Cargando Asistente...
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex">
      {/* 3. Pasamos la función para cambiar la vista al Sidebar */}
      <Sidebar setActiveView={setActiveView} />
      
      {/* 4. Renderizamos el componente basado en el estado activeView */}
      {activeView === 'kanban' ? <Board /> : <Pomodoro />}
    </div>
  );
}

export default App;