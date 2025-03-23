import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowRight, Loader2, Building2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function OrganizationSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formState.password !== formState.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const registrationData = {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        phone: formState.phone
      };

      // Send registration request
      const response = await axios.post('http://localhost:3000/api/org/register-organiation', registrationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Store the JWT token
      localStorage.setItem('orgToken', response.data.token);

      // Set the authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      // Navigate to organization dashboard
      navigate('/organization');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", error);
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
            <p className="text-slate-600 mb-8">The trusted platform connecting organizations with agricultural opportunities.</p>

            <div className="space-y-6 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <span className="text-green-600">01</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-slate-800">Provide financing</h3>
                  <p className="text-sm text-slate-500">Offer loans and credit to farmers</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <span className="text-green-600">02</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-slate-800">Verify farm data</h3>
                  <p className="text-sm text-slate-500">Access verified farming information</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <span className="text-green-600">03</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-slate-800">Grow your impact</h3>
                  <p className="text-sm text-slate-500">Support agricultural communities</p>
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
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Create your organization account</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Your organization name"
                  required
                  disabled={isLoading}
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
                  placeholder="org@example.com"
                  required
                  disabled={isLoading}
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
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
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
}