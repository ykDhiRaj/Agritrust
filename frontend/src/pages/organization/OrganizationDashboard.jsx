import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Users, FileSpreadsheet, Settings as SettingsIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import FarmersList from './FarmersList';
import Analytics from './Analytics';
import Settings from './Settings';
import LoanApplications from './OrganizationLoanApplications';

export default function OrganizationDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8 mb-8">
        <Link
          to="/organization"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <Users className="w-5 h-5" />
          <span>Farmers</span>
        </Link>
        <Link
          to="/organization/analytics"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span>Analytics</span>
        </Link>
        <Link
          to="/organization/settings"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <SettingsIcon className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <Link
          to="/organization/loan-applications"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-600"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span>Loan Applications</span>
        </Link>
      </div>

      <Routes>
        <Route index element={<FarmersList/>} />
        <Route path="farmers" element={<FarmersList />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/loan-applications" element={<LoanApplications />} />
      </Routes>
    </div>
  );
}