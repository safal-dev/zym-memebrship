import { Member } from '@/types';

export function exportToCSV(members: Member[], filename: string = 'export.csv') {
  const headers = ['ID', 'Full Name', 'Phone', 'Address', 'Join Date', 'Plan', 'End Date', 'Total Fee', 'Paid Amount', 'Due Amount', 'Status'];
  const rows = members.map(m => [
    m.id,
    m.fullName,
    m.phone,
    m.address,
    m.joinDate,
    m.membershipPlan,
    m.membershipEnd,
    m.totalFee,
    m.paidAmount,
    m.dueAmount,
    m.status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Keep the old name as alias for compatibility
export const exportMembersToCSV = exportToCSV;
