# Infollion-spreadsheet

A modern, high-performance spreadsheet application built with React. This engine features real-time formula evaluation, intelligent dependency management, undo/redo functionality, and a beautiful, responsive UI.

[🌐 Live Demo](https://infollion-spreadsheet.vercel.app/)

## 🚀 Features

### Core Functionality
- **Dynamic Grid Size**: Configurable grid from 5x5 to 100x52 (default: 20x20)
- **Extended Column Support**: Supports columns beyond Z (AA, AB, AC, etc.)
- **Real-time Formula Evaluation**: Instant calculation as you type
- **Dependency Management**: Automatically tracks and updates dependent cells

### Formula Support
- **Basic Arithmetic**: `+`, `-`, `*`, `/`
- **Parentheses Grouping**: `(A1 + B2) * 2`
- **Cell References**: `A1`, `Z9`, `AA10`, etc.
- **Complex Expressions**: `=(A1*2) + (B3/4)`

### Advanced Features
- **Undo/Redo**: Full history stack with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Optimized Recalculation**: Only affected cells are recalculated for maximum performance
- **Error Handling**:
  - **#CIRCULAR**: Detects and prevents infinite loops
  - **#ERROR**: Handles malformed formulas
  - **#DIV/0!**: Handles division by zero
  - **#VALUE!**: Handles invalid value types

### User Interface
- **Modern Design**: Beautiful gradient background with clean, professional spreadsheet layout
- **Interactive Toolbar**: Easy access to undo/redo and grid size controls
- **Smooth Animations**: Polished transitions and hover effects
- **Responsive Layout**: Scrollable grid with sticky headers for easy navigation
- **Visual Feedback**: Clear focus states, error indicators, and edit highlights

## 🛠️ Tech Stack

- **React 19**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool and dev server
- **JavaScript (ES6+)**: Core logic and algorithms
- **CSS3**: Modern styling with gradients and animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aaaryavvvivvvek/Infollion-spreadsheet.git
   cd Infollion-spreadsheet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173`.

4. **Build for production**
   ```bash
   npm run build
   ```

## 💡 Usage Guide

### Editing Cells
- **Click** any cell to enter Edit Mode
- Type a value (number or text) or a formula starting with `=`
- Press **Enter** or click away to save changes

### Writing Formulas
- **Simple Math**: `=10+5`
- **Cell References**: `=A1+B1`
- **Complex Expressions**: `=(A1*2) + (B3/4)`
- **Multi-cell References**: `=A1+B2+C3`

### Undo/Redo
- **Toolbar Buttons**: Click the Undo/Redo buttons in the toolbar
- **Keyboard Shortcuts**:
  - `Ctrl+Z` (or `Cmd+Z` on Mac) - Undo
  - `Ctrl+Y` or `Ctrl+Shift+Z` (or `Cmd+Shift+Z` on Mac) - Redo

### Adjusting Grid Size
- Use the **Rows** and **Cols** input fields in the toolbar
- Grid size ranges from 5-100 rows and 5-52 columns
- Changes are applied immediately

### Error Handling
- **Circular Dependencies**: If you create a circular reference (e.g., A1 depends on B1, and B1 depends on A1), both cells will show `#CIRCULAR`
- **Invalid Formulas**: Malformed syntax will display `#ERROR`
- **Division by Zero**: Attempts to divide by zero will show `#DIV/0!`

## 🏗️ Architecture

The application uses a clean separation of concerns:

### State Management
- **`useSpreadsheet` Hook**: 
  - Manages grid state and history
  - Handles undo/redo functionality
  - Builds dependency graphs
  - Optimizes recalculation by tracking affected cells only
  - Detects circular dependencies

### Formula Processing
- **`formulaParser` Utility**: 
  - Custom parser using the Shunting-yard algorithm
  - Tokenizes mathematical expressions
  - Evaluates formulas with RPN (Reverse Polish Notation)
  - Extracts cell dependencies for graph building

### Components
- **`Grid`**: Renders the spreadsheet layout with headers and toolbar
- **`Cell`**: Handles individual cell interaction, editing, and display logic

### Performance Optimizations
- **Selective Recalculation**: Only cells affected by a change are recalculated
- **Dependency Graph**: Reverse dependency tracking for efficient updates
- **Topological Sorting**: Ensures correct evaluation order
- **History Limiting**: Limits undo history to 50 states to manage memory

## 🔮 Future Improvements

- [ ] Range functions (e.g., `=SUM(A1:A5)`, `=AVG(B1:B10)`)
- [ ] Save/Load functionality (Local Storage or Backend)
- [ ] Copy/Paste functionality
- [ ] Cell formatting (bold, italic, colors)
- [ ] Multiple sheets/tabs
- [ ] Export to CSV/Excel

## 📄 License

MIT

# Infollion-React-SpreadSheet-Task4
