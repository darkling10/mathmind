import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { sampleSurface3D, sampleParametric3D, sampleVectorField } from '../services/mathEngine';
import { Box, Layers, Palette, Compass, RefreshCw } from 'lucide-react';

export default function Graph3DPlotter({ initialEquation = 'cos(sqrt(x^2 + y^2))' }) {
  const [plotMode, setPlotMode] = useState('surface'); // 'surface', 'parametric', 'vector'
  const [equation3D, setEquation3D] = useState(initialEquation);
  
  // Parametric shape type
  const [parametricType, setParametricType] = useState('torus'); // 'torus', 'sphere', 'mobius'
  
  // Vector field expressions P(x,y), Q(x,y)
  const [vectorExpr, setVectorExpr] = useState({ p: '-y', q: 'x' });

  // Visual Customizations
  const [colorScale, setColorScale] = useState('Viridis'); // Viridis, Plasma, Electric, Rainbow
  const [showContours, setShowContours] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);

  // Range and Grid resolution
  const [gridRes, setGridRes] = useState(45);
  const [range3D, setRange3D] = useState({ min: -5, max: 5 });

  const plot3DContainerRef = useRef(null);

  useEffect(() => {
    if (!plot3DContainerRef.current) return;

    let traces = [];

    if (plotMode === 'surface') {
      const sampled = sampleSurface3D(
        equation3D,
        range3D.min,
        range3D.max,
        range3D.min,
        range3D.max,
        gridRes
      );

      if (!sampled.error) {
        traces.push({
          x: sampled.x,
          y: sampled.y,
          z: sampled.z,
          type: 'surface',
          colorscale: colorScale,
          showscale: true,
          contours: {
            z: {
              show: showContours,
              usecolormap: true,
              highlightcolor: '#ffffff',
              project: { z: true }
            }
          },
          wireframe: {
            show: showWireframe,
            color: 'rgba(255,255,255,0.4)',
            width: 1
          }
        });
      }
    } else if (plotMode === 'parametric') {
      const sampled = sampleParametric3D(parametricType, 3, 1, gridRes, gridRes);
      traces.push({
        x: sampled.x,
        y: sampled.y,
        z: sampled.z,
        type: 'surface',
        colorscale: colorScale,
        showscale: true
      });
    } else if (plotMode === 'vector') {
      const sampled = sampleVectorField(vectorExpr.p, vectorExpr.q, 16, 5);
      if (!sampled.error && sampled.x) {
        // Render 2D Vector Arrows using cone / quiver scatter
        traces.push({
          x: sampled.x,
          y: sampled.y,
          mode: 'markers',
          marker: {
            symbol: 'arrow',
            color: '#06b6d4',
            size: 12,
            angle: sampled.u.map((u, i) => (Math.atan2(sampled.v[i], u) * 180) / Math.PI)
          },
          name: 'Vector Arrows'
        });
      }
    }

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 13, 20, 0.8)',
      margin: { l: 20, r: 20, t: 30, b: 30 },
      scene: {
        xaxis: {
          title: 'X Axis',
          gridcolor: 'rgba(255, 255, 255, 0.1)',
          zerolinecolor: 'rgba(255, 255, 255, 0.3)',
          tickfont: { color: '#9ca3af' },
          backgroundcolor: 'rgba(15, 23, 42, 0.5)'
        },
        yaxis: {
          title: 'Y Axis',
          gridcolor: 'rgba(255, 255, 255, 0.1)',
          zerolinecolor: 'rgba(255, 255, 255, 0.3)',
          tickfont: { color: '#9ca3af' },
          backgroundcolor: 'rgba(15, 23, 42, 0.5)'
        },
        zaxis: {
          title: 'Z = f(X, Y)',
          gridcolor: 'rgba(255, 255, 255, 0.1)',
          zerolinecolor: 'rgba(255, 255, 255, 0.3)',
          tickfont: { color: '#9ca3af' },
          backgroundcolor: 'rgba(15, 23, 42, 0.5)'
        },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.2 }
        }
      }
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false
    };

    Plotly.newPlot(plot3DContainerRef.current, traces, layout, config);
  }, [plotMode, equation3D, parametricType, vectorExpr, colorScale, showContours, showWireframe, gridRes, range3D]);

  return (
    <div className="w-full space-y-4">
      
      {/* 3D Studio Control Bar */}
      <div className="glass-panel p-4 rounded-xl border border-purple-500/20 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Mode Tabs */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setPlotMode('surface')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                plotMode === 'surface' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Surface z = f(x,y)
            </button>
            <button
              onClick={() => setPlotMode('parametric')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                plotMode === 'parametric' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Parametric Shapes
            </button>
            <button
              onClick={() => setPlotMode('vector')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                plotMode === 'vector' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vector Fields
            </button>
          </div>

          {/* Color Palette Selector */}
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-slate-300">Theme:</span>
            <select
              value={colorScale}
              onChange={(e) => setColorScale(e.target.value)}
              className="glass-input text-xs font-mono py-1 px-2.5 rounded-lg"
            >
              <option value="Viridis">Viridis (Cyan/Yellow)</option>
              <option value="Plasma">Plasma (Neon Pink)</option>
              <option value="Electric">Electric (Deep Blue)</option>
              <option value="Rainbow">Rainbow</option>
              <option value="Thermal">Thermal</option>
            </select>
          </div>
        </div>

        {/* Dynamic Mode Controls */}
        {plotMode === 'surface' && (
          <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-white/10">
            <span className="text-xs font-mono font-bold text-cyan-300">z =</span>
            <input
              type="text"
              value={equation3D}
              onChange={(e) => setEquation3D(e.target.value)}
              placeholder="e.g. sin(sqrt(x^2 + y^2))"
              className="glass-input text-xs font-mono flex-1 py-1.5 px-3"
            />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showContours}
                  onChange={(e) => setShowContours(e.target.checked)}
                  className="rounded accent-purple-500"
                />
                Contour Projections
              </label>
            </div>
          </div>
        )}

        {plotMode === 'parametric' && (
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-300">Preset Geometry:</span>
            {['torus', 'sphere', 'mobius'].map((geo) => (
              <button
                key={geo}
                onClick={() => setParametricType(geo)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  parametricType === geo
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}
              >
                {geo}
              </button>
            ))}
          </div>
        )}

        {plotMode === 'vector' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-300 font-bold">P(x,y) =</span>
              <input
                type="text"
                value={vectorExpr.p}
                onChange={(e) => setVectorExpr({ ...vectorExpr, p: e.target.value })}
                className="glass-input text-xs font-mono flex-1 py-1 px-2"
                placeholder="e.g. -y"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-300 font-bold">Q(x,y) =</span>
              <input
                type="text"
                value={vectorExpr.q}
                onChange={(e) => setVectorExpr({ ...vectorExpr, q: e.target.value })}
                className="glass-input text-xs font-mono flex-1 py-1 px-2"
                placeholder="e.g. x"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Plotly 3D WebGL Canvas */}
      <div className="glass-panel p-4 rounded-xl border border-purple-500/20 relative min-h-[500px]">
        <div ref={plot3DContainerRef} className="w-full h-[490px]" />
      </div>
    </div>
  );
}
