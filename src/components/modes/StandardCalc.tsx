import React from 'react';
import { sound } from '../../utils/sound';

interface StandardCalcProps {
  onAppendToken: (token: string) => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onToggleSign: () => void;
  onMemoryOperation: (op: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
  onPercent: () => void;
  onReciprocal: () => void;
  onSquare: () => void;
  onSquareRoot: () => void;
}

export const StandardCalc: React.FC<StandardCalcProps> = ({
  onAppendToken,
  onClear,
  onClearEntry,
  onBackspace,
  onEquals,
  onToggleSign,
  onMemoryOperation,
  onPercent,
  onReciprocal,
  onSquare,
  onSquareRoot,
}) => {
  const handleKey = (action: () => void, type: 'number' | 'operator' | 'clear' | 'equals' = 'number') => {
    sound.playClick(type);
    action();
  };

  return (
    <div className="flex flex-col gap-2 mt-3">
      {/* Memory Row */}
      <div className="grid grid-cols-5 gap-1.5 mb-1">
        {(['MC', 'MR', 'M+', 'M-', 'MS'] as const).map((mOp) => (
          <button
            key={mOp}
            onClick={() => handleKey(() => onMemoryOperation(mOp), 'operator')}
            className="py-1.5 text-xs font-mono font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all hover:text-cyan-300 active:scale-95"
          >
            {mOp}
          </button>
        ))}
      </div>

      {/* Main Standard Keypad Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button
          onClick={() => handleKey(onPercent, 'operator')}
          className="py-3 text-sm font-mono font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 transition-all active:scale-95"
        >
          %
        </button>
        <button
          onClick={() => handleKey(onClearEntry, 'clear')}
          className="py-3 text-sm font-mono font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-slate-800/80 transition-all active:scale-95"
        >
          CE
        </button>
        <button
          onClick={() => handleKey(onClear, 'clear')}
          className="py-3 text-sm font-mono font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-rose-400 border border-slate-800/80 transition-all active:scale-95"
        >
          C
        </button>
        <button
          onClick={() => handleKey(onBackspace, 'clear')}
          className="py-3 text-sm font-mono font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-rose-300 border border-slate-800/80 transition-all active:scale-95"
        >
          ⌫
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleKey(onReciprocal, 'operator')}
          className="py-3 text-sm font-mono font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 transition-all active:scale-95"
        >
          ¹/x
        </button>
        <button
          onClick={() => handleKey(onSquare, 'operator')}
          className="py-3 text-sm font-mono font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 transition-all active:scale-95"
        >
          x²
        </button>
        <button
          onClick={() => handleKey(onSquareRoot, 'operator')}
          className="py-3 text-sm font-mono font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 transition-all active:scale-95"
        >
          ²√x
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('÷'), 'operator')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          ÷
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleKey(() => onAppendToken('7'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          7
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('8'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          8
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('9'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          9
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('×'), 'operator')}
          className="py-3.5 text-base font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          ×
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleKey(() => onAppendToken('4'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          4
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('5'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          5
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('6'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          6
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('−'), 'operator')}
          className="py-3.5 text-base font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          −
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleKey(() => onAppendToken('1'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          1
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('2'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          2
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('3'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          3
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('+'), 'operator')}
          className="py-3.5 text-base font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          +
        </button>

        {/* Row 6 */}
        <button
          onClick={() => handleKey(onToggleSign, 'operator')}
          className="py-3.5 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          ±
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('0'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          0
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('.'), 'number')}
          className="py-3.5 text-lg font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95 shadow-sm"
        >
          .
        </button>
        <button
          onClick={() => handleKey(onEquals, 'equals')}
          className="py-3.5 text-xl font-mono font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border border-cyan-400/30 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
        >
          =
        </button>
      </div>
    </div>
  );
};
