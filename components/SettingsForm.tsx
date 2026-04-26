'use client';

import { useState } from 'react';
import { updateSettings } from '@/app/actions';
import { toast } from 'sonner';

interface SettingsFormProps {
  initialGymName: string;
  initialCurrency: string;
}

export function SettingsForm({ initialGymName, initialCurrency }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await updateSettings(formData);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label>
          <input 
            name="gymName"
            defaultValue={initialGymName}
            required
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
          <input 
            name="currency"
            defaultValue={initialCurrency}
            required
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-sm disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save General Info'}
          </button>
        </div>
      </div>
    </form>
  );
}
