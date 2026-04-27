import Link from 'next/link';
import { Check, ArrowRight, Zap, Users, Shield, Smartphone, CreditCard, Bell } from 'lucide-react';

const plans = [
  {
    name: 'Free Trial',
    price: '0',
    duration: '1 Month',
    description: 'Perfect for testing the waters and setting up your data.',
    features: [
      'Manage up to 50 members',
      'Basic payment tracking',
      'Mobile responsive design',
      'Cloud database access',
      'Email support'
    ],
    cta: 'Start Free Month',
    highlight: false
  },
  {
    name: 'Basic',
    price: '500',
    duration: 'per Month',
    description: 'Ideal for small gyms or personal training studios.',
    features: [
      'Manage up to 300 members',
      'Full payment management',
      'Member expiry alerts',
      'CSV data export',
      '24/7 Cloud persistence'
    ],
    cta: 'Get Started',
    highlight: false
  },
  {
    name: 'Standard',
    price: '1,000',
    duration: 'per Month',
    description: 'Everything you need to scale your fitness business.',
    features: [
      'Manage up to 800 members',
      'Advanced financial history',
      'Custom membership plans',
      'Printable receipts',
      'Priority support',
      'Multiple admin access'
    ],
    cta: 'Most Popular',
    highlight: true
  },
  {
    name: 'Premium',
    price: '1,500',
    duration: 'per Month',
    description: 'The ultimate solution for high-traffic gym centers.',
    features: [
      'Manage up to 1,500 members',
      'Unlimited payment records',
      'Advanced analytics dashboard',
      'Bulk member notifications',
      'Dedicated account manager',
      'White-label options'
    ],
    cta: 'Contact Sales',
    highlight: false
  }
];

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Member Management',
    description: 'Keep track of every member, their contact details, and their fitness journey in one secure place.'
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: 'Mobile Native UX',
    description: 'A super-responsive design that feels like a native app on your phone. Manage your gym on the go.'
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Payment Tracking',
    description: 'Record payments, track due amounts, and generate receipts instantly. Never miss a payment again.'
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Automated Alerts',
    description: 'Get notified automatically when memberships are expiring or payments are overdue.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure Cloud Data',
    description: 'Powered by Supabase. Your data is encrypted, backed up, and accessible from anywhere in the world.'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Built with Next.js 15 for incredible speed. No more waiting for slow legacy software.'
  }
];

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">CAREWELL <span className="text-blue-600">fitness</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <Link href="/login" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Now Powered by Supabase Cloud
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[0.9] text-gray-900">
              The Gym Management <span className="text-blue-600">Reimagined.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg font-medium">
              A premium, mobile-native solution for gym owners who value simplicity, aesthetics, and speed. Manage your community from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
                Start 1 Month Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#pricing" className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-blue-600 transition-all flex items-center justify-center">
                View Pricing
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
            <div className="relative bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl shadow-blue-100 border-4 border-gray-800">
               {/* Note: I'm not embedding the actual generated image file path directly here to avoid local path issues on user screen, 
                   instead I use a placeholder styling or I can try to use a relative path if I move it to public. 
                   But for now, a sleek mock-up div is safer. */}
               <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-950 rounded-[2rem] overflow-hidden flex items-center justify-center p-8">
                 <div className="w-full space-y-4 opacity-50">
                   <div className="h-8 w-1/3 bg-gray-700 rounded-full" />
                   <div className="grid grid-cols-3 gap-4">
                     <div className="h-32 bg-gray-800 rounded-3xl border border-gray-700" />
                     <div className="h-32 bg-gray-800 rounded-3xl border border-gray-700" />
                     <div className="h-32 bg-gray-800 rounded-3xl border border-gray-700" />
                   </div>
                   <div className="h-64 bg-gray-800 rounded-3xl border border-gray-700" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Platform Features</h2>
            <p className="text-4xl font-black text-gray-900 tracking-tight">Built for modern fitness businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm font-medium">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Simple Pricing</h2>
            <p className="text-4xl font-black text-gray-900 tracking-tight">Choose a plan that fits your gym.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-8 rounded-[2.5rem] border transition-all duration-500 relative flex flex-col",
                  p.highlight 
                    ? "bg-gray-900 text-white border-gray-800 shadow-2xl shadow-blue-200 scale-105 z-10" 
                    : "bg-white text-gray-900 border-gray-100 hover:border-blue-100 hover:shadow-xl"
                )}
              >
                {p.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-black mb-2">{p.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter">NRS {p.price}</span>
                    <span className={cn("text-xs font-bold uppercase tracking-widest", p.highlight ? "text-gray-400" : "text-gray-400")}>
                      {p.duration}
                    </span>
                  </div>
                  <p className={cn("text-sm mt-4 font-medium leading-relaxed", p.highlight ? "text-gray-400" : "text-gray-500")}>
                    {p.description}
                  </p>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-medium">
                      <div className={cn("shrink-0 p-1 rounded-full", p.highlight ? "bg-blue-600/20 text-blue-400" : "bg-blue-50 text-blue-600")}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={p.highlight ? "text-gray-300" : "text-gray-600"}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/login" 
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-center transition-all",
                    p.highlight 
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/50" 
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-100"
                  )}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-black tracking-tighter uppercase">CAREWELL <span className="text-blue-600">fitness</span></span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
            © 2026 Carewell Fitness Management. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
