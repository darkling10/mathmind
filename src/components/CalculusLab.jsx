import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { 
  sampleFunction2D, 
  computeTangentLine, 
  computeRiemannSum, 
  computeTaylorSeries, 
  sampleSlopeField,
  computeDerivative
} from '../services/mathEngine';
import { TrendingUp, BarChart2, Layers, Compass } from 'lucide-react';

export default function CalculusLab({ activeSubTool = 'tangent' }) {
  const [subTab, setSubTab] = useState(activeSubTool); // 'tangent', 'riemann', 'taylor', 'slope'

  // Sync subTab with activeSubTool prop when passed from Navbar
  useEffect(() => {
    if (activeSubTool) {
      setSubTab(activeSubTool);
    }
  }, [activeSubTool]);

  // Target Functions & States
  const [targetExpr, setTargetExpr] = useState('x^2 - 3*x + 2');

  // Sub-Tab 1: Tangent Line State
  const [x0, setX0] = useState(1);
  const [showDerivativeCurve, setShowDerivativeCurve] = useState(true);
  const [tangentData, setTangentData] = useState(null);

  // Sub-Tab 2: Riemann Sum State
  const [riemannBounds, setRiemannBounds] = useState({ a: 0, b: 3 });
  const [numSubintervals, setNumSubintervals] = useState(10);
  const [riemannMethod, setRiemannMethod] = useState('left');
  const [riemannResult, setRiemannResult] = useState(null);

  // Sub-Tab 3: Taylor Series State
  const [taylorFunction, setTaylorFunction] = useState('sin(x)');
  const [taylorOrder, setTaylorOrder] = useState(3);
  const [taylorCenter, setTaylorCenter] = useState(0);
  const [taylorData, setTaylorData] = useState(null);

  // Sub-Tab 4: Differential Equation Slope Field State
  const [odeExpr, setOdeExpr] = useState('x - y');

  const plotRef = useRef(null);

  // Render Tangent Inspector Graph
  useEffect(() => {
    const node = plotRef.current;
    if (subTab !== 'tangent' || !node) return;

    const mainSampled = sampleFunction2D(targetExpr, -6, 6, 400);
    const tanRes = computeTangentLine(targetExpr, x0);
    setTangentData(tanRes);

    const traces = [];

    // 1. Original function f(x)
    traces.push({
      x: mainSampled.x,
      y: mainSampled.y,
      mode: 'lines',
      name: `f(x) = ${targetExpr}`,
      line: { color: '#06b6d4', width: 3 }
    });

    // 2. Derivative curve f'(x)
    if (showDerivativeCurve) {
      const derivRes = computeDerivative(targetExpr);
      if (!derivRes.error) {
        const derivSampled = sampleFunction2D(derivRes.derivativeStr, -6, 6, 400);
        traces.push({
          x: derivSampled.x,
          y: derivSampled.y,
          mode: 'lines',
          name: `f'(x) = ${derivRes.derivativeStr}`,
          line: { color: '#a855f7', width: 2, dash: 'dot' }
        });
      }
    }

    // 3. Tangent line
    if (!tanRes.error && tanRes.tangentExpr) {
      const tanSampled = sampleFunction2D(tanRes.tangentExpr, -6, 6, 100);
      traces.push({
        x: tanSampled.x,
        y: tanSampled.y,
        mode: 'lines',
        name: `Tangent at x=${x0}: y=${tanRes.slope}x + ${tanRes.y0}`,
        line: { color: '#ec4899', width: 2.5 }
      });

      traces.push({
        x: [tanRes.x0],
        y: [tanRes.y0],
        mode: 'markers',
        name: `Point (x0, y0)`,
        marker: { color: '#ec4899', size: 11, symbol: 'circle' }
      });
    }

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 50, r: 25, t: 35, b: 45 },
      xaxis: { title: 'x', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      yaxis: { title: 'y', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      legend: { font: { color: '#e2e8f0' }, bgcolor: 'rgba(15, 23, 42, 0.85)', orientation: 'h', y: 1.12 }
    };

    Plotly.newPlot(node, traces, layout, { responsive: true, displaylogo: false });
    return () => { if (node) Plotly.purge(node); };
  }, [subTab, targetExpr, x0, showDerivativeCurve]);

  // Render Riemann Sums Graph
  useEffect(() => {
    const node = plotRef.current;
    if (subTab !== 'riemann' || !node) return;

    const mainSampled = sampleFunction2D(targetExpr, -2, 6, 400);
    const rSum = computeRiemannSum(targetExpr, riemannBounds.a, riemannBounds.b, numSubintervals, riemannMethod);
    setRiemannResult(rSum);

    const traces = [];

    traces.push({
      x: mainSampled.x,
      y: mainSampled.y,
      mode: 'lines',
      name: `f(x) = ${targetExpr}`,
      line: { color: '#06b6d4', width: 3 }
    });

    if (rSum.bars && rSum.bars.length > 0) {
      if (riemannMethod === 'trapezoid') {
        rSum.bars.forEach((b, idx) => {
          traces.push({
            x: b.x,
            y: b.y,
            fill: 'toself',
            fillcolor: 'rgba(99, 102, 241, 0.35)',
            line: { color: '#6366f1', width: 1 },
            showlegend: idx === 0,
            name: `Trapezoid Bars`
          });
        });
      } else {
        rSum.bars.forEach((b, idx) => {
          traces.push({
            x: [b.xLeft, b.xRight, b.xRight, b.xLeft, b.xLeft],
            y: [0, 0, b.height, b.height, 0],
            fill: 'toself',
            fillcolor: 'rgba(99, 102, 241, 0.35)',
            line: { color: '#6366f1', width: 1 },
            showlegend: idx === 0,
            name: `${riemannMethod.toUpperCase()} Rectangles`
          });
        });
      }
    }

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 50, r: 25, t: 35, b: 45 },
      xaxis: { title: 'x', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      yaxis: { title: 'y', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      legend: { font: { color: '#e2e8f0' }, bgcolor: 'rgba(15, 23, 42, 0.85)', orientation: 'h', y: 1.12 }
    };

    Plotly.newPlot(node, traces, layout, { responsive: true, displaylogo: false });
    return () => { if (node) Plotly.purge(node); };
  }, [subTab, targetExpr, riemannBounds, numSubintervals, riemannMethod]);

  // Render Taylor Series Graph
  useEffect(() => {
    const node = plotRef.current;
    if (subTab !== 'taylor' || !node) return;

    const mainSampled = sampleFunction2D(taylorFunction, -6, 6, 400);
    const taylorRes = computeTaylorSeries(taylorFunction, taylorCenter, taylorOrder);
    setTaylorData(taylorRes);

    const traces = [];

    traces.push({
      x: mainSampled.x,
      y: mainSampled.y,
      mode: 'lines',
      name: `True f(x) = ${taylorFunction}`,
      line: { color: '#06b6d4', width: 3 }
    });

    if (!taylorRes.error && taylorRes.taylorExprStr) {
      const taylorSampled = sampleFunction2D(taylorRes.taylorExprStr, -6, 6, 400);
      traces.push({
        x: taylorSampled.x,
        y: taylorSampled.y,
        mode: 'lines',
        name: `Taylor Poly P_${taylorOrder}(x)`,
        line: { color: '#ec4899', width: 2.5, dash: 'dash' }
      });
    }

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 50, r: 25, t: 35, b: 45 },
      xaxis: { title: 'x', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      yaxis: { title: 'y', range: [-4, 4], gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      legend: { font: { color: '#e2e8f0' }, bgcolor: 'rgba(15, 23, 42, 0.85)', orientation: 'h', y: 1.12 }
    };

    Plotly.newPlot(node, traces, layout, { responsive: true, displaylogo: false });
    return () => { if (node) Plotly.purge(node); };
  }, [subTab, taylorFunction, taylorOrder, taylorCenter]);

  // Render ODE Slope Field Graph
  useEffect(() => {
    const node = plotRef.current;
    if (subTab !== 'slope' || !node) return;

    const sampledSF = sampleSlopeField(odeExpr, 18, 5);
    const traces = [];

    if (!sampledSF.error && sampledSF.x) {
      traces.push({
        x: sampledSF.x,
        y: sampledSF.y,
        mode: 'markers',
        marker: {
          symbol: 'line-ew-open',
          color: '#a855f7',
          size: 14,
          angle: sampledSF.u.map((u, i) => (Math.atan2(sampledSF.v[i], u) * 180) / Math.PI)
        },
        name: `Slope Field dy/dx = ${odeExpr}`
      });
    }

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 50, r: 25, t: 35, b: 45 },
      xaxis: { title: 'x', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      yaxis: { title: 'y', gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.3)', tickfont: { color: '#94a3b8' } },
      legend: { font: { color: '#e2e8f0' }, bgcolor: 'rgba(15, 23, 42, 0.85)', orientation: 'h', y: 1.12 }
    };

    Plotly.newPlot(node, traces, layout, { responsive: true, displaylogo: false });
    return () => { if (node) Plotly.purge(node); };
  }, [subTab, odeExpr]);

  return (
    <div className="w-full space-y-6">
      
      {/* Control Toolbar */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
        {subTab === 'tangent' && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 flex-1">
              <span className="text-xs font-mono font-bold text-cyan-300">f(x) =</span>
              <input
                type="text"
                value={targetExpr}
                onChange={(e) => setTargetExpr(e.target.value)}
                className="glass-input text-xs font-mono flex-1 py-1.5 px-3 rounded-lg"
                placeholder="e.g. x^2 - 3*x + 2"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-pink-300">Slide x₀ = {x0}</span>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.1"
                  value={x0}
                  onChange={(e) => setX0(parseFloat(e.target.value))}
                  className="w-32"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDerivativeCurve}
                  onChange={(e) => setShowDerivativeCurve(e.target.checked)}
                  className="rounded accent-purple-500"
                />
                Show f'(x) Curve
              </label>
            </div>
          </div>
        )}

        {subTab === 'riemann' && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-mono font-bold text-cyan-300">f(x) =</span>
              <input
                type="text"
                value={targetExpr}
                onChange={(e) => setTargetExpr(e.target.value)}
                className="glass-input text-xs font-mono flex-1 py-1.5 px-3 rounded-lg"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-bold">Method:</span>
                <select
                  value={riemannMethod}
                  onChange={(e) => setRiemannMethod(e.target.value)}
                  className="glass-input text-xs font-mono py-1 px-2 rounded-lg"
                >
                  <option value="left">Left Sum</option>
                  <option value="right">Right Sum</option>
                  <option value="midpoint">Midpoint</option>
                  <option value="trapezoid">Trapezoidal</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-cyan-300 font-bold">Sub-rectangles N = {numSubintervals}</span>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={numSubintervals}
                  onChange={(e) => setNumSubintervals(parseInt(e.target.value))}
                  className="w-28"
                />
              </div>
            </div>
          </div>
        )}

        {subTab === 'taylor' && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-mono font-bold text-cyan-300">Target f(x) =</span>
              <input
                type="text"
                value={taylorFunction}
                onChange={(e) => setTaylorFunction(e.target.value)}
                className="glass-input text-xs font-mono flex-1 py-1.5 px-3 rounded-lg"
                placeholder="e.g. sin(x)"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-purple-300 font-bold">Order n = {taylorOrder}</span>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={taylorOrder}
                  onChange={(e) => setTaylorOrder(parseInt(e.target.value))}
                  className="w-28"
                />
              </div>
            </div>
          </div>
        )}

        {subTab === 'slope' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-pink-300">ODE dy/dx =</span>
            <input
              type="text"
              value={odeExpr}
              onChange={(e) => setOdeExpr(e.target.value)}
              className="glass-input text-xs font-mono flex-1 py-1.5 px-3 rounded-lg"
              placeholder="e.g. x - y or sin(x) - y"
            />
          </div>
        )}
      </div>

      {/* Main Plot Container */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 shadow-2xl relative min-h-[460px]">
        <div ref={plotRef} className="w-full h-[450px]" />
      </div>

      {/* Summary Output */}
      {subTab === 'tangent' && tangentData && !tangentData.error && (
        <div className="glass-panel p-4 rounded-xl border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">Instantaneous Derivative Slope</span>
            <div className="text-sm font-mono font-extrabold text-white mt-0.5">
              f'({tangentData.x0}) = {tangentData.slope}
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/80 rounded-lg border border-white/10 text-xs font-mono text-cyan-300">
            Tangent Line Eq: y = {tangentData.slope}·(x - {tangentData.x0}) + {tangentData.y0}
          </div>
        </div>
      )}

      {subTab === 'riemann' && riemannResult && !riemannResult.error && (
        <div className="glass-panel p-4 rounded-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Riemann Area Approximation</span>
            <div className="text-base font-mono font-extrabold text-cyan-300 mt-0.5">
              Sum S_{numSubintervals} = {riemannResult.areaSum}
            </div>
          </div>
          <div className="text-xs text-slate-300 font-mono">
            Width dx = {riemannResult.dx} units per sub-rectangle
          </div>
        </div>
      )}

      {subTab === 'taylor' && taylorData && !taylorData.error && (
        <div className="glass-panel p-4 rounded-xl border border-purple-500/30 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Taylor Series Polynomial P_{taylorOrder}(x)</span>
          <div className="p-3 bg-slate-950/80 rounded-lg border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
            P_{taylorOrder}(x) = {taylorData.taylorExprStr}
          </div>
        </div>
      )}

    </div>
  );
}
