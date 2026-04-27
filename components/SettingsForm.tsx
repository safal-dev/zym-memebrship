'use client';

import { useState } from 'react';
import { updateSettings, changePassword } from '@/app/actions';
import { toast } from 'sonner';
import { Shield, Lock } from 'lucide-react';

interface SettingsFormProps {
  initialGymName: string;
  initialCurrency: string;
}

export function SettingsForm({ initialGymName, initialCurrency }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  async function handleGeneralSubmit(formData: FormData) {
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

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const current = formData.get('currentPassword') as string;
    const newPass = formData.get('newPassword') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (newPass !== confirm) {
      return toast.error('New passwords do not match');
    }

    setPassLoading(true);
    try {
      await changePassword(current, newPass);
      toast.success('Password updated successfully');
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* General Settings */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">General Information</h2>
        </div>
        
        <form action={handleGeneralSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase tracking-wider font-bold">Gym Name</label>
              <input 
                name="gymName"
                defaultValue={initialGymName}
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase tracking-wider font-bold">Currency Symbol</label>
              <input 
                name="currency"
                defaultValue={initialCurrency}
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all" 
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm disabled:opacity-70 shadow-lg shadow-blue-200"
            >
              {loading ? 'Saving...' : 'Update General Info'}
            </button>
          </div>
        </form>
      </section>

      {/* Security Settings */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Security & Password</h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase tracking-wider font-bold">Current Password</label>
              <input 
                name="currentPassword"
                required
                type="password" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase tracking-wider font-bold">New Password</label>
              <input 
                name="newPassword"
                required
                type="password" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-[11px] uppercase tracking-wider font-bold">Confirm Password</label>
              <input 
                name="confirmPassword"
                required
                type="password" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all" 
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button 
              type="submit" 
              disabled={passLoading}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all font-semibold text-sm disabled:opacity-70 shadow-lg shadow-amber-200"
            >
              {passLoading ? 'Updating...' : 'Change Admin Password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
