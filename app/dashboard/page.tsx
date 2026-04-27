import { getMembers, getPayments, getSettings } from '@/lib/fileDb';
import StatsCard from '@/components/StatsCard';
import { 
  Users, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  UserPlus,
  PointOfSale,
  Bell,
  ChevronRight,
  History,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const members = await getMembers();
  const payments = await getPayments();
  const settings = await getSettings();

  const activeMembers = members.filter(m => m.status === 'active' || m.status === 'soon');
  const soonExpiring = members.filter(m => m.status === 'soon');
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  
  // MTD Revenue (Simplified for demo)
  const mtdRevenue = totalRevenue; 
  const revenueGoal = 50000; // Example goal
  const revenuePercentage = Math.min(Math.round((mtdRevenue / revenueGoal) * 100), 100);

  const recentExpiries = members
    .filter(m => m.status === 'soon')
    .sort((a, b) => new Date(a.membershipEnd).getTime() - new Date(b.membershipEnd).getTime())
    .slice(0, 5);

  const recentPayments = payments
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Welcome & Quick Action Bar */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in">
        <div>
          <h1 className="text-[36px] font-black text-on-background mb-1">Overview</h1>
          <p className="text-sm text-on-surface-variant font-medium">Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link 
            href="/members/add"
            className="flex-1 md:flex-none h-12 rounded-full bg-primary text-white font-bold px-6 flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus className="w-5 h-5" />
            Add Member
          </Link>
          <Link 
            href="/members"
            className="flex-1 md:flex-none h-12 rounded-full bg-surface text-primary border border-surface-variant font-bold px-6 flex items-center justify-center gap-2 hover:bg-surface-variant/30 active:scale-95 transition-all"
          >
            <PointOfSale className="w-5 h-5" />
            Take Payment
          </Link>
        </div>
      </section>

      {/* Primary Stats Grid (GymConnect Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Active Members Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-variant/40 flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-[11px] font-bold tracking-[0.1em] text-on-surface-variant uppercase">Active Members</div>
              <Users className="w-6 h-6 text-on-surface-variant" />
            </div>
            <div className="text-[40px] font-black text-on-surface leading-none">{activeMembers.length}</div>
          </div>
          <div className="flex items-center gap-1.5 text-secondary font-bold text-sm mt-6">
            <TrendingUp className="w-4 h-4" />
            Stable growth
          </div>
        </div>

        {/* MTD Revenue Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-surface-variant/40 flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-[11px] font-bold tracking-[0.1em] text-on-surface-variant uppercase">Total Revenue</div>
              <CreditCard className="w-6 h-6 text-on-surface-variant" />
            </div>
            <div className="text-[40px] font-black text-on-surface leading-none">
              {formatCurrency(totalRevenue, settings.currency)}
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-surface-variant/50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000" 
                style={{ width: `${revenuePercentage}%` }}
              ></div>
            </div>
            <div className="text-on-surface-variant text-[13px] font-medium mt-3">{revenuePercentage}% of goal achieved</div>
          </div>
        </div>

        {/* Critical Expiries Card */}
        <Link 
          href="/expired"
          className="bg-red-50 rounded-[2rem] p-8 border border-red-100 flex flex-col justify-between min-h-[200px] cursor-pointer hover:bg-red-100/50 transition-colors group"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="text-[11px] font-bold tracking-[0.1em] text-red-600 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Critical Expiries
              </div>
            </div>
            <div className="text-[40px] font-black text-red-600 leading-none">{soonExpiring.length}</div>
          </div>
          <div className="text-[13px] text-red-600/80 font-medium mt-6">
            Expiring in &lt; 7 days
          </div>
        </Link>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Needs Attention Feed */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end pb-3 border-b border-surface-variant/40">
            <h2 className="text-xl font-bold text-on-surface">Needs Attention</h2>
            <Link href="/expired" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            {recentExpiries.length > 0 ? (
              recentExpiries.map((member) => (
                <Link 
                  key={member.id}
                  href={`/members/${member.id}`}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-surface-variant/40 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm">
                      {member.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface">{member.fullName}</h3>
                      <p className="text-[13px] text-red-600 flex items-center gap-1 mt-0.5">
                        <History className="w-3.5 h-3.5" />
                        Expires {new Date(member.membershipEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </Link>
              ))
            ) : (
              <div className="text-center py-10 text-on-surface-variant bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
                No urgent expiries. Well done!
              </div>
            )}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end pb-3 border-b border-surface-variant/40">
            <h2 className="text-xl font-bold text-on-surface">Recent Transactions</h2>
            <Link href="/payments" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-variant/40">
            <div className="flex flex-col gap-6">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-on-surface">{payment.memberName}</p>
                          <p className="text-[13px] text-on-surface-variant mt-0.5">Payment Received</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">+{formatCurrency(payment.amount, settings.currency)}</p>
                          <p className="text-[11px] text-on-surface-variant font-bold mt-1 uppercase">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-on-surface-variant">
                  No recent transactions found.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
