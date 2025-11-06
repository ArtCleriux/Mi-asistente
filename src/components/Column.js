import React from 'react';
import TaskCard from './TaskCard'; // Importamos la tarjeta
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

function Column({ title, tasks, setBoard }) { // 1. Recibimos 'tasks' y 'setBoard'

  // 2. Registramos la columna como "zona de soltar"
  const { setNodeRef } = useDroppable({
    id: title, // El ID de esta zona es su título (ej. "Por Hacer")
  });

  // 3. (La función para añadir tareas que ya teníamos)
  const handleAddTask = () => {
    const newTitle = window.prompt("Introduce el título de la nueva tarea:");
    if (newTitle) {
      const newTask = { id: Date.now(), title: newTitle };
      setBoard(currentBoard => {
        const newBoard = { ...currentBoard };
        newBoard["Por Hacer"] = [newTask, ...newBoard["Por Hacer"]];
        return newBoard;
      });
    }
  };

  return (
    // 4. Conectamos el 'ref' para que sea una zona de soltar
    <div ref={setNodeRef} className="bg-gray-800 p-4 rounded-lg">
      
      {/* Cabecera (con el botón que ya tenías) */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {title === "Por Hacer" && (
          <button onClick={handleAddTask} className="text-gray-400 hover:text-white text-lg">+</button>
        )}
      </div>

      {/* 5. Envolvemos las tareas en el SortableContext */}
      <SortableContext 
        items={tasks.map(t => t.id)} // Le damos la lista de IDs
        strategy={verticalListSortingStrategy}
      >
        {/* Aquí va el div que contiene las tarjetas, dentro del SortableContext */}
        <div className="min-h-[100px]">
          {tasks.map(task => (
            // 6. Pasamos el objeto 'task' COMPLETO
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default Column;