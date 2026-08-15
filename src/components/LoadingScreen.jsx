import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [captionIndex, setCaptionIndex] = useState(0);

  const captions = [
    'Initializing Symbolic Math Engine...',
    'Warming up WebGL 3D Surface Renderer...',
    'Loading KaTeX Mathematical Typesetting...',
    'Preparing Interactive Graphing Suite...',
    'MathMind AI Studio Ready!'
  ];

  useEffect(() => {
    // Progress bar ticker simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 10;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Caption text rotation based on progress
    if (progress < 25) setCaptionIndex(0);
    else if (progress < 50) setCaptionIndex(1);
    else if (progress < 75) setCaptionIndex(2);
    else if (progress < 95) setCaptionIndex(3);
    else setCaptionIndex(4);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      
      {/* Background Glowing Orbs & Ambient Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Floating Math Symbols Particle Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 font-mono text-cyan-400 text-lg flex flex-wrap gap-12 items-center justify-center p-10">
        <span className="animate-bounce delay-100">∫</span>
        <span className="animate-pulse delay-200 text-purple-400">f(x)dx</span>
        <span className="animate-bounce delay-300 text-pink-400">∇ × F</span>
        <span className="animate-pulse delay-75 text-emerald-400">lim x→0</span>
        <span className="animate-bounce delay-150">∑</span>
        <span className="animate-pulse delay-500 text-indigo-400">e^(iπ) + 1 = 0</span>
        <span className="animate-bounce delay-200 text-cyan-300">∂z/∂x</span>
      </div>

      {/* Center Animated Logo Unit */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md w-full">
        
        {/* Pulsing Glowing Ring around Logo */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 opacity-60 blur-lg animate-pulse" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/50">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <BrainCircuit className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300">
            MathMind <span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-1">
            Next-Gen Mathematical & Calculus Studio
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full space-y-2.5 pt-2">
          <div className="w-full bg-slate-900/90 h-2.5 rounded-full p-0.5 border border-white/10 shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-150 ease-out shadow-lg shadow-cyan-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              {progress < 100 ? (
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{captions[captionIndex]}</span>
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>
        </div>

      </div>

      {/* Footer Powered Tag */}
      <div className="absolute bottom-6 z-10 text-[11px] font-mono text-slate-500">
        Powered by Math.js • Plotly WebGL • KaTeX
      </div>

    </div>
  );
}
