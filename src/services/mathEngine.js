import * as math from 'mathjs';

/**
 * Math Engine providing symbolic math, step-by-step equation solving,
 * 2D & 3D function sampling, calculus operations, and matrix algebra.
 */

// Format mathjs output cleanly to LaTeX or string
export function formatLatex(expr) {
  try {
    const parsed = typeof expr === 'string' ? math.parse(expr) : expr;
    return parsed.toTex({ parenthesis: 'keep' });
  } catch (err) {
    return expr;
  }
}

/**
 * Evaluates a 2D function y = f(x) over a range of x values
 * Discontinuity & Asymptote Aware: Inserts null at vertical asymptotes to prevent stray vertical lines.
 */
export function sampleFunction2D(exprString, xMin = -10, xMax = 10, points = 500, scopeVars = {}) {
  try {
    const compiled = math.compile(exprString);
    const xValues = [];
    const yValues = [];
    const step = (xMax - xMin) / (points - 1);

    let prevY = null;

    for (let i = 0; i < points; i++) {
      const x = xMin + i * step;
      try {
        const y = compiled.evaluate({ x, ...scopeVars });

        if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
          // Asymptote threshold check (e.g. for tan(x) or 1/x)
          if (Math.abs(y) > 30) {
            xValues.push(x);
            yValues.push(null);
            prevY = null;
          } else if (prevY !== null && Math.abs(y - prevY) > 25 && (y * prevY < 0)) {
            // Discontinuity jump across vertical asymptote (sign flip + huge jump)
            xValues.push(x);
            yValues.push(null);
            prevY = null;
          } else {
            xValues.push(x);
            yValues.push(y);
            prevY = y;
          }
        } else {
          xValues.push(x);
          yValues.push(null);
          prevY = null;
        }
      } catch (e) {
        xValues.push(x);
        yValues.push(null);
        prevY = null;
      }
    }
    return { x: xValues, y: yValues, error: null };
  } catch (error) {
    return { x: [], y: [], error: error.message };
  }
}

/**
 * Tangent Line Generator at x = x0
 */
