import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { formatLatex } from '../services/mathEngine';
import VirtualKeyboard from './VirtualKeyboard';
import { Keyboard, Send, XCircle, CheckCircle2, Sparkles, CornerDownLeft } from 'lucide-react';
import { FEATURE_FLAGS } from '../config/featureFlags';

// Comprehensive math autocomplete dictionary
const MATH_AUTOCOMPLETE_DATABASE = [
  // Trigonometric & Hyperbolic
  { token: 'sin', completion: 'sin(x)', desc: 'Sine function' },
  { token: 'cos', completion: 'cos(x)', desc: 'Cosine function' },
  { token: 'tan', completion: 'tan(x)', desc: 'Tangent function' },
  { token: 'asin', completion: 'asin(x)', desc: 'Arc sine' },
  { token: 'acos', completion: 'acos(x)', desc: 'Arc cosine' },
  { token: 'atan', completion: 'atan(x)', desc: 'Arc tangent' },
  { token: 'sinh', completion: 'sinh(x)', desc: 'Hyperbolic sine' },
  { token: 'cosh', completion: 'cosh(x)', desc: 'Hyperbolic cosine' },
  { token: 'tanh', completion: 'tanh(x)', desc: 'Hyperbolic tangent' },

  // Roots, Powers, Logarithms & Exponential
  { token: 'sq', completion: 'sqrt(x)', desc: 'Square root' },
  { token: 'sqrt', completion: 'sqrt(x)', desc: 'Square root' },
  { token: 'exp', completion: 'exp(-0.2*x)', desc: 'Exponential decay/growth' },
  { token: 'log', completion: 'log(x)', desc: 'Natural logarithm' },
  { token: 'abs', completion: 'abs(x)', desc: 'Absolute value' },

  // Standard Equations & Curves
  { token: '2*', completion: '2 * sin(x)', desc: 'Amplified sine wave' },
  { token: 'x^2', completion: 'x^2 - 4*x + 4', desc: 'Parabola' },
  { token: 'x^3', completion: 'x^3 - 3*x', desc: 'Cubic curve' },
  { token: 'sin(x)', completion: 'sin(x) * exp(-0.1*x)', desc: 'Damped sine wave' },
  { token: 'cos(x)', completion: 'cos(sqrt(x^2 + y^2))', desc: '3D Radial ripple' },
  { token: 'gauss', completion: 'exp(-x^2)', desc: 'Gaussian bell curve' },
  { token: 'd/dx', completion: 'd/dx(x^3 * sin(x))', desc: 'Symbolic derivative' },
  { token: 'pi', completion: 'pi * sin(x)', desc: 'Pi constant' }
];

export default function MathInput({ 
  value, 
  onChange, 
  onSubmit, 
  label = "Enter Equation or Function", 
  placeholder = "Start typing e.g. sin, cos, sqrt, x^2...", 
  showAiButton = false, 
  onAiClick 
}) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [katexHtml, setKatexHtml] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const inputRef = useRef(null);

  // Filter suggestions whenever value changes
  useEffect(() => {
    if (!value || !value.trim()) {
      setKatexHtml('');
      setIsValid(true);
      setSuggestions([]);
      setShowAutocomplete(false);
      return;
    }

    // Filter autocomplete matches
    const valLower = value.toLowerCase().trim();
    const lastWord = valLower.split(/[\s+\-*/^()]+/).pop() || valLower;

    if (lastWord.length >= 1) {
      const matches = MATH_AUTOCOMPLETE_DATABASE.filter(item =>
        item.token.toLowerCase().startsWith(lastWord) ||
        item.completion.toLowerCase().includes(lastWord)
      ).slice(0, 5);

      setSuggestions(matches);
      setSelectedIndex(0);
      setShowAutocomplete(matches.length > 0);
    } else {
      setShowAutocomplete(false);
    }

    // Render KaTeX Preview
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

  const applySuggestion = (completion) => {
    // Replace the last partial token with the full completion
    const parts = value.split(/([\s+\-*/^()]+)/);
    if (parts.length > 0) {
      parts[parts.length - 1] = completion;
      onChange(parts.join(''));
    } else {
      onChange(completion);
    }
    setShowAutocomplete(false);
    if (inputRef.current) inputRef.current.focus();
  };

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
    if (showAutocomplete && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && showAutocomplete)) {
        e.preventDefault();
        applySuggestion(suggestions[selectedIndex].completion);
        return;
      }
      if (e.key === 'Escape') {
        setShowAutocomplete(false);
        return;
      }
    }

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
              onClick={() => {
                onChange('');
                setShowAutocomplete(false);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete Dropdown Popup */}
          {showAutocomplete && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 glass-panel p-2 rounded-xl border border-indigo-500/30 shadow-2xl bg-slate-950/95 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-1 flex items-center justify-between border-b border-white/10">
                <span>Equation Autocomplete</span>
                <span className="text-slate-500 font-mono">Use ↑↓ & Tab / Enter</span>
              </div>
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => applySuggestion(item.completion)}
                  className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                    idx === selectedIndex
                      ? 'bg-indigo-600/40 border border-indigo-400/40 text-cyan-300 font-bold'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.completion}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">{item.desc}</span>
                </div>
              ))}
            </div>
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
