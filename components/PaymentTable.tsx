'use client';

import { useState } from 'react';
import { Payment, Settings } from '@/types';
import { Search, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/membership';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function PaymentTable({ payments, settings }: { payments: Payment[], settings: Settings }) {
  const [search, setSearch] = useState('');
  
  const filteredPayments = payments.filter(p => 
    p.memberName.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payments..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Transaction</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{format(new Date(p.paymentDate), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4">
                    <Link href={`/members/${p.memberId}`} className="text-blue-600 font-bold hover:underline text-sm">
                      {p.memberName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{p.method}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">
                    +{formatCurrency(p.amount, settings.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden space-y-3 px-2">
          {filteredPayments.map((p) => (
            <div key={p.id} className="p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex justify-between items-center active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <DollarSign className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <Link href={`/members/${p.memberId}`} className="font-black text-gray-900 block tracking-tight">
                    {p.memberName}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{format(new Date(p.paymentDate), 'MMM dd')}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{p.method}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-emerald-600 tracking-tight">
                  +{formatCurrency(p.amount, settings.currency)}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-0.5">Success</p>
              </div>
            </div>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No payments found.
          </div>
        )}
      </div>
    </div>
  );
}
