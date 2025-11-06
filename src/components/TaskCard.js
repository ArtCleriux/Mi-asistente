import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 1. Recibimos el objeto 'task' completo
function TaskCard({ task }) {

  // 2. Usamos el hook 'useSortable'
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // <-- ¡AÑADIMOS ESTO!
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task: task 
    }
  });

  // 3. Estilos para la animación de "arrastre"
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // <-- ¡ARREGLO AQUÍ! (Se oculta si se arrastra)
  };
  
  return (
    // 4. Conectamos todo al <div> principal
    <div
      ref={setNodeRef}   // Registra el nodo
      style={style}      // Aplica los estilos de "arrastre"
      {...attributes}  // Aplica los atributos
      {...listeners}   // Aplica los "oyentes" (para poder agarrarlo)
      className="bg-gray-700 p-3 rounded-md shadow-md mb-3"
    >
      <p>{task.title}</p>
    </div>
  );
}

export default TaskCard;