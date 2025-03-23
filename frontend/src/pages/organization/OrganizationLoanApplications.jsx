import React, { useEffect, useState, useRef } from "react";
import { IndianRupee, Calendar, User, MapPin, Calculator, X, Check, Edit, PenSquare } from 'lucide-react';
import axios from "axios";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  RadialLinearScale, 
  PointElement, 
  LineElement 
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  RadialLinearScale, 
  PointElement, 
  LineElement
);

const LOCATIONIQ_API_KEY = "pk.ec26d8ea85c97481bea9f26291756aee";
const WEATHERBIT_API_KEY = "36ab765d0976459c80970b2ebefb2db1";

// Soil fertility ratings lookup
const SOIL_RATINGS = {
  // Indian soil types
  "Alluvial Soil": 95, "Black Soil": 85, "Red Soil": 65, "Laterite Soil": 45,
  "Desert Soil": 25, "Forest Soil": 70, "Mountain Soil": 55, "Saline Soil": 15,
  // Standard soil taxonomy
  "Mollisols": 90, "Vertisols": 85, "Inceptisols": 75, "Andisols": 80,
  "Alfisols": 70, "Entisols": 65, "Ultisols": 50, "Oxisols": 40,
  "Podzols": 30, "Aridisols": 20, "Histosols": 60
};

// State-based adjustments for agricultural potential
const STATE_ADJUSTMENTS = {
  "Punjab": { soil: 95, water: 15, potential: 10 },
  "Haryana": { soil: 90, water: 15, potential: 8 },
  "Uttar Pradesh": { soil: 85, water: 10, potential: 7 },
  "West Bengal": { soil: 80, water: 10, potential: 6 },
  "Kerala": { soil: 75, water: 5, potential: 5 },
  "Karnataka": { soil: 70, water: -5, potential: 4 },
  "Tamil Nadu": { soil: 65, water: 5, potential: 5 },
  "Andhra Pradesh": { soil: 65, water: 0, potential: 4 },
  "Telangana": { soil: 60, water: -5, potential: 3 },
  "Maharashtra": { soil: 60, water: -10, potential: 2 },
  "Gujarat": { soil: 50, water: -5, potential: 2 },
  "Rajasthan": { soil: 30, water: -15, potential: -5 },
  "Madhya Pradesh": { soil: 55, water: -5, potential: 3 },
  "Bihar": { soil: 75, water: 5, potential: 5 },
  "Assam": { soil: 75, water: 5, potential: 6 }
};

