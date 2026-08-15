import React from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';

export default function VirtualKeyboard({ onInsert, onDelete, onSubmit, onClose }) {
  const symbolCategories = [
    {
      name: 'Basic & Powers',
      symbols: ['+', '-', '*', '/', '^', 'x^2', 'x^3', 'sqrt(', 'abs(']
    },
    {
      name: 'Trig & Calculus',
      symbols: ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', 'd/dx', 'integral']
    },
    {
      name: 'Variables & Constants',
      symbols: ['x', 'y', 'z', 'pi', 'e', 'theta', 'a', 'b', 'c']
    },
    {
      name: 'Parentheses & Symbols',
      symbols: ['(', ')', ',', '=', '<', '>', '<=', '>=']
    }
  ];

  return (
    <div className="glass-panel p-4 rounded-xl border border-indigo-500/20 shadow-2xl backdrop-blur-xl bg-slate-950/90 max-w-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Virtual Math Palette
        </h4>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5"
        >
          Close
        </button>
      </div>

      <div className="space-y-3">
        {symbolCategories.map((cat, idx) => (
          <div key={idx}>
            <div className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">
              {cat.name}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.symbols.map((sym, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => onInsert(sym)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-600/30 hover:border-indigo-400/50 border border-white/10 text-xs font-mono font-semibold text-slate-200 hover:text-cyan-300 transition-all active:scale-95"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/10">
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold"
        >
          <Delete className="w-3.5 h-3.5" /> Backspace
        </button>
        <button
          onClick={onSubmit}
          className="btn-neon text-xs py-1.5 px-4"
        >
          <CornerDownLeft className="w-3.5 h-3.5" /> Evaluate
        </button>
      </div>
    </div>
  );
}
