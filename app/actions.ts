'use server';

import { 
  getMembers, 
  saveMembers, 
  generateMemberId, 
  getSettings, 
  saveSettings, 
  getPayments, 
  savePayments, 
  generatePaymentId 
} from '@/lib/fileDb';
import { supabase } from '@/lib/supabase';
import { calculateEndDate, calculateDue } from '@/lib/membership';
import { Member, Payment } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addMember(formData: FormData) {
  const settings = await getSettings();
  const planName = formData.get('membershipPlan') as string;
  const startDate = formData.get('membershipStart') as string;
  const totalFee = parseFloat(formData.get('totalFee') as string);
  const paidAmount = parseFloat(formData.get('paidAmount') as string);
  
  const endDate = calculateEndDate(planName, startDate, settings.defaultPlans);
  const dueAmount = calculateDue(totalFee, paidAmount);
  
  const id = await generateMemberId();
  const fullName = formData.get('fullName') as string;

  const newMember = {
    id,
    full_name: fullName,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    join_date: formData.get('joinDate') as string,
    membership_plan: planName,
    membership_start: startDate,
    membership_end: endDate,
    total_fee: totalFee,
    paid_amount: paidAmount,
    due_amount: dueAmount,
    status: 'active',
    notes: formData.get('notes') as string,
  };

  const { error } = await supabase.from('members').insert(newMember);
  if (error) throw error;

  if (paidAmount > 0) {
    await supabase.from('payments').insert({
      id: await generatePaymentId(),
      member_id: id,
      member_name: fullName,
      amount: paidAmount,
      payment_date: new Date().toISOString(),
      method: 'cash',
      note: 'Initial payment',
    });
  }

  revalidatePath('/members');
  revalidatePath('/dashboard');
  redirect('/members');
}

export async function addPayment(memberId: string, amount: number, method: string, note: string) {
  const { data: member, error: mError } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single();

  if (mError || !member) throw new Error('Member not found');

  const newPaidAmount = parseFloat(member.paid_amount) + amount;
  const newDueAmount = Math.max(0, parseFloat(member.total_fee) - newPaidAmount);

  await supabase
    .from('members')
    .update({ 
      paid_amount: newPaidAmount, 
      due_amount: newDueAmount,
      updated_at: new Date().toISOString() 
    })
    .eq('id', memberId);

  await supabase.from('payments').insert({
    id: await generatePaymentId(),
    member_id: memberId,
    member_name: member.full_name,
    amount: amount,
    payment_date: new Date().toISOString(),
    method,
    note,
  });

  revalidatePath('/members');
  revalidatePath(`/members/${memberId}`);
  revalidatePath('/payments');
  revalidatePath('/dashboard');
}

export async function renewMembership(memberId: string, planName: string, startDate: string, collectPayment: number, method: string) {
  const settings = await getSettings();
  const { data: member, error: mError } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single();

  if (mError || !member) throw new Error('Member not found');

  const plan = settings.defaultPlans.find(p => p.name === planName);
  const planPrice = plan ? plan.price : 0;
  const newEndDate = calculateEndDate(planName, startDate, settings.defaultPlans);
  
  const newTotalFee = parseFloat(member.total_fee) + planPrice;
  const newPaidAmount = parseFloat(member.paid_amount) + collectPayment;
  const newDueAmount = Math.max(0, newTotalFee - newPaidAmount);

  await supabase
    .from('members')
    .update({
      membership_plan: planName,
      membership_start: startDate,
      membership_end: newEndDate,
      total_fee: newTotalFee,
      paid_amount: newPaidAmount,
      due_amount: newDueAmount,
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('id', memberId);

  if (collectPayment > 0) {
    await supabase.from('payments').insert({
      id: await generatePaymentId(),
      member_id: memberId,
      member_name: member.full_name,
      amount: collectPayment,
      payment_date: new Date().toISOString(),
      method,
      note: 'Renewal payment',
    });
  }

  revalidatePath('/members');
  revalidatePath(`/members/${memberId}`);
  revalidatePath('/dashboard');
}

export async function updateSettings(formData: FormData) {
  const gymName = formData.get('gymName') as string;
  const currency = formData.get('currency') as string;
  
  const { error } = await supabase
    .from('settings')
    .upsert({
      id: 1,
      gym_name: gymName,
      currency: currency,
    });

  if (error) {
    console.error('Supabase Settings Error:', error);
    throw new Error(`Failed to update settings: ${error.message}`);
  }

  
  revalidatePath('/settings');
  revalidatePath('/');
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const settings = await getSettings();
  if (settings.adminPassword !== currentPassword) {
    throw new Error('Current password incorrect');
  }

  settings.adminPassword = newPassword;
  await saveSettings(settings);
  revalidatePath('/settings');
}


export async function deleteMember(memberId: string) {
  await supabase.from('members').delete().eq('id', memberId);
  revalidatePath('/members');
  revalidatePath('/dashboard');
  redirect('/members');
}

export async function deletePayment(paymentId: string, password?: string) {
  const settings = await getSettings();
  if (password && settings.adminPassword !== password) {
    throw new Error('Invalid admin password');
  }

  const { data: payment, error: pError } = await supabase

    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (pError || !payment) return;

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', payment.member_id)
    .single();

  if (member) {
    const newPaidAmount = parseFloat(member.paid_amount) - parseFloat(payment.amount);
    const newDueAmount = Math.max(0, parseFloat(member.total_fee) - newPaidAmount);
    
    await supabase
      .from('members')
      .update({ 
        paid_amount: newPaidAmount, 
        due_amount: newDueAmount 
      })
      .eq('id', payment.member_id);
  }

  await supabase.from('payments').delete().eq('id', paymentId);

  revalidatePath('/payments');
  revalidatePath('/members');
  if (payment.member_id) {
    revalidatePath(`/members/${payment.member_id}`);
  }
}
