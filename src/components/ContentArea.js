import React from 'react';

function ContentArea() {
  return (
    // flex-1 = "ocupa todo el espacio restante"
    // p-10 = un "padding" (relleno) grande
    <div className="flex-1 p-10">
      <h2 className="text-3xl font-bold">Módulo Principal</h2>
      <p className="mt-4">
        Aquí es donde irá nuestro tablero Kanban.
      </p>
    </div>
  );
}

export default ContentArea;