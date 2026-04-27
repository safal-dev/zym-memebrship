'use client';

import { Member, Payment, Settings } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { getMemberStatus, formatCurrency } from '@/lib/membership';
import { cn } from '@/lib/utils';
import { 
  Phone, 
  MapPin, 
  ChevronLeft, 
  CreditCard, 
  Calendar, 
  User, 
  Activity,
  Trash2,
  Printer,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface MobileMemberProfileViewProps {
  member: Member;
  payments: Payment[];
  settings: Settings;
  onRenew: () => void;
  onPay: () => void;
  onDelete: () => void;
  onPrint: (p: Payment) => void;
}

export function MobileMemberProfileView({ 
  member, 
  payments, 
  settings, 
  onRenew, 
  onPay, 
  onDelete, 
  onPrint 
}: MobileMemberProfileViewProps) {
  const status = getMemberStatus(member.membershipEnd, member.dueAmount, member.status);
  const remainingDays = differenceInDays(new Date(member.membershipEnd), new Date());

  return (
    <div className="md:hidden animate-in space-y-6 pb-20">
      {/* 1. Sticky Header */}
      <div className="flex items-center justify-between sticky top-0 z-20 glass py-3 px-1 -mx-1 mb-4">
        <Link href="/members" className="w-10 h-10 flex items-center justify-center text-gray-900">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Member Detail</h2>
        <button onClick={onDelete} className="w-10 h-10 flex items-center justify-center text-rose-500">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Hero Profile Card */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-blue-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-600/30">
            {member.fullName.charAt(0)}
          </div>
          <div className={cn(
            "absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg",
            status === 'active' ? "bg-emerald-500" : "bg-rose-500"
          )}>
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{member.fullName}</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {member.id}</p>
        </div>
      </div>

      {/* 3. Vital Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Remaining</p>
          <p className={cn(
            "text-3xl font-black",
            remainingDays < 0 ? "text-rose-600" : "text-blue-600"
          )}>
            {remainingDays < 0 ? 'Exp' : remainingDays}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Days</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Due</p>
          <p className={cn(
            "text-3xl font-black",
            member.dueAmount > 0 ? "text-rose-600" : "text-emerald-600"
          )}>
            {member.dueAmount}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{settings.currency}</p>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={onRenew}
          className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
        >
          Renew Plan
        </button>
        <button 
          onClick={onPay}
          className="flex-1 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/30 active:scale-95 transition-all"
        >
          Pay Due
        </button>
      </div>

      {/* 5. Contact & Plan Details */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
            <p className="font-bold text-gray-900">{member.phone}</p>
          </div>
          <a href={`tel:${member.phone}`} className="ml-auto w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan</p>
            <p className="font-bold text-gray-900">{member.membershipPlan}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Date</p>
            <p className="font-bold text-gray-900 text-sm">{format(new Date(member.membershipStart), 'MMM dd, yyyy')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Date</p>
            <p className="font-bold text-gray-900 text-sm">{format(new Date(member.membershipEnd), 'MMM dd, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* 6. Payment History */}
      <div>
        <div className="flex justify-between items-center px-4 mb-4">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Payment Timeline</h3>
          <ArrowUpRight className="w-5 h-5 text-gray-300" />
        </div>
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="p-8 text-center glass rounded-3xl text-gray-400 italic font-medium">No payment history found.</div>
          ) : (
            payments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(p.amount, settings.currency)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{format(new Date(p.paymentDate), 'MMM dd')} • {p.method}</p>
                  </div>
                </div>
                <button onClick={() => onPrint(p)} className="p-2 text-gray-300 active:text-blue-600 transition-colors">
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowUpRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
