import React from 'react';
import { TrendingUp, Users, IndianRupee, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const stats = [
    {
      title: "Total Farmers",
      value: "156",
      change: "+12%",
      icon: Users
    },
    {
      title: "Average Credit Score",
      value: "685",
      change: "+5%",
      icon: TrendingUp
    },
    {
      title: "Total Loans",
      value: "₹15.2M",
      change: "+8%",
      icon: IndianRupee
    },
    {
      title: "Default Rate",
      value: "2.3%",
      change: "-0.5%",
      icon: AlertTriangle
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-600">{stat.title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Credit Score Distribution</h3>
          <div className="space-y-4">
            {[
              { range: "700+", count: 45, percentage: 29 },
              { range: "650-699", count: 62, percentage: 40 },
              { range: "600-649", count: 38, percentage: 24 },
              { range: "<600", count: 11, percentage: 7 }
            ].map(item => (
              <div key={item.range}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.range}</span>
                  <span className="text-slate-800 font-medium">{item.count} farmers</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Loan Purpose Distribution</h3>
          <div className="space-y-4">
            {[
              { purpose: "Crop Cultivation", amount: "₹6.8M", percentage: 45 },
              { purpose: "Equipment Purchase", amount: "₹4.2M", percentage: 28 },
              { purpose: "Land Development", amount: "₹2.5M", percentage: 16 },
              { purpose: "Others", amount: "₹1.7M", percentage: 11 }
            ].map(item => (
              <div key={item.purpose}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.purpose}</span>
                  <span className="text-slate-800 font-medium">{item.amount}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}