import { getMembers, getPayments, getSettings } from '@/lib/fileDb';
import { MemberDetails } from '@/components/MemberDetails';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function MemberDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const members = await getMembers();
  const member = members.find(m => m.id === id);
  
  if (!member) {
    notFound();
  }

  const allPayments = await getPayments();
  const memberPayments = allPayments.filter(p => p.memberId === id).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <Link href="/members" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </Link>
      </div>

      <MemberDetails member={member} payments={memberPayments} settings={settings} />
    </div>
  );
}
