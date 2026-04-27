'use client';

import { useState } from 'react';
import { Payment, Settings } from '@/types';
import { Search, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/membership';
import Link from 'next/link';
import { deletePayment } from '@/app/actions';
import { toast } from 'sonner';

export function PaymentTable({ payments, settings }: { payments: Payment[], settings: Settings }) {
  const [search, setSearch] = useState('');
  
  const filteredPayments = payments.filter(p => 
    p.memberName.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (paymentId: string) => {
    const password = window.prompt('Enter Admin Password to delete this payment:');
    if (password === null) return;
    
    if (!password) {
      return toast.error('Password is required');
    }

    try {
      await deletePayment(paymentId, password);
      toast.success('Payment deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete payment');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payments..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
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
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Transaction</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Member</th>
                <th className="px-6 py-4 font-bold">Method</th>
                <th className="px-6 py-4 font-bold text-right">Amount</th>
                <th className="px-6 py-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{format(new Date(p.paymentDate), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4">
                    <Link href={`/members/${p.memberId}`} className="text-blue-600 font-bold hover:underline text-sm">
                      {p.memberName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium capitalize">{p.method}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">
                    +{formatCurrency(p.amount, settings.currency)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete payment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredPayments.map((p) => (
            <div key={p.id} className="p-4 flex justify-between items-center group">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <Link href={`/members/${p.memberId}`} className="font-bold text-gray-900 block leading-tight mb-1">
                    {p.memberName}
                  </Link>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold uppercase tracking-tighter">
                    <span>{p.id}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(p.paymentDate), 'MMM dd')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-black text-emerald-600">+{formatCurrency(p.amount, settings.currency)}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{p.method}</p>
                </div>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center text-gray-500 font-medium">
            No payment records found.
          </div>
        )}
      </div>
    </div>
  );
}
