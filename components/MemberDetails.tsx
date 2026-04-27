'use client';

import { useState } from 'react';
import { Member, Payment, Settings } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { getMemberStatus, formatCurrency } from '@/lib/membership';
import { cn } from '@/lib/utils';
import { renewMembership, addPayment, deleteMember } from '@/app/actions';
import { Phone, MapPin, AlertCircle, CheckCircle, Trash2, Printer, ChevronLeft, CreditCard, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

import { MobileMemberProfileView } from './mobile/MobileMemberProfileView';

export function MemberDetails({ member, payments, settings }: { member: Member, payments: Payment[], settings: Settings }) {
  // ... existing state and handlers ...

  return (
    <>
      <MobileMemberProfileView 
        member={member} 
        payments={payments} 
        settings={settings}
        onRenew={() => setShowRenewModal(true)}
        onPay={() => setShowPaymentModal(true)}
        onDelete={handleDelete}
        onPrint={handlePrint}
      />

      <div className="hidden md:block space-y-6 animate-in">
        {/* Top Navigation */}
        <div className="flex items-center gap-4">
          <Link href="/members" className="p-2 bg-white rounded-xl border border-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Member Profile</h1>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 h-24 sm:h-32" />
          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-4xl">
                    {member.fullName.charAt(0)}
                  </div>
                </div>
                <div className="pb-1">
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">{member.fullName}</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{member.id}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setShowRenewModal(true)} className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-600/20">
                  RENEW
                </button>
                <button onClick={() => setShowPaymentModal(true)} className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm">
                  PAY
                </button>
                <button onClick={handleDelete} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <span className={cn(
                "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest",
                status === 'active' && "bg-emerald-100 text-emerald-700",
                status === 'soon' && "bg-orange-100 text-orange-700",
                status === 'expired' && "bg-rose-100 text-rose-700"
              )}>
                {status}
              </span>
              {member.dueAmount > 0 && (
                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest bg-rose-500 text-white shadow-md shadow-rose-500/20">
                  DUE: {formatCurrency(member.dueAmount, settings.currency)}
                </span>
              )}
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 uppercase tracking-widest">
                Joined {format(new Date(member.joinDate), 'MMM yyyy')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vital Info Cards */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <User className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest">Contact & Info</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                  <p className="font-bold text-gray-900">{member.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                  <p className="font-bold text-gray-900">{member.address || 'Not Provided'}</p>
                </div>
              </div>
            </div>

            {member.notes && (
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Internal Notes</p>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-xl">"{member.notes}"</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <Calendar className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest">Membership</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Plan</p>
                  <p className="font-black text-gray-900">{member.membershipPlan}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Remaining</p>
                  <p className={cn(
                    "font-black",
                    status === 'expired' ? 'text-rose-600' : 'text-blue-600'
                  )}>{status === 'expired' ? 'Expired' : `${remainingDays} Days`}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
                  <p className="font-bold text-gray-900">{format(new Date(member.membershipStart), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</p>
                  <p className="font-bold text-gray-900">{format(new Date(member.membershipEnd), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 text-gray-400 mb-2">
              <CreditCard className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest">Financials</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Total Revenue</span>
                <span className="font-bold text-gray-900">{formatCurrency(member.totalFee, settings.currency)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Amount Paid</span>
                <span className="font-bold text-emerald-600">{formatCurrency(member.paidAmount, settings.currency)}</span>
              </div>
              <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Current Due</span>
                <span className={cn(
                  "text-xl font-black",
                  member.dueAmount > 0 ? "text-rose-600" : "text-emerald-600"
                )}>{formatCurrency(member.dueAmount, settings.currency)}</span>
              </div>
              {member.dueAmount > 0 && (
                <button 
                  onClick={() => {
                    setPaymentAmount(member.dueAmount.toString());
                    setShowPaymentModal(true);
                  }}
                  className="w-full mt-2 py-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all font-black text-xs tracking-widest uppercase"
                >
                  Clear Outstanding
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Payment History Timeline */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Payment Timeline</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm italic">No records found</div>
            ) : (
              payments.map(p => (
                <div key={p.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{formatCurrency(p.amount, settings.currency)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{format(new Date(p.paymentDate), 'MMM dd, yyyy')} • {p.method}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePrint(p)}
                    className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals upgraded to Bottom Sheets on Mobile */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100] backdrop-blur-sm">
          <form onSubmit={handleRenew} className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden" />
            <h3 className="text-2xl font-black text-gray-900 mb-8">Renew Membership</h3>
            {/* ... form content ... */}
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Select Plan</label>
                <select 
                  value={renewPlan} 
                  onChange={(e) => {
                    const plan = settings.defaultPlans.find(p => p.name === e.target.value);
                    setRenewPlan(e.target.value);
                    if (plan) setRenewPayment(plan.price.toString());
                  }}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 font-black text-sm"
                >
                  {settings.defaultPlans.map(p => (
                    <option key={p.name} value={p.name}>{p.name} ({p.months} Month)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Payment ({settings.currency})</label>
                <input 
                  type="number" 
                  value={renewPayment} 
                  onChange={(e) => setRenewPayment(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 font-black text-sm"
                />
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-3">
              <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30">
                {loading ? 'Processing...' : 'Confirm Renewal'}
              </button>
              <button type="button" onClick={() => setShowRenewModal(false)} className="w-full py-4 bg-gray-50 text-gray-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[100] backdrop-blur-sm">
          <form onSubmit={handlePayment} className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden" />
            <h3 className="text-2xl font-black text-gray-900 mb-8">Record Payment</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Amount ({settings.currency})</label>
                <input 
                  required
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 font-black text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 font-black text-sm">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">Note</label>
                <input 
                  type="text" 
                  value={paymentNote} 
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 font-black text-sm"
                  placeholder="Payment for membership"
                />
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-3">
              <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/30">
                {loading ? 'Saving...' : 'Record Payment'}
              </button>
              <button type="button" onClick={() => setShowPaymentModal(false)} className="w-full py-4 bg-gray-50 text-gray-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
  );
}

function DollarSignIcon(props: any) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
