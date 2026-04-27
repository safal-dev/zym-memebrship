'use server';

import { supabase } from '@/lib/supabase';
import { Gym } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getAllGyms(): Promise<Gym[]> {
  const { data, error } = await supabase
    .from('gyms')
    .select(`
      *,
      members:members(count),
      payments:payments(sum:amount)
    `);

  if (error) {
    console.error('Error fetching gyms:', error);
    return [];
  }

  return data.map((g: any) => ({
    id: g.id,
    name: g.name,
    ownerEmail: g.owner_email,
    planName: g.plan_name,
    status: g.status,
    createdAt: g.created_at,
    expiryDate: g.expiry_date,
    totalMembers: g.members?.[0]?.count || 0,
    totalRevenue: g.payments?.[0]?.sum || 0,
  }));
}

export async function createGym(name: string, email: string, plan: string) {
  const expiryDate = new Date();
  if (plan === 'Free Trial') expiryDate.setMonth(expiryDate.getMonth() + 1);
  else expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const { error } = await supabase
    .from('gyms')
    .insert({
      name,
      owner_email: email,
      plan_name: plan,
      expiry_date: expiryDate.toISOString(),
      status: 'active',
      admin_password: 'admin123' // Default password for new gyms
    });

  if (error) throw error;
  revalidatePath('/super-admin');
}

export async function updateGymStatus(gymId: string, status: 'active' | 'suspended') {
  const { error } = await supabase
    .from('gyms')
    .update({ status })
    .eq('id', gymId);

  if (error) throw error;
  revalidatePath('/super-admin');
}

export async function deleteGym(gymId: string) {
  // In a real SaaS, we would cascade delete or archive
  const { error } = await supabase
    .from('gyms')
    .delete()
    .eq('id', gymId);

  if (error) throw error;
  revalidatePath('/super-admin');
}
