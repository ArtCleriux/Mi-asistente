import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCardContent from './TaskCardContent.js';

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
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1, // Hacemos la tarjeta original semi-transparente
  };
  
  return (
    // 4. Conectamos todo al <div> principal
  <TaskCardContent
      ref={setNodeRef}   
      style={style}      
      task={task}
      {...attributes}  
      {...listeners}   
    />
  );
}

export default TaskCard;