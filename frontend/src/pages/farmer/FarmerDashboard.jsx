import { CreditCard, FileSpreadsheet, History, MapPin, PlusCircle } from 'lucide-react';
import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import CreditScore from './CreditScore';
import LoanApplications from './FarmerLoanApplications';
import Loans from './Loans';
import Properties from './Properties';
import LoanApplicationForm from './LoanApplicationForm';
  
export default function FarmerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8 mb-8 flex-wrap">
        <Link
          to="/farmer/apply-loan"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Apply for Loan</span>
        </Link>
        <Link
          to="/farmer/credit-score"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <CreditCard className="w-5 h-5" />
          <span>Credit Score</span>
        </Link>
        <Link
          to="/farmer/properties"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <MapPin className="w-5 h-5" />
          <span>My Properties</span>
        </Link>
        <Link
          to="/farmer/loans"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <History className="w-5 h-5" />
          <span>Loan History</span>
        </Link>
        <Link
          to="/farmer/loan-applications"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span>My Loan Applications</span>
        </Link>
      </div>
      
      <Routes>
        <Route index element={<CreditScore />} /> {/* Default route when just /farmer is accessed */}
        <Route path="credit-score" element={<CreditScore />} />
        <Route path="properties" element={<Properties />} />
        <Route path="loans" element={<Loans />} />
        <Route path="loan-applications" element={<LoanApplications />} />
        <Route path="apply-loan" element={<LoanApplicationForm />} />
      </Routes>
    </div>
  );
}