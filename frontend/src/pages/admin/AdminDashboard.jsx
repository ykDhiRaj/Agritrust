import React, { useState, useEffect } from 'react';
import { 
  Home, Users, CreditCard, FileText, PieChart, Calendar, Settings, 
  ArrowRight, Layers, TrendingUp, User, Bell, Search, LogOut, 
  UserPlus, AlertTriangle, Briefcase, TrendingDown, Download, 
  Filter, Eye, Building, Mail, Phone, Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Enhanced Modal Component with Green Theme
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/70 backdrop-blur-sm transition-opacity duration-500 ease-in-out">
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-emerald-400/50 transform transition-all duration-300 scale-90">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-green-800 transition-all duration-200 ease-in-out group"
        >
          <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Decorative Element */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-emerald-100/20 via-green-200/15 to-teal-300/20 transform rotate-45 animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component with Green Theme
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [expandedMenu, setExpandedMenu] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Dummy data for stats
  const stats = [
    { title: "Total Farmers", value: "12,458", change: "+15%", icon: <Users className="h-6 w-6 text-emerald-600" /> },
    { title: "Active Loans", value: "4,720", change: "+8%", icon: <CreditCard className="h-6 w-6 text-green-600" /> },
    { title: "Loan Amount (INR)", value: "₹32.4M", change: "+12%", icon: <Briefcase className="h-6 w-6 text-teal-600" /> },
    { title: "Default Rate", value: "3.2%", change: "-1.5%", icon: <AlertTriangle className="h-6 w-6 text-red-600" /> },
  ];

  // Dummy data for recent activities
  const recentActivities = [
    { id: 1, type: "New Farmer", name: "Rahul Sharma", location: "Uttar Pradesh", timestamp: "2 hours ago" },
    { id: 2, type: "Loan Approved", name: "Anita Patel", amount: "₹120,000", timestamp: "6 hours ago" },
    { id: 3, type: "Verification", name: "Sunil Kumar", status: "Pending KYC", timestamp: "10 hours ago" },
    { id: 4, type: "Repayment", name: "Deepak Singh", amount: "₹24,500", timestamp: "1 day ago" },
    { id: 5, type: "New Farmer", name: "Lakshmi Devi", location: "Karnataka", timestamp: "1 day ago" },
  ];

  // Dummy data for loan applications
  const loanApplications = [
    { id: 1, farmer: "Vikram Mehta", amount: "₹85,000", purpose: "Irrigation System", status: "Pending", date: "22 Mar 2025" },
    { id: 2, farmer: "Priya Sharma", amount: "₹120,000", purpose: "Crop Expansion", status: "Approved", date: "21 Mar 2025" },
    { id: 3, farmer: "Rajesh Kumar", amount: "₹50,000", purpose: "Seeds & Fertilizer", status: "Pending", date: "20 Mar 2025" },
    { id: 4, farmer: "Ananya Singh", amount: "₹200,000", purpose: "Farm Equipment", status: "Rejected", date: "19 Mar 2025" },
  ];

  // Organization types for dropdown

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Organization Data:', formData);
    setIsModalOpen(false);
    setFormData({ 
      name: '', 
      email: '', 
      password: '', 
      phone: '',
    });
  };

  const toggleMenu = () => {
    setExpandedMenu(prev => !prev);
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex">
      {/* Sidebar */}
      <aside className={`bg-green-600 text-white transition-all duration-300 ${
        expandedMenu ? 'w-64' : 'w-20'
      } fixed left-0 h-screen z-10`}>
        <div className={`p-4 flex ${expandedMenu ? 'justify-between' : 'justify-center'} items-center`}>
          {expandedMenu && <h2 className="font-semibold">AgriTrust Admin</h2>}
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-emerald-800 transition-colors"
          >
            {expandedMenu ? 
              <ArrowRight className="h-5 w-5" /> : 
              <Layers className="h-5 w-5" />
            }
          </button>
        </div>
        
        <nav className="mt-4">
          <ul className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: <Home className="h-5 w-5" /> },
              { id: 'farmers', label: 'Farmers', icon: <Users className="h-5 w-5" /> },
              { id: 'loans', label: 'Loans', icon: <CreditCard className="h-5 w-5" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="h-5 w-5" /> },
              { id: 'analytics', label: 'Analytics', icon: <PieChart className="h-5 w-5" /> },
              { id: 'calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center w-full ${
                    expandedMenu ? 'px-4' : 'justify-center px-2'
                  } py-3 rounded-md ${
                    activeView === item.id 
                      ? 'bg-emerald-700 text-white' 
                      : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                  } transition-colors duration-200`}
                >
                  <span className="inline-block">{item.icon}</span>
                  {expandedMenu && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {expandedMenu && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-emerald-800 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-emerald-200">admin@agritrust.com</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-3 justify-center text-emerald-100 hover:text-white hover:bg-emerald-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${
        expandedMenu ? 'ml-64' : 'ml-20'
      } p-6 overflow-auto min-h-screen`}>
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-800">Admin Dashboard</h1>
            <p className="text-emerald-600 mt-1">
              Today is {formatDate(currentTime)} | {formatTime(currentTime)}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <Input 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 w-full md:w-64 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <Search className="h-4 w-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            
            <div className="relative">
              <button className="bg-white p-2 rounded-md text-emerald-600 hover:bg-emerald-100 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full text-xs flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow border-emerald-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-emerald-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-emerald-800 mt-1">{stat.value}</h3>
                  <span className={`inline-flex items-center text-sm ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} 
                    {stat.change.startsWith('+') ? 
                      <TrendingUp className="h-3 w-3 ml-1" /> : 
                      <TrendingDown className="h-3 w-3 ml-1" />
                    }
                  </span>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities */}
          <Card className="lg:col-span-2 p-6 border-emerald-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-emerald-800">Recent Activities</h2>
              <Button variant="outline" className="text-sm border-emerald-300 text-emerald-700 hover:bg-emerald-50">View All</Button>
            </div>
            <div className="divide-y divide-emerald-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-emerald-800">
                        {activity.name} 
                        <span className="text-emerald-600"> - {activity.type}</span>
                      </p>
                      <p className="text-sm text-emerald-600">
                        {activity.location || activity.amount || activity.status}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-500">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 border-emerald-100">
            <h2 className="text-lg font-semibold text-emerald-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Organization
              </Button>
              <Button variant="outline" className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <CreditCard className="h-4 w-4 mr-2" />
                Process Loan Application
              </Button>
              <Button variant="outline" className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <FileText className="h-4 w-4 mr-2" />
                Generate Monthly Report
              </Button>
              <Button variant="outline" className="w-full justify-start border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-emerald-100">
              <h3 className="text-md font-semibold text-emerald-800 mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Server Status</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Last Backup</span>
                  <span className="text-sm text-emerald-800">Today, 05:30 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Database Usage</span>
                  <span className="text-sm text-emerald-800">42% / 100GB</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Modal for Adding New Organization */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-full bg-emerald-100 mb-4">
              <Building className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-700">Add New Organization</h2>
            <p className="text-emerald-600 mt-1">Complete the form below to register a new organization</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <div className="flex items-center mb-1">
                <Building className="h-4 w-4 text-emerald-600 mr-1" />
                <label className="block text-sm font-medium text-emerald-700">Organization Name</label>
              </div>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter organization name"
                required
                className="w-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 rounded-lg transition-all duration-200"
              />
            </div>
            
            <div className="relative">
              <div className="flex items-center mb-1">
                <Mail className="h-4 w-4 text-emerald-600 mr-1" />
                <label className="block text-sm font-medium text-emerald-700">Email Address</label>
              </div>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="organization@email.com"
                required
                className="w-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 rounded-lg transition-all duration-200"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="flex items-center mb-1">
                  <Key className="h-4 w-4 text-emerald-600 mr-1" />
                  <label className="block text-sm font-medium text-emerald-700">Password</label>
                </div>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 rounded-lg transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center mb-1">
                  <Phone className="h-4 w-4 text-emerald-600 mr-1" />
                  <label className="block text-sm font-medium text-emerald-700">Phone Number</label>
                </div>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 12345 67890"
                  required
                  className="w-full border-2 border-emerald-200 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 rounded-lg transition-all duration-200"
                />
              </div>
            </div>
            
            
    
            
            <div className="bg-emerald-50 p-3 rounded-lg mt-6 text-sm text-emerald-700">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-emerald-600" />
                </div>
                <p>By adding this organization, you'll grant them access to the AgriTrust platform. They will receive an email with their login credentials.</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white transition-all duration-200 transform hover:scale-105"
              >
                Add Organization
              </Button>
            </div>
          </form>
        </Modal>

        {/* Loan Applications Table */}
        <Card className="p-6 mb-8 border-emerald-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-emerald-800">Recent Loan Applications</h2>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="flex items-center border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="px-4 py-3 text-xs font-medium text-emerald-700 uppercase tracking-wider">Farmer</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-700 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-700 uppercase tracking-wider">Purpose</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-700 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-emerald-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {loanApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-emerald-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-emerald-800">
                      {application.farmer}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-emerald-700">
                      {application.amount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-emerald-700">
                      {application.purpose}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-emerald-700">
                      {application.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-emerald-600">Showing 4 of 120 applications</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled className="border-emerald-200 text-emerald-400">Previous</Button>
              <Button variant="outline" size="sm" className="bg-emerald-100 border-emerald-300 text-emerald-700">1</Button>
              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">2</Button>
              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">3</Button>
              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">Next</Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center text-emerald-600 text-sm py-4">
          © 2025 AgriTrust Admin Dashboard. All rights reserved.
        </footer>
      </main>
    </div>
  );
};