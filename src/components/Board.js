// 1. Importamos 'useState' desde React
import React, { useState, useEffect } from 'react';
import Column from './Column';
// 2. ¡Importamos DragOverlay y los nuevos hooks!
import { DndContext, closestCorners, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import TaskCard from './TaskCard'; 
import { auth, db } from '../firebase.js';
import { 
  collection, 
  onSnapshot, // Para escuchar en tiempo real
  doc, 
  updateDoc, // Para actualizar documentos
  query,       // Para consultar
  where        // Para filtrar por usuario
} from "firebase/firestore";

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5', // El clon se vuelve semi-transparente al soltar
      },
    },
  }),
};


function Board() {
  const [board, setBoard] = useState({
    "Por Hacer": [],
    "En Progreso": [],
    "Hecho": []
  });
  const [activeTask, setActiveTask] = useState(null);
 useEffect(() => {
    // Obtenemos el ID del usuario actual
    const userId = auth.currentUser?.uid;
    if (!userId) return; // Si no hay usuario, no hacemos nada

    // Creamos una referencia a la colección de "tareas"
    const tasksCollectionRef = collection(db, 'tasks');
    
    // Creamos una consulta para obtener SOLO las tareas de este usuario
    const q = query(tasksCollectionRef, where("userId", "==", userId));

    // onSnapshot es el "oyente" en tiempo real.
    // Se ejecuta una vez al inicio y luego cada vez que los datos cambian.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Reiniciamos el tablero
      const newBoard = { "Por Hacer": [], "En Progreso": [], "Hecho": [] };
      
      // Recorremos las tareas de la base de datos
      snapshot.forEach((doc) => {
        const task = { ...doc.data(), id: doc.id }; // Añadimos el ID del doc a la tarea
        // Clasificamos la tarea en su columna
        if (newBoard[task.status]) {
          newBoard[task.status].push(task);
        }
      });
      
      // Actualizamos el estado de React con los datos de Firebase
      setBoard(newBoard);
    });

    // Devolvemos la función 'unsubscribe' para limpiar el oyente
    return () => unsubscribe(); 

  }, []);

  const handleDragStart = (event) => {
    const { active } = event;
    // Buscamos la tarea en nuestro 'board' y la guardamos
    const task = Object.values(board).flat().find(t => t.id === active.id);
    setActiveTask(task);
  };


  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;


    const originColumnTitle = Object.keys(board).find(key => 
      board[key].some(task => task.id === activeId)
    );


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
 try {
      // Creamos una referencia al documento que queremos mover
      const taskDocRef = doc(db, 'tasks', activeId);
      // Actualizamos solo el campo 'status'
      await updateDoc(taskDocRef, {
        status: destinationColumnTitle
      });
    } catch (error) {
      console.error("Error al mover la tarea:", error);
    }
    
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
            setBoard={userId => setBoard(userId)}
          />
          <Column title="En Progreso" tasks={board["En Progreso"]} />
          <Column title="Hecho" tasks={board["Hecho"]} />

        </div>
      </div>

      {/* 8. ¡EL OVERLAY MÁGICO! */}
      {/* Esto renderiza el "clon" de la tarjeta que sigue al mouse */}
      <DragOverlay dropAnimation={dropAnimationConfig}> 
        {activeTask ? (
          <TaskCard task={activeTask} />
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}

export default Board;