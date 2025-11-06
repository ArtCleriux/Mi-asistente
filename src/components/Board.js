// 1. Importamos 'useState' desde React
import React, { useState } from 'react';
import Column from './Column';
// 2. ¡Importamos DragOverlay y los nuevos hooks!
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import TaskCard from './TaskCard'; 

// --- DATOS INICIALES (El "Cerebro") ---
const initialBoard = {
  "Por Hacer": [
    { id: 101, title: 'Hacer el layout del Sidebar' },
    { id: 102, title: 'Conectar la base de datos (Firebase)' },
  ],
  "En Progreso": [
    { id: 201, title: 'Construir el Kanban (Fase 2)' },
  ],
  "Hecho": [
    { id: 301, title: 'Instalar Tailwind (Fase 1)' },
    { id: 302, title: 'Limpiar proyecto de React (Fase 1)' },
  ]
};
// ----------------------------------------

// Tuvimos que importar TaskCard aquí para usarlo en el Overlay


function Board() {
  const [board, setBoard] = useState(initialBoard);
  // 3. ¡Nuevo estado para la "tarea activa" (la que se está arrastrando)!
  const [activeTask, setActiveTask] = useState(null);

  // 4. Nueva función: Se ejecuta CUANDO EMPIEZAS a arrastrar
  const handleDragStart = (event) => {
    const { active } = event;
    // Buscamos la tarea en nuestro 'board' y la guardamos
    const task = Object.values(board).flat().find(t => t.id === active.id);
    setActiveTask(task);
  };

  // 5. Función actualizada: Se ejecuta CUANDO SUELTAS
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null); // Limpia la tarea activa si se suelta fuera
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // --- LÓGICA DE COLUMNA DE ORIGEN (Sin cambios) ---
    const originColumnTitle = Object.keys(board).find(key => 
      board[key].some(task => task.id === activeId)
    );

    // --- LÓGICA DE COLUMNA DE DESTINO (¡EL ARREGLO!) ---
    // Arreglo para columnas vacías:
    // Verificamos si 'overId' es el ID de una columna (ej. "Por Hacer")
    // O si es el ID de otra tarea (para encontrar *su* columna)
    const destinationColumnTitle = board[overId] 
      ? overId // 1. Soltamos sobre una columna vacía (el ID es el título)
      : Object.keys(board).find(key => // 2. Soltamos sobre una tarea
          board[key].some(task => task.id === overId)
        );

    // Si no encontramos un destino, o si es el mismo lugar, no hacemos nada
    if (!originColumnTitle || !destinationColumnTitle || originColumnTitle === destinationColumnTitle) {
      setActiveTask(null); // Limpia la tarea activa
      return;
    }

    // --- LÓGICA DE MOVER (Sin cambios) ---
    setBoard(currentBoard => {
      const originTasks = [...currentBoard[originColumnTitle]];
      const destinationTasks = [...currentBoard[destinationColumnTitle]];
      
      const taskIndex = originTasks.findIndex(task => task.id === activeId);
      const [movedTask] = originTasks.splice(taskIndex, 1);
      
      destinationTasks.push(movedTask);

      return {
        ...currentBoard,
        [originColumnTitle]: originTasks,
        [destinationColumnTitle]: destinationTasks,
      };
    });
    
    // 6. Limpiamos la tarea activa al final
    setActiveTask(null);
  };

  return (
    // 7. Actualizamos el DndContext con los nuevos "handlers"
    <DndContext 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)} // Limpia si se cancela
    >
      <div className="flex-1 h-screen p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Mi Tablero Kanban</h2>
        
        <div className="grid grid-cols-3 gap-6">
          
          <Column 
            title="Por Hacer" 
            tasks={board["Por Hacer"]} 
            setBoard={setBoard}
          />
          <Column title="En Progreso" tasks={board["En Progreso"]} />
          <Column title="Hecho" tasks={board["Hecho"]} />

        </div>
      </div>

      {/* 8. ¡EL OVERLAY MÁGICO! */}
      {/* Esto renderiza el "clon" de la tarjeta que sigue al mouse */}
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} />
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}

export default Board;