import { getSettings } from '@/lib/fileDb';
import { updateSettings } from '@/app/actions';

import { PlanManager } from '@/components/PlanManager';
import { SettingsForm } from '@/components/SettingsForm';
import { MobileSettingsView } from '@/components/mobile/MobileSettingsView';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <MobileSettingsView settings={settings} />

      <div className="hidden md:block space-y-12 animate-in">
        <header>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Configuration</h1>
          <p className="text-gray-500 font-medium mt-1">Configure your gym identity and membership architecture</p>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-gray-400">
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">General Identity</h2>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <SettingsForm initialGymName={settings.gymName} initialCurrency={settings.currency} />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 text-gray-400">
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Membership Plans</h2>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <PlanManager plans={settings.defaultPlans} currency={settings.currency} />
        </section>
      </div>
    </>
  );
}
