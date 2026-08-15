import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Sun, Moon, Check, X } from 'lucide-react';

export default function ThemeSelectorModal({ onClose }) {
  const { themeId, setThemeId, THEMES } = useTheme();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="p-6 rounded-2xl border border-indigo-500/30 max-w-lg w-full space-y-6 shadow-2xl bg-slate-900 text-slate-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Color Themes & Mode Options</h2>
              <p className="text-xs text-slate-400">Switch between Light mode, Dark mode, and vibrant color themes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme List */}
        <div className="space-y-3">
          {Object.entries(THEMES).map(([id, theme]) => {
            const isSelected = themeId === id;
            return (
              <div
                key={id}
                onClick={() => setThemeId(id)}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-600/20 shadow-lg'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-md flex items-center justify-center"
                    style={{ backgroundColor: theme.bg }}
                  >
                    {theme.mode === 'light' ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Moon className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{theme.name}</h4>
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">
                      {theme.mode} Mode
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
