import React, { useState } from 'react';
import { AngleUnit, CalcMode } from '../types/calculator';
import { Copy, Check, Delete, Sparkles, Hash } from 'lucide-react';

interface DisplayProps {
  expression: string;
  result: string;
  angleUnit?: AngleUnit;
  onAngleUnitToggle?: () => void;
  memoryValue?: number | null;
  mode: CalcMode;
  fractionResult?: string | null;
  error?: string | null;
  onBackspace?: () => void;
  onClear?: () => void;
  onUseResultInNext?: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  angleUnit = 'DEG',
  onAngleUnitToggle,
  memoryValue,
  mode,
  fractionResult,
  error,
  onBackspace,
  onClear,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result && result !== '0' && result !== 'Error' ? result : expression;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative bg-slate-950/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[140px] md:min-h-[160px]">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Top Status & Indicator Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 z-10">
        <div className="flex items-center gap-2">
          {/* Angle Unit Toggle */}
          {onAngleUnitToggle && (
            <button
              onClick={onAngleUnitToggle}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-400 font-bold transition-colors"
              title="Toggle Angle Unit (DEG/RAD/GRAD)"
            >
              {angleUnit}
            </button>
          )}

          {/* Memory Status Indicator */}
          {memoryValue !== undefined && memoryValue !== null && memoryValue !== 0 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px]">
              M = {memoryValue}
            </span>
          )}

          {/* Mode Badge */}
          <span className="text-[11px] text-slate-500 font-sans tracking-wide capitalize hidden sm:inline">
            {mode} Mode
          </span>
        </div>

        {/* Display Control Buttons */}
        <div className="flex items-center gap-1">
          {fractionResult && (
            <span className="text-cyan-300 font-mono text-xs bg-cyan-950/40 border border-cyan-800/50 px-2 py-0.5 rounded">
              ≈ {fractionResult}
            </span>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy Result"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Backspace Button */}
          {onBackspace && (
            <button
              onClick={onBackspace}
              title="Backspace"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <Delete className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Expression & Live Result Section */}
      <div className="flex flex-col items-end justify-end w-full space-y-1 z-10 overflow-x-auto scrollbar-none py-1">
        {/* Expression Line */}
        <div className="text-sm md:text-base font-mono text-slate-400 tracking-wider whitespace-nowrap min-h-[24px] overflow-x-auto max-w-full text-right">
          {expression || ' '}
        </div>

        {/* Big Main Result / Input Number Line */}
        <div 
          className={`font-mono font-bold tracking-tight text-right transition-all max-w-full overflow-x-auto scrollbar-none whitespace-nowrap ${
            error 
              ? 'text-rose-400 text-2xl md:text-3xl' 
              : result.length > 12 
                ? 'text-2xl md:text-3xl text-slate-100' 
                : 'text-3xl md:text-4xl lg:text-5xl text-slate-50'
          }`}
        >
          {error || result || '0'}
        </div>
      </div>
    </div>
  );
};
