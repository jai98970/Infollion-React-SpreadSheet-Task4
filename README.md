# Infollion React Spreadsheet - Task 4

A beautiful, modern spreadsheet application built with React that feels just like the real thing. Create formulas, track dependencies, and work with your data in a sleek, intuitive interface.

[🌐 Try it live here](https://infollion-react-spread-sheet.vercel.app/)

## What Makes This Special?

This isn't just another spreadsheet demo—it's a fully functional spreadsheet engine that runs entirely in your browser. Whether you're doing quick calculations or building complex formulas, everything updates in real-time as you type.

### The Basics You'll Love

- **Customizable Grid**: Start small or go big—adjust your grid size from 5×5 all the way up to 100×52 cells. Perfect for both quick calculations and larger data sets.
- **Beyond Z**: Need more than 26 columns? No problem! The grid extends seamlessly to AA, AB, AC, and beyond.
- **Instant Calculations**: Watch your formulas calculate the moment you press Enter. No waiting, no loading—just instant results.
- **Smart Updates**: Change one cell, and all related cells automatically recalculate. The app tracks dependencies so you don't have to.

### Formulas That Make Sense

You can write formulas just like you would in Excel or Google Sheets:

- **Simple math**: Type `=10+5` and get 15
- **Reference cells**: Use `=A1+B1` to add two cells together
- **Group with parentheses**: `=(A1+B2)*2` works exactly as expected
- **Get complex**: Mix it all up like `=(A1*2)+(B3/4)-C5`

### Features That Actually Help

- **Undo/Redo**: Made a mistake? Just hit Ctrl+Z. Want it back? Ctrl+Y. The full history is saved, so you can go back as far as you need.
- **Error Detection**: The app catches problems before they cause issues:
  - **#CIRCULAR** appears when cells reference each other in a loop
  - **#ERROR** shows up if your formula syntax is off
  - **#DIV/0!** warns you about division by zero
  - **#VALUE!** lets you know when data types don't match
- **Performance Built In**: Only the cells that actually need updating get recalculated. This keeps everything fast, even with hundreds of formulas.

### A Design You'll Want to Use

The interface isn't just functional—it's a joy to use:

- **Beautiful gradients** that make working with data feel pleasant
- **Smooth animations** that provide feedback without being distracting
- **Clean toolbar** with everything you need right at your fingertips
- **Responsive layout** that works on any screen size
- **Visual feedback** so you always know what's happening—editing modes, errors, and focus states are all crystal clear

## What's Under the Hood?

This project is built with modern web technologies that ensure fast, reliable performance:

- **React 19**: The latest React with hooks for clean, maintainable code
- **Vite**: Lightning-fast development server and build tool
- **Pure JavaScript**: All the logic is custom-built, no external dependencies for core functionality
- **Modern CSS**: Beautiful styling with gradients, animations, and responsive design

## Getting Started

Want to run this locally? It's super simple:

### Step 1: Clone the Repository

```bash
git clone https://github.com/jai98970/Infollion-React-SpreadSheet-Task4.git
cd Infollion-React-SpreadSheet-Task4
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install everything you need to run the project.

### Step 3: Start the Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173` and you're ready to go!

### Step 4: Build for Production (Optional)

When you're ready to deploy:

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## How to Use It

### Working with Cells

Click on any cell to start editing. Type a number, text, or start a formula with `=`. Press Enter when you're done, or just click somewhere else—your changes are saved automatically.

### Writing Formulas

Formulas start with an equals sign (`=`) and can include:
- Numbers: `=5+3`
- Cell references: `=A1+B2`
- Multiple operations: `=A1*B2+C3/D4`
- Parentheses for grouping: `=(A1+B2)*C3`

### Making Mistakes? No Problem

Use the Undo/Redo buttons in the toolbar, or use keyboard shortcuts:
- **Ctrl+Z** (or Cmd+Z on Mac) to undo
- **Ctrl+Y** (or Ctrl+Shift+Z) to redo

### Changing Grid Size

Need more space? The toolbar lets you adjust rows and columns:
- Rows: 5 to 100
- Columns: 5 to 52
Changes take effect immediately.

### Understanding Errors

If something goes wrong, the app will tell you:
- **Circular references** happen when cells depend on each other (like A1 depends on B1, and B1 depends on A1)
- **Syntax errors** occur when formulas aren't written correctly
- **Division by zero** is caught automatically
- **Value errors** appear when you try to do math with text or incompatible data

## How It Works

The app is designed with clean architecture that separates concerns:

### The Spreadsheet Hook

The `useSpreadsheet` hook is the brain of the operation:
- Keeps track of all your data and changes
- Manages undo/redo history
- Builds a dependency graph to know which cells affect which others
- Only recalculates what needs updating (super efficient!)
- Catches circular references before they cause problems

### The Formula Parser

Custom-built formula parsing using the Shunting-yard algorithm:
- Breaks down your formulas into understandable pieces
- Evaluates expressions using Reverse Polish Notation
- Finds all cell references so dependencies can be tracked
- Handles operator precedence just like a real spreadsheet

### The Components

- **Grid**: The main spreadsheet view with headers, scrollbars, and the toolbar
- **Cell**: Individual cells that handle editing, display, and interaction

### Why It's Fast

The app is optimized for performance:
- **Selective recalculation**: Only updates cells that actually changed
- **Dependency tracking**: Knows exactly what needs updating, nothing more
- **Efficient evaluation**: Formulas are evaluated in the correct order
- **Memory management**: History is limited to the last 50 states to keep things running smoothly

## What's Next?

This is an ongoing project, and here's what might come next:

- [ ] Range functions like `=SUM(A1:A5)` and `=AVG(B1:B10)`
- [ ] Save and load your work (either locally or in the cloud)
- [ ] Copy and paste between cells
- [ ] Cell formatting options (bold, colors, etc.)
- [ ] Multiple sheets or tabs
- [ ] Export your data to CSV or Excel

Have suggestions? Feel free to open an issue or submit a pull request!

## License

MIT License—use it however you'd like!
