'use client';

import { useState } from 'react';
import { Payment, Settings } from '@/types';
import { Search, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
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
    <div className="space-y-8 animate-in">
      {/* Editorial Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] text-onyx-tertiary uppercase">Financial Timeline</span>
          <h1 className="text-4xl font-display font-black text-onyx-on-surface tracking-tighter">Revenue History</h1>
        </div>
      </div>

      <div className="bg-onyx-surface p-4 rounded-[1.5rem] shadow-sm relative overflow-hidden">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-onyx-on-surface-variant w-5 h-5" />
          <input
            type="text"
            placeholder="Filter transactions..."
            className="w-full pl-14 pr-6 py-4 bg-onyx-background border-none rounded-2xl focus:ring-2 focus:ring-onyx-primary transition-onyx text-sm font-medium placeholder:text-onyx-outline shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-onyx-surface rounded-[2rem] shadow-sm border-none overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-onyx-outline text-[10px] font-black uppercase tracking-[0.2em] border-b border-onyx-outline/5">
                <th className="px-8 py-6">Trace ID</th>
                <th className="px-8 py-6">Entity</th>
                <th className="px-8 py-6">Schedule</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6 text-right">Inflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-onyx-outline/5">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-onyx-background/40 transition-onyx group">
                  <td className="px-8 py-6 text-xs font-black text-onyx-on-surface-variant uppercase tracking-wider">{p.id}</td>
                  <td className="px-8 py-6">
                    <Link href={`/members/${p.memberId}`} className="flex items-center gap-2 group/link">
                      <span className="font-display font-black text-onyx-on-surface group-hover/link:text-onyx-tertiary transition-onyx">{p.memberName}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-onyx text-onyx-tertiary" />
                    </Link>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-onyx-on-surface-variant">
                    {format(new Date(p.paymentDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-onyx-background rounded-lg text-[10px] font-black uppercase tracking-widest text-onyx-outline group-hover:text-onyx-primary transition-onyx">
                      {p.method}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-lg font-display font-black text-onyx-tertiary">
                      +{formatCurrency(p.amount, settings.currency)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-20 text-center text-onyx-on-surface-variant italic font-display">
            No records found in this view.
          </div>
        )}
      </div>
    </div>
  );
}
