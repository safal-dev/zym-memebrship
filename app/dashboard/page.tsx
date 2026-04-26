import { getMembers, getPayments, getSettings } from '@/lib/fileDb';
import { getMemberStatus, formatCurrency } from '@/lib/membership';
import { StatsCard } from '@/components/StatsCard';
import { Users, Activity, AlertCircle, CreditCard, DollarSign, UserPlus, ArrowUpRight, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { format, isThisMonth } from 'date-fns';

export default async function DashboardPage() {
  const members = await getMembers();
  const payments = await getPayments();
  const settings = await getSettings();

  // Stats calculation
  const totalMembers = members.length;
  
  const membersWithStatus = members.map(m => ({
    ...m,
    computedStatus: getMemberStatus(m.membershipEnd, m.dueAmount, m.status)
  }));

  const activeMembers = membersWithStatus.filter(m => m.computedStatus === 'active').length;
  const expiredMembers = membersWithStatus.filter(m => m.computedStatus === 'expired').length;
  const soonMembers = membersWithStatus.filter(m => m.computedStatus === 'soon');
  
  const duePaymentsCount = members.filter(m => m.dueAmount > 0).length;
  
  const revenueThisMonth = payments
    .filter(p => isThisMonth(new Date(p.paymentDate)))
    .reduce((sum, p) => sum + p.amount, 0);

  const newMembersThisMonth = members.filter(m => isThisMonth(new Date(m.joinDate))).length;

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in">
      {/* Header & Quick Actions */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium">Monitoring {settings.gymName}</p>
        </div>
        
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3">
          <Link href="/members/add" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-sm font-bold text-center">
            <UserPlus className="w-4 h-4" /> <span className="truncate">Add Member</span>
          </Link>
          <Link href="/payments" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all shadow-sm text-sm font-bold text-center">
            <DollarSign className="w-4 h-4" /> <span className="truncate">Payments</span>
          </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard title="Active Members" value={activeMembers} icon={Activity} color="green" />
        <StatsCard title="Revenue (MTD)" value={formatCurrency(revenueThisMonth, settings.currency)} icon={TrendingUp} color="purple" />
        <StatsCard title="Expiring Soon" value={soonMembers.length} icon={AlertCircle} color="orange" />
      </div>

      {/* Secondary Stats (Horizontal on Desktop, Grid on Mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
          <p className="text-xl font-black text-gray-900">{totalMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Expired</p>
          <p className="text-xl font-black text-rose-600">{expiredMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Due</p>
          <p className="text-xl font-black text-orange-600">{duePaymentsCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">New</p>
          <p className="text-xl font-black text-blue-600">{newMembersThisMonth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Soon */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-gray-900">Critical Expiries</h3>
            <Link href="/expired" className="text-xs font-bold text-blue-600 flex items-center gap-1">
              VIEW ALL <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {soonMembers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm italic">
                No immediate expiries
              </div>
            ) : (
              soonMembers.slice(0, 5).map(m => (
                <Link key={m.id} href={`/members/${m.id}`} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {m.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{m.fullName}</p>
                      <p className="text-[11px] text-orange-600 font-bold uppercase">Ends {format(new Date(m.membershipEnd), 'MMM dd')}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-gray-900">Recent Revenue</h3>
            <Link href="/payments" className="text-xs font-bold text-blue-600 flex items-center gap-1">
              HISTORY <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPayments.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm italic">
                No recent activity
              </div>
            ) : (
              recentPayments.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.memberName}</p>
                      <p className="text-[11px] text-gray-500 font-medium uppercase">{format(new Date(p.paymentDate), 'MMM dd')} • {p.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-600 text-sm">+{formatCurrency(p.amount, settings.currency)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
