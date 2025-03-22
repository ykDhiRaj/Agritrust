import React from 'react';
import { User, MapPin, CreditCard } from 'lucide-react';

export default function FarmersList() {
  const farmers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Punjab",
      creditScore: 685,
      totalLand: "8.7 acres",
      activeLoan: "₹500,000"
    },
    {
      id: 2,
      name: "Amit Patel",
      location: "Gujarat",
      creditScore: 720,
      totalLand: "5.2 acres",
      activeLoan: "₹300,000"
    },
    {
      id: 3,
      name: "Priya Singh",
      location: "Haryana",
      creditScore: 650,
      totalLand: "4.5 acres",
      activeLoan: null
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Registered Farmers</h2>

      <div className="grid gap-6">
        {farmers.map(farmer => (
          <div key={farmer.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{farmer.name}</h3>
                  <div className="flex items-center gap-2 text-slate-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{farmer.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">{farmer.creditScore}</span>
                </div>
                <span className="text-sm text-slate-600">Credit Score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
              <div>
                <p className="text-sm text-slate-600">Total Land</p>
                <p className="font-medium text-slate-800">{farmer.totalLand}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Active Loan</p>
                <p className="font-medium text-slate-800">{farmer.activeLoan || "No active loans"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}