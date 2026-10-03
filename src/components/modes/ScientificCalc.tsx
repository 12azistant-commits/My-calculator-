import React, { useState } from 'react';
import { AngleUnit } from '../../types/calculator';
import { sound } from '../../utils/sound';

interface ScientificCalcProps {
  onAppendToken: (token: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  angleUnit: AngleUnit;
  onToggleAngleUnit: () => void;
  onMemoryOperation: (op: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
}

export const ScientificCalc: React.FC<ScientificCalcProps> = ({
  onAppendToken,
  onClear,
  onBackspace,
  onEquals,
  angleUnit,
  onToggleAngleUnit,
  onMemoryOperation,
}) => {
  const [isShift, setIsShift] = useState(false);
  const [isHyp, setIsHyp] = useState(false);

  const handleKey = (action: () => void, type: 'number' | 'operator' | 'clear' | 'equals' = 'number') => {
    sound.playClick(type);
    action();
  };

  const handleTrig = (funcName: string) => {
    let fn = funcName;
    if (isShift) {
      fn = `a${funcName}`;
    }
    if (isHyp) {
      fn = `${fn}h`;
    }
    onAppendToken(`${fn}(`);
  };

  return (
    <div className="flex flex-col gap-2 mt-3">
      {/* Top Toggle Controls */}
      <div className="flex items-center justify-between gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playClick('toggle');
              setIsShift(!isShift);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              isShift ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            2nd
          </button>
          <button
            onClick={() => {
              sound.playClick('toggle');
              setIsHyp(!isHyp);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              isHyp ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            hyp
          </button>
          <button
            onClick={() => {
              sound.playClick('toggle');
              onToggleAngleUnit();
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-400 font-bold border border-slate-700 hover:border-cyan-500/50"
          >
            {angleUnit}
          </button>
        </div>

        {/* Memory Keys */}
        <div className="flex items-center gap-1">
          {(['MC', 'MR', 'M+'] as const).map((mOp) => (
            <button
              key={mOp}
              onClick={() => handleKey(() => onMemoryOperation(mOp), 'operator')}
              className="px-2 py-1 text-[11px] font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {mOp}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scientific Grid */}
      <div className="grid grid-cols-5 gap-1.5 md:gap-2">
        {/* Row 1 */}
        <button
          onClick={() => handleTrig('sin')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all active:scale-95"
        >
          {isShift ? 'sin⁻¹' : isHyp ? 'sinh' : 'sin'}
        </button>
        <button
          onClick={() => handleTrig('cos')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all active:scale-95"
        >
          {isShift ? 'cos⁻¹' : isHyp ? 'cosh' : 'cos'}
        </button>
        <button
          onClick={() => handleTrig('tan')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all active:scale-95"
        >
          {isShift ? 'tan⁻¹' : isHyp ? 'tanh' : 'tan'}
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('^'), 'operator')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          xʸ
        </button>
        <button
          onClick={() => handleKey(onClear, 'clear')}
          className="py-2.5 text-xs font-mono font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 transition-all active:scale-95"
        >
          C
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleKey(() => onAppendToken('ln('), 'operator')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          {isShift ? 'eˣ' : 'ln'}
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('log('), 'operator')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          {isShift ? '10ˣ' : 'log'}
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('sqrt('), 'operator')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          {isShift ? 'cbrt(' : '√'}
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('!'), 'operator')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          n!
        </button>
        <button
          onClick={() => handleKey(onBackspace, 'clear')}
          className="py-2.5 text-xs font-mono font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-800 transition-all active:scale-95"
        >
          ⌫
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleKey(() => onAppendToken('('), 'operator')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          (
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken(')'), 'operator')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          )
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('π'), 'number')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all active:scale-95"
        >
          π
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('E'), 'number')}
          className="py-2.5 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all active:scale-95"
        >
          e
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('÷'), 'operator')}
          className="py-2.5 text-sm font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          ÷
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleKey(() => onAppendToken('7'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          7
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('8'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          8
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('9'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          9
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('abs('), 'operator')}
          className="py-3 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          |x|
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('×'), 'operator')}
          className="py-3 text-sm font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          ×
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleKey(() => onAppendToken('4'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          4
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('5'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          5
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('6'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          6
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('%'), 'operator')}
          className="py-3 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          %
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('−'), 'operator')}
          className="py-3 text-sm font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          −
        </button>

        {/* Row 6 */}
        <button
          onClick={() => handleKey(() => onAppendToken('1'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          1
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('2'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          2
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('3'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          3
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('1/'), 'operator')}
          className="py-3 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          1/x
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('+'), 'operator')}
          className="py-3 text-sm font-mono font-bold rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 transition-all active:scale-95"
        >
          +
        </button>

        {/* Row 7 */}
        <button
          onClick={() => handleKey(() => onAppendToken('0'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          0
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken('.'), 'number')}
          className="py-3 text-base font-mono font-bold rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700/40 transition-all active:scale-95"
        >
          .
        </button>
        <button
          onClick={() => handleKey(() => onAppendToken(' * 10^('), 'operator')}
          className="py-3 text-xs font-mono font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all active:scale-95"
        >
          EXP
        </button>
        <button
          onClick={() => handleKey(onEquals, 'equals')}
          className="col-span-2 py-3 text-lg font-mono font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border border-cyan-400/30 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
        >
          =
        </button>
      </div>
    </div>
  );
};
