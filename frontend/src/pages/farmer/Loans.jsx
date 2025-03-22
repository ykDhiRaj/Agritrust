import React from 'react';
import { IndianRupee, Calendar } from 'lucide-react';

export default function Loans() {
  const loans = [
    {
      id: 1,
      amount: "₹500,000",
      purpose: "Crop Cultivation",
      status: "Active",
      emi: "₹12,500",
      nextPayment: "2024-04-15",
      progress: 65
    },
    {
      id: 2,
      amount: "₹300,000",
      purpose: "Equipment Purchase",
      status: "Completed",
      emi: "₹10,000",
      nextPayment: null,
      progress: 100
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Loan History</h2>

      <div className="grid gap-6">
        {loans.map(loan => (
          <div key={loan.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-slate-800">{loan.amount}</h3>
                </div>
                <p className="text-slate-600 mt-1">{loan.purpose}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                loan.status === 'Active' 
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {loan.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Repayment Progress</span>
                  <span className="text-slate-800 font-medium">{loan.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${loan.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-sm text-slate-600">Monthly EMI</p>
                  <p className="font-medium text-slate-800">{loan.emi}</p>
                </div>
                {loan.nextPayment && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Next Payment</p>
                    <div className="flex items-center gap-1 text-slate-800">
                      <Calendar className="w-4 h-4" />
                      <p className="font-medium">{loan.nextPayment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}