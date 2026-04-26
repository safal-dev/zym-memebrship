import { getSettings } from '@/lib/fileDb';
import { updateSettings } from '@/app/actions';

import { PlanManager } from '@/components/PlanManager';
import { SettingsForm } from '@/components/SettingsForm';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
        
        <SettingsForm initialGymName={settings.gymName} initialCurrency={settings.currency} />
          
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Plans</h3>
          <PlanManager plans={settings.defaultPlans} currency={settings.currency} />
        </div>
      </div>
    </div>
  );
}
