import React, { useState } from 'react';
import { processMatrixOperation } from '../services/mathEngine';
import { Grid, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function MatrixLab() {
  const [matrixSize, setMatrixSize] = useState(2); // 2x2 or 3x3
  const [matrixValues, setMatrixValues] = useState([
    [4, 7],
    [2, 6]
  ]);
  const [operation, setOperation] = useState('determinant');
  const [result, setResult] = useState(null);

  const handleSizeChange = (newSize) => {
    setMatrixSize(newSize);
    if (newSize === 2) {
      setMatrixValues([
        [4, 7],
        [2, 6]
      ]);
    } else {
      setMatrixValues([
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0]
      ]);
    }
    setResult(null);
  };

  const handleCellChange = (r, c, val) => {
    const num = parseFloat(val) || 0;
    const updated = matrixValues.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === r && cIdx === c ? num : cell))
    );
    setMatrixValues(updated);
  };

  const handleCompute = () => {
    const res = processMatrixOperation(matrixValues, operation);
    setResult(res);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Matrix Setup Panel */}
      <div className="glass-panel p-6 rounded-xl border border-indigo-500/30 space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 flex items-center gap-2">
              <Grid className="w-5 h-5 text-cyan-400" /> Linear Algebra Matrix Laboratory
            </h3>
            <p className="text-xs text-slate-400">Compute matrix determinants, inverses, transposes, and eigenvalues</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Dimension:</span>
            <button
              onClick={() => handleSizeChange(2)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                matrixSize === 2 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              2 × 2
            </button>
            <button
              onClick={() => handleSizeChange(3)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                matrixSize === 3 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              3 × 3
            </button>
          </div>
        </div>

        {/* Matrix Grid Input */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Matrix A</div>
          <div
            className="grid gap-2 p-3 bg-slate-950/80 rounded-xl border border-white/10 shadow-inner"
            style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))` }}
          >
            {matrixValues.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <input
                  key={`${rIdx}-${cIdx}`}
                  type="number"
                  value={cell}
                  onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                  className="w-16 h-14 text-center glass-input text-base font-mono font-bold text-cyan-300 focus:border-cyan-400"
                />
              ))
            )}
          </div>
        </div>

        {/* Operation Selector & Run Button */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 pt-2">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="glass-input text-xs font-mono py-2 px-4 rounded-xl font-bold"
          >
            <option value="determinant">Determinant det(A)</option>
            <option value="inverse">Inverse Matrix A⁻¹</option>
            <option value="transpose">Transpose Aᵀ</option>
            <option value="eigs">Eigenvalues λ</option>
          </select>

          <button
            onClick={handleCompute}
            className="btn-neon text-xs py-2 px-6 font-bold"
          >
            <RefreshCw className="w-4 h-4" /> Compute Matrix Result
          </button>
        </div>

      </div>

      {/* Matrix Result Card */}
      {result && (
        <div className="glass-panel p-6 rounded-xl border border-cyan-500/30 text-center space-y-3">
          {result.error ? (
            <div className="flex items-center justify-center gap-2 text-pink-400 font-medium text-sm">
              <AlertTriangle className="w-5 h-5" /> {result.error}
            </div>
          ) : (
            <div>
              <span className="badge-cyan text-xs mb-2 inline-block">Operation Output</span>
              <p className="text-sm font-semibold text-slate-200 mb-3">{result.explanation}</p>
              
              {/* If result is scalar number */}
              {typeof result.result === 'number' && (
                <div className="text-2xl font-mono font-extrabold text-cyan-300">
                  {result.result}
                </div>
              )}

              {/* If result is 2D matrix array */}
              {Array.isArray(result.result) && (
                <div className="inline-block p-4 bg-slate-900/90 rounded-xl border border-white/10 font-mono text-sm text-cyan-300">
                  {JSON.stringify(result.result, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
