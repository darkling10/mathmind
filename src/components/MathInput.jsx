import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { formatLatex } from '../services/mathEngine';
import VirtualKeyboard from './VirtualKeyboard';
import { Keyboard, Send, XCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { FEATURE_FLAGS } from '../config/featureFlags';

export default function MathInput({ value, onChange, onSubmit, label = "Enter Equation or Function", placeholder = "e.g. sin(x) * exp(-0.1 * x)", showAiButton = false, onAiClick }) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [katexHtml, setKatexHtml] = useState('');
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!value || !value.trim()) {
      setKatexHtml('');
      setIsValid(true);
      return;
    }

    try {
      const tex = formatLatex(value);
      const html = katex.renderToString(tex, {
        throwOnError: false,
        displayMode: true
      });
      setKatexHtml(html);
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
    }
  }, [value]);

  const handleSymbolInsert = (symbol) => {
    let toAdd = symbol;
    if (symbol === 'x^2') toAdd = '^2';
    else if (symbol === 'x^3') toAdd = '^3';
    else if (symbol === 'integral') toAdd = 'x^2';

    onChange(value + toAdd);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleDelete = () => {
    onChange(value.slice(0, -1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full relative space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2.5">
          <span>{label}</span>
          {isValid ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 normal-case font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Valid Syntax
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-pink-400 normal-case font-semibold bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">
              <XCircle className="w-3.5 h-3.5" /> Syntax Warning
            </span>
          )}
        </label>

        <div className="flex items-center gap-2">
          {showAiButton && FEATURE_FLAGS.ENABLE_AI_FEATURES && (
            <button
              onClick={onAiClick}
              className="text-xs font-bold text-purple-300 hover:text-white bg-purple-500/20 border border-purple-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              Ask AI
            </button>
          )}

          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              showKeyboard
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Virtual Keyboard</span>
          </button>
        </div>
      </div>

      {/* Main Input Control Row */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full glass-input text-sm font-mono py-3 px-4 rounded-xl shadow-inner ${
              !isValid ? 'border-pink-500/60 focus:border-pink-500' : ''
            }`}
          />
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onSubmit}
          className="btn-neon px-5 py-3 text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <span>Evaluate</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Live KaTeX Render Preview Panel */}
      {katexHtml && (
        <div className="p-3.5 glass-card rounded-xl border border-indigo-500/20 bg-slate-950/80 flex items-center justify-center min-h-[58px] overflow-x-auto shadow-inner">
          <div
            className="katex-preview text-slate-100 text-center"
            dangerouslySetInnerHTML={{ __html: katexHtml }}
          />
        </div>
      )}

      {/* Floating Virtual Keyboard Popover */}
      {showKeyboard && (
        <div className="absolute top-full left-0 mt-3 z-50">
          <VirtualKeyboard
            onInsert={handleSymbolInsert}
            onDelete={handleDelete}
            onSubmit={() => {
              setShowKeyboard(false);
              onSubmit();
            }}
            onClose={() => setShowKeyboard(false)}
          />
        </div>
      )}
    </div>
  );
}
