'use server';

import { getSettings, saveSettings } from '@/lib/fileDb';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addPlan(name: string, months: number, price: number) {
  const settings = await getSettings();
  settings.defaultPlans.push({ name, months, price });
  
  const { error } = await supabase
    .from('settings')
    .update({ default_plans: settings.defaultPlans })
    .eq('id', 1);

  if (error) throw error;
  
  revalidatePath('/settings');
}

export async function removePlan(name: string) {
  const settings = await getSettings();
  settings.defaultPlans = settings.defaultPlans.filter(p => p.name !== name);
  
  const { error } = await supabase
    .from('settings')
    .update({ default_plans: settings.defaultPlans })
    .eq('id', 1);

  if (error) throw error;
  
  revalidatePath('/settings');
}
