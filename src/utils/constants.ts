import { PhysicalConstant } from '../types/calculator';

export const PHYSICAL_CONSTANTS: PhysicalConstant[] = [
  { symbol: 'π', name: 'Pi', value: Math.PI, unit: '', category: 'Mathematical' },
  { symbol: 'e', name: "Euler's Number", value: Math.E, unit: '', category: 'Mathematical' },
  { symbol: 'ϕ', name: 'Golden Ratio', value: (1 + Math.sqrt(5)) / 2, unit: '', category: 'Mathematical' },
  { symbol: 'c', name: 'Speed of Light', value: 299792458, unit: 'm/s', category: 'Physics' },
  { symbol: 'G', name: 'Gravitational Constant', value: 6.67430e-11, unit: 'N·m²/kg²', category: 'Physics' },
  { symbol: 'h', name: "Planck's Constant", value: 6.62607015e-34, unit: 'J·s', category: 'Physics' },
  { symbol: 'g', name: 'Standard Gravity', value: 9.80665, unit: 'm/s²', category: 'Physics' },
  { symbol: 'N_A', name: 'Avogadro Constant', value: 6.02214076e23, unit: 'mol⁻¹', category: 'Chemistry' },
  { symbol: 'R', name: 'Gas Constant', value: 8.314462618, unit: 'J/(mol·K)', category: 'Chemistry' },
  { symbol: 'k_B', name: 'Boltzmann Constant', value: 1.380649e-23, unit: 'J/K', category: 'Physics' },
  { symbol: 'e_charge', name: 'Elementary Charge', value: 1.602176634e-19, unit: 'C', category: 'Physics' },
  { symbol: 'm_e', name: 'Electron Mass', value: 9.1093837015e-31, unit: 'kg', category: 'Physics' },
  { symbol: 'm_p', name: 'Proton Mass', value: 1.67262192369e-27, unit: 'kg', category: 'Physics' },
];
