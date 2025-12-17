import React, { useState } from 'react';
import Cell from './Cell';
import { useSpreadsheet, getColumnLabels } from '../hooks/useSpreadsheet';

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 20;

const Grid = () => {
  const [numRows, setNumRows] = useState(DEFAULT_ROWS);
  const [numCols, setNumCols] = useState(DEFAULT_COLS);
  
  const { cells, updateCell, undo, redo, canUndo, canRedo } = useSpreadsheet(numRows, numCols);
  
  const COLS = getColumnLabels(numCols);
  const ROWS = Array.from({ length: numRows }, (_, i) => i + 1);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="spreadsheet-wrapper">
      <div className="spreadsheet-controls">
        <div className="toolbar">
          <button 
            className="toolbar-button" 
            onClick={undo} 
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <span className="button-icon">↶</span>
            <span>Undo</span>
          </button>
          <button 
            className="toolbar-button" 
            onClick={redo} 
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <span className="button-icon">↷</span>
            <span>Redo</span>
          </button>
          <div className="toolbar-separator"></div>
          <label className="toolbar-label">
            Rows:
            <input
              type="number"
              min="5"
              max="100"
              value={numRows}
              onChange={(e) => setNumRows(Math.max(5, Math.min(100, parseInt(e.target.value) || DEFAULT_ROWS)))}
              className="toolbar-input"
            />
          </label>
          <label className="toolbar-label">
            Cols:
            <input
              type="number"
              min="5"
              max="52"
              value={numCols}
              onChange={(e) => setNumCols(Math.max(5, Math.min(52, parseInt(e.target.value) || DEFAULT_COLS)))}
              className="toolbar-input"
            />
          </label>
        </div>
      </div>
      <div className="spreadsheet-container">
        <div className="grid-header">
          <div className="header-cell corner"></div>
          {COLS.map(col => (
            <div key={col} className="header-cell">{col}</div>
          ))}
        </div>
        <div className="grid-body">
          {ROWS.map(row => (
            <div key={row} className="grid-row">
              <div className="header-cell row-header">{row}</div>
              {COLS.map(col => {
                const id = `${col}${row}`;
                return (
                  <Cell 
                    key={id} 
                    id={id} 
                    data={cells[id] || { raw: '', value: '', error: null }} 
                    onChange={updateCell} 
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
