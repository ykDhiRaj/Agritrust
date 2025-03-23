import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import OrganizationDashboard from './pages/organization/OrganizationDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import FarmerSignup from './pages/farmer/FarmerSignup';
import OrganizationSignup from './pages/organization/OrganizationSignup';
import LoanScoreCalculator from './pages/LoanScoreCalculator';
import ProtectedRoute from './components/ProtectedRoute';

// Main App Component
function App() {
  return (
    
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    
  );
}


function MainLayout() {

  const location = useLocation();


  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col relative">
        
        <main className="flex-1 container mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/farmer-signup" element={<FarmerSignup />} />
              <Route path="/organization-signup" element={<OrganizationSignup />} />

              <Route element={<ProtectedRoute />}>  

              <Route path="/farmer/*" element={<FarmerDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/organization/*" element={<OrganizationDashboard />} />
              <Route path="/admin" element={<AdminDashboard/>} />
              <Route path="/score" element={<LoanScoreCalculator/>} />
              </Route>
              
            </Routes>
        </main>
      </div>
    </>
  );
}

export default App;