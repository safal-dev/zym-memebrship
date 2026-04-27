import { Check, Shield, Info, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free Trial',
    price: '0',
    limit: 'Up to 50 members',
    duration: '1 Month',
    features: ['Basic Member Tracking', 'Payment Records', 'Mobile Access'],
    current: true
  },
  {
    name: 'Basic',
    price: '500',
    limit: 'Up to 300 members',
    duration: 'Per Month',
    features: ['All Free Features', 'Full Financial History', 'Member Export'],
    current: false
  },
  {
    name: 'Standard',
    price: '1,000',
    limit: 'Up to 800 members',
    duration: 'Per Month',
    features: ['All Basic Features', 'Expiry Notifications', 'Priority Support'],
    current: false
  },
  {
    name: 'Premium',
    price: '1,500',
    limit: 'Up to 1,500 members',
    duration: 'Per Month',
    features: ['All Standard Features', 'Multi-Admin Support', 'Custom Branding'],
    current: false
  }
];

export default function BillingPage() {
  const whatsappNumber = '9779748435017';
  const email = 'info.safalpoudel@gmail.com';

  const getWhatsAppLink = (planName: string) => {
    const text = encodeURIComponent(`i want to upgrade to ${planName}.`);
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Software Billing</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Manage your gym management system subscription.</p>
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Shield className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Current Subscription</p>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-4xl font-black tracking-tighter">Free Trial</h2>
            <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Active</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Status</p>
              <p className="font-bold text-sm">Valid for 30 days</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Member Limit</p>
              <p className="font-bold text-sm">Up to 300 members</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Next Billing</p>
              <p className="font-bold text-sm">May 27, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div 
            key={p.name} 
            className={cn(
              "p-6 rounded-3xl border transition-all duration-300 flex flex-col",
              p.current 
                ? "bg-white border-blue-600 shadow-lg ring-1 ring-blue-600/10" 
                : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">{p.name}</h3>
                <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wider">{p.limit}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">NRS {p.price}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.duration}</p>
              </div>
            </div>

            <div className="space-y-3 mb-8 flex-grow">
              {p.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {p.current ? (
              <button disabled className="w-full py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm cursor-not-allowed border border-gray-100">
                Current Plan
              </button>
            ) : (
              <a 
                href={getWhatsAppLink(p.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-100 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Upgrade Now
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
          <Info className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight uppercase">Need a Custom Plan?</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
            If you have more than 1,500 members or need custom features for your gym, contact us directly for a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Call / WhatsApp</p>
              <a href={`https://wa.me/${whatsappNumber}`} className="text-blue-600 font-bold hover:underline">
                +{whatsappNumber}
              </a>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Support</p>
              <a href={`mailto:${email}`} className="text-blue-600 font-bold hover:underline">
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
