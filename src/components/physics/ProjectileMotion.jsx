import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { computeIdealProjectile, computeDragProjectile } from '../../services/physicsEngine';
import { Play, Pause, RotateCcw, Sliders, Activity, Zap, ShieldAlert, Award } from 'lucide-react';

export default function ProjectileMotion() {
  // Input parameters
  const [v0, setV0] = useState(30);
  const [angle, setAngle] = useState(45);
  const [h0, setH0] = useState(0);
  const [gravity, setGravity] = useState(9.81); // 9.81 Earth, 1.62 Moon, 3.71 Mars, 24.79 Jupiter
  const [enableDrag, setEnableDrag] = useState(true);
  const [dragK, setDragK] = useState(0.12);

  // Animation controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [animIndex, setAnimIndex] = useState(0);

  const trajectoryPlotRef = useRef(null);
  const energyPlotRef = useRef(null);
  const animRef = useRef(null);

  // Computed Trajectory Data
  const idealData = computeIdealProjectile(v0, angle, h0, gravity);
  const dragData = enableDrag ? computeDragProjectile(v0, angle, h0, gravity, dragK) : null;

  // Animation Loop
  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(() => {
        setAnimIndex((prev) => {
          if (prev >= idealData.xValues.length - 1) {
            setIsPlaying(false);
            return idealData.xValues.length - 1;
          }
          return prev + 2;
        });
      });
    } else {
      cancelAnimationFrame(animRef.current);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, animIndex, idealData]);

  // Reset Animation
  const handleResetAnim = () => {
    setIsPlaying(false);
    setAnimIndex(0);
  };

  // Render Static Plots
  useEffect(() => {
    const trajNode = trajectoryPlotRef.current;
    const energyNode = energyPlotRef.current;
    if (!trajNode || !energyNode) return;

    // 1. Trajectory Plot Traces
    const trajTraces = [];

    // Ideal Curve
    trajTraces.push({
      x: idealData.xValues,
      y: idealData.yValues,
      mode: 'lines',
      name: 'Ideal Trajectory (Vacuum)',
      line: { color: '#06b6d4', width: 3 }
    });

    // Air Drag Curve
    if (enableDrag && dragData) {
      trajTraces.push({
        x: dragData.xValues,
        y: dragData.yValues,
        mode: 'lines',
        name: `Air Resistance Drag (k=${dragK})`,
        line: { color: '#ec4899', width: 2.5, dash: 'dash' }
      });
    }

    // Animated Projectile Ball Position Marker (Initial Position)
    trajTraces.push({
      x: [idealData.xValues[0]],
      y: [idealData.yValues[0]],
      mode: 'markers',
      name: 'Projectile',
      marker: { color: '#f59e0b', size: 14, symbol: 'circle', line: { color: '#ffffff', width: 2 } }
    });

    const trajLayout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 55, r: 25, t: 30, b: 50 },
      xaxis: {
        title: { text: 'Horizontal Distance x (m)', font: { color: '#94a3b8', size: 12 } },
        gridcolor: 'rgba(255, 255, 255, 0.08)',
        zerolinecolor: 'rgba(255, 255, 255, 0.25)',
        tickfont: { color: '#94a3b8' }
      },
      yaxis: {
        title: { text: 'Height y (m)', font: { color: '#94a3b8', size: 12 } },
        gridcolor: 'rgba(255, 255, 255, 0.08)',
        zerolinecolor: 'rgba(255, 255, 255, 0.25)',
        tickfont: { color: '#94a3b8' }
      },
      legend: {
        font: { color: '#e2e8f0', size: 11 },
        bgcolor: 'rgba(15, 23, 42, 0.85)',
        orientation: 'h',
        y: 1.12
      }
    };

    Plotly.newPlot(trajNode, trajTraces, trajLayout, { responsive: true, displaylogo: false });

    // 2. Energy Conservation Plot Traces
    const totalEnergy = idealData.keValues.map((ke, i) => ke + idealData.peValues[i]);

    const energyTraces = [
      {
        x: idealData.tValues,
        y: idealData.keValues,
        mode: 'lines',
        name: 'Kinetic Energy (KE)',
        line: { color: '#06b6d4', width: 2 }
      },
      {
        x: idealData.tValues,
        y: idealData.peValues,
        mode: 'lines',
        name: 'Potential Energy (PE)',
        line: { color: '#a855f7', width: 2 }
      },
      {
        x: idealData.tValues,
        y: totalEnergy,
        mode: 'lines',
        name: 'Total Energy (E)',
        line: { color: '#10b981', width: 2, dash: 'dot' }
      }
    ];

    const energyLayout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'rgba(10, 15, 28, 0.85)',
      margin: { l: 55, r: 25, t: 30, b: 50 },
      xaxis: {
        title: { text: 'Time t (s)', font: { color: '#94a3b8', size: 12 } },
        gridcolor: 'rgba(255, 255, 255, 0.08)',
        zerolinecolor: 'rgba(255, 255, 255, 0.25)',
        tickfont: { color: '#94a3b8' }
      },
      yaxis: {
        title: { text: 'Specific Energy (J/kg)', font: { color: '#94a3b8', size: 12 } },
        gridcolor: 'rgba(255, 255, 255, 0.08)',
        zerolinecolor: 'rgba(255, 255, 255, 0.25)',
        tickfont: { color: '#94a3b8' }
      },
      legend: {
        font: { color: '#e2e8f0', size: 11 },
        bgcolor: 'rgba(15, 23, 42, 0.85)',
        orientation: 'h',
        y: 1.12
      }
    };

    Plotly.newPlot(energyNode, energyTraces, energyLayout, { responsive: true, displaylogo: false });

    return () => {
      if (trajNode) Plotly.purge(trajNode);
      if (energyNode) Plotly.purge(energyNode);
    };
  }, [v0, angle, h0, gravity, enableDrag, dragK, idealData, dragData]);

  // Animate Plot Marker
  useEffect(() => {
    const trajNode = trajectoryPlotRef.current;
    if (!trajNode || !trajNode.data) return;

    const markerTraceIndex = (enableDrag && dragData) ? 2 : 1;
    
    // Check if the plot has been initialized with traces
    if (markerTraceIndex >= trajNode.data.length) return;

    const curX = idealData.xValues[Math.min(animIndex, idealData.xValues.length - 1)];
    const curY = idealData.yValues[Math.min(animIndex, idealData.yValues.length - 1)];

    try {
      Plotly.restyle(trajNode, { x: [[curX]], y: [[curY]] }, [markerTraceIndex]);
    } catch (e) {
      // Prevent crash if trace not available during restyle
    }
  }, [animIndex, idealData, enableDrag, dragData]);

  return (
    <div className="w-full space-y-6">
      
      {/* Control Panel */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Kinematic Projectile Trajectory Simulator</h3>
              <p className="text-xs text-slate-400">Simulate parabolic flight paths with gravity presets & drag resistance</p>
            </div>
          </div>

          {/* Animation Play Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-neon text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Animate Flight'}</span>
            </button>
            <button
              onClick={handleResetAnim}
              className="btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Launch Velocity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Initial Speed v₀</span>
              <span className="text-cyan-300 font-bold">{v0} m/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={v0}
              onChange={(e) => setV0(parseFloat(e.target.value))}
            />
          </div>

          {/* Launch Angle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-bold">Launch Angle θ</span>
              <span className="text-cyan-300 font-bold">{angle}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="85"
              value={angle}
              onChange={(e) => setAngle(parseFloat(e.target.value))}
            />
          </div>

          {/* Gravity Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-300 font-bold">Gravity Field:</span>
            <select
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className="glass-input text-xs font-mono w-full py-1.5 px-3 rounded-lg"
            >
              <option value="9.81">Earth (g = 9.81 m/s²)</option>
              <option value="1.62">Moon (g = 1.62 m/s²)</option>
              <option value="3.71">Mars (g = 3.71 m/s²)</option>
              <option value="24.79">Jupiter (g = 24.79 m/s²)</option>
            </select>
          </div>

          {/* Air Drag Toggle */}
          <div className="space-y-1.5 flex flex-col justify-center">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableDrag}
                onChange={(e) => setEnableDrag(e.target.checked)}
                className="rounded accent-pink-500"
              />
              Include Air Drag Resistance
            </label>
            {enableDrag && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-pink-300 font-bold">k = {dragK}</span>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={dragK}
                  onChange={(e) => setDragK(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Trajectory Plot Window */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 shadow-2xl relative">
        <div ref={trajectoryPlotRef} className="w-full h-[440px]" />
      </div>

      {/* Numerical Trajectory Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">Total Horizontal Range</span>
          <div className="text-2xl font-mono font-extrabold text-white mt-1">
            {idealData.range} <span className="text-xs text-slate-400">meters</span>
          </div>
          {enableDrag && dragData && (
            <div className="text-xs text-pink-300 font-mono mt-1">
              With Drag: {dragData.range} m ({-Math.round((1 - dragData.range / idealData.range) * 100)}%)
            </div>
          )}
        </div>

        <div className="glass-panel p-4 rounded-xl border border-purple-500/30 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Maximum Height (Apex)</span>
          <div className="text-2xl font-mono font-extrabold text-white mt-1">
            {idealData.hMax} <span className="text-xs text-slate-400">meters</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Total Flight Duration</span>
          <div className="text-2xl font-mono font-extrabold text-white mt-1">
            {idealData.tFlight} <span className="text-xs text-slate-400">seconds</span>
          </div>
        </div>

      </div>

      {/* Energy Conservation Graph */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 shadow-xl">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Energy Conservation Breakdown (KE vs PE)
        </h4>
        <div ref={energyPlotRef} className="w-full h-[320px]" />
      </div>

    </div>
  );
}
