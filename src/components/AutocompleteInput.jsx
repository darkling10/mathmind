import React, { useState, useEffect, useRef } from 'react';
import { CornerDownLeft, XCircle } from 'lucide-react';

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
    const trimmed = (text || '').trim().toLowerCase();

    if (!trimmed) {
      setSuggestions(MATH_AUTOCOMPLETE_ITEMS.slice(0, 4));
      setSelectedIndex(0);
      return;
    }

    // Filter out items that are EXACT matches to the input text
    const matches = MATH_AUTOCOMPLETE_ITEMS.filter(item => {
      const compLower = item.completion.toLowerCase();
      if (compLower === trimmed) return false; // Hide exact matches!
      return (
        item.token.toLowerCase().includes(trimmed) ||
        compLower.includes(trimmed) ||
        item.desc.toLowerCase().includes(trimmed)
      );
    }).slice(0, 5);

    setSuggestions(matches);
    setSelectedIndex(0);
    setIsOpen(matches.length > 0);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    updateSuggestions(val);
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
    <div ref={wrapperRef} className="relative w-full z-30">
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

      {/* Autocomplete Dropdown Popover */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-1.5 z-50 p-2 rounded-xl border border-indigo-500/40 shadow-2xl bg-slate-900 text-slate-100 min-w-[320px] max-w-md space-y-1 backdrop-blur-2xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-1 flex items-center justify-between border-b border-white/10">
            <span>Equation Autocomplete</span>
            <span className="text-slate-400 font-mono text-[9px]">↑↓ & Tab / Enter</span>
          </div>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onMouseDown={(e) => {
                e.preventDefault();
                applySuggestion(item.completion);
              }}
              className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between transition-all ${
                idx === selectedIndex
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'hover:bg-white/10 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs">
                <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item.completion}</span>
              </div>
              <span className="text-[11px] opacity-75 font-sans ml-3">{item.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
