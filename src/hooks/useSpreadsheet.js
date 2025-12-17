import { useState, useCallback, useRef, useEffect } from 'react';
import { parseFormula, extractDependencies } from '../utils/formulaParser';

// Configurable grid size (default: 20x20)
const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 20;

// Generate column labels: A-Z, AA-AZ, BA-BZ, etc.
const generateColumnLabels = (numCols) => {
  const labels = [];
  for (let i = 0; i < numCols; i++) {
    let label = '';
    let n = i;
    do {
      label = String.fromCharCode(65 + (n % 26)) + label;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    labels.push(label);
  }
  return labels;
};

const generateGrid = (rows = DEFAULT_ROWS, cols = DEFAULT_COLS) => {
  const cells = {};
  const colLabels = generateColumnLabels(cols);
  
  for (let r = 1; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${colLabels[c]}${r}`;
      cells[id] = { raw: '', value: '', error: null };
    }
  }
  return cells;
};

export const useSpreadsheet = (rows = DEFAULT_ROWS, cols = DEFAULT_COLS) => {
  const [cells, setCells] = useState(() => generateGrid(rows, cols));
  const [history, setHistory] = useState(() => [generateGrid(rows, cols)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoRef = useRef(false);
  const prevDimensionsRef = useRef({ rows, cols });

  // Initialize with default grid if dimensions change
  useEffect(() => {
    const prev = prevDimensionsRef.current;
    if (prev.rows !== rows || prev.cols !== cols) {
      prevDimensionsRef.current = { rows, cols };
      const newGrid = generateGrid(rows, cols);
      setCells(newGrid);
      setHistory([newGrid]);
      setHistoryIndex(0);
    }
  }, [rows, cols]);

  const getCellValue = (id, currentCells) => {
    const cell = currentCells[id];
    if (!cell) return 0;
    if (cell.error) throw new Error(cell.error);
    return cell.value === '' ? 0 : cell.value;
  };

  // Build reverse dependency graph (which cells depend on this cell)
  const buildReverseDependencyGraph = (graph) => {
    const reverseGraph = {};
    Object.keys(graph).forEach(node => {
      reverseGraph[node] = [];
    });
    
    Object.keys(graph).forEach(node => {
      graph[node].forEach(dep => {
        if (reverseGraph[dep]) {
          reverseGraph[dep].push(node);
        }
      });
    });
    
    return reverseGraph;
  };

  // Find all cells that depend on a given cell (transitively)
  const findAffectedCells = (changedCellId, reverseGraph) => {
    const affected = new Set([changedCellId]);
    const queue = [changedCellId];
    
    while (queue.length > 0) {
      const cellId = queue.shift();
      const dependents = reverseGraph[cellId] || [];
      
      dependents.forEach(dep => {
        if (!affected.has(dep)) {
          affected.add(dep);
          queue.push(dep);
        }
      });
    }
    
    return affected;
  };

  // Optimized recalculation: only recalculate affected cells
  const recalculateCells = (newCells, changedCellId) => {
    const graph = buildDependencyGraph(newCells);
    const cycles = detectCycles(graph);
    
    // Check for circular dependency
    if (cycles.has(changedCellId)) {
      newCells[changedCellId].error = "#CIRCULAR";
      newCells[changedCellId].value = "#CIRCULAR";
      return newCells;
    }

    // Build reverse graph to find dependents
    const reverseGraph = buildReverseDependencyGraph(graph);
    
    // Find all cells that need recalculation (the changed cell and all its dependents)
    const affectedSet = findAffectedCells(changedCellId, reverseGraph);
    
    // Also need to recalculate the changed cell itself if it has a formula
    // and any cells that were affected by dependencies that changed
    
    // For cells that might have dependencies on the changed cell,
    // we need to evaluate them in topological order
    // But only evaluate affected cells
    const affectedIds = Array.from(affectedSet);
    
    // Sort affected cells topologically
    const sortedAffectedIds = topologicalSortSubgraph(graph, affectedIds);
    
    // Recalculate only affected cells in topological order
    for (const cellId of sortedAffectedIds) {
      if (!newCells[cellId]) continue; // Skip if cell doesn't exist
      
      const cell = newCells[cellId];
      
      if (cycles.has(cellId)) {
        cell.error = "#CIRCULAR";
        cell.value = "#CIRCULAR";
        continue;
      }
      
      if (cell.raw.startsWith('=')) {
        try {
          const val = parseFormula(cell.raw, (refId) => {
            const refCell = newCells[refId];
            if (!refCell) return 0;
            if (refCell.error) throw new Error(refCell.error);
            const v = refCell.value;
            return v === '' ? 0 : v;
          });
          cell.value = val;
          cell.error = null;
        } catch (err) {
          cell.error = err.message;
          cell.value = err.message;
        }
      } else {
        // Direct value
        const num = parseFloat(cell.raw);
        cell.value = isNaN(num) ? cell.raw : num;
        cell.error = null;
      }
    }
    
    return newCells;
  };

  const updateCell = useCallback((id, rawInput) => {
    if (isUndoRedoRef.current) return;
    
    setCells(prevCells => {
      const newCells = { ...prevCells };
      
      // Update the target cell's raw value
      if (!newCells[id]) {
        newCells[id] = { raw: '', value: '', error: null };
      }
      newCells[id] = { ...newCells[id], raw: rawInput, error: null };
      
      // Optimized: Only recalculate affected cells
      const updatedCells = recalculateCells(newCells, id);
      
      // Add to history (remove any future history if we're not at the end)
      setHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push({ ...updatedCells });
        // Limit history to 50 states to prevent memory issues
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
      
      return updatedCells;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCells({ ...history[newIndex] });
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCells({ ...history[newIndex] });
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);
    }
  }, [historyIndex, history]);

  return {
    cells,
    updateCell,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
};

// --- Helpers ---

const buildDependencyGraph = (cells) => {
  const graph = {};
  Object.keys(cells).forEach(id => {
    graph[id] = extractDependencies(cells[id].raw);
  });
  return graph;
};

const detectCycles = (graph) => {
  const visited = new Set();
  const recursionStack = new Set();
  const cycles = new Set();

  const visit = (node) => {
    if (recursionStack.has(node)) {
      cycles.add(node);
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    recursionStack.add(node);

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (visit(neighbor)) {
        cycles.add(node);
      }
    }

    recursionStack.delete(node);
    return cycles.has(node);
  };

  Object.keys(graph).forEach(node => {
    if (!visited.has(node)) {
      visit(node);
    }
  });

  return cycles;
};

// Topological sort for a subset of nodes
const topologicalSortSubgraph = (graph, nodeIds) => {
  const visited = new Set();
  const stack = [];
  const nodeSet = new Set(nodeIds);
  
  const visit = (node) => {
    if (visited.has(node) || !nodeSet.has(node)) return;
    visited.add(node);
    
    const neighbors = graph[node] || [];
    neighbors.forEach(visit);
    
    stack.push(node);
  };
  
  nodeIds.forEach(visit);
  
  return stack;
};

// Export helper for generating column labels
export const getColumnLabels = generateColumnLabels;
