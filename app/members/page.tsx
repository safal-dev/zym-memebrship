import { getMembers } from '@/lib/fileDb';
import { MemberTable } from '@/components/MemberTable';

export default async function MembersPage() {
  const members = await getMembers();
  
  // Sort members by join date (newest first)
  const sortedMembers = [...members].sort((a, b) => 
    new Date(b.createdAt || b.joinDate).getTime() - new Date(a.createdAt || a.joinDate).getTime()
  );

  return (
    <div className="space-y-6">
      <MemberTable initialMembers={sortedMembers} />
    </div>
  );
}
