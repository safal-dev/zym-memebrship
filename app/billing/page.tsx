import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free Trial',
    price: '0',
    limit: 'Up to 50 members',
    duration: '1 Month',
    current: true
  },
  {
    name: 'Basic',
    price: '500',
    limit: 'Up to 300 members',
    duration: 'Per Month',
    current: false
  },
  {
    name: 'Standard',
    price: '1,000',
    limit: 'Up to 800 members',
    duration: 'Per Month',
    current: false
  },
  {
    name: 'Premium',
    price: '1,500',
    limit: 'Up to 1,500 members',
    duration: 'Per Month',
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
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Simple Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-xl font-semibold text-gray-900">Billing & Plans</h1>
        <p className="text-sm text-gray-500 mt-1">Select a plan that fits your gym size.</p>
      </div>

      {/* Current Subscription - Minimalist Card */}
      <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Plan</p>
          <h2 className="text-lg font-semibold text-gray-900">Free Trial</h2>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Limit</p>
          <p className="text-sm font-medium text-gray-600">300 Members</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Renewal Date</p>
          <p className="text-sm font-medium text-gray-600">May 27, 2026</p>
        </div>
        <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Active
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((p) => (
          <div 
            key={p.name} 
            className={cn(
              "p-6 rounded-2xl border transition-all duration-200",
              p.current 
                ? "bg-white border-blue-200 ring-1 ring-blue-50" 
                : "bg-white border-gray-100"
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{p.limit}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">NRS {p.price}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{p.duration}</p>
              </div>
            </div>

            {p.current ? (
              <button disabled className="w-full py-2.5 bg-gray-50 text-gray-400 rounded-xl font-medium text-xs border border-gray-100 cursor-not-allowed">
                Current Plan
              </button>
            ) : (
              <a 
                href={getWhatsAppLink(p.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Upgrade
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Support / Custom - Very Minimal */}
      <div className="pt-12 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Custom Plans</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Need a plan for more than 1,500 members? Contact us for a personalized setup.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 md:justify-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
            <a href={`https://wa.me/${whatsappNumber}`} className="text-sm font-medium text-blue-600 hover:underline">
              +{whatsappNumber}
            </a>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
            <a href={`mailto:${email}`} className="text-sm font-medium text-blue-600 hover:underline">
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
