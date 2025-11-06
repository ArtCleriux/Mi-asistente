import React, { useState } from 'react';
import TaskCard from './TaskCard'; // Importamos la tarjeta
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { auth, db } from '../firebase.js';
import { collection, addDoc } from "firebase/firestore";
import NewTaskModal from './NewTaskModal.js';

function Column({ title, tasks }) { 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setNodeRef } = useDroppable({
    id: title,
  });

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleCreateTask = async ({ title: taskTitle, earnings }) => {
    if (taskTitle && auth.currentUser) {
      const newTask = {
        title: taskTitle,
        earnings: earnings,
        status: "Por Hacer",
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      };

      try {
        const tasksCollectionRef = collection(db, 'tasks');
        await addDoc(tasksCollectionRef, newTask);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al añadir tarea:", error);
      }
    }
  };

  return (
    // 4. Conectamos el 'ref' para que sea una zona de soltar
    <div ref={setNodeRef} className="bg-gray-800 p-4 rounded-lg">
      
        <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {/* El botón solo aparece en "Por Hacer" */}
        {title === "Por Hacer" && (
          <button
            onClick={handleAddTask}
            className="text-gray-400 hover:text-white text-lg font-bold w-6 h-6 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600"
          >
            +
          </button>
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

      {isModalOpen && (
        <NewTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}

export default Column;