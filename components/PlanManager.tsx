'use client';

import { useState } from 'react';
import { addPlan, removePlan } from '@/app/settings-actions';
import { Trash2, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Plan {
  name: string;
  months: number;
  price: number;
}

export function PlanManager({ plans, currency }: { plans: Plan[], currency: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMonths, setNewMonths] = useState(1);
  const [newPrice, setNewPrice] = useState(0);

  const handleAdd = async () => {
    if (!newName || newMonths <= 0 || newPrice < 0) {
      toast.error('Please fill all fields correctly');
      return;
    }
    try {
      await addPlan(newName, newMonths, newPrice);
      setNewName('');
      setNewMonths(1);
      setNewPrice(0);
      setIsAdding(false);
      toast.success('Plan added successfully');
    } catch (error) {
      toast.error('Failed to add plan');
    }
  };

  const handleRemove = async (name: string) => {
    if (confirm(`Remove plan "${name}"?`)) {
      try {
        await removePlan(name);
        toast.success('Plan removed');
      } catch (error) {
        toast.error('Failed to remove plan');
      }
    }
  };

  return (
    <div className="space-y-4">
      {plans.map(p => (
        <div key={p.name} className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
          <div>
            <p className="font-black text-gray-900 uppercase tracking-widest text-xs mb-1">{p.name}</p>
            <p className="text-sm font-bold text-gray-400">{p.months} Month{p.months > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-black text-blue-600 text-lg">
              {p.price} <span className="text-[10px] text-gray-400 font-bold uppercase">{currency}</span>
            </div>
            <button 
              onClick={() => handleRemove(p.name)}
              className="p-2.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {isAdding ? (
        <div className="p-6 bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-3xl space-y-5 animate-in">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Plan Name</label>
              <input 
                placeholder="e.g. Platinum Plus" 
                className="w-full px-4 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Months</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                  value={newMonths} 
                  onChange={e => setNewMonths(parseInt(e.target.value))} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Price</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                  value={newPrice} 
                  onChange={e => setNewPrice(parseInt(e.target.value))} 
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Save Plan
            </button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-3 bg-white text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-5 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> New Membership Plan
        </button>
      )}
    </div>
  );
}
