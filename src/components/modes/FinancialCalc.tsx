import React, { useState } from 'react';
import { FinancialMode } from '../../types/calculator';
import { DollarSign, PieChart, Users, TrendingUp, Calendar, Percent } from 'lucide-react';

export const FinancialCalc: React.FC = () => {
  const [subMode, setSubMode] = useState<FinancialMode>('compound');

  // Compound Interest State
  const [principal, setPrincipal] = useState('10000');
  const [monthlyContribution, setMonthlyContribution] = useState('200');
  const [interestRate, setInterestRate] = useState('7');
  const [years, setYears] = useState('10');

  // Loan State
  const [loanPrincipal, setLoanPrincipal] = useState('250000');
  const [loanRate, setLoanRate] = useState('6.5');
  const [loanYears, setLoanYears] = useState('30');

  // Tip State
  const [billAmount, setBillAmount] = useState('120');
  const [tipPercent, setTipPercent] = useState('18');
  const [splitPeople, setSplitPeople] = useState('3');

  // Margin / ROI State
  const [revenue, setRevenue] = useState('50000');
  const [cost, setCost] = useState('32000');

  // --- Calculations ---

  // Compound Interest
  const p = parseFloat(principal) || 0;
  const pm = parseFloat(monthlyContribution) || 0;
  const r = (parseFloat(interestRate) || 0) / 100;
  const t = parseFloat(years) || 0;

  let totalCompound = p;
  let totalDeposited = p;
  for (let i = 0; i < t * 12; i++) {
    totalCompound = (totalCompound + pm) * (1 + r / 12);
    totalDeposited += pm;
  }
  const interestEarned = Math.max(0, totalCompound - totalDeposited);

  // Loan Payment
  const lp = parseFloat(loanPrincipal) || 0;
  const lr = (parseFloat(loanRate) || 0) / 100 / 12;
  const ln = (parseFloat(loanYears) || 0) * 12;
  let monthlyPayment = 0;
  if (lr > 0 && ln > 0) {
    monthlyPayment = (lp * (lr * Math.pow(1 + lr, ln))) / (Math.pow(1 + lr, ln) - 1);
  }
  const totalLoanPaid = monthlyPayment * ln;
  const totalLoanInterest = Math.max(0, totalLoanPaid - lp);

  // Tip
  const b = parseFloat(billAmount) || 0;
  const tipVal = (b * (parseFloat(tipPercent) || 0)) / 100;
  const totalBill = b + tipVal;
  const people = Math.max(1, parseInt(splitPeople) || 1);
  const perPerson = totalBill / people;

  // Margin & ROI
  const rev = parseFloat(revenue) || 0;
  const cst = parseFloat(cost) || 0;
  const grossProfit = rev - cst;
  const margin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const roi = cst > 0 ? (grossProfit / cst) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 mt-3 max-w-2xl mx-auto">
      {/* Submode Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
        {[
          { id: 'compound', label: 'Compound Interest', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: 'loan', label: 'Loan / Mortgage', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'tip', label: 'Tip Splitter', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'margin', label: 'ROI & Margin', icon: <Percent className="w-3.5 h-3.5" /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSubMode(item.id as FinancialMode)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              subMode === item.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Mode Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        {subMode === 'compound' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Compound Interest Growth Calculator
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Initial Principal ($)</label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Monthly Contribution ($)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Duration (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Future Balance</span>
                <span className="text-2xl font-mono font-bold text-cyan-300">
                  ${totalCompound.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Progress Bar breakdown */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full transition-all"
                    style={{ width: `${(totalDeposited / Math.max(1, totalCompound)) * 100}%` }}
                  />
                  <div
                    className="bg-cyan-400 h-full transition-all"
                    style={{ width: `${(interestEarned / Math.max(1, totalCompound)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    Principal: ${totalDeposited.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    Interest: ${interestEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {subMode === 'loan' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Loan & Mortgage Amortization
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Loan Amount ($)</label>
                <input
                  type="number"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Interest Rate (%)</label>
                <input
                  type="number"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Term (Years)</label>
                <input
                  type="number"
                  value={loanYears}
                  onChange={(e) => setLoanYears(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Monthly Payment</span>
                <span className="text-2xl font-mono font-bold text-cyan-300">
                  ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Total Interest Paid:</span>
                <span className="text-amber-400 font-bold">
                  ${totalLoanInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Total Amount Paid:</span>
                <span className="text-slate-200 font-bold">
                  ${totalLoanPaid.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {subMode === 'tip' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Tip & Bill Splitter
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Bill Amount ($)</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Tip (%)</label>
                <input
                  type="number"
                  value={tipPercent}
                  onChange={(e) => setTipPercent(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Split (People)</label>
                <input
                  type="number"
                  value={splitPeople}
                  onChange={(e) => setSplitPeople(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Amount Per Person</span>
                <span className="text-2xl font-mono font-bold text-cyan-300">
                  ${perPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Total Tip Amount:</span>
                <span className="text-emerald-400 font-bold">
                  ${tipVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Total Bill (Incl. Tip):</span>
                <span className="text-slate-200 font-bold">
                  ${totalBill.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        {subMode === 'margin' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              ROI & Profit Margin Calculator
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400">Total Revenue ($)</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Total Cost ($)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-100 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">Gross Profit</span>
                <span className={`text-2xl font-mono font-bold ${grossProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${grossProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Profit Margin:</span>
                <span className="text-cyan-300 font-bold">{margin.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Return on Investment (ROI):</span>
                <span className="text-cyan-300 font-bold">{roi.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
