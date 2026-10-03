import { AngleUnit } from '../types/calculator';

/**
 * High-precision math evaluator and expression parser
 */

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid factorial operand');
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Overflow limit for JS numbers
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Convert angle based on unit
function toRadians(val: number, angleUnit: AngleUnit): number {
  if (angleUnit === 'DEG') return (val * Math.PI) / 180;
  if (angleUnit === 'GRAD') return (val * Math.PI) / 200;
  return val; // RAD
}

function fromRadians(val: number, angleUnit: AngleUnit): number {
  if (angleUnit === 'DEG') return (val * 180) / Math.PI;
  if (angleUnit === 'GRAD') return (val * 200) / Math.PI;
  return val; // RAD
}

export function evaluateMathExpression(
  expr: string,
  angleUnit: AngleUnit = 'DEG',
  customVars: Record<string, number> = {}
): { result: number | null; formatted: string; error: string | null } {
  if (!expr || expr.trim() === '') {
    return { result: 0, formatted: '0', error: null };
  }

  try {
    let clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, ' Math.PI ')
      .replace(/ϕ/g, ` ${(1 + Math.sqrt(5)) / 2} `)
      .replace(/%\b/g, '*0.01')
      .replace(/%/g, '*0.01');

    // Replace custom vars if passed
    for (const [key, val] of Object.entries(customVars)) {
      const reg = new RegExp(`\\b${key}\\b`, 'g');
      clean = clean.replace(reg, `(${val})`);
    }

    // Replace Implicit Multiplication e.g. 2Math.PI or 3(4) or (2)(3)
    clean = clean.replace(/(\d)(\s*Math\.PI|\s*Math\.E|\s*\(|\s*[a-zA-Z])/g, '$1*$2');
    clean = clean.replace(/(\))(\s*[\d\(a-zA-Z])/g, '$1*$2');

    // Handle factorial e.g. 5! -> factorial(5)
    clean = clean.replace(/(\d+(\.\d+)?|\([^\(\)]+\))!/g, (_, match) => `__factorial__(${match})`);

    // Handle powers e.g. 2^3 -> Math.pow(2, 3)
    // We can preprocess ^ or use JS ** power operator
    clean = clean.replace(/\^/g, '**');

    // Create custom Math context with angle-aware trig
    const scope: Record<string, unknown> = {
      Math,
      __factorial__: factorial,
      sin: (x: number) => Math.sin(toRadians(x, angleUnit)),
      cos: (x: number) => Math.cos(toRadians(x, angleUnit)),
      tan: (x: number) => {
        const rad = toRadians(x, angleUnit);
        // Check for undefined tan points like 90 deg
        if (Math.abs(Math.cos(rad)) < 1e-15) throw new Error('Undefined (tan of 90°)');
        return Math.tan(rad);
      },
      asin: (x: number) => fromRadians(Math.asin(x), angleUnit),
      acos: (x: number) => fromRadians(Math.acos(x), angleUnit),
      atan: (x: number) => fromRadians(Math.atan(x), angleUnit),
      sinh: Math.sinh,
      cosh: Math.cosh,
      tanh: Math.tanh,
      asinh: Math.asinh,
      acosh: Math.acosh,
      atanh: Math.atanh,
      sqrt: Math.sqrt,
      cbrt: Math.cbrt,
      abs: Math.abs,
      log: Math.log10,
      log10: Math.log10,
      log2: Math.log2,
      ln: Math.log,
      exp: Math.exp,
      floor: Math.floor,
      ceil: Math.ceil,
      round: Math.round,
      E: Math.E,
      PI: Math.PI,
    };

    // Replace root notations e.g., √(x) or sqrt(x)
    clean = clean.replace(/√\(/g, 'sqrt(');
    clean = clean.replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)');

    // Execute within a restricted function scope
    const keys = Object.keys(scope);
    const values = Object.values(scope);
    
    // Evaluate using Function constructor
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const evalFunc = new Function(...keys, `"use strict"; return (${clean});`);
    const val = evalFunc(...values);

    if (typeof val !== 'number' || isNaN(val)) {
      return { result: null, formatted: 'Error', error: 'Invalid Result' };
    }

    if (!isFinite(val)) {
      return { result: val, formatted: val > 0 ? 'Infinity' : '-Infinity', error: null };
    }

    // Fix floating point precision artifacts (e.g., 0.1 + 0.2 = 0.30000000000000004 -> 0.3)
    const rounded = Number(Math.round(Number(val + 'e+12')) + 'e-12');
    
    return {
      result: rounded,
      formatted: formatNumber(rounded),
      error: null,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Syntax Error';
    return { result: null, formatted: 'Error', error: msg };
  }
}

/**
 * Formats a number with comma separators, scientific notation for extreme values,
 * and clean decimal trimming.
 */
export function formatNumber(val: number, maxDecimals: number = 10): string {
  if (isNaN(val)) return 'NaN';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';

  const absVal = Math.abs(val);

  // Use scientific notation for very large or very small numbers
  if ((absVal >= 1e12 || (absVal < 1e-7 && absVal > 0)) && absVal !== 0) {
    return val.toExponential(6).replace(/\+/, '');
  }

  // Format standard number
  const str = val.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
  });

  return str;
}

/**
 * Attempts to convert a decimal into a simplified fraction string (e.g. 0.75 -> "3/4")
 */
export function toFraction(val: number, tolerance: number = 1e-6): string | null {
  if (isNaN(val) || !isFinite(val) || Number.isInteger(val)) return null;

  const sign = val < 0 ? '-' : '';
  const absolute = Math.abs(val);
  const integerPart = Math.floor(absolute);
  const decimalPart = absolute - integerPart;

  if (decimalPart < tolerance) return null;

  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = decimalPart;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimalPart - h1 / k1) > decimalPart * tolerance && k1 < 10000);

  if (k1 <= 1) return null;

  const num = integerPart * k1 + h1;
  return `${sign}${num}/${k1}`;
}
