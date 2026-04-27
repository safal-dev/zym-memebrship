'use server';

import { getSettings } from '@/lib/fileDb';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addPlan(name: string, months: number, price: number) {
  const settings = await getSettings();
  const updatedPlans = [...settings.defaultPlans, { name, months, price }];
  
  const { error } = await supabase
    .from('settings')
    .upsert({ 
      id: 1,
      default_plans: updatedPlans,
      gym_name: settings.gymName,
      currency: settings.currency
    });

  if (error) {
    console.error('Error adding plan:', error);
    throw new Error('Failed to save plan');
  }
  
  revalidatePath('/settings');
}

export async function removePlan(name: string) {
  const settings = await getSettings();
  const updatedPlans = settings.defaultPlans.filter(p => p.name !== name);
  
  const { error } = await supabase
    .from('settings')
    .upsert({ 
      id: 1,
      default_plans: updatedPlans,
      gym_name: settings.gymName,
      currency: settings.currency
    });

  if (error) {
    console.error('Error removing plan:', error);
    throw new Error('Failed to remove plan');
  }
  
  revalidatePath('/settings');
}
