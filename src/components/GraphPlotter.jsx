import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { sampleFunction2D, analyzeFunctionFeatures, computeDefiniteIntegral } from '../services/mathEngine';
import { Sliders, Activity, Plus, Trash2, Eye, EyeOff, Crosshair, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AutocompleteInput from './AutocompleteInput';

export default function GraphPlotter({ initialEquation = '2 * sin(x)' }) {
  const { currentTheme } = useTheme();

  // Functions array
  const [functions, setFunctions] = useState([
    { id: '1', expr: initialEquation, color: '#06b6d4', visible: true }
  ]);
  
  // Range & Settings
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [showRoots, setShowRoots] = useState(true);
  const [showExtrema, setShowExtrema] = useState(true);

  // Dynamic Parameters (a, b, c, k)
  const [params, setParams] = useState({ a: 2, b: 1, c: 0, k: 1 });

  // Definite integral area
  const [showIntegral, setShowIntegral] = useState(false);
  const [integralBounds, setIntegralBounds] = useState({ a: 0, b: 3 });
  const [integralResult, setIntegralResult] = useState(null);

  // Analytics
  const [analysis, setAnalysis] = useState({ roots: [], extrema: [] });

  const plotContainerRef = useRef(null);

  const handleAddFunction = () => {
    if (functions.length >= 4) return;
    const palette = ['#06b6d4', '#ec4899', '#10b981', '#f59e0b', '#a855f7'];
    const nextColor = palette[functions.length % palette.length];
    setFunctions([...functions, { id: String(Date.now()), expr: 'cos(x)', color: nextColor, visible: true }]);
  };

  const handleRemoveFunction = (id) => {
    if (functions.length <= 1) return;
    setFunctions(functions.filter(f => f.id !== id));
  };

  const handleUpdateExpr = (id, newExpr) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, expr: newExpr } : f));
  };

  const handleToggleVisible = (id) => {
    setFunctions(functions.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
  };

  // Re-render Plotly chart
  useEffect(() => {
    if (!plotContainerRef.current) return;

    const traces = [];
    let primaryRoots = [];
    let primaryExtrema = [];

    functions.forEach((func, idx) => {
      if (!func.visible || !func.expr.trim()) return;

      const sampled = sampleFunction2D(func.expr, xRange.min, xRange.max, 600, params);
      if (sampled.error) return;

      // Main line trace
      traces.push({
        x: sampled.x,
        y: sampled.y,
        mode: 'lines',
        name: `f${idx + 1}(x) = ${func.expr}`,
        line: { color: func.color, width: 3 }
      });

      if (idx === 0) {
        const feat = analyzeFunctionFeatures(func.expr, xRange.min, xRange.max);
        primaryRoots = feat.roots || [];
        primaryExtrema = feat.extrema || [];
        setAnalysis(feat);
      }
    });

    // Root points
    if (showRoots && primaryRoots.length > 0) {
      traces.push({
        x: primaryRoots.map(r => r.x),
        y: primaryRoots.map(r => r.y),
        mode: 'markers',
        name: 'Roots (Zeros)',
        marker: { color: '#ef4444', size: 10, symbol: 'circle', line: { color: '#ffffff', width: 2 } }
      });
    }

    // Extrema points
    if (showExtrema && primaryExtrema.length > 0) {
      traces.push({
        x: primaryExtrema.map(e => e.x),
        y: primaryExtrema.map(e => e.y),
        mode: 'markers',
        name: 'Extrema (Min/Max)',
        marker: { color: '#f59e0b', size: 10, symbol: 'diamond', line: { color: '#ffffff', width: 1.5 } }
      });
    }

    // Integral area shading
    if (showIntegral && functions[0]?.expr) {
      const primaryExpr = functions[0].expr;
      const sampledArea = sampleFunction2D(primaryExpr, integralBounds.a, integralBounds.b, 150, params);
      traces.push({
        x: sampledArea.x,
        y: sampledArea.y,
        fill: 'tozeroy',
        fillcolor: 'rgba(99, 102, 241, 0.25)',
        line: { color: '#6366f1', width: 1.5 },
        name: `Integral Area [${integralBounds.a}, ${integralBounds.b}]`
      });

      const intVal = computeDefiniteIntegral(primaryExpr, integralBounds.a, integralBounds.b);
      setIntegralResult(intVal.result);
    }

    const isTanOrDiv = functions.some(f => f.expr.toLowerCase().includes('tan') || f.expr.toLowerCase().includes('1/'));
    const isLight = currentTheme.mode === 'light';

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: isLight ? 'rgba(248, 250, 252, 0.95)' : currentTheme.plotlyBg,
      margin: { l: 55, r: 25, t: 30, b: 50 },
      xaxis: {
        title: { text: 'x', font: { color: currentTheme.plotlyText, size: 13, family: 'Inter' } },
        range: [xRange.min, xRange.max],
        gridcolor: currentTheme.plotlyGrid,
        zerolinecolor: isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.25)',
        tickfont: { color: currentTheme.plotlyText, family: 'Fira Code' }
      },
      yaxis: {
        title: { text: 'y = f(x)', font: { color: currentTheme.plotlyText, size: 13, family: 'Inter' } },
        range: isTanOrDiv ? [-10, 10] : undefined,
        gridcolor: currentTheme.plotlyGrid,
        zerolinecolor: isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.25)',
        tickfont: { color: currentTheme.plotlyText, family: 'Fira Code' }
      },
      legend: {
        font: { color: currentTheme.plotlyText, size: 11, family: 'Inter' },
        bgcolor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
        bordercolor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        borderwidth: 1,
        orientation: 'h',
        y: 1.12,
        x: 0
      },
      hovermode: 'closest'
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot(plotContainerRef.current, traces, layout, config);
  }, [functions, xRange, params, showRoots, showExtrema, showIntegral, integralBounds, currentTheme]);

  return (
    <div className="w-full space-y-6">
      
      {/* Function Control Cards Panel */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 shadow-xl relative z-30">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-500" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold">2D Function Overlay Manager</h3>
              <p className="text-xs opacity-70">Plot multiple curves with real-time math equation autocomplete</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRoots(!showRoots)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                showRoots
                  ? 'bg-red-500/20 text-red-500 border-red-500/40 shadow-sm'
                  : 'bg-black/5 opacity-70 hover:opacity-100'
              }`}
            >
              Roots (Zeros)
            </button>

            <button
              onClick={() => setShowExtrema(!showExtrema)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                showExtrema
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 shadow-sm'
                  : 'bg-black/5 opacity-70 hover:opacity-100'
              }`}
            >
              Extrema (Min/Max)
            </button>

            <button
              onClick={handleAddFunction}
              disabled={functions.length >= 4}
              className="btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-cyan-500" />
              <span>Add Curve</span>
            </button>
          </div>
        </div>

        {/* Function Inputs List with AutocompleteInput */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {functions.map((func, idx) => (
            <div key={func.id} className="glass-card p-3 rounded-xl flex items-center gap-3 shadow-sm relative z-30">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 shadow-md"
                style={{ backgroundColor: func.color }}
              />
              <span className="text-xs font-mono font-bold opacity-80 min-w-[50px]">
                f<sub>{idx + 1}</sub>(x) =
              </span>

              <div className="flex-1">
                <AutocompleteInput
                  value={func.expr}
                  onChange={(val) => handleUpdateExpr(func.id, val)}
                  placeholder="e.g. sin(x), sqrt(x)..."
                />
              </div>

              <button
                onClick={() => handleToggleVisible(func.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  func.visible ? 'bg-cyan-500/20 text-cyan-500' : 'opacity-40'
                }`}
                title={func.visible ? "Hide curve" : "Show curve"}
              >
                {func.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              {functions.length > 1 && (
                <button
                  onClick={() => handleRemoveFunction(func.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  title="Remove curve"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Main Interactive Plot Canvas Card */}
      <div className="glass-panel p-5 rounded-2xl shadow-2xl relative z-10">
        <div ref={plotContainerRef} className="w-full h-[480px]" />
      </div>

      {/* Analytics & Live Slider Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        
        {/* Card 1: Live Coefficient Sliders */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Live Parameters
            </h4>
            <span className="text-[10px] opacity-70 font-mono">Real-time morph</span>
          </div>

          <div className="space-y-3.5">
            {Object.keys(params).map((pKey) => (
              <div key={pKey} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold">{pKey}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-500 font-bold border border-indigo-500/30">
                    {params[pKey]}
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={params[pKey]}
                  onChange={(e) => setParams({ ...params, [pKey]: parseFloat(e.target.value) })}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Roots & Extrema Inspector */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-2">
              <Crosshair className="w-4 h-4" /> Feature Inspector
            </h4>
            <span className="text-[10px] opacity-70 font-mono">Calculated roots</span>
          </div>
          
          <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
            {analysis.roots.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">Roots (x-intercepts):</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {analysis.roots.map((r, i) => (
                    <span key={i} className="badge-neon text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
                      x = {r.x}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.extrema.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wide">Local Extrema:</span>
                <div className="space-y-1.5 mt-1.5">
                  {analysis.extrema.map((e, i) => (
                    <div key={i} className="text-xs font-mono flex justify-between glass-card p-2 rounded-lg">
                      <span className="font-semibold text-amber-500">{e.type}:</span>
                      <span className="font-bold">({e.x}, {e.y})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.roots.length === 0 && analysis.extrema.length === 0 && (
              <p className="text-xs opacity-70 italic pt-2">No real roots or extrema detected in range.</p>
            )}
          </div>
        </div>

        {/* Card 3: Definite Integral Calculator */}
        <div className="glass-panel p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Area Integration
            </h4>
            <button
              onClick={() => setShowIntegral(!showIntegral)}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                showIntegral
                  ? 'bg-purple-500/20 text-purple-500 border-purple-500/40 shadow-sm'
                  : 'bg-black/5 opacity-70 hover:opacity-100'
              }`}
            >
              {showIntegral ? 'Hide Shading' : 'Shade Area'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Lower Bound (a)</label>
              <input
                type="number"
                value={integralBounds.a}
                onChange={(e) => setIntegralBounds({ ...integralBounds, a: parseFloat(e.target.value) || 0 })}
                className="glass-input text-xs w-full py-1.5 px-3 rounded-lg font-mono font-bold mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Upper Bound (b)</label>
              <input
                type="number"
                value={integralBounds.b}
                onChange={(e) => setIntegralBounds({ ...integralBounds, b: parseFloat(e.target.value) || 1 })}
                className="glass-input text-xs w-full py-1.5 px-3 rounded-lg font-mono font-bold mt-1"
              />
            </div>
          </div>

          {showIntegral && integralResult !== null && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center shadow-inner">
              <span className="text-[11px] text-purple-500 font-bold uppercase tracking-wider">Definite Integral Result</span>
              <div className="text-sm font-mono font-extrabold text-indigo-500 mt-0.5">
                ∫<sub>{integralBounds.a}</sub><sup>{integralBounds.b}</sup> f(x)dx = {integralResult}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
