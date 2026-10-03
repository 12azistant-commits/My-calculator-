import React, { useState } from 'react';
import { PHYSICAL_CONSTANTS } from '../utils/constants';
import { PhysicalConstant } from '../types/calculator';
import { X, Search, Atom, Plus } from 'lucide-react';

interface ConstantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertConstant: (constant: PhysicalConstant) => void;
}

export const ConstantsModal: React.FC<ConstantsModalProps> = ({
  isOpen,
  onClose,
  onInsertConstant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Mathematical', 'Physics', 'Chemistry'];

  const filtered = PHYSICAL_CONSTANTS.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Physical & Mathematical Constants</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/50 space-y-2">
          <input
            type="text"
            placeholder="Search constants (e.g. Speed of Light, Planck, Pi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Constants List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((c) => (
            <div
              key={c.symbol}
              className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3 flex items-center justify-between transition-all"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-300 text-sm bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                    {c.symbol}
                  </span>
                  <span className="font-semibold text-slate-200 text-xs">{c.name}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {c.value.toExponential(5)} {c.unit}
                </div>
              </div>

              <button
                onClick={() => {
                  onInsertConstant(c);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Insert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
