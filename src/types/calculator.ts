export type CalcMode = 
  | 'standard' 
  | 'scientific' 
  | 'graphing' 
  | 'converter' 
  | 'programmer' 
  | 'financial' 
  | 'ai-assistant';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: CalcMode;
  note?: string;
  isPinned?: boolean;
}

export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

export type WordSize = '64' | '32' | '16' | '8';

export type NumberBase = 'HEX' | 'DEC' | 'OCT' | 'BIN';

export type UnitCategory = 
  | 'length' 
  | 'mass' 
  | 'temperature' 
  | 'volume' 
  | 'speed' 
  | 'area' 
  | 'data' 
  | 'time'
  | 'currency';

export type FinancialMode = 'compound' | 'loan' | 'tip' | 'margin';

export type AppTheme = 'obsidian' | 'clinical' | 'cyberpunk' | 'slate';

export interface PhysicalConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  category: string;
}

export interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  error?: string;
}

export interface StepByStepSolution {
  title: string;
  overview: string;
  steps: {
    stepNumber: number;
    explanation: string;
    expression: string;
    result?: string;
  }[];
  finalAnswer: string;
  relatedConcepts?: string[];
}
