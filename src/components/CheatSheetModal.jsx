import React from 'react';
import katex from 'katex';
import { BookOpen, X } from 'lucide-react';

export default function CheatSheetModal({ onClose }) {
  const sections = [
    {
      title: 'Differentiation Rules',
      rules: [
        { name: 'Power Rule', tex: '\\frac{d}{dx}(x^n) = n x^{n-1}' },
        { name: 'Product Rule', tex: '\\frac{d}{dx}(u \\cdot v) = u\'v + uv\'' },
        { name: 'Quotient Rule', tex: '\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u\'v - uv\'}{v^2}' },
        { name: 'Chain Rule', tex: '\\frac{d}{dx}(f(g(x))) = f\'(g(x)) \\cdot g\'(x)' }
      ]
    },
    {
      title: 'Common Integrals',
      rules: [
        { name: 'Polynomial Integral', tex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C' },
        { name: 'Exponential Integral', tex: '\\int e^{ax} dx = \\frac{1}{a} e^{ax} + C' },
        { name: 'Trig Sine Integral', tex: '\\int \\sin(x) dx = -\\cos(x) + C' },
        { name: 'Logarithmic Integral', tex: '\\int \\frac{1}{x} dx = \\ln|x| + C' }
      ]
    },
    {
      title: 'Trigonometric Identities',
      rules: [
        { name: 'Pythagorean Identity', tex: '\\sin^2(x) + \\cos^2(x) = 1' },
        { name: 'Double Angle Sine', tex: '\\sin(2x) = 2 \\sin(x) \\cos(x)' },
        { name: 'Double Angle Cosine', tex: '\\cos(2x) = \\cos^2(x) - \\sin^2(x)' }
      ]
    }
  ];

  const renderKaTeX = (tex) => {
    try {
      return { __html: katex.renderToString(tex, { throwOnError: false }) };
    } catch (e) {
      return { __html: tex };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Mathematical Formula Cheatsheet</h2>
              <p className="text-xs text-slate-400">Essential calculus rules, derivatives, and identities</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {sec.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sec.rules.map((rule, rIdx) => (
                  <div key={rIdx} className="glass-card p-3 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[11px] font-bold text-slate-300">{rule.name}</span>
                    <div
                      className="p-2 bg-slate-900/80 rounded border border-white/5 text-center text-cyan-300 overflow-x-auto"
                      dangerouslySetInnerHTML={renderKaTeX(rule.tex)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
