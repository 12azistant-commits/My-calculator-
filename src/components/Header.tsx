import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  FlaskConical, 
  LineChart, 
  RefreshCw, 
  Binary, 
  DollarSign, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  History, 
  Keyboard, 
  Atom,
  Palette,
  Download
} from 'lucide-react';
import { CalcMode, AppTheme } from '../types/calculator';

interface HeaderProps {
  currentMode: CalcMode;
  onModeChange: (mode: CalcMode) => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onToggleHistory: () => void;
  historyCount: number;
  onOpenShortcuts: () => void;
  onOpenConstants: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  soundMuted,
  onToggleSound,
  theme,
  onThemeChange,
  onToggleHistory,
  historyCount,
  onOpenShortcuts,
  onOpenConstants,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const navItems: { id: CalcMode; label: string; icon: React.ReactNode }[] = [
    { id: 'standard', label: 'Standard', icon: <Calculator className="w-4 h-4" /> },
    { id: 'scientific', label: 'Scientific', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'graphing', label: 'Graphing', icon: <LineChart className="w-4 h-4" /> },
    { id: 'converter', label: 'Converter', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'programmer', label: 'Programmer', icon: <Binary className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'ai-assistant', label: 'AI Solver', icon: <Sparkles className="w-4 h-4 text-cyan-400" /> },
  ];

  const themes: { id: AppTheme; label: string }[] = [
    { id: 'obsidian', label: 'Dark Obsidian' },
    { id: 'clinical', label: 'Light Clinical' },
    { id: 'cyberpunk', label: 'Cyber Matrix' },
    { id: 'slate', label: 'Slate Modern' },
  ];

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Brand title (Single text element) */}
      <div className="flex items-center gap-3">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onModeChange('standard'); }}
          className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-sm shadow-cyan-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <span>OmniCalc Pro</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links / Segmented Mode Controls */}
      <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800/60">
        {navItems.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions & Settings */}
      <div className="flex items-center gap-1.5">
        {/* PWA Install Button */}
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            title="Install App for Offline Use"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-semibold hover:bg-cyan-500/30 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* Physical Constants Modal Trigger */}
        <button
          onClick={onOpenConstants}
          title="Physical & Mathematical Constants"
          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 rounded-lg transition-colors"
        >
          <Atom className="w-4 h-4" />
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors hidden sm:block"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors"
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Theme Selector Dropdown */}
        <div className="relative group">
          <button
            title="Change Theme"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center gap-1"
          >
            <Palette className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  theme === t.id ? 'text-cyan-400 font-semibold bg-cyan-950/30' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* History Tape Drawer Button */}
        <button
          onClick={onToggleHistory}
          title="History Tape"
          className="relative p-2 text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 rounded-lg transition-all flex items-center gap-1.5 ml-1"
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold hidden sm:inline">Tape</span>
          {historyCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
