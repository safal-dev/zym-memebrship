'use client';

import { Settings } from '@/types';
import { SettingsForm } from '@/components/SettingsForm';
import { PlanManager } from '@/components/PlanManager';
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  CreditCard, 
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface MobileSettingsViewProps {
  settings: Settings;
}

export function MobileSettingsView({ settings }: MobileSettingsViewProps) {
  return (
    <div className="md:hidden space-y-8 pb-20 animate-in">
      {/* 1. Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Gym Management & System</p>
      </div>

      {/* 2. General Settings Section */}
      <div className="space-y-4">
        <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">General Identity</h3>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm">
          <SettingsForm initialGymName={settings.gymName} initialCurrency={settings.currency} />
        </div>
      </div>

      {/* 3. Membership Plans Section */}
      <div className="space-y-4">
        <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Membership Architecture</h3>
        <PlanManager plans={settings.defaultPlans} currency={settings.currency} />
      </div>

      {/* 4. System Options */}
      <div className="space-y-2">
        <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">System & Security</h3>
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
          <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 border-b border-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900 text-sm">Security & Privacy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
          <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 border-b border-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900 text-sm">Subscription Plan</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
          <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900 text-sm">Support Center</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* 5. Logout */}
      <button className="w-full py-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3">
        <LogOut className="w-5 h-5" />
        Logout Session
      </button>

      <div className="text-center">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Version 1.0.4 • Kinetic Sanctuary UI</p>
      </div>
    </div>
  );
}
