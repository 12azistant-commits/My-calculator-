import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CalcMode, HistoryItem, AngleUnit, AppTheme, PhysicalConstant } from './types/calculator';
import { evaluateMathExpression, toFraction } from './utils/mathEvaluator';
import { sound } from './utils/sound';

import { Header } from './components/Header';
import { Display } from './components/Display';
import { HistoryTape } from './components/HistoryTape';
import { StandardCalc } from './components/modes/StandardCalc';
import { ScientificCalc } from './components/modes/ScientificCalc';
import { GraphingCalc } from './components/modes/GraphingCalc';
import { UnitConverter } from './components/modes/UnitConverter';
import { ProgrammerCalc } from './components/modes/ProgrammerCalc';
import { FinancialCalc } from './components/modes/FinancialCalc';
import { AIAssistant } from './components/modes/AIAssistant';
import { ConstantsModal } from './components/ConstantsModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

export default function App() {
  const [mode, setMode] = useState<CalcMode>('standard');
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);
  const [fractionResult, setFractionResult] = useState<string | null>(null);

  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [memoryValue, setMemoryValue] = useState<number | null>(0);

  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [theme, setTheme] = useState<AppTheme>('obsidian');

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('omnicalc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isConstantsOpen, setIsConstantsOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem('omnicalc_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Live evaluation on expression change
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setResult('0');
      setError(null);
      setFractionResult(null);
      return;
    }

    const { result: evalNum, formatted, error: evalErr } = evaluateMathExpression(expression, angleUnit);
    if (evalErr) {
      // Don't mark incomplete expressions as hard error while user is typing
      setFractionResult(null);
    } else if (evalNum !== null) {
      setResult(formatted);
      setError(null);
      const frac = toFraction(evalNum);
      setFractionResult(frac);
    }
  }, [expression, angleUnit]);

  // Execute Calculation (=)
  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    const { result: evalNum, formatted, error: evalErr } = evaluateMathExpression(expression, angleUnit);

    if (evalErr) {
      setError(evalErr);
      sound.playClick('error');
    } else if (evalNum !== null) {
      setResult(formatted);
      setError(null);
      sound.playClick('equals');

      // Add to History Tape
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: formatted,
        timestamp: Date.now(),
        mode,
      };

      setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50
    }
  }, [expression, angleUnit, mode]);

  // Keypad Handlers
  const handleAppendToken = useCallback((token: string) => {
    setExpression((prev) => prev + token);
  }, []);

  const handleClear = useCallback(() => {
    sound.playClick('clear');
    setExpression('');
    setResult('0');
    setError(null);
    setFractionResult(null);
  }, []);

  const handleClearEntry = useCallback(() => {
    sound.playClick('clear');
    setExpression('');
  }, []);

  const handleBackspace = useCallback(() => {
    sound.playClick('clear');
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const handleToggleSign = useCallback(() => {
    if (!expression) return;
    if (expression.startsWith('-')) {
      setExpression(expression.slice(1));
    } else {
      setExpression('-' + expression);
    }
  }, [expression]);

  const handlePercent = useCallback(() => {
    setExpression((prev) => prev + '%');
  }, []);

  const handleReciprocal = useCallback(() => {
    if (result && result !== '0') {
      setExpression(`1/(${result})`);
    } else {
      setExpression((prev) => `1/(${prev})`);
    }
  }, [result]);

  const handleSquare = useCallback(() => {
    setExpression((prev) => `(${prev || result})^2`);
  }, [result]);

  const handleSquareRoot = useCallback(() => {
    setExpression((prev) => `sqrt(${prev || result})`);
  }, [result]);

  // Memory Operations
  const handleMemoryOperation = useCallback(
    (op: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
      const currentNum = parseFloat(result) || 0;
      switch (op) {
        case 'MC':
          setMemoryValue(0);
          break;
        case 'MR':
          if (memoryValue !== null) {
            setExpression((prev) => prev + memoryValue.toString());
          }
          break;
        case 'M+':
          setMemoryValue((prev) => (prev || 0) + currentNum);
          break;
        case 'M-':
          setMemoryValue((prev) => (prev || 0) - currentNum);
          break;
        case 'MS':
          setMemoryValue(currentNum);
          break;
      }
    },
    [result, memoryValue]
  );

  // Global Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is inside a text input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const key = e.key;

      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(key)) {
        e.preventDefault();
        sound.playClick('number');
        handleAppendToken(key);
      } else if (key === '+') {
        e.preventDefault();
        sound.playClick('operator');
        handleAppendToken('+');
      } else if (key === '-') {
        e.preventDefault();
        sound.playClick('operator');
        handleAppendToken('−');
      } else if (key === '*') {
        e.preventDefault();
        sound.playClick('operator');
        handleAppendToken('×');
      } else if (key === '/') {
        e.preventDefault();
        sound.playClick('operator');
        handleAppendToken('÷');
      } else if (key === '^') {
        e.preventDefault();
        sound.playClick('operator');
        handleAppendToken('^');
      } else if (key === '(' || key === ')') {
        e.preventDefault();
        sound.playClick('operator');
        handleAppendToken(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (key.toLowerCase() === 's') {
        e.preventDefault();
        handleAppendToken('sin(');
      } else if (key.toLowerCase() === 'c' && e.ctrlKey === false) {
        e.preventDefault();
        handleAppendToken('cos(');
      } else if (key.toLowerCase() === 't') {
        e.preventDefault();
        handleAppendToken('tan(');
      } else if (key.toLowerCase() === 'p') {
        e.preventDefault();
        handleAppendToken('π');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAppendToken, handleEquals, handleBackspace, handleClear]);

  // Insert Constant from Modal
  const handleInsertConstant = (constant: PhysicalConstant) => {
    setExpression((prev) => prev + constant.value.toString());
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans theme-${theme}`}>
      {/* Top Navigation Header */}
      <Header
        currentMode={mode}
        onModeChange={(m) => setMode(m)}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        theme={theme}
        onThemeChange={(t) => setTheme(t)}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={history.length}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenConstants={() => setIsConstantsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        {/* Mobile Mode Switcher Tabs */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto scrollbar-none pb-2 mb-3">
          {(
            [
              { id: 'standard', label: 'Standard' },
              { id: 'scientific', label: 'Scientific' },
              { id: 'graphing', label: 'Graphing' },
              { id: 'converter', label: 'Converter' },
              { id: 'programmer', label: 'Programmer' },
              { id: 'financial', label: 'Financial' },
              { id: 'ai-assistant', label: 'AI Solver' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                mode === item.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Display Panel (For Standard & Scientific Modes) */}
        {(mode === 'standard' || mode === 'scientific') && (
          <Display
            expression={expression}
            result={result}
            angleUnit={angleUnit}
            onAngleUnitToggle={() =>
              setAngleUnit((prev) => (prev === 'DEG' ? 'RAD' : prev === 'RAD' ? 'GRAD' : 'DEG'))
            }
            memoryValue={memoryValue}
            mode={mode}
            fractionResult={fractionResult}
            error={error}
            onBackspace={handleBackspace}
            onClear={handleClear}
          />
        )}

        {/* Active Mode Calculator View */}
        {mode === 'standard' && (
          <StandardCalc
            onAppendToken={handleAppendToken}
            onClear={handleClear}
            onClearEntry={handleClearEntry}
            onBackspace={handleBackspace}
            onEquals={handleEquals}
            onToggleSign={handleToggleSign}
            onMemoryOperation={handleMemoryOperation}
            onPercent={handlePercent}
            onReciprocal={handleReciprocal}
            onSquare={handleSquare}
            onSquareRoot={handleSquareRoot}
          />
        )}

        {mode === 'scientific' && (
          <ScientificCalc
            onAppendToken={handleAppendToken}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onEquals={handleEquals}
            angleUnit={angleUnit}
            onToggleAngleUnit={() =>
              setAngleUnit((prev) => (prev === 'DEG' ? 'RAD' : prev === 'RAD' ? 'GRAD' : 'DEG'))
            }
            onMemoryOperation={handleMemoryOperation}
          />
        )}

        {mode === 'graphing' && <GraphingCalc />}

        {mode === 'converter' && <UnitConverter />}

        {mode === 'programmer' && <ProgrammerCalc />}

        {mode === 'financial' && <FinancialCalc />}

        {mode === 'ai-assistant' && (
          <AIAssistant
            onSendToDisplay={(res) => {
              setExpression(res);
              setMode('standard');
            }}
            onSendToTape={(expr, res) => {
              const newItem: HistoryItem = {
                id: Date.now().toString(),
                expression: expr,
                result: res,
                timestamp: Date.now(),
                mode: 'ai-assistant',
              };
              setHistory((prev) => [newItem, ...prev]);
              setIsHistoryOpen(true);
            }}
          />
        )}
      </main>

      {/* History Tape Drawer */}
      <HistoryTape
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(val) => {
          setExpression((prev) => prev + val);
          setIsHistoryOpen(false);
        }}
        onSelectExpression={(expr) => {
          setExpression(expr);
          setIsHistoryOpen(false);
        }}
        onClearHistory={() => setHistory([])}
        onTogglePin={(id) => {
          setHistory((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
          );
        }}
      />

      {/* Helper Modals */}
      <ConstantsModal
        isOpen={isConstantsOpen}
        onClose={() => setIsConstantsOpen(false)}
        onInsertConstant={handleInsertConstant}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <Analytics />
    </div>
  );
}