export default function OrganizationLoanApplications() {

  useEffect(() => {
      const getAllApplications = async () => {
        try{
          const response = await axios.get('http://localhost:3000/api/org/farmer-application',{
            headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}
          });
          console.log(response.data);
          setApplications(response.data);

        } catch (error) {
          console.log(error);
        }
      }
    getAllApplications();
   
   },[])

  const [applications, setApplications] = useState([
    {
      id: 1,
      farmerName: "Rajesh Kumar",
      location: "Ludhiana, Punjab",
      amount: "₹500,000",
      purpose: "Crop Cultivation",
      status: "Pending",
      dateApplied: "2024-03-15",
      tenure: "36 months",
      interestRate: "7.5%",
      requestedAmount: "₹500,000",
      requestedTenure: "36 months",
      requestedInterestRate: "7.5%",
      counterOffered: false
    },
    {
      id: 2,
      farmerName: "Amit Patel",
      location: "Ahmedabad, Gujarat",
      amount: "₹300,000",
      purpose: "Equipment Purchase",
      status: "Approved",
      dateApplied: "2024-03-10",
      tenure: "24 months",
      interestRate: "8.2%",
      requestedAmount: "₹300,000",
      requestedTenure: "24 months",
      requestedInterestRate: "8.2%",
      counterOffered: false
    },
    {
      id: 3,
      farmerName: "Priya Singh",
      location: "Sonipat, Haryana",
      amount: "₹200,000",
      purpose: "Seed Purchase",
      status: "Pending",
      dateApplied: "2024-03-05",
      tenure: "12 months",
      interestRate: "6.9%",
      requestedAmount: "₹200,000",
      requestedTenure: "12 months",
      requestedInterestRate: "6.9%",
      counterOffered: false
    }
  ]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interestDetails, setInterestDetails] = useState(null);
  const [isCounterOfferDialogOpen, setIsCounterOfferDialogOpen] = useState(false);
  const [counterOfferDetails, setCounterOfferDetails] = useState(null);
  
  const openCalculator = (application) => {
    if (application.status === "Pending") {
      setSelectedApplication(application);
      setIsDrawerOpen(true);
    }
  };

  const showInterestDialog = (application) => {
    setInterestDetails(application);
    setIsDialogOpen(true);
  };
  
  const showCounterOfferDialog = (application) => {
    setCounterOfferDetails({
      ...application,
      counterAmount: application.amount.replace(/[₹,]/g, ''),
      counterTenure: application.tenure.split(' ')[0],
      counterInterestRate: application.interestRate.replace('%', '')
    });
    setIsCounterOfferDialogOpen(true);
  };

  const updateApplicationStatus = (id, newStatus) => {
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    setIsDialogOpen(false);
  };
  
  const submitCounterOffer = () => {
    const updatedAmount = `₹${parseInt(counterOfferDetails.counterAmount).toLocaleString('en-IN')}`;
    const updatedTenure = `${counterOfferDetails.counterTenure} months`;
    const updatedInterestRate = `${counterOfferDetails.counterInterestRate}%`;
    
    setApplications(prevApplications => 
      prevApplications.map(app => 
        app.id === counterOfferDetails.id ? { 
          ...app, 
          amount: updatedAmount, 
          tenure: updatedTenure, 
          interestRate: updatedInterestRate,
          counterOffered: true,
          status: "Counter Offered"
        } : app
      )
    );
    
    setIsCounterOfferDialogOpen(false);
  };

  const handleCounterOfferChange = (field, value) => {
    setCounterOfferDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-2xl font-bold text-slate-800">Loan Applications</h2>
      <div className="grid gap-6">
        {applications.map(application => (
          <div key={application.id} className="card p-6 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-slate-800">{application.farmerName}</h3>
                </div>
                <div className="flex items-center gap-2 mt-1 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{application.location}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                application.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : application.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-700'
                  : application.status === 'Counter Offered'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {application.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700">
                  Amount: {application.amount}
                  {application.counterOffered && (
                    <span className="text-xs ml-2 text-blue-600">
                      (Originally requested: {application.requestedAmount})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700">Applied: {application.dateApplied}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700">
                  Tenure: {application.tenure}
                  {application.counterOffered && application.tenure !== application.requestedTenure && (
                    <span className="text-xs ml-2 text-blue-600">
                      (Originally requested: {application.requestedTenure})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700">
                  Interest Rate: {application.interestRate}
                  {application.counterOffered && application.interestRate !== application.requestedInterestRate && (
                    <span className="text-xs ml-2 text-blue-600">
                      (Originally: {application.requestedInterestRate})
                    </span>
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-slate-600">Purpose: {application.purpose}</p>
              <div className="flex gap-2">
                {application.status === "Pending" && (
                  <>
                    <button 
                      onClick={() => showInterestDialog(application)}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => showCounterOfferDialog(application)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <PenSquare className="w-4 h-4" />
                      <span>Counter Offer</span>
                    </button>
                    <button 
                      onClick={() => openCalculator(application)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Calculate Score</span>
                    </button>
                  </>
                )}
                {application.status === "Counter Offered" && (
                  <>
                    <button 
                      onClick={() => updateApplicationStatus(application.id, "Approved")}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Finalize Approval</span>
                    </button>
                    <button 
                      onClick={() => showCounterOfferDialog(application)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Offer</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Calculator Drawer */}
      <div className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setIsDrawerOpen(false)}></div>
      
      <div className={`fixed right-0 top-0 h-full bg-white z-50 w-full max-w-3xl shadow-xl transform transition-transform duration-300 
                      ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-slate-800">Agricultural Loan Score Calculator</h3>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-64px)] p-4">
          {selectedApplication && (
            <LoanScoreCalculator location={selectedApplication.location} />
          )}
        </div>
      </div>

      {/* Interest/Approval Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>
              Review the loan application details before approval
            </DialogDescription>
          </DialogHeader>
          
          {interestDetails && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2">Farmer Information</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-slate-600">Name:</div>
                  <div className="font-medium">{interestDetails.farmerName}</div>
                  <div className="text-slate-600">Location:</div>
                  <div>{interestDetails.location}</div>
                  <div className="text-slate-600">Applied on:</div>
                  <div>{interestDetails.dateApplied}</div>
                </div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h4 className="font-medium text-emerald-700 mb-2">Loan Terms</h4>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-slate-600">Requested Amount:</div>
                  <div className="font-medium text-lg">{interestDetails.amount}</div>
                  
                  <div className="text-slate-600">Purpose:</div>
                  <div>{interestDetails.purpose}</div>
                  
                  <div className="text-slate-600">Proposed Tenure:</div>
                  <div className="font-medium">{interestDetails.tenure}</div>
                  
                  <div className="text-slate-600">Interest Rate:</div>
                  <div className="font-medium">{interestDetails.interestRate}</div>
                  
                  <div className="text-slate-600 pt-3">Monthly Payment:</div>
                  <div className="font-medium pt-3">
                    {calculateMonthlyPayment(interestDetails.amount, interestDetails.interestRate, interestDetails.tenure)}
                  </div>
                  
                  <div className="text-slate-600">Total Interest:</div>
                  <div className="text-emerald-700">
                    {calculateTotalInterest(interestDetails.amount, interestDetails.interestRate, interestDetails.tenure)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => updateApplicationStatus(interestDetails.id, "Approved")}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Approve Loan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Counter Offer Dialog */}
      <Dialog open={isCounterOfferDialogOpen} onOpenChange={setIsCounterOfferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Counter Offer</DialogTitle>
            <DialogDescription>
              Adjust the loan terms to make a counter offer to {counterOfferDetails?.farmerName}
            </DialogDescription>
          </DialogHeader>
          
          {counterOfferDetails && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="counterAmount">Loan Amount (₹)</Label>
                  <Input
                    id="counterAmount"
                    type="number"
                    value={counterOfferDetails.counterAmount}
                    onChange={(e) => handleCounterOfferChange('counterAmount', e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">
                    Originally requested: {counterOfferDetails.requestedAmount}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="counterTenure">Loan Tenure (months)</Label>
                  <Select
                    value={counterOfferDetails.counterTenure}
                    onValueChange={(value) => handleCounterOfferChange('counterTenure', value)}
                  >
                    <SelectTrigger id="counterTenure">
                      <SelectValue placeholder="Select tenure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="48">48 months</SelectItem>
                      <SelectItem value="60">60 months</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Originally requested: {counterOfferDetails.requestedTenure}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="counterInterestRate">Interest Rate (%)</Label>
                  <Input
                    id="counterInterestRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="25"
                    value={counterOfferDetails.counterInterestRate}
                    onChange={(e) => handleCounterOfferChange('counterInterestRate', e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500">
                    Originally requested: {counterOfferDetails.requestedInterestRate}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-700 mb-2">Counter Offer Summary</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-slate-600">New Amount:</div>
                  <div className="font-medium">₹{parseInt(counterOfferDetails.counterAmount).toLocaleString('en-IN')}</div>
                  
                  <div className="text-slate-600">New Tenure:</div>
                  <div className="font-medium">{counterOfferDetails.counterTenure} months</div>
                  
                  <div className="text-slate-600">New Interest Rate:</div>
                  <div className="font-medium">{counterOfferDetails.counterInterestRate}%</div>
                  
                  <div className="text-slate-600 pt-3">New Monthly Payment:</div>
                  <div className="font-medium pt-3">
                    {calculateMonthlyPayment(
                      `₹${parseInt(counterOfferDetails.counterAmount)}`, 
                      `${counterOfferDetails.counterInterestRate}%`, 
                      `${counterOfferDetails.counterTenure} months`
                    )}
                  </div>
                  
                  <div className="text-slate-600">New Total Interest:</div>
                  <div className="text-blue-700">
                    {calculateTotalInterest(
                      `₹${parseInt(counterOfferDetails.counterAmount)}`, 
                      `${counterOfferDetails.counterInterestRate}%`, 
                      `${counterOfferDetails.counterTenure} months`
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsCounterOfferDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitCounterOffer}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit Counter Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to calculate monthly payment
function calculateMonthlyPayment(amount, interestRate, tenure) {
  // Remove currency symbol and commas
  const principal = parseFloat(amount.replace(/[₹,]/g, ''));
  const rate = parseFloat(interestRate.replace('%', '')) / 100 / 12; // monthly interest rate
  const numberOfPayments = parseInt(tenure.split(' ')[0]); // extract months
  
  const monthlyPayment = principal * rate * Math.pow(1 + rate, numberOfPayments) / (Math.pow(1 + rate, numberOfPayments) - 1);
  
  return `₹${Math.round(monthlyPayment).toLocaleString('en-IN')} /month`;
}

// Helper function to calculate total interest
function calculateTotalInterest(amount, interestRate, tenure) {
  const principal = parseFloat(amount.replace(/[₹,]/g, ''));
  const rate = parseFloat(interestRate.replace('%', '')) / 100 / 12;
  const numberOfPayments = parseInt(tenure.split(' ')[0]);
  
  const monthlyPayment = principal * rate * Math.pow(1 + rate, numberOfPayments) / (Math.pow(1 + rate, numberOfPayments) - 1);
  const totalAmount = monthlyPayment * numberOfPayments;
  const totalInterest = totalAmount - principal;
  
  return `₹${Math.round(totalInterest).toLocaleString('en-IN')}`;
}

const LoanScoreCalculator = ({ location }) => {
  const [place, setPlace] = useState(location || "");
  const [locationInput, setLocationInput] = useState(location || "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const gaugeCanvasRef = useRef(null);

  // Helper functions for score calculations
  const rateSoilFertility = (soilType, state) => {
    if (soilType in SOIL_RATINGS) return SOIL_RATINGS[soilType];
    return STATE_ADJUSTMENTS[state]?.soil || 50;
  };
  
  const evaluateClimateStability = (temperature, precipitation) => {
    let tempScore = 0;
    
    if (temperature >= 20 && temperature <= 30) tempScore = 50;
    else if (temperature > 30 && temperature <= 35) tempScore = 40;
    else if (temperature > 35) tempScore = 25;
    else if (temperature >= 15 && temperature < 20) tempScore = 45;
    else if (temperature >= 10 && temperature < 15) tempScore = 30;
    else tempScore = 20;
    
    let precipScore = 0;
    if (precipitation <= 5) precipScore = 10;
    else if (precipitation <= 20) precipScore = 20;
    else if (precipitation <= 50) precipScore = 35;
    else if (precipitation <= 100) precipScore = 45;
    else if (precipitation <= 200) precipScore = 40;
    else precipScore = 30;
    
    return Math.min(100, tempScore + precipScore);
  };
  
  const evaluateWaterAvailability = (precipitation, state) => {
    let baseScore = 0;
    
    if (precipitation >= 100) baseScore = 90;
    else if (precipitation >= 50) baseScore = 80;
    else if (precipitation >= 30) baseScore = 70;
    else if (precipitation >= 20) baseScore = 60;
    else if (precipitation >= 10) baseScore = 40;
    else baseScore = 20;
    
    const adjustment = STATE_ADJUSTMENTS[state]?.water || 0;
    return Math.max(0, Math.min(100, baseScore + adjustment));
  };

  const calculateCreditScore = (soilType, weatherData, state) => {
    const soilFertility = rateSoilFertility(soilType, state);
    const climateStability = evaluateClimateStability(weatherData.temperature, weatherData.precipitation);
    const waterAvailability = evaluateWaterAvailability(weatherData.precipitation, state);
    const regionalBonus = STATE_ADJUSTMENTS[state]?.potential || 0;
    
    // Calculate base score with weights
    const baseScore = Math.round(
      0.4 * soilFertility + 0.3 * climateStability + 0.3 * waterAvailability
    );
    
    // Apply regional adjustment
    return Math.max(0, Math.min(100, baseScore + regionalBonus));
  };
  
  // Fetch location, soil type, and weather data
  const fetchLoanScore = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      // Set place from input
      setPlace(locationInput);
      
      // Get Latitude & Longitude
      const locationRes = await axios.get(
        `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationInput}, India&format=json`
      );
      
      const lat = parseFloat(locationRes.data[0].lat);
      const lon = parseFloat(locationRes.data[0].lon);
      
      // Get detailed address info including state
      const reverseGeoRes = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      
      const state = reverseGeoRes.data.address.state || "";
      
      // Get Soil Data
      const soilRes = await axios.get(`https://api.openepi.io/soil/type?lat=${lat}&lon=${lon}`);
      const soilType = soilRes.data.properties.most_probable_soil_type;

      // Get Weather Data
      const weatherRes = await axios.get(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`
      );
      
      const temp = parseFloat(weatherRes.data.data[0].temp);
      const precip = parseFloat(weatherRes.data.data[0].precip);

      // Calculate scores
      const soilFertility = rateSoilFertility(soilType, state);
      const climateStability = evaluateClimateStability(temp, precip);
      const waterAvailability = evaluateWaterAvailability(precip, state);
      const creditScore = calculateCreditScore(soilType, { temperature: temp, precipitation: precip }, state);
      
      // Set data
      setData({
        place: locationInput,
        latitude: lat,
        longitude: lon,
        state,
        soilType,
        temperature: temp,
        precipitation: precip,
        creditScore,
        soilFertility,
        climateStability,waterAvailability,
        recommendations: {
          ideal: creditScore >= 80 ? "Highly recommended for loans" : (creditScore >= 60 ? "Recommended with standard terms" : "Consider with caution"),
          crops: getCropRecommendations(state, soilType, temp, precip),
          interestRate: getRecommendedInterestRate(creditScore),
          loanAmount: getRecommendedLoanAmount(creditScore),
          tenure: getRecommendedTenure(creditScore)
        }
      });
    } catch (err) {
      console.error("Error fetching loan score:", err);
      setError("Failed to fetch data. Please check the location and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for recommendations
  const getCropRecommendations = (state, soilType, temp, precip) => {
    // Basic crop recommendations based on state, soil, and weather
    const stateBasedCrops = {
      "Punjab": ["Wheat", "Rice", "Cotton", "Sugarcane"],
      "Haryana": ["Wheat", "Rice", "Sugarcane", "Mustard"],
      "Uttar Pradesh": ["Wheat", "Rice", "Sugarcane", "Potato"],
      "West Bengal": ["Rice", "Jute", "Tea", "Maize"],
      "Karnataka": ["Coffee", "Sugarcane", "Ragi", "Jowar"],
      "Tamil Nadu": ["Rice", "Sugarcane", "Coconut", "Banana"],
      "Maharashtra": ["Cotton", "Sugarcane", "Soybean", "Jowar"],
      "Gujarat": ["Cotton", "Groundnut", "Tobacco", "Cumin"],
      "Rajasthan": ["Mustard", "Pearl Millet", "Wheat", "Barley"],
      "Madhya Pradesh": ["Soybean", "Wheat", "Gram", "Cotton"],
      "Bihar": ["Rice", "Wheat", "Sugarcane", "Maize"],
      "Assam": ["Tea", "Rice", "Jute", "Rapeseed"],
      "Kerala": ["Coconut", "Rubber", "Pepper", "Cardamom"],
      "Andhra Pradesh": ["Rice", "Cotton", "Tobacco", "Chillies"],
      "Telangana": ["Cotton", "Rice", "Maize", "Turmeric"]
    };
    
    // Soil-based crop recommendations
    const soilBasedCrops = {
      "Alluvial Soil": ["Rice", "Wheat", "Sugarcane", "Vegetables"],
      "Black Soil": ["Cotton", "Sugarcane", "Oilseeds", "Pulses"],
      "Red Soil": ["Groundnut", "Millet", "Pulses", "Tobacco"],
      "Laterite Soil": ["Tea", "Coffee", "Rubber", "Cashew"],
      "Desert Soil": ["Pearl Millet", "Sorghum", "Barley", "Pulses"],
      "Forest Soil": ["Coffee", "Spices", "Rubber", "Fruits"],
      "Mountain Soil": ["Tea", "Fruits", "Potatoes", "Barley"],
      "Saline Soil": ["Salt-resistant rice", "Barley", "Date palm", "Salt bush"],
      "Mollisols": ["Corn", "Wheat", "Soybean", "Vegetables"],
      "Vertisols": ["Cotton", "Sorghum", "Wheat", "Pulses"],
      "Inceptisols": ["Rice", "Wheat", "Vegetables", "Fruits"],
      "Andisols": ["Coffee", "Tea", "Vegetables", "Fruits"],
      "Alfisols": ["Corn", "Soybeans", "Wheat", "Cotton"],
      "Entisols": ["Vegetables", "Melons", "Fodder crops"],
      "Ultisols": ["Pine trees", "Blueberries", "Tobacco", "Cotton"],
      "Oxisols": ["Rubber", "Palm oil", "Coffee", "Cassava"],
      "Podzols": ["Potatoes", "Oats", "Forestry", "Berries"],
      "Aridisols": ["Drought-resistant crops", "Dates", "Millets", "Cotton"],
      "Histosols": ["Vegetables", "Rice", "Blueberries", "Cranberries"]
    };
    
    // Temperature and precipitation based filtering
    let recommendedCrops = [];
    
    // Get base recommendations from state and soil
    if (state in stateBasedCrops) {
      recommendedCrops = [...stateBasedCrops[state]];
    }
    
    if (soilType in soilBasedCrops) {
      // Add soil-based crops not already in the list
      soilBasedCrops[soilType].forEach(crop => {
        if (!recommendedCrops.includes(crop)) {
          recommendedCrops.push(crop);
        }
      });
    }
    
    // Filter based on temperature and precipitation
    // For simplicity, we'll just return the top 5 crops
    return recommendedCrops.slice(0, 5);
  };

  const getRecommendedInterestRate = (score) => {
    if (score >= 90) return "6.0% - 6.5%";
    if (score >= 80) return "6.5% - 7.0%";
    if (score >= 70) return "7.0% - 7.5%";
    if (score >= 60) return "7.5% - 8.0%";
    if (score >= 50) return "8.0% - 9.0%";
    if (score >= 40) return "9.0% - 10.0%";
    return "10.0% - 12.0%";
  };
  
  const getRecommendedLoanAmount = (score) => {
    if (score >= 90) return "₹500,000 - ₹2,000,000";
    if (score >= 80) return "₹400,000 - ₹1,500,000";
    if (score >= 70) return "₹300,000 - ₹1,000,000";
    if (score >= 60) return "₹200,000 - ₹800,000";
    if (score >= 50) return "₹150,000 - ₹500,000";
    if (score >= 40) return "₹100,000 - ₹300,000";
    return "₹50,000 - ₹200,000";
  };
  
  const getRecommendedTenure = (score) => {
    if (score >= 80) return "12 - 60 months";
    if (score >= 60) return "12 - 48 months";
    if (score >= 40) return "12 - 36 months";
    return "6 - 24 months";
  };

  // Chart data for Radar chart
  const radarData = {
    labels: ['Soil Fertility', 'Climate Stability', 'Water Availability'],
    datasets: [
      {
        label: 'Agricultural Potential',
        data: data ? [data.soilFertility, data.climateStability, data.waterAvailability] : [0, 0, 0],
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(52, 211, 153, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(52, 211, 153, 1)'
      }
    ]
  };
  
  // Chart options
  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };
  
  // Loan approval probability chart
  const doughnutData = {
    labels: ['Approval Probability', 'Risk Factor'],
    datasets: [
      {
        data: data ? [data.creditScore, 100 - data.creditScore] : [0, 100],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(239, 68, 68, 0.2)'
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Only execute on mount once
  useEffect(() => {
    if (location) {
      setLocationInput(location);
      fetchLoanScore();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Agricultural Loan Score Calculator</h3>
        
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Enter location (city, state)"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={fetchLoanScore}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "Loading..." : "Calculate"}
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-700 mb-3">Location Details</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-slate-600">Place:</div>
                  <div>{data.place}</div>
                  
                  <div className="text-slate-600">State:</div>
                  <div>{data.state}</div>
                  
                  <div className="text-slate-600">Soil Type:</div>
                  <div>{data.soilType}</div>
                  
                  <div className="text-slate-600">Current Temperature:</div>
                  <div>{data.temperature}°C</div>
                  
                  <div className="text-slate-600">Precipitation:</div>
                  <div>{data.precipitation} mm</div>
                </div>
              </div>
              
              <div className="text-center flex flex-col items-center justify-center">
                <div className="w-40 h-40 relative">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div>
                      <div className="text-3xl font-bold text-emerald-600">{data.creditScore}</div>
                      <div className="text-xs text-slate-500">Credit Score</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 font-medium">
                  {data.creditScore >= 80 ? (
                    <span className="text-emerald-600">Excellent</span>
                  ) : data.creditScore >= 60 ? (
                    <span className="text-blue-600">Good</span>
                  ) : data.creditScore >= 40 ? (
                    <span className="text-amber-600">Fair</span>
                  ) : (
                    <span className="text-red-600">Poor</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Agricultural Potential Analysis</h4>
                <div className="h-64">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-medium text-emerald-700 mb-3">Recommendations</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-slate-700 font-medium">Loan Decision:</div>
                    <div className="mt-1">{data.recommendations.ideal}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-700 font-medium">Recommended Interest Rate:</div>
                    <div className="mt-1">{data.recommendations.interestRate}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-700 font-medium">Suggested Loan Amount:</div>
                    <div className="mt-1">{data.recommendations.loanAmount}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-700 font-medium">Suggested Tenure:</div>
                    <div className="mt-1">{data.recommendations.tenure}</div>
                  </div>
                  
                  <div>
                    <div className="text-slate-700 font-medium">Recommended Crops:</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {data.recommendations.crops.map((crop, index) => (
                        <span key={index} className="px-2 py-1 bg-white rounded-full text-xs border border-emerald-200 text-emerald-700">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-slate-700 mb-3">Detailed Score Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Soil Fertility</span>
                    <span className="text-sm text-slate-600">{data.soilFertility}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${data.soilFertility}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Climate Stability</span>
                    <span className="text-sm text-slate-600">{data.climateStability}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.climateStability}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Water Availability</span>
                    <span className="text-sm text-slate-600">{data.waterAvailability}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${data.waterAvailability}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Overall Credit Score</span>
                    <span className="text-sm text-slate-600">{data.creditScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        data.creditScore >= 80 ? 'bg-emerald-500' : 
                        data.creditScore >= 60 ? 'bg-blue-500' : 
                        data.creditScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${data.creditScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};