import { Shield, Info, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free Trial',
    price: '0',
    limit: 'UP TO 50 MEMBERS',
    duration: '1 MONTH',
    current: true
  },
  {
    name: 'Basic',
    price: '500',
    limit: 'UP TO 300 MEMBERS',
    duration: 'PER MONTH',
    current: false
  },
  {
    name: 'Standard',
    price: '1,000',
    limit: 'UP TO 800 MEMBERS',
    duration: 'PER MONTH',
    current: false
  },
  {
    name: 'Premium',
    price: '1,500',
    limit: 'UP TO 1,500 MEMBERS',
    duration: 'PER MONTH',
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
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Billing</h1>
        <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-tighter">Choose your membership management plan.</p>
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
              <p className="font-bold text-sm">300 Members</p>
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
              "p-8 rounded-3xl border transition-all duration-300 flex flex-col",
              p.current 
                ? "bg-white border-blue-600 shadow-lg ring-1 ring-blue-600/10" 
                : "bg-white border-gray-100 shadow-sm"
            )}
          >
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{p.name}</h3>
                <p className="text-sm font-black text-blue-600 mt-2 uppercase tracking-widest">{p.limit}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">NRS {p.price}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{p.duration}</p>
              </div>
            </div>

            {p.current ? (
              <button disabled className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed border border-gray-100">
                Current Plan
              </button>
            ) : (
              <a 
                href={getWhatsAppLink(p.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-lg shadow-gray-100 flex items-center justify-center gap-2"
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
          <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight uppercase">Custom Plan</h3>
          <p className="text-sm text-gray-500 font-bold leading-relaxed mb-6 uppercase tracking-tighter">
            Contact us for plans above 1,500 members.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp</p>
              <a href={`https://wa.me/${whatsappNumber}`} className="text-blue-600 font-black text-lg hover:underline">
                +{whatsappNumber}
              </a>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
              <a href={`mailto:${email}`} className="text-blue-600 font-black text-lg hover:underline">
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
