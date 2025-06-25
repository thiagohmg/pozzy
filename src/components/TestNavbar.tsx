import React from 'react';

export const TestNavbar = () => (
  <nav style={{ width: '100%', height: 60, background: '#eee', border: '2px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
    <div style={{ background: 'green', width: 200, height: 40, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
      ESQUERDA
    </div>
    <div style={{ background: 'red', width: 200, height: 40, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
      DIREITA
    </div>
  </nav>
); 