export function computeTangentLine(exprString, x0 = 1, scopeVars = {}) {
  try {
    const compiled = math.compile(exprString);
    const derivNode = math.derivative(exprString, 'x');
    const derivCompiled = math.compile(derivNode.toString());

    const y0 = compiled.evaluate({ x: x0, ...scopeVars });
    const slope = derivCompiled.evaluate({ x: x0, ...scopeVars });

    if (typeof y0 !== 'number' || typeof slope !== 'number' || isNaN(y0) || isNaN(slope) || Math.abs(slope) > 1e4) {
      return { error: 'Undefined derivative or function value at x0' };
    }

    const tangentExpr = `${slope} * (x - ${x0}) + ${y0}`;
    const derivTex = derivNode.toTex();

    return {
      x0: Number(x0.toFixed(3)),
      y0: Number(y0.toFixed(3)),
      slope: Number(slope.toFixed(3)),
      tangentExpr,
      derivTex,
      error: null
    };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Riemann Sums Approximation (Left, Right, Midpoint, Trapezoidal)
 */
export function computeRiemannSum(exprString, a = 0, b = 4, N = 10, method = 'left') {
  try {
    const compiled = math.compile(exprString);
    const dx = (b - a) / N;
    let sumArea = 0;
    const bars = [];

    for (let i = 0; i < N; i++) {
      const xLeft = a + i * dx;
      const xRight = xLeft + dx;
      let xEval = xLeft;

      if (method === 'right') xEval = xRight;
      else if (method === 'midpoint') xEval = xLeft + dx / 2;

      let height = 0;
      try {
        height = compiled.evaluate({ x: xEval });
        if (typeof height !== 'number' || isNaN(height) || Math.abs(height) > 1e3) height = 0;
      } catch (e) {
        height = 0;
      }

      if (method === 'trapezoid') {
        const hLeft = compiled.evaluate({ x: xLeft }) || 0;
        const hRight = compiled.evaluate({ x: xRight }) || 0;
        const trapArea = ((hLeft + hRight) / 2) * dx;
        sumArea += trapArea;

        bars.push({
          x: [xLeft, xRight, xRight, xLeft],
          y: [0, 0, hRight, hLeft],
          xMid: (xLeft + xRight) / 2,
          area: trapArea
        });
      } else {
        const rectArea = height * dx;
        sumArea += rectArea;

        bars.push({
          xLeft,
          xRight,
          height,
          area: rectArea
        });
      }
    }

    return {
      areaSum: Number(sumArea.toFixed(4)),
      dx: Number(dx.toFixed(4)),
      bars,
      error: null
    };
  } catch (err) {
    return { areaSum: null, dx: null, bars: [], error: err.message };
  }
}

/**
 * Taylor Series Polynomial Expansion Generator
 */
export function computeTaylorSeries(exprString, center = 0, order = 4) {
  try {
    let currentExpr = exprString;
    const terms = [];
    let scope = { x: center };
    let factorial = 1;

    for (let k = 0; k <= order; k++) {
      if (k > 0) factorial *= k;

      let val = 0;
      try {
        const compiled = math.compile(currentExpr);
        val = compiled.evaluate(scope);
      } catch (e) {
        val = 0;
      }

      if (typeof val === 'number' && !isNaN(val) && Math.abs(val) > 1e-7) {
        const coeff = val / factorial;
        terms.push({ k, val, coeff: Number(coeff.toFixed(4)) });
      }

      try {
        currentExpr = math.derivative(currentExpr, 'x').toString();
      } catch (e) {
        break;
      }
    }

    const polyParts = terms.map(t => {
      if (t.k === 0) return `${t.coeff}`;
      const powerTerm = center === 0 ? `x^${t.k}` : `(x - ${center})^${t.k}`;
      return `${t.coeff >= 0 ? '+ ' : ''}${t.coeff} * ${powerTerm}`;
    });

    const taylorExprStr = polyParts.join(' ') || '0';

    return {
      taylorExprStr,
      terms,
      error: null
    };
  } catch (err) {
    return { taylorExprStr: exprString, terms: [], error: err.message };
  }
}

/**
 * Slope Field Generator for First-Order Differential Equations dy/dx = f(x, y)
 */
export function sampleSlopeField(odeExpr = 'x - y', gridRes = 16, range = 4) {
  try {
    const compiled = math.compile(odeExpr);
    const xCoords = [];
    const yCoords = [];
    const uComp = [];
    const vComp = [];
    const step = (range * 2) / (gridRes - 1);

    for (let i = 0; i < gridRes; i++) {
      const x = -range + i * step;
      for (let j = 0; j < gridRes; j++) {
        const y = -range + j * step;
        try {
          const dy_dx = compiled.evaluate({ x, y });
          if (typeof dy_dx === 'number' && !isNaN(dy_dx)) {
            xCoords.push(x);
            yCoords.push(y);
            const angle = Math.atan(dy_dx);
            const len = step * 0.4;
            uComp.push(Math.cos(angle) * len);
            vComp.push(Math.sin(angle) * len);
          }
        } catch (e) {}
      }
    }

    return { x: xCoords, y: yCoords, u: uComp, v: vComp, error: null };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Evaluates a 3D surface z = f(x, y) over a 2D grid
 */
export function sampleSurface3D(exprString, xMin = -5, xMax = 5, yMin = -5, yMax = 5, gridRes = 50, scopeVars = {}) {
  try {
    const compiled = math.compile(exprString);
    const xRow = [];
    const yCol = [];
    const zMatrix = [];

    const xStep = (xMax - xMin) / (gridRes - 1);
    const yStep = (yMax - yMin) / (gridRes - 1);

    for (let i = 0; i < gridRes; i++) xRow.push(xMin + i * xStep);
    for (let j = 0; j < gridRes; j++) yCol.push(yMin + j * yStep);

    for (let j = 0; j < gridRes; j++) {
      const y = yCol[j];
      const zRow = [];
      for (let i = 0; i < gridRes; i++) {
        const x = xRow[i];
        try {
          const z = compiled.evaluate({ x, y, ...scopeVars });
          if (typeof z === 'number' && !isNaN(z) && isFinite(z)) {
            zRow.push(Math.abs(z) > 1e3 ? null : z);
          } else {
            zRow.push(null);
          }
        } catch (e) {
          zRow.push(null);
        }
      }
      zMatrix.push(zRow);
    }

    return { x: xRow, y: yCol, z: zMatrix, error: null };
  } catch (error) {
    return { x: [], y: [], z: [], error: error.message };
  }
}

/**
 * Generates 3D parametric surfaces (e.g. Torus, Sphere, Mobius Strip)
 */
export function sampleParametric3D(type = 'torus', R = 3, r = 1, uRes = 40, vRes = 40) {
  const xMatrix = [];
  const yMatrix = [];
  const zMatrix = [];

  for (let i = 0; i <= uRes; i++) {
    const u = (i / uRes) * 2 * Math.PI;
    const xRow = [];
    const yRow = [];
    const zRow = [];

    for (let j = 0; j <= vRes; j++) {
      const v = (j / vRes) * 2 * Math.PI;
      let x, y, z;

      if (type === 'torus') {
        x = (R + r * Math.cos(v)) * Math.cos(u);
        y = (R + r * Math.cos(v)) * Math.sin(u);
        z = r * Math.sin(v);
      } else if (type === 'sphere') {
        const phi = (i / uRes) * Math.PI;
        const theta = (j / vRes) * 2 * Math.PI;
        x = R * Math.sin(phi) * Math.cos(theta);
        y = R * Math.sin(phi) * Math.sin(theta);
        z = R * Math.cos(phi);
      } else if (type === 'mobius') {
        const vMod = (j / vRes - 0.5) * 2;
        x = (1 + (vMod / 2) * Math.cos(u / 2)) * Math.cos(u);
        y = (1 + (vMod / 2) * Math.cos(u / 2)) * Math.sin(u);
        z = (vMod / 2) * Math.sin(u / 2);
      } else {
        x = (i / uRes - 0.5) * 10;
        y = (j / vRes - 0.5) * 10;
        const dist = Math.sqrt(x * x + y * y);
        z = Math.sin(dist);
      }

      xRow.push(x);
      yRow.push(y);
      zRow.push(z);
    }
    xMatrix.push(xRow);
    yMatrix.push(yRow);
    zMatrix.push(zRow);
  }

  return { x: xMatrix, y: yMatrix, z: zMatrix };
}

/**
 * Calculates 2D Vector Fields (P(x,y), Q(x,y)) for flow visualization
 */
export function sampleVectorField(pExpr = '-y', qExpr = 'x', gridRes = 15, range = 5) {
  try {
    const pCompiled = math.compile(pExpr);
    const qCompiled = math.compile(qExpr);

    const xCoords = [];
    const yCoords = [];
    const uComponent = [];
    const vComponent = [];
    const step = (range * 2) / (gridRes - 1);

    for (let i = 0; i < gridRes; i++) {
      const x = -range + i * step;
      for (let j = 0; j < gridRes; j++) {
        const y = -range + j * step;
        try {
          const u = pCompiled.evaluate({ x, y });
          const v = qCompiled.evaluate({ x, y });
          if (typeof u === 'number' && typeof v === 'number' && !isNaN(u) && !isNaN(v)) {
            xCoords.push(x);
            yCoords.push(y);
            const len = Math.sqrt(u * u + v * v) || 1;
            const normFactor = Math.min(step * 0.8, 0.4) / len;
            uComponent.push(u * normFactor);
            vComponent.push(v * normFactor);
          }
        } catch (e) {}
      }
    }
    return { x: xCoords, y: yCoords, u: uComponent, v: vComponent, error: null };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Symbolic Derivative Calculator
 */
export function computeDerivative(exprString, variable = 'x') {
  try {
    const derivative = math.derivative(exprString, variable);
    const simplified = math.simplify(derivative);
    return {
      original: exprString,
      derivativeStr: simplified.toString(),
      derivativeTex: simplified.toTex(),
      error: null
    };
  } catch (error) {
    return { error: `Derivative computation error: ${error.message}` };
  }
}

/**
 * Numerical Integration (Definite Integral via Simpson's Rule)
 */
export function computeDefiniteIntegral(exprString, a = 0, b = 1, n = 200) {
  try {
    const compiled = math.compile(exprString);
    if (n % 2 !== 0) n += 1;
    const h = (b - a) / n;
    
    let sum = compiled.evaluate({ x: a }) + compiled.evaluate({ x: b });
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const val = compiled.evaluate({ x });
      sum += (i % 2 === 0 ? 2 : 4) * val;
    }
    const result = (h / 3) * sum;
    return { result: Math.round(result * 100000) / 100000, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
}

/**
 * Find Roots, Critical Points, Extrema for 2D function
 * Asymptote Filtered: Does NOT misidentify vertical asymptotes as roots!
 */
export function analyzeFunctionFeatures(exprString, xMin = -10, xMax = 10) {
  try {
    const compiled = math.compile(exprString);
    let derivCompiled = null;
    try {
      derivCompiled = math.compile(math.derivative(exprString, 'x').toString());
    } catch (e) {}

    const roots = [];
    const extrema = [];
    const samples = 800;
    const step = (xMax - xMin) / samples;

    let prevX = xMin;
    let prevY = compiled.evaluate({ x: prevX });

    for (let i = 1; i <= samples; i++) {
      const currX = xMin + i * step;
      let currY;
      try {
        currY = compiled.evaluate({ x: currX });
      } catch (e) {
        continue;
      }

      if (typeof prevY === 'number' && typeof currY === 'number' && !isNaN(prevY) && !isNaN(currY)) {
        // Check for Zero Crossing (Root candidate)
        if ((prevY < 0 && currY > 0) || (prevY > 0 && currY < 0)) {
          // Asymptote Filter: If values near crossing are huge, it's a vertical asymptote, NOT a root!
          if (Math.abs(prevY) < 15 && Math.abs(currY) < 15) {
            // Bisection method to pinpoint exact root
            let rMin = prevX;
            let rMax = currX;
            for (let iter = 0; iter < 14; iter++) {
              const mid = (rMin + rMax) / 2;
              const midY = compiled.evaluate({ x: mid });
              if ((prevY < 0 && midY < 0) || (prevY > 0 && midY > 0)) {
                rMin = mid;
              } else {
                rMax = mid;
              }
            }
            const exactRoot = (rMin + rMax) / 2;
            const evalAtRoot = Math.abs(compiled.evaluate({ x: exactRoot }));
            if (evalAtRoot < 0.1) {
              roots.push({ x: Number(exactRoot.toFixed(4)), y: 0 });
            }
          }
        }

        // Extrema check
        if (derivCompiled) {
          const dPrev = derivCompiled.evaluate({ x: prevX });
          const dCurr = derivCompiled.evaluate({ x: currX });
          if ((dPrev < 0 && dCurr > 0) || (dPrev > 0 && dCurr < 0)) {
            if (Math.abs(prevY) < 50 && Math.abs(currY) < 50) {
              const type = dPrev < 0 ? 'Minimum' : 'Maximum';
              const extX = (prevX + currX) / 2;
              const extY = compiled.evaluate({ x: extX });
              if (typeof extY === 'number' && !isNaN(extY) && Math.abs(extY) < 100) {
                extrema.push({ type, x: Number(extX.toFixed(4)), y: Number(extY.toFixed(4)) });
              }
            }
          }
        }
      }
      prevX = currX;
      prevY = currY;
    }

    return { roots, extrema, error: null };
  } catch (error) {
    return { roots: [], extrema: [], error: error.message };
  }
}

/**
 * Robust Step-by-Step Symbolic & Polynomial Equation Solver
 */
export function solveEquationStepByStep(inputQuery) {
  const steps = [];
  const cleanInput = inputQuery.trim();

  // 1. Check Derivative Query
  if (cleanInput.startsWith('d/dx') || cleanInput.toLowerCase().includes('derivative')) {
    const exprStr = cleanInput.replace(/d\/dx|derivative of|derivative/gi, '').trim();
    const res = computeDerivative(exprStr || 'x^2');
    if (!res.error) {
      steps.push({
        title: 'Step 1: Identify Function for Differentiation',
        latex: `f(x) = ${formatLatex(exprStr)}`,
        explanation: 'Target function to differentiate with respect to x.'
      });
      steps.push({
        title: 'Step 2: Apply Differentiation Rules',
        latex: `\\frac{d}{dx}\\left(${formatLatex(exprStr)}\\right)`,
        explanation: 'Apply calculus rules (power rule, product rule, chain rule).'
      });
      steps.push({
        title: 'Step 3: Simplified Derivative Output',
        latex: res.derivativeTex,
        explanation: 'Group like terms and factor multipliers.'
      });
      return { steps, solutionLatex: res.derivativeTex, solutionType: 'Derivative' };
    }
  }

  // 2. Handle Equations containing '=' (e.g. LHS = RHS)
  if (cleanInput.includes('=')) {
    const parts = cleanInput.split('=');
    const lhsRaw = parts[0].trim();
    const rhsRaw = parts[1].trim();

    steps.push({
      title: 'Step 1: Input Equation',
      latex: `${formatLatex(lhsRaw)} = ${formatLatex(rhsRaw)}`,
      explanation: 'Identified equation with left-hand and right-hand sides.'
    });

    let targetExprStr = `${lhsRaw} - (${rhsRaw})`;
    let simplifiedLHS = null;

    try {
      simplifiedLHS = math.simplify(targetExprStr);
    } catch (e) {
      targetExprStr = lhsRaw;
      try { simplifiedLHS = math.simplify(lhsRaw); } catch (err) {}
    }

    const lhsTex = simplifiedLHS ? simplifiedLHS.toTex() : formatLatex(targetExprStr);

    steps.push({
      title: 'Step 2: Transform to Standard Zero Form',
      latex: `${lhsTex} = 0`,
      explanation: 'Subtracted right-hand side to establish zero-form equation: f(x) = 0.'
    });

    // Extract Quadratic Coefficients: a*x^2 + b*x + c = 0
    try {
      const compiled = math.compile(simplifiedLHS ? simplifiedLHS.toString() : targetExprStr);
      
      const f0 = compiled.evaluate({ x: 0 });
      const f1 = compiled.evaluate({ x: 1 });
      const f_neg1 = compiled.evaluate({ x: -1 });

      if (typeof f0 === 'number' && typeof f1 === 'number' && typeof f_neg1 === 'number' &&
          !isNaN(f0) && !isNaN(f1) && !isNaN(f_neg1)) {
        
        const c = f0;
        const a = (f1 + f_neg1 - 2 * f0) / 2;
        const b = (f1 - f_neg1) / 2;

        if (Math.abs(a) > 1e-6) {
          const aRounded = Math.round(a * 1000) / 1000;
          const bRounded = Math.round(b * 1000) / 1000;
          const cRounded = Math.round(c * 1000) / 1000;

          steps.push({
            title: 'Step 3: Identify Quadratic Coefficients',
            latex: `a = ${aRounded}, \\quad b = ${bRounded}, \\quad c = ${cRounded}`,
            explanation: 'Extracted standard polynomial terms: a x^2 + b x + c = 0.'
          });

          const delta = bRounded * bRounded - 4 * aRounded * cRounded;
          const deltaRounded = Math.round(delta * 1000) / 1000;

          steps.push({
            title: 'Step 4: Compute Discriminant (\\Delta)',
            latex: `\\Delta = b^2 - 4ac = (${bRounded})^2 - 4(${aRounded})(${cRounded}) = ${deltaRounded}`,
            explanation: deltaRounded > 0 
              ? 'Discriminant is positive (\\Delta > 0), giving two distinct real roots.'
              : deltaRounded === 0 
              ? 'Discriminant is zero (\\Delta = 0), giving one repeated real root.'
              : 'Discriminant is negative (\\Delta < 0), giving complex conjugate roots.'
          });

          if (deltaRounded >= 0) {
            const x1 = (-bRounded + Math.sqrt(deltaRounded)) / (2 * aRounded);
            const x2 = (-bRounded - Math.sqrt(deltaRounded)) / (2 * aRounded);
            const x1R = Math.round(x1 * 1000) / 1000;
            const x2R = Math.round(x2 * 1000) / 1000;

            const solTex = x1R === x2R ? `x = ${x1R}` : `x_1 = ${x1R}, \\quad x_2 = ${x2R}`;

            steps.push({
              title: 'Step 5: Apply Quadratic Formula',
              latex: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} \\implies ${solTex}`,
              explanation: 'Substituted coefficients into the quadratic formula to calculate roots.'
            });

            return { steps, solutionLatex: solTex, solutionType: 'Quadratic Equation' };
          } else {
            const realPart = (-bRounded / (2 * aRounded)).toFixed(3);
            const imagPart = (Math.sqrt(-deltaRounded) / (2 * aRounded)).toFixed(3);
            const solTex = `x = ${realPart} \\pm ${imagPart}i`;

            steps.push({
              title: 'Step 5: Complex Conjugate Solutions',
              latex: `x = \\frac{-b \\pm i\\sqrt{|\\Delta|}}{2a} \\implies ${solTex}`,
              explanation: 'Calculated complex conjugate roots using imaginary unit i.'
            });

            return { steps, solutionLatex: solTex, solutionType: 'Quadratic (Complex Roots)' };
          }
        }

        if (Math.abs(a) <= 1e-6 && Math.abs(b) > 1e-6) {
          const bRounded = Math.round(b * 1000) / 1000;
          const cRounded = Math.round(c * 1000) / 1000;
          const rootX = -cRounded / bRounded;
          const rootXRounded = Math.round(rootX * 1000) / 1000;

          steps.push({
            title: 'Step 3: Isolate Variable x',
            latex: `${bRounded}x = ${-cRounded} \\implies x = \\frac{${-cRounded}}{${bRounded}} = ${rootXRounded}`,
            explanation: 'Linear equation solved by isolating variable x.'
          });

          return { steps, solutionLatex: `x = ${rootXRounded}`, solutionType: 'Linear Equation' };
        }
      }
    } catch (e) {}

    return {
      steps,
      solutionLatex: `${lhsTex} = 0`,
      solutionType: 'Symbolic Equation'
    };
  }

  // 3. Expressions without '=' (Simplification)
  steps.push({
    title: 'Step 1: Input Expression',
    latex: formatLatex(cleanInput),
    explanation: 'Target algebraic expression for symbolic simplification.'
  });

  try {
    const simplified = math.simplify(cleanInput);
    steps.push({
      title: 'Step 2: Symbolic Simplification',
      latex: simplified.toTex(),
      explanation: 'Combined like terms and applied algebraic identity reductions.'
    });

    return {
      steps,
      solutionLatex: simplified.toTex(),
      solutionType: 'Simplification'
    };
  } catch (err) {
    return {
      steps: [{ title: 'Error', latex: formatLatex(cleanInput), explanation: err.message }],
      solutionLatex: null,
      error: err.message
    };
  }
}

/**
 * Matrix Laboratory operations (Determinant, Inverse, Eigenvalues)
 */
export function processMatrixOperation(matrixArray, operation = 'determinant') {
  try {
    const m = math.matrix(matrixArray);
    let result = null;
    let explanation = '';

    if (operation === 'determinant') {
      result = math.det(m);
      explanation = `Determinant \\det(A) = ${result}`;
    } else if (operation === 'inverse') {
      const inv = math.inv(m);
      result = inv.toArray();
      explanation = `Inverse matrix A^{-1} calculated using cofactor adjugate expansion.`;
    } else if (operation === 'transpose') {
      result = math.transpose(m).toArray();
      explanation = `Transposed matrix (rows flipped to columns).`;
    } else if (operation === 'eigs') {
      const res = math.eigs(m);
      result = res.values.toArray ? res.values.toArray() : res.values;
      explanation = `Eigenvalues of the linear transformation.`;
    }

    return { result, explanation, error: null };
  } catch (error) {
    return { result: null, explanation: '', error: error.message };
  }
}
