// BottomMenu.js
import React from 'react';
import './BottomMenu.css'; // Asegúrate de crear este archivo de estilos

const BottomMenu = ({ view, setView }) => {
  return (
    <div className="bottom-menu">
      <button className={view === 'matches' ? 'active' : ''} onClick={() => setView('matches')}>
        Partidos
      </button>
      <button className={view === 'predictions' ? 'active' : ''} onClick={() => setView('predictions')}>
        Predicciones
      </button>
    </div>
  );
};

export default BottomMenu;
