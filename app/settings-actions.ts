'use server';

import { getSettings, saveSettings } from '@/lib/fileDb';
import { revalidatePath } from 'next/cache';
import { Settings } from '@/types';

export async function updateSettings(settings: Settings) {
  await saveSettings(settings);
  revalidatePath('/settings');
  revalidatePath('/dashboard');
  revalidatePath('/layout');
}

export async function addPlan(name: string, months: number, price: number) {
  const settings = await getSettings();
  settings.defaultPlans.push({ name, months, price });
  await saveSettings(settings);
  revalidatePath('/settings');
}

export async function removePlan(name: string) {
  const settings = await getSettings();
  settings.defaultPlans = settings.defaultPlans.filter(p => p.name !== name);
  await saveSettings(settings);
  revalidatePath('/settings');
}
