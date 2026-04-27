import { getMembers, getPayments, getSettings } from '@/lib/fileDb';
import { getMemberStatus, formatCurrency } from '@/lib/membership';
import { StatsCard } from '@/components/StatsCard';
import { Users, Activity, AlertCircle, TrendingUp, ChevronRight, UserPlus, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { format, isThisMonth } from 'date-fns';

export default async function DashboardPage() {
  const members = await getMembers();
  const payments = await getPayments();
  const settings = await getSettings();

  // Stats calculation
  const membersWithStatus = members.map(m => ({
    ...m,
    computedStatus: getMemberStatus(m.membershipEnd, m.dueAmount, m.status)
  }));

  const activeMembers = membersWithStatus.filter(m => m.computedStatus === 'active').length;
  const soonMembers = membersWithStatus.filter(m => m.computedStatus === 'soon');
  
  const revenueThisMonth = payments
    .filter(p => isThisMonth(new Date(p.paymentDate)))
    .reduce((sum, p) => sum + p.amount, 0);

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] text-onyx-tertiary uppercase">Performance Metrics</span>
          <h1 className="text-4xl md:text-5xl font-display font-black text-onyx-on-surface tracking-tighter">
            The Kinetic <br className="hidden md:block" /> Sanctuary Overview
          </h1>
          <p className="text-onyx-on-surface-variant font-medium max-w-md">
            Real-time management for {settings.gymName}. Balancing energy with clinical precision.
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Link href="/members/add" className="flex-1 md:flex-none group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-onyx-primary to-[#78839c] text-onyx-on-primary rounded-full hover:scale-[1.02] active:scale-[0.98] transition-onyx shadow-xl shadow-onyx-primary/10">
            <UserPlus className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Enroll Member</span>
          </Link>
          <Link href="/payments" className="p-4 bg-onyx-surface text-onyx-on-surface rounded-2xl hover:bg-onyx-surface-high transition-onyx shadow-lg">
            <DollarSign className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Personnel Capacity" value={members.length} icon={Users} color="blue" />
        <StatsCard title="Active Pulse" value={activeMembers} icon={Activity} color="green" />
        <StatsCard title="Revenue Stream (MTD)" value={formatCurrency(revenueThisMonth, settings.currency)} icon={TrendingUp} color="purple" />
      </div>

      {/* Secondary Metrics / Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Critical Alerts / Expiries */}
        <div className="bg-onyx-surface rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.2em] text-rose-400 uppercase">Action Required</span>
              <h3 className="text-2xl font-display font-black text-onyx-on-surface">Critical Expiries</h3>
            </div>
            <Link href="/expired" className="p-3 bg-onyx-background text-onyx-on-surface-variant hover:text-onyx-tertiary rounded-2xl transition-onyx">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {soonMembers.length === 0 ? (
              <div className="py-12 text-center text-onyx-on-surface-variant italic text-sm">
                System clear. No immediate expiries detected.
              </div>
            ) : (
              soonMembers.slice(0, 4).map(m => (
                <Link key={m.id} href={`/members/${m.id}`} className="flex justify-between items-center p-5 bg-onyx-background/50 hover:bg-onyx-background rounded-3xl transition-onyx group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-onyx-surface-highest flex items-center justify-center text-rose-400 font-black">
                      {m.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-display font-bold text-onyx-on-surface">{m.fullName}</p>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Ends {format(new Date(m.membershipEnd), 'MMM dd')}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-onyx-outline transition-onyx group-hover:translate-x-1 group-hover:text-onyx-on-surface" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Financial Flow */}
        <div className="bg-onyx-surface rounded-[2rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-[0.2em] text-onyx-tertiary uppercase">Financial Inflow</span>
              <h3 className="text-2xl font-display font-black text-onyx-on-surface">Recent Revenue</h3>
            </div>
            <Link href="/payments" className="p-3 bg-onyx-background text-onyx-on-surface-variant hover:text-onyx-tertiary rounded-2xl transition-onyx">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentPayments.length === 0 ? (
              <div className="py-12 text-center text-onyx-on-surface-variant italic text-sm">
                No financial activity recorded today.
              </div>
            ) : (
              recentPayments.map(p => (
                <div key={p.id} className="flex justify-between items-center p-5 bg-onyx-background/50 rounded-3xl border border-transparent hover:border-onyx-outline/10 transition-onyx">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-onyx-primary-container flex items-center justify-center text-onyx-tertiary font-black shadow-inner">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-onyx-on-surface">{p.memberName}</p>
                      <p className="text-[10px] font-black text-onyx-on-surface-variant uppercase tracking-wider">{format(new Date(p.paymentDate), 'MMM dd')} • {p.method}</p>
                    </div>
                  </div>
                  <p className="text-lg font-display font-black text-onyx-tertiary">
                    +{formatCurrency(p.amount, settings.currency)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
