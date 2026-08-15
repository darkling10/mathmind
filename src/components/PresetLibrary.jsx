import React from 'react';
import { Layers, ArrowRight, X } from 'lucide-react';

export default function PresetLibrary({ onSelectPreset, onClose }) {
  const categories = [
    {
      name: 'Calculus & Functions (2D)',
      presets: [
        { title: 'Harmonic Damped Oscillator', eq: 'exp(-0.2*x) * cos(3*x)', mode: '2d', desc: 'Damped sinusoidal wave decaying exponentially over time.' },
        { title: 'Normal Gaussian Bell Curve', eq: 'exp(-x^2 / 2) / sqrt(2 * pi)', mode: '2d', desc: 'Standard probability density distribution.' },
        { title: 'Polynomial Quintic Curve', eq: 'x^5 - 5*x^3 + 4*x', mode: '2d', desc: 'Polynomial with multiple real roots and turning points.' },
        { title: 'Fourier Wave Superposition', eq: 'sin(x) + (1/3)*sin(3*x) + (1/5)*sin(5*x)', mode: '2d', desc: 'Harmonic sine wave building a square wave.' }
      ]
    },
    {
      name: '3D Surfaces & Multivariable (WebGL)',
      presets: [
        { title: 'Hyperbolic Paraboloid (Saddle)', eq: 'x^2 - y^2', mode: '3d', desc: 'Saddle point surface with orthogonal curvature.' },
        { title: 'Concentric Circular Wave', eq: 'cos(sqrt(x^2 + y^2))', mode: '3d', desc: 'Radial wave pattern propagating in 2D space.' },
        { title: 'Gaussian 3D Peak', eq: '3 * exp(-(x^2 + y^2) / 4)', mode: '3d', desc: 'Smooth bell-shaped hill surface in 3D.' },
        { title: 'Torus (3D Parametric Geometry)', eq: 'torus', mode: '3d', desc: 'Donut shaped parametric ring manifold.' }
      ]
    },
    {
      name: 'Vector Fields & Linear Transformations',
      presets: [
        { title: 'Rotational Fluid Vortex', eq: '-y', mode: '3d', desc: 'Vector field F(x,y) = (-y, x) showing angular circulation.' },
        { title: 'Source Expansion Field', eq: 'x', mode: '3d', desc: 'Vector field radiating outward from origin.' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 max-w-4xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Preset Mathematical Gallery</h2>
              <p className="text-xs text-slate-400">Select any preset to load immediately into the visualizer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.presets.map((item, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => {
                      onSelectPreset(item.eq, item.mode);
                      onClose();
                    }}
                    className="glass-card p-4 rounded-xl border border-white/10 hover:border-cyan-400/40 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                        item.mode === '3d' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {item.mode}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-indigo-300 mb-2 font-semibold">
                      {item.eq}
                    </div>

                    <p className="text-xs text-slate-400 leading-snug">
                      {item.desc}
                    </p>
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
