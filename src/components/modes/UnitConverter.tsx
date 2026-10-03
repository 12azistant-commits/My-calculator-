import React, { useState } from 'react';
import { UnitCategory } from '../../types/calculator';
import { ArrowLeftRight, Copy, Check, RefreshCw } from 'lucide-react';

interface UnitDef {
  code: string;
  name: string;
  ratioToBase: number; // Ratio relative to base unit
  offset?: number; // For temperature e.g. Celsius/Fahrenheit
}

const CATEGORY_DATA: Record<UnitCategory, { name: string; baseUnit: string; units: UnitDef[] }> = {
  length: {
    name: 'Length',
    baseUnit: 'm',
    units: [
      { code: 'm', name: 'Meters (m)', ratioToBase: 1 },
      { code: 'km', name: 'Kilometers (km)', ratioToBase: 1000 },
      { code: 'cm', name: 'Centimeters (cm)', ratioToBase: 0.01 },
      { code: 'mm', name: 'Millimeters (mm)', ratioToBase: 0.001 },
      { code: 'mi', name: 'Miles (mi)', ratioToBase: 1609.344 },
      { code: 'yd', name: 'Yards (yd)', ratioToBase: 0.9144 },
      { code: 'ft', name: 'Feet (ft)', ratioToBase: 0.3048 },
      { code: 'in', name: 'Inches (in)', ratioToBase: 0.0254 },
    ],
  },
  mass: {
    name: 'Mass & Weight',
    baseUnit: 'kg',
    units: [
      { code: 'kg', name: 'Kilograms (kg)', ratioToBase: 1 },
      { code: 'g', name: 'Grams (g)', ratioToBase: 0.001 },
      { code: 'mg', name: 'Milligrams (mg)', ratioToBase: 0.000001 },
      { code: 'lb', name: 'Pounds (lb)', ratioToBase: 0.45359237 },
      { code: 'oz', name: 'Ounces (oz)', ratioToBase: 0.028349523125 },
      { code: 't', name: 'Metric Tons (t)', ratioToBase: 1000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'C',
    units: [
      { code: 'C', name: 'Celsius (°C)', ratioToBase: 1, offset: 0 },
      { code: 'F', name: 'Fahrenheit (°F)', ratioToBase: 1, offset: 0 },
      { code: 'K', name: 'Kelvin (K)', ratioToBase: 1, offset: 0 },
    ],
  },
  volume: {
    name: 'Volume',
    baseUnit: 'L',
    units: [
      { code: 'L', name: 'Liters (L)', ratioToBase: 1 },
      { code: 'mL', name: 'Milliliters (mL)', ratioToBase: 0.001 },
      { code: 'm3', name: 'Cubic Meters (m³)', ratioToBase: 1000 },
      { code: 'gal', name: 'US Gallons (gal)', ratioToBase: 3.78541 },
      { code: 'qt', name: 'US Quarts (qt)', ratioToBase: 0.946353 },
      { code: 'cup', name: 'Cups', ratioToBase: 0.24 },
      { code: 'floz', name: 'Fluid Ounces (fl oz)', ratioToBase: 0.0295735 },
    ],
  },
  speed: {
    name: 'Speed',
    baseUnit: 'm/s',
    units: [
      { code: 'm/s', name: 'Meters per sec (m/s)', ratioToBase: 1 },
      { code: 'km/h', name: 'Kilometers per hr (km/h)', ratioToBase: 0.277778 },
      { code: 'mph', name: 'Miles per hr (mph)', ratioToBase: 0.44704 },
      { code: 'kn', name: 'Knots (kn)', ratioToBase: 0.514444 },
    ],
  },
  area: {
    name: 'Area',
    baseUnit: 'm2',
    units: [
      { code: 'm2', name: 'Square Meters (m²)', ratioToBase: 1 },
      { code: 'km2', name: 'Square Kilometers (km²)', ratioToBase: 1000000 },
      { code: 'ft2', name: 'Square Feet (sq ft)', ratioToBase: 0.092903 },
      { code: 'acre', name: 'Acres', ratioToBase: 4046.86 },
      { code: 'ha', name: 'Hectares (ha)', ratioToBase: 10000 },
    ],
  },
  data: {
    name: 'Data Storage',
    baseUnit: 'B',
    units: [
      { code: 'B', name: 'Bytes (B)', ratioToBase: 1 },
      { code: 'KB', name: 'Kilobytes (KB)', ratioToBase: 1024 },
      { code: 'MB', name: 'Megabytes (MB)', ratioToBase: 1048576 },
      { code: 'GB', name: 'Gigabytes (GB)', ratioToBase: 1073741824 },
      { code: 'TB', name: 'Terabytes (TB)', ratioToBase: 1099511627776 },
    ],
  },
  time: {
    name: 'Time',
    baseUnit: 's',
    units: [
      { code: 's', name: 'Seconds (s)', ratioToBase: 1 },
      { code: 'min', name: 'Minutes (min)', ratioToBase: 60 },
      { code: 'h', name: 'Hours (h)', ratioToBase: 3600 },
      { code: 'd', name: 'Days (d)', ratioToBase: 86400 },
      { code: 'wk', name: 'Weeks (wk)', ratioToBase: 604800 },
      { code: 'yr', name: 'Years (yr)', ratioToBase: 31536000 },
    ],
  },
  currency: {
    name: 'Currency',
    baseUnit: 'USD',
    units: [
      { code: 'USD', name: 'US Dollar ($)', ratioToBase: 1 },
      { code: 'EUR', name: 'Euro (€)', ratioToBase: 1.08 },
      { code: 'GBP', name: 'British Pound (£)', ratioToBase: 1.30 },
      { code: 'JPY', name: 'Japanese Yen (¥)', ratioToBase: 0.0067 },
      { code: 'CAD', name: 'Canadian Dollar (C$)', ratioToBase: 0.74 },
      { code: 'AUD', name: 'Australian Dollar (A$)', ratioToBase: 0.67 },
      { code: 'CHF', name: 'Swiss Franc (CHF)', ratioToBase: 1.16 },
      { code: 'INR', name: 'Indian Rupee (₹)', ratioToBase: 0.012 },
      { code: 'CNY', name: 'Chinese Yuan (¥)', ratioToBase: 0.14 },
      { code: 'BRL', name: 'Brazilian Real (R$)', ratioToBase: 0.18 },
    ],
  },
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [amount, setAmount] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [copied, setCopied] = useState(false);

  const catDef = CATEGORY_DATA[category];

  // When category changes, reset defaults
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const newDef = CATEGORY_DATA[newCat];
    setFromUnit(newDef.units[0].code);
    setToUnit(newDef.units[1] ? newDef.units[1].code : newDef.units[0].code);
  };

  // Temperature conversion special handler
  const convertTemperature = (val: number, from: string, to: string): number => {
    let celsius = val;
    if (from === 'F') celsius = ((val - 32) * 5) / 9;
    if (from === 'K') celsius = val - 273.15;

    if (to === 'C') return celsius;
    if (to === 'F') return (celsius * 9) / 5 + 32;
    if (to === 'K') return celsius + 273.15;
    return celsius;
  };

  // General conversion engine
  const computeResult = (): number => {
    const num = parseFloat(amount);
    if (isNaN(num)) return 0;

    if (category === 'temperature') {
      return convertTemperature(num, fromUnit, toUnit);
    }

    const uFrom = catDef.units.find((u) => u.code === fromUnit);
    const uTo = catDef.units.find((u) => u.code === toUnit);

    if (!uFrom || !uTo) return 0;

    // Convert to base unit then to target unit
    const baseVal = num * uFrom.ratioToBase;
    return baseVal / uTo.ratioToBase;
  };

  const convertedResult = computeResult();

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${convertedResult.toLocaleString()} ${toUnit}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col gap-4 mt-3 max-w-2xl mx-auto">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {(Object.keys(CATEGORY_DATA) as UnitCategory[]).map((catKey) => (
          <button
            key={catKey}
            onClick={() => handleCategoryChange(catKey)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              category === catKey
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
            }`}
          >
            {CATEGORY_DATA[catKey].name}
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] items-center gap-3">
          {/* From Unit */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">From</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {catDef.units.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pt-4 sm:pt-0">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 transition-all active:scale-90"
              title="Swap From and To"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Unit */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">To (Result)</label>
            <div className="relative">
              <div className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-lg font-mono font-bold text-cyan-300 truncate pr-10">
                {convertedResult.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Copy Result"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {catDef.units.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-xs font-mono text-slate-400 mb-2">Common Conversions Matrix</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {catDef.units.slice(0, 6).map((u) => {
              const val = category === 'temperature'
                ? convertTemperature(1, fromUnit, u.code)
                : (1 * (catDef.units.find(x => x.code === fromUnit)?.ratioToBase || 1)) / u.ratioToBase;
              return (
                <div key={u.code} className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2 text-xs font-mono">
                  <div className="text-slate-500 text-[10px]">1 {fromUnit} =</div>
                  <div className="text-slate-200 font-bold truncate">
                    {val.toLocaleString(undefined, { maximumFractionDigits: 4 })} {u.code}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
