import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { sampleSurface3D, sampleParametric3D, sampleVectorField } from '../services/mathEngine';
import { Layers, Compass, Wind, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Graph3DPlotter({ initialEquation = 'cos(sqrt(x^2 + y^2))' }) {
  const { currentTheme } = useTheme();
  const [plotMode, setPlotMode] = useState('surface'); // 'surface', 'parametric', 'vector'
  const [expr3D, setExpr3D] = useState(initialEquation);
  const [parametricType, setParametricType] = useState('torus');
  const [vectorFieldP, setVectorFieldP] = useState('-y');
  const [vectorFieldQ, setVectorFieldQ] = useState('x');

  const plotContainerRef = useRef(null);

  useEffect(() => {
    const node = plotContainerRef.current;
    if (!node) return;

    const isLight = currentTheme.mode === 'light';
    let traces = [];
    let layout = {};

    if (plotMode === 'surface') {
      const surface = sampleSurface3D(expr3D);
      traces = [{
        type: 'surface',
        x: surface.x,
        y: surface.y,
        z: surface.z,
        colorscale: 'Viridis',
        showscale: true,
        contours: {
          z: { show: true, usecolormap: true, highlightcolor: "#06b6d4", project: { z: true } }
        }
      }];

      layout = {
        autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: isLight ? '#ffffff' : currentTheme.plotlyBg,
        margin: { l: 0, r: 0, t: 0, b: 0 },
        scene: {
          xaxis: { title: 'X', gridcolor: currentTheme.plotlyGrid, tickfont: { color: currentTheme.plotlyText } },
          yaxis: { title: 'Y', gridcolor: currentTheme.plotlyGrid, tickfont: { color: currentTheme.plotlyText } },
          zaxis: { title: 'Z = f(X,Y)', gridcolor: currentTheme.plotlyGrid, tickfont: { color: currentTheme.plotlyText } },
          camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
        }
      };
    } else if (plotMode === 'parametric') {
      const par = sampleParametric3D(parametricType);
      traces = [{
        type: 'surface',
        x: par.x,
        y: par.y,
        z: par.z,
        colorscale: 'Electric',
        showscale: false
      }];

      layout = {
        autosize: true,
        paper_bgcolor: 'transparent',
        margin: { l: 0, r: 0, t: 0, b: 0 },
        scene: {
          camera: { eye: { x: 1.6, y: 1.6, z: 1.3 } }
        }
      };
    } else if (plotMode === 'vector') {
      const vf = sampleVectorField(vectorFieldP, vectorFieldQ);
      traces = [{
        type: 'cone',
        x: vf.x,
        y: vf.y,
        z: vf.x.map(() => 0),
        u: vf.u,
        v: vf.v,
        w: vf.u.map(() => 0),
        colorscale: 'Portland',
        sizemode: 'scaled',
        sizeref: 0.5
      }];

      layout = {
        autosize: true,
        paper_bgcolor: 'transparent',
        margin: { l: 10, r: 10, t: 10, b: 10 }
      };
    }

    Plotly.newPlot(node, traces, layout, { responsive: true, displaylogo: false });
    return () => { if (node) Plotly.purge(node); };
  }, [plotMode, expr3D, parametricType, vectorFieldP, vectorFieldQ, currentTheme]);

  return (
    <div className="w-full space-y-6">
      
      {/* 3D Mode Selector Card */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">3D WebGL Studio & Flow Fields</h3>
              <p className="text-xs opacity-70">Multivariable surfaces, 3D parametric shapes & vector flow fields</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-black/5 p-1 rounded-xl">
            <button
              onClick={() => setPlotMode('surface')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                plotMode === 'surface' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Surface z=f(x,y)
            </button>
            <button
              onClick={() => setPlotMode('parametric')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                plotMode === 'parametric' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Parametric 3D
            </button>
            <button
              onClick={() => setPlotMode('vector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                plotMode === 'vector' ? 'bg-indigo-600 text-white shadow' : 'opacity-70 hover:opacity-100'
              }`}
            >
              Vector Flow
            </button>
          </div>
        </div>

        {/* Inputs depending on mode */}
        {plotMode === 'surface' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold opacity-80 min-w-[70px]">z = f(x,y) =</span>
            <input
              type="text"
              value={expr3D}
              onChange={(e) => setExpr3D(e.target.value)}
              className="glass-input text-xs font-mono flex-1 py-2 px-3 rounded-xl"
              placeholder="e.g. cos(sqrt(x^2 + y^2))"
            />
          </div>
        )}

        {plotMode === 'parametric' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold opacity-80">Shape Preset:</span>
            <select
              value={parametricType}
              onChange={(e) => setParametricType(e.target.value)}
              className="glass-input text-xs font-mono py-2 px-3 rounded-xl"
            >
              <option value="torus">Torus (Donut Surface)</option>
              <option value="sphere">Sphere (3D Ball)</option>
              <option value="mobius">Möbius Strip</option>
              <option value="ripple">Ripple Waves</option>
            </select>
          </div>
        )}

        {plotMode === 'vector' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold opacity-80">P(x,y) =</span>
              <input
                type="text"
                value={vectorFieldP}
                onChange={(e) => setVectorFieldP(e.target.value)}
                className="glass-input text-xs font-mono flex-1 py-1.5 px-3 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold opacity-80">Q(x,y) =</span>
              <input
                type="text"
                value={vectorFieldQ}
                onChange={(e) => setVectorFieldQ(e.target.value)}
                className="glass-input text-xs font-mono flex-1 py-1.5 px-3 rounded-lg"
              />
            </div>
          </div>
        )}

      </div>

      {/* 3D Canvas */}
      <div className="glass-panel p-5 rounded-2xl shadow-2xl relative">
        <div ref={plotContainerRef} className="w-full h-[520px]" />
      </div>

    </div>
  );
}
