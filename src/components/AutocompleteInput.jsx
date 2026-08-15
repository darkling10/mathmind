import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CornerDownLeft, XCircle } from 'lucide-react';

const MATH_AUTOCOMPLETE_ITEMS = [
  { token: 'sin', completion: 'sin(x)', desc: 'Sine function' },
  { token: 'cos', completion: 'cos(x)', desc: 'Cosine function' },
  { token: 'tan', completion: 'tan(x)', desc: 'Tangent function' },
  { token: 'sqrt', completion: 'sqrt(x)', desc: 'Square root' },
  { token: 'exp', completion: 'exp(-0.1*x)', desc: 'Exponential decay' },
  { token: 'log', completion: 'log(x)', desc: 'Natural logarithm' },
  { token: 'abs', completion: 'abs(x)', desc: 'Absolute value' },
  { token: 'gauss', completion: 'exp(-x^2)', desc: 'Gaussian bell curve' },
  { token: 'damped', completion: 'sin(x) * exp(-0.1*x)', desc: 'Damped sine wave' },
  { token: 'poly', completion: 'x^3 - 3*x', desc: 'Cubic polynomial' },
  { token: 'para', completion: 'x^2 - 4*x + 4', desc: 'Parabola' },
  { token: '3dripple', completion: 'cos(sqrt(x^2 + y^2))', desc: '3D Ripple surface' },
  { token: 'saddle', completion: 'x^2 - y^2', desc: 'Hyperbolic saddle' },
  { token: '2sin', completion: '2 * sin(x)', desc: 'Amplified sine' }
];

export default function AutocompleteInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Enter expression e.g. sin(x)...",
  className = ""
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions based on user input
  const updateSuggestions = (text) => {
    if (!text || !text.trim()) {
      // Show top 4 popular items when empty
      setSuggestions(MATH_AUTOCOMPLETE_ITEMS.slice(0, 4));
      setSelectedIndex(0);
      return;
    }

    const lower = text.toLowerCase().trim();
    const matches = MATH_AUTOCOMPLETE_ITEMS.filter(item =>
      item.token.toLowerCase().includes(lower) ||
      item.completion.toLowerCase().includes(lower) ||
      item.desc.toLowerCase().includes(lower)
    ).slice(0, 5);

    setSuggestions(matches);
    setSelectedIndex(0);
    setIsOpen(matches.length > 0);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    updateSuggestions(val);
    setIsOpen(true);
  };

  const handleFocus = () => {
    updateSuggestions(value);
    setIsOpen(true);
  };

  const applySuggestion = (completion) => {
    onChange(completion);
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (isOpen && suggestions.length > 0) {
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
      if (e.key === 'Tab' || (e.key === 'Enter' && isOpen)) {
        e.preventDefault();
        applySuggestion(suggestions[selectedIndex].completion);
        if (onSubmit) onSubmit();
        return;
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
    }

    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`glass-input w-full text-xs font-mono py-2 px-3 rounded-lg border transition-all ${className}`}
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 text-slate-400 hover:text-white transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Menu */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 glass-panel p-1.5 rounded-xl border border-indigo-500/30 shadow-2xl bg-slate-950/95 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 flex items-center justify-between border-b border-white/10">
            <span>Equation Autocomplete</span>
            <span className="text-slate-500 font-mono text-[9px]">↑↓ & Tab / Enter</span>
          </div>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onMouseDown={(e) => {
                e.preventDefault();
                applySuggestion(item.completion);
              }}
              className={`px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                idx === selectedIndex
                  ? 'bg-indigo-600/40 border border-indigo-400/40 text-cyan-300 font-bold'
                  : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs">
                <CornerDownLeft className="w-3 h-3 text-cyan-400" />
                <span>{item.completion}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans">{item.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
