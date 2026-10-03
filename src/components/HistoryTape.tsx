import React, { useState } from 'react';
import { HistoryItem } from '../types/calculator';
import { X, Search, Trash2, Pin, PinOff, Download, ArrowRight, CornerDownLeft } from 'lucide-react';

interface HistoryTapeProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectResult: (val: string) => void;
  onSelectExpression: (expr: string) => void;
  onClearHistory: () => void;
  onTogglePin: (id: string) => void;
}

export const HistoryTape: React.FC<HistoryTapeProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onSelectExpression,
  onClearHistory,
  onTogglePin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter(
    (item) =>
      item.expression.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedItems = filtered.filter((i) => i.isPinned);
  const unpinnedItems = filtered.filter((i) => !i.isPinned);

  const exportCSV = () => {
    if (history.length === 0) return;
    const header = 'Timestamp,Mode,Expression,Result\n';
    const rows = history
      .map(
        (i) =>
          `"${new Date(i.timestamp).toLocaleString()}","${i.mode}","${i.expression.replace(/"/g, '""')}","${i.result.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniCalc_History_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Calculation Tape History
            </h2>
            <p className="text-xs text-slate-400">Click any equation or result to reuse it</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/50 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={exportCSV}
            title="Export CSV"
            disabled={history.length === 0}
            className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClearHistory}
            title="Clear History"
            disabled={history.length === 0}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {searchTerm ? 'No matching calculations found.' : 'Your calculation tape is empty.'}
            </div>
          ) : (
            <>
              {/* Pinned Section */}
              {pinnedItems.length > 0 && (
                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned Calculations
                  </div>
                  {pinnedItems.map((item) => (
                    <HistoryCard
                      key={item.id}
                      item={item}
                      onSelectResult={onSelectResult}
                      onSelectExpression={onSelectExpression}
                      onTogglePin={onTogglePin}
                    />
                  ))}
                </div>
              )}

              {/* Unpinned Section */}
              {unpinnedItems.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onSelectResult={onSelectResult}
                  onSelectExpression={onSelectExpression}
                  onTogglePin={onTogglePin}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface HistoryCardProps {
  item: HistoryItem;
  onSelectResult: (val: string) => void;
  onSelectExpression: (expr: string) => void;
  onTogglePin: (id: string) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  onSelectResult,
  onSelectExpression,
  onTogglePin,
}) => {
  return (
    <div className="group relative bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/30 rounded-xl p-3 transition-all">
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
        <span className="capitalize">{item.mode} Mode</span>
        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Expression */}
      <button
        onClick={() => onSelectExpression(item.expression)}
        className="w-full text-right text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors truncate block"
        title="Click to insert expression"
      >
        {item.expression}
      </button>

      {/* Result */}
      <div className="flex items-center justify-between mt-1">
        <button
          onClick={() => onTogglePin(item.id)}
          title={item.isPinned ? 'Unpin' : 'Pin'}
          className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
            item.isPinned ? 'opacity-100 text-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {item.isPinned ? <Pin className="w-3.5 h-3.5 fill-amber-400/20" /> : <Pin className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => onSelectResult(item.result)}
          className="text-right text-base font-mono font-bold text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1 ml-auto"
          title="Click to insert result into calculation"
        >
          <span>= {item.result}</span>
          <CornerDownLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
        </button>
      </div>
    </div>
  );
};
