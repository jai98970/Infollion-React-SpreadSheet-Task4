import React from 'react';
import Grid from './components/Grid';
import './index.css';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div className="header-icon">📊</div>
          <h1>Spreadsheet Engine</h1>
          <p>Edit cells and use formulas like <code>=A1+B2</code></p>
          <div className="header-badge">
            <span>✨ Modern UI</span>
            <span>⚡ Fast Performance</span>
            <span>🎯 Intuitive</span>
          </div>
        </div>
      </header>
      <Grid />
    </div>
  );
}

export default App;
