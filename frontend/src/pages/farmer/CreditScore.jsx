import React from 'react';
import { format } from 'date-fns';

export default function CreditScore() {
  const creditScore = 685;

  return (
    <div className="space-y-6">
      <div className="card p-8 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Credit Score</h2>
        <div className="text-6xl font-bold text-emerald-600 mb-4">{creditScore}</div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (creditScore / 850) * 100)}%` }}
            />
          </div>
          <span className="text-sm text-slate-500 whitespace-nowrap">850</span>
        </div>
        <p className="text-slate-600">
          Last updated: {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Credit Factors</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600">Payment History</span>
                <span className="text-emerald-600 font-medium">Excellent</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full">
                <div className="h-full w-[95%] bg-emerald-600 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600">Land Value</span>
                <span className="text-emerald-600 font-medium">Good</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full">
                <div className="h-full w-[80%] bg-emerald-600 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600">Crop Yield</span>
                <span className="text-emerald-600 font-medium">Very Good</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full">
                <div className="h-full w-[85%] bg-emerald-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-600" />
              <p className="text-slate-600">Maintain consistent loan repayments to improve score</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-600" />
              <p className="text-slate-600">Consider adding more land collateral for higher loan limits</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-600" />
              <p className="text-slate-600">Explore crop diversification to reduce risk assessment</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}