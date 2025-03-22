import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, BarChart, Users, ShieldCheck, Globe, MapPin, Mail, Phone, MapPinIcon, ChevronUp, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Refs for intersection observer
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const globalReachRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Scroll to top button visibility
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class
          entry.target.classList.add('animate-fade-in');
          
          // Update active section for nav highlighting
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = [featuresRef.current, howItWorksRef.current, globalReachRef.current, testimonialsRef.current];
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => sections.forEach(section => {
      if (section) observer.unobserve(section);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Scroll to top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}

      {/* Header/Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 transform hover:scale-105 transition-transform">
            <Sprout className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl text-slate-800">AgriTrust</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { id: "features", label: "Features" },
              { id: "how-it-works", label: "How It Works" },
              { id: "global-reach", label: "Global Reach" },
              { id: "testimonials", label: "Testimonials" }
            ].map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={`${
                  activeSection === item.id 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-slate-600'
                } hover:text-green-600 transition-colors duration-300`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden sm:inline-flex border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/farmer-signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Floating Elements */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
        
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
                Empowering Farmers with Financial Trust
              </h1>
              <p className="mt-6 text-lg text-slate-600 md:pr-12">
                AgriTrust connects farmers to financial resources by creating a verifiable digital record of your farming activities and credit history.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  onClick={() => navigate('/farmer-signup')}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 px-6 py-6 transition-all duration-300 hover:border-green-600"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative group">
              <div className="aspect-video rounded-xl overflow-hidden shadow-xl transition-all duration-500 transform group-hover:scale-95 group-hover:rotate-1">
                <img 
                  src="/images/farm-hero.jpg" 
                  alt="Farmer in field" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1000';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs hidden md:block transition-all duration-500 transform group-hover:translate-y-2 group-hover:translate-x-2">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium">85% of farmers improved loan access</p>
                </div>
              </div>
              
              {/* Floating decorative cards */}
              <div className="absolute -top-8 -left-8 bg-white p-3 rounded-lg shadow-md hidden lg:block opacity-90 animate-float-slow">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <p className="text-xs font-medium">Verified Trust</p>
                </div>
              </div>
              <div className="absolute top-1/2 -right-3 bg-white p-3 rounded-lg shadow-md hidden lg:block opacity-90 animate-float">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-medium">Community Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Stacked Card Animation */}
      <section id="features" ref={featuresRef} className="py-16 bg-white px-4 opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Why Choose AgriTrust</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Our platform offers powerful tools to help farmers build financial credibility and access better opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
                title: "Build Financial Trust",
                description: "Create a verified record of your farming activities and repayment history to build credibility with lenders."
              },
              {
                icon: <Users className="h-8 w-8 text-green-600" />,
                title: "Connect with Lenders",
                description: "Get matched with financial institutions looking to provide loans to reliable farmers like you."
              },
              {
                icon: <BarChart className="h-8 w-8 text-green-600" />,
                title: "Track Your Progress",
                description: "Monitor your farm's financial health and growth over time with easy-to-use dashboards."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="feature-card-container relative" 
                style={{ zIndex: 3 - index }}
              >
                <Card className="p-6 border-slate-200 feature-card transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="bg-green-50 inline-flex p-3 rounded-lg mb-4 transition-colors duration-300 group-hover:bg-green-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-green-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </Card>
                
                {/* Stacked cards effect (decorative) */}
                <div className="absolute inset-0 bg-slate-50 rounded-lg transform scale-95 -z-10 shadow-sm rotate-3"></div>
                <div className="absolute inset-0 bg-slate-100 rounded-lg transform scale-90 -z-20 shadow-sm rotate-6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with Step Animation */}
      <section id="how-it-works" ref={howItWorksRef} className="py-16 bg-slate-50 px-4 opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">How AgriTrust Works</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Our simple process helps you build a financial identity and connect with the right resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {[
              {
                number: "01",
                title: "Create Your Profile",
                description: "Sign up and build your farmer profile with details about your farm and crops."
              },
              {
                number: "02",
                title: "Record Your Activities",
                description: "Log your farming activities, harvests, and any previous loans or repayments."
              },
              {
                number: "03",
                title: "Connect with Lenders",
                description: "Get matched with lenders offering competitive rates based on your verified history."
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative step-card transform hover:scale-105 transition-all duration-300 hover:shadow-lg p-6 rounded-lg bg-white">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 transition-colors duration-300 hover:bg-green-200">
                  <span className="text-green-600 font-semibold">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 right-0 w-full h-0.5 bg-green-200 -z-10 transform translate-x-1/2">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-green-400 animate-bounce-x" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach Section with Card Hover Effects */}
      <section id="global-reach" ref={globalReachRef} className="py-16 bg-white opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Our Global Reach</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Connecting farmers in India with financial opportunities worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-10 w-10 text-green-600" />,
                title: "15+ Countries",
                description: "Our platform connects farmers with financial institutions across more than 15 countries."
              },
              {
                icon: <Users className="h-10 w-10 text-green-600" />,
                title: "50,000+ Farmers",
                description: "Join our growing community of over 50,000 farmers who are building their financial future."
              },
              {
                icon: <MapPin className="h-10 w-10 text-green-600" />,
                title: "Regional Focus",
                description: "Special focus on rural areas in India with plans to expand across South Asia and Africa."
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="p-6 border-slate-200 text-center transition-all duration-500 hover:shadow-xl hover:border-green-300 group hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-green-50 p-4 rounded-full transition-all duration-300 group-hover:bg-green-100 transform group-hover:scale-110">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-green-600 transition-colors duration-300">{item.title}</h3>
                <p className="text-slate-600">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
            >
              View Our Impact Report
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials with Card Stack Animation */}
      <section id="testimonials" ref={testimonialsRef} className="py-16 bg-slate-50 px-4 opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Farmers Trust Us</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Hear from farmers who have successfully built their financial credibility with AgriTrust.
            </p>
          </div>

          <div className="testimonial-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Before AgriTrust, I struggled to get loans. Now I have a digital record that proves my reliability to lenders.",
                name: "Raj Patel",
                location: "Gujarat, India",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "I secured a loan with 15% lower interest rates after just 6 months of using AgriTrust to document my farm production.",
                name: "Lakshmi Devi",
                location: "Karnataka, India",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "The platform is easy to use even for someone like me who isn't tech-savvy. My son helped me get started, now I use it daily.",
                name: "Sukhwinder Singh",
                location: "Punjab, India",
                image: "https://randomuser.me/api/portraits/men/67.jpg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card-wrapper relative">
                <Card className="p-6 border-slate-200 testimonial-card transition-all duration-500 hover:shadow-xl hover:-translate-y-2 group">
                  <p className="text-slate-700 mb-6 group-hover:text-green-800 transition-colors duration-300">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-transparent group-hover:border-green-400 transition-all duration-300">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-green-600 transition-colors duration-300">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.location}</p>
                    </div>
                  </div>
                </Card>
                
                {/* Stacked card effect only visible on hover */}
                <div className="absolute inset-0 bg-white rounded-lg transform scale-[0.98] opacity-0 group-hover:opacity-70 -z-10 shadow-sm transition-all duration-300 rotate-2"></div>
                <div className="absolute inset-0 bg-white rounded-lg transform scale-[0.96] opacity-0 group-hover:opacity-40 -z-20 shadow-sm transition-all duration-300 rotate-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Background */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply opacity-20 animate-float"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Ready to Transform Your Farming Future?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Join thousands of farmers who are building financial credibility and accessing better opportunities with AgriTrust.
          </p>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate('/farmer/signup')}
          >
            Create Your Free Account
            <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
          </Button>
        </div>
      </section>

      {/* Enhanced Footer with Wave SVG and Better Layout */}
      <footer className="bg-slate-800 text-slate-300 pt-16 pb-8 px-4 relative">
        {/* Wave SVG Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="fill-slate-800 h-16 w-full">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C58.9,0,121.11,11.06,182.42,27.48Z"></path>
          </svg>
        </div>
        
        <div className="container mx-auto">
          {/* Footer Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Column 1: Logo and About */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-4 hover:transform hover:translate-x-2 transition-transform duration-300">
                <Sprout className="h-6 w-6 text-green-400" />
                <span className="font-bold text-xl text-white">AgriTrust</span>
              </div>
              <p className="text-slate-400 mb-6">
                Building financial bridges for farmers across India.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 mt-6">
                {[
                  { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                  { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
                  { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                  { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="bg-slate-700 p-2 rounded-full hover:bg-green-600 transition-colors duration-300 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-white mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { href: "#features", label: "Features" },
                  { href: "#how-it-works", label: "How It Works" },
                  { href: "#global-reach", label: "Global Reach" },
                  { href: "#testimonials", label: "Testimonials" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="hover:text-green-400 transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 3: Resources */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-white mb-4 text-lg">Resources</h3>
              <ul className="space-y-2">
                {[
                  { href: "#", label: "Help Center" },
                  { href: "#", label: "Blog" },
                  { href: "#", label: "Farmer Stories" },
                  { href: "#", label: "FAQ" }
                ].map((resource, index) => (
                  <li key={index}>
                    <a 
                      href={resource.href} 
                      className="hover:text-green-400 transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{resource.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 4: Contact */}
            <div className="md:col-span-4">
              <h3 className="font-semibold text-white mb-4 text-lg">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center hover:transform hover:translate-x-2 transition-transform duration-300">
                  <Mail className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">support@agritrust.com</span>
                </li>
                <li className="flex items-center hover:transform hover:translate-x-2 transition-transform duration-300">
                  <Phone className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">+91 800 123 4567</span>
                </li>
                <li className="flex items-center hover:transform hover:translate-x-2 transition-transform duration-300">
                  <MapPinIcon className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Koramangala, Bangalore, India</span>
                </li>
              </ul>
              
              {/* Newsletter Signup */}
              <div className="mt-6">
                <h4 className="text-white text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 bg-slate-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                  />
                  <button className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2023 AgriTrust. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-green-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-green-400 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-green-400 transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

  {/* Add animations keyframes globally */}
  <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        
        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(22, 163, 74, 0.5); }
          50% { border-color: rgba(22, 163, 74, 1); }
        }
        
        /* Animation classes */
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        
        .animate-bounce-x {
          animation: bounce-x 2s ease-in-out infinite;
        }
        
        .animate-fade-slide-up {
          animation: fade-slide-up 0.8s ease-out forwards;
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          opacity: 1 !important;
          transition: opacity 1s ease;
        }
        
        /* Staggered animation for card elements */
        .feature-card-container:nth-child(1) .feature-card {
          transition-delay: 0.1s;
        }
        
        .feature-card-container:nth-child(2) .feature-card {
          transition-delay: 0.2s;
        }
        
        .feature-card-container:nth-child(3) .feature-card {
          transition-delay: 0.3s;
        }
        
        .testimonial-card-wrapper:nth-child(1) {
          transition-delay: 0.1s;
        }
        
        .testimonial-card-wrapper:nth-child(2) {
          transition-delay: 0.3s;
        }
        
        .testimonial-card-wrapper:nth-child(3) {
          transition-delay: 0.5s;
        }
        
        /* Improve focus styles for accessibility */
        a:focus, button:focus {
          outline: 2px solid rgba(22, 163, 74, 0.5);
          outline-offset: 2px;
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default HomePage;