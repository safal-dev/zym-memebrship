'use client';

import { useState, useEffect } from 'react';
import { addMember } from '@/app/actions';
import { Settings } from '@/types';
import { calculateEndDate, calculateDue } from '@/lib/membership';
import { format } from 'date-fns';

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
    // Update calculated fields when inputs change
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
    // Router redirect is handled in server action
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>

        {/* Membership Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Membership Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <input required type="date" name="joinDate" value={formData.joinDate} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input required type="date" name="membershipStart" value={formData.membershipStart} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Plan</label>
            <select name="membershipPlan" value={formData.membershipPlan} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
              {settings.defaultPlans.map(p => (
                <option key={p.name} value={p.name}>{p.name} ({p.months} Month{p.months > 1 ? 's' : ''})</option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-blue-800 font-medium">Calculated End Date: {endDate ? format(new Date(endDate), 'MMMM dd, yyyy') : '...'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Payment Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Fee ({settings.currency})</label>
              <input required type="number" name="totalFee" value={formData.totalFee} onChange={handleChange} min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount ({settings.currency})</label>
              <input required type="number" name="paidAmount" value={formData.paidAmount} onChange={handleChange} min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          
          {dueAmount > 0 ? (
            <div className="bg-rose-50 p-4 rounded-xl">
              <p className="text-sm text-rose-800 font-medium">Due Amount: {dueAmount} {settings.currency}</p>
            </div>
          ) : (
            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-sm text-emerald-800 font-medium">Fully Paid</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Info</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Member'}
        </button>
      </div>
    </form>
  );
}
