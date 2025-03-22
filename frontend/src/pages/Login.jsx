import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, ArrowRight, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function Login() {
  const [userType, setUserType] = useState('farmer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    
    // Route based on userType
    if (userType === 'farmer') {
      navigate('/farmer');
    } else if (userType === 'organization') {
      navigate('/organization');
    }
  };

  // The login button text and functionality changes based on userType
  const getLoginButtonText = () => {
    return `Login as ${userType === 'farmer' ? 'Farmer' : 'Organization'}`;
  };

  // Get signup path based on user type
  const getSignupPath = () => {
    return userType === 'farmer' ? '/farmer-signup' : '/organization-signup';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-white/20 rounded-full p-2">
              <Sprout className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center">AgriTrust</h2>
          <p className="text-green-100 text-center mt-1">Connecting farmers with financial support</p>
        </div>

        {/* User Type Selection */}
        <div className="p-6">
          <div className="mb-6">
            <Label className="block text-sm font-medium text-slate-700 mb-2">I am a:</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  userType === 'farmer'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-slate-200 text-slate-600 hover:border-green-300'
                }`}
                onClick={() => setUserType('farmer')}
              >
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">Farmer</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  userType === 'organization'
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-slate-200 text-slate-600 hover:border-green-300'
                }`}
                onClick={() => setUserType('organization')}
              >
                <Building2 className="w-5 h-5 mr-2" />
                <span className="font-medium">Organization</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-green-600 hover:text-green-700">
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
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {getLoginButtonText()}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">New to AgriTrust?</span>
              </div>
            </div>
            
            <Link to={getSignupPath()}>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                Create {userType === 'farmer' ? 'Farmer' : 'Organization'} Account
              </Button>
            </Link>

            <Link to="/admin-login">
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Login as Admin
              </Button>
            </Link>
          </form>
        </div>
      </Card>
    </div>
  );
}