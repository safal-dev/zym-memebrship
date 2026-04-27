'use client';

import { useState } from 'react';
import { Settings, MembershipPlan } from '@/types';
import { updateSettings } from '@/app/settings-actions';
import { toast } from 'sonner';
import { Settings as SettingsIcon, DollarSign, Dumbbell, Save, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(settings);
      toast.success('System parameters updated');
    } catch (error) {
      toast.error('Sync failure');
    } finally {
      setLoading(false);
    }
  };

  const addPlan = () => {
    setSettings({
      ...settings,
      defaultPlans: [...settings.defaultPlans, { name: 'New Plan', months: 1, price: 0 }]
    });
  };

  const removePlan = (index: number) => {
    const newPlans = settings.defaultPlans.filter((_, i) => i !== index);
    setSettings({ ...settings, defaultPlans: newPlans });
  };

  const updatePlan = (index: number, field: keyof MembershipPlan, value: any) => {
    const newPlans = [...settings.defaultPlans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    setSettings({ ...settings, defaultPlans: newPlans });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in pb-12">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] text-onyx-tertiary uppercase">System Configuration</span>
          <h1 className="text-4xl font-display font-black text-onyx-on-surface tracking-tighter">Global Parameters</h1>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="px-10 py-5 bg-gradient-to-r from-onyx-primary to-[#78839c] text-onyx-on-primary rounded-full hover:scale-[1.02] active:scale-[0.98] transition-onyx shadow-xl shadow-onyx-primary/10 font-black text-xs uppercase tracking-widest flex items-center gap-3"
        >
          <Save className="w-5 h-5" />
          {loading ? 'SYNCING...' : 'SAVE SYSTEM STATE'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Core Branding */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-onyx-background flex items-center justify-center text-onyx-primary">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-black text-onyx-on-surface">Core Identity</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Facility Designation</label>
              <input 
                type="text" 
                value={settings.gymName} 
                onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-[0.2em] px-2">Fiscal Denomination</label>
              <input 
                type="text" 
                value={settings.currency} 
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary font-bold text-onyx-on-surface shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Plan Logic Architecture */}
        <div className="bg-onyx-surface rounded-[2rem] p-10 space-y-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-onyx-background flex items-center justify-center text-onyx-primary">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-black text-onyx-on-surface">Plan Logic</h3>
            </div>
            <button 
              type="button" 
              onClick={addPlan}
              className="p-3 bg-onyx-background text-onyx-tertiary rounded-xl hover:bg-onyx-surface-high transition-onyx shadow-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {settings.defaultPlans.map((plan, index) => (
              <div key={index} className="p-6 bg-onyx-background rounded-3xl space-y-4 group relative">
                <button 
                  type="button" 
                  onClick={() => removePlan(index)}
                  className="absolute top-4 right-4 p-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-onyx"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={plan.name} 
                    onChange={(e) => updatePlan(index, 'name', e.target.value)}
                    className="w-full bg-transparent border-none p-0 font-display font-black text-lg text-onyx-on-surface focus:ring-0"
                    placeholder="PLAN NAME"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-onyx-outline uppercase tracking-widest px-1">Months</label>
                      <input 
                        type="number" 
                        value={plan.months} 
                        onChange={(e) => updatePlan(index, 'months', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-onyx-surface rounded-xl border-none font-bold text-onyx-on-surface text-sm focus:ring-1 focus:ring-onyx-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-onyx-outline uppercase tracking-widest px-1">Fee</label>
                      <input 
                        type="number" 
                        value={plan.price} 
                        onChange={(e) => updatePlan(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 bg-onyx-surface rounded-xl border-none font-bold text-onyx-tertiary text-sm focus:ring-1 focus:ring-onyx-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
