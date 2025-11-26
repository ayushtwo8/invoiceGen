import { useState, useEffect } from 'react';
import { 
  FileText, 
  Zap, 
  Shield, 
  Globe,
  Download,
  Check,
  ArrowRight,
  Menu,
  X,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Fast",
      description: "Create invoices in under 2 minutes"
    },
    {
      icon: <Shield className="w-4 h-4" />,
      title: "Secure",
      description: "GST compliant & encrypted"
    },
    {
      icon: <Globe className="w-4 h-4" />,
      title: "Multi-currency",
      description: "INR, USD, EUR and more"
    },
    {
      icon: <Download className="w-4 h-4" />,
      title: "Export",
      description: "PDF download & email"
    }
  ];

  const pricing = [
    {
      name: "Free",
      price: "₹0",
      features: ["5 invoices/month", "3 clients", "Basic templates", "Email support"],
      cta: "Get Started"
    },
    {
      name: "Pro",
      price: "₹499",
      features: ["Unlimited invoices", "Unlimited clients", "All templates", "Priority support", "Analytics", "Branding"],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Business",
      price: "₹1,999",
      features: ["Everything in Pro", "Multi-user", "API access", "Dedicated support", "Custom features"],
      cta: "Contact Us"
    }
  ];

  const stats = [
    { label: "Users", value: "10K+", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Invoices", value: "50K+", icon: <FileText className="w-4 h-4" /> },
    { label: "Time Saved", value: "5K hrs", icon: <Clock className="w-4 h-4" /> },
    { label: "Revenue", value: "₹100Cr+", icon: <DollarSign className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100' : 'bg-transparent'
      }`}>
        <nav className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold">InvoiceGen</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-black transition-colors">Pricing</a>
              <button className="text-sm text-gray-600 hover:text-black transition-colors" onClick={() => {navigate('/login')}}>Login</button>
              <button className="px-4 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors" onClick={() => {navigate('/register')}}>
                Sign up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-gray-100">
              <a href="#features" className="block text-sm text-gray-600 hover:text-black transition-colors">Features</a>
              <a href="#pricing" className="block text-sm text-gray-600 hover:text-black transition-colors">Pricing</a>
              <button className="block text-sm text-gray-600 hover:text-black transition-colors" ></button>
              <button className="w-full px-4 py-1.5 text-sm bg-black text-white rounded-lg">Sign up</button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Used by 10,000+ businesses
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Professional invoices
              <br />
              <span className="text-gray-400">in seconds</span>
            </h1>
            
            <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
              GST compliant invoice generator for Indian businesses. Create, send, and track invoices effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="px-5 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2" onClick={() => {navigate('/register')}}>
                Get started free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-5 py-2 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                View demo
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              No credit card • Free forever plan
            </p>
          </div>

          {/* Hero Image - Minimal Invoice Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <div className="text-xl font-bold mb-1">INVOICE</div>
                  <div className="text-xs text-gray-500">INV-2024-001</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Total</div>
                  <div className="text-2xl font-bold">₹2,36,000</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-2">FROM</div>
                  <div className="text-sm font-medium">TechSolutions Pvt Ltd</div>
                  <div className="text-xs text-gray-500">Noida, UP</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-2">TO</div>
                  <div className="text-sm font-medium">CloudNine Solutions</div>
                  <div className="text-xs text-gray-500">Bangalore, KA</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { name: "Website Development", amount: "₹1,50,000" },
                  { name: "UI/UX Design", amount: "₹45,000" },
                  { name: "SEO Services", amount: "₹25,000" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-medium">{item.amount}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2">
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">GST 18%</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">Paid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need</h2>
            <p className="text-sm text-gray-600">Powerful features for modern businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-black rounded-2xl p-8 text-white">
              <BarChart3 className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold mb-2">Analytics</h3>
              <p className="text-sm text-gray-300 mb-4">Track revenue, payments, and business metrics in real-time.</p>
              <button className="text-sm font-medium hover:underline">Learn more →</button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <Globe className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold mb-2">Mobile Ready</h3>
              <p className="text-sm text-gray-600 mb-4">Create and send invoices from any device, anywhere.</p>
              <button className="text-sm font-medium hover:underline">Learn more →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Simple pricing</h2>
            <p className="text-sm text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <div 
                key={i}
                className={`relative rounded-2xl p-6 transition-all ${
                  plan.popular 
                    ? 'bg-black text-white shadow-lg scale-105' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-0.5 bg-blue-500 text-white rounded-full text-xs font-medium">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs">
                      <Check className={`w-4 h-4 shrink-0 ${plan.popular ? 'text-white' : 'text-gray-400'}`} />
                      <span className={plan.popular ? 'text-gray-200' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-2 text-sm rounded-lg font-medium transition-all ${
                  plan.popular 
                    ? 'bg-white text-black hover:bg-gray-100' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Loved by businesses</h2>
            <p className="text-sm text-gray-600">See what our customers say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", role: "Designer, Mumbai", quote: "Saves me hours every week. Super clean interface." },
              { name: "Arun P.", role: "CEO, Bangalore", quote: "Perfect for startups. GST compliance made easy." },
              { name: "Sneha R.", role: "Business Owner, Delhi", quote: "Essential tool for our operations. Highly recommended." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Join thousands of businesses using InvoiceGen
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="px-5 py-2 bg-white text-black text-sm rounded-lg hover:bg-gray-100 transition-colors">
              Start free trial
            </button>
            <button className="px-5 py-2 bg-transparent text-white text-sm rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
              Contact sales
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-600 py-12 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-black">InvoiceGen</span>
              </div>
              <p className="text-xs text-gray-500">Professional invoice management</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-black mb-3">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-black transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Templates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-black mb-3">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-black transition-colors">About</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-black mb-3">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-black transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-xs text-gray-500">© 2024 InvoiceGen. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}