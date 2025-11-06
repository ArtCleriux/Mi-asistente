import React, { forwardRef } from 'react';

// Este es un componente "tonto" que solo se encarga de la apariencia.
// Usamos 'forwardRef' para poder pasarle una 'ref' desde el componente 'useSortable'.
const TaskCardContent = forwardRef(({ task, style, ...props }, ref) => {
  
  // Añadimos una clase 'touch-none' para mejorar la compatibilidad en móviles
  const combinedClassName = [
    "bg-gray-700",
    "p-3",
    "rounded-md",
    "shadow-md",
    "mb-3",
    "touch-none", 
    "className" // Evita que el navegador intente hacer scroll en la tarjeta
  ].filter(Boolean).join(' ');

  return (
    // Aplicamos el 'ref' y las demás props (style, attributes, listeners)
    <div
      ref={ref}
      style={style}
      {...props} 
      className={combinedClassName}
    >
      <p>{task.title}</p>
    </div>
  );
});

export default TaskCardContent;