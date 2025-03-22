import React, { useEffect, useState } from 'react';
import { IndianRupee, Calendar, User, MapPin } from 'lucide-react';

export default function FarmerLoanApplications() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      amount: "₹500,000",
      purpose: "Crop Cultivation",
      status: "Pending",
      dateApplied: "2024-03-15"
    },
    {
      id: 2,
      amount: "₹300,000",
      purpose: "Equipment Purchase",
      status: "Approved",
      dateApplied: "2024-03-10"
    }
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">My Loan Applications</h2>

      <div className="grid gap-6">
        {applications.map(application => (
          <div key={application.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{application.purpose}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                application.status === 'Pending' 
                  ? 'bg-yellow-100 text-yellow-700'
                  : application.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {application.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700">Amount: {application.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700">Applied: {application.dateApplied}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 