import { addMonths, format, isAfter, isBefore, differenceInDays } from 'date-fns';

export function calculateEndDate(planName: string, startDate: string, plans: { name: string, months: number }[]): string {
  const plan = plans.find(p => p.name === planName);
  const months = plan ? plan.months : 1; // default to 1 month if not found
  
  const end = addMonths(new Date(startDate), months);
  return format(end, 'yyyy-MM-dd');
}

export function calculateDue(totalFee: number, paidAmount: number): number {
  return Math.max(0, totalFee - paidAmount);
}

export function getMemberStatus(endDate: string, dueAmount: number, currentStatus?: string): 'active' | 'soon' | 'expired' | 'inactive' {
  if (currentStatus === 'inactive') return 'inactive';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  
  const daysDiff = differenceInDays(end, today);

  if (daysDiff < 0) {
    return 'expired';
  } else if (daysDiff <= 7) {
    return 'soon';
  }
  
  return 'active';
}

export function formatCurrency(amount: number, currency: string = 'NPR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
