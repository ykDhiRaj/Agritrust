import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, ArrowRight, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast'
import useFarmerstore from '../lib/user.zustand';
import axios from 'axios';

export default function Login() {
  const [userType, setUserType] = useState('farmer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [appear, setAppear] = useState(false);
  const navigate = useNavigate();

  // Animation on mount
  useEffect(() => {
    setAppear(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = userType === 'farmer' ? 'http://localhost:3000/api/farmer/login' : 'http://localhost:3000/api/org/login-organization';
      const response = await axios.post(endpoint, formData);
      console.log(response.data);
      useFarmerstore.getState().addfarmer(response.data)


      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful');

      // Redirect based on user type
      if (userType === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/organization/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLoginButtonText = () => `Login as ${userType === 'farmer' ? 'Farmer' : 'Organization'}`;
  const getSignupPath = () => (userType === 'farmer' ? '/farmer-signup' : '/organization-signup');

  return (
    <div className="h-screen w-full bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
      <Card
        className={`w-full max-w-md h-auto max-h-screen overflow-auto border-slate-200 shadow-lg transition-all duration-700 transform ${appear ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white relative overflow-hidden">
          <div className="flex items-center justify-center mb-2 relative">
            <div className="bg-white/20 rounded-full p-2 shadow-inner animate-bounce" style={{ animationDuration: '3s' }}>
              <Sprout className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center">AgriTrust</h2>
          <p className="text-green-100 text-center mt-1 text-sm">Connecting farmers with financial support</p>
        </div>

        {/* User Type Selection */}
        <div className="p-4 bg-white">
          <div className="mb-4">
            <Label className="block text-sm font-medium text-slate-700 mb-2">I am a:</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${userType === 'farmer'
                  ? 'border-green-600 bg-green-50 text-green-700 shadow-md'
                  : 'border-slate-200 text-slate-600 hover:border-green-300'
                  }`}
                onClick={() => setUserType('farmer')}
              >
                <User className={`w-4 h-4 mr-2 transition-transform duration-500 ${userType === 'farmer' ? 'animate-pulse' : ''}`} />
                <span className="font-medium">Farmer</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${userType === 'organization'
                  ? 'border-green-600 bg-green-50 text-green-700 shadow-md'
                  : 'border-slate-200 text-slate-600 hover:border-green-300'
                  }`}
                onClick={() => setUserType('organization')}
              >
                <Building2 className={`w-4 h-4 mr-2 transition-transform duration-500 ${userType === 'organization' ? 'animate-pulse' : ''}`} />
                <span className="font-medium">Organization</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-700 text-sm">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your@email.com"
                className="border-slate-300 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300 h-9"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 text-sm">Password</Label>
                <a href="#" className="text-xs text-green-600 hover:text-green-700 transition-colors duration-300">
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="border-slate-300 focus:border-green-500 focus:ring focus:ring-green-200 transition-all duration-300 h-9"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-102 hover:shadow-md h-9"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  {getLoginButtonText()}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500">New to AgriTrust?</span>
              </div>
            </div>

            <Link to={getSignupPath()}>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300 h-9 text-sm"
              >
                Create {userType === 'farmer' ? 'Farmer' : 'Organization'} Account
              </Button>
            </Link>

            <Link to="/admin-login">
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300 h-9 text-sm"
              >
                Login as Admin
              </Button>
            </Link>
          </form>
        </div>

        {/* Footer */}
        <div className="p-2 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgriTrust - Growing communities together</p>
        </div>
      </Card>
    </div>
  );
}