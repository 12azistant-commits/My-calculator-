import React, { useState } from 'react';
import { NumberBase, WordSize } from '../../types/calculator';
import { sound } from '../../utils/sound';
import { Binary, RotateCcw } from 'lucide-react';

export const ProgrammerCalc: React.FC = () => {
  const [val, setVal] = useState<bigint>(BigInt(42));
  const [activeBase, setActiveBase] = useState<NumberBase>('DEC');
  const [wordSize, setWordSize] = useState<WordSize>('64');
  const [inputStr, setInputStr] = useState<string>('42');

  // Mask value based on word size
  const getMask = (ws: WordSize): bigint => {
    switch (ws) {
      case '8': return BigInt(0xFF);
      case '16': return BigInt(0xFFFF);
      case '32': return BigInt(0xFFFFFFFF);
      case '64': return (BigInt(1) << BigInt(64)) - BigInt(1);
    }
  };

  const currentMask = getMask(wordSize);
  const maskedVal = val & currentMask;

  // Format to strings
  const hexStr = maskedVal.toString(16).toUpperCase();
  const decStr = maskedVal.toString(10);
  const octStr = maskedVal.toString(8);
  const binStr = maskedVal.toString(2).padStart(parseInt(wordSize), '0');

  // Handle bit toggle in grid
  const handleToggleBit = (bitIndex: number) => {
    sound.playClick('toggle');
    const bitMask = BigInt(1) << BigInt(bitIndex);
    const newVal = maskedVal ^ bitMask;
    setVal(newVal);
    updateInputForBase(newVal, activeBase);
  };

  const updateInputForBase = (v: bigint, base: NumberBase) => {
    switch (base) {
      case 'HEX': setInputStr(v.toString(16).toUpperCase()); break;
      case 'DEC': setInputStr(v.toString(10)); break;
      case 'OCT': setInputStr(v.toString(8)); break;
      case 'BIN': setInputStr(v.toString(2)); break;
    }
  };

  const handleBaseChange = (newBase: NumberBase) => {
    sound.playClick('toggle');
    setActiveBase(newBase);
    updateInputForBase(maskedVal, newBase);
  };

  const handleInputDigit = (digit: string) => {
    sound.playClick('number');
    let newStr = inputStr === '0' ? digit : inputStr + digit;
    try {
      let radix = 10;
      if (activeBase === 'HEX') radix = 16;
      if (activeBase === 'OCT') radix = 8;
      if (activeBase === 'BIN') radix = 2;

      // Parse BigInt from string
      const parsed = BigInt(parseInt(newStr, radix));
      setVal(parsed);
      setInputStr(newStr);
    } catch {
      // Ignore invalid character
    }
  };

  const handleClear = () => {
    sound.playClick('clear');
    setVal(BigInt(0));
    setInputStr('0');
  };

  const handleBackspace = () => {
    sound.playClick('clear');
    if (inputStr.length <= 1) {
      setVal(BigInt(0));
      setInputStr('0');
      return;
    }
    const sliced = inputStr.slice(0, -1);
    setInputStr(sliced);
    let radix = 10;
    if (activeBase === 'HEX') radix = 16;
    if (activeBase === 'OCT') radix = 8;
    if (activeBase === 'BIN') radix = 2;
    try {
      setVal(BigInt(parseInt(sliced, radix)));
    } catch {
      setVal(BigInt(0));
    }
  };

  // Bitwise operators
  const handleBitwise = (op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'SHL' | 'SHR') => {
    sound.playClick('operator');
    let res = maskedVal;
    if (op === 'NOT') {
      res = (~maskedVal) & currentMask;
    } else if (op === 'SHL') {
      res = (maskedVal << BigInt(1)) & currentMask;
    } else if (op === 'SHR') {
      res = (maskedVal >> BigInt(1)) & currentMask;
    }
    setVal(res);
    updateInputForBase(res, activeBase);
  };

  // Key enablement mask
  const isKeyDisabled = (key: string): boolean => {
    if (activeBase === 'BIN') return !['0', '1'].includes(key);
    if (activeBase === 'OCT') return !['0', '1', '2', '3', '4', '5', '6', '7'].includes(key);
    if (activeBase === 'DEC') return ['A', 'B', 'C', 'D', 'E', 'F'].includes(key);
    return false; // HEX enables all
  };

  return (
    <div className="flex flex-col gap-4 mt-3">
      {/* Top Word Size Selector */}
      <div className="flex items-center justify-between bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-xs font-mono">
        <span className="text-slate-400 font-semibold">Word Size:</span>
        <div className="flex items-center gap-1">
          {(['64', '32', '16', '8'] as const).map((ws) => (
            <button
              key={ws}
              onClick={() => {
                sound.playClick('toggle');
                setWordSize(ws);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                wordSize === ws
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {ws}-Bit
            </button>
          ))}
        </div>
      </div>

      {/* Simultaneous Multi-Base Displays */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 font-mono text-xs">
        {[
          { base: 'HEX' as NumberBase, value: hexStr, label: 'HEX' },
          { base: 'DEC' as NumberBase, value: decStr, label: 'DEC' },
          { base: 'OCT' as NumberBase, value: octStr, label: 'OCT' },
          { base: 'BIN' as NumberBase, value: binStr, label: 'BIN' },
        ].map(({ base, value, label }) => {
          const isActive = activeBase === base;
          return (
            <div
              key={base}
              onClick={() => handleBaseChange(base)}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-md'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className={`font-bold uppercase tracking-wider text-[11px] ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                {label}
              </span>
              <span className="font-bold tracking-widest text-sm truncate max-w-[280px] sm:max-w-md text-right">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Bit Toggle Grid (64-Bit / 32-Bit) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="font-bold flex items-center gap-1">
            <Binary className="w-3.5 h-3.5 text-cyan-400" /> Interactive Bit Grid
          </span>
          <span>Click any bit to flip 0 ↔ 1</span>
        </div>

        {/* Render Bits Grid */}
        <div className="grid grid-cols-8 gap-1 font-mono text-[10px]">
          {Array.from({ length: parseInt(wordSize) }).map((_, idx) => {
            const bitIndex = parseInt(wordSize) - 1 - idx;
            const isSet = ((maskedVal >> BigInt(bitIndex)) & BigInt(1)) === BigInt(1);
            return (
              <button
                key={bitIndex}
                onClick={() => handleToggleBit(bitIndex)}
                className={`py-1.5 rounded flex flex-col items-center justify-center border transition-all ${
                  isSet
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>{isSet ? '1' : '0'}</span>
                <span className="text-[8px] opacity-60">{bitIndex}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bitwise & Hex Keypad */}
      <div className="grid grid-cols-6 gap-1.5 font-mono">
        {/* Bitwise operators */}
        {['NOT', 'SHL', 'SHR'].map((op) => (
          <button
            key={op}
            onClick={() => handleBitwise(op as 'NOT' | 'SHL' | 'SHR')}
            className="py-2.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800"
          >
            {op}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="col-span-2 py-2.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800"
        >
          CLEAR
        </button>
        <button
          onClick={handleBackspace}
          className="py-2.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800"
        >
          ⌫
        </button>

        {/* HEX & Digits Grid */}
        {['A', 'B', 'C', '7', '8', '9', 'D', 'E', 'F', '4', '5', '6', '0', '1', '2', '3'].map((key) => {
          const disabled = isKeyDisabled(key);
          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => handleInputDigit(key)}
              className={`py-3 text-sm font-bold rounded-xl border transition-all ${
                disabled
                  ? 'bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed opacity-30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border-slate-700/60 active:scale-95'
              }`}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
};
