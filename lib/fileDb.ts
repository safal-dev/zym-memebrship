import { supabase } from './supabase';
import { Member, Payment, Settings } from '@/types';

// Helper to map DB row to Member type
const mapMember = (row: any): Member => ({
  id: row.id,
  fullName: row.full_name,
  phone: row.phone,
  address: row.address,
  photo: row.photo,
  joinDate: row.join_date,
  membershipPlan: row.membership_plan,
  membershipStart: row.membership_start,
  membershipEnd: row.membership_end,
  totalFee: parseFloat(row.total_fee),
  paidAmount: parseFloat(row.paid_amount),
  dueAmount: parseFloat(row.due_amount),
  status: row.status,
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data.map(mapMember);
}

export async function saveMembers(members: Member[]): Promise<void> {
  // In Supabase, we usually upsert individual members, 
  // but for compatibility with the existing array-based logic:
  const rows = members.map(m => ({
    id: m.id,
    full_name: m.fullName,
    phone: m.phone,
    address: m.address,
    photo: m.photo,
    join_date: m.joinDate,
    membership_plan: m.membershipPlan,
    membership_start: m.membershipStart,
    membership_end: m.membershipEnd,
    total_fee: m.totalFee,
    paid_amount: m.paidAmount,
    due_amount: m.dueAmount,
    status: m.status,
    notes: m.notes,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('members').upsert(rows);
  if (error) throw error;
}

export async function getPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('payment_date', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  
  return data.map(p => ({
    id: p.id,
    memberId: p.member_id,
    memberName: p.member_name,
    amount: parseFloat(p.amount),
    paymentDate: p.payment_date,
    method: p.method,
    note: p.note,
  }));
}

export async function savePayments(payments: Payment[]): Promise<void> {
  const rows = payments.map(p => ({
    id: p.id,
    member_id: p.memberId,
    member_name: p.memberName,
    amount: p.amount,
    payment_date: p.paymentDate,
    method: p.method,
    note: p.note,
  }));

  const { error } = await supabase.from('payments').upsert(rows);
  if (error) throw error;
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
    // Return defaults if not found
    return {
      gymName: 'FitZone Gym',
      gymLogo: '',
      currency: 'NPR',
      defaultPlans: [
        { name: 'Monthly', months: 1, price: 3000 },
        { name: '3 Months', months: 3, price: 8000 },
        { name: '6 Months', months: 6, price: 15000 },
        { name: 'Yearly', months: 12, price: 28000 },
      ],
    };

  }

  return {
    gymName: data.gym_name,
    gymLogo: data.gym_logo,
    currency: data.currency,
    defaultPlans: data.default_plans,
    adminPassword: data.admin_password || 'admin123',
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({
      id: 1,
      gym_name: settings.gymName,
      gym_logo: settings.gymLogo,
      currency: settings.currency,
      default_plans: settings.defaultPlans,
      admin_password: settings.adminPassword,
    });


  if (error) throw error;
}

// IDs are handled by the app for now to maintain MB001 format
export async function generateMemberId(): Promise<string> {
  const members = await getMembers();
  if (members.length === 0) return 'MB001';
  const ids = members.map(m => parseInt(m.id.replace('MB', ''))).filter(n => !isNaN(n));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `MB${String(maxId + 1).padStart(3, '0')}`;
}

export async function generatePaymentId(): Promise<string> {
  const payments = await getPayments();
  if (payments.length === 0) return 'PAY001';
  const ids = payments.map(p => parseInt(p.id.replace('PAY', ''))).filter(n => !isNaN(n));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `PAY${String(maxId + 1).padStart(3, '0')}`;
}

// Special helpers for deletions since we were using array filtering
export async function deleteMemberFromDb(id: string) {
  const { error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
}

export async function deletePaymentFromDb(id: string) {
  const { error } = await supabase.from('payments').delete().eq('id', id);
  if (error) throw error;
}
