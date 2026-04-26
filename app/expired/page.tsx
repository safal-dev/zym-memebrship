import { getMembers } from '@/lib/fileDb';
import { getMemberStatus } from '@/lib/membership';
import { MemberTable } from '@/components/MemberTable';

export default async function ExpiredPage() {
  const members = await getMembers();
  
  const relevantMembers = members.filter(m => {
    const status = getMemberStatus(m.membershipEnd, m.dueAmount, m.status);
    return status === 'expired' || status === 'soon';
  });

  const sortedMembers = [...relevantMembers].sort((a, b) => 
    new Date(a.membershipEnd).getTime() - new Date(b.membershipEnd).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-6">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-rose-500"></div>
          <span className="text-sm font-medium text-gray-700">Expired</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <span className="text-sm font-medium text-gray-700">Expiring Soon (≤ 7 days)</span>
        </div>
      </div>
      
      <MemberTable initialMembers={sortedMembers} />
    </div>
  );
}
