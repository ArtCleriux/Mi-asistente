// Importaciones de React y dnd-kit
import React, { useState, useEffect } from 'react';
import Column from './Column';
import { DndContext, closestCorners, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import TaskCard from './TaskCard'; 
// Importaciones de Firebase
import { auth, db } from '../firebase.js';
import { 
  collection, 
  onSnapshot, // Para escuchar cambios en tiempo real
  doc, 
  updateDoc, // Para actualizar el estado de la tarea
  query,       // Para construir consultas
  where        // Para filtrar por usuario
} from "firebase/firestore";

// Configuración de la animación del clon de la tarjeta al arrastrar y soltar
const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5', // El clon se vuelve semi-transparente al soltar
      },
    },
  }),
};


/**
 * Componente principal del Tablero Kanban.
 * Maneja el estado de las tareas, la conexión con Firebase y la lógica de Drag and Drop.
 */
function Board() {
  // Estado para almacenar las tareas agrupadas por columna (status)
  const [board, setBoard] = useState({
    "Por Hacer": [],
    "En Progreso": [],
    "Hecho": []
  });
  // Estado para la tarea que se está arrastrando (necesario para el DragOverlay)
  const [activeTask, setActiveTask] = useState(null);

  /**
   * Hook para obtener y escuchar las tareas de Firestore en tiempo real.
   * Filtra las tareas por el ID del usuario actual.
   */
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return; 

    const tasksCollectionRef = collection(db, 'tasks');
    // Consulta para obtener SOLO las tareas del usuario actual
    const q = query(tasksCollectionRef, where("userId", "==", userId));

    // Establece el oyente en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Reconstruye el tablero con los datos más recientes
      const newBoard = { "Por Hacer": [], "En Progreso": [], "Hecho": [] };
      
      snapshot.forEach((doc) => {
        const task = { ...doc.data(), id: doc.id };
        // Asigna la tarea a su columna según el estado (status)
        if (newBoard[task.status]) {
          newBoard[task.status].push(task);
        }
      });
      
      // Actualiza el estado de React
      setBoard(newBoard);
    });

    // Limpia el oyente de Firebase al desmontar
    return () => unsubscribe(); 

  }, []);

  /**
   * Maneja el inicio del arrastre.
   * Busca la tarea que se está arrastrando y la almacena para el DragOverlay.
   */
  const handleDragStart = (event) => {
    const { active } = event;
    const task = Object.values(board).flat().find(t => t.id === active.id);
    setActiveTask(task);
  };


  /**
   * Maneja el final del arrastre.
   * Determina la columna de destino y actualiza el estado en Firestore.
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Determina el título de la columna de origen
    const originColumnTitle = Object.keys(board).find(key => 
      board[key].some(task => task.id === activeId)
    );

    // Determina el título de la columna de destino
    const destinationColumnTitle = board[overId] 
      ? overId // Se soltó directamente sobre un contenedor de columna (Droppable)
      : Object.keys(board).find(key => // Se soltó sobre otra tarjeta (Sortable)
          board[key].some(task => task.id === overId)
        );

    // Si no hay cambio o no se encuentra destino, no hace nada
    if (!originColumnTitle || !destinationColumnTitle || originColumnTitle === destinationColumnTitle) {
      setActiveTask(null);
      return;
    }
    
    // Si la columna cambió, actualiza Firebase
    try {
      const taskDocRef = doc(db, 'tasks', activeId);
      await updateDoc(taskDocRef, {
        status: destinationColumnTitle // Solo actualiza el campo 'status'
      });
    } catch (error) {
      console.error("Error al mover la tarea:", error);
    }
    
    setActiveTask(null);
  };

  return (
    <DndContext 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex-1 h-screen p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Mi Tablero Kanban</h2>
        
        <div className="grid grid-cols-3 gap-6">
          
          {/* Componentes de Columna */}
          <Column 
            title="Por Hacer" 
            tasks={board["Por Hacer"]} 
          />
          <Column title="En Progreso" tasks={board["En Progreso"]} />
          <Column title="Hecho" tasks={board["Hecho"]} />

        </div>
      </div>

      {/* DragOverlay: Renderiza el clon de la tarjeta que sigue al mouse */}
      <DragOverlay dropAnimation={dropAnimationConfig}> 
        {activeTask ? (
          <TaskCard task={activeTask} />
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}

export default Board;