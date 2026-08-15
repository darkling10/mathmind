import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { computeHarmonicOscillator } from '../../services/physicsEngine';
import { Activity, Sliders, RefreshCw, Zap } from 'lucide-react';

export default function HarmonicOscillator() {
  const [mass, setMass] = useState(1);
  const [damping, setDamping] = useState(0.4);
  const [stiffness, setStiffness] = useState(12);
  const [forceF0, setForceF0] = useState(0);
  const [driveOmega, setDriveOmega] = useState(3);

  const dispPlotRef = useRef(null);
  const phasePlotRef = useRef(null);

  const oscData = computeHarmonicOscillator(mass, damping, stiffness, forceF0, driveOmega, 1.5, 0, 12, 500);

  useEffect(() => {
    if (!dispPlotRef.current || !phasePlotRef.current) return;

    // 1. Displacement vs Time Trace
    const dispTraces = [
      {
        x: oscData.tValues,
        y: oscData.xValues,
        mode: 'lines',
        name: 'Displacement x(t)',
        line: { color: '#06b6d4', width: 3 }
      },
      {
        x: oscData.tValues,
        y: oscData.vValues,
        mode: 'lines',
        name: 'Velocity v(t)',
        line: { color: '#a855f7', width: 2, dash: 'dot' }
      }
    ];

    const dispLayout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 55, r: 25, t: 30, b: 50 },
      xaxis: { title: { text: 'Time t (s)', font: { color: '#94a3b8', size: 12 } }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.25)', tickfont: { color: '#94a3b8' } },
      yaxis: { title: { text: 'Amplitude', font: { color: '#94a3b8', size: 12 } }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.25)', tickfont: { color: '#94a3b8' } },
      legend: { font: { color: '#e2e8f0' }, bgcolor: 'rgba(15, 23, 42, 0.85)', orientation: 'h', y: 1.12 }
    };

    Plotly.newPlot(dispPlotRef.current, dispTraces, dispLayout, { responsive: true, displaylogo: false });

    // 2. Phase Space Diagram (v vs x)
    const phaseTraces = [
      {
        x: oscData.xValues,
        y: oscData.vValues,
        mode: 'lines',
        name: 'Phase Portrait (v vs x)',
        line: { color: '#ec4899', width: 2.5 }
      }
    ];

    const phaseLayout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 55, r: 25, t: 30, b: 50 },
      xaxis: { title: { text: 'Displacement x', font: { color: '#94a3b8', size: 12 } }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.25)', tickfont: { color: '#94a3b8' } },
      yaxis: { title: { text: 'Velocity v = dx/dt', font: { color: '#94a3b8', size: 12 } }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.25)', tickfont: { color: '#94a3b8' } },
      legend: { font: { color: '#e2e8f0' }, bgcolor: 'rgba(15, 23, 42, 0.85)', orientation: 'h', y: 1.12 }
    };

    Plotly.newPlot(phasePlotRef.current, phaseTraces, phaseLayout, { responsive: true, displaylogo: false });
  }, [mass, damping, stiffness, forceF0, driveOmega, oscData]);

  return (
    <div className="w-full space-y-6">
      
      {/* Parameters Panel */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" /> Mass-Spring-Damper System
          </h3>
          <span className="badge-purple text-xs font-mono font-bold">{oscData.regime}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Mass m</span>
              <span className="text-cyan-300 font-bold">{mass} kg</span>
            </div>
            <input type="range" min="0.2" max="5" step="0.1" value={mass} onChange={(e) => setMass(parseFloat(e.target.value))} />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Damping c</span>
              <span className="text-pink-300 font-bold">{damping} N·s/m</span>
            </div>
            <input type="range" min="0" max="5" step="0.05" value={damping} onChange={(e) => setDamping(parseFloat(e.target.value))} />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Spring Constant k</span>
              <span className="text-purple-300 font-bold">{stiffness} N/m</span>
            </div>
            <input type="range" min="1" max="50" step="1" value={stiffness} onChange={(e) => setStiffness(parseFloat(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Plot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 shadow-2xl">
          <h4 className="text-xs font-bold text-slate-300 mb-2">Displacement & Velocity vs Time</h4>
          <div ref={dispPlotRef} className="w-full h-[380px]" />
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 shadow-2xl">
          <h4 className="text-xs font-bold text-slate-300 mb-2">Phase Space Portrait (v vs x)</h4>
          <div ref={phasePlotRef} className="w-full h-[380px]" />
        </div>
      </div>

    </div>
  );
}
