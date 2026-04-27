'use client';

import { Member, Payment, Settings } from '@/types';
import { formatCurrency } from '@/lib/membership';
import { format } from 'date-fns';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  Bell, 
  ArrowUpRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MobileDashboardViewProps {
  members: any[];
  payments: Payment[];
  settings: Settings;
  stats: {
    active: number;
    expired: number;
    soon: any[];
    revenue: number;
    newThisMonth: number;
  };
}

export function MobileDashboardView({ members, payments, settings, stats }: MobileDashboardViewProps) {
  return (
    <div className="md:hidden space-y-8 pb-12 animate-in">
      {/* 1. Brand Header */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <span className="font-black text-xl">A</span>
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Good Morning</h2>
            <p className="text-xl font-black text-gray-900 tracking-tight">Admin Master</p>
          </div>
        </div>
        <button className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-gray-500 relative">
          <Bell className="w-6 h-6" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
        </button>
      </div>

      {/* 2. Membership Pulse (Main Stats) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 glass-dark p-6 rounded-[2.5rem] flex items-center justify-between overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Active Pulse</p>
            <h3 className="text-4xl font-black text-white">{stats.active}</h3>
            <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> +12% from last week
            </div>
          </div>
          <div className="w-24 h-24 rounded-full border-[8px] border-emerald-400/20 flex items-center justify-center relative z-10">
             <div className="w-24 h-24 rounded-full border-[8px] border-emerald-400 border-t-transparent animate-spin-slow absolute" />
             <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/40 transition-all duration-700" />
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Total</p>
          <p className="text-2xl font-black text-gray-900">{members.length}</p>
        </div>

        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Expiries</p>
          <p className="text-2xl font-black text-gray-900">{stats.soon.length}</p>
        </div>
      </div>

      {/* 3. Needs Attention (Swipeable Cards) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Needs Attention</h3>
          <Link href="/members" className="text-xs font-bold text-blue-600 uppercase tracking-widest">View All</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {stats.soon.length === 0 ? (
            <div className="w-full glass p-8 rounded-3xl text-center text-gray-400 italic font-medium">
              Everyone is currently active!
            </div>
          ) : (
            stats.soon.map(m => (
              <Link 
                key={m.id} 
                href={`/members/${m.id}`}
                className="min-w-[280px] bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-lg shadow-gray-200/40"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-black">
                    {m.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{m.fullName}</h4>
                    <p className="text-xs text-gray-500 font-medium">Membership ID: {m.id}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expires In</p>
                    <p className="text-rose-600 font-black">
                      {Math.ceil((new Date(m.membershipEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/20">
                    RENEW
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* 4. Quick Actions FAB Area */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/members/add" className="flex items-center justify-center gap-3 p-5 bg-gray-900 text-white rounded-3xl shadow-xl hover:scale-[0.98] active:scale-95 transition-all">
          <UserPlus className="w-5 h-5 text-blue-400" />
          <span className="font-black text-sm uppercase tracking-wider">Add New</span>
        </Link>
        <Link href="/payments" className="flex items-center justify-center gap-3 p-5 glass border-gray-200 text-gray-900 rounded-3xl hover:scale-[0.98] active:scale-95 transition-all">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <span className="font-black text-sm uppercase tracking-wider">Revenue</span>
        </Link>
      </div>

      {/* 5. Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Recent Activity</h3>
          <ArrowUpRight className="w-5 h-5 text-gray-300" />
        </div>
        <div className="space-y-3">
          {payments.slice(0, 3).map(p => (
            <div key={p.id} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{p.memberName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{format(new Date(p.paymentDate), 'MMM dd')} • {p.method}</p>
                </div>
              </div>
              <p className="font-black text-emerald-600">
                +{formatCurrency(p.amount, settings.currency)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
