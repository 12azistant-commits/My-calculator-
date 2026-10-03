import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Input numbers' },
    { key: '+ - * /', desc: 'Basic arithmetic operators' },
    { key: 'Enter or =', desc: 'Calculate result' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Escape or c', desc: 'Clear calculation' },
    { key: 's / c / t', desc: 'Sine / Cosine / Tangent' },
    { key: 'p', desc: 'Insert Pi (π)' },
    { key: 'e', desc: 'Insert Euler\'s constant (e)' },
    { key: '^', desc: 'Exponent / Power (xʸ)' },
    { key: '( and )', desc: 'Parentheses for grouped math' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs">
              <span className="font-mono font-bold text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {s.key}
              </span>
              <span className="text-slate-300">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
