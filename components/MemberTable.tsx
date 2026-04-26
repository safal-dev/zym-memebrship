'use client';

import { useState } from 'react';
import { Member } from '@/types';
import Link from 'next/link';
import { Search, Plus, Download, Eye, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getMemberStatus } from '@/lib/membership';
import { exportMembersToCSV } from '@/lib/export-utils';

export function MemberTable({ initialMembers }: { initialMembers: Member[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredMembers = initialMembers.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search);
    const status = getMemberStatus(m.membershipEnd, m.dueAmount, m.status);
    
    if (filter === 'active') return matchesSearch && status === 'active';
    if (filter === 'expired') return matchesSearch && status === 'expired';
    if (filter === 'soon') return matchesSearch && status === 'soon';
    if (filter === 'due') return matchesSearch && m.dueAmount > 0;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['all', 'active', 'soon', 'expired', 'due'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                filter === f 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center px-1">
        <p className="text-sm text-gray-500 font-medium">
          Showing {filteredMembers.length} members
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => exportMembersToCSV(filteredMembers)}
            className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm"
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
          </button>
          <Link 
            href="/members/add" 
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 font-medium text-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Member</span>
          </Link>
        </div>
      </div>

      {/* Table / List View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Expiry</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Due</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((m) => {
                const status = getMemberStatus(m.membershipEnd, m.dueAmount, m.status);
                return (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                          {m.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{m.fullName}</p>
                          <p className="text-xs text-gray-500">{m.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{m.membershipPlan}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(m.membershipEnd), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        status === 'active' && "bg-emerald-50 text-emerald-600",
                        status === 'soon' && "bg-orange-50 text-orange-600",
                        status === 'expired' && "bg-rose-50 text-rose-600"
                      )}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {m.dueAmount > 0 ? (
                        <span className="text-rose-600 font-bold">{m.dueAmount} NPR</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Paid</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/members/${m.id}`} className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredMembers.map((m) => {
            const status = getMemberStatus(m.membershipEnd, m.dueAmount, m.status);
            return (
              <Link 
                key={m.id} 
                href={`/members/${m.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20">
                    {m.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{m.fullName}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn(
                        "text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded",
                        status === 'active' && "bg-emerald-100 text-emerald-700",
                        status === 'soon' && "bg-orange-100 text-orange-700",
                        status === 'expired' && "bg-rose-100 text-rose-700"
                      )}>
                        {status}
                      </span>
                      {m.dueAmount > 0 && (
                        <span className="text-[10px] font-bold text-rose-600">
                          {m.dueAmount} Due
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </Link>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-semibold">No members found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
