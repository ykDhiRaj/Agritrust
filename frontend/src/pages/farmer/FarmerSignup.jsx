import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const FarmerSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    location: {
      village: '',
      district: '',
      state: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setFormState(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:3000/api/farmer/signup', formState);
      
      toast.success(response.data.message || 'Account created successfully!');
      navigate('/farmer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left panel - Visible on desktop */}
        <div className="hidden md:flex md:w-1/2 bg-green-50 p-8 flex-col justify-center items-center">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6 bg-white rounded-full p-6 inline-block">
              <Sprout className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Welcome to AgriTrust</h1>
            <p className="text-slate-600 mb-8">The trusted platform connecting farmers with resources and opportunities.</p>
            
            <div className="space-y-6 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <span className="text-green-600">01</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-slate-800">Connect with lenders</h3>
                  <p className="text-sm text-slate-500">Access agricultural loans and credit opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <span className="text-green-600">02</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-slate-800">Track your farm data</h3>
                  <p className="text-sm text-slate-500">Document your farming history to build credit</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <span className="text-green-600">03</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-slate-800">Get better rates</h3>
                  <p className="text-sm text-slate-500">Improve your financial options with verified farm data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - Signup form */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <Card className="w-full max-w-md p-6 border-slate-200 shadow-sm">
            <div className="md:hidden flex justify-center mb-6">
              <div className="bg-green-50 rounded-full p-4">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Create your farmer account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location.village">Village</Label>
                <Input
                  id="location.village"
                  name="location.village"
                  value={formState.location.village}
                  onChange={handleChange}
                  placeholder="Your village"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location.district">District</Label>
                  <Input
                    id="location.district"
                    name="location.district"
                    value={formState.location.district}
                    onChange={handleChange}
                    placeholder="Your district"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location.state">State</Label>
                  <Input
                    id="location.state"
                    name="location.state"
                    value={formState.location.state}
                    onChange={handleChange}
                    placeholder="Your state"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmerSignup;