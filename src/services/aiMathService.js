import { solveEquationStepByStep, computeDerivative, computeDefiniteIntegral } from './mathEngine';

/**
 * AI Math Assistant service for natural language problem solving,
 * intelligent graphing suggestions, and educational explanations.
 */

// Preset knowledge bank for common AI explanations & natural language queries
const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['saddle', 'hyperbolic paraboloid', 'x^2 - y^2'],
    title: 'Hyperbolic Paraboloid (Saddle Surface)',
    equation: 'x^2 - y^2',
    mode: '3d',
    explanation: 'A hyperbolic paraboloid is a doubly ruled surface shaped like a saddle. At the origin (0,0), it has a saddle point where the slope is zero along orthogonal directions but curves upwards in x and downwards in y.'
  },
  {
    keywords: ['ripple', 'wave', 'sin(r)', 'sin(sqrt)'],
    title: 'Radial Wave Surface',
    equation: 'sin(sqrt(x^2 + y^2))',
    mode: '3d',
    explanation: 'Represents a concentric circular wave expanding outward from the origin, frequently seen in acoustics, fluid dynamics, and wave optics.'
  },
  {
    keywords: ['vector field', 'vortex', 'rotation', 'fluid'],
    title: 'Rotational Vector Field',
    pExpr: '-y',
    qExpr: 'x',
    mode: 'vector',
    explanation: 'The vector field F(x, y) = (-y, x) models pure counter-clockwise rotation around the origin. The magnitude of vectors increases linearly with distance from the center.'
  },
  {
    keywords: ['quadratic', 'parabola', 'ball', 'projectile'],
    title: 'Quadratic Trajectory',
    equation: '-0.5*x^2 + 3*x + 2',
    mode: '2d',
    explanation: 'Models ideal parabolic motion under constant gravity. The vertex represents the peak trajectory height, and the roots represent impact points.'
  },
  {
    keywords: ['fourier', 'square wave', 'harmonics', 'sine series'],
    title: 'Fourier Harmonic Series',
    equation: 'sin(x) + (1/3)*sin(3*x) + (1/5)*sin(5*x)',
    mode: '2d',
    explanation: 'Demonstrates how complex periodic waveforms (like square waves) can be decomposed into an infinite sum of fundamental sine wave harmonics.'
  }
];

export async function processAiMathPrompt(promptText) {
  const query = promptText.toLowerCase().trim();

  // Check knowledge base matches
  for (const item of AI_KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => query.includes(kw))) {
      return {
        answerText: item.explanation,
        suggestedEquation: item.equation || null,
        mode: item.mode,
        pExpr: item.pExpr,
        qExpr: item.qExpr,
        title: item.title,
        steps: null
      };
    }
  }

  // 1. Natural Language Derivative Request
  if (query.includes('derivative') || query.includes('differentiate') || query.includes('d/dx')) {
    // Extract math expression after derivative keyword
    const cleaned = query.replace(/find the derivative of|derivative of|differentiate|d\/dx/gi, '').trim();
    const res = computeDerivative(cleaned || 'x^3 - 4*x');
    if (!res.error) {
      return {
        answerText: `The derivative of $f(x) = ${res.original}$ with respect to $x$ is:`,
        suggestedEquation: res.derivativeStr,
        mode: '2d',
        title: `Derivative of ${res.original}`,
        latex: res.derivativeTex,
        steps: [
          { title: 'Original Function', latex: `f(x) = ${res.original}`, explanation: 'Input target function' },
          { title: 'Applied Rule', latex: `\\frac{d}{dx} f(x)`, explanation: 'Differentiation with respect to x' },
          { title: 'Result', latex: res.derivativeTex, explanation: 'Simplified derivative expression' }
        ]
      };
    }
  }

  // 2. Natural Language Integration Request
  if (query.includes('integral') || query.includes('integrate') || query.includes('area under')) {
    const cleaned = query.replace(/find the integral of|integrate|area under/gi, '').trim();
    const res = computeDefiniteIntegral(cleaned || 'x^2', 0, 2);
    return {
      answerText: `To integrate $f(x) = ${cleaned || 'x^2'}$, we evaluate the area under the curve. For interval $[0, 2]$, the definite integral is approximately **${res.result}**.`,
      suggestedEquation: cleaned || 'x^2',
      mode: '2d',
      title: `Integral of ${cleaned || 'x^2'}`,
      steps: [
        { title: 'Integrand', latex: `\\int_{0}^{2} (${cleaned || 'x^2'}) dx`, explanation: 'Definite integral bounds [0, 2]' },
        { title: 'Evaluated Result', latex: `= ${res.result}`, explanation: 'Numerical integration result' }
      ]
    };
  }

  // 3. 3D Surface Request
  if (query.includes('3d') || query.includes('surface') || query.includes('z =') || query.includes('multivariable')) {
    const mathMatch = query.match(/(?:z\s*=\s*)?([x\d\s\+\-\*\/\^\(\)sin cos tan sqrt]+)/i);
    const expr = mathMatch ? mathMatch[1].trim() : 'cos(x^2 + y^2)';
    return {
      answerText: `Generated 3D multivariable surface plot for $z = ${expr}$. You can orbit, zoom, and adjust grid parameters in the 3D Studio!`,
      suggestedEquation: expr,
      mode: '3d',
      title: `3D Surface: z = ${expr}`
    };
  }

  // 4. Equation Solver Fallback
  const mathMatch = query.match(/([x\d\s\+\-\*\/\^\(\)=sin cos tan sqrt]+)/i);
  const expr = mathMatch ? mathMatch[1].trim() : promptText;
  const solveResult = solveEquationStepByStep(expr);

  return {
    answerText: `Here is the mathematical step-by-step breakdown for **${expr}**:`,
    suggestedEquation: solveResult.solutionType !== 'Error' ? expr : 'x^2 - 4',
    mode: '2d',
    title: `Solution for ${expr}`,
    steps: solveResult.steps || []
  };
}
