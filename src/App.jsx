import React, { useState } from 'react';
import Navbar from './components/Navbar';
import GraphPlotter from './components/GraphPlotter';
import Graph3DPlotter from './components/Graph3DPlotter';
import CalculusLab from './components/CalculusLab';
import PhysicsSimulator from './components/physics/PhysicsSimulator';
import EquationSolver from './components/EquationSolver';
import MatrixLab from './components/MatrixLab';
import AiAssistant from './components/AiAssistant';
import PresetLibrary from './components/PresetLibrary';
import CheatSheetModal from './components/CheatSheetModal';
import LoadingScreen from './components/LoadingScreen';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Preloader Splash Loading Screen State
  const [isLoading, setIsLoading] = useState(true);

  // Dual-Tier Navigation State
  const [primaryDomain, setPrimaryDomain] = useState('graphing'); // 'graphing', 'calculus', 'physics', 'algebra', 'ai'
  const [subTool, setSubTool] = useState('2d');

  // Shared active equations
  const [currentEquation2D, setCurrentEquation2D] = useState('2 * sin(x)');
  const [currentEquation3D, setCurrentEquation3D] = useState('cos(sqrt(x^2 + y^2))');

  // Modals state
  const [showPresets, setShowPresets] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Apply preset
  const handleSelectPreset = (equation, mode) => {
    if (mode === '3d') {
      setCurrentEquation3D(equation);
      setPrimaryDomain('graphing');
      setSubTool('3d');
    } else {
      setCurrentEquation2D(equation);
      setPrimaryDomain('graphing');
      setSubTool('2d');
    }
  };

  // Cross-component navigation helper
  const handleSendToGraph = (eq, mode = '2d') => {
    if (mode === '3d') {
      setCurrentEquation3D(eq);
      setPrimaryDomain('graphing');
      setSubTool('3d');
    } else {
      setCurrentEquation2D(eq);
      setPrimaryDomain('graphing');
      setSubTool('2d');
    }
  };

  return (
    <>
      {/* Animated App Preloader Splash Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Main Application Container */}
      <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-opacity duration-500 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}>
        
        {/* Top Dual-Tier Header Navigation */}
        <Navbar
          primaryDomain={primaryDomain}
          setPrimaryDomain={setPrimaryDomain}
          subTool={subTool}
          setSubTool={setSubTool}
          onOpenPresets={() => setShowPresets(true)}
          onOpenCheatSheet={() => setShowCheatSheet(true)}
        />

        {/* Main Content Workspace Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-12">
          
          {/* Graphing Category */}
          {primaryDomain === 'graphing' && (
            <>
              {subTool === '2d' && (
                <GraphPlotter key={currentEquation2D} initialEquation={currentEquation2D} />
              )}
              {subTool === '3d' && (
                <Graph3DPlotter key={currentEquation3D} initialEquation={currentEquation3D} />
              )}
            </>
          )}

          {/* Calculus Category */}
          {primaryDomain === 'calculus' && (
            <CalculusLab activeSubTool={subTool} />
          )}

          {/* Physics & Dynamics Category */}
          {primaryDomain === 'physics' && (
            <PhysicsSimulator activeSubTool={subTool} />
          )}

          {/* Algebra & Solvers Category */}
          {primaryDomain === 'algebra' && (
            <>
              {subTool === 'solver' && (
                <EquationSolver onSendToGraph={(eq) => handleSendToGraph(eq, '2d')} />
              )}
              {subTool === 'matrix' && (
                <MatrixLab />
              )}
            </>
          )}

          {/* AI Tutor Category */}
          {primaryDomain === 'ai' && (
            <AiAssistant onApplyToGraph={(eq, mode) => handleSendToGraph(eq, mode)} />
          )}

        </main>

        {/* Modals */}
        {showPresets && (
          <PresetLibrary
            onSelectPreset={handleSelectPreset}
            onClose={() => setShowPresets(false)}
          />
        )}

        {showCheatSheet && (
          <CheatSheetModal
            onClose={() => setShowCheatSheet(false)}
          />
        )}

        {/* Footer */}
        <footer className="w-full border-t border-white/10 py-6 text-center text-xs text-slate-500 glass-panel mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-400">MathMind AI</span> — Modular Dual-Tier Architecture
            </div>
            <div className="flex items-center gap-1">
              <span>Powered by Math.js, Plotly WebGL, & KaTeX</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
