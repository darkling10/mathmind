import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { 
  HelpCircle, 
  Lightbulb, 
  LineChart, 
  TrendingUp, 
  Zap, 
  Calculator, 
  CheckCircle2, 
  Code,
  Sparkles,
  ArrowRight
} from 'lucide-react';

function KatexSpan({ math, displayMode = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !math) return;
    try {
      katex.render(math, containerRef.current, {
        throwOnError: false,
        displayMode
      });
    } catch (err) {
      if (containerRef.current) containerRef.current.innerText = math;
    }
  }, [math, displayMode]);

  return <span ref={containerRef} className="inline-block text-cyan-300 font-mono" />;
}

export default function DocumentationHub({ onNavigateToDomain }) {
  const [activeGuide, setActiveGuide] = useState('quickstart');

  const syntaxExamples = [
    { label: 'Exponents & Powers', input: 'x^3 + 2*x^2 - 5', math: 'x^3 + 2x^2 - 5', desc: 'Use ^ for exponentiation' },
    { label: 'Trigonometry', input: 'sin(2*x) + cos(x)', math: '\\sin(2x) + \\cos(x)', desc: 'Standard trigonometric functions' },
    { label: 'Square Roots', input: 'sqrt(x^2 + 1)', math: '\\sqrt{x^2 + 1}', desc: 'Use sqrt(...) for roots' },
    { label: 'Exponential & Log', input: 'exp(-0.2*x) * log(x)', math: 'e^{-0.2x} \\cdot \\ln(x)', desc: 'Natural exponential & log' },
    { label: 'Calculus Derivative', input: 'd/dx(x^3 * sin(x))', math: '\\frac{d}{dx}\\left(x^3 \\sin(x)\\right)', desc: 'Symbolic differentiation' },
    { label: 'Quadratic Equation', input: 'x^2 - 5*x + 6 = 0', math: 'x^2 - 5x + 6 = 0', desc: 'Step-by-step quadratic root solver' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shadow-lg">
            <HelpCircle className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Documentation & User Guide Hub</h2>
            <p className="text-xs text-slate-400">Master 2D/3D plotting, calculus visualizers, physics trajectory simulations, and math syntax</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-neon text-xs font-mono font-bold px-3 py-1 rounded-full">
            User Guide v2.0
          </span>
        </div>
      </div>

      {/* Guide Category Tabs */}
      <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 overflow-x-auto gap-1.5 shadow-inner">
        <button
          onClick={() => setActiveGuide('quickstart')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeGuide === 'quickstart' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Quickstart & Syntax</span>
        </button>

        <button
          onClick={() => setActiveGuide('graphing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeGuide === 'graphing' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LineChart className="w-4 h-4 text-indigo-300" />
          <span>2D & 3D Graphing Guide</span>
        </button>

        <button
          onClick={() => setActiveGuide('calculus')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeGuide === 'calculus' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-purple-300" />
          <span>Calculus Suite Guide</span>
        </button>

        <button
          onClick={() => setActiveGuide('physics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeGuide === 'physics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-pink-300" />
          <span>Physics Trajectory Guide</span>
        </button>

        <button
          onClick={() => setActiveGuide('solvers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeGuide === 'solvers' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-300" />
          <span>Step Solver & Matrix Guide</span>
        </button>
      </div>

      {/* Guide Content Panels */}
      {activeGuide === 'quickstart' && (
        <div className="space-y-6">
          
          {/* 3 Step Getting Started */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 3 Steps to Get Started Fast
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold">
                  1
                </div>
                <h4 className="text-xs font-bold text-white">Select Your Studio Category</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Use the top navigation bar to switch between <strong>Graphing & Geometry</strong>, <strong>Calculus Suite</strong>, <strong>Physics & Dynamics</strong>, or <strong>Algebra & Solvers</strong>.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-mono font-bold">
                  2
                </div>
                <h4 className="text-xs font-bold text-white">Enter Expressions or Sliders</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Type expressions directly into input boxes with real-time math autocomplete, or use the <strong>Virtual Keyboard</strong> for mathematical symbols.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-mono font-bold">
                  3
                </div>
                <h4 className="text-xs font-bold text-white">Explore Presets & Cheatsheet</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click <strong>Presets</strong> in the header to load pre-configured physics simulations, saddle surfaces, and wave harmonics instantly!
                </p>
              </div>

            </div>
          </div>

          {/* Math Syntax Reference Cards */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Code className="w-4 h-4" /> Mathematical Syntax Reference
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {syntaxExamples.map((ex, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border border-white/10 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-300">{ex.label}</span>
                    <div className="my-1.5 p-2 bg-slate-950/80 rounded-lg border border-white/5 flex items-center justify-between">
                      <KatexSpan math={ex.math} />
                      <span className="text-[10px] font-mono text-slate-500">{ex.input}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{ex.desc}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (ex.input.includes('=')) {
                        onNavigateToDomain('algebra', 'solver');
                      } else {
                        onNavigateToDomain('graphing', '2d');
                      }
                    }}
                    className="mt-2 text-[11px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 self-end"
                  >
                    <span>Try in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeGuide === 'graphing' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <LineChart className="w-4 h-4" /> 2D & 3D Graphing User Guide
          </h3>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300">Plotting Multiple Functions</h4>
              <p>In 2D Function Plotter, click <strong>+ Add Curve</strong> to plot up to 4 curves simultaneously. Each curve receives a distinct neon color.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300">Live Coefficient Sliders</h4>
              <p>Define coefficients like <KatexSpan math="a, b, c, k" /> in expressions and slide them in real time to observe live function transformations.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300">3D WebGL Surfaces</h4>
              <p>Switch to 3D WebGL Studio to plot multivariable surfaces <KatexSpan math="z = f(x, y)" />, 3D parametric shapes (Torus, Sphere, Mobius Strip), and 2D vector flow fields.</p>
            </div>
          </div>
        </div>
      )}

      {activeGuide === 'calculus' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Calculus Laboratory User Guide
          </h3>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-purple-300">Tangent Line & Derivative Inspector</h4>
              <p>Slide <KatexSpan math="x_0" /> along curve <KatexSpan math="f(x)" /> to watch the tangent line update live on the graph while computing the exact slope <KatexSpan math="f'(x_0)" />.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-purple-300">Riemann Sums Integral Visualizer</h4>
              <p>Select **Left Sum**, **Right Sum**, **Midpoint Rule**, or **Trapezoidal Rule** and adjust sub-rectangles <KatexSpan math="N" /> to observe visual convergence onto definite integral <KatexSpan math="\int_a^b f(x) dx" />.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-purple-300">Taylor Series & Slope Fields</h4>
              <p>Expand functions into Taylor polynomials <KatexSpan math="P_n(x)" /> or render direction fields for differential equations <KatexSpan math="\frac{dy}{dx} = f(x, y)" />.</p>
            </div>
          </div>
        </div>
      )}

      {activeGuide === 'physics' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-pink-400 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Physics Trajectory Simulator User Guide
          </h3>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-pink-300">Kinematic Projectile Flight Animation</h4>
              <p>Set launch velocity <KatexSpan math="v_0" />, angle <KatexSpan math="\theta" />, and initial height <KatexSpan math="h_0" />. Click **Animate Flight** to watch 60 FPS animated projectile trajectory simulation.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-pink-300">Gravity Presets & Air Drag Resistance</h4>
              <p>Switch planetary gravity presets between Earth (<KatexSpan math="9.81\text{ m/s}^2" />), Moon (<KatexSpan math="1.62\text{ m/s}^2" />), Mars (<KatexSpan math="3.71\text{ m/s}^2" />), and Jupiter (<KatexSpan math="24.79\text{ m/s}^2" />). Toggle air resistance drag <KatexSpan math="k" /> to overlay ideal vs resisted paths.</p>
            </div>
          </div>
        </div>
      )}

      {activeGuide === 'solvers' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Step Solver & Matrix Lab User Guide
          </h3>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300">Step-by-Step Symbolic Solver</h4>
              <p>Enter any quadratic equation (e.g. <KatexSpan math="x^2 - 5x + 6 = 0" />), derivative query (<KatexSpan math="\frac{d}{dx}(x^3)" />), or linear equation to view step-by-step discriminant and formula derivations.</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300">Linear Algebra Matrix Laboratory</h4>
              <p>Enter 2x2 or 3x3 matrix grids to compute determinants <KatexSpan math="\det(A)" />, inverse <KatexSpan math="A^{-1}" />, transpose <KatexSpan math="A^T" />, and eigenvalues <KatexSpan math="\lambda" />.</p>
            </div>
          </div>
        </div>
      )}

      {/* Useful Tips Card */}
      <div className="p-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 border border-indigo-500/30 rounded-2xl flex items-center gap-3 shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-white uppercase tracking-wide">Pro Tip: </span>
          <span className="text-slate-300">Tap <strong>Presets</strong> or <strong>Cheatsheet</strong> in the top header anytime to quickly insert complex engineering formulas into your active workspace!</span>
        </div>
      </div>

    </div>
  );
}
