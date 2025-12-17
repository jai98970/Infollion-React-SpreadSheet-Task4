
/**
 * Parses and evaluates a spreadsheet formula.
 * 
 * Supported operations: +, -, *, /, ()
 * Supported references: Cell IDs (e.g., A1, Z99)
 */

export const parseFormula = (formula, getCellValue) => {
  if (!formula.startsWith('=')) {
    return isNaN(Number(formula)) ? formula : Number(formula);
  }

  const expression = formula.substring(1).toUpperCase();
  
  try {
    const tokens = tokenize(expression);
    const rpn = shuntingYard(tokens);
    return evaluateRPN(rpn, getCellValue);
  } catch (error) {
    throw new Error("#ERROR");
  }
};

const tokenize = (expr) => {
  const tokens = [];
  let i = 0;
  
  while (i < expr.length) {
    const char = expr[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/[+\-*/()]/.test(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }

    // Numbers
    if (/\d/.test(char) || char === '.') {
      let num = '';
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }

    // Cell References (e.g., A1)
    if (/[A-Z]/.test(char)) {
      let ref = '';
      while (i < expr.length && /[A-Z0-9]/.test(expr[i])) {
        ref += expr[i];
        i++;
      }
      tokens.push({ type: 'reference', value: ref });
      continue;
    }

    throw new Error("Invalid character");
  }
  return tokens;
};

const shuntingYard = (tokens) => {
  const output = [];
  const operators = [];
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };

  tokens.forEach(token => {
    if (token.type === 'number' || token.type === 'reference') {
      output.push(token);
    } else if (token.type === 'operator') {
      if (token.value === '(') {
        operators.push(token);
      } else if (token.value === ')') {
        while (operators.length > 0 && operators[operators.length - 1].value !== '(') {
          output.push(operators.pop());
        }
        operators.pop(); // Pop '('
      } else {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].value !== '(' &&
          precedence[operators[operators.length - 1].value] >= precedence[token.value]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      }
    }
  });

  while (operators.length > 0) {
    output.push(operators.pop());
  }

  return output;
};

const evaluateRPN = (rpn, getCellValue) => {
  const stack = [];

  rpn.forEach(token => {
    if (token.type === 'number') {
      stack.push(token.value);
    } else if (token.type === 'reference') {
      const val = getCellValue(token.value);
      if (typeof val !== 'number') {
         // Try to convert string to number if possible, else throw
         const num = parseFloat(val);
         if (isNaN(num)) throw new Error("#VALUE!");
         stack.push(num);
      } else {
        stack.push(val);
      }
    } else if (token.type === 'operator') {
      const b = stack.pop();
      const a = stack.pop();
      
      if (a === undefined || b === undefined) throw new Error("#ERROR");

      switch (token.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': 
          if (b === 0) throw new Error("#DIV/0!");
          stack.push(a / b); 
          break;
      }
    }
  });

  if (stack.length !== 1) throw new Error("#ERROR");
  return stack[0];
};

// Helper to extract dependencies from a formula string
export const extractDependencies = (formula) => {
  if (!formula.startsWith('=')) return [];
  const tokens = tokenize(formula.substring(1).toUpperCase());
  return tokens
    .filter(t => t.type === 'reference')
    .map(t => t.value);
};
