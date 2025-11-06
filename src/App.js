// No necesitamos App.css por ahora
// import './App.css'; 

// 1. Importa las dos piezas que acabamos de crear
import Sidebar from './components/Sidebar';
import Board from './components/Board';

function App() {
  return (
    // Usamos "flex" para poner los componentes uno al lado del otro
    <div className="flex">
      {/* 2. Renderiza la barra lateral (fija) */}
      <Sidebar />

      {/* 3. Renderiza el área de contenido (flexible) */}
      <Board />
    </div>
  );
}

export default App;