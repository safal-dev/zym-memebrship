'use server';

import { getMembers, saveMembers, generateMemberId, getSettings, saveSettings, getPayments, savePayments, generatePaymentId } from '@/lib/fileDb';
import { calculateEndDate, calculateDue } from '@/lib/membership';
import { Member, Payment } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addMember(formData: FormData) {
  const settings = await getSettings();
  const members = await getMembers();
  
  const planName = formData.get('membershipPlan') as string;
  const startDate = formData.get('membershipStart') as string;
  const totalFee = parseFloat(formData.get('totalFee') as string);
  const paidAmount = parseFloat(formData.get('paidAmount') as string);
  
  const endDate = calculateEndDate(planName, startDate, settings.defaultPlans);
  const dueAmount = calculateDue(totalFee, paidAmount);
  
  const newMember: Member = {
    id: await generateMemberId(),
    fullName: formData.get('fullName') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    photo: '',
    joinDate: formData.get('joinDate') as string,
    membershipPlan: planName,
    membershipStart: startDate,
    membershipEnd: endDate,
    totalFee,
    paidAmount,
    dueAmount,
    status: 'active',
    notes: formData.get('notes') as string,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  members.push(newMember);
  await saveMembers(members);

  if (paidAmount > 0) {
    const payments = await getPayments();
    payments.push({
      id: await generatePaymentId(),
      memberId: newMember.id,
      memberName: newMember.fullName,
      amount: paidAmount,
      paymentDate: newMember.joinDate,
      method: 'cash', // Default or from form
      note: 'Initial payment',
    });
    await savePayments(payments);
  }

  revalidatePath('/members');
  revalidatePath('/dashboard');
  redirect('/members');
}

export async function addPayment(memberId: string, amount: number, method: string, note: string) {
  const members = await getMembers();
  const memberIndex = members.findIndex(m => m.id === memberId);
  if (memberIndex === -1) throw new Error('Member not found');
  
  const member = members[memberIndex];
  member.paidAmount += amount;
  member.dueAmount = Math.max(0, member.totalFee - member.paidAmount);
  member.updatedAt = new Date().toISOString();
  
  await saveMembers(members);

  const payments = await getPayments();
  payments.push({
    id: await generatePaymentId(),
    memberId: member.id,
    memberName: member.fullName,
    amount,
    paymentDate: new Date().toISOString(),
    method,
    note,
  });
  await savePayments(payments);

  revalidatePath('/members');
  revalidatePath(`/members/${memberId}`);
  revalidatePath('/payments');
  revalidatePath('/dashboard');
}

export async function renewMembership(memberId: string, planName: string, startDate: string, collectPayment: number, method: string) {
  const settings = await getSettings();
  const members = await getMembers();
  
  const memberIndex = members.findIndex(m => m.id === memberId);
  if (memberIndex === -1) throw new Error('Member not found');
  
  const member = members[memberIndex];
  const plan = settings.defaultPlans.find(p => p.name === planName);
  const planPrice = plan ? plan.price : 0;
  
  const newEndDate = calculateEndDate(planName, startDate, settings.defaultPlans);
  
  member.membershipPlan = planName;
  member.membershipStart = startDate;
  member.membershipEnd = newEndDate;
  member.totalFee += planPrice;
  member.paidAmount += collectPayment;
  member.dueAmount = Math.max(0, member.totalFee - member.paidAmount);
  member.updatedAt = new Date().toISOString();
  member.status = 'active';

  await saveMembers(members);

  if (collectPayment > 0) {
    const payments = await getPayments();
    payments.push({
      id: await generatePaymentId(),
      memberId: member.id,
      memberName: member.fullName,
      amount: collectPayment,
      paymentDate: new Date().toISOString(),
      method,
      note: 'Renewal payment',
    });
    await savePayments(payments);
  }

  revalidatePath('/members');
  revalidatePath(`/members/${memberId}`);
  revalidatePath('/dashboard');
}

export async function updateSettings(formData: FormData) {
  const settings = await getSettings();
  settings.gymName = formData.get('gymName') as string;
  settings.currency = formData.get('currency') as string;
  
  await saveSettings(settings);
  revalidatePath('/settings');
  revalidatePath('/');
}

export async function deleteMember(memberId: string) {
  const members = await getMembers();
  const filtered = members.filter(m => m.id !== memberId);
  await saveMembers(filtered);
  
  revalidatePath('/members');
  revalidatePath('/dashboard');
  redirect('/members');
}
