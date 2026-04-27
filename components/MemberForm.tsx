'use client';

import { useState, useEffect } from 'react';
import { addMember } from '@/app/actions';
import { Settings } from '@/types';
import { calculateEndDate, calculateDue } from '@/lib/membership';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { UserPlus, Calendar, CreditCard, FileText, MapPin, Phone, User } from 'lucide-react';

export function MemberForm({ settings }: { settings: Settings }) {
  const [loading, setLoading] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    joinDate: today,
    membershipPlan: settings.defaultPlans[0]?.name || 'Monthly',
    membershipStart: today,
    totalFee: settings.defaultPlans[0]?.price.toString() || '0',
    paidAmount: '0',
    notes: ''
  });

  const [endDate, setEndDate] = useState('');
  const [dueAmount, setDueAmount] = useState(0);

  useEffect(() => {
    const end = calculateEndDate(formData.membershipPlan, formData.membershipStart, settings.defaultPlans);
    setEndDate(end);
    
    const total = parseFloat(formData.totalFee) || 0;
    const paid = parseFloat(formData.paidAmount) || 0;
    setDueAmount(calculateDue(total, paid));
  }, [formData.membershipPlan, formData.membershipStart, formData.totalFee, formData.paidAmount, settings.defaultPlans]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'membershipPlan') {
      const plan = settings.defaultPlans.find(p => p.name === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        totalFee: plan ? plan.price.toString() : prev.totalFee
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await addMember(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in">
      {/* Editorial Header */}
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] text-onyx-tertiary uppercase">Entity Creation</span>
          <h1 className="text-4xl font-display font-black text-onyx-on-surface tracking-tighter">Enroll New Member</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Identity & Communications Section */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-onyx-background flex items-center justify-center text-onyx-primary">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-black text-onyx-on-surface">Identity & Reach</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Legal Full Name</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner"
                placeholder="E.G. JOHNATHAN DOE" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Primary Secure Line</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner"
                placeholder="98XXXXXXXX" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Geospatial Point (Address)</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner"
                placeholder="CITY, STREET NO." />
            </div>
          </div>
        </div>

        {/* Plan Architecture Section */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-onyx-background flex items-center justify-center text-onyx-primary">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-black text-onyx-on-surface">Membership Logic</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Initial Entry Date</label>
              <input required type="date" name="joinDate" value={formData.joinDate} onChange={handleChange}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Activation Schedule</label>
              <input required type="date" name="membershipStart" value={formData.membershipStart} onChange={handleChange}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Architectural Plan Tier</label>
            <select name="membershipPlan" value={formData.membershipPlan} onChange={handleChange}
              className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner appearance-none">
              {settings.defaultPlans.map(p => (
                <option key={p.name} value={p.name}>{p.name.toUpperCase()} ({p.months} MONTH CYCLE)</option>
              ))}
            </select>
          </div>

          <div className="p-6 bg-onyx-primary-container rounded-2xl flex justify-between items-center">
            <span className="text-[10px] font-black text-onyx-primary uppercase tracking-widest">Calculated Termination</span>
            <span className="font-display font-black text-onyx-tertiary">
              {endDate ? format(new Date(endDate), 'MMM dd, yyyy').toUpperCase() : 'PENDING...'}
            </span>
          </div>
        </div>

        {/* Fiscal Dynamics Section */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-onyx-background flex items-center justify-center text-onyx-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-black text-onyx-on-surface">Fiscal Parameters</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Gross Fee ({settings.currency})</label>
              <input required type="number" name="totalFee" value={formData.totalFee} onChange={handleChange} min="0"
                className="w-full px-6 py-5 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-display font-black text-2xl text-onyx-on-surface shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Initial Inflow ({settings.currency})</label>
              <input required type="number" name="paidAmount" value={formData.paidAmount} onChange={handleChange} min="0"
                className="w-full px-6 py-5 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-display font-black text-2xl text-onyx-tertiary shadow-inner" />
            </div>
          </div>
          
          <div className={cn(
            "p-6 rounded-2xl flex justify-between items-center transition-onyx",
            dueAmount > 0 ? "bg-rose-500/10" : "bg-onyx-tertiary/10"
          )}>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {dueAmount > 0 ? 'NET OWED REVENUE' : 'FISCAL CLEARANCE'}
            </span>
            <span className={cn(
              "font-display font-black text-xl",
              dueAmount > 0 ? "text-rose-400" : "text-onyx-tertiary"
            )}>
              {dueAmount > 0 ? `${dueAmount} ${settings.currency}` : 'FULLY CAPTURED'}
            </span>
          </div>
        </div>

        {/* Dossier Annotations */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-onyx-background flex items-center justify-center text-onyx-primary">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-black text-onyx-on-surface">Dossier Notes</h3>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Internal Observations</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={5}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner resize-none h-full min-h-[120px]"
                placeholder="ADD ANY RELEVANT CLINICAL OR PERFORMANCE NOTES..." />
            </div>
          </div>
          
          <div className="flex justify-end pt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-onyx-primary to-[#78839c] text-onyx-on-primary rounded-full hover:scale-[1.02] active:scale-[0.98] transition-onyx shadow-xl shadow-onyx-primary/10 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <UserPlus className="w-5 h-5" />
              {loading ? 'SYNCHRONIZING...' : 'FINALIZE ENROLLMENT'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
