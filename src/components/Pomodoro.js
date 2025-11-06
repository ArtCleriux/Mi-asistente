import React, { useState, useEffect } from 'react';

// Constantes para las duraciones en segundos
const WORK_DURATION = 25 * 60; // 25 minutos
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutos
const LONG_BREAK_DURATION = 15 * 60; // 15 minutos

function Pomodoro() {
  const [mode, setMode] = useState('work'); // 'work', 'short', 'long'
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  // Este useEffect maneja la lógica del temporizador
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      // Si está activo y queda tiempo, iniciamos el intervalo
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Si el tiempo llega a 0
      setIsActive(false);
      // Aquí podrías agregar un sonido
      
      // Cambiar al siguiente modo
      if (mode === 'work') {
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);
        // Si completamos 4 ciclos, toca descanso largo
        if (newCycleCount % 4 === 0) {
          setMode('long');
          setTimeLeft(LONG_BREAK_DURATION);
        } else {
          // Si no, descanso corto
          setMode('short');
          setTimeLeft(SHORT_BREAK_DURATION);
        }
      } else {
        // Si estábamos en un descanso, volvemos a 'work'
        setMode('work');
        setTimeLeft(WORK_DURATION);
      }
    }

    // Función de limpieza: se ejecuta cuando el componente se desmonta o 'isActive'/'timeLeft' cambian
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, cycleCount]);

  // Función para formatear el tiempo de segundos a MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Cambiar de modo manualmente
  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case 'work':
        setTimeLeft(WORK_DURATION);
        break;
      case 'short':
        setTimeLeft(SHORT_BREAK_DURATION);
        break;
      case 'long':
        setTimeLeft(LONG_BREAK_DURATION);
        break;
      default:
        setTimeLeft(WORK_DURATION);
    }
  };

  // Botón principal (Start/Pause)
  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  // Botón de Reset
  const handleReset = () => {
    setIsActive(false);
    // Resetea al tiempo del modo actual
    switchMode(mode);
  };
  
  // Clases dinámicas para los botones de modo
  const getModeButtonClass = (buttonMode) => {
    return `px-4 py-2 rounded-md font-medium transition-colors ${
      mode === buttonMode 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
  };

  return (
    <div className="flex-1 h-screen p-10 overflow-y-auto bg-gray-900 text-white flex flex-col items-center justify-center">
      
      {/* Botones de Modo */}
      <div className="flex space-x-4 mb-8">
        <button onClick={() => switchMode('work')} className={getModeButtonClass('work')}>
          Trabajo
        </button>
        <button onClick={() => switchMode('short')} className={getModeButtonClass('short')}>
          Descanso Corto
        </button>
        <button onClick={() => switchMode('long')} className={getModeButtonClass('long')}>
          Descanso Largo
        </button>
      </div>

      {/* Display del Temporizador */}
      <div className="text-9xl font-bold mb-10">
        {formatTime(timeLeft)}
      </div>

      {/* Botones de Control */}
      <div className="flex space-x-6">
        <button 
          onClick={handleStartPause} 
          className={`px-10 py-4 rounded-lg text-2xl font-semibold transition-colors ${
            isActive 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isActive ? 'Pausar' : 'Iniciar'}
        </button>
        <button 
          onClick={handleReset} 
          className="px-10 py-4 rounded-lg text-2xl font-semibold bg-gray-600 hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Contador de Ciclos */}
      <div className="mt-8 text-xl text-gray-400">
        Ciclos completados: {cycleCount}
      </div>
    </div>
  );
}

export default Pomodoro;