import React, { useState } from 'react';
import { 
  LineChart, 
  TrendingUp, 
  Calculator, 
  Sparkles, 
  BookOpen, 
  Layers,
  BrainCircuit,
  Zap,
  HelpCircle,
  Palette
} from 'lucide-react';
import { FEATURE_FLAGS } from '../config/featureFlags';
import ThemeSelectorModal from './ThemeSelectorModal';

export default function Navbar({ 
  primaryDomain, 
  setPrimaryDomain, 
  subTool, 
  setSubTool, 
  onOpenPresets, 
  onOpenCheatSheet 
}) {
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Primary domain categories
  const allDomains = [
    { 
      id: 'graphing', 
      label: 'Graphing & Geometry', 
      icon: LineChart,
      subTools: [
        { id: '2d', label: '2D Function Plotter' },
        { id: '3d', label: '3D WebGL Studio' }
      ]
    },
    { 
      id: 'calculus', 
      label: 'Calculus Suite', 
      icon: TrendingUp,
      subTools: [
        { id: 'tangent', label: 'Tangent & Derivative' },
        { id: 'riemann', label: 'Riemann Sums' },
        { id: 'taylor', label: 'Taylor Polynomials' },
        { id: 'slope', label: 'ODE Slope Fields' }
      ]
    },
    { 
      id: 'physics', 
      label: 'Physics & Dynamics', 
      icon: Zap,
      subTools: [
        { id: 'projectile', label: 'Projectile Trajectory' },
        { id: 'oscillator', label: 'Harmonic Oscillator' }
      ]
    },
    { 
      id: 'algebra', 
      label: 'Algebra & Solvers', 
      icon: Calculator,
      subTools: [
        { id: 'solver', label: 'Step-by-Step Solver' },
        { id: 'matrix', label: 'Matrix Laboratory' }
      ]
    },
    ...(FEATURE_FLAGS.ENABLE_AI_FEATURES ? [{
      id: 'ai', 
      label: 'AI Tutor', 
      icon: Sparkles,
      subTools: []
    }] : []),
    {
      id: 'docs',
      label: 'User Guide & Docs',
      icon: HelpCircle,
      subTools: []
    }
  ];

  const currentDomainObj = allDomains.find(d => d.id === primaryDomain) || allDomains[0];

  return (
    <>
      <header className="w-full sticky top-0 z-50 mb-6 border-b border-black/10 shadow-lg backdrop-blur-xl bg-slate-950/80 transition-colors duration-300">
        
        {/* Tier 1: Primary Header Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight whitespace-nowrap">
                MathMind
              </h1>
              <p className="text-[10px] opacity-60 font-medium whitespace-nowrap">Modular Studio</p>
            </div>
          </div>

          {/* Tier 1 Domain Selector Tabs */}
          <nav className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-white/5 overflow-x-auto gap-1 w-full lg:w-auto order-last lg:order-none mt-2 lg:mt-0 hide-scrollbar">
            {allDomains.map((domain) => {
              const Icon = domain.icon;
              const isActive = primaryDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => {
                    setPrimaryDomain(domain.id);
                    if (domain.subTools.length > 0) {
                      setSubTool(domain.subTools[0].id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md border border-indigo-400/30'
                      : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : ''}`} />
                  <span>{domain.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Global Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowThemeModal(true)}
              className="btn-secondary text-xs font-bold px-2.5 py-1.5 flex items-center gap-1.5"
              title="Theme Options"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Themes</span>
            </button>

            <button
              onClick={onOpenPresets}
              className="btn-secondary text-xs font-bold px-2.5 py-1.5 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Presets</span>
            </button>

            <button
              onClick={onOpenCheatSheet}
              className="btn-secondary text-xs font-bold px-2.5 py-1.5 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Cheatsheet</span>
            </button>
          </div>

        </div>

        {/* Tier 2: Contextual Sub-Toolbar */}
        {currentDomainObj.subTools.length > 0 && (
          <div className="w-full bg-slate-900/40 border-t border-white/5 py-1.5 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider whitespace-nowrap">
                  {currentDomainObj.label}:
                </span>
                <div className="flex items-center gap-1">
                  {currentDomainObj.subTools.map((st) => {
                    const isSubActive = subTool === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => setSubTool(st.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                          isSubActive
                            ? 'bg-indigo-600/80 text-cyan-200 border border-indigo-400/30 font-bold shadow-xs'
                            : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                        }`}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-1.5 text-[10px] opacity-60 font-mono shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Workspace Active</span>
              </div>

            </div>
          </div>
        )}

      </header>

      {/* Theme Selector Modal */}
      {showThemeModal && (
        <ThemeSelectorModal onClose={() => setShowThemeModal(false)} />
      )}
    </>
  );
}
