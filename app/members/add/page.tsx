import { getSettings } from '@/lib/fileDb';
import { MemberForm } from '@/components/MemberForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AddMemberPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link href="/members" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Member</h1>
        <p className="text-gray-500 mt-1">Register a new gym member and set up their membership plan.</p>
      </div>

      <MemberForm settings={settings} />
    </div>
  );
}
