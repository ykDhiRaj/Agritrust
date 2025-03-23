import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoanApplicationForm() {
  const navigate = useNavigate();
  
  // Predefined RBI standard loan amounts
  const standardAmounts = [
    { value: '50000', label: '₹50,000' },
    { value: '100000', label: '₹1,00,000' },
    { value: '200000', label: '₹2,00,000' },
    { value: '300000', label: '₹3,00,000' },
    { value: '500000', label: '₹5,00,000' },
    { value: '750000', label: '₹7,50,000' },
    { value: '1000000', label: '₹10,00,000' },
    { value: '1500000', label: '₹15,00,000' },
    { value: '2000000', label: '₹20,00,000' },
  ];
  
  // Predefined tenures as per RBI guidelines for agricultural loans
  const standardTenures = [
    { value: '12', label: '12 months (1 year)' },
    { value: '24', label: '24 months (2 years)' },
    { value: '36', label: '36 months (3 years)' },
    { value: '48', label: '48 months (4 years)' },
    { value: '60', label: '60 months (5 years)' },
    { value: '84', label: '84 months (7 years)' },
    { value: '120', label: '120 months (10 years)' },
  ];
  
  // Predefined interest rates per RBI guidelines
  const interestRates = [
    { value: '7.0', label: '7.0% - Kisan Credit Card' },
    { value: '8.5', label: '8.5% - Short-term crop loan' },
    { value: '9.0', label: '9.0% - Agriculture infrastructure' },
    { value: '10.5', label: '10.5% - Farm mechanization' },
    { value: '11.25', label: '11.25% - Land development' },
  ];
  
  // Predefined loan purposes as per official agricultural loan guidelines
  const loanPurposes = [
    { value: 'crop_production', label: 'Crop Production' },
    { value: 'farm_equipment', label: 'Farm Equipment & Machinery' },
    { value: 'land_development', label: 'Land Development & Improvement' },
    { value: 'irrigation', label: 'Irrigation Systems & Water Conservation' },
    { value: 'storage_facility', label: 'Storage Facility Construction' },
    { value: 'livestock', label: 'Livestock Purchase & Management' },
    { value: 'organic_farming', label: 'Organic Farming Conversion' },
    { value: 'horticulture', label: 'Horticulture Development' },
    { value: 'allied_activities', label: 'Allied Agricultural Activities' },
    { value: 'marketing_infrastructure', label: 'Agricultural Marketing Infrastructure' },
  ];
  
  const [formData, setFormData] = useState({
    loanAmount: '100000',
    interestRate: '8.5',
    loanTerm: '36',
    purpose: 'crop_production',
    location: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call to submit the form data
      // For example: await api.post('/loan-applications', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to loan applications page after successful submission
      navigate('/farmer/loan-applications');
    } catch (error) {
      console.error('Failed to submit loan application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Apply for a New Loan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount
          </label>
          <select
            id="loanAmount"
            name="loanAmount"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.loanAmount}
            onChange={handleChange}
          >
            {standardAmounts.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Standard loan amounts as per RBI guidelines
          </p>
        </div>
        
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Purpose
          </label>
          <select
            id="purpose"
            name="purpose"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.purpose}
            onChange={handleChange}
          >
            {loanPurposes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Official purposes as per agricultural loan guidelines
          </p>
        </div>
        
        <div>
          <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Tenure
          </label>
          <select
            id="loanTerm"
            name="loanTerm"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.loanTerm}
            onChange={handleChange}
          >
            {standardTenures.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate
          </label>
          <select
            id="interestRate"
            name="interestRate"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.interestRate}
            onChange={handleChange}
          >
            {interestRates.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Interest rates based on RBI guidelines for agricultural loans
          </p>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Farm Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            placeholder="e.g. Village, District, State"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/farmer/loan-applications')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
}