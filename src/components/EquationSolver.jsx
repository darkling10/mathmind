import React, { useState, useEffect } from 'react';
import katex from 'katex';
import { solveEquationStepByStep } from '../services/mathEngine';
import MathInput from './MathInput';
import { Calculator, CheckCircle, Copy, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function EquationSolver({ initialQuery = 'x^2 - 5*x + 6 = 0', onSendToGraph }) {
  const [query, setQuery] = useState(initialQuery);
  const [solverResult, setSolverResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSolve = () => {
    if (!query.trim()) return;
    const res = solveEquationStepByStep(query);
    setSolverResult(res);
  };

  useEffect(() => {
    handleSolve();
  }, []);

  const renderKaTeX = (tex) => {
    try {
      return { __html: katex.renderToString(tex, { throwOnError: false }) };
    } catch (e) {
      return { __html: tex };
    }
  };

  const handleCopyLatex = () => {
    if (solverResult?.solutionLatex) {
      navigator.clipboard.writeText(solverResult.solutionLatex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Math Input Box */}
      <div className="glass-panel p-5 rounded-xl border border-indigo-500/30 shadow-xl">
        <MathInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSolve}
          label="Step-by-Step Symbolic Equation Solver"
          placeholder="e.g. x^2 - 5*x + 6 = 0 or d/dx(sin(x) * x^2)"
        />
      </div>

      {/* Solver Steps Breakdown */}
      {solverResult && (
        <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-5">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                  Step-by-Step Solution Breakdown
                </h3>
                <span className="badge-cyan text-xs">{solverResult.solutionType || 'Symbolic'}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Rigorous algebraic and calculus derivations</p>
            </div>

            <div className="flex items-center gap-2">
              {solverResult.solutionLatex && (
                <button
                  onClick={handleCopyLatex}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy LaTeX'}</span>
                </button>
              )}
              <button
                onClick={() => onSendToGraph(query)}
                className="btn-neon text-xs py-1.5 px-3"
              >
                <span>Plot on 2D Grapher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Derivation Steps List */}
          <div className="space-y-4">
            {solverResult.steps?.map((step, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">{step.title}</h4>
                </div>

                {step.latex && (
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-white/5 overflow-x-auto text-center">
                    <span dangerouslySetInnerHTML={renderKaTeX(step.latex)} />
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed font-sans pl-8">
                  {step.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Final Solution Box */}
          {solverResult.solutionLatex && (
            <div className="p-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 border border-indigo-500/40 rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Final Symbolic Answer
              </span>
              <div
                className="text-lg font-bold text-white text-center"
                dangerouslySetInnerHTML={renderKaTeX(solverResult.solutionLatex)}
              />
            </div>
          )}

        </div>
      )}

    </div>
  );
}
